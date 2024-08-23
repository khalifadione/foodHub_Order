package main

import (
	"database/sql"
	"encoding/json"
	"foodhubback/administrateur"
	"foodhubback/connexionClient"
	"foodhubback/connexionRestaurateur"
	_ "github.com/go-sql-driver/mysql"
	"github.com/gorilla/mux"
	"github.com/gorilla/websocket"
	"github.com/rs/cors"
	"log"
	"net/http"
)

// User struct pour stocker les données de l'utilisateur
/*type User struct {
	ID          int    `json:"id"`
	Prenom      string `json:"prenom"`
	Nom         string `json:"nom"`
	CodePostal  string `json:"codePostal"`
	Identifiant string `json:"identifiant"`
	MotDePasse  string `json:"motDePasse"`
}*/

var db *sql.DB

func main() {
	var err error

	// Connexion à la base de données MySQL
	db, err = sql.Open("mysql", "root:YourPasswordMySQL@tcp(127.0.0.1:3306)/inscriptionclient")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	// Initialise le routeur
	r := mux.NewRouter()

	// Gestion des autorisations CORS
	corsHandler := cors.New(cors.Options{
		AllowedOrigins: []string{"*"},
		AllowedMethods: []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders: []string{"Content-Type"},
		Debug:          true,
	}).Handler

	// Routes

	//Server client
	r.HandleFunc("/inscription", func(w http.ResponseWriter, r *http.Request) {
		connexionClient.InscriptionUtilisateur(w, r, db)
	}).Methods("POST")

	r.HandleFunc("/login-client", func(w http.ResponseWriter, r *http.Request) {
		connexionClient.HandleLoginClient(w, r, db)
	}).Methods("POST")

	//Server Restaurateur
	r.HandleFunc("/inscriptionrestaurateur", func(w http.ResponseWriter, r *http.Request) {
		connexionRestaurateur.InscriptionRestaurateur(w, r, db)
	}).Methods("POST")
	r.HandleFunc("/login-restaurateur", func(w http.ResponseWriter, r *http.Request) {
		connexionRestaurateur.HandleLoginRestaurateur(w, r, db)
	}).Methods("POST")

	r.HandleFunc("/donneerestaurateurs", func(w http.ResponseWriter, r *http.Request) {
		connexionRestaurateur.GetRestaurateurs(w, r, db)
	}).Methods("GET")
	r.HandleFunc("/donneeclients", func(w http.ResponseWriter, r *http.Request) {
		connexionClient.GetClient(w, r, db)
	}).Methods("GET")

	//admin server
	//HandleLoginAdmin
	r.HandleFunc("/login-administrateur", func(w http.ResponseWriter, r *http.Request) {
		administrateur.HandleLoginAdmin(w, r, db)
	}).Methods("POST")
	r.HandleFunc("/clients", func(w http.ResponseWriter, r *http.Request) {
		administrateur.RechercherClients(w, r, db)
	})
	r.HandleFunc("/delete", func(w http.ResponseWriter, r *http.Request) {
		administrateur.DeleteHandler(w, r, db)
	})

	// Ajout du point de terminaison WebSocket
	r.HandleFunc("/ws", wsHandler)

	// Utilisez corsHandler comme gestionnaire principal des requêtes
	http.Handle("/", corsHandler(r))

	// Lance le serveur
	log.Println("Starting the server...")
	log.Fatal(http.ListenAndServe(":8080", nil))
}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

var clients = make(map[*websocket.Conn]bool)

// WebSocketMessage structure pour représenter les messages WebSocket
type WebSocketMessage struct {
	SenderType  string `json:"sender_type"`
	SenderID    string `json:"sender_id"`
	ReceiverID  string `json:"receiver_id"`
	MessageType string `json:"message_type"`
	Content     string `json:"content"`
}

func wsHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}
	defer conn.Close()

	// Récupérer l'identifiant du client ou du restaurateur à partir des paramètres de la requête
	params := r.URL.Query()
	senderID := params.Get("senderID")
	senderType := params.Get("senderType")
	receiverID := params.Get("receiverID")

	message := WebSocketMessage{
		SenderType: senderType,
		SenderID:   senderID,
		ReceiverID: receiverID, // Ajoutez receiverID à la structure du message
	}

	// Convertir la structure en JSON et l'envoyer au client
	jsonMessage, _ := json.Marshal(message)
	conn.WriteMessage(websocket.TextMessage, jsonMessage)

	// Ajouter la connexion à la liste des clients
	clients[conn] = true

	for {
		messageType, p, err := conn.ReadMessage()
		if err != nil {
			log.Println(err)
			delete(clients, conn)
			return
		}

		// Traiter le message reçu du client
		var receivedMessage WebSocketMessage
		err = json.Unmarshal(p, &receivedMessage)
		if err != nil {
			log.Println(err)
			continue
		}

		// Faire quelque chose avec le message reçu, par exemple, l'envoyer à d'autres clients
		for client := range clients {
			err := client.WriteMessage(messageType, p)
			if err != nil {
				log.Println(err)
				client.Close()
				delete(clients, client)
			}
		}
	}
}

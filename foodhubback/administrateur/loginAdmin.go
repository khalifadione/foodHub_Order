package administrateur

import (
	"database/sql"
	"encoding/json"
	"github.com/gorilla/websocket"
	"log"
	"net/http"
)

// VérifierIdentifiantsAdmin vérifie les identifiants d' l'admin
func VerifierIdentifiantsAdmin(username string, password string, db *sql.DB) (bool, error) {
	var count int
	err := db.QueryRow("SELECT COUNT(*) FROM client WHERE identifiant = ? AND motDePasse = ?", username, password).Scan(&count)
	if err != nil {
		return false, err
	}
	return count > 0, nil
}

// HandleLoginAdmin gère la connexion de l'admin en vérifiant les identifiants
func HandleLoginAdmin(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	usernameClient := r.FormValue("username")
	passwordClient := r.FormValue("password")

	// Vérification des identifiants
	ok, err := VerifierIdentifiantsAdmin(usernameClient, passwordClient, db)
	if err != nil {
		log.Println("Erreur lors de la vérification des identifiants :", err)
		respondWithError(w, http.StatusInternalServerError, "Erreur serveur")
		return
	}

	if ok {
		// Connexion réussie
		respondWithJSON(w, http.StatusOK, map[string]string{"message": "Connexion réussie"})
		log.Println("Connexion réussie :)")

	} else {
		// Identifiants incorrects
		log.Println("Connexion impossible :(")
		respondWithError(w, http.StatusUnauthorized, "Identifiants incorrects. Veuillez réessayer.")
	}
}

type SocketConnection struct {
	Conn   *websocket.Conn
	IsUser bool // true pour un utilisateur, false pour un restaurateur
}

// Fonction utilitaire pour répondre avec une erreur
func respondWithError(w http.ResponseWriter, code int, message string) {
	respondWithJSON(w, code, map[string]string{"error": message})
}

// Fonction utilitaire pour répondre avec du JSON
func respondWithJSON(w http.ResponseWriter, code int, payload interface{}) {
	response, _ := json.Marshal(payload)
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	w.Write(response)
}

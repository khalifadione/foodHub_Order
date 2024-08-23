package administrateur

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"

	_ "github.com/go-sql-driver/mysql"
)

// Client représente les données d'un client
type Client struct {
	ID          int    `json:"id"`
	Prenom      string `json:"prenom"`
	Nom         string `json:"nom"`
	CodePostal  string `json:"code_postal"`
	Identifiant string `json:"identifiant"`
	MotDePasse  string `json:"mot_de_passe"`
}

// RechercherClients récupère les clients correspondant au terme de recherche de la base de données
func RechercherClients(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	if r.Method != http.MethodGet {
		http.Error(w, "Méthode non autorisée", http.StatusMethodNotAllowed)
		return
	}

	// Récupérer le terme de recherche de la requête HTTP
	searchTerm := r.URL.Query().Get("search")
	if searchTerm == "" {
		http.Error(w, "Le terme de recherche est manquant", http.StatusBadRequest)
		return
	}

	// Exécuter la requête SQL pour rechercher les clients correspondants
	rows, err := db.Query("SELECT * FROM client WHERE prenom LIKE ? OR nom LIKE ?", "%"+searchTerm+"%", "%"+searchTerm+"%")
	if err != nil {
		log.Println("Erreur lors de la recherche des clients :", err)
		http.Error(w, "Erreur serveur lors de la recherche des clients", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var clients []Client
	for rows.Next() {
		var c Client
		if err := rows.Scan(&c.ID, &c.Prenom, &c.Nom, &c.CodePostal, &c.Identifiant, &c.MotDePasse); err != nil {
			log.Println("Erreur lors du scan des données du client :", err)
			http.Error(w, "Erreur serveur lors de la recherche des clients", http.StatusInternalServerError)
			return
		}
		clients = append(clients, c)
	}

	// Convertir les résultats en JSON et les renvoyer dans la réponse HTTP
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(clients)
}

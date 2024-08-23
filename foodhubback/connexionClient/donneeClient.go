package connexionClient

import (
	"database/sql"
	"log"
	"net/http"
)

// Récupération des clients
func GetClient(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	rows, err := db.Query("SELECT * FROM client")
	if err != nil {
		log.Println("Erreur lors de la récupération des clients :", err)
		respondWithError(w, http.StatusInternalServerError, "Erreur serveur")
		return
	}
	defer rows.Close()

	var clients []Client
	for rows.Next() {
		var r Client
		if err := rows.Scan(&r.ID, &r.Prenom, &r.Nom, &r.CodePostal, &r.Identifiant, &r.MotDePasse); err != nil {
			log.Println("Erreur lors du scan des données du client :", err)
			respondWithError(w, http.StatusInternalServerError, "Erreur serveur")
			return
		}
		clients = append(clients, r)
	}

	respondWithJSON(w, http.StatusOK, clients)
}

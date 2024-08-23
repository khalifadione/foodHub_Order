package connexionRestaurateur

import (
	"database/sql"
	"log"
	"net/http"
)

// Récupération des restaurateurs
func GetRestaurateurs(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	rows, err := db.Query("SELECT * FROM restaurateur")
	if err != nil {
		log.Println("Erreur lors de la récupération des restaurateurs :", err)
		respondWithError(w, http.StatusInternalServerError, "Erreur serveur")
		return
	}
	defer rows.Close()

	var restaurateurs []Restaurateur
	for rows.Next() {
		var r Restaurateur
		if err := rows.Scan(&r.ID, &r.NomRestaurant, &r.Prenom, &r.Nom, &r.CodePostal, &r.Identifiant, &r.MotDePasse, &r.Specialite); err != nil {
			log.Println("Erreur lors du scan des données du restaurateur :", err)
			respondWithError(w, http.StatusInternalServerError, "Erreur serveur")
			return
		}
		restaurateurs = append(restaurateurs, r)
	}

	respondWithJSON(w, http.StatusOK, restaurateurs)
}

package connexionRestaurateur

import (
	"database/sql"
	"log"
	"net/http"
)

// VérifierIdentifiantsRestaurateur vérifie les identifiants du restaurateur
func VerifierIdentifiantsRestaurateur(username string, password string, db *sql.DB) (bool, error) {
	var count int
	err := db.QueryRow("SELECT COUNT(*) FROM restaurateur WHERE identifiant = ? AND motDePasse = ?", username, password).Scan(&count)
	if err != nil {
		return false, err
	}
	return count > 0, nil
}

// handleLoginRestaurateur gère la connexion du restaurateur en vérifiant les identifiants
func HandleLoginRestaurateur(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	usernameRestaurateur := r.FormValue("username")
	passwordRestaurateur := r.FormValue("password")

	// Vérification des identifiants
	ok, err := VerifierIdentifiantsRestaurateur(usernameRestaurateur, passwordRestaurateur, db)
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

package administrateur

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"strconv"
)

func DeleteHandler(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	if r.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Récupérer l'ID du profil à supprimer depuis le formulaire HTML
	profileID := r.FormValue("profileID")
	if profileID == "" {
		http.Error(w, "Missing profileID parameter", http.StatusBadRequest)
		return
	}

	// Convertir l'ID du profil en int
	id, err := strconv.Atoi(profileID)
	if err != nil {
		http.Error(w, "Invalid profileID", http.StatusBadRequest)
		return
	}

	// Suppression du profil de la base de données
	_, err = db.Exec("DELETE FROM client WHERE id = ?", id)
	if err != nil {
		log.Println("Error deleting profile:", err) // Ajoutez ce log pour vérifier l'erreur
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	fmt.Fprintf(w, "Profile with ID '%d' deleted successfully", id)
}

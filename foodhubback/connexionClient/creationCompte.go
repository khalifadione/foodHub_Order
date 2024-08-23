package connexionClient

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
)

// User struct pour stocker les données de l'utilisateur
type Client struct {
	ID          int    `json:"id"`
	Prenom      string `json:"prenom"`
	Nom         string `json:"nom"`
	CodePostal  string `json:"codePostal"`
	Identifiant string `json:"identifiant"`
	MotDePasse  string `json:"motDePasse"`
}

// InscriptionUtilisateur gère l'inscription des utilisateurs
func InscriptionUtilisateur(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	var user Client

	// Autoriser l'accès depuis n'importe quelle origine avec les entêtes nécessaires
	w.Header().Set("Access-Control-Allow-Origin", "*")

	// Autoriser les méthodes POST et OPTIONS
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")

	// Autoriser les entêtes Content-Type et acceptés
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	// Vérifier si la méthode est OPTIONS et renvoyer un succès si c'est le cas
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	// Récupère les données du corps de la requête
	decoder := json.NewDecoder(r.Body)
	if err := decoder.Decode(&user); err != nil {
		respondWithError(w, http.StatusBadRequest, "Requête invalide")
		return
	}
	defer r.Body.Close()

	// Insertion des données dans la base de données
	result, err := db.Exec("INSERT INTO client (prenom, nom, codePostal, identifiant, motDePasse) VALUES (?, ?, ?, ?, ?)",
		user.Prenom, user.Nom, user.CodePostal, user.Identifiant, user.MotDePasse)
	if err != nil {
		log.Println("Erreur lors de l'insertion des données dans la base de données :", err)
		respondWithError(w, http.StatusInternalServerError, "Erreur serveur")
		return
	}

	// Ajoutez des journaux pour suivre l'exécution
	log.Println("Données utilisateur reçues :", user)

	// Renvoie le succès de l'insertion
	rowsAffected, _ := result.RowsAffected()
	respondWithJSON(w, http.StatusOK, map[string]int64{"rowsAffected": rowsAffected})
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

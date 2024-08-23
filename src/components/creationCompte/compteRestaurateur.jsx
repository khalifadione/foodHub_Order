import { useState, useEffect } from "react";

export default function CompteRestaurateur(){

    const [nomRestaurant, setNomRestaurant] = useState("");
    const [prenom, setPrenom] = useState("");
    const [nom, setNom] = useState("");
    const [codePostal, setCodePostal] = useState("");
    const [identifiant, setIdentifiant] = useState("");
    const [motDePasse, setMotDePasse] = useState("");
    const [specialite, setSpecialite] = useState("");
    const [error, setError] = useState("");
    

    const handleInscription = async () => {
        try {
          const response = await fetch("http://localhost:8080/inscriptionrestaurateur", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
                nomRestaurant: nomRestaurant,
                prenom: prenom,
                nom: nom,
                codePostal: codePostal,
                identifiant: identifiant,
                motDePasse: motDePasse,
                specialite: specialite,
            }),
          });
      
          if (!response.ok) {
            const data = await response.json();
            setError(data.error || "Erreur lors de l'inscription");
          } else {
            setError("");
            console.log("Inscription réussie");
            console.log("Données envoyées :", {
                nomRestaurant: nomRestaurant,
                prenom: prenom,
                nom: nom,
                codePostal: codePostal,
                identifiant: identifiant,
                motDePasse: motDePasse,
                specialite: specialite, // Ajout de ce champ
              });
              
          }
        } catch (error) {
          console.error("Erreur réseau :", error);
          setError("Erreur réseau");
        }
      };


    return (
          <div id='div-form-connection-restaurant'>
            <img src="/image/restaurateur.jpg" alt=""></img>
            <form  id="form-connection-client">
                <h1>Compte Restaurateur</h1>
                <div>
                    <label for="nomDuRestaurateur">Nom du restaurant*</label><br></br>
                    <input type="text" className="username" value={nomRestaurant} onChange={(e) => setNomRestaurant(e.target.value)} placeholder="Nom du restaurant..." />
                </div>
                <div>
                    <label for="prenomRestaurateur">Prénom*</label><br></br>
                    <input type="text" className="username" value={prenom} onChange={(e) => setPrenom(e.target.value)} placeholder="Prenom du restaurateurt..." />
                </div>
                <div>
                    <label for="omRestaurateur">Nom*</label><br></br>
                    <input type="text" className="username" value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Nom du restaurateurt..." />
                </div>
                <div>
                    <label for="codePostalRestaurateur">Code postal*</label><br></br>
                    <input type="text" className="username" value={codePostal} onChange={(e) => setCodePostal(e.target.value)} placeholder="Code postal du restaurant..." />
                </div>
                <div>
                    <label for="specilaiteRestaurateur">Votre spécialité*</label><br></br>
                    <input type="text" className="username" value={specialite} onChange={(e) => setSpecialite(e.target.value)} placeholder="Spécialité du restaurant..." />
                </div>
                <div>
                    <label for="identifiantRestaurateur">Identifiant*</label><br></br>
                    <input type="text" className="username" value={identifiant} onChange={(e) => setIdentifiant(e.target.value)} placeholder="Identifiant du restaurant..." />
                </div>
                <div>
                    <label for="mdpRestaurateur">Mot de passe*</label><br></br>
                    <input type="password" className="username" value={motDePasse} onChange={(e) => setMotDePasse(e.target.value)} placeholder="Mot de passe..." />
                </div>
                <p style={{ color: 'red', fontSize : "14px" }}>{error}</p>
                <button className="bouton-connexion" onClick={handleInscription}>Créer le compte</button>
                <ul className="div-createcmp-mdo">
                    <li><a className="a-connextion" href="#crationCompte">Se connecter</a></li>
                    <li><a className="a-connextion" href="#ReinitialisationMDP">Aide</a></li>
                </ul>  
            </form>
          </div>
    );
}
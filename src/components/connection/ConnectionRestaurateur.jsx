import React, { useState, useEffect } from 'react';
import {useNavigate} from "react-router-dom"
import './ConnectionRestaurateur.css'


function ConnectionRestaurant({ setOpenModalR }) {
    const navigate = useNavigate();
    const [usernameRestaurateur, setUsernameRestaurateur] = useState('');
    const [passwordRestaurateur, setPasswordRestaurateur] = useState('');
    const [pageProfil, setPageProfil] = useState(null)
    const [error, setError] = useState('');

    const handleLoginRestaurateur = async () => {
      try {
        const response = await fetch("http://localhost:8080/login-restaurateur", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            username: usernameRestaurateur,
            password: passwordRestaurateur,
          }),        
        });
  
        if (response.ok) {
          // Connexion réussie
          setError('');
          console.log("Connexion réussie");
          sessionStorage.setItem('username',usernameRestaurateur);
          navigate('/profil-restaurateur');
          // Rediriger ou effectuer d'autres actions après la connexion réussie
        } else {
          // Afficher l'erreur en cas d'identifiants incorrects
          const data = await response.json();
          setError(data.error || "Identifiants incorrects. Veuillez réessayer.");
        }
      } catch (error) {
        console.error("Erreur réseau :", error);
        setError("Erreur réseau");
      }
    };

  

  return (
    <div className="modalBackground">
      <div className="modalContainer">
        <div className="titleCloseBtn">
          <button
            onClick={() => {
              setOpenModalR(false);
            }}
          >
            X
          </button>
        </div>
        <div className="body">
          <div id='div-form-connection-restaurateur'>
              <form  id="form-connection-restaurateur">
                  <h1>Connexion restaurateur</h1>
                  <input type="text" className="username" value={usernameRestaurateur} onChange={(e) => setUsernameRestaurateur(e.target.value)} placeholder="Username..." />
                  <input type="password" className="password" value={passwordRestaurateur} onChange={(e) => setPasswordRestaurateur(e.target.value)} placeholder="Password..." />
                  <p style={{ color: 'red', fontSize : "14px" }}>{error}</p>
                  <button className="bouton-connexion" onClick={handleLoginRestaurateur}>Connexion</button>
                  <ul className="div-createcmp-mdo">
                      <li><a className="a-connextion" href="creation-compte-restaurateur">Créer un compte</a></li>
                      <li><a className="a-connextion" href="#ReinitialisationMDP">Mot de passe oublié</a></li>
                  </ul>  
              </form>
            </div>
        </div>
      </div>
    </div>
  );
}

export default ConnectionRestaurant;

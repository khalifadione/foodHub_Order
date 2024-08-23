import React, { useState, useEffect } from 'react';
import {useNavigate} from "react-router-dom"
import './ConnectionClient.css'


function Connection({ setOpenModal }) {
    const navigate = useNavigate();
    const [usernameClient, setUsernameClient] = useState('');
    const [passwordClient, setPasswordClient] = useState('');
    const [pageProfil, setPageProfil] = useState(null)
    const [error, setError] = useState('');

    const handleLoginClient = async () => {
      try {
        const response = await fetch("http://localhost:8080/login-client", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            username: usernameClient,
            password: passwordClient,
          }),        
        });
  
        if (response.ok) {
          // Connexion réussie
          setError('');
          console.log("Connexion réussie");
          sessionStorage.setItem('username',usernameClient);
          navigate('/profil-client');
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
  
  sessionStorage.setItem('username',usernameClient);
  return (
    <div className="modalBackground">
      <div className="modalContainer">
        <div className="titleCloseBtn">
          <button
            onClick={() => {
              setOpenModal(false);
            }}
          >
            X
          </button>
        </div>
        <div className="body">
          <div id='div-form-connection-client'>
              <form  id="form-connection-client">
                  <h1>Connexion client</h1>
                  <input type="text" className="username" value={usernameClient} onChange={(e) => setUsernameClient(e.target.value)} placeholder="Username..." />
                  <input type="password" className="password" value={passwordClient} onChange={(e) => setPasswordClient(e.target.value)} placeholder="Password..." />
                  <p style={{ color: 'red', fontSize : "14px" }}>{error}</p>
                  <button className="bouton-connexion" onClick={handleLoginClient}>Connexion</button>
                  <ul className="div-createcmp-mdo">
                      <li><a className="a-connextion" href="creation-compte-client">Créer un compte</a></li>
                      <li><a className="a-connextion" href="#ReinitialisationMDP">Mot de passe oublié</a></li>
                  </ul>  
              </form>
            </div>
        </div>
      </div>
    </div>
  );
}

export default Connection;











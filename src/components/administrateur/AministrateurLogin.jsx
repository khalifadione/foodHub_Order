import React, { useState, useEffect } from 'react';
import {useNavigate} from "react-router-dom"
import './AdministrateurLogin.css'


function ConnectionAdmin({ setOpenModalA }) {
    const navigate = useNavigate();
    const [usernameAdmin, setUsernameAdmin] = useState('');
    const [passwordAdmin, setPasswordAdmin] = useState('');
    const [error, setError] = useState('');

    const handleLoginAdmin = async () => {
      try {
        const response = await fetch("http://localhost:8080/login-administrateur", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            username: usernameAdmin,
            password: passwordAdmin,
          }),        
        });
  
        if (response.ok) {
          // Connexion réussie
          setError('');
          console.log("Connexion réussie");
          sessionStorage.setItem('username',usernameAdmin);
          navigate('/profil-administrateur');
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
  
  sessionStorage.setItem('username',usernameAdmin);
  return (
    <div className="modalBackground">
      <div className="modalContainer">
        <div className="titleCloseBtn">
          <button
            onClick={() => {
              setOpenModalA(false);
            }}
          >
            X
          </button>
        </div>
        <div className="body">
          <div id='div-form-connection-client'>
              <form  id="form-connection-client">
                  <h1>Connexion Admin</h1>
                  <input type="text" className="username" value={usernameAdmin} onChange={(e) => setUsernameAdmin(e.target.value)} placeholder="Username..." />
                  <input type="password" className="password" value={passwordAdmin} onChange={(e) => setPasswordAdmin(e.target.value)} placeholder="Password..." />
                  <p style={{ color: 'red', fontSize : "14px" }}>{error}</p>
                  <button className="bouton-connexion" onClick={handleLoginAdmin}>Connexion</button>
                  <ul className="div-createcmp-mdo">
                      <li><a className="a-connextion" href="#ReinitialisationMDP">Mot de passe oublié</a></li>
                  </ul>  
              </form>
            </div>
        </div>
      </div>
    </div>
  );
}

export default ConnectionAdmin;



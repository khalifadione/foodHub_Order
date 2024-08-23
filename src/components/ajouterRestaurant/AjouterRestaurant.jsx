
import React, { useState } from 'react';
import './Connection.css'

function Connection() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = () => {
        // Votre logique de vérification des identifiants
        // Ici, j'utilise une condition simple pour simuler une vérification incorrecte
        if (username === 'khalifa' && password === 'khalifa') {
            setError('');
            console.log("Connexion résussie")
        } else {
            setError('Identifiants incorrects. Veuillez réessayer.');
        }
    };

    return (
        <div>
            <form  id="div-connection" action="/action_page.php">
                <div>
                    <h1>Ajouter votre restaurant</h1>
                </div>
                <input type="text" className="username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username..." />
                <input type="password" className="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password..." />
                <p style={{ color: 'red', fontSize : "14px" }}>{error}</p>
                <button className="bouton-connexion" onClick={handleLogin}>Connexion</button>
                <ul className="div-createcmp-mdo">
                    <li><a className="a-connextion" href="#crationCompte">Créer un compte</a></li>
                    <li><a className="a-connextion" href="#ReinitialisationMDP">Mot de passe oublié</a></li>
                </ul>  
            </form>
            
        </div>
    );
}

export default Connection;

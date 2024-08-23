import React, { useState, useEffect, useRef } from "react";
import { useLocation } from 'react-router-dom';
import "./validationCommande.css"
import { useNavigate } from 'react-router-dom';

export default function ValidationCommande({ senderType, senderID, receiverID }) {
  const location = useLocation();
  const panier = location.state && location.state.panier ? location.state.panier : [];
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);
  const [username, setUsername] = useState(null);
  const [lesMessages, setLesMessages] = useState([])
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Contenu du panier dans ValidationCommande:', panier);
  }, [panier]);


  useEffect(() => {
    // Initialiser la connexion WebSocket
    socketRef.current = new WebSocket(`ws://localhost:8080/ws?senderType=${senderType}&senderID=${senderID}&receiverID=${receiverID}`);
    // Écouter les messages du serveur
    socketRef.current.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log('Message from server:', message);

      // Afficher le message dans la console du client ou du restaurateur
      setMessages(prevMessages => [...prevMessages, message]);
    };

    return () => {
      socketRef.current.close();
    };
  }, [senderType, senderID, receiverID]);

  const handleSendMessage = () => {
    // Vérifier si le champ d'entrée n'est pas vide
    if (messageInput.trim() !== '') {
      const message = {
        senderType,
        senderID,
        receiverID,
        messageType: 'text',
        content: messageInput,
      };

      // Envoyer le message au serveur
      socketRef.current.send(JSON.stringify(message));

      // Ajouter le message à la liste des messages
      setMessages(prevMessages => [...prevMessages, message]);
      sessionStorage.setItem('lesMessages',lesMessages);
      // Effacer le champ d'entrée
      setMessageInput('');
      navigate("/profil-client")
      
    }
  };

  useEffect(()=>{

    const storedUsername = sessionStorage.getItem('username');
    if (storedUsername) {
       setUsername(storedUsername);
       console.log("username = " + storedUsername);
    }
  })

  const contenuCommandeStringEtIden = panier.map(item => `${item.nomMenu}, ${item.plat}, #${username}#`).join(' @ ');
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div>Contenu commande = {contenuCommandeStringEtIden}</div>
        <h1>Valider et Payer { username}</h1>
        {/* Affichez le contenu du panier ici */}
        {panier.map((item, index) => (
          <div key={index}>
            <p>{item.nomMenu}</p>
            <p>{item.plat}</p>
            <p>{item.userNameRestaurateur}</p>
          </div>
        ))}

        {/* Affichez la liste des messages */}
        <div>
          {messages.map((message, index) => (
            <div key={index}>
              <p>{(message.content).includes(username) ? message.content : ""}</p>
            </div>
          ))}
        </div>

        {/* Champ d'entrée et bouton pour envoyer des messages */}
        <div>
          <input
            
            type="text"
            value={messageInput}
            name={contenuCommandeStringEtIden}
            placeholder="tape C pour confirmer"
            onChange={(e) => setMessageInput(e.target.name)}
          />
          <button onClick={handleSendMessage}>Valider la commande</button>
      </div>
    </div>
  );
}
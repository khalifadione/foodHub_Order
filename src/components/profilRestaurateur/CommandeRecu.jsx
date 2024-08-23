import React, { useState, useEffect, useRef } from "react";
import { useLocation } from 'react-router-dom';
import "./CommandeRecu.css"

export default function CommandeRecu({ senderType, senderID, receiverID, afficheCommande }) {
  const location = useLocation();
  const panier = location.state && location.state.panier ? location.state.panier : [];
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [clickedButtons, setClickedButtons] = useState([]); // État pour suivre les boutons cliqués
  const socketRef = useRef(null);
  const [notification, setNotification] = useState(0)

  useEffect(() => {
    console.log('Contenu de la commande du client:', panier);
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



  const handleSendToReceiver = (content) => {
    const message = {
      senderType,
      senderID,
      receiverID ,
      messageType: 'text',
      content,
    };

    // Envoyer le message au serveur
    socketRef.current.send(JSON.stringify(message));

    // Ajouter le bouton cliqué à la liste des boutons cliqués
    setClickedButtons(prevClickedButtons => [...prevClickedButtons, content]);
  };

  useEffect(() => {
    let totalNotifications = 0; // Variable pour stocker le nombre total de notifications

    // Calculer le nombre total de notifications à partir des messages
    messages.forEach(message => {
      const parts = message.content.split('@').map(part => part.trim()).filter(part => part !== '');
      parts.forEach(part => {
        const subParts = part.split('#').map(subPart => subPart.trim()).filter(subPart => subPart !== '');
        if (subParts.length === 2) {
          totalNotifications++;
        }
      });
    });

    // Mettre à jour l'état de la notification avec le nombre total calculé
    setNotification(totalNotifications);
  }, [messages]);

 

  return (
    <>
      {panier.map((item, index) => (
        <div key={index}>
          <p>{item.nomMenu}</p>
          <p>{item.plat}</p>
          <p>{item.userNameRestaurateur}</p>
        </div>
      ))}

      {/* Affichez la liste des messages */}
      <div className="liste-de-commande">
        {messages.map((message, index) => {
          const parts = message.content.split('@').map(part => part.trim()).filter(part => part !== ''); // Divise la chaîne en fonction de "@"
          const items = [];
          parts.forEach(part => {
            const subParts = part.split('#').map(subPart => subPart.trim()).filter(subPart => subPart !== ''); // Divise chaque partie en fonction de "#"
            if (subParts.length === 2) {
              items.push({
                message: subParts[0],
                receiverID: subParts[1]
              });
            }
          });
          return (
            <div key={index}>
              {afficheCommande && ( items.map((item, idx) => (
                <div key={idx}>
                  {!clickedButtons.includes(item.message+" "+item.receiverID) ? ( // Vérifie si le bouton n'a pas été cliqué
                    <>
                      <input className="input-com-recu" value={item.message} disabled={clickedButtons.includes(item.message+" "+item.receiverID)} />
                      <button className="btn-com-recu" onClick={() => handleSendToReceiver(item.message+" "+item.receiverID)} disabled={clickedButtons.includes(item.message+" "+item.receiverID)}>{item.receiverID}</button>
                    </>
                  ) : null}
                </div>
              )))}
            </div>
          );
        })}
      </div>
    </>
  );
}




/*
 */
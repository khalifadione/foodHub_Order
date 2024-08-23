import React, { useState, useEffect, useRef } from "react";
import { useLocation } from 'react-router-dom';

export default function NotificationCommande({ senderType, senderID, receiverID }) {
  const location = useLocation();
  const panier = location.state && location.state.panier ? location.state.panier : [];
  const [messages, setMessages] = useState([]);
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

 

  return notification;
}




/*
 */
import React, { useState, useEffect, useRef } from "react";
import { useLocation } from 'react-router-dom';

export default function Notification({ senderType, senderID, receiverID }) {
  const location = useLocation();
  const panier = location.state && location.state.panier ? location.state.panier : [];
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);
  const [username, setUsername] = useState(null);

  useEffect(() => {
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

  useEffect(()=>{

    const storedUsername = sessionStorage.getItem('username');
    if (storedUsername) {
       setUsername(storedUsername);
       console.log("username = " + storedUsername);
    }
  })

  return (messages.length) - 1;
}
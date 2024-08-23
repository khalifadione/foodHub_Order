import React, { useState, useEffect, useRef, useContext, createContext } from "react";
import { useLocation } from 'react-router-dom';
import './liseDesNotificationCm.css'



function ListDesNotifCm({ setModalOpenNotifRestaurateur, commandes, handleSendToReceiver, clickedButtons}) {

  const location = useLocation();
  const panier = location.state && location.state.panier ? location.state.panier : [];
  const [messageInput, setMessageInput] = useState('');
  const socketRef = useRef(null);
  const [notification, setNotification] = useState(0)



  return (
    <div className="modalBackground-notifcm">
      <div className="modalContainer-notifcm">
        <div className="titleCloseBtn-notifcm">
          <button
            onClick={() => {
                setModalOpenNotifRestaurateur(false);
            }}
          >
            X
          </button>
        </div>
        <div className="body">
        {panier.map((item, index) => (
        <div key={index}>
          <p>{item.nomMenu}</p>
          <p>{item.plat}</p>
          <p>{item.userNameRestaurateur}</p>
        </div>
      ))}

      {/* Affichez la liste des messages */}
      <div className="liste-de-commande">
        {commandes.map((message, index) => {
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
              {items.length>0 && ( items.map((item, idx) => (
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
        </div>
      </div>
    </div>
  );
}

export default ListDesNotifCm;



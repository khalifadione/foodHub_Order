import React, { useState, useEffect, useRef, useContext, createContext } from "react";
import { useLocation } from 'react-router-dom';
import './listDesNotifs.css'



function ListDesNotifs({ setModalOpenNotifClient,messages}) {

  const [username, setUsername] = useState(null);



  useEffect(()=>{

    const storedUsername = sessionStorage.getItem('username');
    if (storedUsername) {
       setUsername(storedUsername);
       console.log("username = " + storedUsername);
    }
    
  })



  return (
    <div className="modalBackground-notif">
      <div className="modalContainer-notif">
        <div className="titleCloseBtn-notif">
          <button
            onClick={() => {
                setModalOpenNotifClient(false);
            }}
          >
            X
          </button>
        </div>
        <div className="body">
          <div>
            {messages.map((message, index) => (
              <div key={index}>
                <p>{(message.content).includes(username) ?"Votre commande " +message.content+ " est prête " : ""}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListDesNotifs;



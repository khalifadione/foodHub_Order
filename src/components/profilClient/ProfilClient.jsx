import React, { useState, useEffect, Children } from 'react';
import Search from '../search/Search';
import CarCollection from '../cardCollection/CardCollection';
import ValidationCommande from '../validationCommande/ValidationCommande';
import Notification from './notification';


export default function ProfilClient() {
  const [adresseRecherche, setAdresseRecherche] = useState('');
  const [username, setUsername] = useState(null);
 
  useEffect(()=>{

    const storedUsername = sessionStorage.getItem('username');
    if (storedUsername) {
       setUsername(storedUsername);
       console.log("username = " + storedUsername);
    }
  })

  const handleAdresseChange = (nouvelleAdresse) => {
    setAdresseRecherche(nouvelleAdresse);
  };

  const senderType = "client";
  const senderID = username;
  const receiverID = "lagondole";

  return (
    <>
      <Search onAdresseChange={handleAdresseChange} senderType={senderType} senderID={senderID} receiverID={receiverID} />
      <CarCollection adresseRecherche={adresseRecherche}/>
      {/*<ValidationCommande senderType={senderType} senderID={senderID} receiverID={receiverID} />*/}
    </>
  );
}

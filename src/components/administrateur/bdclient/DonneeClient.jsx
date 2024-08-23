import React, { useState, useEffect } from 'react';
import './DonneeClient.css'


function DonneeClient({ setModalOpenDonneeClient }) {
     const [donneeClient, setDonneeClient] = useState([])
     const [error, setError] = useState({});

    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await fetch("http://localhost:8080/donneeclients");
            if (!response.ok) {
              throw new Error("Erreur lors de la récupération des clients");
            }
    
            const data = await response.json();
            setDonneeClient(data);
            console.log("Donnée restaurateur = " +data);
          } catch (error) {
            console.error("Erreur réseau :", error);
            setError("Erreur lors de la récupération des restaurateurs");
          }
        };
    
        fetchData();
      }, []);
   
  

  return (
    <div className="modalBackground-bdclien">
      <div className="modalContainer-bdclien">
        <div className="titleCloseBtn-bdclien">
          <button
            onClick={() => {
                setModalOpenDonneeClient(false);
            }}
          >
            Fermer
          </button>
        </div>
        <div className="body" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent : "center" }}>
         <table>
            <tr>
              <th>Id</th>
              <th>Prenom</th>
              <th>Nom</th>
              <th>Code postal</th>
              <th>Identifiant</th>
              <th>Mot de passe</th>
            </tr>

           { donneeClient.map((data, index)=>
                    <tr>
                      <td>{data.id}</td>
                      <td>{data.prenom}</td>
                      <td>{data.nom}</td>
                      <td>{data.codePostal}</td>
                      <td>{data.identifiant}</td>
                      <td>{data.motDePasse}</td>
                    </tr>
           )
          }
          </table>
        </div>
      </div>
    </div>
  );
}

export default DonneeClient;











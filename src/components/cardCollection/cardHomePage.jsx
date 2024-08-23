import React, { useState } from "react";
import { BsList, BsCart } from "react-icons/bs";
import './cardHomePage.css'


export default function CardHomePage() {
  const [showMenuList, setShowMenuList] = useState(window.innerWidth <= 767);
  const [contenuPanier, setContenuPanier] = useState([]);

  const listeDesPlats = [
    {
      imageUrl: '/image/resto.jpg',
      entree: "salade",
      plat: "yassa",
      dessert: "Bissap",
      description : "Se connecter en tant que restaurateur",
      url : "",
      href : "#div-form-connection-restaurateur"
    },
    {
      imageUrl: '/image/resto.jpg',
      entree: "oeuf",
      plat: "filet de boeuf",
      dessert: "glace",
      description : "Vous pouvez créer facilement un compte client",
      url : "Ajouter un compte client",
      href : 'creation-compte-client'
    },
    {
      imageUrl: '/image/resto.jpg',
      entree: "entree",
      plat: "plat",
      dessert: "dessert",
      description : "Livrez avec FoodHub",
      url : "Livrez avec FoodHub",
      href : ""
    },
  ];

 

  return (
    <>
      <div className="div-img-homePage">

      </div>
      <div id="div-cardHomePage">
        {listeDesPlats.map((car, index) => (
          <div className='card-item-homePage' key={index}>
            <img alt='' className='car-image-homePage' src={car.imageUrl} />
            <ul style={{justifyContent : "center"}} className='ul-connect-restau'>
              <h3>{car.description}</h3>
              <a href={car.href}>{car.url}</a>
            </ul>
          </div>
        ))
        }
      </div>
    </>
  );
}

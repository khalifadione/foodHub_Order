import React, { useState, useEffect } from "react";
import { BsList, BsCart, BsBell } from "react-icons/bs";
import { Link, useLocation } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

import "./commandeClient.css";

export default function CommandeClient() {

  const navigate = useNavigate();

  const location = useLocation();
  const menus = location.state ? location.state.menus : [];

  const [showMenuList, setShowMenuList] = useState(window.innerWidth <= 767);
  const [contenuPanier, setContenuPanier] = useState([]);
  const [selectedTab, setSelectedTab] = useState([]);
  const [commandeAValider, setCommandeAValider] = useState()
 

  const hangleContenuPanier = (index) => {
    // Ajoutez le menu sélectionné à l'état du panier
      setContenuPanier((prevPanier) => {
        const nouveauPanier = [...prevPanier, menus[index]];
        console.log(nouveauPanier);
        setCommandeAValider(nouveauPanier)
        return nouveauPanier;
      });
  };

  const hangleClick = () => {
    setShowMenuList(!showMenuList);
    console.log("L'objet =", menus);
  };

  const handleClickValidationCommande = () => {
    // Naviguer vers la page de validation de la commande avec le panier comme paramètre
    console.log('Contenu du panier à transmettre :', contenuPanier);
    navigate('/valider-commande', { state: { panier: contenuPanier } });
  };

  return (
    <>
      <div className="navBarPC">
        <ul className="navBarPC-option">
          <li style={{ listStyle: "none" }}>
            <button onClick={hangleClick} className="menu">
              <BsList />
            </button>
          </li>
          <div>
            <input
              type="text"
              className="search-bar-PC"
              placeholder="Plats..."
            />
          </div>
          <li>
            <a className="IconePC" href="valider-commande" onClick={handleClickValidationCommande}>
              <BsCart />
              {contenuPanier.length > 0 && (
                <span className="cart-item-count">
                  {contenuPanier.length}
                </span>
              )}
            </a>
          </li>
        </ul>
      </div>
      <h1 style={{marginTop : "30vh", display : "flex", justifyContent : "center"}}>Les Menus du restaurant</h1>
      <div id="div-cardcollection-cm">
        {menus.map((menu, index) => (
          <div key={index} className="card-item-cm">
              <img src={menu.imgMenu} alt={menu.nomMenu} sizes="medium" className="card-image-cm" />
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <h4>{menu.nomMenu}</h4>
                <p>Dessert : {menu.dessert}, Entrée: {menu.entree}, Plat: {menu.plat}</p>
                <button className="btn-ajouter-cm" onClick={() => hangleContenuPanier(index)}>
                  Ajouter le menu
                </button>
              </div>
          </div>
        ))}
      </div>
    </>
  );
}

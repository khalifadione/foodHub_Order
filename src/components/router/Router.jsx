import React from "react";
import App from "../../App";
import CompteRestaurateur from "../creationCompte/compteRestaurateur";
import CompteClient from "../creationCompte/compteClient";
import CommandeClient from "../CommandeClient/commandeClient";
import ProfilClient from "../profilClient/ProfilClient";
import ProfilRestaurateur from "../profilRestaurateur/ProfilRestaurateur";
import ValidationCommande from "../validationCommande/ValidationCommande";
import ProfilAdmin from "../administrateur/AdministrateurProfil";
import {
  createBrowserRouter,
} from "react-router-dom";

export const router = createBrowserRouter([
    {
      path: "/",
      element:  <App />,
    },
    {
      path: "creation-compte-restaurateur",
      element:  <CompteRestaurateur/>,
    },
    {
      path: "creation-compte-client",
      element:  <CompteClient/>,
    },
    {
      path: "profil-client",
      element:  <ProfilClient/>,
    },
    {
      path: "profil-restaurateur",
      element:  <ProfilRestaurateur/>,
    },
    {
      path: "commande-client",
      element:  <CommandeClient/>,
    },
    {
      path: "valider-commande",
      element:  <ValidationCommande/>,
    },
  
    {
      path: "profil-administrateur",
      element:  <ProfilAdmin/>
    },
  
  
]);
;
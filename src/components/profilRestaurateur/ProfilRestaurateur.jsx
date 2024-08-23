import { BsList, BsCart, BsBell } from "react-icons/bs";
import './ProfilRestaurateur.css'
import { useEffect, useState, useRef } from "react";
import { storage } from "../../API/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { db } from "../../API/firebase"; // Assurez-vous d'ajuster le chemin d'accès en fonction de votre structure de projet Firebase
import { addDoc, collection, serverTimestamp,onSnapshot  } from "firebase/firestore";
import CommandeRecu from "./CommandeRecu"
import { useLocation } from 'react-router-dom';
import {useNavigate} from "react-router-dom"
import ListDesNotifCm from "./listeDesNotificationCm";


export default function ProfilRestaurateur(){

    const initialise = {
        userNameRestaurateur : "",
        nomMenu : "",
        entree : "",
        plat : "",
        dessert : "",
        imgMenu : ""
    }

    const [data, setData] = useState(initialise);
    const {nomMenu, entree, plat, dessert} = data;
    const [file, setFile] = useState(null);
    const [photoProfil, setPhotoProfil] = useState(null);
    const [progress, setProgress] = useState(null);
    const [isSubmit, setIsSubmit] = useState(false);
    const [username, setUsername] = useState(null);
    const [error, setError] = useState({})
    const [users, setUsers] = useState([]);
    const [restaurateurs, setRestaurateurs] = useState([]);
    const navigate = useNavigate();
    const [modalOpenNotifRestaurateur, setModalOpenNotifRestaurateur] = useState(false);
    const location = useLocation();
    const panier = location.state && location.state.panier ? location.state.panier : [];
    const [messages, setMessages] = useState([]);
    const socketRef = useRef(null);
    const [notification, setNotification] = useState(0)
    const [clickedButtons, setClickedButtons] = useState([]);

    const senderType = "restaurateur";
    const senderID = username; // Remplacez "restaurateur1" par l'identifiant du restaurateur réel
    const receiverID = "khalifa"

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
        

    //Mise à jour des fichiers ajoutés
    useEffect(()=>{
        const fetchData = async () => {
            try {
              const response = await fetch("http://localhost:8080/donneerestaurateurs");
              if (!response.ok) {
                throw new Error("Erreur lors de la récupération des restaurateurs");
              }
      
              const data = await response.json();
              setRestaurateurs(data);
            } catch (error) {
              console.error("Erreur réseau :", error);
              setError("Erreur lors de la récupération des restaurateurs");
            }
          };
      
          //fetchData();
          
        const uploadFile = () =>{ 

        if (photoProfil) {  
            const name = new Date().getTime() + file.name;
            const storageRef = ref(storage, file.name)
            const uploadTask = uploadBytesResumable(storageRef,file);

            const namepp = new Date().getTime() + photoProfil.name;
            const storageRefPp = ref(storage, photoProfil.name)
            const uploadTaskPp = uploadBytesResumable(storageRefPp,photoProfil);
            
            //Chargement photo de profil restaurant
            uploadTaskPp.on("state_changed", (snapshot)=>{
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes)*100
                setProgress(progress);
                switch (snapshot.state) {
                    case "paused" : 
                    console.log("Upload is pause");
                    break;
                    case 'running' : 
                    console.log("Upload is running");
                    break;
                    default : 
                    break;
                }
            }, (error) => {
                console.log(error)
            },
            () =>{
                getDownloadURL(uploadTaskPp.snapshot.ref).then((downloadURL) => {
                    console.log("Photo de profil uploaded successfully:", downloadURL);
                    setData((prev) => ({...prev, imgPP : downloadURL}))
                })
            }
            );

            uploadTask.on("state_changed", (snapshot)=>{
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes)*100
                setProgress(progress);
                switch (snapshot.state) {
                    case "paused" : 
                    console.log("Upload is pause");
                    break;
                    case 'running' : 
                    console.log("Upload is running");
                    break;
                    default : 
                    break;
                }
            }, (error) => {
                console.log(error)
            },
            () =>{
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log("Photo de profil uploaded successfully:", downloadURL);
                    setData((prev) => ({...prev, imgMenu : downloadURL}))
                })
            }
            );
        } else {
            console.log("Les fichiers ou leurs noms sont null");
        }
        }

       file && uploadFile()
    
    },[file, photoProfil, restaurateurs])

    useEffect(() => {
        // Récupérer le nom d'utilisateur depuis sessionStorage
        const storedUsername = sessionStorage.getItem('username');
        if (storedUsername) {
            setUsername(storedUsername);
            console.log("username = " + storedUsername);
    
            // Récupération donnée firebase
            const unsub = onSnapshot(collection(db, storedUsername), (snapshot) => {
                let list = [];
                snapshot.docs.forEach((doc) => {
                    list.push({ ...doc.data() });
                });
                setUsers(list);
            }, (error) => {
                console.log("Erreur de récupération des données Firestore", error);
            });
    
            return () => {
                unsub();
            };
        }
    }, []);
    

    const handleChange = (e)=>{
         setData({...data, [e.target.name] : e.target.value})
    }

    const handleSubmit = async (e, userName) => {
        e.preventDefault();
        setIsSubmit(true);
        
        try {
            // Utilisation de la valeur du paramètre 'userName' comme nom de collection
            data.userNameRestaurateur = userName
            await addDoc(collection(db, userName), {
                ...data,
                timestamp: serverTimestamp(),
            });
    
            // Réinitialiser le formulaire après la soumission réussie
            setData(initialise);
            setFile(null);
            setPhotoProfil(null)
            setProgress(null);
            setIsSubmit(false);
        } catch (error) {
            console.error("Erreur lors de l'ajout du document :", error);
            // Gérer les erreurs ici
        }
    };
    

    

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


     const handleConsulteNotification = ()=>{
           setNotification(0)
           setModalOpenNotifRestaurateur(true)
      }

      const handleDeconnecte = ()=>{
            navigate("/")
      } 
    

    return(
        <>
        <div className='div-entete-pp-resta-et-navBar'>
            <div className='div-entete-pp-restau'>
                <img className="photo-restaurant" src={users.length > 0 ? users[0].imgPP : ""} alt=""/>
                <h1 style={{marginTop : "100px"}}>{username}</h1>
            </div>
             {modalOpenNotifRestaurateur && <ListDesNotifCm setModalOpenNotifRestaurateur={setModalOpenNotifRestaurateur}
             commandes={messages} handleSendToReceiver={handleSendToReceiver} clickedButtons={clickedButtons}
             />}
            <div className='div-entete-pp-restau-icone'>
                <button onClick={handleConsulteNotification} className='menu'>
                  <BsBell /> <span className="card-item-notification-pr">{notification}</span> 
                </button>
            </div>
        </div>
        <div className="div-btn-ajout-deconnect">
            <button className="btn-ajouter-menu"><a style={{textDecoration : "none", color: "white"}} href="#le-formulaire-ajout-menu">Ajouter un menu</a></button>
            <button onClick={handleDeconnecte} className='btn-deconnexion'>Deconnexion</button>
        </div>
        <div className="div-cardcollection-pr">
        {
          users.map((user, index) => (
          <div className="card-item-pr" key={index}>
           <img className="card-image-pr" sizes="medium" src={user.imgMenu} alt=''/>
           <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
               <h3> Menu </h3>
            Plat : {user.plat}, Dessert : {user.dessert}
           </div>
         </div>))
        }
      </div>
      <div style={{ display: "flex", flexDirection: "row", alignItems: "center", justifyContent : "center"}}>
        <form id="le-formulaire-ajout-menu" onSubmit={(e) => handleSubmit(e, username)}>
            <label>Nom du menu </label>
            <br></br>
            <input className="input" type="text" name="nomMenu" onChange={handleChange} value={nomMenu}/>
            <br></br>
            <label>Nom Entrée </label>
            <br></br>
            <input className="input" type="text" name="entree" onChange={handleChange} value={entree}/>
            <br></br>
            <label>Nom plat </label>
            <br></br>
            <input className="input" type="text" name="plat" onChange={handleChange} value={plat}/>
            <br></br>
            <label>Nom dessert </label>
            <br></br>
            <input className="input" type="text" name="dessert" onChange={handleChange} value={dessert}/>
            <br></br>
            <label>Image </label>
            <br></br>
            <input className="input" type="file"  onChange={(e)=>setFile(e.target.files[0])}/>
            <br></br>
            <label>Image profil </label>
            <br></br>
            <input className="input" type="file"  onChange={(e)=>setPhotoProfil(e.target.files[0])}/>
            <br></br>
            <button className="btn-ajouter-menus" primary type="submit"
            disabled={progress !== null && progress < 100}
            >Ajouter</button>
        </form>
     
      </div>
    </>
    )
}
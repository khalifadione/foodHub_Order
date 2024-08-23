import { useEffect, useState } from 'react';
import './NavBar.css'
import { BsFillPersonFill, BsList } from "react-icons/bs";
import Connection from '../connection/ConnectionClient';
import ConnectionRestaurant from '../connection/ConnectionRestaurateur';
import ConnectionAdmin from '../administrateur/AministrateurLogin';


function NavBar() {

    const [modalOpen, setModalOpen] = useState(false);
    const [modalOpenR, setModalOpenR] = useState(false);
    const [modalOpenA, setModalOpenA] = useState(false);

    const [showMenuList, setShowMenuList] = useState(window.innerWidth <= 767);

    const hangleClick = () => {
        setShowMenuList(!showMenuList);
    }

    useEffect(() => {
        const handleResize = () => {
            setShowMenuList(window.innerWidth <= 16);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <>
            <ul className='div-menu-navbar'>
                <li><button onClick={hangleClick} className='btn-menu-accueil'><BsList/></button></li>
                <ul className={showMenuList ? "ul-navbar-responsive" : "ul-navbar" } onClick={() => setShowMenuList(false)}>
                    <li><a className="a" href="#restaurant-disponible">Accueil</a></li>
                    <li><a className="a" href="#Footer-div">A propos</a></li>
                    <li><a className="a" href="#Footer-div"
                         onClick={() => {
                            setModalOpenA(true);
                        }}
                    >connexion administrateur</a></li>
                    <li><a className="a" href="#Footer-div"
                       onClick={() => {
                        setModalOpenR(true);
                       }}
                    >Connexion restaurateur</a></li>
                    <li><a className='Explorer' href="creation-compte-restaurateur">Ajoutez un Restaurant</a></li>   
                </ul>
                <li><a className="Icone" href="#div-form-connection-client" 
                      onClick={() => {
                      setModalOpen(true);
                      }}
                 ><BsFillPersonFill/></a></li>
            </ul>
          
            {modalOpen && <Connection setOpenModal={setModalOpen} />}
            {modalOpenR && <ConnectionRestaurant setOpenModalR={setModalOpenR} />}
            {modalOpenA && <ConnectionAdmin setOpenModalA={setModalOpenA} />}
        </>
    )
}

export default NavBar;

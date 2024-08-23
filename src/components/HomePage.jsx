import NavBar from "./navBar/NavBar"
import Connection from "./connection/ConnectionClient"
import CardGoogleMap from "./card/cardGoogleMap"
import CardHomePage from "./cardCollection/cardHomePage"

export default function HomePage(){

    return(
        <>
            <div className="homePage">
                <NavBar/>
                <CardHomePage/>
                <Connection/>
                <CardGoogleMap/>
            </div>
        
        </>
    )
}
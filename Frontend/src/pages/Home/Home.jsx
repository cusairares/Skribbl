
import styles  from "./Home.module.css"
import { LobbySetup } from "../../components/LobbySetup/LobbySetup";
import logo from '../../assets/logo.gif';

function Home() {
    return(
      <div data-component= "home" className={styles.home}>
          <img data-component="logo" className={styles.logo } src={logo}></img>
          <LobbySetup></LobbySetup>
      </div>
    )
}

export {Home}


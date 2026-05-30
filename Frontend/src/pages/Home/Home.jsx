
import styles  from "./Home.module.css"
import { LobbySetup } from "../../components/LobbySetup/LobbySetup";
import logo from '../../assets/logo.gif';

function Home() {
    return(
      <div data-testid= "home" className={styles.home}>
          <img data-testid="logo" className={styles.logo } src={logo}></img>
          <LobbySetup></LobbySetup>
      </div>
    )
}

export {Home}



import styles  from "./Home.module.css"
import { CharacterPanel } from "../../components/CharacterPanel/CharacterPanel";
import logo from '../../assets/logo.gif';

function Home() {
    return(
      <div data-testid= "home" className={styles.home}>
          <img data-testid="logo" className={styles.logo } src={logo}></img>
          <CharacterPanel></CharacterPanel>
      </div>
    )
}

export {Home}

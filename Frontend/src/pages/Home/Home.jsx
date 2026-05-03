
import styles  from "./Home.module.css"
import {CharacterCreator} from "../../features/CharacterCreator/CharacterCreator.jsx"

function Home() {
    return(
      <div className={styles.wrapper}>
        <div className={styles.content}>
          <img className={styles.logo } src="src/assets/logo.gif"></img>
          <CharacterCreator></CharacterCreator>
        </div>
      </div>
    )
}

export {Home}

import { useContext } from "react"
import { GameContext } from "../../context/Game/GameContext"
import styles from "./GameHeader.module.css"
import clockIcon from "../../assets/clock.gif"
import settingsIcon from "../../assets/settings.gif"

function GameHeader(){
    const { currentWord, currentRound, totalRounds } = useContext(GameContext)
    return(
        <div data-component="game-header" className={styles.gameHeader}>
            <img src={clockIcon} className={styles.clock} alt="Clock timer" />
            <div className={styles.rounds}>{"Round " + currentRound + " of " + totalRounds}</div>
            <div data-component="word" className={styles.word}>
                <div>DRAW THIS</div>
                <div>{currentWord}</div>
            </div>
            <img src={settingsIcon} className={styles.settings} alt="Game settings" />
        </div>
    )
}

export {GameHeader};


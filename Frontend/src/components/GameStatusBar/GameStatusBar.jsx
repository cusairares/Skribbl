import { useContext } from "react"
import { SessionContext } from "../../context/Session/SessionContext"
import styles from "./GameStatusBar.module.css"
import clockIcon from "../../assets/clock.gif"
import settingsIcon from "../../assets/settings.gif"

function GameStatusBar(){
    const { currentWord, currentRound, totalRounds } = useContext(SessionContext)
    return(
        <div data-component="game-status-bar" className={styles.gameStatusBar}>
            <img src={clockIcon} className={styles.clock} alt="Clock timer" />
            <div className={styles.rounds}>{"Round " + currentRound + " of " + totalRounds}</div>
            <div data-component="word" className={styles.word}>
                <div>{currentWord}</div>
            </div>
            <img src={settingsIcon} className={styles.settings} alt="Game settings" />
        </div>
    )
}

export { GameStatusBar };

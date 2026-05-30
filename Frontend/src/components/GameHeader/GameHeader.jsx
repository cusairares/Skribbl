import { useContext } from "react"
import { GameContext } from "../../context/Game/GameContext"
import styles from "./GameHeader.module.css"

function GameHeader(){
    const { currentWord, currentRound, totalRounds } = useContext(GameContext)

    return(
        <div data-testid="game-header" className={styles.header}>
            <image></image>
            <div>{"Round " + currentRound + " of " + totalRounds}</div>
            <div data-testid="word" className={styles.word}>
                <div>DRAW THIS</div>
                <div>{currentWord}</div>
            </div>
        </div>
    )
}

export default GameHeader;
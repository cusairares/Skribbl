import { useState, useEffect } from "react"
import styles from "./GameStatusBar.module.css"
import clockIcon from "../../assets/clock.gif"
import settingsIcon from "../../assets/settings.gif"
import { useRoundStore } from "../../hooks/useRoundStore"
import { useWordStore } from "../../hooks/useWordStore"

function GameStatusBar() {
    const currentWord = useWordStore((state) => state.currentWord)
    const currentRound = useRoundStore((state) => state.currentRound)
    const totalRounds = useRoundStore((state) => state.totalRounds)
    const turnEndTime = useRoundStore((state) => state.turnEndTime)
    
    const [secondsLeft, setSecondsLeft] = useState(0)
    
    const updateTimer = (endTime) => {
        const now = Date.now()
        const diff = endTime - now
        const remaining = Math.max(0, Math.ceil(diff / 1000))
        setSecondsLeft(remaining)
    };

    useEffect(() => {
        if (!turnEndTime) {
            setSecondsLeft(0)
            return
        }

        const endTime = new Date(turnEndTime).getTime()

        updateTimer(endTime)

        const intervalId = setInterval(updateTimer, 200)

        return () => {
            clearInterval(intervalId)
        }
    }, [turnEndTime])

    return (
        <div data-component="game-status-bar" className={styles.gameStatusBar}>
            <div className={styles.timerSection}>
                <img src={clockIcon} className={styles.clock} alt="Clock timer" />
                {secondsLeft > 0 && <span className={styles.timerText}>{secondsLeft}s</span>}
            </div>
            <div className={styles.rounds}>{"Round " + currentRound + " of " + totalRounds}</div>
            <div data-component="word" className={styles.word}>
                <div>{currentWord}</div>
            </div>
            <img src={settingsIcon} className={styles.settings} alt="Game settings" />
        </div>
    )
}

export { GameStatusBar };

import { useContext } from "react"
import styles from "./Player.module.css"
import { UserContext } from "../../context/User/UserContext"


function Player({player,index}){
    const {getStyle} = useContext(UserContext)
    return(
        <div className={styles.player}>
            <div className={styles.place}>#{index + 1}</div>
            <div>
                <div className={styles.name}>{player.username}</div>
                <div className={styles.score}>Score {player.score ?? 0}</div>
            </div>
            <div className={styles.avatar}>
                <div className={styles.eyes} style={getStyle(player.avatarOptions,'eyesIndex')}></div>
                <div className={styles.mouth} style={getStyle(player.avatarOptions,'mouthIndex')}></div>
                <div className={styles.color} style={getStyle(player.avatarOptions,'colorIndex')}></div>
            </div>
        </div>
    )
}

export {Player}
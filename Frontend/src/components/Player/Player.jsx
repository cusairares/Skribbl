import styles from "./Player.module.css"
import { getAvatarStyle } from "../../hooks/useAvatarOptions"

function Player({player,index}){
    return(
        <div className={styles.player}>
            <div className={styles.place}>#{index + 1}</div>
            <div>
                <div className={styles.name}>{player.username}</div>
                <div className={styles.score}>Score {player.score ?? 0}</div>
            </div>
            <div className={styles.avatar}>
                <div className={styles.eyes} style={getAvatarStyle(player.avatarOptions,'eyesIndex')}></div>
                <div className={styles.mouth} style={getAvatarStyle(player.avatarOptions,'mouthIndex')}></div>
                <div className={styles.color} style={getAvatarStyle(player.avatarOptions,'colorIndex')}></div>
            </div>
        </div>
    )
}

export {Player}
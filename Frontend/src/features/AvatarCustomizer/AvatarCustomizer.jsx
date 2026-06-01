import { useContext } from "react"
import { SessionContext } from "../../context/Session/SessionContext"
import styles from "./AvatarCustomizer.module.css"

function AvatarCustomizer(){
    const { avatarOptions,updateAvatarOptions, getStyle } = useContext(SessionContext)

    return(
        <div data-component="avatar-customizer" className={styles.avatarCustomizer}>
            <div className={styles.containerLeft}>
                <div className={styles.arrow} onClick={() => updateAvatarOptions('eyesIndex', 'left')}></div>
                <div className={styles.arrow} onClick={() => updateAvatarOptions('mouthIndex', 'left')}></div>
                <div className={styles.arrow} onClick={() => updateAvatarOptions('colorIndex', 'left')}></div>
            </div>
            <div className={styles.avatar}>
                <div className={styles.eyes} style={getStyle(avatarOptions,'eyesIndex')}></div>
                <div className={styles.mouth} style={getStyle(avatarOptions,'mouthIndex')}></div>
                <div className={styles.color} style={getStyle(avatarOptions,'colorIndex')}></div>
            </div>
            <div className={styles.containerRight}>
                <div className={styles.arrow} onClick={() => updateAvatarOptions('eyesIndex', 'right')}></div>
                <div className={styles.arrow} onClick={() => updateAvatarOptions('mouthIndex', 'right')}></div>
                <div className={styles.arrow} onClick={() => updateAvatarOptions('colorIndex', 'right')}></div>
            </div>
        </div>
    )
}

export {AvatarCustomizer}
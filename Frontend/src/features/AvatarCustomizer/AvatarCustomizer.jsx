import { useContext } from "react"
import { SessionContext } from "../../context/Session/SessionContext"
import styles from "./AvatarCustomizer.module.css"

function AvatarCustomizer(){
    const { updateAvatarOptions, getStyle } = useContext(SessionContext)

    return(
        <div data-testid="avatar-customizer" className={styles.avatarCustomizer}>
            <div className={styles.containerLeft}>
                <div className={styles.arrow} onClick={() => updateAvatarOptions('eyes', 'left')}></div>
                <div className={styles.arrow} onClick={() => updateAvatarOptions('mouth', 'left')}></div>
                <div className={styles.arrow} onClick={() => updateAvatarOptions('color', 'left')}></div>
            </div>
            <div className={styles.avatar}>
                <div className={styles.eyes} style={getStyle('eyes')}></div>
                <div className={styles.mouth} style={getStyle('mouth')}></div>
                <div className={styles.color} style={getStyle('color')}></div>
            </div>
            <div className={styles.containerRight}>
                <div className={styles.arrow} onClick={() => updateAvatarOptions('eyes', 'right')}></div>
                <div className={styles.arrow} onClick={() => updateAvatarOptions('mouth', 'right')}></div>
                <div className={styles.arrow} onClick={() => updateAvatarOptions('color', 'right')}></div>
            </div>
        </div>
    )
}

export {AvatarCustomizer}
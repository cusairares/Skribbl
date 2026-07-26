import styles from "./AvatarCustomizer.module.css"
import { useAvatarOptions, getAvatarStyle } from "../../hooks/useAvatarOptions"

function AvatarCustomizer(){
    const avatarOptions = useAvatarOptions(state => state.avatarOptions);
    const updateAvatarOptions = useAvatarOptions(state => state.updateAvatarOptions);

    return(
        <div data-component="avatar-customizer" className={styles.avatarCustomizer}>
            <div className={styles.containerLeft}>
                <div className={styles.arrow} onClick={() => updateAvatarOptions('eyesIndex', 'left')}></div>
                <div className={styles.arrow} onClick={() => updateAvatarOptions('mouthIndex', 'left')}></div>
                <div className={styles.arrow} onClick={() => updateAvatarOptions('colorIndex', 'left')}></div>
            </div>
            <div className={styles.avatar}>
                <div className={styles.eyes} style={getAvatarStyle(avatarOptions, 'eyesIndex')}></div>
                <div className={styles.mouth} style={getAvatarStyle(avatarOptions, 'mouthIndex')}></div>
                <div className={styles.color} style={getAvatarStyle(avatarOptions, 'colorIndex')}></div>
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
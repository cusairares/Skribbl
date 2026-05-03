import styles from "./AvatarCustomizer.module.css"
function AvatarCustomizer(){
    return(
        <div data-testid="avatar-customizer" className={styles.avatarCustomizer}>
            <div data-testid="container-left" className={styles.containerLeft}>
                <div data-testid="left" className={styles.arrow} ></div>
                <div data-testid="left" className={styles.arrow}></div>
                <div data-testid="left" className={styles.arrow}></div>
            </div>
            <div data-testid="avatar" className={styles.avatar}>
                <div data-testid="eyes" className={styles.eyes}></div>
                <div data-testid="mouth" className={styles.mouth}></div>
                <div data-testid="body" className={styles.body}></div>
            </div>
            <div data-testid="container-right" className={styles.containerRight}>
                <div data-testid="left" className={styles.arrow} ></div>
                <div data-testid="left" className={styles.arrow}></div>
                <div data-testid="left" className={styles.arrow}></div>
            </div>
        </div>
    )
}

export {AvatarCustomizer}
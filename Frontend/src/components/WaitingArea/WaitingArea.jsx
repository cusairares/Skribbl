import React from "react";
import styles from "./WaitingArea.module.css";

function WaitingArea({ title, statusText, message, showSpinner = true, actionButton }) {
    return (
        <div data-component="waiting-area" className={styles.waitingArea}>
            <h2 className={styles.title}>{title}</h2>
            {statusText && <p className={styles.statusText}>{statusText}</p>}
            
            {actionButton ? (
                actionButton
            ) : (
                (message || showSpinner) && (
                    <div className={styles.waitingMessage}>
                        {showSpinner && <div className={styles.spinner}></div>}
                        {message && <span>{message}</span>}
                    </div>
                )
            )}
        </div>
    );
}

export { WaitingArea };
export default WaitingArea;

import React from "react";
import styles from "./TurnEndSplash.module.css";

function TurnEndSplash({ word }) {
    return (
        <div data-component="turn-end-splash" className={styles.turnEndSplash}>
            <h1 className={styles.title}>Turn Ended!</h1>
            <p className={styles.subtitle}>
                The word was: <span className={styles.word}>{word}</span>
            </p>
        </div>
    );
}

export { TurnEndSplash };
export default TurnEndSplash;

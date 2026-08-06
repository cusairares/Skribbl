import React from "react";
import styles from "./MatchWinnerSplash.module.css";

function MatchWinnerSplash({ winner }) {
    const getWinnerName = (w) => {
        if (!w) return "Nobody";
        if (typeof w === "string") return w;
        if (typeof w === "object") {
            return w.username || w.Username || w.name || w.Name || "Nobody";
        }
        return String(w);
    };

    const winnerName = getWinnerName(winner);

    return (
        <div data-component="match-winner-splash" className={styles.matchWinnerSplash}>
            <h1 className={styles.title}>Game Over!</h1>
            <p className={styles.subtitle}>
                Winner: {winnerName}!
            </p>
        </div>
    );
}

export { MatchWinnerSplash };
export default MatchWinnerSplash;

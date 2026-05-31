import styles from "./PlayerList.module.css";

function PlayerList() {
    return (
        <div data-component="player-list" className={styles.playerList}>
            <h3>Player List</h3>
        </div>
    );
}

export { PlayerList };


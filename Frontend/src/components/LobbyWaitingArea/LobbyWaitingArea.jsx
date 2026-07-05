import styles from "./LobbyWaitingArea.module.css"

function LobbyWaitingArea({ isHost, onStartGame, isStarting }) {
    return (
        <div data-component="lobby-waiting-area" className={styles.lobbyWaiting}>
            <h2 className={styles.title}>Lobby</h2>
            <p className={styles.statusText}>Waiting for players to join...</p>
            {isHost ? (
                <button
                    data-component="button-start-game"
                    className={styles.buttonStart}
                    onClick={onStartGame}
                    disabled={isStarting}
                >
                    {isStarting ? "Starting..." : "Start Game"}
                </button>
            ) : (
                <div className={styles.waitingMessage}>
                    <div className={styles.spinner}></div>
                    <span>Waiting for the host to start the game...</span>
                </div>
            )}
        </div>
    );
}

export { LobbyWaitingArea };

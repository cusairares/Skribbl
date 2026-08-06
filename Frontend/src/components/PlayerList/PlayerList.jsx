import styles from "./PlayerList.module.css";
import { Player } from "../Player/Player";
function PlayerList({ participants = [] }) {
    return (
        <div data-component="player-list" className={styles.playerList}>
            {participants?.map((player, i) => (
                <Player 
                    player={player} 
                    index = {i}
                    key={player.id || player.name || i} 
                />
            ))}
        </div>
    );
}
export { PlayerList };
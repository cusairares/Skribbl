import styles from "./PlayerList.module.css";
import { Player } from "../Player/Player";
function PlayerList({ players = [] }) {
    const sortedPlayers = [...players].sort((a, b) => {
        const scoreA = a.score !== undefined ? a.score : 0;
        const scoreB = b.score !== undefined ? b.score : 0;
        
        return scoreB - scoreA; 
    });
    return (
        <div data-component="player-list" className={styles.playerList}>
            {sortedPlayers?.map((player, i) => (
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
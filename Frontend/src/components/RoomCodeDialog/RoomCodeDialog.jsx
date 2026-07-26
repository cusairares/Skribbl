import { useGameStore } from "../../hooks/useGameStore";
import styles from "./RoomCodeDialog.module.css"
function RoomCodeDialog({ toggleDialog, handleJoinRoom, isJoining }){
    const roomId = useGameStore((state) => state.roomId)
    const updateRoomId = useGameStore((state) => state.updateRoomId);

    return(
        <div data-component="room-code-dialog" className={styles.roomCodeDialog}>
            <input 
                placeholder="Enter the room code"
                className={styles.roomIdInput} 
                type="text" 
                value={roomId} 
                onChange={(e) => updateRoomId(e.target.value)}
                disabled={isJoining}
            />
            <button 
                className={styles.joinRoomButton}
                onClick={() => handleJoinRoom()}
                disabled={isJoining || roomId.trim().length === 0} 
            >
                {isJoining ? "Joining..." : "Join Room"}
            </button>
            <button className={styles.backButton} 
                disabled={isJoining}
                onClick={toggleDialog}
            >
                Back
            </button>
        </div>
    )
}


export {RoomCodeDialog}
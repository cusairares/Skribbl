import { useSessionStore } from "../../hooks/useSessionStore";
import styles from "./RoomCodeDialog.module.css"
function RoomCodeDialog({ toggleDialog, handleJoinRoom, isJoining }){
    const roomId = useSessionStore((state) => state.roomId)
    const updateRoomId = useSessionStore((state) => state.updateRoomId);

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
                onClick={() => {
                    updateRoomId("");
                    toggleDialog();
                }}
            >
                Back
            </button>
        </div>
    )
}


export {RoomCodeDialog}
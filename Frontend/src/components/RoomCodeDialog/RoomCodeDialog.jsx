import { useContext } from "react"
import { SessionContext } from "../../context/Session/SessionContext"
import styles from "./RoomCodeDialog.module.css"
function RoomCodeDialog({ toggleDialog, handleJoinRoom, isJoining }){
    const {roomId,updateRoomId} = useContext(SessionContext)

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
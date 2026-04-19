import { useContext, useState } from "react"
import styles from "./CharacterCreator.module.css"
import { RoomCodeDialog } from "../RoomIdDialog/RoomIdDialog"
import { GameContext } from "../../context/GameContext";

function CharacterCreator(){
    const {username,updateUsername,roomId,updateRoomId} = useContext(GameContext)

    const [isCreating,setIsCreating] = useState(false)
    const [isJoining,setIsJoining] = useState(false)
    const [isDialog, setIsDialog] = useState(false)

    const baseRoomUrl = "https://localhost:7064/api/rooms"
    const handleCreateRoom = async () =>{
        if(!username.trim()) return

        setIsCreating(true)

        try{
            const createRequest= await fetch(baseRoomUrl + '/create', { 
                method: 'POST' 
            });

            updateRoomId(await createRequest.json())

            console.log("Room ID received: ", roomId); 

            const joinRequest = await fetch(baseRoomUrl + `/${roomId}/join`, { 
                method: 'POST' ,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ Username: username.trim() })
            });

            if(joinRequest.ok){
                console.log("Successfully created room:", roomId);
                handleJoinRoom(roomId)
            }
            else{
                console.error("Failed to create the room.");
            }
        }
        catch(error){
            console.error("Network error:", error);
        }
        finally{
            setIsCreating(false)
        }

    }

    const handleJoinRoom = async () =>{
        if(!roomId.trim()) return

        setIsJoining(true)

        try{
            const joinRequest = await fetch(baseRoomUrl + `/${roomId}/join`,{
                method:"POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ Username: username.trim() })
            })
            
            if(joinRequest.ok){
                console.log("Player "+ username.trim() +" successfully joined room with id: " + roomId)
            }
            else{
                console.log("Failed to join room")
            }
        }
        catch(error){
            console.log("Network error: " + error)
        }
        finally{
            setIsJoining(false)
        }
    }

    const toggleDialog = () =>{
        setIsDialog(prevState =>
            !prevState
        )
    }

    return(
        <div className={styles.creatorWrapper}>
            {isDialog ?
            (<RoomCodeDialog 
                handleJoinRoom={handleJoinRoom} 
                toggleDialog={toggleDialog}
                isJoining={isJoining}
            />
            ):
            (
            <>
                <input 
                    placeholder="Enter your name"
                    className={styles.nameTextInput} 
                    type="text" 
                    value={username} 
                    onChange={(e) => updateUsername(e.target.value)}
                    disabled={isCreating || isJoining}
                />
                <button 
                    className={styles.createRoomButton}
                    onClick={handleCreateRoom}
                    disabled={isCreating || username.trim().length === 0} 
                >
                    {isCreating ? "Creating..." : "Create Room"}
                </button>
                <button className={styles.joinRoomButton} 
                    disabled={isJoining || username.trim().length === 0}
                    onClick={toggleDialog}
                >
                    {isJoining ? "Joining..." : "Join Room"}
                </button>
            </>
            )
            }
            
        </div>
    )

}
export {CharacterCreator}
import { useContext, useState } from "react"
import styles from "./CharacterCreator.module.css"
import { RoomCodeDialog } from "../RoomIdDialog/RoomIdDialog"
import { GameContext } from "../../context/GameContext";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { SignalRContext } from "../../context/SignalR/SignalRContext";
import { useNavigate } from "react-router";

function CharacterCreator(){
    const {username,updateUsername,roomId,updateRoomId} = useContext(GameContext)
    const {executeJoinRoom} = useContext(SignalRContext)

    const [isCreating,setIsCreating] = useState(false)
    const [isJoining,setIsJoining] = useState(false)
    const [isDialog, setIsDialog] = useState(false)
    const navigate = useNavigate();
    const baseRoomUrl = "https://localhost:7064/api/rooms"
    
    const handleCreateRoom = async () =>{
        if(!username.trim()) return

        setIsCreating(true)

        try{
            const createRequest= await fetch(baseRoomUrl + '/create', { 
                method: 'POST' 
            });

            let {roomId} = await createRequest.json();
            updateRoomId(roomId)

            console.log("Room ID received: ", roomId); 

            if(createRequest.ok){
                console.log("Successfully created room:", roomId);
                executeJoinRoom(username,roomId,navigate)
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
        setIsJoining(true)
        await executeJoinRoom(username,roomId,navigate)
        setIsJoining(false)
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
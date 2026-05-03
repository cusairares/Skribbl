import { useContext, useState } from "react"
import { RoomCodeDialog } from "../RoomIdDialog/RoomIdDialog"
import { SessionContext } from "../../context/Session/SessionContext";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { SignalRContext } from "../../context/SignalR/SignalRContext";
import { useNavigate } from "react-router";
import { AvatarCustomizer } from "../../features/AvatarCustomizer/AvatarCustomizer";
import styles from "./CharacterPanel.module.css"

function CharacterPanel(){
    const {username,updateUsername,roomId,updateRoomId} = useContext(SessionContext)
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
        <div data-testid="character-panel" className={styles.characterPanel}>
            {isDialog ?
            (<RoomCodeDialog 
                handleJoinRoom={handleJoinRoom} 
                toggleDialog={toggleDialog}
                isJoining={isJoining}
            />
            ):
            (
            <>
                <div data-testid="container-name-lang" className={styles.containerNameLang}>
                    <input 
                    data-testid="input-name"
                    placeholder="Enter your name"
                    className={styles.inputName} 
                    type="text" 
                    value={username} 
                    onChange={(e) => updateUsername(e.target.value)}
                    disabled={isCreating || isJoining}
                    />
                    <select data-testid="select-lang">
                        <option value={0}>English</option>
                        <option value={1}>Romanian</option>
                    </select>
                </div>
                <AvatarCustomizer></AvatarCustomizer>
                <button 
                    data-testid="button-play"
                    className={styles.buttonPlay}
                    onClick={handleJoinRoom}
                    disabled={isJoining || username.trim().length === 0} 
                >
                    {isJoining ? "Joining..." : "Play!"}
                </button>
                <button 
                    data-testid="button-create"
                    className={styles.buttonCreate} 
                    disabled={isCreating || username.trim().length === 0}
                    onClick={handleCreateRoom}
                >
                    {isCreating ? "Creating..." : "Create Room"}
                </button>
            </>
            )
            }
            
        </div>
    )

}
export {CharacterPanel}
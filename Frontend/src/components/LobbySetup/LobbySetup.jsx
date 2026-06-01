import { useContext, useState } from "react"
import { RoomCodeDialog } from "../RoomCodeDialog/RoomCodeDialog"
import { SessionContext } from "../../context/Session/SessionContext";
import { HubConnectionBuilder } from "@microsoft/signalr";
import { SignalRContext } from "../../context/SignalR/SignalRContext";
import { useNavigate } from "react-router";
import { AvatarCustomizer } from "../../features/AvatarCustomizer/AvatarCustomizer";
import styles from "./LobbySetup.module.css"

function LobbySetup(){
    const {username,updateUsername,roomId,updateRoomId,avatarOptions} = useContext(SessionContext)
    const {executeJoinRoom} = useContext(SignalRContext)

    const [isCreating,setIsCreating] = useState(false)
    const [isJoining,setIsJoining] = useState(false)
    const [isDialog, setIsDialog] = useState(false)
    const navigate = useNavigate();
    const baseRoomUrl = `${import.meta.env.VITE_GAME_URL}api/rooms`
    
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
                executeJoinRoom(roomId, { username, avatarOptions }, navigate)
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
        if(!roomId || !roomId.trim()){
            toggleDialog();
            return;
        }
        setIsJoining(true)
        await executeJoinRoom(roomId,{username, avatarOptions}, navigate)
        setIsJoining(false)
    }

    const toggleDialog = () =>{
        setIsDialog(prevState =>
            !prevState
        )
    }

    if (isDialog) {
        return (
            <RoomCodeDialog 
                handleJoinRoom={handleJoinRoom} 
                toggleDialog={toggleDialog}
                isJoining={isJoining}
            />
        );
    }

    return (
        <div data-component="lobby-setup" className={styles.lobbySetup}>
            <div data-component="container-name-lang" className={styles.containerNameLang}>
                <input 
                    data-component="input-name"
                    placeholder="Enter your name"
                    className={styles.inputName} 
                    type="text" 
                    value={username} 
                    onChange={(e) => updateUsername(e.target.value)}
                    disabled={isCreating || isJoining}
                />
                <select data-component="select-lang">
                    <option value={0}>English</option>
                    <option value={1}>Romanian</option>
                </select>
            </div>
            <AvatarCustomizer></AvatarCustomizer>
            <button 
                data-component="button-join"
                className={styles.buttonJoin}
                onClick={handleJoinRoom}
                disabled={isJoining || username.trim().length === 0} 
            >
                {isJoining ? "Joining..." : "Join Room"}
            </button>
            <button 
                data-component="button-create"
                className={styles.buttonCreate} 
                disabled={isCreating || username.trim().length === 0}
                onClick={handleCreateRoom}
            >
                {isCreating ? "Creating..." : "Create Room"}
            </button>
        </div>
    );

}
export {LobbySetup}
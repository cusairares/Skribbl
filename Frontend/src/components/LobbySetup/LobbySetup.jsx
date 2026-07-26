import { RoomCodeDialog } from "../RoomCodeDialog/RoomCodeDialog"

import { HubConnectionBuilder } from "@microsoft/signalr";
import { AvatarCustomizer } from "../../features/AvatarCustomizer/AvatarCustomizer";
import styles from "./LobbySetup.module.css"
import { useLobby } from "../../hooks/useLobby";
import { useGameStore } from "../../hooks/useGameStore";

function LobbySetup(){
    const username = useGameStore((state) => state.username);
    const updateUsername = useGameStore((state) => state.updateUsername)

    const {handleCreateRoom,handleJoinRoom,toggleDialog,isDialog,isJoining,isCreating} = useLobby();

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
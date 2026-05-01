import { useState } from "react";
import { GameContext } from "./GameContext";
import { HubConnectionBuilder } from "@microsoft/signalr";

function GameProvider({ children }) {
    const [username, setUsername] = useState("");
    const [roomId, setRoomId] = useState("");

    const updateUsername = (name) => setUsername(name);
    const updateRoomId = (id) => setRoomId(id);

    
    return (
        <GameContext.Provider value={{ username, updateUsername, roomId, updateRoomId}}>
            {children}
        </GameContext.Provider>
    );
}

export { GameProvider };
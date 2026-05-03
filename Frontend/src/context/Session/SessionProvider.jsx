import { useState } from "react";
import { SessionContext } from "./SessionContext";
import { HubConnectionBuilder } from "@microsoft/signalr";

function SessionProvider({ children }) {
    const [username, setUsername] = useState("");
    const [roomId, setRoomId] = useState("");

    const updateUsername = (name) => setUsername(name);
    const updateRoomId = (id) => setRoomId(id);

    
    return (
        <SessionContext.Provider value={{ username, updateUsername, roomId, updateRoomId}}>
            {children}
        </SessionContext.Provider>
    );
}

export { SessionProvider };
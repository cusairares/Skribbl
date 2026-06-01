import { HubConnectionBuilder } from "@microsoft/signalr";
import { useState } from "react";
import { SignalRContext } from "./SignalRContext";


function SignalRProvider({children}){
    const baseRoomUrl = `${import.meta.env.VITE_GAME_URL}api/rooms`
    const [connection,setConnection] = useState("");
    const [connectionId,setConnectionId] = useState("");

    const updateConnection = (connection) => setConnection(connection)
    const updateConnectionId = (connectionId) => setConnectionId(connectionId)

    const executeJoinRoom = async(targetRoomId, joinPayload, navigate)=>{
        if(!targetRoomId.trim()) return

        const targetUsername = joinPayload.username;
        const avatarOptions = joinPayload.avatarOptions;

        const connection = await getActiveConnection(targetUsername,targetRoomId)

        try{
            await connection.invoke("JoinSignalRGroup",{
                RoomId : targetRoomId,
                Username : targetUsername,
                AvatarOptions :avatarOptions,
            });

            const joinRoomDto = {
                Username: targetUsername.trim(),
                ConnectionId: connection.connectionId,
                AvatarOptions: avatarOptions
            };

            const joinRequest = await fetch(baseRoomUrl + `/join/${targetRoomId}`,{
                method:"POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(joinRoomDto)
            })
            
            if(joinRequest.ok){
                navigate(`/game/${targetRoomId}`)
                console.log("Player "+ targetUsername.trim() +" successfully joined room with id: " + targetRoomId + " and connectionId: " + connection.connectionId)
            }
            else{
                console.log("Failed to join room")
            }
        }
        catch(error){
            console.log("Network error: " + error)
        }
    }

    const getActiveConnection = async(targetUsername,targetRoomId)=>{
        const newConnection = new HubConnectionBuilder()
                .withUrl(`${import.meta.env.VITE_GAME_URL}gamehub`)
                .build()
        
        updateConnection(newConnection)

        await newConnection.start()
        console.log("SignalR Connection successful");

        const freshId = newConnection.connectionId; 

        console.log("SignalR ConnectionId: "+ freshId);
        updateConnection(newConnection);
        updateConnectionId(freshId);
        return newConnection
    }

    return(
        <SignalRContext.Provider value={{connection,updateConnection,connectionId,updateConnectionId,executeJoinRoom,getActiveConnection}}>
            {children}
        </SignalRContext.Provider>
    )
    
}

export {SignalRProvider}
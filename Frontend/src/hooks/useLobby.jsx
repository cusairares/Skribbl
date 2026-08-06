import { useState } from "react";
import { useNavigate } from "react-router";
import { useAvatarOptions } from "./useAvatarOptions";
import { useSessionStore } from "./useSessionStore";
import { useSignalRStore } from "./useSignalRStore";

export const useLobby = ()=> 
{
    const baseRoomUrl = `${import.meta.env.VITE_GAME_URL}api/rooms`

    const username = useSessionStore((state) => state.username);
    const roomId = useSessionStore((state) => state.roomId)
    const updateRoomId = useSessionStore((state) => state.updateRoomId)
    const updateHost = useSessionStore((state) => state.updateHost)

    const avatarOptions = useAvatarOptions((state) => state.avatarOptions);
    const joinRoom = useSignalRStore((state) => state.joinRoom)
    const navigate = useNavigate();

    const [isCreating,setIsCreating] = useState(false)
    const [isJoining,setIsJoining] = useState(false)
    const [isDialog, setIsDialog] = useState(false)

    
    
    const handleCreateRoom = async () =>{
        if(!username.trim()) return

        setIsCreating(true)

        try{
            const createRequest= await fetch(baseRoomUrl + '/create', { 
                method: 'POST' 
            });

            let {roomId} = await createRequest.json();
            updateRoomId(roomId)
            updateHost(true)

            console.log("Room ID received: ", roomId); 

            if(createRequest.ok){
                console.log("Successfully created room:", roomId);
                joinRoom(roomId, { username, avatarOptions }, navigate)
            }
        }
        catch(error){
            console.error(error);
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
        updateHost(false)
        await joinRoom(roomId,{username, avatarOptions}, navigate)
        setIsJoining(false)
    }

    const toggleDialog = () =>{
        setIsDialog(prevState =>
            !prevState
        )
    }

    return{
        handleCreateRoom,
        handleJoinRoom,
        toggleDialog,
        isCreating,
        isJoining,
        isDialog    
    }

}
import { useState } from "react";
import { SessionContext } from "./SessionContext";
import { HubConnectionBuilder } from "@microsoft/signalr";

function SessionProvider({ children }) {
    const features = {
        color: {cols: 10, rows: 3, total: 28},
        eyes: {cols: 10, rows: 6, total: 57},
        mouth: {cols: 10, rows: 6, total: 51},
    }
    const [username, setUsername] = useState("");
    const [roomId, setRoomId] = useState("");
    const [avatarOptions,setAvatarOptions] = useState({color:0,eyes:0,mouth:0});

    const updateUsername = (name) => setUsername(name);
    const updateRoomId = (id) => setRoomId(id);
    const updateAvatarOptions = (featureName,direction) =>{
        let config = features[featureName]
        setAvatarOptions(prev =>{
            let newIndex = direction == "right" ? prev[featureName] + 1 : prev[featureName] - 1;
            if(newIndex >= config.total) newIndex = 0;
            if(newIndex < 0) newIndex = config.total - 1;

            return {...prev,[featureName]:newIndex}
        })
    }
    const getStyle = (featureName)=>{
        const index = avatarOptions[featureName];
        const { cols } = features[featureName];

        const col = index % cols;
        const row = Math.floor(index / cols);


        const xPercent = cols > 1 ? (col / (cols - 1)) * 100 : 0;
        const yPercent = cols > 1 ? (row / (cols - 1)) * 100 : 0;

        return {
            backgroundPosition: `${xPercent}% ${yPercent}%`,
            backgroundSize: `1000% 1000%`, 
            imageRendering: 'pixelated',
            backgroundRepeat: 'no-repeat'
        };
    }


    return (
        <SessionContext.Provider value={{ username, updateUsername, roomId, updateRoomId,avatarOptions,updateAvatarOptions,getStyle}}>
            {children}
        </SessionContext.Provider>
    );
}

export { SessionProvider };
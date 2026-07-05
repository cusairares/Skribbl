import { useState } from "react";
import { UserContext } from "./UserContext";
import { HubConnectionBuilder } from "@microsoft/signalr";

function UserProvider({ children }) {
    const features = {
        colorIndex: {cols: 10, rows: 3, total: 28},
        eyesIndex: {cols: 10, rows: 6, total: 57},
        mouthIndex: {cols: 10, rows: 6, total: 51},
    }
    const [username, setUsername] = useState("");
    const [roomId, setRoomId] = useState("");
    const [avatarOptions,setAvatarOptions] = useState({colorIndex:0,eyesIndex:0,mouthIndex:0});
    const [isHost, setIsHost] = useState(false);

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
    const getStyle = (avatarOptions, featureName) => {
        if (!avatarOptions) return {};
        const index = avatarOptions[featureName] ?? 0;
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
        <UserContext.Provider value={{ username, updateUsername, roomId, updateRoomId,avatarOptions,updateAvatarOptions,getStyle, isHost, setIsHost}}>
            {children}
        </UserContext.Provider>
    );
}

export { UserProvider };
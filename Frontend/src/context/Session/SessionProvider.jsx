import { useState } from "react";
import { SessionContext } from "./SessionContext";

function SessionProvider({ children }) {
    const [currentWord, setCurrentWord] = useState("");
    const [currentRound, setCurrentRound] = useState(1);
    const [totalRounds, setTotalRounds] = useState(3); 
    const [participants, setParticipants] = useState([]);
    const [turnEndTime, setTurnEndTime] = useState(null);
    const [role, setRole] = useState(null);
    const [wordOptions, setWordOptions] = useState([]); // string[]
    const [isWordSelected, setIsWordSelected] = useState(false);

    return (
        <SessionContext.Provider value={{ 
            currentWord, setCurrentWord, 
            currentRound, setCurrentRound, 
            totalRounds, setTotalRounds,
            participants, setParticipants,
            turnEndTime, setTurnEndTime,
            role, setRole,
            wordOptions, setWordOptions,
            isWordSelected, setIsWordSelected
        }}>
            {children}
        </SessionContext.Provider>
    );
}

export { SessionProvider };

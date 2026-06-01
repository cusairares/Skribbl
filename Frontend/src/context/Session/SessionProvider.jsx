import { useState } from "react";
import { SessionContext } from "./SessionContext";

function SessionProvider({ children }) {
    const [currentWord, setCurrentWord] = useState("");
    const [currentRound, setCurrentRound] = useState(1);
    const [totalRounds, setTotalRounds] = useState(3); // Default to 3 rounds
    const [participants, setParticipants] = useState([]);
    const [turnEndTime, setTurnEndTime] = useState(null);

    return (
        <SessionContext.Provider value={{ 
            currentWord, setCurrentWord, 
            currentRound, setCurrentRound, 
            totalRounds, setTotalRounds,
            participants, setParticipants,
            turnEndTime, setTurnEndTime
        }}>
            {children}
        </SessionContext.Provider>
    );
}

export { SessionProvider };

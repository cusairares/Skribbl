import { useState } from "react";
import { GameContext } from "./GameContext";

function GameProvider({ children }) {
    const [currentWord, setCurrentWord] = useState("");
    const [currentRound, setCurrentRound] = useState(1);
    const [totalRounds, setTotalRounds] = useState(3); // Default to 3 rounds

    return (
        <GameContext.Provider value={{ currentWord, setCurrentWord, currentRound, setCurrentRound, totalRounds, setTotalRounds }}>
            {children}
        </GameContext.Provider>
    );
}

export { GameProvider };

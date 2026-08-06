import { PlayerList } from "../../components/PlayerList/PlayerList"
import { Canvas } from "../../features/Canvas/Canvas"
import { GameStatusBar } from "../../components/GameStatusBar/GameStatusBar"
import { Chat } from "../../features/Chat/Chat"
import styles  from "./Game.module.css"
import logo from '../../assets/logo.gif';
import { ToolTip } from "../../features/ToolTip/ToolTip"
import { useEffect, useRef, useState } from "react"
import { WordPicker } from "../../components/WordPicker/WordPicker"
import { WaitingArea } from "../../components/WaitingArea/WaitingArea"
import { RoleSplash } from "../../components/RoleSplash/RoleSplash"
import waitingStyles from "../../components/WaitingArea/WaitingArea.module.css"
import { useSessionStore } from "../../hooks/useSessionStore"
import { useRoundStore } from "../../hooks/useRoundStore"
import { useWordStore } from "../../hooks/useWordStore"

import { useSignalRStore } from "../../hooks/useSignalRStore"

function Game(){
    const connection = useSignalRStore((state) => state.connection)
    const roomId = useSessionStore((state) => state.roomId);
    const isHost = useSessionStore((state) => state.isHost);
    const participants = useSessionStore((state) => state.participants);
    const setParticipants = useSessionStore((state) => state.setParticipants);

    const role = useRoundStore((state) => state.role);
    const setRole = useRoundStore((state) => state.setRole);
    const setCurrentRound = useRoundStore((state) => state.setCurrentRound);
    const setTotalRounds = useRoundStore((state) => state.setTotalRounds);
    const setTurnEndTime = useRoundStore((state) => state.setTurnEndTime);
    const setIsTurnActive = useRoundStore((state) => state.setIsTurnActive);

    const wordOptions = useWordStore((state) => state.wordOptions);
    const setWordOptions = useWordStore((state) => state.setWordOptions);
    const isWordSelected = useWordStore((state) => state.isWordSelected);
    const setIsWordSelected = useWordStore((state) => state.setIsWordSelected);
    const setCurrentWord = useWordStore((state) => state.setCurrentWord);

    const isGameStarted = useSessionStore((state) => state.isGameStarted);
    const setIsGameStarted = useSessionStore((state) => state.setIsGameStarted);
    const showRoleSplash = useRoundStore((state) => state.showRoleSplash);
    const setShowRoleSplash = useRoundStore((state) => state.setShowRoleSplash);
    const [isStarting, setIsStarting] = useState(false);
    
    const splashTimerRef = useRef(null)

    useEffect(() => {
        const fetchInitialParticipants = async () => {
            if (!roomId) return;
            try {
                const response = await fetch(`${import.meta.env.VITE_GAME_URL}api/${roomId}`);
                if (response.ok) {
                    const data = await response.json();
                    setParticipants(data.participants || []);
                }
            } catch (error) {
                console.error("Failed to fetch initial participants:", error);
            }
        };
        fetchInitialParticipants();

        connection.on("PlayerJoined", (newPlayer) => {
            setParticipants((prev) => prev ? [...prev, newPlayer] : [newPlayer]);
        });
        connection.on("PlayerDisconnected", (disconnectedId) => {
            setParticipants((prev) => prev ? prev.filter(p => p.connectionId !== disconnectedId) : []);
        });
        connection.on("GameStarted", () => {
            setIsGameStarted(true);
        });
        connection.on("RoundStarted", (data) => {
            console.log("Round started:", data);
            setCurrentRound(data.currentRound);
            setTotalRounds(data.totalRounds);
        });
        connection.on("OnRoleAssigned", (roleAssignmentEvent) => handleRoleAssignment(roleAssignmentEvent));
        connection.on("OnTurnStarted", (turnStartedEvent) => {
            console.log("Turn started payload:", turnStartedEvent);
            setIsTurnActive(true);
            setCurrentWord(turnStartedEvent.word);
            setTurnEndTime(turnStartedEvent.turnEndTime);
            setCurrentRound(turnStartedEvent.currentRound);
            setTotalRounds(turnStartedEvent.totalRounds);
            setIsWordSelected(true);
        });

        connection.on("OnTurnEnded", (data) => {
            console.log("Turn ended. Word was:", data.word);
            setIsTurnActive(true);
            setCurrentWord(data.word);
            setTurnEndTime(null);
        });

        connection.on("GameEnded", (data) => {
            console.log("Game ended. Winner:", data.winner);
            setIsTurnActive(false);
            setIsGameStarted(false);
            setIsWordSelected(false);
            setRole(null);
            setCurrentWord("");
            setTurnEndTime(null);
        });

        connection.on("UpdatePlayers", (updatedPlayers) => {
            setParticipants(updatedPlayers);
        });

        return () => {
            connection.off("PlayerJoined");
            connection.off("PlayerDisconnected");
            connection.off("GameStarted");
            connection.off("RoundStarted");
            connection.off("OnRoleAssigned");
            connection.off("OnTurnStarted");
            connection.off("OnTurnEnded");
            connection.off("GameEnded");
            connection.off("UpdatePlayers");
            if (splashTimerRef.current) {
                clearTimeout(splashTimerRef.current);
            }
        };
    }, [])

    const handleRoleAssignment = (roleAssignmentEvent) => {
        console.log("Role assigned: ", roleAssignmentEvent);
        setRole(roleAssignmentEvent.role);
        setWordOptions(roleAssignmentEvent.wordList || []);
        setIsWordSelected(false);

        if (splashTimerRef.current) {
            clearTimeout(splashTimerRef.current);
        }
        setShowRoleSplash(true);
        splashTimerRef.current = setTimeout(() => {
            setShowRoleSplash(false);
        }, 2000);
    };

    const handleSelectWord = async (word) => {
        try {
            await connection.invoke("SelectWord", word);
        } catch (error) {
            console.error("Failed to select word: ", error);
        }
    };
    
    const handleStartGame = async () => {
        setIsStarting(true);
        try {
            await connection.invoke("StartGame");
        } catch (error) {
            console.error("Failed to start game: ", error);
        } finally {
            setIsStarting(false);
        }
    };

    return(
        <div data-component="game" className={styles.gameContainer}>
            <img className={styles.logo} src={logo} alt="logo" />
            <header className={styles.header}>
                <GameStatusBar />
            </header>
            <main data-component="main" className={styles.main}>
                <PlayerList participants={participants}></PlayerList>
                <div data-component="game-draw" className={styles.draw}>
                    {isGameStarted ? (
                        showRoleSplash ? 
                        (
                            <RoleSplash role={role} />
                        ) : !isWordSelected ? (
                            role === "Drawer" ? (
                                <WordPicker words={wordOptions} onSelectWord={handleSelectWord} />
                            ) : (
                                <WaitingArea 
                                    title="Round Starting"
                                    message="Drawer is picking a word..."
                                    showSpinner={true}
                                />
                            )
                        ) : (
                            <>
                                <div className={styles.canvasContainer}>
                                    <Canvas data-component="canvas" isDrawer={role === "Drawer"}></Canvas>
                                </div>
                                <div className={styles.toolTipContainer}>
                                    <ToolTip></ToolTip>
                                </div>
                            </>
                        )
                    ) : (
                        <WaitingArea 
                            title="Lobby"
                            statusText="Waiting for players to join..."
                            message="Waiting for the host to start the game..."
                            showSpinner={!isHost}
                            actionButton={isHost && (
                                <button
                                    data-component="button-start-game"
                                    className={waitingStyles.buttonStart}
                                    onClick={handleStartGame}
                                    disabled={isStarting}
                                >
                                    {isStarting ? "Starting..." : "Start Game"}
                                </button>
                            )}
                        />
                    )}
                </div>
                <Chat></Chat>
            </main>
        </div>
    )
}

export { Game }


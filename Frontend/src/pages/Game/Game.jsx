import { PlayerList } from "../../components/PlayerList/PlayerList"
import { Canvas } from "../../features/Canvas/Canvas"
import { GameStatusBar } from "../../components/GameStatusBar/GameStatusBar"
import { Chat } from "../../features/Chat/Chat"
import styles  from "./Game.module.css"
import logo from '../../assets/logo.gif';
import { ToolTip } from "../../features/ToolTip/ToolTip"
import { useContext, useEffect, useState, useRef } from "react"
import { UserContext } from "../../context/User/UserContext"
import { SignalRContext } from "../../context/SignalR/SignalRContext"
import { SessionContext } from "../../context/Session/SessionContext"
import { WordPicker } from "../../components/WordPicker/WordPicker"
import { WaitingArea } from "../../components/WaitingArea/WaitingArea"
import { RoleSplash } from "../../components/RoleSplash/RoleSplash"
import waitingStyles from "../../components/WaitingArea/WaitingArea.module.css"

function Game(){
    const {connection} = useContext(SignalRContext)
    const {roomId, isHost} = useContext(UserContext)
    const {
        participants: players, 
        setParticipants: setPlayers,
        role, 
        setRole,
        wordOptions, 
        setWordOptions,
        isWordSelected, 
        setIsWordSelected,
        setCurrentWord,
        setTurnEndTime,
        setCurrentRound,
        setTotalRounds
    } = useContext(SessionContext)
    const [isStarted, setIsStarted] = useState(false)
    const [isStarting, setIsStarting] = useState(false)
    const [showRoleSplash, setShowRoleSplash] = useState(false)
    const splashTimerRef = useRef(null)
    const baseRoomUrl = import.meta.env.VITE_GAME_URL
    
    const fetchPlayers = async () => {
    try {
        const response = await fetch(baseRoomUrl+ "api/"+ roomId, {
            method: "GET"
        });
        if (response.ok) {
            const data = await response.json();
            setPlayers(data.participants ?? []);
        }
    } catch (error) {
        console.error("Network error fetching players: " + error);
    }
    };

    useEffect(() => {
        fetchPlayers();
        connection.on("PlayerJoined", (newPlayer) => {
            setPlayers((prev) => prev ? [...prev, newPlayer] : [newPlayer]);
        });
        connection.on("PlayerDisconnected", (disconnectedId) => {
            setPlayers((prev) => prev ? prev.filter(p => p.connectionId !== disconnectedId) : []);
        });
        connection.on("GameStarted", () => {
            setIsStarted(true);
        });

        connection.on("RoundStarted", (data) => {
            console.log("Round started:", data);
            setCurrentRound(data.currentRound);
            setTotalRounds(data.totalRounds);
        });

        connection.on("OnRoleAssigned", (roleAssignmentEvent) => handleRoleAssignment(roleAssignmentEvent));
        
        connection.on("OnTurnStarted", (turnStartedEvent) => {
            console.log("Turn started payload:", turnStartedEvent);
            setCurrentWord(turnStartedEvent.word);
            setTurnEndTime(turnStartedEvent.turnEndTime);
            setCurrentRound(turnStartedEvent.currentRound);
            setTotalRounds(turnStartedEvent.totalRounds);
            setIsWordSelected(true);
        });

        connection.on("OnTurnEnded", (data) => {
            console.log("Turn ended. Word was:", data.word);
            setCurrentWord(data.word);
            setTurnEndTime(null);
        });

        connection.on("GameEnded", (data) => {
            console.log("Game ended. Winner:", data.winner);
            setIsStarted(false);
            setIsWordSelected(false);
            setRole(null);
            setCurrentWord("");
            setTurnEndTime(null);
        });

        connection.on("UpdatePlayers", (updatedPlayers) => {
            setPlayers(updatedPlayers);
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
                <PlayerList players={players}></PlayerList>
                <div data-component="game-draw" className={styles.draw}>
                    {isStarted ? (
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


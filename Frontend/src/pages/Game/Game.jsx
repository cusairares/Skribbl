import { PlayerList } from "../../components/PlayerList/PlayerList"
import { Canvas } from "../../features/Canvas/Canvas"
import { GameHeader } from "../../components/GameHeader/GameHeader"
import { ChatBox } from "../../features/ChatBox/ChatBox"
import styles  from "./Game.module.css"
import logo from '../../assets/logo.gif';
import { ToolTip } from "../../features/ToolTip/ToolTip"
import { useContext, useEffect, useState } from "react"
import { SessionContext } from "../../context/Session/SessionContext"
import { SignalRContext } from "../../context/SignalR/SignalRContext"
function Game(){
    const {connection} = useContext(SignalRContext)
    const {roomId} = useContext(SessionContext)
    const [players, setPlayers] = useState([]);
    const baseRoomUrl = import.meta.env.VITE_GAME_URL
    
    useEffect(() => {
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
        fetchPlayers();
        connection.on("PlayerJoined", (newPlayer) => {
            setPlayers((prev) => prev ? [...prev, newPlayer] : [newPlayer]);
        });

        return () => {
            connection.off("PlayerJoined");
        };
    },[])
    return(
        <div data-component="game" className={styles.gameContainer}>
            <img className={styles.logo} src={logo}></img>
            <header className={styles.header}>
                <GameHeader />
            </header>
            <main data-component="main" className={styles.main}>
                <PlayerList players={players}></PlayerList>
                <div data-component="game-draw" className={styles.draw}>
                    <div className={styles.canvasContainer}>
                        <Canvas data-component="canvas"></Canvas>
                    </div>
                    <div className={styles.toolTipContainer}>
                        <ToolTip></ToolTip>
                    </div>
                </div>
                <ChatBox></ChatBox>
            </main>
        </div>
    )
}

export {Game}


import { PlayerList } from "../../components/PlayerList/PlayerList"
import { Canvas } from "../../features/Canvas/Canvas"
import { GameHeader } from "../../components/GameHeader/GameHeader"
import { Chatbox } from "../../features/Chatbox/Chatbox"
import styles  from "./Game.module.css"

function Game(){
    return(
        <div data-testid="game" className={styles.game}>
            <GameHeader></GameHeader>
            <div data-testid="main" className={styles.main}>
                <PlayerList></PlayerList>
                <Canvas data-testid="canvas" className={styles.canvas}></Canvas>
                <Chatbox></Chatbox>
            </div>
        </div>
    )
}

export {Game}
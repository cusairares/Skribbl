import { PlayerList } from "../../components/PlayerList/PlayerList"
import { Canvas } from "../../features/Canvas/Canvas"
import { GameHeader } from "../../components/GameHeader/GameHeader"
import { ChatBox } from "../../features/ChatBox/ChatBox"
import styles  from "./Game.module.css"
import logo from '../../assets/logo.gif';
import { ToolTip } from "../../features/ToolTip/ToolTip"
function Game(){
    return(
        <div data-component="game" className={styles.gameContainer}>
            <img className={styles.logo} src={logo}></img>
            <header className={styles.header}>
                <GameHeader />
            </header>
            <main data-component="main" className={styles.main}>
                <PlayerList></PlayerList>
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


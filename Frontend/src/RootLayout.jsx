import { Outlet } from "react-router-dom";
import { GameProvider } from "./context/GameProvider";

export default function RootLayout() {
    return (
        <GameProvider>
            <main>
                <Outlet/> 
            </main>
        </GameProvider>
    );
}
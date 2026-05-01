import { Outlet } from "react-router-dom";
import { GameProvider } from "./context/GameProvider";
import { SignalRProvider } from "./context/SignalR/SignalRProvider";

export default function RootLayout() {
    return (
        <GameProvider>
            <SignalRProvider>
                 <main>
                    <Outlet/> 
                </main>
            </SignalRProvider>
        </GameProvider>
    );
}
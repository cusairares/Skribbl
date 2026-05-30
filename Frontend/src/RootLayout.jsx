import { Outlet } from "react-router-dom";
import { SessionProvider } from "./context/Session/SessionProvider";
import { SignalRProvider } from "./context/SignalR/SignalRProvider";
import { GameProvider } from "./context/Game/GameProvider";

export default function RootLayout() {
    return (
        <SessionProvider>
            <SignalRProvider>
                <GameProvider>
                     <main>
                        <Outlet/> 
                    </main>
                </GameProvider>
            </SignalRProvider>
        </SessionProvider>
    );
}
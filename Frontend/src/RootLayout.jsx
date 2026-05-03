import { Outlet } from "react-router-dom";
import { SessionProvider } from "./context/Session/SessionProvider";
import { SignalRProvider } from "./context/SignalR/SignalRProvider";

export default function RootLayout() {
    return (
        <SessionProvider>
            <SignalRProvider>
                 <main>
                    <Outlet/> 
                </main>
            </SignalRProvider>
        </SessionProvider>
    );
}
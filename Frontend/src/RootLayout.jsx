import { Outlet } from "react-router-dom";
import { UserProvider } from "./context/User/UserProvider";
import { SignalRProvider } from "./context/SignalR/SignalRProvider";
import { SessionProvider } from "./context/Session/SessionProvider";

export default function RootLayout() {
    return (
        <UserProvider>
            <SignalRProvider>
                <SessionProvider>
                     <main>
                        <Outlet/> 
                    </main>
                </SessionProvider>
            </SignalRProvider>
        </UserProvider>
    );
}
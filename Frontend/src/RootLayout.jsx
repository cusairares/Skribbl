import { Outlet } from "react-router-dom";
import { SessionProvider } from "./context/Session/SessionProvider";

export default function RootLayout() {
    return (
        <SessionProvider>
                <main>
                <Outlet/> 
            </main>
        </SessionProvider>
    );
}

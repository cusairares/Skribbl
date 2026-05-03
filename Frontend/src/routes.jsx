import { Game } from "./pages/Game/Game";
import { Home } from "./pages/Home/Home";
import RootLayout from "./RootLayout";

const routes = [
    {
        path: "/",
        element: <RootLayout />,
        children: [
            { path: "/", element: <Home /> },
            { path: "/game/:roomId", element: <Game /> },
        ]
    }
];

export {routes}
import { Game } from "./components/Game/Game";
import { Home } from "./components/Home/Home";
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
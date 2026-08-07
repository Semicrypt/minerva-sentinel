import { io } from "socket.io-client";

/*
|--------------------------------------------------------------------------
| Socket.IO Client
|--------------------------------------------------------------------------
|
| Connect to the same origin as the React application.
|
| Browser:
| localhost:5173/socket.io
|
| Vite Proxy:
| localhost:5173/socket.io
|          ↓
| 127.0.0.1:5000/socket.io
|
*/

const socket = io({

    path: "/socket.io",

    autoConnect: true,

    reconnection: true,

    reconnectionAttempts: Infinity,

    reconnectionDelay: 1000,

    reconnectionDelayMax: 5000,

    timeout: 10000

});

export default socket;
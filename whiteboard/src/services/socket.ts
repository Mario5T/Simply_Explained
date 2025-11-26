import { io, Socket } from "socket.io-client";

let socket: Socket;

export function connectSocket(token: string, sessionId: string) {
    socket = io("http://localhost:3001", {
        auth: { token },
        query: { sessionId }
    });
    return socket;
}

export function getSocket(): Socket {
    if (!socket) {
        throw new Error('Socket not connected. Make sure connectSocket() was called first.');
    }
    return socket;
}
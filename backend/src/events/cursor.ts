import { Server, Socket } from "socket.io";

export function handleCursor(server: Server, socket: Socket, session_id: string) {
    socket.on("cursor", (data) => {
        server.to(session_id).emit("cursor", {
            id: socket.id,
            username: socket.data.username || 'Anonymous',
            ...data
        });
    })

}

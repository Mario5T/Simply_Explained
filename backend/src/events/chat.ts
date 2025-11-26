import { Server, Socket } from "socket.io";

interface ChatMessage {
    id: string;
    username: string;
    message: string;
    timestamp: number;
}

export function handleChat(server: Server, socket: Socket, session_id: string) {
    socket.on("chat-message", (data: { message: string }) => {
        const chatMessage: ChatMessage = {
            id: crypto.randomUUID(),
            username: socket.data.username || 'Anonymous',
            message: data.message,
            timestamp: Date.now()
        };

        console.log(`Chat message in session ${session_id} from ${chatMessage.username}: ${chatMessage.message}`);
        server.to(session_id).emit("chat-message", chatMessage);
        socket.emit("chat-message", chatMessage);
    });
}

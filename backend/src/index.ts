import express from "express";
import http from "http";
import cors from "cors";
import { Server, Socket } from "socket.io";
import { handleCursor } from "./events/cursor.js";
import { handleStroke } from "./events/stroke.js";
import { handleChat } from "./events/chat.js";
import { keycloakAuth } from "./middleware/keycloakAuth.js";
import invitationRoutes from "./routes/invitation.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use('/api', invitationRoutes);

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

io.use(keycloakAuth);

io.on("connection", (socket: Socket) => {
    console.log("User connected:", socket.id);
    const session_id = socket.handshake.query.sessionId as string;
    console.log("Session ID:", session_id);

    if (!session_id) {
        console.warn("No session ID provided");
        socket.disconnect();
        return;
    }
    socket.join(session_id);
    console.log(`Socket ${socket.id} joined session: ${session_id}`);

    handleStroke(io, socket, session_id);
    handleCursor(io, socket, session_id);
    handleChat(io, socket, session_id);

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
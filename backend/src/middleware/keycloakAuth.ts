import { Socket } from "socket.io";

interface TokenPayload {
    preferred_username?: string;
    sub?: string;
}

export function keycloakAuth(socket: Socket, next: (err?: Error) => void) {
    const token = socket.handshake.auth.token;
    const sessionId = socket.handshake.query.sessionId;

    console.log("Auth middleware - Token present:", !!token);
    console.log("Auth middleware - Session ID:", sessionId);

    if (!token) {
        console.warn("No token provided for socket:", socket.id);
        return next(new Error("Authentication error: No token provided"));
    }

    try {
        const tokenParts = token.split('.');
        if (tokenParts.length === 3) {
            const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
            const username = payload.preferred_username || payload.sub || 'Anonymous';
            socket.data.username = username;
            console.log("Socket authenticated successfully:", socket.id, "Username:", username);
        }
    } catch (error) {
        console.error("Error decoding token:", error);
        socket.data.username = 'Anonymous';
    }

    next();
}
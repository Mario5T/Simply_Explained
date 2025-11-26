import { Server, Socket } from "socket.io";

export function handleStroke(server: Server, socket: Socket, session_id: string) {
    socket.on("stroke-created", (stroke) => {
        console.log("Stroke created in session:", session_id);
        socket.to(session_id).emit("stroke-created", stroke);
    });

    socket.on("stroke-undo", (stroke_id: string) => {
        console.log("Stroke undo in session:", session_id);
        socket.to(session_id).emit("stroke-undo", stroke_id);
    });

    socket.on("stroke-redo", (stroke: any) => {
        console.log("Stroke redo in session:", session_id);
        socket.to(session_id).emit("stroke-redo", stroke);
    });
}
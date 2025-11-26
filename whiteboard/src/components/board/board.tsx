import { useEffect, useRef, useState } from "react";
import { Stage, Layer, Line } from "react-konva";
import { getSocket } from "../../services/socket";
import { useUndoRedo } from "../../hooks/undoredo";
import Tools from "./tools";
import Cursor from "./cursor";
import Chat from "./chat";
import Navbar from "../layout/navbar";
import keycloak from "../../services/keycloak";
import Konva from "konva";

interface Stroke {
    points: number[];
    color: string;
    width: number;
    id: string;
}

interface CursorData {
    id: string;
    x: number;
    y: number;
    username: string;
}

interface ChatMessage {
    id: string;
    username: string;
    message: string;
    timestamp: number;
}

export default function Whiteboard({ sessionId }: { sessionId: string }) {
    const [strokes, setStrokes] = useState<Stroke[]>([]);
    const [current, setCurrent] = useState<Stroke | null>(null);
    const [cursors, setCursors] = useState<Record<string, CursorData>>({});
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [color, setColor] = useState<string>("#000000");
    const [brushSize, setBrushSize] = useState<number>(4);
    const [canvasSize, setCanvasSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight - 140
    });
    const stageRef = useRef<Konva.Stage | null>(null);

    const { push, undo, redo, canUndo, canRedo } = useUndoRedo<Stroke>();
    useEffect(() => {
        const handleResize = () => {
            setCanvasSize({
                width: window.innerWidth,
                height: window.innerHeight - 140
            });
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        try {
            const socket = getSocket();

            socket.on("stroke-created", (stroke: Stroke) => {
                setStrokes((prev) => [...prev, stroke]);
            });

            socket.on("stroke-undo", (strokeId: string) => {
                setStrokes((prev) => prev.filter((s) => s.id !== strokeId));
            });

            socket.on("stroke-redo", (stroke: Stroke) => {
                setStrokes((prev) => [...prev, stroke]);
            });

            socket.on("cursor", (data: CursorData) => {
                setCursors((prev) => ({ ...prev, [data.id]: data }));
            });

            socket.on("chat-message", (message: ChatMessage) => {
                setChatMessages((prev) => [...prev, message]);
            });
        } catch (error) {
            console.error("Error setting up socket listeners:", error);
        }
    }, []);

    function startDrawing() {
        if (!stageRef.current) return;
        const pos = stageRef.current.getPointerPosition();
        if (!pos) return;
        const stroke: Stroke = {
            points: [pos.x, pos.y],
            color: color,
            width: brushSize,
            id: crypto.randomUUID()
        };
        setCurrent(stroke);
    }

    function draw() {
        if (!current) return;
        if (!stageRef.current) return;
        const pos = stageRef.current.getPointerPosition();
        if (!pos) return;

        const updatedStroke = {
            ...current,
            points: [...current.points, pos.x, pos.y]
        };
        setCurrent(updatedStroke);

        getSocket().emit("cursor", { x: pos.x, y: pos.y });
    }

    function endDrawing() {
        if (!current) return;

        setStrokes((prev) => [...prev, current]);

        getSocket().emit("stroke-created", current);
        push(current);
        setCurrent(null);
    }

    function handleUndo() {
        if (!canUndo()) return;
        const stroke = undo();
        if (!stroke) return;

        getSocket().emit("stroke-undo", stroke.id);
        setStrokes((prev) => prev.filter((s) => s.id !== stroke.id));
    }

    function handleRedo() {
        if (!canRedo()) return;
        const stroke = redo();
        if (!stroke) return;

        getSocket().emit("stroke-redo", stroke);
        setStrokes((prev) => [...prev, stroke]);
    }

    function sendChatMessage(message: string) {
        getSocket().emit("chat-message", { message });
    }

    return (
        <div className="whiteboard-container">
            <Navbar />
            <Tools
                undo={handleUndo}
                redo={handleRedo}
                canUndo={canUndo()}
                canRedo={canRedo()}
                stageRef={stageRef}
                sessionId={sessionId}
                color={color}
                setColor={setColor}
                brushSize={brushSize}
                setBrushSize={setBrushSize}
            />

            <div className="canvas-container">
                <Stage
                    width={canvasSize.width}
                    height={canvasSize.height}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={endDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={endDrawing}
                    ref={stageRef}
                    style={{ cursor: 'crosshair', touchAction: 'none' }}
                >
                    <Layer>
                        {strokes.map((stroke) => (
                            <Line
                                key={stroke.id}
                                points={stroke.points}
                                stroke={stroke.color}
                                strokeWidth={stroke.width}
                                tension={0.5}
                                lineCap="round"
                                lineJoin="round"
                            />
                        ))}
                        {current && (
                            <Line
                                points={current.points}
                                stroke={current.color}
                                strokeWidth={current.width}
                                tension={0.5}
                                lineCap="round"
                                lineJoin="round"
                            />
                        )}
                    </Layer>
                </Stage>
                <Cursor cursors={cursors} />
                <Chat
                    messages={chatMessages}
                    onSendMessage={sendChatMessage}
                    currentUsername={keycloak.tokenParsed?.preferred_username || 'Anonymous'}
                />
            </div>
        </div>
    );
}

import { getSocket } from "../../services/socket";

interface CursorData {
    id: string;
    x: number;
    y: number;
    username: string;
}

interface CursorProps {
    cursors: Record<string, CursorData>;
}

function getColorForId(id: string): string {
    const colors = [
        '#FF6B6B',
        '#4ECDC4',
        '#45B7D1',
        '#FFA07A',
        '#98D8C8',
        '#F7DC6F',
        '#BB8FCE',
        '#85C1E2',
        '#F8B739',
        '#52C41A',
    ];
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
}

export default function Cursor({ cursors }: CursorProps) {
    const ownSocketId = getSocket().id;

    return (
        <>
            {Object.keys(cursors)
                .filter(id => id !== ownSocketId)
                .map((id) => {
                    const cursor = cursors[id];
                    const color = getColorForId(id);

                    return (
                        <div
                            key={id}
                            style={{
                                position: 'absolute',
                                left: cursor.x,
                                top: cursor.y,
                                pointerEvents: 'none',
                                transform: "translate(-50%, -50%)",
                                zIndex: 1000
                            }}
                        >
                            <div
                                style={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: '50%',
                                    backgroundColor: color,
                                    border: '2px solid white',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                                }}
                            />
                            <div
                                style={{
                                    position: 'absolute',
                                    top: 16,
                                    left: 0,
                                    backgroundColor: color,
                                    color: 'white',
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    fontSize: '11px',
                                    fontWeight: 'bold',
                                    whiteSpace: 'nowrap',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                                }}
                            >
                                {cursor.username || 'Anonymous'}
                            </div>
                        </div>
                    );
                })}
        </>
    );
}
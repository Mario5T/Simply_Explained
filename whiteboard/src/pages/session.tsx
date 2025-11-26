import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import WhiteBoard from "../components/board/board";
import keycloak from "../services/keycloak";
import { connectSocket } from "../services/socket";


export default function Session() {
    const { id } = useParams();
    const [socketReady, setSocketReady] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let timeoutId: number;

        const initSocket = () => {
            if (!keycloak.token) {
                console.log("Waiting for Keycloak token...");
                timeoutId = setTimeout(initSocket, 100);
                return;
            }

            if (!id) {
                setError("No session ID provided");
                return;
            }

            console.log("Connecting socket with token...");
            const socket = connectSocket(keycloak.token, id);

            socket.on("connect", () => {
                console.log("Socket connected successfully");
                setSocketReady(true);
            });

            socket.on("connect_error", (err) => {
                console.error("Socket connection error:", err);
                setError("Failed to connect to session. Please try again.");
            });
            timeoutId = setTimeout(() => {
                if (!socketReady) {
                    setError("Connection timeout. Please refresh the page.");
                }
            }, 10000);
        };

        initSocket();

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [id, socketReady]);

    if (error) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="text-center">
                    <div className="alert alert-danger" role="alert">
                        <h4 className="alert-heading">Connection Error</h4>
                        <p>{error}</p>
                        <hr />
                        <button className="btn btn-primary" onClick={() => window.location.reload()}>
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!socketReady) {
        return (
            <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
                <div className="text-center">
                    <div className="spinner-border text-primary mb-3" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="text-muted">Connecting to session...</p>
                </div>
            </div>
        );
    }

    return (
        <WhiteBoard sessionId={id!} />
    )
}

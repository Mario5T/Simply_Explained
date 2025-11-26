import { useState } from "react";
import { useNavigate } from "react-router-dom";
import keycloak from "../services/keycloak";
import { LogOut, Sparkles, Link } from "lucide-react";

export default function Home() {
    const [session_id, setSessionId] = useState('');
    const navigate = useNavigate();

    const createSession = () => {
        const id = Date.now().toString();
        setSessionId(id);
        navigate(`/session/${id}`);
    }

    const joinSession = () => {
        if (session_id.trim() !== "") {
            navigate(`/session/${session_id}`);
        }
    }

    return (
        <div style={{ minHeight: '100vh', background: '#ffffff', width: '100%' }}>
            <button
                onClick={() => keycloak.logout()}
                style={{
                    position: 'fixed',
                    top: '24px',
                    right: '24px',
                    width: '48px',
                    height: '48px',
                    borderRadius: '50%',
                    border: '2px solid #f44336',
                    background: '#ffffff',
                    color: '#f44336',
                    fontSize: '20px',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.2s ease',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.background = '#f44336';
                    e.currentTarget.style.color = '#ffffff';
                    e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.background = '#ffffff';
                    e.currentTarget.style.color = '#f44336';
                    e.currentTarget.style.transform = 'scale(1)';
                }}
                title="Logout"
            >
                <LogOut size={24} />
            </button>
            <div className="container py-5">
                <div className="row justify-content-center">
                    <div className="col-md-10 col-lg-8">
                        <div className="text-center mb-5">
                            <img
                                src="/assets/logo.png"
                                alt="Simply Explained"
                                style={{ height: '300px', width: 'auto', marginBottom: '2rem' }}
                            />
                            <h2 className="mb-3 fw-light" style={{ fontSize: '1.5rem', color: '#6c757d' }}>
                                Collaborative Whiteboard
                            </h2>
                            <p className="lead text-muted">Create or join a session to start collaborating in real-time</p>
                        </div>

                        <div className="row g-4 mb-5">
                            <div className="col-md-6">
                                <div className="card h-100 border-0 shadow-sm">
                                    <div className="card-body text-center p-4">
                                        <div className="mb-3 text-primary">
                                            <Sparkles size={48} />
                                        </div>
                                        <h5 className="card-title fw-bold mb-3">Create New Session</h5>
                                        <p className="card-text text-muted mb-4">
                                            Start a new whiteboard session and invite others to collaborate
                                        </p>
                                        <button
                                            className="btn btn-primary btn-lg w-100"
                                            onClick={createSession}
                                        >
                                            Create Session
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="card h-100 border-0 shadow-sm">
                                    <div className="card-body text-center p-4">
                                        <div className="mb-3 text-success">
                                            <Link size={48} />
                                        </div>
                                        <h5 className="card-title fw-bold mb-3">Join Existing Session</h5>
                                        <p className="card-text text-muted mb-3">
                                            Enter a session ID to join an ongoing collaboration
                                        </p>
                                        <div className="mb-3">
                                            <input
                                                className="form-control form-control-lg"
                                                placeholder="Enter Session ID"
                                                value={session_id}
                                                onChange={(e) => setSessionId(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && joinSession()}
                                            />
                                        </div>
                                        <button
                                            className="btn btn-success btn-lg w-100"
                                            onClick={joinSession}
                                            disabled={!session_id.trim()}
                                        >
                                            Join Session
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="text-center text-muted">
                            <p className="mb-2">
                                <strong>Features:</strong> Real-time drawing • Live cursors • Chat • Undo/Redo • Export to Image/PDF
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
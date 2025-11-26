import jsPDF from "jspdf";
import ColorPicker from "./colorpicker";
import BrushSize from "./brush";
import InviteModal from "./inviteModal";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Konva from "konva";

type ToolsProps = {
    undo: () => void;
    redo: () => void;
    canUndo: boolean;
    canRedo: boolean;
    stageRef: React.RefObject<Konva.Stage>;
    sessionId: string;
    color: string;
    setColor: (color: string) => void;
    brushSize: number;
    setBrushSize: (size: number) => void;
};

export default function Tools({
    undo,
    redo,
    canUndo,
    canRedo,
    stageRef,
    sessionId,
    color,
    setColor,
    brushSize,
    setBrushSize
}: ToolsProps) {
    const [showMoreMenu, setShowMoreMenu] = useState(false);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const navigate = useNavigate();

    function saveImage() {
        if (!stageRef.current) return;
        const uri = stageRef.current.toDataURL({ pixelRatio: 2 });
        const link = document.createElement('a');
        link.download = `${sessionId}.png`;
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function savePDF() {
        if (!stageRef.current) return;
        const pdf = new jsPDF();
        const url = stageRef.current.toDataURL({ pixelRatio: 2 });

        pdf.addImage(url, "PNG", 0, 0, 200, 160);
        pdf.save(`${sessionId}.pdf`);
    }

    function clearCanvas() {
        if (window.confirm('Are you sure you want to clear the canvas?')) {
            window.location.reload();
        }
    }

    return (
        <div className="excali-toolbar">
            {/* Main tool panel */}
            <div className="excali-panel" style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
                {/* Back button */}
                <button
                    className="excali-btn excali-btn-icon"
                    onClick={() => navigate('/')}
                    title="Leave Session"
                >
                    ←
                </button>

                <div className="excali-separator" />

                {/* Color picker */}
                <ColorPicker color={color} onChange={setColor} />

                <div className="excali-separator" />

                {/* Brush size */}
                <BrushSize size={brushSize} onChange={setBrushSize} />

                <div className="excali-separator" />

                {/* Undo/Redo */}
                <div className="excali-tool-group">
                    <button
                        className="excali-btn excali-btn-icon"
                        onClick={undo}
                        disabled={!canUndo}
                        title="Undo (Ctrl+Z)"
                    >
                        ↶
                    </button>
                    <button
                        className="excali-btn excali-btn-icon"
                        onClick={redo}
                        disabled={!canRedo}
                        title="Redo (Ctrl+Y)"
                    >
                        ↷
                    </button>
                </div>

                <div className="excali-separator" />

                {/* More options */}
                <div style={{ position: 'relative' }}>
                    <button
                        className="excali-btn excali-btn-icon"
                        onClick={() => setShowMoreMenu(!showMoreMenu)}
                        title="More options"
                    >
                        ⋯
                    </button>

                    {/* Dropdown menu */}
                    {showMoreMenu && (
                        <div
                            className="excali-panel"
                            style={{
                                position: 'absolute',
                                top: '48px',
                                right: '0',
                                zIndex: 1000,
                                minWidth: '180px',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '4px',
                            }}
                        >
                            <button
                                className="excali-btn"
                                onClick={() => {
                                    saveImage();
                                    setShowMoreMenu(false);
                                }}
                                style={{ justifyContent: 'flex-start' }}
                            >
                                💾 Save as PNG
                            </button>
                            <button
                                className="excali-btn"
                                onClick={() => {
                                    savePDF();
                                    setShowMoreMenu(false);
                                }}
                                style={{ justifyContent: 'flex-start' }}
                            >
                                📄 Save as PDF
                            </button>
                            <button
                                className="excali-btn btn-success"
                                onClick={() => {
                                    setShowInviteModal(true);
                                    setShowMoreMenu(false);
                                }}
                                style={{ justifyContent: 'flex-start' }}
                            >
                                📧 Invite Others
                            </button>
                            <div style={{ height: '1px', background: 'var(--color-border)', margin: '4px 0' }} />
                            <button
                                className="excali-btn btn-danger"
                                onClick={() => {
                                    clearCanvas();
                                    setShowMoreMenu(false);
                                }}
                                style={{ justifyContent: 'flex-start' }}
                            >
                                🗑️ Clear Canvas
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Session info panel (hidden on mobile) */}
            <div
                className="excali-panel"
                style={{
                    display: 'none',
                    padding: '8px 12px',
                }}
            >
                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                    Session: <code style={{
                        fontSize: '11px',
                        background: '#f8f9fa',
                        padding: '2px 6px',
                        borderRadius: '4px'
                    }}>{sessionId}</code>
                </span>
            </div>

            <InviteModal
                show={showInviteModal}
                onHide={() => setShowInviteModal(false)}
                sessionId={sessionId}
            />

            {/* Click outside to close menu */}
            {showMoreMenu && (
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 99,
                    }}
                    onClick={() => setShowMoreMenu(false)}
                />
            )}
        </div>
    );
}

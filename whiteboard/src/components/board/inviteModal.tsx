import { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import keycloak from '../../services/keycloak';

interface InviteModalProps {
    show: boolean;
    onHide: () => void;
    sessionId: string;
}

export default function InviteModal({ show, onHide, sessionId }: InviteModalProps) {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'danger'; text: string } | null>(null);
    const [copied, setCopied] = useState(false);

    const sessionUrl = `${window.location.origin}/session/${sessionId}`;
    const senderName = keycloak.tokenParsed?.preferred_username || 'A user';

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(sessionUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    const handleSendInvite = async () => {
        setMessage(null);
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email.trim()) {
            setMessage({ type: 'danger', text: 'Please enter an email address' });
            return;
        }
        if (!emailRegex.test(email)) {
            setMessage({ type: 'danger', text: 'Please enter a valid email address' });
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('http://localhost:3001/api/invite', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email.trim(),
                    senderName,
                    sessionId,
                }),
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setMessage({ type: 'success', text: 'Invitation sent successfully!' });
                setEmail('');
            } else {
                setMessage({
                    type: 'danger',
                    text: data.message || 'Failed to send invitation. Please try again.'
                });
            }
        } catch (error) {
            console.error('Error sending invitation:', error);
            setMessage({
                type: 'danger',
                text: 'Network error. Please check your connection and try again.'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setEmail('');
        setMessage(null);
        setCopied(false);
        onHide();
    };

    return (
        <Modal show={show} onHide={handleClose} centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    <span className="me-2">📧</span>
                    Invite to Session
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {message && (
                    <Alert variant={message.type} dismissible onClose={() => setMessage(null)}>
                        {message.text}
                    </Alert>
                )}

                <div className="mb-4">
                    <h6 className="mb-2">Session Link</h6>
                    <div className="input-group">
                        <input
                            type="text"
                            className="form-control"
                            value={sessionUrl}
                            readOnly
                            onClick={(e) => (e.target as HTMLInputElement).select()}
                        />
                        <Button
                            variant={copied ? 'success' : 'outline-secondary'}
                            onClick={handleCopyLink}
                        >
                            {copied ? '✓ Copied!' : '📋 Copy'}
                        </Button>
                    </div>
                    <small className="text-muted">
                        Share this link with anyone you want to invite
                    </small>
                </div>

                <div className="border-top pt-4">
                    <h6 className="mb-3">Send Email Invitation</h6>
                    <Form.Group className="mb-3">
                        <Form.Label>Email Address</Form.Label>
                        <Form.Control
                            type="email"
                            placeholder="colleague@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendInvite()}
                            disabled={loading}
                        />
                        <Form.Text className="text-muted">
                            We'll send them an email with the session link
                        </Form.Text>
                    </Form.Group>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose} disabled={loading}>
                    Close
                </Button>
                <Button
                    variant="primary"
                    onClick={handleSendInvite}
                    disabled={loading || !email.trim()}
                >
                    {loading ? (
                        <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Sending...
                        </>
                    ) : (
                        '📧 Send Invitation'
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

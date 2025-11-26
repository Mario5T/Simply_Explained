import { useState, useEffect, useRef } from 'react';

interface ChatMessage {
    id: string;
    username: string;
    message: string;
    timestamp: number;
}

interface ChatProps {
    messages: ChatMessage[];
    onSendMessage: (message: string) => void;
    currentUsername: string;
}

export default function Chat({ messages, onSendMessage, currentUsername }: ChatProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [inputMessage, setInputMessage] = useState('');
    const [unreadCount, setUnreadCount] = useState(0);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const previousMessagesLength = useRef(messages.length);

    useEffect(() => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, isOpen]);

    useEffect(() => {
        if (!isOpen && messages.length > previousMessagesLength.current) {
            setUnreadCount(prev => prev + (messages.length - previousMessagesLength.current));
        }
        previousMessagesLength.current = messages.length;
    }, [messages, isOpen]);

    useEffect(() => {
        if (isOpen) {
            setUnreadCount(0);
        }
    }, [isOpen]);

    const handleSend = () => {
        if (inputMessage.trim()) {
            onSendMessage(inputMessage.trim());
            setInputMessage('');
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const formatTime = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <>
            <button
                className="excali-chat-button"
                onClick={() => setIsOpen(!isOpen)}
                title={isOpen ? 'Close Chat' : 'Open Chat'}
            >
                {isOpen ? '✕' : '💬'}
                {!isOpen && unreadCount > 0 && (
                    <span
                        style={{
                            position: 'absolute',
                            top: '0',
                            right: '0',
                            background: 'var(--color-danger)',
                            color: 'white',
                            borderRadius: 'var(--radius-full)',
                            padding: '2px 6px',
                            fontSize: '11px',
                            fontWeight: 'bold',
                            minWidth: '20px',
                            height: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}
                    >
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="excali-chat-panel">
                    <div className="excali-chat-header">
                        <h6 style={{ margin: 0, fontSize: '14px', fontWeight: 600 }}>
                            💬 Live Chat
                        </h6>
                        <small style={{ opacity: 0.9, fontSize: '12px' }}>
                            {currentUsername}
                        </small>
                    </div>

                    <div className="excali-chat-messages">
                        {messages.length === 0 ? (
                            <div style={{ textAlign: 'center', color: 'var(--color-text-muted)', marginTop: '40px' }}>
                                <p>No messages yet</p>
                                <small>Start the conversation!</small>
                            </div>
                        ) : (
                            messages.map((msg) => {
                                const isOwnMessage = msg.username === currentUsername;
                                return (
                                    <div
                                        key={msg.id}
                                        style={{
                                            marginBottom: '12px',
                                            textAlign: isOwnMessage ? 'right' : 'left',
                                        }}
                                    >
                                        <div
                                            style={{
                                                display: 'inline-block',
                                                padding: '8px 12px',
                                                borderRadius: 'var(--radius-md)',
                                                maxWidth: '80%',
                                                wordWrap: 'break-word',
                                                background: isOwnMessage ? 'var(--color-accent)' : 'var(--color-canvas)',
                                                color: isOwnMessage ? 'white' : 'var(--color-text)',
                                                border: isOwnMessage ? 'none' : '1.5px solid var(--color-border)',
                                            }}
                                        >
                                            {!isOwnMessage && (
                                                <div style={{
                                                    fontWeight: 600,
                                                    fontSize: '12px',
                                                    color: 'var(--color-accent)',
                                                    marginBottom: '4px'
                                                }}>
                                                    {msg.username}
                                                </div>
                                            )}
                                            <div>{msg.message}</div>
                                            <div
                                                style={{
                                                    fontSize: '10px',
                                                    marginTop: '4px',
                                                    opacity: 0.7,
                                                }}
                                            >
                                                {formatTime(msg.timestamp)}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="excali-chat-input">
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '4px' }}>
                            <input
                                type="text"
                                className="excali-input"
                                placeholder="Type a message..."
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyPress={handleKeyPress}
                                maxLength={500}
                            />
                            <button
                                className="excali-btn btn-primary"
                                onClick={handleSend}
                                disabled={!inputMessage.trim()}
                            >
                                Send
                            </button>
                        </div>
                        <small style={{ color: 'var(--color-text-muted)', fontSize: '11px' }}>
                            Press Enter to send
                        </small>
                    </div>
                </div>
            )}
        </>
    );
}

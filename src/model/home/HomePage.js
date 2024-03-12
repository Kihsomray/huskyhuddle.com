import React, { useState } from 'react';
import GuildHeader from '../guild/GuildHeader';
import GuildChannels from '../guild/GuildChannels';

const HomePage = ({ onLogout }) => {
    
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    const handleSendMessage = () => {
        if (newMessage.trim() !== '') {
            setMessages([...messages, { user: 'User1', text: newMessage }]);
            setNewMessage('');
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            {/* Header */}

            <GuildHeader onLogout={onLogout} />

            {/* Main Content Area */}
            <div style={{ display: 'flex', flex: 1 }}>
                {/* Sidebar */}
                <GuildChannels />

                {/* Thread of Messages */}
                <div style={{ flex: 1, padding: '10px', overflowY: 'auto' }}>
                    {messages.map((message, index) => (
                        <div key={index}>
                            <strong>{message.user}:</strong> {message.text}
                        </div>
                    ))}
                </div>
            </div>

            {/* Message Input Bar */}
            <div style={{ borderTop: '1px solid #ccc', padding: '10px', display: 'flex' }}>
                <input
                    type="text"
                    placeholder="Type your message..."
                    style={{ flex: 1, marginRight: '10px' }}
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
        </div>
    );
}

export default HomePage;
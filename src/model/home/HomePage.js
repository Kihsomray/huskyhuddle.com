import React, { useState, useEffect } from 'react';
import GuildHeader from '../guild/GuildHeader';
import GuildChannels from '../guild/GuildChannels';

const HomePage = ({ onLogout }) => {
    
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [guild, setGuild] = useState({ "GuildID": 0, GuildName: "Select a Guild" });

    const handleSendMessage = () => {
        if (newMessage.trim() !== '') {
            setMessages([...messages, { user: 'User1', text: newMessage }]);
            setNewMessage('');
        }
    };

    const onSelectedGuild = (guild) => {
        setGuild(guild);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <GuildHeader onLogout={onLogout} onSelectedGuild={onSelectedGuild} />

            <div style={{ display: 'flex', flex: 1 }}>
                <GuildChannels guild={guild} />

                {/* Thread of Messages */}
                <div style={{ flex: 1, padding: '10px', overflowY: 'auto', backgroundColor: "#828385" }}>
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
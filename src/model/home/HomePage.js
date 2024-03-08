import React, { useState } from 'react';

const HomePage = ({ username, password, onLogout }) => {
    console.log('Welcome {username} to the homepage');
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
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid #ccc' }}>
                <div>
                    {/* Add your clickable icons here */}
                    <span style={{ marginRight: '10px' }}>Icon1</span>
                    <span>Icon2</span>
                </div>
                <div>
                    <p>User Name</p>
                    <button onClick={onLogout}>Logout</button>
                </div>
            </div>

            {/* Main Content Area */}
            <div style={{ display: 'flex', flex: 1 }}>
                {/* Sidebar */}
                <div style={{ width: '200px', padding: '10px', borderRight: '1px solid #ccc' }}>
                    <p>Channel 1</p>
                    <p>Channel 2</p>
                    {/* Add more channel names */}
                </div>

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
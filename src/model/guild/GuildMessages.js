import React, { useState, useEffect } from 'react';

const GuildMessages = ({ onSelectedChannel, guild }) => {

    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');

    const handleSendMessage = () => {
        if (newMessage.trim() !== '') {
            setMessages([...messages, { user: 'User1', text: newMessage }]);
            setNewMessage('');
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: "100%", backgroundColor: '#828385', }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '12px',
                backgroundColor: '#676767',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
            }} className="txt-gold-primary">
                General
            </div>
            <div style={{
                flex: 1,
                padding: '10px',
                overflowY: 'auto',
                height: '100%',
            }}>
                {messages.map((message, index) => (
                    <div 
                        style={{
                            padding: '10px',
                            marginBottom: '10px',
                            borderRadius: '6px',
                            maxWidth: '100%',
                            fontSize: '14px',
                        }}
                        key={index}>
                        <span
                            style={{
                                padding: '10px',
                                paddingLeft: '0px',
                                marginBottom: '10px',
                                marginRight: '6px',
                                borderRadius: '6px',
                                backgroundColor: '#565656',
                                color: '#fff',
                                maxWidth: '80%',
                            }}
                        >
                            
                            {/* User Icon */}
                            <span
                                className='bg-purple-primary'
                                style={{
                                    padding: '10px',
                                    margin: "0px",
                                    borderRadius: '6px',
                                }}
                            >{message.user.charAt(0)}</span>

                            {/* User Name */}
                            <span
                                style={{
                                    paddingLeft: '8px',
                                    margin: "0px",
                                    borderRadius: '6px',
                                }}
                            >{message.user}</span>
                        </span> 

                        {/* User Message */}
                        <span
                            style={{
                                fontSize: '15px',
                            }}
                        >{message.text}</span>
                    </div>
                ))}
            </div>
            <div style={{
                padding: '10px',
                display: 'flex',
                alignItems: 'center',
            }}>
                <input
                    className='bg-gold-primary txt-purple-primary'
                    style={{
                        flex: 1,
                        marginRight: '10px',
                        height: '36px',
                        padding: '0px 10px',
                        borderRadius: '6px',
                        border: 'none',
                        fontSize: '15px',
                        outline: 'none',
                    }}
                    type="text"
                    placeholder="Message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                />
                <button
                    className='btn-purple-primary'
                    style={{
                        height: '38px',
                        width: '38px',
                        color: '#fff',
                        padding: "0px",
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                    }}
                    onClick={handleSendMessage}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-send" viewBox="0 0 18 18">
                        <path d="M15.854.146a.5.5 0 0 1 .11.54l-5.819 14.547a.75.75 0 0 1-1.329.124l-3.178-4.995L.643 7.184a.75.75 0 0 1 .124-1.33L15.314.037a.5.5 0 0 1 .54.11ZM6.636 10.07l2.761 4.338L14.13 2.576zm6.787-8.201L1.591 6.602l4.339 2.76z" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

export default GuildMessages;
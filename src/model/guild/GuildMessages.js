import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { useCookies } from 'react-cookie';

const GuildMessages = ({ guild, channel }) => {

    const containerRef = useRef(null);
    const [messages, setMessages] = useState([]);
    const [latestMessageID, setLatestMessageID] = useState(0); // messages[messages.length - 1].MessageID
    const [newMessage, setNewMessage] = useState('');
    const [cookies] = useCookies(['login']);

    const handleSendMessage = () => {
        if (newMessage.trim() === '') return;
        (async () => {
            await axios.post(
                "http://localhost:4000/channel/message/",
                null,
                {
                    headers: {
                        "guildid": guild.GuildID,
                        "channelid": channel.ChannelID,
                        "userid": cookies.login,
                        "content": newMessage,
                    }
                }
            ).then(_ => {
                setMessages([...messages, { MessageDate: "sending...", UserID: cookies.login }]);
                setNewMessage('');
            }).catch((_) => {
                console.log("unable to fetch channel messages");
            });
        })();
    };

    const running = () => {
        (async () => {
            await axios.get(
                `http://localhost:4000/channel/latestmessage`,
                { headers: { "guildid": guild.GuildID, "channelid": channel.ChannelID, latestmessageid: latestMessageID } }
            ).then(e => {
                if (e.data.length > 0) {
                    setMessages([...messages, ...e.data]);
                    setLatestMessageID(e.data[e.data.length - 1]["MessageID"]);
                }

            }).catch((_) => {
                console.log("unable to fetch channel messages");
            });
        })();
    };

    const scrollToBottom = () => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    };

    useEffect(() => {
        // Scroll to the bottom when the component mounts or whenever content changes

        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        running();
        const interval = setInterval(() => {
            running();
        }, 500);

        return () => clearInterval(interval);
    }, [latestMessageID]);

    useEffect(() => {
        setLatestMessageID(0);
        running();
    }, [channel]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', width: "100%", backgroundColor: '#828385', }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '12px',
                backgroundColor: '#676767',
                whiteSpace: 'nowrap',
            }} className="txt-gold-primary">
                {channel.ChannelName}
            </div>
            <div
                ref={containerRef}
                style={{
                    padding: '10px',
                    height: '100%',
                    overflowY: 'auto'
                }}
            >
                {messages.map((message, index) => (
                    <div
                        style={{
                            padding: '10px',
                            paddingTop: '10px',
                            marginBottom: '10px',
                            borderRadius: '6px',
                            maxWidth: '100%',
                            fontSize: '14px',
                        }}
                        key={index}>
                        <span style={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'row' }}>
                            <span
                                style={{
                                    padding: '10px',
                                    paddingLeft: '0px',
                                    marginRight: '10px',
                                    borderRadius: '6px',
                                    backgroundColor: '#565656',
                                    color: '#fff',
                                    maxWidth: '80%'
                                }}
                            >

                                {/* User Icon */}
                                <span
                                    className='bg-purple-primary'
                                    style={{
                                        padding: '10px',
                                        borderRadius: '6px',
                                    }}
                                >{message.UserID}</span>

                                {/* User Name */}
                                <span
                                    style={{
                                        paddingLeft: '8px',
                                        margin: "0px",
                                        borderRadius: '6px',
                                    }}
                                >{message.UserName}</span>

                            </span>

                            {/* User Message */}
                            <span
                                className='txt-purple-secondary'
                                style={{
                                    maxWidth: '90%',
                                    fontSize: '15px',
                                    display: 'inline-block',
                                    overflowWrap: 'anywhere',
                                    whiteSpace: 'normal',
                                }}
                            >
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span
                                        className='txt-purple-secondary'
                                        style={{
                                            paddingTop: '2px',
                                            maxWidth: '100%',
                                            fontSize: '15px',
                                            display: 'inline-block',
                                            overflowWrap: 'anywhere',
                                            whiteSpace: 'normal'
                                        }}
                                    >
                                        {message.MessageContent}
                                    </span>
                                    <span
                                        className='txt-gray-secondary'
                                        style={{
                                            fontSize: '8px',
                                            color: '#bbb',
                                        }}
                                    >
                                        {message.MessageDate} {/* Assuming you have a function to format the timestamp */}
                                    </span>
                                </div>
                            </span>
                        </span>
                    </div>
                ))}
            </div>
            <div style={{
                padding: '10px',
                display: 'flex',
                alignItems: 'center',
                height: '60px',
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
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSendMessage() }}
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
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import CreateModal from '../../modal/server/CreateModal';
import { useCookies } from 'react-cookie';
import WarningModal from '../../modal/warning/WarningModal';

const GuildChannels = ({ onSelectedChannel, guild }) => {

    const [cookies] = useCookies(['login']);
    const [showCreateChannel, setShowCreateChannel] = useState(false);
    const [channels, setChannels] = useState([]);
    const [selectedChannel, setSelectedChannel] = useState(null);
    const [warning, setWarning] = useState(false);

    const iconStyle = {
        cursor: 'pointer',
        width: '200px',
        height: '32px',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'left',
        padding: '8px 10px 8px 10px',
        marginBottom: '6px',
        transition: 'background-color 0.1s, border-radius 0.1s',
        whiteSpace: "nowrap",
        overflow: "hidden",
        backgroundColor: '#565656',
    };

    const handleMouseEnter = (e) => {
        e.currentTarget.style.borderRadius = '8px'
        e.currentTarget.style.backgroundColor = '#6a6a6a'
    };

    const handleMouseExit = (e) => {
        if (selectedChannel && e.currentTarget.id == selectedChannel.ChannelID) return;
        e.currentTarget.style.borderRadius = '14px'
        e.currentTarget.style.backgroundColor = '#565656'
    };

    const onChannelSelected = (channel) => {
        setSelectedChannel(channel);
        onSelectedChannel(channel);
    };

    useEffect(() => {
        (async () => {
            await axios.get(
                "http://localhost:4000/guild/channel/",
                { headers: { "guildid": guild.GuildID } }
            ).then(e => {
                if (e.data.length > 0 && !selectedChannel) {
                    onChannelSelected(e.data[0]);
                }
                setChannels(e.data);
            }).catch((_) => {
                console.log("unable to fetch guild channels");
            });
        })();
    }, [guild.GuildName, channels.length]);

    return (
        <div style={{ height: '100%', backgroundColor: '#565656' }}>
            {showCreateChannel && <CreateModal
                message={"Create a new channel"}
                onClose={() => setShowCreateChannel(false)}
                onSubmit={(e) => {
                    (async () => {
                        await axios.post(
                            "http://localhost:4000/admin/channel/",
                            null,
                            { headers: { "guildid": guild.GuildID, "userid": cookies.login, "channelname": e } }
                        ).then(e1 => {
                            console.log(e1.data)
                            const channel = {ChannelID: e1.data.ChannelID, ChannelName: e};
                            setChannels([...channels, ...[channel]]);
                            onChannelSelected(channel);
                        }).catch((_) => {
                            setWarning(true);
                            console.log("unable to create new channel");
                        });
                    })();
                    setShowCreateChannel(false);
                }}
            />}
            {warning && <WarningModal
                message={"You do not have the correct permissions!"}
                onClose={() => setWarning(false)}
            />}
            <div style={{
                display: 'flex',
                justifyContent: "space-between",
                padding: '12px',
                backgroundColor: "#373737",
                whiteSpace: "nowrap",
                overflow: "hidden",
            }} className="txt-gold-primary">
                {guild.GuildName}
            </div>
            <div
                style={{ width: '220px', padding: '10px', alignItems: 'left', justifyContent: 'center' }}
            >

                {guild.GuildID > 0 && <><span
                    className='txt-gold-primary'
                    style={{
                        fontSize: '14px',
                        fontWeight: 'bold',
                        width: '200px',
                        height: '32px'
                    }}
                >Chats</span>
                </>}
                {channels.map((channel, index) => (
                    <span
                        key={index}
                        id={channel.ChannelID}
                        className='txt-gold-primary'
                        style={{...iconStyle, ...{backgroundColor: selectedChannel?.ChannelID === channel.ChannelID ? "#6a6a6a" : "#565656"}}}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseExit}
                        onClick={() => onChannelSelected(channel)}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chat" viewBox="0 0 16 16" style={{ marginRight: "10px" }} >
                            <path d="M2.678 11.894a1 1 0 0 1 .287.801 11 11 0 0 1-.398 2c1.395-.323 2.247-.697 2.634-.893a1 1 0 0 1 .71-.074A8 8 0 0 0 8 14c3.996 0 7-2.807 7-6s-3.004-6-7-6-7 2.808-7 6c0 1.468.617 2.83 1.678 3.894m-.493 3.905a22 22 0 0 1-.713.129c-.2.032-.352-.176-.273-.362a10 10 0 0 0 .244-.637l.003-.01c.248-.72.45-1.548.524-2.319C.743 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.52.263-1.639.742-3.468 1.105" />
                        </svg>
                        <span>{channel.ChannelName}</span>
                    </span>
                ))}

                {guild.GuildID > 0 && <><span
                    className='txt-gold-primary'
                    style={{
                        fontSize: '14px',
                        fontWeight: 'bold',
                        width: '200px',
                        height: '32px',
                    }}
                >Create</span>
                <span
                    key="new"
                    className='txt-gold-primary'
                    style={iconStyle}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseExit}
                    onClick={() => setShowCreateChannel(true)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-plus-circle" viewBox="0 0 16 16" style={{ marginRight: "10px" }}>
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                        <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                    </svg>
                    <span>New Channel</span>
                </span></>}

            </div>
        </div>
    );

};

export default GuildChannels;
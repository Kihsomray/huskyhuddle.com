import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';
import CreateGuildModal from '../../modal/server/CreateGuildModal';
import WarningModal from '../../modal/warning/WarningModal';

const GuildHeader = ({ onLogout, onSelectedGuild }) => {

    const [username, setUsername] = useState('');
    const [guilds, setGuilds] = useState([]);
    const [currentGuild, setCurrentGuild] = useState(null);
    const [cookies, setCookie, removeCookie] = useCookies(['login']);
    const [showCreateGuild, setShowCreateGuild] = useState(false);
    const [warningMessage, setWarningMessage] = useState('');
    const [warning, setWarning] = useState(false);

    useEffect(() => {
        (async () => {
            await axios.get(
                `http://localhost:4000/user/${cookies.login}`
            ).then(e => {
                setUsername(e.data[0].UserName);
            }).catch((_) => {
                console.log("unable to fetch user data");
            });
        })();
    }, [cookies.login]);

    useEffect(() => {
        (async () => {
            await axios.get(
                "http://localhost:4000/user/guild/",
                { headers: { "userid": cookies.login } }
            ).then(e => {
                setGuilds(e.data);
            }).catch((_) => {
                console.log("unable to fetch user data");
            });
        })();
    }, [cookies.login]);

    const iconStyle = {
        cursor: 'pointer',
        marginRight: '10px',
        width: '54px',
        height: '54px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        transition: 'border-radius 0.3s',
    };

    const handleMouseEnter = (e) => {
        const bool = (currentGuild && e.currentTarget.id == currentGuild.GuildID);
        e.target.style.borderRadius = bool ? '25% 25% 0% 0%' : '25%'
        if (bool) {
            e.target.style.marginTop = '8px'
            e.target.style.paddingBottom = '8px'
            e.target.style.height = '62px'
        }
        e.target.className = 'icon btn-gold-secondary'
    };

    const handleMouseExit = (e) => {
        if (currentGuild && e.currentTarget.id == currentGuild.GuildID) {
            e.target.className = 'icon btn-gold-tertiary'
            return;
        }
        e.target.style.borderRadius = '40%'
        e.target.style.marginTop = '0px'
        e.target.style.height = '54px'
        e.target.style.paddingBottom = '0px'
        e.target.className = 'icon btn-purple-primary'
    };

    const onGuildSelected = (guild) => {
        setCurrentGuild(guild);
        onSelectedGuild(guild);
    };

    return (
        <div style={{ display: 'flex', justifyContent: "space-between", borderBottom: '2px solid #ffc700', maxHeight: '100vh' }} className="bg-purple-secondary">
            {showCreateGuild && <CreateGuildModal
                onClose={() => setShowCreateGuild(false)}
                onSubmit={(e) => {
                    if (e.CreateGuild) {
                        (async () => {
                            await axios.post(
                                "http://localhost:4000/admin/guild/",
                                null,
                                { headers: { "guildname": e.Result, "userid": cookies.login, } }
                            ).then(e1 => {
                                const guild = {GuildID: e1.data.GuildID, GuildName: e.Result};
                                setGuilds([...guilds, ...[guild]]);
                                onGuildSelected(guild);
                            }).catch((_) => {
                                setWarning(true);
                                setWarningMessage("Failed to create guild!");
                            });
                        })();
                    } else {
                        (async () => {
                            await axios.post(
                                "http://localhost:4000/guild/user/",
                                null,
                                { headers: { "guildid": e.Result, "userid": cookies.login, "role": "Member" } }
                            ).then(e1 => {
                                const guild = {GuildID: e.Result, GuildName: e1.data.GuildName};
                                console.log(e1);
                                const sorted = [...guilds, ...[guild]].sort((a, b) => a.GuildID - b.GuildID);
                                setGuilds(sorted);
                                onGuildSelected(guild);
                            }).catch((_) => {
                                setWarning(true);
                                setWarningMessage("Invalid guild ID or you've already joined!");
                            });
                        })();
                    }
                    setShowCreateGuild(false);
                }}
            />}
            {warning && <WarningModal
                message={warningMessage}
                onClose={() => setWarning(false)}
            />}
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <span><img src="logo192.png" style={{ width: "70px", height: "70px", padding: "6px", paddingRight: "0px" }} alt="Logo"></img></span>
                <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-chevron-compact-right" viewBox="4 0 12 16">
                        <path fill-rule="evenodd" d="M6.776 1.553a.5.5 0 0 1 .671.223l3 6a.5.5 0 0 1 0 .448l-3 6a.5.5 0 1 1-.894-.448L9.44 8 6.553 2.224a.5.5 0 0 1 .223-.671" />
                    </svg>
                </span>
                {guilds.map((guild, index) => (
                    <span
                        id={guild.GuildID}
                        key={index}
                        className={(currentGuild && guild.GuildID == currentGuild.GuildID) ? 'icon btn-gold-tertiary' : 'icon btn-purple-primary'}
                        style={{ ...iconStyle, ...(currentGuild && guild.GuildID == currentGuild.GuildID) ? { borderRadius: "25% 25% 0% 0%", marginTop: "8px", height: "62px", paddingBottom: "8px" } : { borderRadius: "40%", marginTop: "0px", height: "54px", paddingBottom: "0px" } }}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseExit}
                        onClick={() => onGuildSelected(guild)}
                    >{guild.GuildName.charAt(0)}</span>
                ))}
                <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-chevron-compact-right" viewBox="4 0 12 16">
                        <path fill-rule="evenodd" d="M6.776 1.553a.5.5 0 0 1 .671.223l3 6a.5.5 0 0 1 0 .448l-3 6a.5.5 0 1 1-.894-.448L9.44 8 6.553 2.224a.5.5 0 0 1 .223-.671" />
                    </svg>
                </span>
                <span
                    key="add"
                    className={'icon btn-purple-primary'}
                    style={{ ...iconStyle, ...{ borderRadius: "40%", marginTop: "0px", height: "54px", paddingBottom: "0px" } }}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseExit}
                    onClick={() => {setShowCreateGuild(true)}}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-house-add" viewBox="0 0 16 16">
                        <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h4a.5.5 0 1 0 0-1h-4a.5.5 0 0 1-.5-.5V7.207l5-5 6.646 6.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293z" />
                        <path d="M16 12.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0m-3.5-2a.5.5 0 0 0-.5.5v1h-1a.5.5 0 0 0 0 1h1v1a.5.5 0 1 0 1 0v-1h1a.5.5 0 1 0 0-1h-1v-1a.5.5 0 0 0-.5-.5" />
                    </svg>
                </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '14px', color: '#fff' }}>{username}</span>
                <span
                    id="createguild"
                    className='icon btn-purple-primary'
                    style={iconStyle}
                    onClick={onLogout}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseExit}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-arrow-bar-right" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M6 8a.5.5 0 0 0 .5.5h5.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L12.293 7.5H6.5A.5.5 0 0 0 6 8m-2.5 7a.5.5 0 0 1-.5-.5v-13a.5.5 0 0 1 1 0v13a.5.5 0 0 1-.5.5" />
                    </svg>
                </span>
            </div>
        </div>
    )

}

export default GuildHeader;
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useCookies } from 'react-cookie';

const GuildHeader = ({ onLogout, onSelectedGuild }) => {

    const [username, setUsername] = useState('');
    const [guilds, setGuilds] = useState([]);
    const [guild, setGuild] = useState('');
    const [cookies, setCookie, removeCookie] = useCookies(['login']);

    useEffect(() =>{
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
        e.target.style.borderRadius = '25%'
        e.target.className = 'icon btn-gold-secondary'
    };

    const handleMouseExit = (e) => {
        e.target.style.borderRadius = '40%'
        e.target.className = 'icon btn-purple-primary'
    };

    return (
        <div style={{ display: 'flex', justifyContent: "space-between", borderBottom: '2px solid #ffc700' }} className="bg-purple-secondary">
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <span><img src="https://michael.yarmoshik.com/assets/images/dawg_dialogue.png" style={{ width: "70px", paddingBottom: "6px", paddingRight: "0px" }} alt="Logo"></img></span>
                <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-chevron-compact-right" viewBox="4 0 12 16">
                        <path fill-rule="evenodd" d="M6.776 1.553a.5.5 0 0 1 .671.223l3 6a.5.5 0 0 1 0 .448l-3 6a.5.5 0 1 1-.894-.448L9.44 8 6.553 2.224a.5.5 0 0 1 .223-.671" />
                    </svg>
                </span>
                {guilds.map((guild, index) => (
                    <span
                        key={index}
                        className='icon btn-purple-primary'
                        style={iconStyle}
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseExit}
                        onClick={() => onSelectedGuild(guild)}
                    >{guild.GuildName.charAt(0)}</span>
                ))}
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ marginRight: '14px', color: '#fff' }}>{username}</span>
                <span
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
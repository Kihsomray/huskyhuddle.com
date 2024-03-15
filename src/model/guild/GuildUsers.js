import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { useCookies } from 'react-cookie';

const GuildUsers = ({ guild }) => {

    const containerRef = useRef(null);
    const [users, setUsers] = useState([]);
    const [cookies] = useCookies(['login']);

    const fetchUsers = async () => {
        // fetch users from guild
        await axios.get(
            "http://localhost:4000/guild/user/",
            {
                headers: {
                    "guildid": guild.GuildID,
                }
            }
        ).then(e => {
            setUsers(e.data);
        }).catch((_) => {
            console.log("unable to fetch channel messages");
        });
    }

    useEffect(() => {
        fetchUsers();
    }, [guild.GuildID]);

    return (
        <div style={{ width: "300px", height: '100%', backgroundColor: '#565656', overflowY: "auto"}}>
            <div style={{
                display: 'flex',
                justifyContent: "space-between",
                padding: '12px',
                backgroundColor: "#676767",
                color: "#676767",
                whiteSpace: "nowrap",
                overflow: "hidden",
            }} className="txt-gold-primary">
                .
            </div>
            <div
                style={{ width: '100%', alignItems: 'left', justifyContent: 'center', backgroundColor: '#565656'}}
            >
                <div
                ref={containerRef}
                style={{
                    padding: '10px',
                    paddingRight: '4px',
                    height: '100%',
                    overflowY: 'auto',
                    scrollBehavior: 'smooth',
                    scrollbarWidth: "thin",
                    scrollbarColor: "#676767 #828385",
                }}
            >
                {users.map((user, index) => (
                    <div
                        style={{
                            borderRadius: '6px',
                            paddingBottom: '6px',
                            paddingLeft: '4px',
                            maxWidth: '100%',
                            fontSize: '14px',
                            minWidth: '100%'
                        }}
                        key={index}>
                        <span style={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'row' }}>
                            <span
                                style={{
                                    padding: '10px',
                                    paddingLeft: '0px',
                                    marginRight: '10px',
                                    borderRadius: '6px',
                                    backgroundColor: '#777',
                                    color: '#fff',
                                    width: '100%',
                                }}
                            >

                                {/* User Icon */}
                                <span
                                    className='bg-purple-primary'
                                    style={{
                                        padding: '11px',
                                        borderRadius: '6px',
                                        height: "100%"
                                    }}
                                >{user.UserID}</span>

                                {/* User Name */}
                                <span
                                    style={{
                                        padding: '10px',
                                        paddingLeft: '8px',
                                        margin: "0px",
                                        borderRadius: '6px',
                                        color: user.UserID == cookies.login ? "#99ff99" : '#fff',
                                    }}
                                >{user.UserName}</span>

                            </span>
                        </span>
                    </div>
                ))}
            </div>
            </div>
        </div>
    );

};

export default GuildUsers;
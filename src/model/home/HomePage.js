import React, { useState, useEffect } from 'react';
import GuildHeader from '../guild/GuildHeader';
import GuildChannels from '../guild/GuildChannels';
import GuildMessages from '../guild/GuildMessages';
import GuildUsers from '../guild/GuildUsers';

const HomePage = ({ onLogout }) => {
    
    const [guild, setGuild] = useState({ "GuildID": 0, GuildName: "Select a Guild" });
    const [channel, setChannel] = useState({ "ChannelID": 0, ChannelName: "Select a Channel" });

    const onSelectedGuild = (guild) => {
        setGuild(guild);
    };

    const onSelectedChannel = (channel) => {
        setChannel(channel);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <GuildHeader onLogout={onLogout} onSelectedGuild={onSelectedGuild} />

            <div style={{ display: 'flex', flex: 1 }}>
                <GuildChannels onSelectedChannel={onSelectedChannel} guild={guild} />
                <GuildMessages onSelectedChannel={onSelectedChannel} guild={guild} channel={channel} />
                <GuildUsers guild={guild} />
            </div>
        </div>
    );
}

export default HomePage;
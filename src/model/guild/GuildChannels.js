import React, { useState } from 'react';

const GuildChannels = ({ guild }) => {

    const iconStyle = {
        cursor: 'pointer',
        marginRight: '10px',
        width: '100px',
        height: '36px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        transition: 'border-radius 0.3s',
    };

    return (
        <div style={{ width: '250px', padding: '10px', borderRight: '1px solid #ccc', alignItems: 'left', display: 'flex', justifyContent: 'center' }}>
            <span style={ iconStyle }>Channel 1</span>
            <span style={ iconStyle }>Channel 2</span>
            {/* Add more channel names */}
        </div>
    );

};

export default GuildChannels;
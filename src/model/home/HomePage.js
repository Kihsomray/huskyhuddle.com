import React, { useState } from 'react';

const HomePage = ({ username, password, onLogout }) => {
    console.log('Welcome {username} to the homepage');
    return(
        <div>
            <h1>Welcome {username} to the homepage!</h1>
            <button onClick={onLogout}>Logout</button>
        </div>
    );
}

export default HomePage;
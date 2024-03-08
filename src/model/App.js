import React, { useState } from 'react';
import Auth from './auth/Auth';
import HomePage from './home/HomePage';

const App = () => {
    const [username, setUsername] = useState(null);
    const [password, setPassword] = useState(null);

    const handleLogin = (username, password) => {
        console.log('Login', username)
        setUsername(username);
        setPassword(password);
    };

    const handleLogout = () => {
        setUsername(null);
        setPassword(null);
    };

    return (
        <div>
            {(username && password) ? (
                <HomePage
                    username={ username }
                    password={ password }
                    onLogout={ handleLogout }
                />
            ) : (
                <Auth onLogin={ handleLogin } />
            )}
        </div>
    );
};

export default App;

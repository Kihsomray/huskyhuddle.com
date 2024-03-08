import React, { useState } from 'react';
import Auth from './auth/Auth';
import HomePage from './home/HomePage';
import { useCookies } from 'react-cookie';

const App = () => {
    const [cookies, setCookie, removeCookie] = useCookies(['login']);
    const [userID, setUserID] = useState(null);

    const handleLogin = (userID) => {
        let threeDays = new Date();
        threeDays.setDate(threeDays.getDate() + 1);
        setCookie('login', userID, { path: '/', expires: threeDays});
        setUserID(userID);
    };

    const handleLogout = () => {
        removeCookie('login');
        setUserID(null);
    };

    console.log(cookies.login);

    return (
        <div>
            {(userID || cookies.login) ? (
                <HomePage
                    onLogout={ handleLogout }
                />
            ) : (
                <Auth onLogin={ handleLogin } />
            )}
        </div>
    );
};

export default App;

import React, { useState, useEffect } from 'react';
import Auth from './auth/Auth';
import HomePage from './home/HomePage';
import { useCookies } from 'react-cookie';
import WarningModal from '../modal/popup/WarningModal';

const App = () => {
    const [warning, setShowWarning] = useState(true);
    const [cookies, setCookie, removeCookie] = useCookies(['login', 'warning']);
    const [userID, setUserID] = useState(null);

    const handleLogin = (userID) => {
        let date = new Date();

        // 3 days
        date.setDate(date.getDate() + 3);
        setCookie('login', userID, { path: '/', expires: date});

        setUserID(userID);
    };

    const handleLogout = () => {
        removeCookie('login');
        setUserID(null);
    };

    console.log(cookies.login);

    return (
        <div style={{ height: "100vh"}}>
            {(
                warning && !cookies.warning && <WarningModal
                    message={"Warning: please do not input any real passwords. This is a demo application."}
                    onClose={() => {
                        setShowWarning(false);
                        let oneDay = new Date();
                        oneDay.setDate(oneDay.getDate() + 1);
                        setCookie('warning', true, { path: '/', expires: oneDay});
                    }}
                />
            )}
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

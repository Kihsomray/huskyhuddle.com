import axios from 'axios';
import React, { useState } from 'react';
import WarningModal from '../../modal/popup/WarningModal';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [showWarning, setShowWarning] = useState(false);
    const [warning, setWarning] = useState('');

    const handleShowWarning = () => {
        setShowWarning(true);
    };

    const handleCloseWarning = () => {
        setShowWarning(false);
    };

    const handleLogin = (e) => {
        e.preventDefault();

        const authHeaders = {
            username: username,
            userpass: password
        }
        axios.post(
            'http://localhost:4000/user/auth',
            null,
            { headers: authHeaders }
        ).then(e1 => {
            console.log(e1.status)
            if (e1.status === 200) {
                console.log(e1.data.UserID);
                onLogin(e1.data.UserID);
            }
        }).catch((error) => {
            setWarning('That account does not exist.');
            setShowWarning(true);
        });

    };

    return (
        <div className="container mt-5">
            {showWarning && (
                <WarningModal
                    message={warning}
                    onClose={handleCloseWarning}
                />
            )}
            <div className="mx-auto" style={{ maxWidth: '400px' }}>
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label htmlFor="username" className="form-label">
                            Username:
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">
                            Password:
                        </label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="btn btn-block btn-purple-secondary">
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;

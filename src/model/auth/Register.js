import axios from 'axios';
import React, { useState } from 'react';
import WarningModal from '../../modal/popup/WarningModal';

const Register = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [showWarning, setShowWarning] = useState(false);
    const [warning, setWarning] = useState('');

    const handleShowWarning = () => {
        setShowWarning(true);
    };

    const handleCloseWarning = () => {
        setShowWarning(false);
    };


    const handleRegister = async (e) => {
        e.preventDefault();

        let registerHeaders = {
            "UserName": username,
            "UserEmail": email,
            "UserPass": password
        }

        await axios.post(
            'http://localhost:4000/user',
            null,
            { headers: registerHeaders }
        ).then(e => {
            if (e.status === 200) {

                const authHeaders = {
                    username: username,
                    userpass: password
                }
                axios.post(
                    'http://localhost:4000/user/auth',
                    null,
                    { headers: authHeaders }
                ).then(e1 => {
                    if (e1.status === 200) {
                        console.log(e1.data.UserID);
                        onLogin(e1.data.UserID);
                    } 
                }).catch((error) => {
                    setWarning('Failed to login user.');
                    setShowWarning(true);
                });

            } 

        }) .catch((error) => {
            setWarning('That user already exists.');
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
            <div className=" mx-auto" style={{ maxWidth: '400px' }}>
                <div>
                    <form onSubmit={handleRegister}>
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
                            <label htmlFor="email" className="form-label">
                                Email:
                            </label>
                            <input
                                type="email"
                                className="form-control"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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
                        <button type="submit" className="btn btn-purple-secondary btn-block">
                            Register
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;

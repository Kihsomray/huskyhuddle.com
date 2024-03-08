import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

const Auth = ({ onLogin }) => {

    const [isLogin, setLogin] = useState(true);

    const containerStyle = {
        backgroundSize: 'cover',
        backgroundPosition: 'top left',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        width: '100%',
        boxSizing: 'border-box',
    };

    const cardStyle = {
        width: '800px',
        margin: 'auto',
    };

    return (
        <div>
            <div>
                <h1>HuskyHuddle</h1>
            </div>
            <div  style={containerStyle}>
                <div className="card mx-auto" style={cardStyle}>
                    <div className="card-header bg-purple-primary text-white">
                        <h3 className="mb-0">{isLogin ? "Login" : "Register"}</h3>
                    </div>
                    <div className="card-body bg-gold-primary">
                        {isLogin ? <Login onLogin={onLogin} /> : <Register onLogin={onLogin} />}
                        <p className="mt-5">
                            {isLogin ? "Don't have an account? " : 'Already have an account? '}
                            <button
                                className="btn btn-link p-0 ml-1"
                                onClick={() => setLogin(!isLogin)}
                            >
                                {isLogin ? 'Register here' : 'Login here'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;

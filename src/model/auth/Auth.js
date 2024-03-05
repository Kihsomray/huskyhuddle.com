import React, { useState } from 'react';
import Login from './Login';
import Register from './Register';

const Auth = () => {
    const [isLogin, setLogin] = useState(true);

    //const backgroundImageUrl = 'url("background-image.jpg")';

    const containerStyle = {
        backgroundImage: backgroundImageUrl,
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
        <div style={containerStyle}>
            <div className="card mx-auto" style={cardStyle}>
                <div className="card-header bg-primary text-white">
                    <h3 className="mb-0">Authentication</h3>
                </div>
                <div className="card-body">
                    {isLogin ? <Login /> : <Register />}
                    <p className="mt-3">
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
    );
};

export default Auth;

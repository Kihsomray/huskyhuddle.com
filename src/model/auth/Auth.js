import React, { useEffect, useState } from 'react';
import Login from './Login';
import Register from './Register';
import axios from 'axios';

const Auth = ({ onLogin }) => {

    const [isLogin, setLogin] = useState(true);
    const [version, setVersion] = useState({ name: '', version: '' });

    const containerStyle = {
        backgroundSize: 'cover',
        backgroundPosition: 'top left',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        boxSizing: 'border-box',
        flexDirection: 'column',
    };

    const cardStyle = {
        width: '100%',
        maxWidth: '800px',
        margin: 'auto',
    };

    const headerStyle = {
        display: 'flex',
        width: '100%',
        textAlign: 'left',
        padding: '10px',
        fontWeight: 'bold',
        margin: '10px',
    }

    const footerStyle = {
        width: '100%',
        textAlign: 'left',
        padding: '10px',
        margin: 0,
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:4000/');
                setVersion(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, []);

    return (
        <div style={containerStyle}>
            <div style={{ display: "flex", width: "100%" }} className='btn-purple-secondary'>
                <img
                    style={{ maxWidth: "100px", margin: "10px" }}
                    src="https://uw-s3-cdn.s3.us-west-2.amazonaws.com/wp-content/uploads/sites/230/2023/11/02134810/W-Logo_White.png"
                    alt="Logo"
                />
                <h1 style={headerStyle} >HuskyHuddle</h1>
            </div>
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
            <p className='btn-purple-secondary' style={footerStyle}>&copy; {version.name} Team 2024 v{version.version}.</p>
        </div>
    );
};

export default Auth;

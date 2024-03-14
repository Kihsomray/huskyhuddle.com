import React from 'react';

const WarningModal = ({ message, onClose }) => {

    const modalStyle = {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        padding: "20px",
        border: "2px solid #32006e",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        zIndex: 1000,
    }

    const cardStyle = {
        textAlign: "center",
    };

    return (
        <div className='btn-gold-primary' style={modalStyle}>
            <div className={cardStyle}>
                <p>{message}</p>
                <button className='btn-purple-primary' onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default WarningModal;
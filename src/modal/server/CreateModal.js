import React, {useState} from 'react';

const CreateModal = ({ message, onClose, onSubmit }) => {

    const [result, setResult] = useState('');

    const modalStyle = {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        padding: "20px",
        border: "2px solid #32006e",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        zIndex: 1000,
        backgroundSize: 'cover',
        backgroundPosition: 'top left',
        backgroundColor: '#676767',
        height: '20%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '20%',
        boxSizing: 'border-box',
        flexDirection: 'column',
        borderRadius: '6px',
    }

    const cardStyle = {
        textAlign: "center",
        maxWidth: '400px'
    };

    const submission = (e) => {
        console.log("no")
        e.preventDefault();
        onSubmit(result);
    }

    return (
        <div className="container mt-5" style={modalStyle}>
            <div className="mx-auto" style={cardStyle}>
                <form>
                    <div className="mb-3">
                        <label htmlFor="result" className="form-label txt-gold-primary">
                            {message}
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="result"
                            value={result}
                            onChange={(e) => setResult(e.target.value)}
                        />
                    </div>
                    <button className="btn btn-block btn-purple-secondary" style={{marginRight: "10px"}} onClick={onClose}>
                        Cancel
                    </button>
                    <button className="btn btn-block btn-purple-primary" onClick={submission}>
                        Create
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateModal;
import React, { useEffect, useState } from 'react';
import Login from './Login';
import Signup from './Signup';
import ForgotPassword from './ForgotPassword';

const AuthPrism = ({ setCurrentUser }) => {
    const [face, setFace] = useState('login');

    useEffect(() => {
        const handler = (e) => {
            setFace(e.detail);
        };
        window.addEventListener('changeFace', handler);
        return () => window.removeEventListener('changeFace', handler);
    }, []);

    const getTransform = () => {
        switch (face) {
            case 'signup': return 'rotateY(-90deg)';
            case 'forgot': return 'rotateY(180deg)';
            case 'contact': return 'rotateY(90deg)';
            case 'subscribe': return 'rotateX(90deg)';
            case 'thankyou': return 'rotateX(-90deg)';
            default: return 'rotateY(0deg)';
        }
    };

    return (
        <div className="wrapper">
            <div className="rec-prism" style={{ transform: `${getTransform()} translateZ(-125px)` }}>
                <div className="face face-front"><Login setCurrentUser={setCurrentUser} /></div>
                <div className="face face-right"><Signup /></div>
                <div className="face face-back"><ForgotPassword /></div>
            </div>
        </div>
    );
};

export default AuthPrism;

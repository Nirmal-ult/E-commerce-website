import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import emailjs from 'emailjs-com';
import './VerifyCode.css';

const VerifyCode = () => {
    const [codeInput, setCodeInput] = useState('');
    const [error, setError] = useState('');
    const [resendMessage, setResendMessage] = useState('');
    const [timeLeft, setTimeLeft] = useState(0);
    const navigate = useNavigate();

    const stored = JSON.parse(localStorage.getItem('resetCode'));

    useEffect(() => {
        if (stored) {
            const seconds = Math.floor((stored.expiresAt - Date.now()) / 1000);
            setTimeLeft(seconds > 0 ? seconds : 0);
        }
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleVerify = (e) => {
        e.preventDefault();

        if (!stored) {
            setError('No reset request found.');
            return;
        }

        if (Date.now() > stored.expiresAt) {
            setError('Code has expired. Please request a new one.');
            return;
        }

        if (parseInt(codeInput) !== stored.code) {
            setError('Incorrect code.');
            return;
        }

        localStorage.setItem('resetVerified', stored.email);
        navigate('/reset-password');
    };

    const handleResend = async () => {
        const email = stored?.email;
        if (!email) {
            setError('Email not found.');
            return;
        }

        const newCode = Math.floor(100000 + Math.random() * 900000);
        const newExpiry = Date.now() + 10 * 60 * 200;

        localStorage.setItem('resetCode', JSON.stringify({ email, code: newCode, expiresAt: newExpiry }));
        localStorage.setItem('lastOtpRequest', Date.now().toString());

        try {
            await emailjs.send(
                'service_iwxsl5f',
                'template_xzdunse',
                { to_email: email, code: newCode },
                'Kb3Tskkl-rHH5TvjR'
            );
            setResendMessage('Code resent successfully!');
            setTimeLeft(120);
            setError('');
        } catch {
            setResendMessage('Failed to resend code.');
        }
    };

    return (
        <div className="verify-code-container">
            <form className="verify-code-form" onSubmit={handleVerify}>
                <h2 className="form-title">Verify Your Email</h2>
                <p className="email-info">
                    Code sent to: {stored?.email.replace(/(.{2}).+(@.+)/, "$1****$2")}
                </p>

                <input
                    type="text"
                    placeholder="Enter verification code"
                    value={codeInput}
                    className='field-input'
                    onChange={(e) => setCodeInput(e.target.value)}
                    required
                />

                {timeLeft > 0 ? (
                    <p className="timer-text">Code expires in {timeLeft}s</p>
                ) : (
                    <button type="button" onClick={handleResend} className="btn-secondary">
                        Resend Code
                    </button>
                )}

                {resendMessage && <p className="form-message info-message">{resendMessage}</p>}
                {error && <p className="form-message error-message">{error}</p>}

                <button type="submit" className="btn-primary">Verify</button>
            </form>
        </div>
    );
};

export default VerifyCode;

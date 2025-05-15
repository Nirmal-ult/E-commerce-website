import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import emailjs from 'emailjs-com';
import './ForgotPassword.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSendCode = async (e) => {
        e.preventDefault();
        setMessage('');

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === email);

        // ✅ Check if email is registered
        if (!user) {
            setMessage('No account associated with this email.');
            return;
        }

        const now = Date.now();
        const lastRequestTime = parseInt(localStorage.getItem('lastOtpRequest') || '0');

        // ✅ Prevent spam by limiting resend rate
        if (now - lastRequestTime < 60 * 1000) {
            setMessage('Please wait at least 1 minute before requesting another code.');
            return;
        }

        // ✅ Generate OTP and store with expiry
        const code = Math.floor(100000 + Math.random() * 900000);
        const expiresAt = now + 10 * 60 * 200; // 10 minutes

        localStorage.setItem('resetCode', JSON.stringify({ email, code, expiresAt }));
        localStorage.setItem('lastOtpRequest', now.toString());

        try {
            await emailjs.send(
                'service_iwxsl5f',
                'template_xzdunse',
                { to_email: email, code },
                'Kb3Tskkl-rHH5TvjR'
            );
            setMessage('Verification code sent to your email.');
            navigate('/verify-code');
        } catch (err) {
            console.error("EmailJS error:", err);
            setMessage('Failed to send code. Please try again.');
        }
    };

    return (
        <div className="forgot-container">
            <form className="forgot-form" onSubmit={handleSendCode}>
                <h2 className="forgot-title">Reset Password</h2>
                <input
                    type="email"
                    className="forgot-input"
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                {message && (
                    <p className={`forgot-message ${message.includes('Failed') || message.includes('No account') ? 'error' : 'success'}`}>
                        {message}
                    </p>
                )}
                <p onClick={()=>navigate('/login')}> back to login</p>
                <button type="submit" className="forgot-submit-btn">Send Code</button>
            </form>
        </div>
    );
};

export default ForgotPassword;

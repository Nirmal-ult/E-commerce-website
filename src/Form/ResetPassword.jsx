import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ResetPassword.css';

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const storedEmail = localStorage.getItem('resetVerified');
        if (!storedEmail) {
            navigate('/forgot-password');
        }
    }, [navigate]);

    const handlePasswordReset = (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        const storedEmail = localStorage.getItem('resetVerified');
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(u => u.email === storedEmail);

        if (user) {
            user.password = newPassword;
            localStorage.setItem('users', JSON.stringify(users));
            setSuccess('Password reset successfully!');
            setError('');

            setTimeout(() => {
                localStorage.removeItem('resetVerified');
                navigate('/login');
            }, 2000);
        } else {
            setError('User not found.');
        }
    };

    return (
        <div className="reset-password-container">
            <form className="reset-password-form" onSubmit={handlePasswordReset}>
                <h2 className="form-title">Reset Your Password</h2>
                {error && <p className="form-message error-message">{error}</p>}
                {success && <p className="form-message success-message">{success}</p>}

                <div className="form-field">
                    <label htmlFor="new-password">New Password</label>
                    <input
                        type="password"
                        id="new-password"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="confirm-password">Confirm Password</label>
                    <input
                        type="password"
                        id="confirm-password"
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>

                <button type="submit" className="btn-primary">Reset Password</button>
            </form>
        </div>
    );
};

export default ResetPassword;

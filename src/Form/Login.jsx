import React, { useEffect, useState } from 'react';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import './Login.css';
import { useLocation, useNavigate } from 'react-router-dom';

const Login = ({ setCurrentUser }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
     useEffect(() => {
            if (location.pathname === '/') {
                document.body.classList.add('login-page');
            }
            return () => {
                document.body.classList.remove('login-page');
            };
        }, [location]);
    

    const handleLogin = (e) => {
        e.preventDefault();
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(user => user.email === email);

        if (!user) {
            setErrorMessage('No account found with this email.');
            return;
        }

        if (user.password !== password) {
            setErrorMessage('Incorrect password.');
            return;
        }

        setErrorMessage('');
        localStorage.setItem('currentUser', JSON.stringify(user));
        setCurrentUser(user);
        navigate(user.role === 'buyer' ? '/products' : '/productlist');
        window.location.reload();
    };

    return (
        <div className="login-wrapper fade-in">
            <form className="login-box slide-in" onSubmit={handleLogin}>
                <h2 className="login-title">Welcome Back</h2>

                <div className="form-field">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="password">Password</label>
                    <div className="password-container">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            id="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <span
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEye /> : <FaEyeSlash />}
                        </span>
                    </div>
                </div>

                {errorMessage && (
                    <p className="error-text">{errorMessage}</p>
                )}

                <div className="login-actions">
                    <p className="link" onClick={() => navigate('./forgot-password')}>
                        Forgot Password?
                    </p>
                    <p className="link" onClick={() => navigate('/signup')}>
                        Don't have an account?
                    </p>
                </div>

                <button type="submit" className="login-button">Login</button>
            </form>
        </div>
    );
};

export default Login;

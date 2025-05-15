import React, { useState, useEffect } from 'react';
import { FaCartShopping } from "react-icons/fa6";
import { FaEye, FaEyeSlash, FaStore } from "react-icons/fa";
import { useNavigate, useLocation } from 'react-router-dom';
import './Signup.css';

const Signup = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (location.pathname === '/signup') {
            document.body.classList.add('signup-page');
        }
        return () => {
            document.body.classList.remove('signup-page');
        };
    }, [location]);

    const handleSignup = (e) => {
        e.preventDefault();

        if (!email || !password || !selectedRole) {
            setErrorMessage("Please fill out all fields.");
            return;
        }

        const users = JSON.parse(localStorage.getItem('users')) || [];
        const existingUser = users.find(user => user.email === email);

        if (existingUser) {
            setErrorMessage("An account with this email already exists.");
            return;
        }

        const newUser = { email, password, role: selectedRole };
        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));

        alert('Signup successful!');
        navigate('/');
    };

    return (
        <div className="signup-card">
            <form onSubmit={handleSignup} className="signup-form">
                <h2 className="signup-title">Create Account</h2>

                <div className="signup-field">
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

                <div className="signup-field">
                    <label htmlFor="password">Password</label>
                    <div className="signup-password">
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

                <div className="signup-roles">
                    <button
                        type="button"
                        className={`role-btn ${selectedRole === 'buyer' ? 'active' : ''}`}
                        onClick={() => setSelectedRole('buyer')}
                    >
                        <FaCartShopping /> Buyer
                    </button>
                    <button
                        type="button"
                        className={`role-btn ${selectedRole === 'seller' ? 'active' : ''}`}
                        onClick={() => setSelectedRole('seller')}
                    >
                        <FaStore /> Seller
                    </button>
                </div>

                {errorMessage && <p className="signup-error">{errorMessage}</p>}

                <p className="signup-link" onClick={() => navigate('/')}>
                    Already have an account? <span>Log In</span>
                </p>

                <button type="submit" className="signup-submit">Sign Up</button>
            </form>
        </div>
    );
};

export default Signup;

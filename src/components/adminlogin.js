// src/components/adminlogin.js
import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import logo from '../images/logo.png';
import './globalstyles.css';
import './adminlogin.css';

const AdminLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false); 
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate('/admindashboard');
        } catch (error) {
            console.error('Login failed:', error);
        }
    };

    return (
        <div className="login-page">
            <header className="header">
                <div className="logo">
                    <img src={logo} alt="TNapoleDetail" />
                </div>
            </header>
            <div className="login-container">
                <form className="login-form" onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label htmlFor="emailInput" className="form-label">Email address</label>
                        <input
                            type="email"
                            className="form-control"
                            id="emailInput"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="passwordInput" className="form-label">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="passwordInput"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-3 form-check">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            id="rememberMeCheck"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <label className="form-check-label" htmlFor="rememberMeCheck">Remember me</label>
                        <a href="/reset-password" style={{ float: 'right' }}>Forgot password?</a>
                    </div>
                    <button type="submit" className="btn btn-primary">Login</button>
                    <p className="mt-3">
                        Don't have an account? <a href="/signup">Create an account here</a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
 
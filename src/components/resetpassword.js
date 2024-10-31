import React, { useState } from 'react';
import { auth } from '../firebase';
import { sendPasswordResetEmail } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleReset = async (e) => {
        e.preventDefault();
        try {
            await sendPasswordResetEmail(auth, email);
            setMessage('Check your email for the password reset link!');
        } catch (error) {
            console.error('Error sending reset email:', error);
            setMessage('Failed to send reset email. Please try again.');
        }
    };

    return (
        <div>
            <h2>Reset Password</h2>
            <form onSubmit={handleReset}>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                />
                <button type="submit">Send Reset Email</button>
            </form>
            {message && <p>{message}</p>}
            <button onClick={() => navigate('/login')}>Back to Login</button>
        </div>
    );
};

export default ResetPassword;

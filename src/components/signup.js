//srvc/components/signup.js
import React, { useState } from 'react';
import { auth, database } from '../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import logo from '../images/logo.png';
import './globalstyles.css';
import './signup.css';

const Signup = () => {
    const [fullName, setFullName] = useState('');
    const [address, setAddress] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [city, setCity] = useState('');
    const [phone, setPhone] = useState('');
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('customer');
    const [isActive, setIsActive] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await set(ref(database, 'customers/' + user.uid), {
                name: fullName,
                address,
                postalCode,
                city,
                phone,
                mobile,
                email,
                role: 'customer',
                isActive,
            });

            await set(ref(database, 'users/' + user.uid), {
                email,
                role: 'customer',
                isActive,
            });

            navigate('/Login'); 
        } catch (err) {
            setError(err.message);
            console.error('Sign Up failed:', err);
        }
    };

    return (
        <div className="signup-page">
        <header className="header">
            <div className="logo">
                <img src={logo} alt="TNapoleDetail" />
            </div>
        </header>
        
        <div className="signup-container">
            <h2>Sign Up</h2>
            
            {error && <p className="error-message">{error}</p>}
            
            <form onSubmit={handleSignup} className="signup-form">
                <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Full Name"
                    required
                    className="form-input"
                />
                <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Address"
                    required
                    className="form-input"
                />
                <input
                    type="text"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    placeholder="Postal Code (CEP)"
                    required
                    className="form-input"
                />
                <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="City"
                    required
                    className="form-input"
                />
                <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Phone"
                    required
                    className="form-input"
                />
                <input
                    type="text"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="Mobile"
                    required
                    className="form-input"
                />
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    required
                    className="form-input"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    className="form-input"
                />
                <button type="submit" className="signup-button">Sign Up</button>
            </form>

            <p className="login-prompt">
                Already have an account? <a href="/login" className="login-link">Login here</a>
            </p>
        </div>
    </div>
    );
};

export default Signup;
 
 
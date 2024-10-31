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
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            await set(ref(database, 'customers/' + user.uid), {
                fullName,
                address,
                postalCode,
                city,
                phone,
                mobile,
                email,
                role: 'customer',
            });

            // Adiciona o novo usuário na tabela users
            await set(ref(database, 'users/' + user.uid), {
                email,
                role: 'customer',
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
                    />
                    <input
                        type="text"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="Address"
                        required
                    />
                    <input
                        type="text"
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        placeholder="Postal Code (CEP)"
                        required
                    />
                    <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="City"
                        required
                    />
                    <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Phone"
                        required
                    />
                    <input
                        type="text"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        placeholder="Mobile"
                        required
                    />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        required
                    />
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        required
                    />
                    <button type="submit">Sign Up</button>
                </form>
                <p>
                    Already have an account? <a href="/login">Login here</a>
                </p>
            </div>
        </div>
    );
};

export default Signup;
 
 
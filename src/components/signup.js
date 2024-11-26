import React, { useState } from 'react';
import { auth, database } from '../firebase';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { ref, set } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import logo from '../images/logo.png';
import './globalstyles.css';
import './signup.css';

const Signup = () => {
    const [fullName, setFullName] = useState('');
    const [phone, setPhone] = useState('');
    const [mobile, setMobile] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('customer');
    const [isActive, setIsActive] = useState(true);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // Criar o usuário no Firebase Authentication
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Salvar os dados do usuário no Firebase Realtime Database
            await set(ref(database, 'customers/' + user.uid), {
                name: fullName,
                phone,
                mobile,
                email,
                role,
                isActive,
            });

            await set(ref(database, 'users/' + user.uid), {
                email,
                role,
                isActive,
            });

            // Enviar o e-mail de verificação
            await sendEmailVerification(user);

            // Mensagem de sucesso
            setMessage("Registration successful! A verification email has been sent to you.");
            setIsLoading(false);

            // Redirecionar para a página de login após 2 segundos
            setTimeout(() => navigate('/Login'), 2000);
        } catch (err) {
            setError(`Sign Up failed: ${err.message}`);
            setIsLoading(false);
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
                {message && <p className="success-message">{message}</p>}

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
                    <button type="submit" className="signup-button" disabled={isLoading}>
                        {isLoading ? 'Loading...' : 'Sign Up'}
                    </button>
                </form>

                <p className="login-prompt">
                    Already have an account? <a href="/login" className="login-link">Login here</a>
                </p>
            </div>
        </div>
    );
};

export default Signup;

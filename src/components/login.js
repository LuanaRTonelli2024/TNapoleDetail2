// src/components/login.js
import React, { useState } from 'react';
import { auth, database } from '../firebase'; // Importa a configuração do Firebase
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { getDatabase, ref, get } from 'firebase/database'; // Importa o Realtime Database
import logo from '../images/logo.png';
import './globalstyles.css';
import './login.css';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false); 
    const [error, setError] = useState(''); 
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        console.log("Login attempt");
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Verifica o papel do usuário no Realtime Database
            const db = getDatabase();
            const userRef = ref(database, `users/${user.uid}`);
            const snapshot = await get(userRef);

            if (snapshot.exists()) {
                const userData = snapshot.val();

                // Redirecionar baseado no papel do usuário
                if (userData.role === 'employee') {
                    navigate('/AdminDashboard'); // Redirecionar para o dashboard de funcionários
                } else if (userData.role === 'customer') {
                    navigate('/Dashboard'); // Redirecionar para o dashboard de clientes
                } else if (userData.role === 'detailtechnician') {
                    navigate('/TechnicianDashboard'); // Redirecionar para o dashboard de teclados
                } else {
                    alert('Acesso negado. Você não tem permissão para acessar esta área.');
                    await auth.signOut(); // Deslogar se não for um papel válido
                    navigate('/'); // Redirecionar para a página inicial
                }
            } else {
                alert('Usuário não encontrado.');
                await auth.signOut(); // Deslogar se não encontrar o usuário
            }
        } catch (error) {
            console.error('Login failed:', error);
            setError('Login falhou. Verifique suas credenciais.'); // Adicione mensagem de erro
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
                {error && <p className="error-message">{error}</p>} {/* Mensagem de erro */}
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

export default Login;
 
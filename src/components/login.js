// src/components/login.js
import React, { useState } from 'react';
import { auth } from '../firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

const handleLogin = async () => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        console.error('Login failed:', error);
    }
};

    return (
      <form onSubmit={handleLogin}>
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
        placeholder="Senha"
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
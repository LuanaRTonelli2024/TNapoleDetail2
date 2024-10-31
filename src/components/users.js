// src/components/users.js
import { auth, firestore } from './firebase';

const registerUser = async (email, password, name, role) => {
  try {
    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
    const user = userCredential.user;

    // Adiciona o usuário ao Firestore
    await firestore.collection('users').doc(user.uid).set({
      name,
      email,
      role, // 'funcionario' ou 'admin'
      createdAt: new Date(),
    });

    console.log('Usuário registrado com sucesso!');
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
  }
};

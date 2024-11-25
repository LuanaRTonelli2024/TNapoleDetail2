// src/components/customerdashboard.js
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ref, get } from 'firebase/database';
import { auth, database } from '../firebase';
import logo from '../images/logo.png';
import Profile from './customerprofile';
import Vehicles from './customervehicles';
import Booking from './customerbooking';
import AppointmentsHistory from './appointmentshistory';
import ServiceHistory from './customerservicehistory';
import ChangePassword from './changepassword';
import './globalstyles.css';
import './customerdashboard.css';
//import 'bootstrap/dist/css/bootstrap.min.css';

const CustomerDashboard = () => {
    const [activeTab, setActiveTab] = useState('');
    const [welcomeVisible, setWelcomeVisible] = useState(true);
    const [userName, setUserName] = useState(''); // Estado para armazenar o nome do usuário

    // Função para buscar o nome do usuário
    const fetchUserName = async () => {
        const user = auth.currentUser;
        if (user) {
            try {
                // Ref para buscar o nome do usuário no banco de dados (tabela 'customers')
                const userRef = ref(database, `customers/${user.uid}`);
                const snapshot = await get(userRef);
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    setUserName(userData.name); // Atualiza o estado com o nome do usuário
                } else {
                    console.log('Usuário não encontrado no banco de dados.');
                }
            } catch (error) {
                console.error('Erro ao buscar os dados do usuário:', error);
            }
        }
    };

    // Chama a função fetchUserName quando o componente for montado
    useEffect(() => {
        fetchUserName();
    }, []);

    // Função para alternar as abas
    const handleTabClick = (tab) => {
        setActiveTab(tab);
        setWelcomeVisible(false);
    };

    return (
        <div className='dashboard-page'>
            <header className="header">
                <div className="navbar">
                    <div className="logo">
                        <img src={logo} alt="TNapoleDetail" />
                    </div>
                    <div>
                        <Link to="/" className="btn-logout">Logout</Link>
                    </div>
                </div>
            </header>
            <div className='dashboard-content'>
                <aside className='sidebar'>
                    <ul>
                        <li>
                            <Link to="#" onClick={() => { setActiveTab(''); setWelcomeVisible(true); }}>Home</Link>
                        </li>
                        <li>
                            <Link to="#" onClick={() => handleTabClick('profile')}>Profile</Link>
                        </li>
                        <li>
                            <Link to="#" onClick={() => handleTabClick('vehicles')}>Vehicles</Link>
                        </li>
                        <li>
                            <Link to="#" onClick={() => handleTabClick('appointmentshistory')}>Appointments History</Link>
                        </li>
                        <li>
                            <Link to="#" onClick={() => handleTabClick('servicehistory')}>Service History</Link>
                        </li>
                        <li>
                            <Link to="#" onClick={() => handleTabClick('changePassword')}>Change Password</Link>
                        </li>
                    </ul>
                </aside>
                <main className='main-content'>
                    <section className='booking-section'>
                        {welcomeVisible && userName && <h2>Welcome, {userName}</h2>} {/* Exibe o nome do usuário */}
                        {activeTab === '' && <Booking />} {/* Renderiza Booking na home */}
                        {activeTab === 'profile' && <Profile />}
                        {activeTab === 'vehicles' && <Vehicles />}
                        {activeTab === 'appointmentshistory' && <AppointmentsHistory />}
                        {activeTab === 'servicehistory' && <ServiceHistory />}
                        {activeTab === 'changePassword' && <ChangePassword />}
                    </section>
                </main>
            </div>
            <footer>
                <p>Copyright &copy; 2023 TNapoleDetail. All rights reserved.</p>
            </footer>
        </div>
    );
};

export default CustomerDashboard;
  
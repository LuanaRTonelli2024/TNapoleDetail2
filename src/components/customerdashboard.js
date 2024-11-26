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

const CustomerDashboard = () => {
    const [activeTab, setActiveTab] = useState('');
    const [welcomeVisible, setWelcomeVisible] = useState(true);
    const [userName, setUserName] = useState('');
    const [upcomingAppointments, setUpcomingAppointments] = useState([]);

    // Função para buscar o nome do usuário
    const fetchUserName = async () => {
        const user = auth.currentUser;
        if (user) {
            try {
                const userRef = ref(database, `customers/${user.uid}`);
                const snapshot = await get(userRef);
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    setUserName(userData.name);
                } else {
                    console.log('Usuário não encontrado no banco de dados.');
                }
            } catch (error) {
                console.error('Erro ao buscar os dados do usuário:', error);
            }
        }
    };

    // Função para buscar os próximos agendamentos
    const fetchUpcomingAppointments = async () => {
        const user = auth.currentUser;
        if (user) {
            try {
                const appointmentsRef = ref(database, `appointments/${user.uid}`);
                const snapshot = await get(appointmentsRef);
                if (snapshot.exists()) {
                    const appointments = Object.values(snapshot.val())
                        .filter(appointment => new Date(appointment.date) >= new Date()) // Filtra agendamentos futuros
                        .sort((a, b) => new Date(a.date) - new Date(b.date)) // Ordena por data
                        .slice(0, 3); // Pega os 3 primeiros
                    setUpcomingAppointments(appointments);
                } else {
                    console.log('Nenhum agendamento encontrado.');
                }
            } catch (error) {
                console.error('Erro ao buscar agendamentos:', error);
            }
        }
    };

    useEffect(() => {
        fetchUserName();
        fetchUpcomingAppointments();
    }, []);

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
                            <Link to="#" onClick={() => handleTabClick('schedule')}>Schedule an Appointment</Link>
                        </li>
                        <li>
                            <Link to="#" onClick={() => handleTabClick('appointmentshistory')}>Appointments History</Link>
                        </li>
                        <li>
                            <Link to="#" onClick={() => handleTabClick('changePassword')}>Change Password</Link>
                        </li>
                    </ul>
                </aside>
                <main className='main-content'>
                    <section className='dashboard-section'>
                        {welcomeVisible && userName && (
                            <>
                                <h2>Welcome, {userName}</h2>
                                <div className="home-section">
                                    <button
                                        className="btn-schedule-appointment"
                                        onClick={() => handleTabClick('schedule')}
                                    >
                                        Schedule an Appointment
                                    </button>
                                    {upcomingAppointments.length > 0 && (
                                        <div className="appointments-board">
                                            <h3>Your Next Appointments</h3>
                                            <ul>
                                                {upcomingAppointments.map((appointment, index) => (
                                                    <li key={index} className="appointment-item">
                                                        <p><strong>Date:</strong> {appointment.date}</p>
                                                        <p><strong>Service:</strong> {appointment.service}</p>
                                                        <p><strong>Status:</strong> {appointment.status}</p>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    {upcomingAppointments.length === 0 && (
                                        <p>No upcoming appointments found. Schedule one now!</p>
                                    )}
                                </div>
                            </>
                        )}
                        {activeTab === 'schedule' && (
                            <div className="booking-container">
                                <Booking />
                            </div>
                        )}
                        {activeTab === 'profile' && <Profile />}
                        {activeTab === 'vehicles' && <Vehicles />}
                        {activeTab === 'appointmentshistory' && <AppointmentsHistory />}
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

//srvc/components/customerdashboard.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../images/logo.png';
import Profile from './customerprofile';
import Vehicles from './customervehicles';
import Booking from './customerbooking';
import ServiceHistory from './customerservicehistory';
import ChangePassword from './changepassword';
import './globalstyles.css';
import './customerdashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const CustomerDashboard = () => {
    const [activeTab, setActiveTab] = useState('');
    const [welcomeVisible, setWelcomeVisible] = useState(true);

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
                            <Link to="#" onClick={() => { setActiveTab(''); setWelcomeVisible(true); }}>Home</Link> {/* A home agora define activeTab como vazio */}
                        </li>
                        <li>
                            <Link to="#" onClick={() => handleTabClick('profile')}>Profile</Link>
                        </li>
                        <li>
                            <Link to="#" onClick={() => handleTabClick('vehicles')}>Vehicles</Link>
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
                        {welcomeVisible && <h2>Welcome, [User's Name]</h2>}
                        {activeTab === '' && <Booking />} {/* Renderiza Booking na home */}
                        {activeTab === 'profile' && <Profile />}
                        {activeTab === 'vehicles' && <Vehicles />}
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
 
 
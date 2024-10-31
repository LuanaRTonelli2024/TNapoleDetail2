//srvc/components/admindashboard.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../images/logo.png';
import AdminCustomers from './admincustomers';
import AdminEmployees from './adminemployees';
import Booking from './booking';
import ServiceHistory from './servicehistory';
import ChangePassword from './changepassword';
import './globalstyles.css';
import './admindashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const AdminDashboard = () => {
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
                            <Link to="#" onClick={() => { setActiveTab(''); setWelcomeVisible(true); }}>Home</Link>
                        </li>
                        <li>
                            <Link to="#" onClick={() => handleTabClick('admincustomers')}>Customers</Link>
                        </li>
                        <li>
                            <Link to="#" onClick={() => handleTabClick('adminemployees')}>Employees</Link>
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
                        {activeTab === 'booking' && <Booking />}
                        {activeTab === 'admincustomers' && <AdminCustomers />}
                        {activeTab === 'adminemployees' && <AdminEmployees />}
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

export default AdminDashboard;
 
 
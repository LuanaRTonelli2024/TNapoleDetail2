// src/components/homepage.js
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../images/logo.png';
import OurServices from './ourservices';
import About from './aboutus'; 
import Contact from './contactus';
import './globalstyles.css';
import './homepage.css';

const Homepage = () => {
    return (
        <div className='homepage'>
            <header className="header">
                <div className="navbar">
                    <div className="logo">
                        <img src={logo} alt="TNapoleDetail" />
                    </div>
                    <nav>
                        <ul>
                        <li><Link to="/">Home</Link></li>  
                        <li><a href="#ourservices">Our Services</a></li>
                        <li><a href="#aboutus">About us</a></li>
                        <li><a href="#contactus">Contact us</a></li>
                        </ul>
                    </nav>
                    <div className="login">
                        <Link to="/Login" className="btn-login">Login</Link>
                    </div>
                </div>
            </header>
            <section className="hero-section">
                <div className="hero-content">
                    <h1>Your Car, Our Passion</h1>
                    <p>Premium auto detailing services to bring back the shine to your vehicle.</p>
                    <Link to="/Signup" className="cta-btn">Online Reservation</Link>
                </div>
            </section>
            <OurServices />
            <About />
            <Contact />
            <footer>
                <p>Copyright &copy; 2023 TNapoleDetail. All rights reserved.</p>
            </footer>
        </div>
    );
}

export default Homepage;
 
 

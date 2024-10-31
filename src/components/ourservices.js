// src/components/ourservices.js
import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../images/logo.png';
import detailingImage from '../images/detailing.jpg';
import paintcorrectionImage from '../images/paintcorrection.jpg';
import ceramiccoatingImage from '../images/ceramiccoating.jpg';
import './globalstyles.css';
import './ourservices.css';

const MyComponent = () => {
    return (
        <div id="ourservices" className='ourservices-page'>
            <section id="services" className="services-section">
                <h2>Our Services</h2>
                <div className="services-grid">
                <div className="service-card">
                    <img src={detailingImage} alt="Car Detailing"/>
                    <div className="overlay">
                    <h3>Car Detailing</h3>
                    <p>A full-service car detailing. It's a deep cleaning by an attentive team of professionals who care about your satisfaction.</p>
                    <Link to="/packages" className="btn-overlay">View Packages</Link>
                    </div>
                </div>
                <div className="service-card">
                    <img src={paintcorrectionImage} alt="Paint Correction"/>
                    <div className="overlay">   
                    <h3>Paint Correction</h3>
                    <p>Thorough cleaning to make your interior as good as new.</p>      
                    <Link to="/packages" className="btn-overlay">View Packages</Link>  
                    </div>
                </div>
                <div className="service-card">
                    <img src={ceramiccoatingImage} alt="Ceramic Coating"/>
                    <div className="overlay">
                    <h3>Ceramic Coating</h3>
                    <p>Protect your vehicle’s paint with long-lasting ceramic coating.</p>
                    <Link to="/packages" className="btn-overlay">View Packages</Link>
                    </div>
                </div>
                </div>
            </section>
        </div>
    );
};

export default MyComponent;

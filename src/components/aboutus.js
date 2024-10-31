// src/components/aboutus.js
import React from 'react';
import './globalstyles.css';
import './aboutus.css';

const AboutUs = () => {
    return (
        <div id="aboutus" className='aboutus-page'>
            <section id="about-us" className="about-us-section">
                <h2>About Us</h2>
                <p>
                    Welcome to TNapoleDetail! We are dedicated to providing the best car detailing services in the industry. 
                    Our team of professionals is committed to ensuring your vehicle looks its best.
                </p>
                <h3>Our Mission</h3>
                <p>
                    Our mission is to deliver exceptional detailing services that enhance the appearance and value of your vehicle, 
                    while ensuring customer satisfaction through our quality and attention to detail.
                </p>
                <h3>Our Vision</h3>
                <p>
                    We envision a future where every vehicle is cared for with the utmost professionalism and expertise, 
                    creating lasting relationships with our customers.
                </p>
                <h3>Our Values</h3>
                <ul>
                    <li>Integrity: We believe in being honest and transparent in our services.</li>
                    <li>Quality: We strive for excellence in everything we do.</li>
                    <li>Customer Focus: Our customers are our top priority.</li>
                    <li>Innovation: We continuously seek to improve and innovate our services.</li>
                </ul>
            </section>
        </div>
    );
};

export default AboutUs;
 
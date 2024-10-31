// src/components/contactus.js
import React, { useState } from 'react';
import emailjs from 'emailjs-com';
import './globalstyles.css';
import './contactus.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: ''
    });
    const [successMessage, setSuccessMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        emailjs.send('service_stfa96j', 'template_m034w9a', formData, 'ixtxPs4UqcvUWMvu5')
            .then((response) => {
                console.log('Email successfully sent!', response.status, response.text);
                setSuccessMessage('Your message has been sent successfully!');
                setFormData({ name: '', email: '', phone: '', message: '' });
            }, (err) => {
                console.error('Failed to send email:', err);
                setSuccessMessage('Failed to send your message, please try again.');
            });
    };

    return (
        <div id="contactus" className='contact-page'>
            <h2>Contact Us</h2>
            <div className="contact-container">
                <div className='company-info'>
                    <h3>TNapoleDetail</h3>
                    <p>Phone: (XX) XXXX-XXXX</p>
                    <p>Instagram: <a href="https://instagram.com/yourprofile" target="_blank" rel="noopener noreferrer">@yourprofile</a></p>
                    <p>Facebook: <a href="https://facebook.com/yourprofile" target="_blank" rel="noopener noreferrer">facebook.com/yourprofile</a></p>
                </div>
                <div className="line"></div> {/* Linha vertical */}
                <form onSubmit={handleSubmit} className='contact-form'>
                    <div>
                        <label htmlFor='name'>Name:</label>
                        <input 
                            type='text' 
                            id='name' 
                            name='name' 
                            value={formData.name} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div>
                        <label htmlFor='email'>Email:</label>
                        <input 
                            type='email' 
                            id='email' 
                            name='email' 
                            value={formData.email} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div>
                        <label htmlFor='phone'>Phone:</label>
                        <input 
                            type='tel' 
                            id='phone' 
                            name='phone' 
                            value={formData.phone} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <div>
                        <label htmlFor='message'>Message:</label>
                        <textarea 
                            id='message' 
                            name='message' 
                            value={formData.message} 
                            onChange={handleChange} 
                            required 
                        />
                    </div>
                    <button type='submit'>Send</button>
                </form>
                {/* A mensagem de sucesso é exibida aqui, abaixo do formulário */}
                {successMessage && <p className="success-message">{successMessage}</p>}
            </div>
        </div>
    );
};

export default Contact;

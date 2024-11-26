import React, { useState } from 'react';
import axios from 'axios';

const PaymentLink = ({ appointmentId, clientEmail }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSendPaymentLink = async () => {
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const response = await axios.post('http://localhost:3000/create-payment-link', {
                amount: 5000, // Exemplo: 50 USD = 5000 centavos
                customerEmail: clientEmail, // Passando o email do cliente
            });

            if (response.data.url) {
                window.location.href = response.data.url; // Redireciona para o Stripe
                setSuccess(true);
            } else {
                setError('Error sending payment link.');
            }
        } catch (err) {
            console.error('Error:', err);
            setError('Error sending payment link.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="payment-link-container">
            <h3>Send Payment Link</h3>
            <button onClick={handleSendPaymentLink} disabled={loading}>
                {loading ? 'Sending...' : 'Send Payment Link'}
            </button>
            {error && <p className="error">{error}</p>}
            {success && <p className="success">Payment link sent successfully!</p>}
        </div>
    );
};

export default PaymentLink;

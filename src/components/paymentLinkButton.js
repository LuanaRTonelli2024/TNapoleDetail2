// src/components/paymentLinkButton.js
import React from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

// Função para criar uma sessão de pagamento e redirecionar para o Stripe
const createPaymentLink = async (appointment) => {
    const stripe = await stripePromise;
    const priceId = "price_1NAbc1234DEFG5678"; // Substitua pelo ID do preço do Stripe

    try {
        const response = await fetch('https://api.stripe.com/v1/checkout/sessions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: `Bearer ${process.env.REACT_APP_STRIPE_SECRET_KEY}`, 
            },
            body: new URLSearchParams({
                success_url: 'https://sua-url.com/success',
                cancel_url: 'https://sua-url.com/cancel',
                mode: 'payment',
                line_items: JSON.stringify([{ price: priceId, quantity: 1 }]),
            }),
        });

        const session = await response.json();
        if (session.url) {
            window.location.href = session.url; // Redireciona para o checkout do Stripe
        } else {
            throw new Error('Erro ao criar sessão de pagamento');
        }
    } catch (error) {
        console.error('Erro ao redirecionar para o Stripe:', error);
    }
};

const PaymentLinkButton = ({ appointment }) => {
    return (
        <button onClick={() => createPaymentLink(appointment)} className="payment-link-button">
            Send Payment Link
        </button>
    );
};

export default PaymentLinkButton;


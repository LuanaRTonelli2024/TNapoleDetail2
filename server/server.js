const express = require('express');
const stripe = require('stripe')('sk_test_51QOYz3KlpAxvdEVZ1a7pprDfaWzMeHpbM4AZXxavFqpcDt6qr0VYdT1kwAIDU1kNofIebAChCz6jTpH1TR1WByN500xJZsls4z'); // Sua chave secreta
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Rota para criar o link de pagamento no Stripe
app.post('/create-payment-link', async (req, res) => {
    const { amount, customerEmail } = req.body;

    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: 'Service Payment',
                        },
                        unit_amount: amount, // O valor do pagamento em centavos
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}`, // URL de sucesso
            cancel_url: 'http://localhost:3000/cancel', // URL de cancelamento
            customer_email: customerEmail, // Email do cliente
        });

        res.status(200).send({ url: session.url }); // Retorna o link de pagamento
    } catch (error) {
        console.error("Error creating payment link:", error);
        res.status(500).send({ error: 'Internal Server Error' });
    }
});

// Configura a porta do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

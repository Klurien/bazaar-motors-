import Stripe from 'stripe';

// Use a mock fallback if no real stripe key is securely provided
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock123');

export const createPaymentIntent = async (req, res) => {
    try {
        const { items } = req.body;

        let totalAmount = 0;

        if (items && items.length > 0) {
            // In a real app, ALWAYS fetch the prices from your database to prevent client manipulation.
            // For now, we trust the client's cart for demonstration.
            items.forEach(item => {
                totalAmount += (item.price * item.quantity);
            });
        }

        // Stripe requires amount in sub-units (cents)
        const amountInCents = Math.round(totalAmount * 100);

        if (process.env.STRIPE_SECRET_KEY) {
            const paymentIntent = await stripe.paymentIntents.create({
                amount: amountInCents > 0 ? amountInCents : 100, // minimum 1 dollar
                currency: 'usd',
                automatic_payment_methods: {
                    enabled: true,
                },
            });

            res.send({
                clientSecret: paymentIntent.client_secret,
                isMock: false
            });
        } else {
            // Mock response for development if no stripe key provided
            res.send({
                clientSecret: 'mock_secret_client_xyz',
                isMock: true
            });
        }

    } catch (error) {
        console.error('Stripe error:', error.message);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

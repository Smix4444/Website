// Vercel Serverless: POST /api/checkout/create-session
const products = require('../../server/data/products.json');

module.exports = async (req, res) => {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
        const { items } = req.body;

        if (!items || !Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'No items provided' });
        }

        const lineItems = items.map(item => {
            const product = products.find(p => p.id === item.id);
            if (!product) throw new Error(`Product ${item.id} not found`);

            return {
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: product.name,
                        description: product.description,
                    },
                    unit_amount: product.price,
                },
                quantity: item.quantity,
            };
        });

        const origin = req.headers.origin || req.headers.referer || 'https://your-site.vercel.app';

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            success_url: `${origin}/success.html?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/cart.html`,
        });

        res.status(200).json({ url: session.url });
    } catch (error) {
        console.error('Stripe Error:', error.message);
        res.status(500).json({ error: 'Checkout session creation failed', details: error.message });
    }
};

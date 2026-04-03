const express = require('express');
const router = express.Router();
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const path = require('path');
const fs = require('fs');

const productsPath = path.join(__dirname, '../data/products.json');

router.post('/create-session', async (req, res) => {
    try {
        const { items } = req.body;
        
        // Security: Always fetch prices from our DB (don't trust frontend prices)
        const productsDB = JSON.parse(fs.readFileSync(productsPath, 'utf8'));
        
        const lineItems = items.map(item => {
            const product = productsDB.find(p => p.id === item.id);
            if (!product) throw new Error(`Product ${item.id} not found`);
            
            return {
                price_data: {
                    currency: 'eur',
                    product_data: {
                        name: product.name,
                        description: product.description,
                    },
                    unit_amount: product.price, // cents
                },
                quantity: item.quantity,
            };
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            // Replace with your real frontend URLs
            success_url: `${req.headers.origin}/success.html?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.origin}/cart.html`,
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error('Stripe Error:', error.message);
        res.status(500).json({ error: 'Checkout session creation failed', details: error.message });
    }
});

module.exports = router;

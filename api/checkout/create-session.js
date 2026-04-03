// Vercel Serverless: POST /api/checkout/create-session
const products = [
  { id: "void-ring-01", name: "VOID RING I", description: "Melted heavy sterling silver.", price: 28000 },
  { id: "entropy-chain-01", name: "ENTROPY CHAIN", description: "Barbed wire links in brutalist silver.", price: 54000 },
  { id: "fracture-cuff-01", name: "FRACTURE CUFF", description: "A split silver plate with inner raw texture.", price: 31000 },
  { id: "shroud-pendant-01", name: "SHROUD PENDANT", description: "A heavy oxidized pendant.", price: 19000 },
  { id: "decay-signet-01", name: "DECAY SIGNET", description: "An eroded signet ring.", price: 34000 },
  { id: "schism-earring-01", name: "SCHISM EARRING", description: "A single fractured silver drop.", price: 16500 },
  { id: "wraith-chain-01", name: "WRAITH CHAIN", description: "Ultra-fine layered chains.", price: 42000 },
  { id: "trauma-ring-01", name: "TRAUMA BAND", description: "A thick hammered band with deep gouges.", price: 22000 },
  { id: "phantom-cuff-01", name: "PHANTOM CUFF", description: "Razor-thin silver ear cuff.", price: 12000 },
  { id: "abyss-collar-01", name: "ABYSS COLLAR", description: "A rigid silver collar.", price: 78000 }
];

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(200).end();

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const secretKey = process.env.STRIPE_SECRET_KEY;
        if (!secretKey) {
            return res.status(500).json({ error: 'Stripe not configured. Add STRIPE_SECRET_KEY in Vercel env vars.' });
        }

        const stripe = require('stripe')(secretKey);
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
                    product_data: { name: product.name, description: product.description },
                    unit_amount: product.price,
                },
                quantity: item.quantity,
            };
        });

        const origin = req.headers.origin || req.headers.referer || '';
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
        res.status(500).json({ error: 'Checkout failed', details: error.message });
    }
};

require('dotenv').config();
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const sanitizeMiddleware = require('./middleware/sanitize');

const app = express();
const PORT = process.env.PORT || 3000;

// Security Middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            ...helmet.contentSecurityPolicy.getDefaultDirectives(),
            "script-src": ["'self'", "https://js.stripe.com"],
            "frame-src": ["'self'", "https://js.stripe.com"],
        },
    },
}));

const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',');
app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}));

// Rate Limiting
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 100,
    message: 'Too many requests from this IP.'
});
app.use('/api/', generalLimiter);

// Parsing & Sanitization
app.use(express.json({ limit: '10kb' })); // Body limit to prevent DOS
app.use(sanitizeMiddleware);

// API Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/checkout', require('./routes/checkout'));
app.use('/api/contact', require('./routes/contact'));

// Serve Static Frontend
app.use(express.static(path.join(__dirname, '../client')));

// Catch-all for frontend routing (if using SPA style, though we have separate HTMLs)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/index.html'));
});

// Export for Vercel serverless
module.exports = app;

// Only listen when running locally (not on Vercel)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`VOIDFORM server ascending on http://localhost:${PORT}`);
        console.log('DARK WHITE aesthetic initialized.');
    });
}

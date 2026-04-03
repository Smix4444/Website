const express = require('express');
const router = express.Router();
const validator = require('validator');

router.post('/', async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Basic validation
        if (!name || !email || !message) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        if (!validator.isEmail(email)) {
            return res.status(400).json({ error: 'Invalid email address.' });
        }

        // Simulate successful submission (e.g., logging or sending email)
        console.log(`[CONTACT FORM] from ${name} (${email}): ${message}`);

        res.json({ success: true, message: 'Message received by the void.' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to process message' });
    }
});

module.exports = router;

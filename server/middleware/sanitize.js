const validator = require('validator');

/**
 * Sanitizes object keys recursively or single strings
 * to prevent XSS and injection.
 */
const sanitizeInput = (input) => {
    if (typeof input === 'string') {
        // Escape HTML to prevent XSS
        let sanitized = validator.escape(input.trim());
        // Simple sanitization for potential script tags
        sanitized = sanitized.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "");
        return sanitized;
    }
    
    if (Array.isArray(input)) {
        return input.map(item => sanitizeInput(item));
    }
    
    if (typeof input === 'object' && input !== null) {
        const sanitizedObj = {};
        for (const key in input) {
            sanitizedObj[key] = sanitizeInput(input[key]);
        }
        return sanitizedObj;
    }
    
    return input;
};

const sanitizeMiddleware = (req, res, next) => {
    if (req.body) req.body = sanitizeInput(req.body);
    if (req.query) req.query = sanitizeInput(req.query);
    if (req.params) req.params = sanitizeInput(req.params);
    next();
};

module.exports = sanitizeMiddleware;

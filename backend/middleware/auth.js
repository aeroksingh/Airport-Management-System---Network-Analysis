    const jwt = require('jsonwebtoken');
    const logger = require('../utils/logger');

    const protect = (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        logger.warn(`Unauthorized access attempt to ${req.originalUrl}`);
        return res.status(401).json({
        success: false,
        message: 'Not authorized. No token provided.',
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        logger.warn(`Invalid token used on ${req.originalUrl}: ${error.message}`);
        return res.status(401).json({
        success: false,
        message: 'Not authorized. Token is invalid or expired.',
        });
    }
    };

    module.exports = { protect };
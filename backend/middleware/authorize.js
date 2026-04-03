    const logger = require('../utils/logger');

    /**
     * Role-based authorization middleware factory.
     * Usage: authorize('admin', 'staff')
     * Must be used AFTER the protect middleware (which sets req.user).
     */
    const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
        logger.warn(`Authorization check failed — no user on request for ${req.method} ${req.originalUrl}`);
        return res.status(401).json({
            success: false,
            message: 'Not authorized. Please log in.',
        });
        }

        if (!roles.includes(req.user.role)) {
        logger.warn(
            `Access denied — user ${req.user.email} (role: ${req.user.role}) attempted ${req.method} ${req.originalUrl} (requires: ${roles.join(' or ')})`
        );
        return res.status(403).json({
            success: false,
            message: `Access denied. Required role: ${roles.join(' or ')}`,
            yourRole: req.user.role,
        });
        }

        next();
    };
    };

    module.exports = authorize;

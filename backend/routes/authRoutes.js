    const express = require('express');
    const { body } = require('express-validator');
    const { setup, register, login, getMe } = require('../controllers/authController');
    const { protect } = require('../middleware/auth');
    const authorize = require('../middleware/authorize');
    const validate = require('../middleware/validate');

    const router = express.Router();

    // ── Public Routes ────────────────────────────────────────────────────────

    // First-time setup — creates initial admin (only works when 0 users exist)
    router.post(
    '/setup',
    [
        body('name').trim().notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
        body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),
    ],
    validate,
    setup
    );

    // Login — all roles
    router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
        body('password').notEmpty().withMessage('Password is required'),
    ],
    validate,
    login
    );

    // ── Private Routes ───────────────────────────────────────────────────────

    // Register — public
    router.post(
    '/register',
    [
        body('name').trim().notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
        body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters'),
        body('role')
        .optional()
        .isIn(['admin', 'staff', 'viewer'])
        .withMessage('Invalid role'),
    ],
    validate,
    register
    );

    // Get own profile — all authenticated roles
    router.get('/me', protect, authorize('admin', 'staff', 'viewer'), getMe);

    module.exports = router;
    const jwt = require('jsonwebtoken');
    const User = require('../models/User');
    const logger = require('../utils/logger');

    // Generate JWT token
    const generateToken = (id, email, role) => {
    return jwt.sign({ id, email, role }, process.env.JWT_SECRET, {
        expiresIn: '7d',
    });
    };

    // @desc    Register a new user
    // @route   POST /api/auth/register
    // @access  Public
    const register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
        return res.status(400).json({
            success: false,
            message: 'User with this email already exists',
        });
        }

        const user = await User.create({ name, email, password, role });

        const token = generateToken(user._id, user.email, user.role);

        logger.info(`New user registered: ${email} (role: ${user.role})`);

        res.status(201).json({
        success: true,
        message: 'Registration successful',
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        });
    } catch (error) {
        next(error);
    }
    };

    // @desc    Login user
    // @route   POST /api/auth/login
    // @access  Public
    const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Find user and explicitly select password
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
        logger.warn(`Failed login attempt for email: ${email} (user not found)`);
        return res.status(401).json({
            success: false,
            message: 'Invalid email or password',
        });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
        logger.warn(`Failed login attempt for email: ${email} (wrong password)`);
        return res.status(401).json({
            success: false,
            message: 'Invalid email or password',
        });
        }

        const token = generateToken(user._id, user.email, user.role);

        logger.info(`User logged in: ${email} (role: ${user.role})`);

        res.status(200).json({
        success: true,
        message: 'Login successful',
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
        });
    } catch (error) {
        next(error);
    }
    };

    // @desc    Get current logged-in user profile
    // @route   GET /api/auth/me
    // @access  Private
    const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({
        success: true,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: user.createdAt,
        },
        });
    } catch (error) {
        next(error);
    }
    };

    module.exports = { register, login, getMe };
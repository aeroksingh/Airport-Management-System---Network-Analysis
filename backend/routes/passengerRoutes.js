    const express = require('express');
    const { body } = require('express-validator');
    const {
    getPassengers,
    getPassenger,
    createPassenger,
    updatePassenger,
    checkInPassenger,
    deletePassenger,
    } = require('../controllers/passengerController');
    const { protect } = require('../middleware/auth');
    const validate = require('../middleware/validate');

    const router = express.Router();

    router.use(protect);

    const passengerValidation = [
    body('firstName').trim().notEmpty().withMessage('First name is required'),
    body('lastName').trim().notEmpty().withMessage('Last name is required'),
    body('email').isEmail().withMessage('Valid email is required').normalizeEmail(),
    body('passportNumber').trim().notEmpty().withMessage('Passport number is required'),
    body('flight').notEmpty().withMessage('Flight ID is required'),
    ];

    router.route('/').get(getPassengers).post(passengerValidation, validate, createPassenger);

    router.route('/:id').get(getPassenger).put(updatePassenger).delete(deletePassenger);

    router.patch('/:id/checkin', checkInPassenger);

    module.exports = router;
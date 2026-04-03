const express = require('express');
const { body } = require('express-validator');
const {
  getGates,
  getGate,
  createGate,
  updateGate,
  assignFlight,
  unassignFlight,
  deleteGate,
} = require('../controllers/gateController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validate');

const router = express.Router();

router.use(protect);

const gateValidation = [
  body('gateNumber').trim().notEmpty().withMessage('Gate number is required'),
  body('terminal').trim().notEmpty().withMessage('Terminal is required'),
  body('status')
    .optional()
    .isIn(['Available', 'Occupied', 'Maintenance', 'Closed'])
    .withMessage('Invalid status'),
];

router.route('/').get(getGates).post(gateValidation, validate, createGate);

router.route('/:id').get(getGate).put(updateGate).delete(deleteGate);

router.patch('/:id/assign', assignFlight);
router.patch('/:id/unassign', unassignFlight);

module.exports = router;
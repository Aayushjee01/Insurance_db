// ============================================================
// routes/paymentRoutes.js
// ============================================================
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/paymentController');
const { validatePayment } = require('../middleware/validate');

router.get('/stats', ctrl.getStats);                  // Dashboard stats
router.post('/', validatePayment, ctrl.create);   // Record payment
router.get('/', ctrl.getAll);                    // View / filter payments
router.get('/policy/:policyId', ctrl.getByPolicy);               // Payments by policy

module.exports = router;

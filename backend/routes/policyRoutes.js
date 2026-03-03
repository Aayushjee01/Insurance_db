// ============================================================
// routes/policyRoutes.js
// ============================================================
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/policyController');
const { validatePolicy } = require('../middleware/validate');

router.get('/stats', ctrl.getStats);                     // Dashboard stats
router.post('/', validatePolicy, ctrl.create);        // Add policy
router.get('/', ctrl.getAll);                        // View / filter policies
router.get('/customer/:customerId', ctrl.getByCustomer);                 // Policies by customer
router.get('/:id', ctrl.getById);                       // Single policy details
router.patch('/:id/status', ctrl.updateStatus);                  // Update status only
router.delete('/:id', ctrl.delete);                        // Delete policy

module.exports = router;

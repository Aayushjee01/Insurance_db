// ============================================================
// routes/customerRoutes.js
// ============================================================
const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/customerController');
const { validateCustomer } = require('../middleware/validate');

router.post('/', validateCustomer, ctrl.create);    // Add customer
router.get('/', ctrl.getAll);                      // View / search customers
router.get('/:id', ctrl.getById);                     // Get single customer
router.put('/:id', validateCustomer, ctrl.update);    // Update customer
router.delete('/:id', ctrl.delete);                      // Delete customer

module.exports = router;

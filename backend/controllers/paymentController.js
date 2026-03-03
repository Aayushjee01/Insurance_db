// ============================================================
// controllers/paymentController.js
// ============================================================
const PaymentModel = require('../models/paymentModel');

const PaymentController = {
    // POST /api/payments
    async create(req, res) {
        try {
            const { payment_date, payment_amount, payment_mode, due_date, policy_id } = req.body;
            const id = await PaymentModel.create({
                payment_date, payment_amount: parseFloat(payment_amount),
                payment_mode, due_date, policy_id: parseInt(policy_id),
            });
            res.status(201).json({ success: true, message: 'Payment recorded successfully', payment_id: id });
        } catch (err) {
            if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                return res.status(400).json({ success: false, message: 'Policy does not exist' });
            }
            console.error('Create payment error:', err);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    },

    // GET /api/payments?search=&startDate=&endDate=&mode=
    async getAll(req, res) {
        try {
            const { search = '', startDate = null, endDate = null, mode = '' } = req.query;
            const payments = await PaymentModel.getAll({ search, startDate, endDate, mode });
            res.json({ success: true, data: payments, count: payments.length });
        } catch (err) {
            console.error('Get payments error:', err);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    },

    // GET /api/payments/policy/:policyId
    async getByPolicy(req, res) {
        try {
            const payments = await PaymentModel.getByPolicy(req.params.policyId);
            const totals = await PaymentModel.getTotalByPolicy(req.params.policyId);
            res.json({ success: true, data: payments, totals, count: payments.length });
        } catch (err) {
            console.error('Get payments by policy error:', err);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    },

    // GET /api/payments/stats
    async getStats(req, res) {
        try {
            const { stats, byMode } = await PaymentModel.getStats();
            res.json({ success: true, data: { stats, byMode } });
        } catch (err) {
            console.error('Get payment stats error:', err);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    },
};

module.exports = PaymentController;

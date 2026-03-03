// ============================================================
// controllers/policyController.js
// ============================================================
const PolicyModel = require('../models/policyModel');

const PolicyController = {
    // POST /api/policies
    async create(req, res) {
        try {
            const { policy_type, policy_duration, policy_status, coverage_amount, premium_amount, start_date, customer_id } = req.body;
            const id = await PolicyModel.create({
                policy_type, policy_duration: parseInt(policy_duration),
                policy_status, coverage_amount: parseFloat(coverage_amount),
                premium_amount: parseFloat(premium_amount), start_date, customer_id: parseInt(customer_id),
            });
            res.status(201).json({ success: true, message: 'Policy created successfully', policy_id: id });
        } catch (err) {
            if (err.code === 'ER_NO_REFERENCED_ROW_2') {
                return res.status(400).json({ success: false, message: 'Customer does not exist' });
            }
            console.error('Create policy error:', err);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    },

    // GET /api/policies?search=&status=&minPremium=&maxPremium=
    async getAll(req, res) {
        try {
            const { search = '', status = '', minPremium = null, maxPremium = null } = req.query;
            const policies = await PolicyModel.getAll({ search, status, minPremium, maxPremium });
            res.json({ success: true, data: policies, count: policies.length });
        } catch (err) {
            console.error('Get policies error:', err);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    },

    // GET /api/policies/customer/:customerId
    async getByCustomer(req, res) {
        try {
            const policies = await PolicyModel.getByCustomer(req.params.customerId);
            res.json({ success: true, data: policies, count: policies.length });
        } catch (err) {
            console.error('Get policies by customer error:', err);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    },

    // GET /api/policies/:id
    async getById(req, res) {
        try {
            const policy = await PolicyModel.getById(req.params.id);
            if (!policy) return res.status(404).json({ success: false, message: 'Policy not found' });
            res.json({ success: true, data: policy });
        } catch (err) {
            console.error('Get policy by ID error:', err);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    },

    // PATCH /api/policies/:id/status
    async updateStatus(req, res) {
        try {
            const { status } = req.body;
            const rows = await PolicyModel.updateStatus(req.params.id, status);
            if (!rows) return res.status(404).json({ success: false, message: 'Policy not found' });
            res.json({ success: true, message: 'Policy status updated' });
        } catch (err) {
            console.error('Update policy status error:', err);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    },

    // DELETE /api/policies/:id
    async delete(req, res) {
        try {
            const rows = await PolicyModel.delete(req.params.id);
            if (!rows) return res.status(404).json({ success: false, message: 'Policy not found' });
            res.json({ success: true, message: 'Policy deleted successfully' });
        } catch (err) {
            console.error('Delete policy error:', err);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    },

    // GET /api/policies/stats
    async getStats(req, res) {
        try {
            const stats = await PolicyModel.getStats();
            res.json({ success: true, data: stats });
        } catch (err) {
            console.error('Get policy stats error:', err);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    },
};

module.exports = PolicyController;

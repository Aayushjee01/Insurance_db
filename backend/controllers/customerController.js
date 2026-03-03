// ============================================================
// controllers/customerController.js
// ============================================================
const CustomerModel = require('../models/customerModel');

const CustomerController = {
    // POST /api/customers
    async create(req, res) {
        try {
            const { customer_name, age, phone_number, address } = req.body;
            const id = await CustomerModel.create({ customer_name, age: parseInt(age), phone_number, address });
            res.status(201).json({ success: true, message: 'Customer created successfully', customer_id: id });
        } catch (err) {
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ success: false, message: 'Phone number already registered' });
            }
            console.error('Create customer error:', err);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    },

    // GET /api/customers?search=xxx
    async getAll(req, res) {
        try {
            const { search = '' } = req.query;
            const customers = await CustomerModel.getAll({ search });
            res.json({ success: true, data: customers, count: customers.length });
        } catch (err) {
            console.error('Get customers error:', err);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    },

    // GET /api/customers/:id
    async getById(req, res) {
        try {
            const customer = await CustomerModel.getById(req.params.id);
            if (!customer) {
                return res.status(404).json({ success: false, message: 'Customer not found' });
            }
            res.json({ success: true, data: customer });
        } catch (err) {
            console.error('Get customer by ID error:', err);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    },

    // PUT /api/customers/:id
    async update(req, res) {
        try {
            const { customer_name, age, phone_number, address } = req.body;
            const rows = await CustomerModel.update(req.params.id, {
                customer_name, age: parseInt(age), phone_number, address,
            });
            if (!rows) return res.status(404).json({ success: false, message: 'Customer not found' });
            res.json({ success: true, message: 'Customer updated successfully' });
        } catch (err) {
            console.error('Update customer error:', err);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    },

    // DELETE /api/customers/:id
    async delete(req, res) {
        try {
            const rows = await CustomerModel.delete(req.params.id);
            if (!rows) return res.status(404).json({ success: false, message: 'Customer not found' });
            res.json({ success: true, message: 'Customer deleted successfully' });
        } catch (err) {
            console.error('Delete customer error:', err);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    },
};

module.exports = CustomerController;

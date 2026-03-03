// ============================================================
// models/customerModel.js  –  Customer DB Operations
// ============================================================
const db = require('../config/db');

const CustomerModel = {
    // --- CREATE a new customer ---
    async create({ customer_name, age, phone_number, address }) {
        const sql = `
      INSERT INTO Customer (customer_name, age, phone_number, address)
      VALUES (?, ?, ?, ?)
    `;
        const [result] = await db.execute(sql, [customer_name, age, phone_number, address]);
        return result.insertId;
    },

    // --- GET all customers (with policy count) ---
    async getAll({ search = '' } = {}) {
        const sql = `
      SELECT
        c.customer_id,
        c.customer_name,
        c.age,
        c.phone_number,
        c.address,
        c.created_at,
        COUNT(p.policy_id)        AS total_policies,
        COALESCE(SUM(p.premium_amount), 0) AS total_premium
      FROM Customer c
      LEFT JOIN Policy p ON c.customer_id = p.customer_id
      WHERE c.customer_name LIKE ? OR c.phone_number LIKE ?
      GROUP BY c.customer_id
      ORDER BY c.created_at DESC
    `;
        const like = `%${search}%`;
        const [rows] = await db.execute(sql, [like, like]);
        return rows;
    },

    // --- GET single customer by ID ---
    async getById(id) {
        const [rows] = await db.execute(
            'SELECT * FROM Customer WHERE customer_id = ?', [id]
        );
        return rows[0] || null;
    },

    // --- UPDATE customer ---
    async update(id, { customer_name, age, phone_number, address }) {
        const sql = `
      UPDATE Customer
      SET customer_name = ?, age = ?, phone_number = ?, address = ?
      WHERE customer_id = ?
    `;
        const [result] = await db.execute(sql, [customer_name, age, phone_number, address, id]);
        return result.affectedRows;
    },

    // --- DELETE customer ---
    async delete(id) {
        const [result] = await db.execute(
            'DELETE FROM Customer WHERE customer_id = ?', [id]
        );
        return result.affectedRows;
    },
};

module.exports = CustomerModel;

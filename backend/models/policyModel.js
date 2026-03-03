// ============================================================
// models/policyModel.js  –  Policy DB Operations
// ============================================================
const db = require('../config/db');

const PolicyModel = {
    // --- CREATE a new policy ---
    async create({ policy_type, policy_duration, policy_status, coverage_amount, premium_amount, start_date, customer_id }) {
        const sql = `
      INSERT INTO Policy
        (policy_type, policy_duration, policy_status, coverage_amount, premium_amount, start_date, customer_id)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
        const [result] = await db.execute(sql, [
            policy_type, policy_duration, policy_status,
            coverage_amount, premium_amount, start_date, customer_id,
        ]);
        return result.insertId;
    },

    // --- GET all policies (JOIN with Customer) with optional filters ---
    async getAll({ search = '', status = '', minPremium = null, maxPremium = null } = {}) {
        let sql = `
      SELECT
        p.*,
        c.customer_name,
        c.phone_number,
        COUNT(pp.payment_id)                    AS payments_made,
        COALESCE(SUM(pp.payment_amount), 0)     AS total_paid
      FROM Policy p
      JOIN Customer c ON p.customer_id = c.customer_id
      LEFT JOIN Premium_Payment pp ON p.policy_id = pp.policy_id
      WHERE (p.policy_type LIKE ? OR c.customer_name LIKE ?)
    `;
        const params = [`%${search}%`, `%${search}%`];

        if (status) {
            sql += ' AND p.policy_status = ?';
            params.push(status);
        }
        if (minPremium !== null && maxPremium !== null) {
            sql += ' AND p.premium_amount BETWEEN ? AND ?';
            params.push(parseFloat(minPremium), parseFloat(maxPremium));
        }

        sql += ' GROUP BY p.policy_id ORDER BY p.created_at DESC';

        const [rows] = await db.execute(sql, params);
        return rows;
    },

    // --- GET policies for a specific customer ---
    async getByCustomer(customerId) {
        const [rows] = await db.execute(
            `SELECT p.*, COUNT(pp.payment_id) AS payments_made,
              COALESCE(SUM(pp.payment_amount), 0) AS total_paid
       FROM Policy p
       LEFT JOIN Premium_Payment pp ON p.policy_id = pp.policy_id
       WHERE p.customer_id = ?
       GROUP BY p.policy_id
       ORDER BY p.created_at DESC`,
            [customerId]
        );
        return rows;
    },

    // --- GET single policy by ID ---
    async getById(id) {
        const [rows] = await db.execute(
            `SELECT p.*, c.customer_name, c.phone_number, c.address
       FROM Policy p
       JOIN Customer c ON p.customer_id = c.customer_id
       WHERE p.policy_id = ?`,
            [id]
        );
        return rows[0] || null;
    },

    // --- UPDATE policy status ---
    async updateStatus(id, status) {
        const [result] = await db.execute(
            'UPDATE Policy SET policy_status = ? WHERE policy_id = ?', [status, id]
        );
        return result.affectedRows;
    },

    // --- DELETE policy ---
    async delete(id) {
        const [result] = await db.execute(
            'DELETE FROM Policy WHERE policy_id = ?', [id]
        );
        return result.affectedRows;
    },

    // --- DASHBOARD aggregate stats ---
    async getStats() {
        const [[stats]] = await db.execute(`
      SELECT
        COUNT(*)                                AS total_policies,
        SUM(policy_status = 'Active')           AS active_policies,
        SUM(policy_status = 'Expired')          AS expired_policies,
        SUM(policy_status = 'Pending')          AS pending_policies,
        COALESCE(SUM(coverage_amount), 0)       AS total_coverage,
        COALESCE(SUM(premium_amount), 0)        AS total_premium_per_cycle
      FROM Policy
    `);
        return stats;
    },
};

module.exports = PolicyModel;

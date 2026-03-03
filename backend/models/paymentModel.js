// ============================================================
// models/paymentModel.js  –  Premium Payment DB Operations
// ============================================================
const db = require('../config/db');

const PaymentModel = {
    // --- CREATE a payment record ---
    async create({ payment_date, payment_amount, payment_mode, due_date, policy_id }) {
        const sql = `
      INSERT INTO Premium_Payment
        (payment_date, payment_amount, payment_mode, due_date, policy_id)
      VALUES (?, ?, ?, ?, ?)
    `;
        const [result] = await db.execute(sql, [
            payment_date, payment_amount, payment_mode, due_date, policy_id,
        ]);
        return result.insertId;
    },

    // --- GET all payments (JOIN Policy + Customer) ---
    async getAll({ search = '', startDate = null, endDate = null, mode = '' } = {}) {
        let sql = `
      SELECT
        pp.*,
        p.policy_type,
        p.policy_status,
        c.customer_name,
        c.phone_number
      FROM Premium_Payment pp
      JOIN Policy p   ON pp.policy_id   = p.policy_id
      JOIN Customer c ON p.customer_id  = c.customer_id
      WHERE (c.customer_name LIKE ? OR p.policy_type LIKE ?)
    `;
        const params = [`%${search}%`, `%${search}%`];

        // Filter by date range (BETWEEN)
        if (startDate && endDate) {
            sql += ' AND pp.payment_date BETWEEN ? AND ?';
            params.push(startDate, endDate);
        }

        // Filter by payment mode (OR across modes)
        if (mode) {
            sql += ' AND pp.payment_mode = ?';
            params.push(mode);
        }

        sql += ' ORDER BY pp.payment_date DESC';

        const [rows] = await db.execute(sql, params);
        return rows;
    },

    // --- GET payments for a specific policy ---
    async getByPolicy(policyId) {
        const [rows] = await db.execute(
            `SELECT * FROM Premium_Payment WHERE policy_id = ? ORDER BY payment_date DESC`,
            [policyId]
        );
        return rows;
    },

    // --- TOTAL paid for a policy (SUM aggregate) ---
    async getTotalByPolicy(policyId) {
        const [[res]] = await db.execute(
            `SELECT COALESCE(SUM(payment_amount), 0) AS total_paid,
              COUNT(*) AS payment_count
       FROM Premium_Payment WHERE policy_id = ?`,
            [policyId]
        );
        return res;
    },

    // --- Dashboard: overall payment stats ---
    async getStats() {
        const [[stats]] = await db.execute(`
      SELECT
        COUNT(*)                          AS total_payments,
        COALESCE(SUM(payment_amount), 0)  AS total_collected,
        payment_mode,
        MAX(payment_date)                 AS last_payment_date
      FROM Premium_Payment
    `);

        const [byMode] = await db.execute(`
      SELECT payment_mode,
             COUNT(*)                          AS count,
             COALESCE(SUM(payment_amount), 0)  AS amount
      FROM Premium_Payment
      GROUP BY payment_mode
    `);

        return { stats, byMode };
    },
};

module.exports = PaymentModel;

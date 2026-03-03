// ============================================================
// config/db.js  –  MySQL Connection Pool
// ============================================================
const mysql = require('mysql2/promise');
require('dotenv').config();

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'insurance_db',
  socketPath: process.env.DB_SOCKET || '/tmp/mysql.sock', // Added to support Unix socket
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Verify connection on startup
(async () => {
  try {
    const conn = await pool.getConnection();
    console.log('✅  MySQL connected successfully');
    conn.release();
  } catch (err) {
    console.error('❌  MySQL connection failed:', err);
    process.exit(1);
  }
})();

module.exports = pool;

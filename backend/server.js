// ============================================================
// server.js  –  Express App Entry Point
// Insurance Policy Management System
// ============================================================
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const customerRoutes = require('./routes/customerRoutes');
const policyRoutes = require('./routes/policyRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// ---- Middleware ----
app.use(cors({
    origin: ['http://localhost:3000', 'http://127.0.0.1:5500', 'null'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---- Request logger (dev) ----
app.use((req, _res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
});

// ---- API Routes ----
app.use('/api/customers', customerRoutes);
app.use('/api/policies', policyRoutes);
app.use('/api/payments', paymentRoutes);

// ---- Health check ----
app.get('/api/health', (_req, res) => {
    res.json({ success: true, message: 'Insurance API is running 🚀', timestamp: new Date() });
});

// ---- 404 handler ----
app.use((_req, res) => {
    res.status(404).json({ success: false, message: 'Route not found' });
});

// ---- Global error handler ----
app.use((err, _req, res, _next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ success: false, message: 'Something went wrong' });
});

// ---- Start server (DB init happens inside config/db.js) ----
require('./config/db'); // trigger connection check
app.listen(PORT, () => {
    console.log(`🚀  Server running on http://localhost:${PORT}`);
});

module.exports = app;

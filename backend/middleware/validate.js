// ============================================================
// middleware/validate.js  –  Request Validation Middleware
// ============================================================

/**
 * Generic validation helper – checks required fields and runs
 * optional custom validators. Returns the first error found.
 * @param {Object} schema  - { fieldName: { required, type, min, max, enum } }
 */
const validate = (schema) => (req, res, next) => {
    const body = req.body;
    const errors = [];

    for (const [field, rules] of Object.entries(schema)) {
        const value = body[field];

        // required
        if (rules.required && (value === undefined || value === null || value === '')) {
            errors.push(`"${field}" is required`);
            continue;
        }
        if (value === undefined || value === null || value === '') continue; // optional, skip rest

        // type: number
        if (rules.type === 'number' && isNaN(Number(value))) {
            errors.push(`"${field}" must be a number`);
            continue;
        }

        // min / max  (numeric)
        if (rules.type === 'number') {
            const num = Number(value);
            if (rules.min !== undefined && num < rules.min) {
                errors.push(`"${field}" must be >= ${rules.min}`);
            }
            if (rules.max !== undefined && num > rules.max) {
                errors.push(`"${field}" must be <= ${rules.max}`);
            }
        }

        // enum
        if (rules.enum && !rules.enum.includes(value)) {
            errors.push(`"${field}" must be one of: ${rules.enum.join(', ')}`);
        }
    }

    if (errors.length > 0) {
        return res.status(400).json({ success: false, message: 'Validation failed', errors });
    }
    next();
};

// ---- Pre-built validators ----

const validateCustomer = validate({
    customer_name: { required: true },
    age: { required: true, type: 'number', min: 18, max: 100 },
    phone_number: { required: true },
    address: { required: true },
});

const validatePolicy = validate({
    policy_type: { required: true },
    policy_duration: { required: true, type: 'number', min: 1 },
    policy_status: { required: true, enum: ['Active', 'Expired', 'Pending'] },
    coverage_amount: { required: true, type: 'number', min: 1 },
    premium_amount: { required: true, type: 'number', min: 1 },
    start_date: { required: true },
    customer_id: { required: true, type: 'number', min: 1 },
});

const validatePayment = validate({
    payment_date: { required: true },
    payment_amount: { required: true, type: 'number', min: 1 },
    payment_mode: { required: true, enum: ['Cash', 'Online', 'Cheque', 'Card'] },
    due_date: { required: true },
    policy_id: { required: true, type: 'number', min: 1 },
});

module.exports = { validateCustomer, validatePolicy, validatePayment };

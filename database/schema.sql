-- =============================================================
-- Insurance Policy Management System - Database Schema
-- =============================================================

CREATE DATABASE IF NOT EXISTS insurance_db;
USE insurance_db;

-- -------------------------------------------------------------
-- Table: Customer
-- Stores customer personal information
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS Customer (
    customer_id   INT AUTO_INCREMENT PRIMARY KEY,
    customer_name VARCHAR(100)  NOT NULL,
    age           INT           NOT NULL CHECK (age >= 18 AND age <= 100),
    phone_number  VARCHAR(15)   NOT NULL UNIQUE,
    address       TEXT          NOT NULL,
    created_at    TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

-- -------------------------------------------------------------
-- Table: Policy
-- Stores insurance policy details linked to a customer
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS Policy (
    policy_id        INT AUTO_INCREMENT PRIMARY KEY,
    policy_type      VARCHAR(100) NOT NULL,
    policy_duration  INT          NOT NULL COMMENT 'Duration in months',
    policy_status    ENUM('Active', 'Expired', 'Pending') NOT NULL DEFAULT 'Active',
    coverage_amount  DECIMAL(15, 2) NOT NULL CHECK (coverage_amount > 0),
    premium_amount   DECIMAL(10, 2) NOT NULL CHECK (premium_amount > 0),
    start_date       DATE         NOT NULL,
    customer_id      INT          NOT NULL,
    created_at       TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_policy_customer FOREIGN KEY (customer_id)
        REFERENCES Customer(customer_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- -------------------------------------------------------------
-- Table: Premium_Payment
-- Stores payment records for policies
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS Premium_Payment (
    payment_id     INT AUTO_INCREMENT PRIMARY KEY,
    payment_date   DATE         NOT NULL,
    payment_amount DECIMAL(10, 2) NOT NULL CHECK (payment_amount > 0),
    payment_mode   ENUM('Cash', 'Online', 'Cheque', 'Card') NOT NULL,
    due_date       DATE         NOT NULL,
    policy_id      INT          NOT NULL,
    created_at     TIMESTAMP    DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_payment_policy FOREIGN KEY (policy_id)
        REFERENCES Policy(policy_id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- =============================================================
-- Sample / Seed Data
-- =============================================================

INSERT INTO Customer (customer_name, age, phone_number, address) VALUES
('Arjun Sharma',    32, '9876543210', '12 MG Road, Bangalore, Karnataka'),
('Priya Mehta',     28, '9123456780', '45 Bandra West, Mumbai, Maharashtra'),
('Ravi Kumar',      45, '9988776655', '7 Anna Nagar, Chennai, Tamil Nadu'),
('Sunita Patel',    38, '9765432190', '23 Ashok Nagar, Jaipur, Rajasthan'),
('Deepak Joshi',    55, '9654321870', '1 Civil Lines, Allahabad, UP');

INSERT INTO Policy (policy_type, policy_duration, policy_status, coverage_amount, premium_amount, start_date, customer_id) VALUES
('Life Insurance',    24, 'Active',  500000.00, 5000.00, '2024-01-15', 1),
('Health Insurance',  12, 'Active',  300000.00, 2500.00, '2024-03-01', 1),
('Vehicle Insurance', 12, 'Expired', 200000.00, 1800.00, '2023-03-01', 2),
('Life Insurance',    36, 'Active',  750000.00, 8000.00, '2024-06-01', 3),
('Health Insurance',  12, 'Pending', 150000.00, 1500.00, '2025-01-01', 4),
('Term Insurance',    60, 'Active', 1000000.00, 10000.00,'2024-09-01', 5);

INSERT INTO Premium_Payment (payment_date, payment_amount, payment_mode, due_date, policy_id) VALUES
('2024-01-15', 5000.00, 'Online', '2024-01-31', 1),
('2024-02-15', 5000.00, 'Online', '2024-02-28', 1),
('2024-03-15', 5000.00, 'Card',   '2024-03-31', 1),
('2024-03-01', 2500.00, 'Cash',   '2024-03-15', 2),
('2024-04-01', 2500.00, 'Cheque', '2024-04-15', 2),
('2023-03-01', 1800.00, 'Online', '2023-03-15', 3),
('2023-04-01', 1800.00, 'Online', '2023-04-15', 3),
('2024-06-01', 8000.00, 'Online', '2024-06-15', 4),
('2024-07-01', 8000.00, 'Card',   '2024-07-15', 4),
('2024-09-01',10000.00, 'Online', '2024-09-15', 6);

-- =============================================================
-- Useful Views / Queries for reference
-- =============================================================

-- View: Customer with Policy Summary
CREATE OR REPLACE VIEW v_customer_policy_summary AS
SELECT
    c.customer_id,
    c.customer_name,
    c.phone_number,
    COUNT(p.policy_id)          AS total_policies,
    SUM(p.coverage_amount)      AS total_coverage,
    SUM(p.premium_amount)       AS total_premium_per_cycle
FROM Customer c
LEFT JOIN Policy p ON c.customer_id = p.customer_id
GROUP BY c.customer_id, c.customer_name, c.phone_number;

-- View: Policy with Payment Summary
CREATE OR REPLACE VIEW v_policy_payment_summary AS
SELECT
    p.policy_id,
    p.policy_type,
    p.policy_status,
    p.premium_amount,
    c.customer_name,
    COUNT(pp.payment_id)        AS payments_made,
    COALESCE(SUM(pp.payment_amount), 0) AS total_paid
FROM Policy p
JOIN Customer c ON p.customer_id = c.customer_id
LEFT JOIN Premium_Payment pp ON p.policy_id = pp.policy_id
GROUP BY p.policy_id, p.policy_type, p.policy_status, p.premium_amount, c.customer_name;

# 🛡️ InsureTrack — Insurance Policy Management System

A full-stack college mini project demonstrating a production-structured **Insurance Policy Management System** built with:

| Layer    | Technology                        |
|----------|-----------------------------------|
| Frontend | HTML5, CSS3 (Vanilla), JavaScript |
| Backend  | Node.js + Express.js (MVC)        |
| Database | MySQL                             |

---

## 📁 Project Structure

```
Insurance_db/
├── frontend/               # Static HTML/CSS/JS frontend
│   ├── css/
│   │   └── style.css       # Global design system
│   ├── js/
│   │   └── api.js          # Shared API helper + utilities
│   ├── index.html          # Home page
│   ├── customers.html      # Customer registration + listing
│   ├── policies.html       # Policy creation + filtering
│   ├── payments.html       # Premium payment recording
│   ├── policy-detail.html  # Policy details + payment history
│   └── dashboard.html      # Admin analytics dashboard
│
├── backend/                # Express REST API
│   ├── config/
│   │   └── db.js           # MySQL connection pool
│   ├── models/             # Database layer (SQL queries)
│   │   ├── customerModel.js
│   │   ├── policyModel.js
│   │   └── paymentModel.js
│   ├── controllers/        # Request handlers
│   │   ├── customerController.js
│   │   ├── policyController.js
│   │   └── paymentController.js
│   ├── middleware/
│   │   └── validate.js     # Reusable validation middleware
│   ├── routes/             # Express routers
│   │   ├── customerRoutes.js
│   │   ├── policyRoutes.js
│   │   └── paymentRoutes.js
│   ├── server.js           # App entry point
│   ├── package.json
│   └── .env.example        # ← copy to .env and fill credentials
│
└── database/
    └── schema.sql          # Database setup + seed data
```

---

## 🗄️ Database Tables

| Table             | Key Columns |
|-------------------|-------------|
| `Customer`        | customer_id (PK), customer_name, age, phone_number, address |
| `Policy`          | policy_id (PK), policy_type, policy_status, coverage_amount, premium_amount, customer_id (FK) |
| `Premium_Payment` | payment_id (PK), payment_date, payment_amount, payment_mode, due_date, policy_id (FK) |

**Relationships:** `Customer` 1 → ∞ `Policy` 1 → ∞ `Premium_Payment`

---

## 🚀 How to Run Locally

### Step 1 — MySQL Setup

1. Open MySQL client (MySQL Workbench, Terminal, etc.)
2. Run the schema file:
   ```sql
   SOURCE /path/to/Insurance_db/database/schema.sql;
   ```
   Or from Terminal:
   ```bash
   mysql -u root -p < database/schema.sql
   ```
   This creates the `insurance_db` database, all tables, and seed data.

---

### Step 2 — Backend Setup

```bash
cd backend

# Copy environment config
cp .env.example .env
# Edit .env and set your MySQL password:
# DB_PASSWORD=your_mysql_password

# Install dependencies
npm install

# Start the dev server
npm run dev
```

The API will be available at **http://localhost:5000**

Health check: **http://localhost:5000/api/health**

---

### Step 3 — Frontend

Open the `frontend/index.html` file directly in your browser, **or** use VS Code Live Server extension for the best experience.

> The frontend talks to `http://localhost:5000/api` by default (configured in `frontend/js/api.js`).

---

## 🔌 REST API Endpoints

### Customers
| Method | Endpoint               | Description         |
|--------|------------------------|---------------------|
| POST   | `/api/customers`       | Register customer   |
| GET    | `/api/customers`       | List / search       |
| GET    | `/api/customers/:id`   | Get by ID           |
| PUT    | `/api/customers/:id`   | Update              |
| DELETE | `/api/customers/:id`   | Delete (cascade)    |

### Policies
| Method | Endpoint                          | Description              |
|--------|-----------------------------------|--------------------------|
| POST   | `/api/policies`                   | Create policy            |
| GET    | `/api/policies`                   | List / filter            |
| GET    | `/api/policies/stats`             | Aggregate stats          |
| GET    | `/api/policies/customer/:id`      | Policies by customer     |
| GET    | `/api/policies/:id`               | Policy detail            |
| PATCH  | `/api/policies/:id/status`        | Update status            |
| DELETE | `/api/policies/:id`               | Delete (cascade)         |

### Payments
| Method | Endpoint                         | Description              |
|--------|----------------------------------|--------------------------|
| POST   | `/api/payments`                  | Record payment           |
| GET    | `/api/payments`                  | List / filter            |
| GET    | `/api/payments/stats`            | Aggregate stats          |
| GET    | `/api/payments/policy/:id`       | Payments for a policy    |

---

## ✨ SQL Features Demonstrated

| Feature             | Where Used                                          |
|---------------------|-----------------------------------------------------|
| `JOIN`              | All listings (Policy+Customer+Payment)              |
| `LIKE`              | Search in all list endpoints                        |
| `BETWEEN`           | Premium range filter, date range filter             |
| `AND / OR`          | Combined status + premium + search conditions       |
| `SUM / COUNT`       | Dashboard stats, payment totals per policy          |
| `GROUP BY`          | Aggregations per customer, policy, payment mode     |
| `FK / CASCADE`      | Delete customer → deletes policies → deletes payments |
| `CHECK`             | age constraints, coverage/premium > 0              |
| `ENUM`              | policy_status, payment_mode                        |
| `VIEW`              | v_customer_policy_summary, v_policy_payment_summary |

---

## 🎨 Frontend Pages

| Page                 | File                   | Features |
|----------------------|------------------------|----------|
| Home                 | `index.html`           | Hero, feature cards |
| Customer Management  | `customers.html`       | Register, search, edit, delete |
| Policy Management    | `policies.html`        | Create, filter by status/premium |
| Premium Payments     | `payments.html`        | Record, filter by date/mode |
| Policy Detail View   | `policy-detail.html`   | Full policy info + payment history |
| Admin Dashboard      | `dashboard.html`       | KPI cards, charts, top customers |

---

## 📦 Dependencies

```json
{
  "express":  "^4.18",
  "mysql2":   "^3.9",
  "dotenv":   "^16.4",
  "cors":     "^2.8",
  "nodemon":  "^3.1" (dev)
}
```

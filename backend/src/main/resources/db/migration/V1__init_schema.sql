-- AI Budget Guardian Database Schema V1
-- PostgreSQL 16 / H2 Compatible DDL

-- 1. Permissions Table
CREATE TABLE IF NOT EXISTS permissions (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(100) NOT NULL UNIQUE,
    module VARCHAR(100) NOT NULL,
    description VARCHAR(255)
);

-- 2. Roles Table
CREATE TABLE IF NOT EXISTS roles (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(255)
);

-- 3. Role Permissions Mapping
CREATE TABLE IF NOT EXISTS role_permissions (
    role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id BIGINT NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- 4. Departments Table
CREATE TABLE IF NOT EXISTS departments (
    id UUID PRIMARY KEY,
    code VARCHAR(50) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    annual_budget NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    quarterly_budget NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    monthly_budget NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    used_budget NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    remaining_budget NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- 5. Users Table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(20),
    department_id UUID REFERENCES departments(id) ON DELETE SET NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    failed_attempts INT DEFAULT 0,
    last_login_at TIMESTAMP,
    reset_token VARCHAR(255),
    reset_token_expiry TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- 6. User Roles Mapping
CREATE TABLE IF NOT EXISTS user_roles (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role_id BIGINT NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- 7. Budgets Table
CREATE TABLE IF NOT EXISTS budgets (
    id UUID PRIMARY KEY,
    department_id UUID NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
    financial_year VARCHAR(20) NOT NULL,
    allocated_amount NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    used_amount NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    remaining_amount NUMERIC(15,2) NOT NULL DEFAULT 0.00,
    burn_rate_monthly NUMERIC(5,2) DEFAULT 0.00,
    projected_exhaustion_date DATE,
    status VARCHAR(30) NOT NULL DEFAULT 'HEALTHY',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- 8. Budget Adjustments Table
CREATE TABLE IF NOT EXISTS budget_adjustments (
    id UUID PRIMARY KEY,
    budget_id UUID NOT NULL REFERENCES budgets(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    amount NUMERIC(15,2) NOT NULL,
    reason TEXT,
    requested_by UUID REFERENCES users(id),
    approved_by UUID REFERENCES users(id),
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 9. Vendors Table
CREATE TABLE IF NOT EXISTS vendors (
    id UUID PRIMARY KEY,
    vendor_name VARCHAR(200) NOT NULL,
    gst_number VARCHAR(50),
    pan_number VARCHAR(50),
    bank_account_no VARCHAR(50),
    ifsc_code VARCHAR(30),
    address TEXT,
    contact_email VARCHAR(150),
    contact_phone VARCHAR(30),
    category VARCHAR(100),
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    blacklist_reason TEXT,
    risk_score NUMERIC(5,2) DEFAULT 0.00,
    risk_level VARCHAR(30) DEFAULT 'LOW',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- 10. Vendor Risk Scores Table
CREATE TABLE IF NOT EXISTS vendor_risk_scores (
    id UUID PRIMARY KEY,
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    score NUMERIC(5,2) NOT NULL,
    risk_level VARCHAR(30) NOT NULL,
    duplicate_gst_flag BOOLEAN DEFAULT FALSE,
    duplicate_pan_flag BOOLEAN DEFAULT FALSE,
    duplicate_bank_flag BOOLEAN DEFAULT FALSE,
    same_address_flag BOOLEAN DEFAULT FALSE,
    blacklisted_flag BOOLEAN DEFAULT FALSE,
    explanation_json TEXT,
    evaluated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 11. Contractors Table
CREATE TABLE IF NOT EXISTS contractors (
    id UUID PRIMARY KEY,
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    company_name VARCHAR(200) NOT NULL,
    total_projects INT DEFAULT 0,
    completed_projects INT DEFAULT 0,
    delayed_projects INT DEFAULT 0,
    cancelled_projects INT DEFAULT 0,
    complaints_count INT DEFAULT 0,
    penalties_amount NUMERIC(15,2) DEFAULT 0.00,
    performance_rating NUMERIC(3,2) DEFAULT 5.00,
    risk_score NUMERIC(5,2) DEFAULT 0.00,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 12. Tenders Table
CREATE TABLE IF NOT EXISTS tenders (
    id UUID PRIMARY KEY,
    tender_number VARCHAR(100) NOT NULL UNIQUE,
    department_id UUID NOT NULL REFERENCES departments(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    estimated_cost NUMERIC(15,2) NOT NULL,
    winning_bid_amount NUMERIC(15,2),
    winning_vendor_id UUID REFERENCES vendors(id),
    number_of_bidders INT DEFAULT 0,
    status VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
    tender_risk_score NUMERIC(5,2) DEFAULT 0.00,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP
);

-- 13. Purchase Orders Table
CREATE TABLE IF NOT EXISTS purchase_orders (
    id UUID PRIMARY KEY,
    po_number VARCHAR(100) NOT NULL UNIQUE,
    department_id UUID NOT NULL REFERENCES departments(id),
    vendor_id UUID NOT NULL REFERENCES vendors(id),
    tender_id UUID REFERENCES tenders(id),
    total_amount NUMERIC(15,2) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'DRAFT',
    approved_by UUID REFERENCES users(id),
    po_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 14. Invoices Table
CREATE TABLE IF NOT EXISTS invoices (
    id UUID PRIMARY KEY,
    invoice_number VARCHAR(100) NOT NULL,
    vendor_id UUID NOT NULL REFERENCES vendors(id),
    department_id UUID NOT NULL REFERENCES departments(id),
    po_id UUID REFERENCES purchase_orders(id),
    amount NUMERIC(15,2) NOT NULL,
    gst_amount NUMERIC(15,2) DEFAULT 0.00,
    invoice_date DATE NOT NULL,
    due_date DATE,
    document_url VARCHAR(500),
    duplicate_probability NUMERIC(5,2) DEFAULT 0.00,
    duplicate_flag BOOLEAN DEFAULT FALSE,
    approval_status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    payment_status VARCHAR(30) NOT NULL DEFAULT 'UNPAID',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 15. Invoice Items Table
CREATE TABLE IF NOT EXISTS invoice_items (
    id UUID PRIMARY KEY,
    invoice_id UUID NOT NULL REFERENCES invoices(id) ON DELETE CASCADE,
    item_name VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    unit_price NUMERIC(15,2) NOT NULL,
    total_price NUMERIC(15,2) NOT NULL
);

-- 16. Payments Table
CREATE TABLE IF NOT EXISTS payments (
    id UUID PRIMARY KEY,
    payment_reference VARCHAR(100) NOT NULL UNIQUE,
    invoice_id UUID NOT NULL REFERENCES invoices(id),
    vendor_id UUID NOT NULL REFERENCES vendors(id),
    department_id UUID NOT NULL REFERENCES departments(id),
    amount NUMERIC(15,2) NOT NULL,
    payment_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    payment_mode VARCHAR(50) NOT NULL,
    finance_officer_id UUID REFERENCES users(id),
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 17. AI Predictions Table
CREATE TABLE IF NOT EXISTS ai_predictions (
    id UUID PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    model_name VARCHAR(100) NOT NULL,
    model_version VARCHAR(30) NOT NULL,
    risk_score NUMERIC(5,2) NOT NULL,
    risk_level VARCHAR(30) NOT NULL,
    confidence NUMERIC(4,3) NOT NULL,
    prediction VARCHAR(255) NOT NULL,
    explanation_json TEXT,
    recommended_action TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 18. Fraud Alerts Table
CREATE TABLE IF NOT EXISTS fraud_alerts (
    id UUID PRIMARY KEY,
    alert_code VARCHAR(100) NOT NULL,
    severity VARCHAR(30) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    vendor_id UUID REFERENCES vendors(id),
    department_id UUID REFERENCES departments(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(30) NOT NULL DEFAULT 'NEW',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 19. Fraud Cases Table
CREATE TABLE IF NOT EXISTS fraud_cases (
    id UUID PRIMARY KEY,
    case_number VARCHAR(100) NOT NULL UNIQUE,
    alert_id UUID REFERENCES fraud_alerts(id),
    assigned_auditor_id UUID REFERENCES users(id),
    vendor_id UUID REFERENCES vendors(id),
    department_id UUID REFERENCES departments(id),
    severity VARCHAR(30) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'OPEN',
    findings TEXT,
    resolution_notes TEXT,
    evidence_files_json TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    closed_at TIMESTAMP
);

-- 20. Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY,
    user_id UUID,
    user_email VARCHAR(150),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100),
    entity_id VARCHAR(100),
    ip_address VARCHAR(45),
    before_state TEXT,
    after_state TEXT,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for high-performance financial query filtering
CREATE INDEX IF NOT EXISTS idx_invoices_vendor ON invoices(vendor_id);
CREATE INDEX IF NOT EXISTS idx_invoices_dept ON invoices(department_id);
CREATE INDEX IF NOT EXISTS idx_invoices_num ON invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_vendors_gst ON vendors(gst_number);
CREATE INDEX IF NOT EXISTS idx_vendors_pan ON vendors(pan_number);
CREATE INDEX IF NOT EXISTS idx_vendors_bank ON vendors(bank_account_no);
CREATE INDEX IF NOT EXISTS idx_payments_dept ON payments(department_id);
CREATE INDEX IF NOT EXISTS idx_payments_date ON payments(payment_date);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON fraud_alerts(status);
CREATE INDEX IF NOT EXISTS idx_cases_auditor ON fraud_cases(assigned_auditor_id);

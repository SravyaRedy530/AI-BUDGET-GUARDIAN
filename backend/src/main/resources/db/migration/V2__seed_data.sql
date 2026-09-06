-- AI Budget Guardian Synthetic Seed Data Script V2
-- Realistic Government Financial Dataset with Injected Fraud & Risk Vectors

-- 1. Base Permissions
INSERT INTO permissions (id, code, module, description) VALUES
(1, 'users:manage', 'USER_MGMT', 'Create, edit, deactivate system users'),
(2, 'dept:manage', 'DEPT_MGMT', 'Manage departments and annual budget allocations'),
(3, 'budget:view', 'BUDGET', 'View department budget utilization and analytics'),
(4, 'budget:adjust', 'BUDGET', 'Request or approve budget adjustments'),
(5, 'vendor:manage', 'VENDOR', 'Add, update, or blacklist vendors'),
(6, 'po:create', 'PROCUREMENT', 'Create purchase orders'),
(7, 'invoice:submit', 'FINANCE', 'Submit and upload invoices'),
(8, 'payment:authorize', 'FINANCE', 'Authorize financial disbursements'),
(9, 'fraud:view', 'AI_RISK', 'Access AI Risk Center and risk alerts'),
(10, 'fraud:investigate', 'AUDIT', 'Open fraud cases, review evidence, submit findings');

-- 2. Base Roles
INSERT INTO roles (id, code, name, description) VALUES
(1, 'SUPER_ADMIN', 'Super Administrator', 'Full platform administrative access'),
(2, 'FINANCE_OFFICER', 'Finance Officer', 'Manages POs, invoices, and payment disbursements'),
(3, 'DEPARTMENT_MANAGER', 'Department Manager', 'Monitors department budgets and contractor projects'),
(4, 'AUDITOR', 'Financial Auditor', 'Investigates AI fraud alerts and resolves audit cases'),
(5, 'COMPANY_ADMIN', 'Company Admin Owner', 'Company Workspace Owner Administrator');

-- 3. Role Permissions Mapping
INSERT INTO role_permissions (role_id, permission_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7), (1, 8), (1, 9), (1, 10);

INSERT INTO role_permissions (role_id, permission_id) VALUES
(5, 1), (5, 2), (5, 3), (5, 4), (5, 5), (5, 6), (5, 7), (5, 8), (5, 9), (5, 10);

INSERT INTO role_permissions (role_id, permission_id) VALUES
(2, 3), (2, 5), (2, 6), (2, 7), (2, 8), (2, 9);

INSERT INTO role_permissions (role_id, permission_id) VALUES
(3, 3), (3, 4), (3, 9);

INSERT INTO role_permissions (role_id, permission_id) VALUES
(4, 3), (4, 9), (4, 10);

-- 4. Departments
INSERT INTO departments (id, code, name, description, annual_budget, quarterly_budget, monthly_budget, used_budget, remaining_budget, status) VALUES
('11111111-1111-1111-1111-111111111111', 'DEPT_INFRA', 'Department of Public Works & Infrastructure', 'Roads, bridges, highways, civic buildings development', 50000000.00, 12500000.00, 4166666.67, 34200000.00, 15800000.00, 'ACTIVE'),
('22222222-2222-2222-2222-222222222222', 'DEPT_HEALTH', 'Department of Public Health & Family Welfare', 'Hospitals, medical supplies, healthcare infrastructure', 35000000.00, 8750000.00, 2916666.67, 28900000.00, 6100000.00, 'ACTIVE'),
('33333333-3333-3333-3333-333333333333', 'DEPT_EDU', 'Department of Higher Education & Research', 'Universities, research grants, educational equipment', 25000000.00, 6250000.00, 2083333.33, 14500000.00, 10500000.00, 'ACTIVE'),
('44444444-4444-4444-4444-444444444444', 'DEPT_IT', 'Department of Information Technology & e-Gov', 'Government datacenters, cloud services, software systems', 18000000.00, 4500000.00, 1500000.00, 16100000.00, 1900000.00, 'ACTIVE');

-- 5. System Users (Password: Password123!)
-- Hash: $2b$12$FJM.yU6qr.kZn.noxSxamejxhZ0LA7URwT7JxNvYT8dRHe9goYgYS
INSERT INTO users (id, email, password_hash, full_name, phone, department_id, status) VALUES
('a1111111-1111-1111-1111-111111111111', 'admin@aibudget.gov.in', '$2b$12$FJM.yU6qr.kZn.noxSxamejxhZ0LA7URwT7JxNvYT8dRHe9goYgYS', 'Super Admin (System)', '+91-9876543210', NULL, 'ACTIVE'),
('a2222222-2222-2222-2222-222222222222', 'finance.officer@aibudget.gov.in', '$2b$12$FJM.yU6qr.kZn.noxSxamejxhZ0LA7URwT7JxNvYT8dRHe9goYgYS', 'Rajesh Sharma (Finance Officer)', '+91-9876543211', '11111111-1111-1111-1111-111111111111', 'ACTIVE'),
('a3333333-3333-3333-3333-333333333333', 'dept.manager@aibudget.gov.in', '$2b$12$FJM.yU6qr.kZn.noxSxamejxhZ0LA7URwT7JxNvYT8dRHe9goYgYS', 'Dr. Sunita Verma (Dept Manager)', '+91-9876543212', '22222222-2222-2222-2222-222222222222', 'ACTIVE'),
('a4444444-4444-4444-4444-444444444444', 'auditor@aibudget.gov.in', '$2b$12$FJM.yU6qr.kZn.noxSxamejxhZ0LA7URwT7JxNvYT8dRHe9goYgYS', 'Vikramaditya Rao (Lead Auditor)', '+91-9876543213', NULL, 'ACTIVE'),
('a5555555-5555-5555-5555-555555555555', 'company.admin@ka.gov.in', '$2b$12$FJM.yU6qr.kZn.noxSxamejxhZ0LA7URwT7JxNvYT8dRHe9goYgYS', 'Sravya (Company Workspace Admin)', '+91-9876543214', NULL, 'ACTIVE');

-- User Roles Mapping
INSERT INTO user_roles (user_id, role_id) VALUES
('a1111111-1111-1111-1111-111111111111', 1),
('a2222222-2222-2222-2222-222222222222', 2),
('a3333333-3333-3333-3333-333333333333', 3),
('a4444444-4444-4444-4444-444444444444', 4),
('a5555555-5555-5555-5555-555555555555', 5);

-- 6. Vendors
INSERT INTO vendors (id, vendor_name, gst_number, pan_number, bank_account_no, ifsc_code, address, contact_email, contact_phone, category, status, risk_score, risk_level) VALUES
('b1111111-1111-1111-1111-111111111111', 'Apex Highway Infra Corp', '27AAACA1234A1Z5', 'AAACA1234A', '987654321001', 'SBIN0001234', 'Plot 42, Civil Lines, New Delhi', 'info@apexhighway.com', '+91-11-23456789', 'Infrastructure', 'ACTIVE', 12.50, 'LOW'),
('b2222222-2222-2222-2222-222222222222', 'MedLife Pharma Supplies', '36AAACB5678B1Z2', 'AAACB5678B', '987654321002', 'HDFC0005678', 'Medical Zone, Hyderabad', 'sales@medlifepharma.in', '+91-40-87654321', 'Medical Supplies', 'ACTIVE', 8.00, 'LOW'),
('b3333333-3333-3333-3333-333333333333', 'Global CyberTech Systems', '07AAACC9012C1Z8', 'AAACC9012C', '987654321003', 'ICIC0009012', 'Tech Park, Sector 62, Noida', 'contracts@globalcyber.io', '+91-120-4567890', 'IT Services', 'ACTIVE', 15.00, 'LOW'),
('b4444444-4444-4444-4444-444444444444', 'Shadow Infra Solutions (Shell Vendor 1)', '27AAACD9999D1Z9', 'AAACD9999D', '999000111222', 'SBIN0009999', 'Suite 101, Fake Commercial Complex, Mumbai', 'contact@shadowinfra.com', '+91-22-99998888', 'Infrastructure', 'UNDER_REVIEW', 88.50, 'HIGH'),
('b5555555-5555-5555-5555-555555555555', 'Phantom Traders (Shell Vendor 2)', '27AAACE8888E1Z1', 'AAACE8888E', '999000111222', 'SBIN0009999', 'Suite 101, Fake Commercial Complex, Mumbai', 'info@phantomtraders.com', '+91-22-99998888', 'General Supplies', 'UNDER_REVIEW', 94.00, 'CRITICAL');

-- 7. Vendor Risk Scores
INSERT INTO vendor_risk_scores (id, vendor_id, score, risk_level, duplicate_gst_flag, duplicate_pan_flag, duplicate_bank_flag, same_address_flag, blacklisted_flag, explanation_json) VALUES
('c1111111-1111-1111-1111-111111111111', 'b4444444-4444-4444-4444-444444444444', 88.50, 'HIGH', false, false, true, true, false, '{"reasons":["Shares bank account 999000111222 with Phantom Traders","Shares registered address with Phantom Traders"]}'),
('c2222222-2222-2222-2222-222222222222', 'b5555555-5555-5555-5555-555555555555', 94.00, 'CRITICAL', false, false, true, true, false, '{"reasons":["Identical bank account and address to Shadow Infra Solutions","Rapid sequence of high-value invoices following company registration"]}');

-- 8. Purchase Orders
INSERT INTO purchase_orders (id, po_number, department_id, vendor_id, total_amount, status, po_date) VALUES
('d1111111-2222-3333-4444-555555555555', 'PO-INFRA-2025-001', '11111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', 12000000.00, 'APPROVED', '2025-04-10'),
('d2222222-3333-4444-5555-666666666666', 'PO-HEALTH-2025-004', '22222222-2222-2222-2222-222222222222', 'b2222222-2222-2222-2222-222222222222', 8500000.00, 'APPROVED', '2025-05-15'),
('d3333333-4444-5555-6666-777777777777', 'PO-INFRA-2025-009', '11111111-1111-1111-1111-111111111111', 'b4444444-4444-4444-4444-444444444444', 4500000.00, 'APPROVED', '2025-06-20');

-- 9. Invoices
INSERT INTO invoices (id, invoice_number, vendor_id, department_id, po_id, amount, gst_amount, invoice_date, duplicate_probability, duplicate_flag, approval_status, payment_status) VALUES
('e1111111-1111-1111-1111-111111111111', 'INV-2025-001', 'b1111111-1111-1111-1111-111111111111', '11111111-1111-1111-1111-111111111111', 'd1111111-2222-3333-4444-555555555555', 4000000.00, 720000.00, '2025-04-25', 0.00, false, 'APPROVED', 'PAID'),
('e2222222-2222-2222-2222-222222222222', 'INV-MED-8899', 'b2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'd2222222-3333-4444-5555-666666666666', 2500000.00, 450000.00, '2025-05-30', 5.00, false, 'APPROVED', 'PAID'),
('e3333333-3333-3333-3333-333333333333', 'INV-MED-8899-DUP', 'b2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'd2222222-3333-4444-5555-666666666666', 2500000.00, 450000.00, '2025-06-02', 96.50, true, 'FLAGGED', 'UNPAID'),
('e4444444-4444-4444-4444-444444444444', 'INV-SHADOW-001', 'b4444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'd3333333-4444-5555-6666-777777777777', 6800000.00, 1224000.00, '2025-06-25', 45.00, false, 'FLAGGED', 'UNPAID');

-- 10. AI Predictions & SHAP Explanations
INSERT INTO ai_predictions (id, entity_type, entity_id, model_name, model_version, risk_score, risk_level, confidence, prediction, explanation_json, recommended_action) VALUES
('f1111111-1111-1111-1111-111111111111', 'INVOICE', 'e3333333-3333-3333-3333-333333333333', 'DuplicateInvoiceDetector', 'v1.2.0', 96.50, 'CRITICAL', 0.985, 'High probability of duplicate billing detected for medical equipment.', '{"base_value":10.0,"features":[{"name":"fuzzy_invoice_num_similarity","value":0.92,"impact":0.45,"description":"Invoice number matches INV-MED-8899 by 92%"},{"name":"exact_amount_match","value":1.0,"impact":0.35,"description":"Identical invoice amount 2,500,000.00"},{"name":"days_between_submissions","value":3,"impact":0.165,"description":"Submitted within 3 days of original invoice"}]}', 'Block payment immediately and trigger Auditor Investigation.'),
('f2222222-2222-2222-2222-222222222222', 'INVOICE', 'e4444444-4444-4444-4444-444444444444', 'OverpaymentRiskModel', 'v1.1.0', 89.00, 'HIGH', 0.920, 'Invoice amount exceeds PO contract allocation by 51.1%.', '{"base_value":15.0,"features":[{"name":"po_amount_variance","value":0.511,"impact":0.52,"description":"Invoice exceeds Purchase Order PO-INFRA-2025-009 by 2,300,000.00"},{"name":"vendor_risk_score","value":88.5,"impact":0.37,"description":"Vendor has HIGH risk rating due to shared credentials"}]}', 'Escalate to Finance Manager and Auditor for contract review.');

-- 11. Fraud Alerts
INSERT INTO fraud_alerts (id, alert_code, severity, entity_type, entity_id, vendor_id, department_id, title, description, status) VALUES
('fa111111-1111-1111-1111-111111111111', 'ALT-DUP-INVOICE-001', 'CRITICAL', 'INVOICE', 'e3333333-3333-3333-3333-333333333333', 'b2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', '96.5% Duplicate Invoice Detected (INV-MED-8899-DUP)', 'Duplicate medical supplies invoice submitted within 3 days of previous payment authorization.', 'NEW'),
('fa222222-2222-2222-2222-222222222222', 'ALT-OVERPAY-002', 'HIGH', 'INVOICE', 'e4444444-4444-4444-4444-444444444444', 'b4444444-4444-4444-4444-444444444444', '11111111-1111-1111-1111-111111111111', 'Contract Overpayment Risk (PO Mismatch)', 'Invoice amount of 6,800,000.00 exceeds Purchase Order allocation of 4,500,000.00.', 'NEW');

-- 12. Fraud Cases
INSERT INTO fraud_cases (id, case_number, alert_id, assigned_auditor_id, vendor_id, department_id, severity, status, findings) VALUES
('fc111111-1111-1111-1111-111111111111', 'CASE-2025-8801', 'fa111111-1111-1111-1111-111111111111', 'a4444444-4444-4444-4444-444444444444', 'b2222222-2222-2222-2222-222222222222', '22222222-2222-2222-2222-222222222222', 'CRITICAL', 'UNDER_INVESTIGATION', 'Investigating potential duplicate billing by MedLife Pharma. Vendor submitted twin invoices with modified reference codes.');

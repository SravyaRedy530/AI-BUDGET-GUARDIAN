# AI Budget Guardian — API Architecture Specification

## 1. Design Overview
All backend services expose RESTful HTTP endpoints adhering to JSON API standards.
- **Base URI**: `/api/v1`
- **Authentication**: `Authorization: Bearer <jwt_access_token>`
- **Response Format**: Standardized `ApiResponse<T>` wrapper.
- **Documentation**: OpenAPI 3.0 / Swagger UI accessible at `/swagger-ui.html`.

---

## 2. Standard API Response Structure

```json
{
  "success": true,
  "status": 200,
  "message": "Operation completed successfully",
  "data": {},
  "timestamp": "2026-09-04T11:00:00Z",
  "errors": null
}
```

Standard Error Response:
```json
{
  "success": false,
  "status": 400,
  "message": "Validation Failed",
  "data": null,
  "timestamp": "2026-09-04T11:00:00Z",
  "errors": [
    {
      "field": "amount",
      "message": "Invoice amount must be greater than zero"
    }
  ]
}
```

---

## 3. Core API Endpoint Matrix

### 3.1 Authentication & Security (`/api/v1/auth`)
- `POST /api/v1/auth/login`: Authenticate credentials, return JWT Access & Refresh Token.
- `POST /api/v1/auth/refresh`: Refresh JWT access token using valid refresh token.
- `POST /api/v1/auth/logout`: Revoke active session tokens.
- `POST /api/v1/auth/forgot-password`: Request password reset token.
- `POST /api/v1/auth/reset-password`: Submit token and new password.
- `GET /api/v1/auth/me`: Get current authenticated user profile & permissions.

### 3.2 User & RBAC Management (`/api/v1/users`, `/api/v1/roles`)
- `GET /api/v1/users`: List users with pagination, role filter, department filter.
- `POST /api/v1/users`: Create new system user with assigned role & department.
- `GET /api/v1/users/{id}`: Get user details.
- `PUT /api/v1/users/{id}`: Update user profile, role, department.
- `PATCH /api/v1/users/{id}/status`: Activate / deactivate user account.
- `GET /api/v1/roles`: List all system roles and permission mappings.

### 3.3 Department & Budget Management (`/api/v1/departments`, `/api/v1/budgets`)
- `GET /api/v1/departments`: List departments with real-time budget utilization metrics.
- `POST /api/v1/departments`: Create department entity.
- `PUT /api/v1/departments/{id}`: Update department specs.
- `GET /api/v1/budgets/summary`: System-wide budget overview (total, spent, remaining, projected burn).
- `POST /api/v1/budgets/allocation`: Allocate or adjust yearly/quarterly budget.
- `GET /api/v1/budgets/department/{departmentId}`: Department budget analytics & historical trend.

### 3.4 Procurement & Vendor Management (`/api/v1/vendors`, `/api/v1/tenders`, `/api/v1/contractors`)
- `GET /api/v1/vendors`: List vendors with risk scores, category, and blacklist status.
- `POST /api/v1/vendors`: Register new vendor (triggers real-time AI background check).
- `GET /api/v1/vendors/{id}/risk-profile`: View detailed AI vendor risk explanation.
- `PATCH /api/v1/vendors/{id}/blacklist`: Blacklist vendor with formal reason.
- `GET /api/v1/contractors`: List contractors, project success metrics, and risk ratings.
- `GET /api/v1/tenders`: List tenders and bid anomaly indicators.

### 3.5 Operational Financial Lifecycle (`/api/v1/purchase-orders`, `/api/v1/invoices`, `/api/v1/payments`)
- `GET /api/v1/purchase-orders`: List purchase orders.
- `POST /api/v1/purchase-orders`: Create PO linked to department and vendor.
- `GET /api/v1/invoices`: List invoices with duplicate probability indicators.
- `POST /api/v1/invoices`: Create manual invoice or submit extracted PDF.
- `POST /api/v1/invoices/extract`: Process raw PDF invoice via OCR/Document extraction service.
- `GET /api/v1/invoices/{id}/duplicate-check`: Run explicit duplicate check against database.
- `GET /api/v1/payments`: List payment records.
- `POST /api/v1/payments`: Process payment (triggers automatic AI anomaly verification).

### 3.6 AI Risk, Cases, & Audit (`/api/v1/ai`, `/api/v1/alerts`, `/api/v1/cases`, `/api/v1/audit-logs`)
- `GET /api/v1/ai/risk-center`: Global risk telemetry (fraud count, risk score distribution, AI status).
- `GET /api/v1/ai/explain/{entityType}/{entityId}`: Get SHAP / LIME feature contribution breakdown.
- `GET /api/v1/alerts`: Real-time risk alerts with severity filters.
- `GET /api/v1/cases`: List fraud investigation cases.
- `POST /api/v1/cases`: Create case from alert.
- `PUT /api/v1/cases/{id}/status`: Update case status, assign auditor, attach findings.
- `GET /api/v1/audit-logs`: System audit trail search and export.
- `GET /api/v1/reports/export`: Export PDF/Excel/CSV financial and audit reports.

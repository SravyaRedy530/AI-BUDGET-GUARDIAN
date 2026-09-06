# AI Budget Guardian — Security Architecture Specification

## 1. Security Overview
AI Budget Guardian implements a defense-in-depth security model compliant with financial data safety guidelines, zero-trust backend authorization, enterprise RBAC/ABAC, data encryption, and comprehensive immutable audit logging.

---

## 2. Authentication & JWT Strategy
- **Passcode Hashing**: BCrypt with strength factor 12.
- **JWT Architecture**:
  - **Access Token**: Short-lived (15 minutes), signed with HMAC-SHA512 (`HS512`). Contains user UUID, role, department ID, and explicit permissions array.
  - **Refresh Token**: Long-lived (7 days), stored securely in HttpOnly, SameSite=Strict cookies (or secure refresh header).
- **Session Management**: Server-tracked active sessions in memory/DB allowing instant remote session revocation upon security alerts.

---

## 3. RBAC & Fine-Grained Permission Matrix

| Role | Description | Scope / Permissions |
|---|---|---|
| `SUPER_ADMIN` | Platform Administrator | Global access. System config, User management, Department budget allocation, AI threshold config, Audit log access. |
| `FINANCE_OFFICER` | Department Financial Officer | PO creation, Invoice submission/review, Payment authorization within assigned department, Viewing budget utilization. |
| `DEPARTMENT_MANAGER` | Department Head | Department budget monitoring, Contractor evaluation, Spend approval request, Department analytics & forecasting. |
| `AUDITOR` | Independent Financial Auditor | Platform-wide read access to transactions, Fraud Alert investigation queue, Case management, Evidence review, Resolution submission. |
| `AI_ENGINE` | System Service Account | Non-human internal service key for invoking AI analysis APIs and publishing automated risk alerts. |

---

## 4. API & Data Protection Measures
- **CORS Configuration**: Strict origin whitelist matching frontend domain.
- **Input Validation**: Jakarta Validation (`@NotNull`, `@Size`, `@Pattern`, `@Positive`) on all REST DTO inputs.
- **Global Exception Interception**: Generic client error responses (`400 Bad Request`, `403 Forbidden`, `500 Internal Server Error`) masking internal stack traces.
- **Audit Logging**: Aspect-Oriented Programming (`AuditAspect`) intercepting state-changing controller endpoints and recording before/after JSON states into immutable `audit_logs`.

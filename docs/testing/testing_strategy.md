# AI Budget Guardian — Testing Strategy & QA Plan

## 1. Overview
The testing framework for AI Budget Guardian covers unit testing, integration testing, AI model accuracy validation, end-to-end user workflow verification, and security verification.

---

## 2. Test Pyramid & Automation Framework

### 2.1 Backend Testing (Spring Boot / Java 21)
- **Unit Testing**: JUnit 5 + Mockito for testing Service business logic, DTO mapping, and validation rules in isolation.
- **Repository Testing**: `@DataJpaTest` with PostgreSQL / Testcontainers verifying custom JPA queries, indexes, and soft-delete specs.
- **Controller & Security Testing**: `@WebMvcTest` + `MockMvc` verifying endpoint routing, request body parsing, JWT token validation, and RBAC security rules.
- **Integration Testing**: `@SpringBootTest` testing end-to-end request handling from REST controller down to database persistence.

### 2.2 AI Microservice Testing (Python / FastAPI)
- **Unit Testing**: Pytest testing fuzzy matching algorithms, feature extraction functions, and risk scoring calculators.
- **Model Evaluation**: Metrics validation scripts asserting Accuracy > 90%, F1 > 0.88, and SHAP feature output structure integrity.
- **API Endpoint Verification**: FastAPI `TestClient` verifying `/ai/*` request schemas, status codes, and latency bounds (< 200ms per inference call).

### 2.3 Frontend Testing (React / Vite)
- **Component Testing**: Vitest + React Testing Library testing reusable UI components (MetricCard, RiskBadge, DataTable, FilterBar).
- **Form & Auth Testing**: Form validation, error boundary behavior, and mock TanStack Query hooks.
- **End-to-End Flow**: Cypress / Playwright verifying end-to-end flow from user login -> budget viewing -> PO creation -> invoice upload -> AI alert trigger -> auditor case resolution.

# AI Budget Guardian — Intelligent Government Financial Monitoring & Fraud Analytics Platform

[![Java](https://img.shields.io/badge/Java-21%20LTS-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.4-green.svg)](https://spring.io/projects/spring-boot)
[![Python](https://img.shields.io/badge/Python-3.11-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110-teal.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-18-cyan.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue.svg)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-blue.svg)](https://www.docker.com/)

---

## 1. Executive Summary
**AI Budget Guardian** is an enterprise-quality, production-style government financial monitoring ecosystem designed to prevent budget leakages, detect procurement fraud, analyze vendor identity risks, forecast spending burn rates, and deliver **Explainable AI (XAI)** insights for financial auditors and department heads.

Designed for:
1. Final-year academic research & publications
2. Portfolio & Resume showcase
3. Enterprise financial monitoring demonstration

---

## 2. Platform Architecture

```
                               ┌─────────────────────────────┐
                               │     React 18 + Vite UI      │
                               │  (TypeScript, Tailwind CSS) │
                               └──────────────┬──────────────┘
                                              │ HTTPS / JWT
                               ┌──────────────▼──────────────┐
                               │    Spring Boot 3 REST API   │
                               │    (Java 21, Security 6)    │
                               └──────┬────────────────┬─────┘
                                      │                │
                        Spring Data   │                │ HTTP REST
                        JPA / JDBC    │                │ JSON RPC
                                      │                │
                         ┌────────────▼──┐      ┌──────▼─────────────────────┐
                         │ PostgreSQL 16 │      │  Python FastAPI AI Engine  │
                         │ Relational DB │      │  (XGBoost, IsolationForest)│
                         └───────────────┘      └──────────────┬─────────────┘
                                                               │
                                                        ┌──────▼─────────────┐
                                                        │ Explainable AI     │
                                                        │ (SHAP & LIME XAI)  │
                                                        └────────────────────┘
```

---

## 3. Key Functional Modules & Features

- **Role-Based Access Control (RBAC)**: Fine-grained permission matrix with 4 human roles (`SUPER_ADMIN`, `FINANCE_OFFICER`, `DEPARTMENT_MANAGER`, `AUDITOR`) and 1 system service (`AI_ENGINE`).
- **Duplicate Invoice Detection**: Rule-based matching + RapidFuzz Levenshtein & Jaro-Winkler string similarity fingerprinting.
- **Fake Vendor Identification**: Identity graph overlap detection flagging duplicate GSTs, PAN numbers, bank accounts, and addresses across vendor registries.
- **Overpayment & Contract Reconciliation**: Detects purchase order vs. invoice price variances and excess payments.
- **Budget Misuse & Exhaustion Prediction**: Time-series burn rate analysis predicting projected budget depletion dates.
- **Explainable AI (SHAP & LIME)**: Every AI prediction outputs structured feature attributions, model confidence, influencing reasons, and recommended auditor actions.
- **Auditor Investigation Workspace**: Queue management for alerts, evidence review, auditor findings logging, and case resolution.
- **Immutable Audit Logging**: Aspect-oriented logger capturing user actions, timestamps, IP addresses, and before/after states.

---

## 4. Demo Login Credentials

| Role | Email | Password | Primary Scope |
|---|---|---|---|
| **Super Admin** | `admin@aibudget.gov.in` | `Password123!` | Global administration, user management, budget allocation |
| **Finance Officer** | `finance.officer@aibudget.gov.in` | `Password123!` | Purchase Order creation, invoice submission, payment disbursements |
| **Department Manager** | `dept.manager@aibudget.gov.in` | `Password123!` | Department budget monitoring & contractor evaluations |
| **Lead Auditor** | `auditor@aibudget.gov.in` | `Password123!` | Fraud queue investigation, evidence review, case resolution |

---

## 5. Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, TanStack Query, TanStack Table, Recharts, Lucide Icons
- **Backend**: Java 21 LTS, Spring Boot 3.2.4, Spring Security 6, Spring Data JPA, Hibernate, JWT (JJWT 0.12.5), Maven
- **Database**: PostgreSQL 16 / H2 Database
- **AI Microservice**: Python 3.11, FastAPI, Pandas, NumPy, Scikit-learn, XGBoost, SHAP, LIME, RapidFuzz
- **Storage**: MinIO S3 Object Storage
- **Deployment**: Docker, Docker Compose

---

## 6. Local Quickstart Guide

### Prerequisites
- Java 21 JDK
- Maven 3.9+
- Python 3.11+
- Node.js v20+

### Option A: Local Development Run

1. **Start Backend Service (Spring Boot)**
```bash
cd backend
mvn clean test
mvn spring-boot:run
```
*Backend runs on `http://localhost:8080` (Swagger UI at `/swagger-ui.html`)*

2. **Start AI Microservice (FastAPI)**
```bash
cd ai-service
pip install -r requirements.txt
python -m pytest tests/test_ai_engine.py
uvicorn app.main:app --reload --port 8000
```
*AI Engine runs on `http://localhost:8000`*

3. **Start Frontend Client (React Vite)**
```bash
cd frontend
npm install
npm run dev
```
*Frontend client runs on `http://localhost:5173`*

---

### Option B: Docker Compose Deployment

```bash
docker-compose up --build -d
```
Services will be accessible at:
- **Frontend App**: `http://localhost:80`
- **Backend REST API**: `http://localhost:8080`
- **AI Microservice**: `http://localhost:8000`
- **MinIO Storage Console**: `http://localhost:9001`

---

## 7. Testing & Verification

- **Backend Unit & Integration Tests**: `cd backend && mvn clean test`
- **AI Service Pytest Suite**: `cd ai-service && python -m pytest tests/test_ai_engine.py`

---

## 8. License
Developed under open academic & research guidelines for enterprise government financial monitoring ecosystems.

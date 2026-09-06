import pytest
import httpx
from app.main import app

@pytest.mark.anyio
async def test_healthcheck():
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://testserver") as client:
        response = await client.get("/health")
        assert response.status_code == 200
        assert response.json()["status"] == "UP"

@pytest.mark.anyio
async def test_duplicate_invoice_detection():
    payload = {
        "invoiceNumber": "INV-2025-001-DUP",
        "vendorId": "v1111111-1111-1111-1111-111111111111",
        "amount": 4000000.00,
        "invoiceDate": "2025-04-28",
        "candidateInvoices": [
            {
                "invoiceNumber": "INV-2025-001",
                "vendorId": "v1111111-1111-1111-1111-111111111111",
                "amount": 4000000.00,
                "invoiceDate": "2025-04-25"
            }
        ]
    }
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://testserver") as client:
        response = await client.post("/ai/v1/invoice/duplicate", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["riskScore"] > 80.0
        assert data["riskLevel"] == "CRITICAL"
        assert len(data["features"]) > 0

@pytest.mark.anyio
async def test_vendor_risk_evaluation():
    payload = {
        "vendorId": "v5555555-5555-5555-5555-555555555555",
        "gstNumber": "27AAACE8888E1Z1",
        "panNumber": "AAACE8888E",
        "bankAccountNo": "999000111222",
        "address": "Suite 101, Fake Commercial Complex",
        "allVendors": [
            {
                "id": "v4444444-4444-4444-4444-444444444444",
                "bankAccountNo": "999000111222",
                "address": "Suite 101, Fake Commercial Complex"
            }
        ]
    }
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://testserver") as client:
        response = await client.post("/ai/v1/vendor/risk", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["riskScore"] >= 80.0
        assert data["riskLevel"] in ["HIGH", "CRITICAL"]

@pytest.mark.anyio
async def test_anomaly_detection():
    payload = {
        "amount": 15000000.00,
        "departmentHistoricalAvg": 1500000.00,
        "submissionHour": 2,
        "isWeekend": True,
        "vendorRiskScore": 88.5
    }
    transport = httpx.ASGITransport(app=app)
    async with httpx.AsyncClient(transport=transport, base_url="http://testserver") as client:
        response = await client.post("/ai/v1/anomaly/detect", json=payload)
        assert response.status_code == 200
        data = response.json()
        assert data["riskScore"] > 50.0
        assert data["riskLevel"] in ["HIGH", "CRITICAL"]

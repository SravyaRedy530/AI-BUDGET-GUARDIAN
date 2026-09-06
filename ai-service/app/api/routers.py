from fastapi import APIRouter
from app.schemas import (
    DuplicateCheckRequest, VendorRiskRequest, AnomalyCheckRequest,
    BudgetForecastRequest, AIExplanationResponse
)
from app.modules.duplicate_detector import DuplicateInvoiceDetector
from app.modules.vendor_risk_model import VendorRiskModel
from app.modules.anomaly_detector import AnomalyDetector
from app.modules.budget_forecaster import BudgetForecaster

router = APIRouter(prefix="/ai/v1")

duplicate_detector = DuplicateInvoiceDetector()
vendor_risk_model = VendorRiskModel()
anomaly_detector = AnomalyDetector()
budget_forecaster = BudgetForecaster()

@router.post("/invoice/duplicate", response_model=AIExplanationResponse)
def check_duplicate_invoice(req: DuplicateCheckRequest):
    return duplicate_detector.analyze(
        invoice_number=req.invoiceNumber,
        vendor_id=req.vendorId,
        amount=req.amount,
        candidate_invoices=req.candidateInvoices
    )

@router.post("/vendor/risk", response_model=AIExplanationResponse)
def evaluate_vendor_risk(req: VendorRiskRequest):
    return vendor_risk_model.analyze(
        vendor_id=req.vendorId,
        gst=req.gstNumber,
        pan=req.panNumber,
        bank=req.bankAccountNo,
        address=req.address,
        all_vendors=req.allVendors
    )

@router.post("/anomaly/detect", response_model=AIExplanationResponse)
def detect_anomaly(req: AnomalyCheckRequest):
    return anomaly_detector.analyze(
        amount=req.amount,
        dept_avg=req.departmentHistoricalAvg,
        submission_hour=req.submissionHour,
        is_weekend=req.isWeekend,
        vendor_risk=req.vendorRiskScore
    )

@router.post("/budget/forecast", response_model=AIExplanationResponse)
def forecast_budget(req: BudgetForecastRequest):
    return budget_forecaster.analyze(
        allocated_amount=req.allocatedAmount,
        used_amount=req.usedAmount,
        monthly_spends=req.monthlySpendHistory
    )

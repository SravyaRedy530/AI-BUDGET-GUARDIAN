from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import date

class FeatureImpact(BaseModel):
    name: str
    value: float
    impact: float
    description: str

class AIExplanationResponse(BaseModel):
    riskScore: float = Field(..., ge=0, le=100)
    riskLevel: str # LOW, MEDIUM, HIGH, CRITICAL
    confidence: float = Field(..., ge=0, le=1.0)
    prediction: str
    reasons: List[str]
    features: List[FeatureImpact]
    recommendedAction: str

class DuplicateCheckRequest(BaseModel):
    invoiceNumber: str
    vendorId: str
    amount: float
    invoiceDate: str
    candidateInvoices: List[dict]

class VendorRiskRequest(BaseModel):
    vendorId: str
    gstNumber: Optional[str] = None
    panNumber: Optional[str] = None
    bankAccountNo: Optional[str] = None
    address: Optional[str] = None
    allVendors: List[dict]

class AnomalyCheckRequest(BaseModel):
    amount: float
    departmentHistoricalAvg: float
    submissionHour: int
    isWeekend: bool
    vendorRiskScore: float

class BudgetForecastRequest(BaseModel):
    allocatedAmount: float
    usedAmount: float
    monthlySpendHistory: List[float]

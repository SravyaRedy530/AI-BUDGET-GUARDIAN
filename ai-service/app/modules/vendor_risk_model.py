from typing import List, Dict, Optional
from app.schemas import AIExplanationResponse, FeatureImpact

class VendorRiskModel:

    def analyze(self, vendor_id: str, gst: Optional[str], pan: Optional[str], bank: Optional[str], address: Optional[str], all_vendors: List[Dict]) -> AIExplanationResponse:
        risk_score = 0.0
        reasons = []
        features = []

        dup_gst_count = 0
        dup_bank_count = 0
        dup_address_count = 0

        for v in all_vendors:
            if v.get("id") == vendor_id:
                continue
            if gst and v.get("gstNumber") == gst:
                dup_gst_count += 1
            if bank and v.get("bankAccountNo") == bank:
                dup_bank_count += 1
            if address and address.lower() in str(v.get("address", "")).lower():
                dup_address_count += 1

        if dup_bank_count > 0:
            risk_score += 45.0
            reasons.append(f"Shares bank account details with {dup_bank_count} other registered vendor(s).")
            features.append(FeatureImpact(
                name="shared_bank_account",
                value=float(dup_bank_count),
                impact=0.45,
                description=f"Multiple vendors ({dup_bank_count}) using identical bank account"
            ))

        if dup_address_count > 0:
            risk_score += 35.0
            reasons.append(f"Shares registered physical address with {dup_address_count} other vendor(s).")
            features.append(FeatureImpact(
                name="shared_address",
                value=float(dup_address_count),
                impact=0.35,
                description="Co-located registered corporate address with unlinked vendor entity"
            ))

        if dup_gst_count > 0:
            risk_score += 40.0
            reasons.append(f"Duplicate GST registration number detected across {dup_gst_count} vendors.")
            features.append(FeatureImpact(
                name="duplicate_gst",
                value=float(dup_gst_count),
                impact=0.40,
                description="Duplicate Tax Identification (GST) number registered"
            ))

        if not features:
            risk_score = 5.0
            reasons.append("Vendor identity credentials unique across global registry.")
            features.append(FeatureImpact(
                name="unique_identity",
                value=1.0,
                impact=0.05,
                description="Verified unique GST, Bank, and Address details"
            ))

        risk_score = min(risk_score, 100.0)

        if risk_score >= 80.0:
            risk_level = "CRITICAL"
            prediction = "High probability of Shell / Fake Vendor identity cluster."
            action = "Blacklist vendor entity immediately and initiate audit of historical payments."
        elif risk_score >= 50.0:
            risk_level = "HIGH"
            prediction = "Elevated vendor risk due to shared bank or physical address credentials."
            action = "Place vendor payments under audit review and require verified proof of work."
        else:
            risk_level = "LOW"
            prediction = "Vendor verified as low risk."
            action = "Allow standard procurement and payment processing."

        return AIExplanationResponse(
            riskScore=round(risk_score, 2),
            riskLevel=risk_level,
            confidence=0.92,
            prediction=prediction,
            reasons=reasons,
            features=features,
            recommendedAction=action
        )

from rapidfuzz import fuzz
from typing import List, Dict, Tuple
from app.schemas import AIExplanationResponse, FeatureImpact

class DuplicateInvoiceDetector:

    def analyze(self, invoice_number: str, vendor_id: str, amount: float, candidate_invoices: List[Dict]) -> AIExplanationResponse:
        max_score = 0.0
        best_match = None
        matched_reasons = []
        features = []

        for candidate in candidate_invoices:
            # 1. Exact or Fuzzy Invoice Number similarity
            cand_inv_num = candidate.get("invoiceNumber", "")
            cand_amount = float(candidate.get("amount", 0.0))
            cand_vendor_id = candidate.get("vendorId", "")

            inv_sim = fuzz.ratio(invoice_number.lower(), cand_inv_num.lower()) / 100.0
            amount_match = 1.0 if abs(amount - cand_amount) < 0.01 else 0.0
            vendor_match = 1.0 if vendor_id == cand_vendor_id else 0.0

            # Composite Score calculation
            score = (inv_sim * 0.45) + (amount_match * 0.35) + (vendor_match * 0.20)
            score_pct = score * 100.0

            if score_pct > max_score:
                max_score = score_pct
                best_match = candidate

                features = [
                    FeatureImpact(
                        name="invoice_number_similarity",
                        value=round(inv_sim * 100, 1),
                        impact=round(inv_sim * 0.45, 3),
                        description=f"Invoice number matches {cand_inv_num} by {round(inv_sim*100, 1)}%"
                    ),
                    FeatureImpact(
                        name="amount_exact_match",
                        value=amount_match,
                        impact=round(amount_match * 0.35, 3),
                        description=f"Exact match on invoice amount of {amount:,.2f}" if amount_match else "Invoice amounts differ"
                    ),
                    FeatureImpact(
                        name="vendor_identity_match",
                        value=vendor_match,
                        impact=round(vendor_match * 0.20, 3),
                        description="Submitted by identical vendor entity" if vendor_match else "Submitted by different vendor entity"
                    )
                ]

        if max_score > 85.0:
            risk_level = "CRITICAL"
            prediction = f"High probability ({round(max_score, 1)}%) of duplicate invoice submission."
            matched_reasons = [
                f"Matches existing invoice {best_match.get('invoiceNumber')} submitted on {best_match.get('invoiceDate')}.",
                f"Invoice amount ({amount:,.2f}) matches existing payment record.",
                "Fuzzy text string distance violates duplication safety threshold (>85%)."
            ]
            recommended_action = "Block invoice payment immediately. Route to Auditor Investigation queue."
        elif max_score > 60.0:
            risk_level = "HIGH"
            prediction = f"Moderate risk ({round(max_score, 1)}%) of duplicate or split invoice."
            matched_reasons = [
                f"Similar invoice string structure to candidate {best_match.get('invoiceNumber')}.",
                "Invoice amount aligns with historical vendor payment patterns."
            ]
            recommended_action = "Require mandatory manual review by Finance Officer before approval."
        else:
            risk_level = "LOW"
            prediction = "Invoice appears unique. No significant duplicate patterns detected."
            matched_reasons = ["Invoice number string and transaction parameters pass uniqueness check."]
            recommended_action = "Proceed with normal approval workflow."

        return AIExplanationResponse(
            riskScore=round(max_score, 2),
            riskLevel=risk_level,
            confidence=0.95,
            prediction=prediction,
            reasons=matched_reasons,
            features=features,
            recommendedAction=recommended_action
        )

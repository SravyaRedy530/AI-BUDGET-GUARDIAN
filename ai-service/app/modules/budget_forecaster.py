import numpy as np
from typing import List
from datetime import date, timedelta
from app.schemas import AIExplanationResponse, FeatureImpact

class BudgetForecaster:

    def analyze(self, allocated_amount: float, used_amount: float, monthly_spends: List[float]) -> AIExplanationResponse:
        remaining = max(allocated_amount - used_amount, 0.0)
        avg_monthly = float(np.mean(monthly_spends)) if monthly_spends else (used_amount / 6.0)

        months_remaining = (remaining / avg_monthly) if avg_monthly > 0 else 12.0
        projected_days = int(months_remaining * 30.0)
        exhaustion_date = date.today() + timedelta(days=projected_days)

        utilization_pct = (used_amount / max(allocated_amount, 1.0)) * 100.0
        burn_rate = (avg_monthly / max(allocated_amount, 1.0)) * 100.0

        risk_score = min(max(utilization_pct * 0.8 + burn_rate * 2.0, 0.0), 100.0)
        reasons = []
        features = [
            FeatureImpact(
                name="utilization_percentage",
                value=round(utilization_pct, 1),
                impact=0.40,
                description=f"Current budget utilization at {round(utilization_pct, 1)}%"
            ),
            FeatureImpact(
                name="monthly_burn_rate_pct",
                value=round(burn_rate, 1),
                impact=0.35,
                description=f"Monthly burn rate of {round(burn_rate, 1)}% of total allocation"
            ),
            FeatureImpact(
                name="projected_exhaustion_days",
                value=float(projected_days),
                impact=0.25,
                description=f"Projected exhaustion in {projected_days} days ({exhaustion_date.strftime('%b %d, %Y')})"
            )
        ]

        if utilization_pct > 85.0:
            risk_level = "CRITICAL"
            prediction = f"Critical budget exhaustion risk. Remaining funds estimated to deplete by {exhaustion_date.strftime('%b %d, %Y')}."
            reasons = [
                f"Budget utilization has reached {round(utilization_pct, 1)}% prior to fiscal year end.",
                f"Monthly expenditure average ({avg_monthly:,.2f}) will exceed remaining allocation ({remaining:,.2f})."
            ]
            action = "Freeze non-essential procurement and apply for emergency budget re-allocation."
        elif utilization_pct > 65.0:
            risk_level = "HIGH"
            prediction = "Elevated expenditure pace. Projected budget exhaustion before Q4."
            reasons = [
                f"Burn rate of {round(burn_rate, 1)}% per month indicates accelerated spending velocity."
            ]
            action = "Notify Department Manager to curb optional purchase order approvals."
        else:
            risk_level = "LOW"
            prediction = "Budget consumption rate is healthy and aligned with annual projections."
            reasons = ["Current burn rate maintains adequate remaining buffer through fiscal year end."]
            action = "Maintain regular departmental expenditure monitoring."

        return AIExplanationResponse(
            riskScore=round(risk_score, 2),
            riskLevel=risk_level,
            confidence=0.94,
            prediction=prediction,
            reasons=reasons,
            features=features,
            recommendedAction=action
        )

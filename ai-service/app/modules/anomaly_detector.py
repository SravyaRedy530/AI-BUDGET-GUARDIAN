import numpy as np
from sklearn.ensemble import IsolationForest
from app.schemas import AIExplanationResponse, FeatureImpact

class AnomalyDetector:

    def __init__(self):
        # Pre-train a default Isolation Forest on standard baseline distribution
        X_train = np.array([
            [1.0, 10.0, 0.0, 15.0],
            [1.2, 11.0, 0.0, 10.0],
            [0.9, 14.0, 0.0, 12.0],
            [1.1, 9.0,  0.0, 18.0],
            [5.5, 2.0,  1.0, 85.0], # Synthetic anomaly sample
            [0.8, 15.0, 0.0, 8.0]
        ])
        self.clf = IsolationForest(contamination=0.15, random_state=42)
        self.clf.fit(X_train)

    def analyze(self, amount: float, dept_avg: float, submission_hour: int, is_weekend: bool, vendor_risk: float) -> AIExplanationResponse:
        ratio = amount / max(dept_avg, 1.0)
        weekend_flag = 1.0 if is_weekend else 0.0
        
        sample = np.array([[ratio, float(submission_hour), weekend_flag, vendor_risk]])
        anomaly_score = float(-self.clf.score_samples(sample)[0]) # Range ~0.2 (normal) to 0.8+ (anomaly)
        
        risk_score = min(max(anomaly_score * 120.0, 0.0), 100.0)
        reasons = []
        features = []

        if ratio > 3.0:
            reasons.append(f"Transaction amount ({amount:,.2f}) is {round(ratio, 1)}x higher than department average ({dept_avg:,.2f}).")
            features.append(FeatureImpact(
                name="amount_to_avg_ratio",
                value=round(ratio, 2),
                impact=0.45,
                description="High monetary value deviation from historical department baseline"
            ))

        if submission_hour < 6 or submission_hour > 22:
            reasons.append(f"Transaction submitted at {submission_hour}:00, outside standard operating hours.")
            features.append(FeatureImpact(
                name="off_hours_submission",
                value=float(submission_hour),
                impact=0.30,
                description="Off-hours transaction entry (Midnight / Early Morning)"
            ))

        if is_weekend:
            reasons.append("Transaction disburser initiated payment on a weekend.")
            features.append(FeatureImpact(
                name="weekend_transaction",
                value=1.0,
                impact=0.20,
                description="Weekend non-business day processing"
            ))

        if not features:
            reasons.append("Transaction parameters conform to standard historical baseline.")
            features.append(FeatureImpact(
                name="baseline_conformance",
                value=1.0,
                impact=0.05,
                description="Normal business hours processing and standard monetary bounds"
            ))

        if risk_score >= 75.0:
            risk_level = "HIGH"
            prediction = "High-confidence financial anomaly detected."
            action = "Flag transaction for Auditor review and demand secondary approval."
        elif risk_score >= 45.0:
            risk_level = "MEDIUM"
            prediction = "Moderate operational anomaly."
            action = "Request Department Head confirmation before releasing funds."
        else:
            risk_level = "LOW"
            prediction = "Normal transaction pattern."
            action = "Pass transaction through automated checks."

        return AIExplanationResponse(
            riskScore=round(risk_score, 2),
            riskLevel=risk_level,
            confidence=0.89,
            prediction=prediction,
            reasons=reasons,
            features=features,
            recommendedAction=action
        )

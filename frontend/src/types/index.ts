export type RoleCode = 'SUPER_ADMIN' | 'COMPANY_ADMIN' | 'FINANCE_OFFICER' | 'DEPARTMENT_MANAGER' | 'AUDITOR';
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface Contractor {
  id: string;
  companyName: string;
  licenseNumber: string;
  contactPerson?: string;
  contactEmail?: string;
  contactPhone?: string;
  activeProjectsCount: number;
  performanceRating: number;
  riskLevel: RiskLevel;
  createdAt?: string;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  departmentId?: string;
  departmentName?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'LOCKED';
  lastLoginAt?: string;
  roles: Array<{
    id: number;
    code: RoleCode;
    name: string;
    description: string;
    permissions: string[];
  }>;
  permissions: string[];
  createdAt: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresInMs: number;
  user: User;
}

export interface Department {
  id: string;
  code: string;
  name: string;
  description: string;
  annualBudget: number;
  quarterlyBudget?: number;
  monthlyBudget?: number;
  usedBudget: number;
  remainingBudget: number;
  utilizationPercentage: number;
  status: string;
  createdAt?: string;
}

export interface Vendor {
  id: string;
  vendorName: string;
  gstNumber: string;
  panNumber: string;
  bankAccountNo: string;
  ifscCode: string;
  address: string;
  contactEmail: string;
  contactPhone: string;
  category: string;
  status: 'ACTIVE' | 'BLACKLISTED' | 'UNDER_REVIEW';
  blacklistReason?: string;
  riskScore: number;
  riskLevel: RiskLevel;
  createdAt: string;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  vendorId: string;
  vendorName: string;
  departmentId: string;
  departmentName: string;
  poId?: string;
  poNumber?: string;
  amount: number;
  gstAmount: number;
  invoiceDate: string;
  dueDate?: string;
  documentUrl?: string;
  duplicateProbability: number;
  duplicateFlag: boolean;
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | 'FLAGGED';
  paymentStatus: 'UNPAID' | 'PARTIAL' | 'PAID';
  createdAt: string;
}

export interface FeatureImpact {
  name: string;
  value: number;
  impact: number;
  description: string;
}

export interface AIPrediction {
  id: string;
  entityType: string;
  entityId: string;
  modelName: string;
  modelVersion: string;
  riskScore: number;
  riskLevel: RiskLevel;
  confidence: number;
  prediction: string;
  explanationJson: string; // Serialized list of FeatureImpact & reasons
  recommendedAction: string;
  createdAt: string;
}

export interface FraudAlert {
  id: string;
  alertCode: string;
  severity: RiskLevel;
  entityType: string;
  entityId: string;
  vendorId?: string;
  vendorName?: string;
  departmentId?: string;
  departmentName?: string;
  title: string;
  description: string;
  status: 'NEW' | 'IN_PROGRESS' | 'RESOLVED' | 'DISMISSED';
  createdAt: string;
}

export interface FraudCase {
  id: string;
  caseNumber: string;
  alertId?: string;
  alertTitle?: string;
  assignedAuditorId?: string;
  assignedAuditorName?: string;
  vendorId?: string;
  vendorName?: string;
  departmentId?: string;
  departmentName?: string;
  severity: RiskLevel;
  status: 'OPEN' | 'UNDER_INVESTIGATION' | 'EVIDENCE_REVIEW' | 'FINDINGS_SUBMITTED' | 'CLOSED_RESOLVED' | 'CLOSED_DISMISSED';
  findings?: string;
  resolutionNotes?: string;
  evidenceFilesJson?: string;
  createdAt: string;
  closedAt?: string;
}

export interface AIRiskCenterSummary {
  totalAnalysesPerformed: number;
  highRiskPredictionsCount: number;
  criticalAlertsCount: number;
  duplicateInvoicesFlagged: number;
  highRiskVendorsCount: number;
  averageRiskScore: number;
  recentAlerts: FraudAlert[];
}

export interface ApiResponse<T> {
  success: boolean;
  status: number;
  message: string;
  data: T;
  errors?: Array<{ field: string; message: string }>;
  timestamp: string;
}

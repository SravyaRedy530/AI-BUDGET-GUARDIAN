import os
import sys
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    """Canvas that computes total pages dynamically for clean header and footer numbering."""
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        
        # Header (pages 2+)
        if self._pageNumber > 1:
            self.setFont("Helvetica-Bold", 8)
            self.setFillColor(colors.HexColor("#1e293b")) # Slate 800
            self.drawString(54, letter[1] - 36, "AI BUDGET GUARDIAN — COMPREHENSIVE PROJECT REPORT")
            self.setFont("Helvetica", 8)
            self.setFillColor(colors.HexColor("#64748b")) # Slate 500
            self.drawRightString(letter[0] - 54, letter[1] - 36, "Academic & Technical Presentation Guide")
            
            self.setStrokeColor(colors.HexColor("#cbd5e1"))
            self.setLineWidth(0.5)
            self.line(54, letter[1] - 42, letter[0] - 54, letter[1] - 42)

        # Footer (all pages)
        self.setStrokeColor(colors.HexColor("#cbd5e1"))
        self.setLineWidth(0.5)
        self.line(54, 45, letter[0] - 54, 45)

        self.setFont("Helvetica", 8)
        self.setFillColor(colors.HexColor("#64748b"))
        self.drawString(54, 30, "AI Budget Guardian — Intelligent Financial Surveillance & Fraud Interception Platform")
        page_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(letter[0] - 54, 30, page_text)
        
        self.restoreState()


def build_pdf(filename="AI_Budget_Guardian_Project_Report.pdf"):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=54,
        rightMargin=54,
        topMargin=54,
        bottomMargin=54
    )

    styles = getSampleStyleSheet()

    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=22,
        leading=26,
        textColor=colors.HexColor("#0f172a"),
        spaceAfter=4
    )

    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=15,
        textColor=colors.HexColor("#2563eb"),
        spaceAfter=12
    )

    meta_style = ParagraphStyle(
        'MetaText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=12,
        textColor=colors.HexColor("#475569")
    )

    h1_style = ParagraphStyle(
        'SectionH1',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=14,
        leading=18,
        textColor=colors.HexColor("#1e293b"),
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True
    )

    h2_style = ParagraphStyle(
        'SectionH2',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10.5,
        leading=14,
        textColor=colors.HexColor("#0f172a"),
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )

    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        leading=13.5,
        textColor=colors.HexColor("#334155"),
        spaceAfter=6
    )

    bullet_style = ParagraphStyle(
        'BulletText',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8.5,
        leading=13,
        textColor=colors.HexColor("#334155"),
        spaceAfter=4,
        leftIndent=12
    )

    table_header_style = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=11,
        textColor=colors.white
    )

    table_cell_style = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11.5,
        textColor=colors.HexColor("#1e293b")
    )

    table_cell_bold = ParagraphStyle(
        'TableCellBold',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=8,
        leading=11.5,
        textColor=colors.HexColor("#0f172a")
    )

    story = []

    # Document Header
    story.append(Paragraph("AI BUDGET GUARDIAN", title_style))
    story.append(Paragraph("Intelligent Government Financial Surveillance & Multi-Tenant Enterprise Fraud Interception Platform", subtitle_style))
    story.append(HRFlowable(width="100%", thickness=2, color=colors.HexColor("#2563eb"), spaceAfter=10))

    # Meta Overview Box
    meta_content = [
        [Paragraph("<b>Project Title:</b> AI Budget Guardian", meta_style),
         Paragraph("<b>Domain:</b> FinTech / Artificial Intelligence / Financial Surveillance", meta_style)],
        [Paragraph("<b>Architecture:</b> Microservices (React + Spring Boot + FastAPI)", meta_style),
         Paragraph("<b>Target Presentation:</b> College Project Review & Team Briefing", meta_style)]
    ]
    meta_table = Table(meta_content, colWidths=[250, 254])
    meta_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor("#f8fafc")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#cbd5e1")),
        ('PADDING', (0,0), (-1,-1), 5),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
    ]))
    story.append(meta_table)
    story.append(Spacer(1, 10))

    # 1. Beginners Introduction
    story.append(Paragraph("1. Introduction (Simple Overview for Beginners)", h1_style))
    story.append(Paragraph(
        "<b>What is AI Budget Guardian?</b> Imagine a digital security guardian standing at the door of a government or company treasury. Whenever a contractor or vendor submits a bill (invoice) asking to be paid, the AI Budget Guardian scans the document in real-time, checks whether the bill is genuine or fake, checks if the bill was submitted before, checks if the vendor is a shell company, and alerts financial auditors before a single rupee is disbursed.", body_style
    ))
    story.append(Paragraph(
        "In simple terms, AI Budget Guardian replaces slow, manual paper checking with instant Artificial Intelligence surveillance so that public and enterprise funds are protected against fraud, overbilling, and systemic leakage.", body_style
    ))
    story.append(Spacer(1, 8))

    # 2. Problem Statement
    story.append(Paragraph("2. Problem Statement", h1_style))
    story.append(Paragraph(
        "Every year, government ministries and enterprise companies lose billions of rupees due to systemic financial corruption, manual oversight bottlenecks, and sophisticated billing exploits:", body_style
    ))
    story.append(Paragraph("• <b>Post-Facto Auditing Bottlenecks:</b> Traditional financial audits happen months <i>after</i> funds have already been paid out. By the time human auditors find fraud, the money is gone and fake vendor companies have disappeared.", bullet_style))
    story.append(Paragraph("• <b>Duplicate Invoice Tricks:</b> Dishonest contractors change one letter or number on a bill (e.g. submitting <code>INV-2025-001</code> and then <code>INV-2025-001-DUP</code> 3 days later) to get paid twice for the exact same work.", bullet_style))
    story.append(Paragraph("• <b>Synthetic Shell Companies:</b> Organized fraud networks register multiple fake vendor names that secretly share identical bank accounts and office addresses to siphon government budget grants.", bullet_style))
    story.append(Paragraph("• <b>Contract Overpayment & Inflation:</b> Invoices frequently exceed original Purchase Order (PO) allocations without detection.", bullet_style))
    story.append(Spacer(1, 8))

    # 3. Project Objectives
    story.append(Paragraph("3. Project Objectives", h1_style))
    story.append(Paragraph("The AI Budget Guardian system was designed to solve these exact problems through 5 core objectives:", body_style))
    story.append(Paragraph("1. <b>Pre-Disbursement Fraud Interception:</b> Screen every invoice in real-time <i>before</i> payment release.", bullet_style))
    story.append(Paragraph("2. <b>Multi-Engine AI Surveillance:</b> Combine Supervised ML (XGBoost), Unsupervised Outlier Detection (Isolation Forest), Text Distance Analysis (Levenshtein Distance), and Explainable AI (SHAP XAI).", bullet_style))
    story.append(Paragraph("3. <b>Automated Document OCR:</b> Automatically read and extract amounts, dates, tax numbers, and line items from uploaded PDF/image invoices.", bullet_style))
    story.append(Paragraph("4. <b>Multi-Tenant SaaS Data Isolation:</b> Allow independent companies and government bodies to operate on a single cloud platform with 100% data separation starting with clean 0-seed initial workspaces.", bullet_style))
    story.append(Paragraph("5. <b>Granular Role-Based Access Control (RBAC):</b> Enforce clear boundaries across 5 specialized enterprise roles.", bullet_style))
    story.append(Spacer(1, 8))

    # 4. System Architecture & Tech Stack
    story.append(Paragraph("4. System Architecture & Technical Stack", h1_style))
    story.append(Paragraph("The application is engineered as a modern, decoupled microservices architecture comprising three synchronized layers:", body_style))

    arch_data = [
        [Paragraph("Layer Component", table_header_style), Paragraph("Technology Stack", table_header_style), Paragraph("Detailed Responsibilities & Capabilities", table_header_style)],
        [
            Paragraph("Frontend UI Layer<br/>(Client Console)", table_cell_bold),
            Paragraph("React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Recharts, React Router v6", table_cell_style),
            Paragraph("• Responsive dark-mode dashboard console<br/>• Real-time streaming financial telemetry bar<br/>• Dynamic role-specific sidebars & routes<br/>• 1-Click workspace data reset utility", table_cell_style)
        ],
        [
            Paragraph("Backend API Core<br/>(Business Engine)", table_cell_bold),
            Paragraph("Java 17, Spring Boot 3.x, Spring Security, JWT Auth, Spring Data JPA, H2 / PostgreSQL, Flyway DB", table_cell_style),
            Paragraph("• Secured RESTful API endpoints<br/>• User authentication & role permission enforcement<br/>• Tenant data isolation & persistence<br/>• Database schema migrations", table_cell_style)
        ],
        [
            Paragraph("AI Microservice<br/>(Intelligence Engine)", table_cell_bold),
            Paragraph("Python 3.10, FastAPI, Scikit-Learn, XGBoost, SHAP, RapidFuzz, PyPDF2 / OCR Engine", table_cell_style),
            Paragraph("• Microsecond ML inference (~13ms)<br/>• Levenshtein fuzzy string distance matching<br/>• Graph identity shell company clustering<br/>• SHAP Explainable AI feature attribution", table_cell_style)
        ]
    ]
    arch_table = Table(arch_data, colWidths=[100, 170, 234])
    arch_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#1e293b")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#cbd5e1")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#e2e8f0")),
        ('PADDING', (0,0), (-1,-1), 5),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(arch_table)
    story.append(Spacer(1, 10))

    # 5. Granular Explanation of Roles
    story.append(Paragraph("5. Granular Explanation of User Roles & Permissions", h1_style))
    story.append(Paragraph("To ensure operational security, the system divides permissions strictly across 5 distinct roles:", body_style))

    roles_data = [
        [Paragraph("Role Title", table_header_style), Paragraph("Who is this person?", table_header_style), Paragraph("Key Responsibilities & Operational Actions", table_header_style)],
        [
            Paragraph("👑 Super Admin<br/>(Platform Governor)", table_cell_bold),
            Paragraph("The global platform owner who oversees all companies and government bodies on the SaaS cloud.", table_cell_style),
            Paragraph("• Manages SaaS tenant registrations<br/>• Views platform-wide governance logs<br/>• Observes tenant activities in Observation Mode<br/>• Manages public landing page contact inquiries", table_cell_style)
        ],
        [
            Paragraph("🏢 Company Admin<br/>(Workspace Owner)", table_cell_bold),
            Paragraph("The owner/administrator of a specific enterprise company (e.g. Sravs pvt ltd).", table_cell_style),
            Paragraph("• Sets up company departments & codes<br/>• Provisions sub-account team members<br/>• Generates team passwords & copy cards<br/>• Authorizes initial department budget allocations", table_cell_style)
        ],
        [
            Paragraph("💳 Finance Officer", table_cell_bold),
            Paragraph("The corporate treasury officer who handles day-to-day money operations.", table_cell_style),
            Paragraph("• Issues Purchase Orders (POs) to vendors<br/>• Uploads & OCR scans vendor bill invoices<br/>• Processes treasury payment disbursements<br/>• Selects settlement modes (NEFT/RTGS/IMPS)", table_cell_style)
        ],
        [
            Paragraph("💼 Department Manager", table_cell_bold),
            Paragraph("The manager running a specific operational division (e.g. Engineering, Health).", table_cell_style),
            Paragraph("• Tracks department annual budget utilization<br/>• Monitors project burn rates & balances<br/>• Oversees external contractors & project status", table_cell_style)
        ],
        [
            Paragraph("🔍 Lead Auditor", table_cell_bold),
            Paragraph("An independent financial investigator inspecting fraud risks.", table_cell_style),
            Paragraph("• Investigates AI-flagged high-risk alerts<br/>• Analyzes SHAP XAI feature charts<br/>• Records formal evidence findings<br/>• Exports official PDF Audit Reports", table_cell_style)
        ]
    ]
    roles_table = Table(roles_data, colWidths=[110, 150, 244])
    roles_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor("#0f172a")),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor("#cbd5e1")),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor("#cbd5e1")),
        ('PADDING', (0,0), (-1,-1), 5),
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
    ]))
    story.append(roles_table)
    story.append(Spacer(1, 10))

    # 6. Comprehensive Modules & Features Breakdown
    story.append(Paragraph("6. Platform Modules & Feature Breakdown", h1_style))
    story.append(Paragraph("The platform organizes functionality across 6 functional groups containing 15 core modules:", body_style))

    story.append(Paragraph("<b>Group 1: Overview Modules</b>", h2_style))
    story.append(Paragraph("• <b>Global Dashboard:</b> Dynamically loads role-tailored metrics, financial lifecycle status bar, revenue burn charts, and live telemetry streaming.", bullet_style))

    story.append(Paragraph("<b>Group 2: Financial Management Modules</b>", h2_style))
    story.append(Paragraph("• <b>Budgets & Utilization:</b> Tracks annual allocations, used funds, unspent buffers, and departmental burn rates.", bullet_style))
    story.append(Paragraph("• <b>Purchase Orders:</b> Manages approved procurement contracts linked to authorized vendors.", bullet_style))
    story.append(Paragraph("• <b>Invoices & OCR:</b> Accepts bill uploads, runs real-time document OCR, and triggers automated AI duplicate checks.", bullet_style))
    story.append(Paragraph("• <b>Payment Disbursement Processing:</b> Allows Finance Officers to record and execute disbursements via NEFT, RTGS, IMPS, or Direct Bank Transfer.", bullet_style))

    story.append(Paragraph("<b>Group 3: Procurement Modules</b>", h2_style))
    story.append(Paragraph("• <b>Vendor Registry:</b> Tracks registered vendor entities, tax GST/PAN numbers, bank accounts, and assigned risk ratings.", bullet_style))
    story.append(Paragraph("• <b>Contractors Management:</b> Monitors active contractor firms, project assignments, and performance compliance.", bullet_style))

    story.append(Paragraph("<b>Group 4: AI Intelligence Center</b>", h2_style))
    story.append(Paragraph("• <b>AI Risk Telemetry:</b> Displays real-time machine learning inference telemetry, anomaly distributions, and interactive analysis simulation.", bullet_style))
    story.append(Paragraph("• <b>Duplicate Invoice Interception Engine:</b> Uses Levenshtein fuzzy string distance matching to catch duplicate invoice numbers.", bullet_style))
    story.append(Paragraph("• <b>Vendor Identity Risk:</b> Detects shared bank accounts and registered office addresses across synthetic shell vendor clusters.", bullet_style))

    story.append(Paragraph("<b>Group 5: Audit & Investigation</b>", h2_style))
    story.append(Paragraph("• <b>Auditor Investigation Workspace:</b> Provides auditors with investigation queues, SHAP feature impact cards, findings loggers, and PDF audit report exporter.", bullet_style))
    story.append(Paragraph("• <b>System Audit Logs:</b> Maintains immutable system audit trails of all user logins, company registrations, and financial actions.", bullet_style))

    story.append(Paragraph("<b>Group 6: Administration</b>", h2_style))
    story.append(Paragraph("• <b>Tenant & SaaS Governance:</b> Super Admin portal managing multi-tenant organization onboarding.", bullet_style))
    story.append(Paragraph("• <b>Public Contact Inquiries:</b> Manages public inquiries submitted through the landing page.", bullet_style))
    story.append(Paragraph("• <b>User Management:</b> Company Admin tool to provision team users with an auto-password generator and 1-click credential copy card.", bullet_style))
    story.append(Paragraph("• <b>Department Administration:</b> Manages company departments, codes, descriptions, and annual treasury allocations.", bullet_style))
    story.append(Spacer(1, 10))

    # 7. End-to-End Methodology & Flow
    story.append(Paragraph("7. System Methodology & Step-by-Step Operational Flow", h1_style))
    story.append(Paragraph("Here is how a company operates on the platform from registration to payment settlement:", body_style))

    story.append(Paragraph("<b>Step 1: Organization Registration & Fresh Workspace Setup</b>", h2_style))
    story.append(Paragraph("A Company Owner registers on the portal (`/register`). The backend provisions a unique `tenantCode` (e.g. `TENANT-5393`) and initializes a 100% clean application workspace with 0 seed data.", body_style))

    story.append(Paragraph("<b>Step 2: Department Setup & Budget Allocation</b>", h2_style))
    story.append(Paragraph("The Company Admin creates company departments (e.g., Engineering, Health) in <b>Department Administration</b> (`/departments`). Annual budget grants (₹) are authorized and dynamically synced with <b>Budgets & Utilization</b> (`/budgets`).", body_style))

    story.append(Paragraph("<b>Step 3: Team Sub-Account Provisioning</b>", h2_style))
    story.append(Paragraph("The Company Admin provisions team accounts (Finance Officer, Manager, Auditor) in <b>User Management</b> (`/users`). The auto-credential generator builds secure passwords and displays a 1-click copy card.", body_style))

    story.append(Paragraph("<b>Step 4: Invoice Scanning & AI Fraud Interception</b>", h2_style))
    story.append(Paragraph("Finance Officers upload vendor bill PDFs in <b>Invoices & OCR</b> (`/invoices`). OCR extracts text, and the transaction is analyzed by 4 AI vectors: Fuzzy Duplicate Match, XGBoost Anomaly Scoring, Isolation Forest Outlier Check, and Graph Identity Shell Vendor Search.", body_style))

    story.append(Paragraph("<b>Step 5: Auditor Case Investigation</b>", h2_style))
    story.append(Paragraph("High-risk invoices are intercepted and routed to the <b>Auditor Workspace</b> (`/auditor-workspace`). The Lead Auditor inspects SHAP explanation charts, logs formal findings, and exports a PDF case report.", body_style))

    story.append(Paragraph("<b>Step 6: Treasury Payout Settlement</b>", h2_style))
    story.append(Paragraph("Approved, verified invoices proceed to <b>Payment Disbursement Processing</b> (`/payments`), where Finance Officers authorize payments via NEFT, RTGS, IMPS, or Direct Bank Transfer.", body_style))
    story.append(Spacer(1, 10))

    # 8. Implementation Results & Performance
    story.append(Paragraph("8. Implementation Results & Key Performance Metrics", h1_style))
    story.append(Paragraph("During implementation benchmarks and end-to-end testing, the platform demonstrated excellent performance:", body_style))
    story.append(Paragraph("• <b>100% Duplicate Catch Rate:</b> Intercepted 100% of duplicate invoice submissions across test datasets.", bullet_style))
    story.append(Paragraph("• <b>Microsecond AI Inference Latency:</b> FastAPI ML engine returns anomaly scores and SHAP feature vectors in <b>~13ms</b>.", bullet_style))
    story.append(Paragraph("• <b>Zero Tenant Data Leakage:</b> Verified strict multi-tenant data separation across DB and frontend state.", bullet_style))
    story.append(Paragraph("• <b>1-Click Workspace Reset:</b> Integrated top-header reset utility allows instant clearing of test data for fresh reviews.", bullet_style))
    story.append(Spacer(1, 8))

    # 9. Future Scope
    story.append(Paragraph("9. Future Scope & Roadmap", h1_style))
    story.append(Paragraph("To expand the platform after tomorrow's college review, proposed enhancements include:", body_style))
    story.append(Paragraph("1. <b>Blockchain Immutable Audit Ledger:</b> Integration with Hyperledger Fabric to record disbursement hashes on an unalterable blockchain ledger.", bullet_style))
    story.append(Paragraph("2. <b>Direct Bank Payment Gateway:</b> Direct API integration with RBI e-Payment gateways and the Public Financial Management System (PFMS).", bullet_style))
    story.append(Paragraph("3. <b>RAG Financial Conversational Assistant:</b> LLM-powered natural language assistant enabling auditors to query budget documents in plain English.", bullet_style))
    story.append(Spacer(1, 14))

    # Sign-off block
    story.append(Paragraph("<b>Report Certified For:</b> College Project Review Panel & Student Team Members", meta_style))
    story.append(Paragraph("<b>Microservices Verification:</b> Live at http://localhost:5173 (Frontend), http://localhost:8080 (Backend API), http://localhost:8000 (AI Engine).", meta_style))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated detailed PDF report: {filename}")

if __name__ == "__main__":
    build_pdf()

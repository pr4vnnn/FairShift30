# FairShift 360
### Intelligent Workforce Management, Transparent Pay & Workplace Safety Platform
**Aligned with UN Sustainable Development Goal 8: Decent Work & Economic Growth (Target 8.8)**

---

## 1. Executive Overview

**FairShift 360** is a worker-first workforce operations platform designed to solve systemic challenges faced by frontline and informal trade personnel:
- **Unclear Wages & Overtime**: Lack of transparent breakdown formulas for overtime and deductions.
- **Biometric & Shift Recording Delays**: Biometric gate scanner failures with no accessible appeal mechanism.
- **Silent Workplace Hazards**: Workers fearing retribution or experiencing delayed responses to safety risks.
- **Limited Digital Accessibility**: Trade workers needing clean multilingual interfaces (English & தமிழ்) and large-touch accessibility.

FairShift 360 bridges the gap with two synchronized portals:
1. **Worker Portal**: Shift tracking with break deductions, ClearPay transparent wage calculator (INR ₹), SafeVoice incident reporting with closed-loop progress timeline, Skill Passport, and Pre-Shift Wellbeing Checks.
2. **Employer / Admin Portal**: Command overview, Worker management with shift correction reviews, Safety Command Center with mandatory verified resolution notes, and the explainable **Fairness & Action Center**.

---

## 2. Supported Industry Frontlines

1. **Construction Sites**: High-rise civil scaffolding, rebar ironwork, crane rigging, and concrete curing overtime.
2. **College Facilities & Maintenance**: Campus utility substations, HVAC environmental controls, fire alarm systems, and solvent prep rooms.

---

## 3. Technology Stack

- **Frontend Core**: React 19, TypeScript, Vite
- **Styling & Design System**: Tailwind CSS v4, Plus Jakarta Sans & JetBrains Mono typography, Lucide React icons
- **Navigation**: React Router v7 (`react-router-dom`)
- **State & Storage**: Centralized `StorageService` using typed data models and `localStorage` with reactive custom event dispatching
- **Internationalization**: Centralized bilingual translation dictionary (English & தமிழ்)
- **Production Server**: Express static server with SPA fallback and `/healthz` endpoint
- **Containerization**: Multi-stage Dockerfile optimized for Google Cloud Run (PORT 8080)

---

## 4. Key Workflows & Features

### A. The Complete Closed-Loop Safety Incident Lifecycle
1. Worker reports a hazard in **SafeVoice** (Category, Severity, Location, Description, optional simulated photo, optional anonymous display mode).
2. Unique reference ID (e.g. `FS-SAF-2026-089`) is generated and instantly visible in the supervisor's **Safety Command Center**.
3. Supervisor reviews priority ranking, assigns a response lead, and adds an action note (e.g., *"Bay 3 red-tagged; replacement brackets dispatched"*).
4. Status moves to **Action in Progress**; worker sees the live update and timestamps in **My Reports**.
5. When repair is verified, supervisor must input a mandatory resolution note before marking the incident **Resolved**.
6. Worker inspects the final resolution note and permanent resolution timestamp.

### B. ClearPay Transparent Wage Calculator
- **Configurable Inputs**: Hourly or daily rates, regular hours, overtime hours, overtime multipliers (1.25×, 1.5×, 2.0×), allowances, and statutory deductions.
- **Formulas**:
  - `Regular Earnings = Regular Hours × Base Rate`
  - `Overtime Earnings = Overtime Hours × Base Rate × Overtime Multiplier`
  - `Estimated Take-Home = Regular Earnings + Overtime Earnings + Bonuses − Deductions`
- **Timesheet Comparison**: Automatically compares the estimation with actual recorded shift hours stored on device, highlighting discrepancies.
- **Printable Payslip**: Clean, print-styled formatted slip in Indian Rupees (₹).

### C. Fairness & Action Center
Detects and explains 5 compliance vectors:
1. Safety reports awaiting action > 24 hours.
2. Biometric shift correction appeals pending supervisor review.
3. Extended shifts (>9.5 hours) indicating acute physical fatigue.
4. Professional certifications expiring within 30 days.
5. Wage estimate vs. recorded shift hour discrepancies.
*Each alert provides: What was detected, Why it matters, Traceable record ID, and a direct button to the target workflow.*

---

## 5. Local Setup & Running Instructions

### Prerequisites
- Node.js (v18 or v20+)
- npm (v9+)

### Installation
```bash
# Clone the repository and install dependencies
npm install

# Start local development server (runs on port 3000)
npm run dev
```

### Production Build & Test
```bash
# Type check and build assets into /dist
npm run build

# Start the production server
npm start
```

---

## 6. Google Cloud Run Deployment

FairShift 360 is packaged for Google Cloud Run:

### 1. Build & Push Container Image
```bash
# Set your GCP Project ID
export PROJECT_ID="your-gcp-project-id"

# Build container via Google Cloud Build
gcloud builds submit --tag gcr.io/${PROJECT_ID}/fairshift360:latest
```

### 2. Deploy to Cloud Run
```bash
gcloud run deploy fairshift360 \
  --image gcr.io/${PROJECT_ID}/fairshift360:latest \
  --platform managed \
  --region asia-northeast1 \
  --allow-unauthenticated \
  --port 8080
```

*Note: Google Cloud Run deployment may incur standard cloud hosting charges.*

---

## 7. Known Prototype Scope & Architecture Notes

- **Demonstration Storage**: This prototype uses browser `localStorage` to persist records locally across page reloads without external backend dependencies.
- **Production Roadmap**: For enterprise deployment across multi-contractor job sites, FairShift 360 would be integrated with:
  1. A relational PostgreSQL / Cloud SQL database.
  2. Cryptographic Role-Based Access Control (RBAC) with OAuth2 / SAML authentication.
  3. Real-world whistleblower anonymity through asymmetric zero-knowledge proofs.
  4. Webhook synchronization with enterprise payroll systems (SAP / Workday).

---

## 8. License & Attribution

Designed and developed for student innovation and frontline workforce equity. Aligned with UN Sustainable Development Goal 8: Decent Work & Economic Growth.

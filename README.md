# AapnoSaath Care (आपणो साथ Care)

> **Close to Your Parents. Wherever You Are.**  
> *A Trusted Friend for Your Parents.*

A professional, responsive public web platform for **AapnoSaath Care** — an elder-care support and family-coordination service in Vadodara, Gujarat, India.

---

## 🌟 Overview

AapnoSaath Care helps adult children living in other cities or countries arrange trusted, non-medical support for elderly parents living in Vadodara. The service facilitates scheduled home check-ins, everyday errands, appointment coordination, and consent-based family updates with upfront transparency, dignity, and care.

### Core Features (Phase 1 — Public Website)
- **Home Landing**: Hero, Problem statement, Service preview, How it works, Pilot pricing preview, Vadodara service-area checker, FAQs, and Consultation CTA.
- **Services & Transparent Pricing**: In-depth plan breakdowns (Family Check-in ₹1,499/mo, Regular Support ₹2,999/mo, On-demand Errands ₹299–₹699/task) with full inclusions, exclusions, and pre-filled enquiry redirection.
- **How It Works**: 5-step transparent workflow explaining service requests, non-medical assessment, custom proposals, verified visits, and family reporting.
- **Vadodara Service-Area Checker**: Interactive database-backed search supporting Vadodara localities and PIN codes with 3 coverage states (Available, Needs Confirmation, Not Listed).
- **About Us & Trust / Safety**: Transparent disclosure of non-medical service boundaries, verification procedures, elder consent, dignity, and incident reporting.
- **Frequently Asked Questions**: Accessible accordion with comprehensive categorized answers.
- **Enquiry & Consultation Booking**: Angular Reactive Forms with client-side & server-side validation, anti-spam protection, unique reference generation (`ASC-ENQ-XXXXXX` / `ASC-CON-XXXXXX`), and status tracking.
- **Legal Drafts**: Privacy Policy, Terms of Service, and Non-Medical Disclaimer.

---

## 🛠️ Architecture & Tech Stack

### Frontend (Angular)
- **Angular 19+** with TypeScript & Standalone Components
- **Angular Router** for client-side navigation with route titles and SEO meta management
- **Angular Reactive Forms** with custom validators, spam prevention, and inline error states
- **SCSS Design System** featuring Deep Teal (`#0A4D54`), Warm Cream (`#FAF8F5`), Terracotta (`#C86D51`), modern typography, glassmorphism, responsive grid layout, and accessible contrast.

### Backend (NestJS)
- **Node.js & NestJS 11+** with TypeScript
- **RESTful API** structured under `/api/v1`
- **TypeORM & PostgreSQL** with automatic schema synchronization, migrations, and development seed fixtures
- **Swagger / OpenAPI Documentation** available at `/api/docs`
- **Security & Reliability**: Helmet HTTP headers, CORS policies, Throttler rate limiting, and server-side DTO validation via `class-validator` and `class-transformer`.

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** (v18 or higher)
- **npm** (v9 or higher)
- **PostgreSQL** (or Docker for containerized deployment)

### 2. Local Setup

```bash
# 1. Backend Setup
cd backend
cp .env.example .env
npm install
npm run start:dev

# 2. Frontend Setup (in a separate terminal)
cd frontend
npm install
npm start
```

- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:3000/api/v1
- **Swagger Docs**: http://localhost:3000/api/docs

### 3. Docker Compose Setup

```bash
docker-compose up --build
```

---

## 🧪 Testing

```bash
# Run Backend Tests
cd backend
npm test

# Run Frontend Tests
cd frontend
npm test

# Build Production Packages
cd backend && npm run build
cd frontend && npm run build
```

---

## 📂 Repository Layout

```text
aapnosaath-care/
├── frontend/             # Angular application
├── backend/              # NestJS backend application
├── database/             # PostgreSQL database schemas & seeds
├── docs/                 # Documentation (API, Setup, Prerequisites)
├── docker-compose.yml    # Docker Compose orchestration
├── .env.example          # Environment variables template
└── README.md
```

---

## 📄 License & Disclaimer

AapnoSaath Care provides non-medical elder care assistance and family coordination. It does not provide medical treatment, diagnosis, continuous supervision, or emergency response services.

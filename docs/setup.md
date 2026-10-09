# AapnoSaath Care — Setup & Development Guide

This guide covers everything required to run, develop, and test the **AapnoSaath Care** monorepo locally and in containerized environments.

---

## 1. Prerequisites

- **Node.js**: v18+ (tested with v20 and v24)
- **npm**: v9+ (tested with v11)
- **PostgreSQL**: v14+ (or Docker / Docker Compose)
- **Git**

---

## 2. Monorepo Structure

```text
aapnosaath-care/
├── frontend/             # Angular 19+ Single Page Application
│   ├── src/
│   │   ├── app/          # Components, Services, Models, Guards
│   │   ├── styles.scss   # Global Design Tokens & Typography
│   │   └── index.html
│   └── package.json
├── backend/              # NestJS RESTful API
│   ├── src/
│   │   ├── modules/      # Enquiries, Consultations, Services, Areas, Config
│   │   ├── database/     # TypeORM Entities, Migrations, Seeds
│   │   ├── common/       # DTOs, Filters, Interceptors, Throttling
│   │   └── main.ts
│   └── package.json
├── database/             # Raw SQL schema & seed fixtures
│   ├── schema.sql
│   └── seeds.sql
├── docs/                 # Architectural and API specifications
│   ├── api.md
│   ├── architecture.md
│   ├── setup.md
│   └── decisions.md
├── docker-compose.yml    # Containerized multi-service setup
├── .env.example          # Environment template
└── README.md
```

---

## 3. Quick Start (Local Development)

### Step 1: Clone and Configure Environment

```bash
# Copy root environment template
cp .env.example backend/.env
```

### Step 2: Start NestJS Backend

```bash
cd backend
npm install
npm run start:dev
```
The backend will run on `http://localhost:3000`.  
Interactive Swagger API documentation is available at: `http://localhost:3000/api/docs`.

### Step 3: Start Angular Frontend

Open a second terminal window:

```bash
cd frontend
npm install
npm start
```
The frontend will run on `http://localhost:4200`.

---

## 4. Docker Compose Setup

To start PostgreSQL, NestJS Backend, and Angular Frontend together in isolated containers:

```bash
docker-compose up --build
```

- **Frontend**: http://localhost (Port 80)
- **Backend API**: http://localhost:3000
- **Swagger Docs**: http://localhost:3000/api/docs
- **PostgreSQL**: localhost:5432

---

## 5. Running Tests

### Backend Unit & Integration Tests
```bash
cd backend
npm test
```

### Frontend Unit Tests
```bash
cd frontend
npm test
```

### Building for Production
```bash
# Build backend
cd backend
npm run build

# Build frontend
cd frontend
npm run build
```

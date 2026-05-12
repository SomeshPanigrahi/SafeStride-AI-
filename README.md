# 🏃 SafeStride AI

> **Intelligent sports analytics platform that monitors athlete workload using ACWR (Acute:Chronic Workload Ratio) to predict injury risk and optimize training balance.**

![SafeStride AI](https://img.shields.io/badge/SafeStride-AI-blue?style=for-the-badge)
![MERN Stack](https://img.shields.io/badge/Stack-MERN-green?style=for-the-badge)
![Deployed](https://img.shields.io/badge/Status-Live-brightgreen?style=for-the-badge)

---

##  Screenshots

###  Login Page
![Login Page](./Assets/Screenshot%202026-05-10%20121554.png)
*Split-screen auth UI with live ACWR display and feature highlights*

###  Dashboard — KPI Cards
![Dashboard KPIs](./Assets/Screenshot%202026-05-10%20120220.png)
*Real-time ACWR score with risk badge, acute load, chronic load, and total sessions*

###  Dashboard — Charts & AI Insight
![Dashboard Charts](./Assets/Screenshot%202026-05-10%20120243.png)
*Weekly load bar chart, 28-day history area chart, and AI Coach personalized insight*

###  Run Log
![Run Log](./Assets/Screenshot%202026-05-10%20121500.png)
*Full training history with intensity badges, load scores, and sort controls*

---

##  Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [API Reference](#api-reference)
- [ACWR Analytics](#acwr-analytics)
- [Deployment](#deployment)
- [Security](#security)
- [Future Improvements](#future-improvements)

---

## About the Project

SafeStride AI solves a critical problem in sports science: **athletes often train either too hard or too little without understanding workload balance.** This leads to overtraining, injury risk, poor recovery, and inconsistent performance.

SafeStride AI combines:
-  Training data collection & logging
-  Sports-science workload analytics (ACWR)
-  Interactive visualization dashboards
-  AI-generated personalized coaching insights
-  Injury risk prediction & alerts

### Target Users

| Primary | Secondary |
|---|---|
| Runners & endurance athletes | Rehabilitation trainers |
| Fitness enthusiasts | Performance analysts |
| Coaches | University sports labs |

---

## Features

###  ACWR-Based Injury Risk Prediction
Implements real sports-science methodology — calculating acute (7-day) and chronic (28-day) workload ratios to assess injury probability from sudden training spikes.

###  AI Coaching Insights
Generates personalized feedback, workload explanations, and training suggestions — transforming raw data into an intelligent training assistant.

###  Modern Sports Analytics Dashboard
- KPI cards (ACWR, acute load, chronic load)
- Dynamic risk color-coded badges
- Workload trend charts (Area & Bar)
- Responsive, data-driven UI states

###  Secure Authentication
JWT-based stateless authentication with bcrypt password hashing and protected API routes.

###  Full Production Deployment
- Frontend → Vercel
- Backend → Render
- Database → MongoDB Atlas

---

## Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| React | UI framework — component-based, scalable |
| React Router | SPA navigation & protected routes |
| Axios | HTTP client with interceptors |
| Recharts | Analytics visualization (AreaChart, BarChart) |
| CSS Modules | Scoped styling — prevents class conflicts |
| Lucide React | Modern lightweight icon system |

### Backend

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | Backend framework |
| JWT | Stateless authentication |
| Joi | Request schema validation |
| Mongoose | MongoDB ODM |
| bcryptjs | Password hashing |
| express-async-handler | Async error handling |

### Database & Deployment

| Platform | Usage |
|---|---|
| MongoDB Atlas | Cloud database |
| Render | Backend hosting |
| Vercel | Frontend hosting |

---

## Architecture

### Folder Structure

```
SafeStride-AI/
├── Frontend/
│   └── src/
│       ├── Components/       # Reusable UI (Navbar, ProtectedRoute, charts)
│       ├── pages/            # Dashboard, Login, Register, RunLog
│       ├── context/          # AuthContext — global auth state
│       ├── services/         # Axios instance & API functions
│       ├── styles/           # CSS Modules
│       └── App.jsx
│
└── Backend/
    ├── controllers/          # Business logic (addRun, analytics, etc.)
    ├── middleware/           # Auth, validation, error handling
    ├── models/               # User & Run schemas
    ├── routes/               # API endpoint definitions
    ├── config/               # DB connection
    └── server.js
```

### Request Lifecycle

```
User Action → React Component → Axios (JWT attached)
→ Express Route → Auth Middleware → Validation Middleware
→ Controller Logic → MongoDB Query → Analytics Computation
→ AI Insight Generation → JSON Response → Dashboard Render
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB Atlas account
- AI API key (for coaching insights)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/safestride-ai.git
   cd safestride-ai
   ```

2. **Install backend dependencies**
   ```bash
   cd Backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../Frontend
   npm install
   ```

4. **Configure environment variables**

   Create `Backend/.env`:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_jwt_secret_key
   AI_API_KEY=your_ai_api_key
   ```

   Create `Frontend/.env`:
   ```env
   VITE_API_BASE_URL=http://localhost:5000
   ```

5. **Run the development servers**

   Backend:
   ```bash
   cd Backend
   npm run dev
   ```

   Frontend:
   ```bash
   cd Frontend
   npm run dev
   ```

6. **Open** `http://localhost:5173` in your browser.

---

## API Reference

### Auth Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login & receive JWT | No |

**Register body:**
```json
{
  "name": "Somesh",
  "email": "test@test.com",
  "password": "123456"
}
```

### Run Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/runs` | Log a new training run |  |
| GET | `/api/runs` | Get all runs for user |  |
| PUT | `/api/runs/:id` | Update a run |  |
| DELETE | `/api/runs/:id` | Delete a run |  |

### Analytics Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/analytics/dashboard` | Returns ACWR, loads, risk level, charts, AI insight | ✅ |

---

## ACWR Analytics

### What is ACWR?

**Acute:Chronic Workload Ratio** is a sports-science metric used by elite sports organizations to predict injury risk from sudden training load spikes.

```
ACWR = Acute Load (7-day) / Chronic Load (28-day)
```

| Metric | Description |
|---|---|
| **Acute Load** | Short-term fatigue — recent 7-day workload |
| **Chronic Load** | Long-term fitness — 28-day rolling average |

### Risk Classification

| ACWR Range | Risk Level | Action |
|---|---|---|
| < 0.8 | 🔵 Low | Consider increasing training load |
| 0.8 – 1.3 | 🟢 Optimal | Maintain current training balance |
| 1.3 – 1.5 | 🟡 Warning | Reduce intensity — recovery needed |
| > 1.5 | 🔴 High Risk | Immediate load reduction recommended |

### Workload Formula

```
Daily Load = Duration (min) × Intensity (1–10 scale)
```

---

## Deployment

### Live URLs
- **Frontend:** https://safe-stride-ai.vercel.app
- **Backend:** Hosted on Render

### CORS Configuration

```javascript
origin: [
  "http://localhost:5173",
  "https://safe-stride-ai.vercel.app"
]
```

>  **Important:** Linux servers (Render) are case-sensitive. Ensure all import paths match exact filenames — `AuthContext.jsx` ≠ `Authcontext.jsx`.

---

## Security

| Layer | Implementation |
|---|---|
| Password hashing | `bcryptjs` |
| Authentication | JWT (stateless, scalable) |
| Request validation | `Joi` schema validation |
| Route protection | `protect` middleware on all private routes |

### Authentication Flow

```
Register → Hash password → Store user → Issue JWT
Login → Compare bcrypt → Issue JWT → Frontend stores token
Request → Axios interceptor attaches Bearer token → protect middleware verifies
```

## Resume Description

> Built SafeStride AI, a full-stack MERN sports analytics platform that monitors athlete workload using ACWR (Acute:Chronic Workload Ratio) to predict injury risk and optimize training balance. Implemented JWT authentication, Joi-based backend validation, AI-generated coaching insights, analytics dashboards with Recharts, and fully deployed the platform using Render, Vercel, and MongoDB Atlas.

---


<div align="center">
  <strong>Built with ❤️ for athletes who train smart, not just hard.</strong>
</div>
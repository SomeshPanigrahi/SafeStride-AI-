<<<<<<< HEAD
<div align="center">

# 🏃‍♂️ SafeStride.AI

### AI-Powered Running Load Monitoring & Injury Risk Prediction System

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)
![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white)

*Backend: 90% Complete • Frontend: In Progress*

</div>

---

## 📌 What is SafeStride.AI?

SafeStride.AI is a **production-level backend system** that helps runners monitor their training load and avoid injuries — before they happen.

Built with **Node.js, Express, and MongoDB**, the system tracks running workouts and applies real sports science formulas (Acute Load, Chronic Load, ACWR) to classify injury risk in real time.

> ⚡ Backend-first architecture. Clean. Scalable. Production-ready.

---

## 🎯 The Problem It Solves

| Problem | SafeStride.AI Solution |
|---|---|
| Runners increase distance too fast | Tracks daily load and flags spikes |
| Injuries happen before runners notice | Predicts risk using ACWR methodology |
| Existing apps show numbers, not decisions | Converts data into clear risk levels |
=======
# SafeStride AI 🏃‍♂️

SafeStride AI is a **Running Load Monitoring & Injury Risk Prediction Backend System** built using Node.js, Express, and MongoDB.

The system tracks running workouts, calculates training load, and predicts injury risk using sports science metrics like **Acute Load, Chronic Load, and ACWR (Acute:Chronic Workload Ratio)**.

This project is built backend-first with production-level architecture.
>>>>>>> 828270f ( Readme file added)

---

## 🚀 Tech Stack

<<<<<<< HEAD
| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT Authentication |
| API Style | REST API |
| Testing | Postman |
| Architecture | MVC + Services + Utils |
=======
* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* REST API
* Postman Testing
* MVC + Services + Utils Architecture

---

## 📌 Project Goal

SafeStride AI helps runners monitor training load and avoid injuries by analyzing workout history using sports science formulas.

Features:

* Track running workouts
* Calculate daily training load
* Compute acute & chronic load
* Calculate ACWR ratio
* Predict injury risk
* Provide dashboard analytics

---

## 📂 Project Structure

Backend/

controllers/

routes/

models/

services/

utils/

middleware/

config/

server.js

---

## 🔐 Authentication APIs

POST /api/auth/register

POST /api/auth/login

Uses JWT authentication.

---

## 🏃 Run APIs

POST /api/runs

POST /api/runs/bulk

GET /api/runs

PUT /api/runs/:id

DELETE /api/runs/:id

Daily Load formula:

dailyLoad = duration × intensity

---

## 📊 Analytics APIs

GET /api/analytics/load

GET /api/analytics/weekly-load

GET /api/analytics/history

GET /api/analytics/risk

GET /api/analytics/dashboard
>>>>>>> 828270f ( Readme file added)

---

## 📈 Sports Science Logic

<<<<<<< HEAD
The heart of SafeStride.AI is built on proven sports science formulas:
```
Daily Load    =  duration × intensity

Acute Load    =  average of last 7 days  (measures fatigue)
Chronic Load  =  average of last 28 days (measures fitness)

ACWR          =  Acute Load / Chronic Load
```

### Risk Classification

| ACWR Range | Risk Level | Meaning |
|---|---|---|
| < 0.8 | 🔵 Low | Undertraining |
| 0.8 – 1.3 | 🟢 Optimal | Safe to train |
| 1.3 – 1.5 | 🟡 Warning | Caution advised |
| > 1.5 | 🔴 High | High injury risk |

> Cold start handling included for users with less than 28 days of data.

---

## 📂 Project Structure
```
Backend/
├── controllers/     # HTTP layer — handles requests & responses
├── routes/          # API route definitions
├── models/          # Mongoose schemas
├── services/        # Business logic — load & ACWR calculations
├── utils/           # Pure calculation functions
├── middleware/       # JWT auth & error handling
├── config/          # DB connection & environment config
└── server.js        # Entry point
```

---

## 🔐 Authentication APIs
```
POST  /api/auth/register    → Register new user
POST  /api/auth/login       → Login & receive JWT token
```

> All other routes are protected and require a valid JWT token in the `Authorization` header.

---

## 🏃 Run APIs
```
POST    /api/runs            → Log a new run
POST    /api/runs/bulk       → Log multiple runs at once
GET     /api/runs            → Get all runs for current user
PUT     /api/runs/:id        → Update a run
DELETE  /api/runs/:id        → Delete a run
```

---

## 📊 Analytics APIs
```
GET  /api/analytics/load          → Current acute & chronic load
GET  /api/analytics/weekly-load   → Load breakdown by week
GET  /api/analytics/history       → Full training history
GET  /api/analytics/risk          → Current ACWR & risk level
GET  /api/analytics/dashboard     → Complete stats overview
```

---

## 🧠 Architecture Philosophy

SafeStride.AI follows a clean, layered architecture:
```
Request → Controller → Service → Utils → Model → Response
```

- **Controller** — Handles HTTP, validates input, sends response
- **Service** — All business logic lives here (load calculation, risk classification)
- **Utils** — Pure, testable calculation functions
- **Model** — MongoDB schemas via Mongoose
- **Middleware** — Auth guards and centralized error handling

This separation makes the codebase **easy to test, scale, and maintain**.

---

## ▶️ Getting Started

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)

### Installation
```bash
# 1. Clone the repository
git clone https://github.com/SomeshPanigrahi/safestride-ai.git
cd safestride-ai/Backend

# 2. Install dependencies
npm install

# 3. Create your environment file
cp .env.example .env
```

### Environment Variables
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
```

### Run the Server
```bash
# Development (with auto-restart)
npm run dev

# Production
npm start
```

Server runs at → `http://localhost:5000`

---

## 📬 API Testing

Import the Postman collection and test all endpoints.

**Quick test flow:**
1. `POST /api/auth/register` — create account
2. `POST /api/auth/login` — get JWT token
3. Add token to `Authorization: Bearer <token>` header
4. `POST /api/runs` — log your first run
5. `GET /api/analytics/dashboard` — see your stats

---

## 🗺️ Roadmap

- [x] User authentication (JWT)
- [x] Run logging & management
- [x] Daily load calculation
- [x] Acute & chronic load engine
- [x] ACWR risk classification
- [x] Dashboard analytics
- [x] Cold start handling
- [ ] React.js frontend
- [ ] Interactive load charts
- [ ] AI-powered risk explanations
- [ ] Deployment (Render / Railway)
=======
Daily Load = duration × intensity

Acute Load = last 7 days average

Chronic Load = last 28 days average

ACWR = acute / chronic

Risk Levels:

Low < 0.8

Optimal 0.8 – 1.3

Warning 1.3 – 1.5

High > 1.5

Cold start handling included.

---

## 🧠 Architecture

Controller → HTTP layer

Service → Business logic

Utils → Pure calculations

Model → Database

Middleware → Auth & errors

This makes backend scalable.

---

## ▶️ How to Run

Clone repo

npm install

Create .env

PORT=5000

MONGO_URI=your_mongo

JWT_SECRET=secret

Run server

npm run dev

Server runs on

http://localhost:5000

---

## 📬 Testing

Use Postman to test APIs.

All routes require JWT except register/login.

---

## 🎯 Current Status

Backend: 90% complete

Frontend: Starting

Next:

Frontend UI

Charts

AI risk model

Deployment
>>>>>>> 828270f ( Readme file added)

---

## 👨‍💻 Author

<<<<<<< HEAD
**Somesh Panigrahi**
B.Tech Computer Science — KIIT, Bhubaneswar
[GitHub](https://github.com/SomeshPanigrahi) • [LinkedIn](https://www.linkedin.com/in/somesh-panigrahi-4b1914285)

---

<div align="center">
  <i>Built for learning. Designed for production.</i>
</div>
=======
SafeStride AI Project
Backend built for learning + production practice.
>>>>>>> 828270f ( Readme file added)

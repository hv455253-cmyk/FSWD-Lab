# Student Management System

A full-stack web application designed for academic record tracking, grade management, and departmental reporting using **React**, **Node.js**, **Express.js**, and **MongoDB Atlas**, deployed to **Render** and **Vercel**.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-success?style=for-the-badge&logo=vercel)](https://student-management-system-one-theta.vercel.app)
[![Backend API](https://img.shields.io/badge/Backend%20API-Render-informational?style=for-the-badge&logo=render)](https://student-backend-clyq.onrender.com/api/health)
[![Case Study PDF](https://img.shields.io/badge/Case%20Study-Report%20PDF-red?style=for-the-badge&logo=adobeacrobatreader)](./Student_Management_System_Case_Study_Q5.pdf)

---

## 🌐 Live Deployments
- **Frontend URL (React SPA):** [https://student-management-system-one-theta.vercel.app](https://student-management-system-one-theta.vercel.app)
- **Backend API (Express REST API):** [https://student-backend-clyq.onrender.com](https://student-backend-clyq.onrender.com)
  - Health Check: [https://student-backend-clyq.onrender.com/api/health](https://student-backend-clyq.onrender.com/api/health)
  - Department Analytics: [https://student-backend-clyq.onrender.com/api/reports/department-summary](https://student-backend-clyq.onrender.com/api/reports/department-summary)
- **Database:** MongoDB Atlas (M0 Free Tier Cluster)

---

## 📄 Case Study Documentation
- **Report PDF:** [Student_Management_System_Case_Study_Q5.pdf](./Student_Management_System_Case_Study_Q5.pdf)

---

## Project Architecture
- **Backend:** Node.js, Express.js REST API, Mongoose ODM
- **Database:** MongoDB Atlas (M0 Free Tier Cluster)
- **Frontend:** React 18, Vite SPA
- **Cloud Deployment:**
  - Database: MongoDB Atlas
  - Backend: Render Web Service
  - Frontend: Vercel Static Hosting

## Directory Structure
```
case study/
├── backend/
│   ├── .env.example
│   ├── package.json
│   └── server.js
├── frontend/
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       └── style.css
├── Student_Management_System_Case_Study_Q5.pdf
└── README.md
```

## Local Setup Instructions

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Fill in your MONGODB_URI in .env
npm start
```
The backend server runs at `http://localhost:5000`.

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The frontend Vite server runs at `http://localhost:5173`.

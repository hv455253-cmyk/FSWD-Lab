# Student Management System

A full-stack web application designed for academic record tracking, grade management, and departmental reporting using **React**, **Node.js**, **Express.js**, and **MongoDB Atlas**, deployed to **Render** and **Vercel**.

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
student-management-system/
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

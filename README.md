# HRMS - Enterprise Human Resource Management System

A production-style HRMS full-stack application featuring an **Admin Portal** & **Employee Self-Service Portal** with Express + PostgreSQL backend and React + Vite + Tailwind/CSS frontend.

---

## 📁 Repository Structure

```
HRMS/
├── backend/                  # Node.js + Express + PostgreSQL REST API
│   ├── src/                  # Controllers, routes, DB configuration & middleware
│   ├── database/             # Schema definitions, migrations & seed scripts
│   ├── package.json
│   └── .env.example          # Environment variables template
│
├── frontend/                 # React + Vite HRMS Frontend Portal
│   ├── src/                  # Components, layouts, pages & HRMSContext
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore                # Git ignore rules for node_modules, .env, build outputs
└── README.md                 # Project documentation & team setup guide
```

---

## 🚀 Quick Setup & Run Instructions

### 1. Prerequisites
- **Node.js**: v18+ installed
- **PostgreSQL**: Database running on localhost:5432

### 2. Backend Setup (`/backend`)
```bash
cd backend
npm install

# Copy environment variables file and edit PostgreSQL credentials
cp .env.example .env

# Initialize PostgreSQL Database tables & seed data
node database/initDb.js

# Start Express server on http://localhost:5000
npm start
```

### 3. Frontend Setup (`/frontend`)
```bash
cd frontend
npm install

# Start Vite React development server on http://localhost:5173
npm run dev
```

---

## 🔐 Credentials for Demo Testing

| Role | Email | Default Password | Initial Route |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@hrms.com` | `admin123` | `/admin/dashboard` |
| **Employee** | `employee@hrms.com` | `emp123` | `/employee/dashboard` |

---

## 🤝 Git Collaboration Workflow for Teammates

### Step 1: Clone the Repository
```bash
git clone <your-repository-url>
cd HRMS
```

### Step 2: Create a Feature Branch
Always work in a separate branch for new features or bug fixes:
```bash
git checkout -b feature/your-feature-name
```

### Step 3: Commit & Push Changes
```bash
git add .
git commit -m "feat: describe your change"
git push origin feature/your-feature-name
```

### Step 4: Create a Pull Request (PR)
Open a Pull Request on GitHub/GitLab, review the code with your teammate, and merge it into `main`.

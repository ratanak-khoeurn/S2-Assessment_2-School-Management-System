# School Management System

This repository contains the full-stack School Management System, split into two main directories:

- [`frontend/`](./frontend) — React + TypeScript + Vite + Tailwind CSS
- [`backend/`](./backend) — Node.js + Express + TypeScript + Sequelize + MySQL REST API

---

## 📁 Project Structure

```
S2-Assessment_2-School-Management-System/
├── frontend/             # Frontend React application
│   ├── src/
│   │   ├── auth/         # Authentication UI (Login, Register, Forgot Password)
│   │   ├── assets/
│   │   └── ...
│   ├── package.json
│   ├── vite.config.ts
│   └── ...
├── backend/              # Backend Node.js REST API
│   ├── src/
│   │   ├── config/       # Database connection (Sequelize)
│   │   ├── models/       # Sequelize models (User, Role, Course, Enrollment, Material)
│   │   ├── controllers/  # API Controllers
│   │   ├── routes/       # API Routes
│   │   ├── app.ts        # Express App setup
│   │   └── server.ts     # Entry point (port 5000)
│   ├── package.json
│   ├── tsconfig.json
│   ├── .env.example
│   └── .env
├── .gitignore
└── README.md
```

---

## 🚀 Getting Started

### 1. Frontend Setup (React + Vite)

Navigate into the `frontend` folder:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Start the Vite development server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

---

### 2. Backend Setup (Node.js + Express + Sequelize + MySQL)

Navigate into the `backend` folder:
```bash
cd backend
```

Install dependencies:
```bash
npm install
```

Make sure MySQL (e.g. XAMPP) is running and your `.env` contains your MySQL credentials:
```env
PORT=5000
DB_USERNAME=root
DB_PASSWORD=
DB_NAME=school_management
DB_HOST=127.0.0.1
DB_DIALECT=mysql
```

Start the development server:
```bash
npm run dev
```

Build for production:
```bash
npm run build
```

Start production server:
```bash
npm start
```




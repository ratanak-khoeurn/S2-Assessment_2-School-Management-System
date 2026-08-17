# School Management System

This repository contains the full-stack School Management System, split into two main directories:

- [`frontend/`](./frontend) — React + TypeScript + Vite + Tailwind CSS
- [`backend/`](./backend) — Node.js + Express + TypeScript + Prisma REST API

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
│   │   ├── controllers/  # API Controllers
│   │   ├── routes/       # API Routes
│   │   ├── lib/          # Prisma DB Client instance
│   │   ├── app.ts        # Express App setup
│   │   └── server.ts     # Entry point (port 5000)
│   ├── prisma/
│   │   └── schema.prisma # Prisma database schema
│   ├── package.json
│   ├── tsconfig.json
│   └── ...
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

### 2. Backend Setup (Node.js + Express + Prisma)

Navigate into the `backend` folder:
```bash
cd backend
```

Install dependencies:
```bash
npm install
```

Initialize database & Prisma client:
```bash
npx prisma generate
npx prisma db push
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



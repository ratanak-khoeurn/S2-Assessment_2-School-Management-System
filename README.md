# School Management System

This repository contains the full-stack School Management System, split into two main directories:

- [`frontend/`](./frontend) — React + TypeScript + Vite + Tailwind CSS
- [`backend/`](./backend) — Laravel PHP API

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
├── backend/              # Backend Laravel API
│   ├── app/
│   ├── routes/
│   ├── database/
│   ├── composer.json
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

### 2. Backend Setup (Laravel)

Navigate into the `backend` folder:
```bash
cd backend
```

Install PHP dependencies (if composer is installed):
```bash
composer install
```

Set up `.env` file and generate application key:
```bash
cp .env.example .env
php artisan key:generate
```

Run database migrations:
```bash
php artisan migrate
```

Start the Laravel development server:
```bash
php artisan serve
```


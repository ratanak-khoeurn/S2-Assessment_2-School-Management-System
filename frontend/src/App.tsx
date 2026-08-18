import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import LoginPage from './auth/login';
import RegisterPage from './auth/register';
import ForgotPassword from './auth/forgot-password';
import DashboardPage from '../src/dashboard/Dashboard';

const Dashboard = () => <h2>Dashboard (Protected: Anyone logged in)</h2>;
const AdminPanel = () => <h2>Admin Panel (Protected: Admins only)</h2>;
const Unauthorized = () => <h2>403 - You cannot access this page</h2>;
const HomePage = () => <h2>Welcome to home page</h2>;

export default function App() {

  return (
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* MIDDLEWARE LAYER 1: General Authentication */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>

        {/* MIDDLEWARE LAYER 2: Role-based Authorization */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminPanel />} />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<h2>404 - Page Not Found</h2>} />
      </Routes>
    </BrowserRouter>
  )
}

import {Navigate, Outlet } from "react-router-dom";

interface ProtectedRouteProps {
    allowedRoles?: string[];
}

export default function ProtectedRoute({allowedRoles}: ProtectedRouteProps) {

    const token = localStorage.getItem("token");
    const userRole = localStorage.getItem("role");
    const isAuthenticated = !!token;

    if (!isAuthenticated) {
        return <Navigate to="/login" replace/>;
    }

    if (allowedRoles && !allowedRoles.includes(userRole || "")) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet/>
}
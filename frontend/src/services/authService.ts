import axios from 'axios';
import api from './api';

interface LoginResponse {
    message: string;
    token: string;
}

export interface RegisterPayload {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export interface AuthResult {
    success: boolean;
    message?: string;
}

export const loginUser = async (email: string, password: string): Promise<boolean> => {
    try {
        const res = await api.post<LoginResponse>('/auth/login', { email, password });

        localStorage.setItem('authToken', res.data.token);
        return true;
    } catch (error) {
        return false;
    }
}

export const registerUser = async (payload: RegisterPayload): Promise<AuthResult> => {
    try {
        const res = await api.post<LoginResponse>('/auth/register', payload);

        localStorage.setItem('authToken', res.data.token);
        return { success: true };
    } catch (error) {
        const message = axios.isAxiosError<{ message?: string }>(error)
            ? error.response?.data?.message
            : undefined;

        return { success: false, message };
    }
}

export const logoutUser = (): void => {
    localStorage.removeItem('authToken');
    window.location.href = '/login';
};
import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

export const ADMIN_COOKIE_NAME = 'adminToken';

export interface AdminTokenPayload {
    userId: number;
    email: string;
    name: string;
    role: 'admin';
}

declare global {
    namespace Express {
        interface Request {
            admin?: AdminTokenPayload;
        }
    }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction): void {
    const token = req.cookies?.[ADMIN_COOKIE_NAME];

    if (!token) {
        res.redirect('/admin/login');
        return;
    }

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET as string) as AdminTokenPayload;

        if (payload.role !== 'admin') {
            throw new Error('Not an admin token');
        }

        req.admin = payload;
        next();
    } catch {
        res.clearCookie(ADMIN_COOKIE_NAME);
        res.redirect('/admin/login');
    }
}

export function redirectIfAdmin(req: Request, res: Response, next: NextFunction): void {
    const token = req.cookies?.[ADMIN_COOKIE_NAME];

    if (token) {
        try {
            jwt.verify(token, process.env.JWT_SECRET as string);
            res.redirect('/admin/dashboard');
            return;
        } catch {
            res.clearCookie(ADMIN_COOKIE_NAME);
        }
    }

    next();
}

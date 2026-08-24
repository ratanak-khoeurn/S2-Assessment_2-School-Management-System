import { Router, type Request, type Response } from 'express';
import { requireAdmin, redirectIfAdmin } from '../middleware/adminAuth.js';
import {
    getAdminLoginPage,
    postAdminLogin,
    postAdminLogout,
} from '../controllers/admin/auth.controller.js';
import { getAdminDashboard } from '../controllers/admin/dashboard.controller.js';

const router = Router();

// Public Admin Auth Routes
router.get('/login', redirectIfAdmin, getAdminLoginPage);
router.post('/login', postAdminLogin);

// Protected Admin Routes
router.use(requireAdmin);

router.post('/logout', postAdminLogout);
router.get('/dashboard', getAdminDashboard);
router.get('/', (_req: Request, res: Response) => {
    res.redirect('/admin/dashboard');
});

export default router;

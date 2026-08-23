import { Router, type Request, type Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User, Role } from '../models/index.js';
import { ADMIN_COOKIE_NAME, requireAdmin, redirectIfAdmin } from '../middleware/adminAuth.js';

const router = Router();

const ADMIN_COOKIE_MAX_AGE_MS = 8 * 60 * 60 * 1000;

router.get('/login', redirectIfAdmin, (_req: Request, res: Response) => {
    res.render('admin/login', { error: null });
});

router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).render('admin/login', { error: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ where: { email } });
        const role = user?.roleId ? await Role.findByPk(user.roleId) : null;

        if (!user || role?.roleName !== 'admin' || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).render('admin/login', { error: 'Invalid credentials or insufficient privileges' });
        }

        const token = jwt.sign(
            { userId: user.id, email: user.email, name: user.name, role: 'admin' },
            process.env.JWT_SECRET as string,
            { expiresIn: '8h' }
        );

        res.cookie(ADMIN_COOKIE_NAME, token, {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: ADMIN_COOKIE_MAX_AGE_MS,
        });

        return res.redirect('/admin/dashboard');
    } catch (error) {
        console.error('Admin login failed:', error);
        return res.status(500).render('admin/login', { error: 'Something went wrong. Please try again.' });
    }
});


router.use(requireAdmin);

router.post('/logout', (_req: Request, res: Response) => {
    res.clearCookie(ADMIN_COOKIE_NAME);
    res.redirect('/admin/login');
});

router.get('/dashboard', (req: Request, res: Response) => {
    res.render('admin/dashboard', { admin: req.admin });
});

router.get('/', (_req: Request, res: Response) => {
    res.redirect('/admin/dashboard');
});
router.get('/departments', (_req: Request, res: Response) => {
    res.redirect('/admin/departments');
});


export default router;

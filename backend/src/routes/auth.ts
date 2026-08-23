// src/routes/auth.ts
import { Router, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/index.js';

const router = Router();

function signToken(user: User): string {
    return jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET as string,
        { expiresIn: '1h' }
    );
}

router.post('/login', async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ where: { email } });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        return res.status(200).json({
            message: 'Login successful',
            token: signToken(user)
        });
    } catch (error) {
        console.error('Login failed:', error);
        return res.status(500).json({ message: 'Login failed' });
    }
});

router.post('/register', async (req: Request, res: Response) => {
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    if (password !== confirmPassword) {
        return res.status(400).json({ message: 'Passwords do not match' });
    }

    try {
        const existingUser = await User.findOne({ where: { email } });

        if (existingUser) {
            return res.status(409).json({ message: 'An account with this email already exists' });
        }

        const user = await User.create({
            name: `${firstName} ${lastName}`.trim(),
            email,
            password: await bcrypt.hash(password, 10),
        });

        return res.status(201).json({
            message: 'Registration successful',
            token: signToken(user)
        });
    } catch (error) {
        console.error('Registration failed:', error);
        return res.status(500).json({ message: 'Registration failed' });
    }
});

export default router;

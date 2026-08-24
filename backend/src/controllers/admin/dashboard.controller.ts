import type { Request, Response } from 'express';
import { User, Role, Course, Enrollment } from '../../models/index.js';

/**
 * Query stats, recent users, and courses, then render the Admin Dashboard
 */
export const getAdminDashboard = async (req: Request, res: Response) => {
    try {
        const studentRole = await Role.findOne({ where: { roleName: 'student' } });
        const teacherRole = await Role.findOne({ where: { roleName: 'teacher' } });
        const adminRole = await Role.findOne({ where: { roleName: 'admin' } });

        const [totalStudents, totalTeachers, totalAdmins, totalCourses, totalEnrollments, recentUsers, courses] = await Promise.all([
            studentRole ? User.count({ where: { roleId: studentRole.id } }) : 0,
            teacherRole ? User.count({ where: { roleId: teacherRole.id } }) : 0,
            adminRole ? User.count({ where: { roleId: adminRole.id } }) : 0,
            Course.count(),
            Enrollment.count(),
            User.findAll({
                limit: 10,
                order: [['createdAt', 'DESC']],
                include: [{ model: Role }],
            }),
            Course.findAll({
                limit: 10,
                order: [['createdAt', 'DESC']],
                include: [{ model: User, as: 'Teacher' }],
            }),
        ]);

        return res.render('admin/dashboard', {
            admin: req.admin,
            stats: {
                totalStudents,
                totalTeachers,
                totalAdmins,
                totalCourses,
                totalEnrollments,
            },
            recentUsers,
            courses,
            frontendUrl: process.env.CORS_ORIGIN,
        });
    } catch (error) {
        console.error('Failed to load admin dashboard:', error);
        return res.render('admin/dashboard', {
            admin: req.admin,
            stats: {
                totalStudents: 0,
                totalTeachers: 0,
                totalAdmins: 0,
                totalCourses: 0,
                totalEnrollments: 0,
            },
            recentUsers: [],
            courses: [],
            frontendUrl: process.env.CORS_ORIGIN,
        });
    }
};

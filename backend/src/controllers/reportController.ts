import { type Request, type Response } from "express";
import { col, fn } from "sequelize";
import { Course, Enrollment, Role, User } from "../models/index.js";
import { Department } from "../models/Department/Department.js";

type CountRow = { courseId?: number; department?: string; status?: string; count: string | number };

const getCount = (value: string | number | undefined): number => Number(value ?? 0);

export const getAdminReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const [studentRole, teacherRole] = await Promise.all([
      Role.findOne({ where: { roleName: "student" } }),
      Role.findOne({ where: { roleName: "teacher" } }),
    ]);

    const [studentCount, teacherCount, courseCount, departmentCount, activeDepartmentCount, enrollmentCount, courses, departments, enrollmentRows, courseEnrollmentRows, departmentCourseRows] = await Promise.all([
      studentRole ? User.count({ where: { roleId: studentRole.id } }) : 0,
      teacherRole ? User.count({ where: { roleId: teacherRole.id } }) : 0,
      Course.count(),
      Department.count(),
      Department.count({ where: { status: "active" } }),
      Enrollment.count(),
      Course.findAll({ order: [["createdAt", "DESC"]], limit: 8 }),
      Department.findAll({ order: [["departmentName", "ASC"]] }),
      Enrollment.findAll({ attributes: ["status", [fn("COUNT", col("id")), "count"]], group: ["status"], raw: true }) as unknown as Promise<CountRow[]>,
      Enrollment.findAll({ attributes: ["courseId", [fn("COUNT", col("id")), "count"]], group: ["courseId"], raw: true }) as unknown as Promise<CountRow[]>,
      Course.findAll({ attributes: ["department", [fn("COUNT", col("id")), "count"]], group: ["department"], raw: true }) as unknown as Promise<CountRow[]>,
    ]);

    const enrollmentsByCourse = new Map(courseEnrollmentRows.map((row) => [Number(row.courseId), getCount(row.count)]));
    const coursesByDepartment = new Map(departmentCourseRows.map((row) => [String(row.department ?? "").trim().toLowerCase(), getCount(row.count)]));
    const capacity = courses.reduce((total, course) => total + course.capacity, 0);
    const departmentReport = departments.map((department) => {
      const byCode = coursesByDepartment.get(department.departmentCode.toLowerCase()) ?? 0;
      const byName = coursesByDepartment.get(department.departmentName.toLowerCase()) ?? 0;
      return { code: department.departmentCode, name: department.departmentName, status: department.status, courseCount: Math.max(byCode, byName) };
    });
    const maxDepartmentCourses = Math.max(1, ...departmentReport.map((department) => department.courseCount));

    res.render("admin/report", {
      admin: req.admin,
      activeNav: "Reports",
      generatedAt: new Date(),
      summary: {
        studentCount,
        teacherCount,
        courseCount,
        departmentCount,
        activeDepartmentCount,
        enrollmentCount,
        capacity,
        capacityUsed: capacity ? Math.min(100, Math.round((enrollmentCount / capacity) * 100)) : 0,
      },
      departments: departmentReport.map((department) => ({ ...department, width: Math.round((department.courseCount / maxDepartmentCourses) * 100) })),
      enrollmentStatuses: enrollmentRows.map((row) => ({ status: row.status || "Unspecified", count: getCount(row.count) })),
      courses: courses.map((course) => {
        const enrolled = enrollmentsByCourse.get(course.id) ?? 0;
        return { id: course.id, name: course.courseName, department: course.department, capacity: course.capacity, enrolled, fill: course.capacity ? Math.min(100, Math.round((enrolled / course.capacity) * 100)) : 0 };
      }),
    });
  } catch (error) {
    console.error("Admin report error:", error);
    res.status(500).render("admin/report", { error: "Unable to load the report right now.", admin: req.admin, activeNav: "Reports", generatedAt: new Date(), summary: null, departments: [], enrollmentStatuses: [], courses: [] });
  }
};

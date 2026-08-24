import { type Request, type Response } from "express";

const staticReport = {
  summary: {
    studentCount: 486,
    teacherCount: 34,
    courseCount: 7,
    departmentCount: 4,
    activeDepartmentCount: 3,
    enrollmentCount: 244,
    capacity: 300,
    capacityUsed: 81,
  },
  departments: [
    { code: "CS", name: "Computer Science", status: "active", courseCount: 3, width: 100 },
    { code: "BUS", name: "Business", status: "active", courseCount: 2, width: 67 },
    { code: "ENG", name: "Engineering", status: "active", courseCount: 2, width: 67 },
    { code: "ART", name: "Arts & Humanities", status: "inactive", courseCount: 0, width: 2 },
  ],
  enrollmentStatuses: [
    { status: "Enrolled", count: 218 },
    { status: "Pending", count: 18 },
    { status: "Dropped", count: 8 },
  ],
  courses: [
    { id: 1, name: "Introduction to Programming", department: "Computer Science", capacity: 60, enrolled: 54, fill: 90 },
    { id: 2, name: "Database Systems", department: "Computer Science", capacity: 45, enrolled: 39, fill: 87 },
    { id: 3, name: "Web Development", department: "Computer Science", capacity: 40, enrolled: 37, fill: 93 },
    { id: 4, name: "Principles of Accounting", department: "Business", capacity: 45, enrolled: 32, fill: 71 },
    { id: 5, name: "Marketing Fundamentals", department: "Business", capacity: 35, enrolled: 29, fill: 83 },
    { id: 6, name: "Engineering Statics", department: "Engineering", capacity: 40, enrolled: 27, fill: 68 },
    { id: 7, name: "Circuit Analysis", department: "Engineering", capacity: 35, enrolled: 26, fill: 74 },
  ],
};

export const getAdminReport = (req: Request, res: Response): void => {
  res.render("admin/report", {
    admin: req.admin,
    activeNav: "Reports",
    generatedAt: new Date(),
    ...staticReport,
  });
};
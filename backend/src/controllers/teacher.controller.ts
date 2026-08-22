import { Request, Response } from "express";
import { Op } from "sequelize";
import { User, Role, Course } from "../models/index.js";

// GET /api/teachers
export const getAllTeachers = async (req: Request, res: Response) => {
  try {
    const { search, department, status } = req.query;

    const whereClause: any = {
      [Op.or]: [
        { academicRole: "teacher" },
        { academicRole: "Teacher" },
        { roleId: 2 },
      ],
    };

    if (search) {
      whereClause[Op.and] = [
        ...(whereClause[Op.and] || []),
        {
          [Op.or]: [
            { name: { [Op.like]: `%${search}%` } },
            { email: { [Op.like]: `%${search}%` } },
            { phone: { [Op.like]: `%${search}%` } },
          ],
        },
      ];
    }

    if (department && department !== "All") {
      whereClause.subject = department;
    }

    if (status && status !== "All") {
      whereClause.status = status;
    }

    const teachers = await User.findAll({
      where: whereClause,
      include: [
        { model: Role, attributes: ["id", "roleName"] },
        { model: Course, as: "TaughtCourses", attributes: ["id", "courseName", "department"] },
      ],
      order: [["id", "DESC"]],
    });

    res.status(200).json({ success: true, data: teachers });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/teachers/:id
export const getTeacherById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const teacher = await User.findByPk(id, {
      include: [
        { model: Role, attributes: ["id", "roleName"] },
        { model: Course, as: "TaughtCourses" },
      ],
    });

    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }

    res.status(200).json({ success: true, data: teacher });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/teachers
export const createTeacher = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, department, position, qualification, joinedAt, status, gender, address } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, message: "Name and email are required" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "Email already registered" });
    }

    const newTeacher = await User.create({
      name,
      email,
      password: password || "Teacher@123",
      roleId: 2,
      phone: phone || null,
      subject: department || "Computer Science",
      professionalTitle: position || "Lecturer",
      academicRole: "teacher",
      joinedAt: joinedAt || new Date(),
      adminNotes: qualification || "Master's Degree",
      gender: gender || "Male",
      status: status || "Active",
      address: address || null,
    });

    res.status(201).json({ success: true, data: newTeacher, message: "Teacher created successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/teachers/:id
export const updateTeacher = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { name, email, phone, department, position, qualification, joinedAt, status, gender, address } = req.body;

    const teacher = await User.findByPk(id);
    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }

    await teacher.update({
      name: name !== undefined ? name : teacher.name,
      email: email !== undefined ? email : teacher.email,
      phone: phone !== undefined ? phone : teacher.phone,
      subject: department !== undefined ? department : teacher.subject,
      professionalTitle: position !== undefined ? position : teacher.professionalTitle,
      adminNotes: qualification !== undefined ? qualification : teacher.adminNotes,
      joinedAt: joinedAt !== undefined ? joinedAt : teacher.joinedAt,
      gender: gender !== undefined ? gender : teacher.gender,
      status: status !== undefined ? status : teacher.status,
      address: address !== undefined ? address : teacher.address,
    });

    res.status(200).json({ success: true, data: teacher, message: "Teacher updated successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/teachers/:id
export const deleteTeacher = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const teacher = await User.findByPk(id);
    if (!teacher) {
      return res.status(404).json({ success: false, message: "Teacher not found" });
    }

    await teacher.destroy();
    res.status(200).json({ success: true, message: "Teacher deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

import { Request, Response } from "express";
import { Op } from "sequelize";
import { User, Role, Course, Enrollment } from "../models/index.js";

// GET /api/students
export const getAllStudents = async (req: Request, res: Response) => {
  try {
    const { search, department, status } = req.query;

    const whereClause: any = {
      [Op.or]: [
        { academicRole: "student" },
        { academicRole: "Student" },
        { roleId: 3 },
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

    const students = await User.findAll({
      where: whereClause,
      include: [
        { model: Role, attributes: ["id", "roleName"] },
        {
          model: Course,
          as: "EnrolledCourses",
          attributes: ["id", "courseName", "department"],
          through: { attributes: ["status"] },
        },
      ],
      order: [["id", "DESC"]],
    });

    res.status(200).json({ success: true, data: students });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/students/:id
export const getStudentById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const student = await User.findByPk(id, {
      include: [
        { model: Role, attributes: ["id", "roleName"] },
        {
          model: Course,
          as: "EnrolledCourses",
          attributes: ["id", "courseName", "department", "schedule", "room"],
          through: { attributes: ["status"] },
        },
      ],
    });

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    res.status(200).json({ success: true, data: student });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/students
export const createStudent = async (req: Request, res: Response) => {
  try {
    const { name, email, password, phone, department, joinedAt, gradeLevel, gender, status, address } = req.body;

    if (!name || !email) {
      return res.status(400).json({ success: false, message: "Name and email are required" });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ success: false, message: "Email already registered" });
    }

    const newStudent = await User.create({
      name,
      email,
      password: password || "",
      phone: phone || null,
      subject: department || "",
      academicRole: "student",
      joinedAt: joinedAt || new Date(),
      adminNotes: gradeLevel || "",
      gender: gender || "",
      status: status || "",
      address: address || null,
    });

    res.status(201).json({ success: true, data: newStudent, message: "Student created successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/students/:id
export const updateStudent = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { name, email, phone, department, joinedAt, gradeLevel, gender, status, address } = req.body;

    const student = await User.findByPk(id);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    await student.update({
      name: name !== undefined ? name : student.name,
      email: email !== undefined ? email : student.email,
      phone: phone !== undefined ? phone : student.phone,
      subject: department !== undefined ? department : student.subject,
      joinedAt: joinedAt !== undefined ? joinedAt : student.joinedAt,
      adminNotes: gradeLevel !== undefined ? gradeLevel : student.adminNotes,
      gender: gender !== undefined ? gender : student.gender,
      status: status !== undefined ? status : student.status,
      address: address !== undefined ? address : student.address,
    });

    res.status(200).json({ success: true, data: student, message: "Student updated successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/students/:id
export const deleteStudent = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const student = await User.findByPk(id);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    // Clean up enrollments
    await Enrollment.destroy({ where: { studentId: id } });
    await student.destroy();

    res.status(200).json({ success: true, message: "Student deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

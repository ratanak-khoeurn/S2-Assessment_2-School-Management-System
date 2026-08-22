import { Request, Response } from "express";
import { Op } from "sequelize";
import { Course, User, Enrollment } from "../models/index.js";

// GET /api/subjects
export const getAllSubjects = async (req: Request, res: Response) => {
  try {
    const { search, department } = req.query;

    const whereClause: any = {};
    if (search) {
      whereClause[Op.or] = [
        { courseName: { [Op.like]: `%${search}%` } },
        { department: { [Op.like]: `%${search}%` } },
        { room: { [Op.like]: `%${search}%` } },
        { enrollmentCode: { [Op.like]: `%${search}%` } },
      ];
    }

    if (department && department !== "All") {
      whereClause.department = department;
    }

    const subjects = await Course.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: "Teacher",
          attributes: ["id", "name", "email", "phone"],
        },
        {
          model: Enrollment,
          attributes: ["id", "status"],
        },
      ],
      order: [["id", "DESC"]],
    });

    res.status(200).json({ success: true, data: subjects });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// GET /api/subjects/:id
export const getSubjectById = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const subject = await Course.findByPk(id, {
      include: [
        {
          model: User,
          as: "Teacher",
          attributes: ["id", "name", "email", "phone"],
        },
        {
          model: User,
          as: "Students",
          attributes: ["id", "name", "email"],
          through: { attributes: ["status", "createdAt"] },
        },
      ],
    });

    if (!subject) {
      return res.status(404).json({ success: false, message: "Subject not found" });
    }

    res.status(200).json({ success: true, data: subject });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST /api/subjects
export const createSubject = async (req: Request, res: Response) => {
  try {
    const {
      courseName,
      department,
      description,
      capacity,
      schedule,
      room,
      enrollmentCode,
      teacherId,
    } = req.body;

    if (!courseName || !department) {
      return res.status(400).json({ success: false, message: "Subject name and department are required" });
    }

    const newSubject = await Course.create({
      courseName,
      department,
      description: description || null,
      capacity: capacity ? Number(capacity) : 50,
      schedule: schedule || "Mon, Wed 09:00 AM - 10:30 AM",
      room: room || "Room 101",
      enrollmentCode: enrollmentCode || `SUB-${Math.floor(1000 + Math.random() * 9000)}`,
      teacherId: teacherId ? Number(teacherId) : null,
    });

    res.status(201).json({ success: true, data: newSubject, message: "Subject created successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// PUT /api/subjects/:id
export const updateSubject = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const {
      courseName,
      department,
      description,
      capacity,
      schedule,
      room,
      enrollmentCode,
      teacherId,
    } = req.body;

    const subject = await Course.findByPk(id);
    if (!subject) {
      return res.status(404).json({ success: false, message: "Subject not found" });
    }

    await subject.update({
      courseName: courseName ?? subject.courseName,
      department: department ?? subject.department,
      description: description ?? subject.description,
      capacity: capacity ? Number(capacity) : subject.capacity,
      schedule: schedule ?? subject.schedule,
      room: room ?? subject.room,
      enrollmentCode: enrollmentCode ?? subject.enrollmentCode,
      teacherId: teacherId !== undefined ? (teacherId ? Number(teacherId) : null) : subject.teacherId,
    });

    res.status(200).json({ success: true, data: subject, message: "Subject updated successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE /api/subjects/:id
export const deleteSubject = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const subject = await Course.findByPk(id);
    if (!subject) {
      return res.status(404).json({ success: false, message: "Subject not found" });
    }

    await Enrollment.destroy({ where: { courseId: id } });
    await subject.destroy();

    res.status(200).json({ success: true, message: "Subject deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

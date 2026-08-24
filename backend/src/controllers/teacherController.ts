import { Request, Response } from "express";

import { Teacher, Department } from "../models/index.js";

// =====================================================
// GET ALL TEACHERS
// GET /api/teachers
// =====================================================

export const getTeachers = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const teachers = await Teacher.findAll({
      include: [
        {
          model: Department,

          as: "department",

          attributes: ["id", "departmentCode", "departmentName"],
        },
      ],

      order: [["id", "DESC"]],
    });

    res.status(200).json({
      success: true,
      data: teachers,
    });
  } catch (error) {
    console.error("Get teachers error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch teachers.",
    });
  }
};

// =====================================================
// GET TEACHER BY ID
// GET /api/teachers/:id
// =====================================================

export const getTeacherById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid teacher ID.",
      });

      return;
    }

    const teacher = await Teacher.findByPk(id, {
      include: [
        {
          model: Department,

          as: "department",

          attributes: ["id", "departmentCode", "departmentName"],
        },
      ],
    });

    if (!teacher) {
      res.status(404).json({
        success: false,
        message: "Teacher not found.",
      });

      return;
    }

    res.status(200).json({
      success: true,
      data: teacher,
    });
  } catch (error) {
    console.error("Get teacher error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch teacher.",
    });
  }
};

// =====================================================
// CREATE TEACHER
// POST /api/teachers
// =====================================================

export const createTeacher = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const {
      teacherId,
      name,
      email,
      phone,
      gender,
      departmentId,
      position,
      qualification,
      joinedDate,
      status,
    } = req.body;

    // ---------------------------------------------
    // VALIDATION
    // ---------------------------------------------

    if (!teacherId || !name || !email || !phone || !departmentId) {
      res.status(400).json({
        success: false,
        message: "Please fill in all required fields.",
      });

      return;
    }

    // ---------------------------------------------
    // CHECK DEPARTMENT
    // ---------------------------------------------

    const department = await Department.findByPk(Number(departmentId));

    if (!department) {
      res.status(400).json({
        success: false,
        message: "Department not found.",
      });

      return;
    }

    // ---------------------------------------------
    // CHECK DUPLICATE TEACHER ID
    // ---------------------------------------------

    const existingTeacher = await Teacher.findOne({
      where: {
        teacherId,
      },
    });

    if (existingTeacher) {
      res.status(409).json({
        success: false,
        message: "Teacher ID already exists.",
      });

      return;
    }

    // ---------------------------------------------
    // CREATE
    // ---------------------------------------------

    const teacher = await Teacher.create({
      teacherId,

      name,

      email,

      phone,

      gender: gender || "Male",

      departmentId: Number(departmentId),

      position: position || "Teacher",

      qualification: qualification || null,

      joinedDate: joinedDate || null,

      status: status || "active",
    });

    // ---------------------------------------------
    // GET CREATED TEACHER
    // ---------------------------------------------

    const createdTeacher = await Teacher.findByPk(teacher.id, {
      include: [
        {
          model: Department,

          as: "department",

          attributes: ["id", "departmentCode", "departmentName"],
        },
      ],
    });

    res.status(201).json({
      success: true,

      message: "Teacher created successfully.",

      data: createdTeacher,
    });
  } catch (error) {
    console.error("Create teacher error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create teacher.",
    });
  }
};

// =====================================================
// UPDATE TEACHER
// PUT /api/teachers/:id
// =====================================================

export const updateTeacher = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid teacher ID.",
      });

      return;
    }

    const teacher = await Teacher.findByPk(id);

    if (!teacher) {
      res.status(404).json({
        success: false,
        message: "Teacher not found.",
      });

      return;
    }

    const {
      teacherId,
      name,
      email,
      phone,
      gender,
      departmentId,
      position,
      qualification,
      joinedDate,
      status,
    } = req.body;

    // ---------------------------------------------
    // CHECK DEPARTMENT
    // ---------------------------------------------

    if (departmentId) {
      const department = await Department.findByPk(Number(departmentId));

      if (!department) {
        res.status(400).json({
          success: false,
          message: "Department not found.",
        });

        return;
      }
    }

    // ---------------------------------------------
    // UPDATE
    // ---------------------------------------------

    await teacher.update({
      teacherId,

      name,

      email,

      phone,

      gender,

      departmentId: Number(departmentId),

      position,

      qualification: qualification || null,

      joinedDate: joinedDate || null,

      status,
    });

    // ---------------------------------------------
    // RETURN UPDATED DATA
    // ---------------------------------------------

    const updatedTeacher = await Teacher.findByPk(id, {
      include: [
        {
          model: Department,

          as: "department",

          attributes: ["id", "departmentCode", "departmentName"],
        },
      ],
    });

    res.status(200).json({
      success: true,

      message: "Teacher updated successfully.",

      data: updatedTeacher,
    });
  } catch (error) {
    console.error("Update teacher error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update teacher.",
    });
  }
};

// =====================================================
// DELETE TEACHER
// DELETE /api/teachers/:id
// =====================================================

export const deleteTeacher = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid teacher ID.",
      });

      return;
    }

    const teacher = await Teacher.findByPk(id);

    if (!teacher) {
      res.status(404).json({
        success: false,
        message: "Teacher not found.",
      });

      return;
    }

    await teacher.destroy();

    res.status(200).json({
      success: true,
      message: "Teacher deleted successfully.",
    });
  } catch (error) {
    console.error("Delete teacher error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete teacher.",
    });
  }
};

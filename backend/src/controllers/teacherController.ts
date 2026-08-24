import { Request, Response } from "express";
import { Teacher } from "../models/Teachers/Teacher.js";
import { Department } from "../models/Department/Department.js";

// =====================================================
// GET TEACHER MANAGEMENT PAGE
// GET /admin/teacher
// =====================================================

export const getTeachersPage = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const teachers = await Teacher.findAll({
      order: [["createdAt", "DESC"]],
    });

    const departments = await Department.findAll({
      where: {
        status: "active",
      },
      order: [["departmentName", "ASC"]],
    });

    res.render("teacher", {
      teachers,
      departments,
    });
  } catch (error) {
    console.error("Error loading teacher page:", error);

    res.status(500).render("error", {
      message: "Unable to load teacher management page.",
    });
  }
};

// =====================================================
// GET ALL TEACHERS
// GET /api/teachers
// =====================================================

export const getTeachers = async (
  _req: Request,
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
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      message: "Teachers retrieved successfully.",
      data: teachers,
    });
  } catch (error) {
    console.error("Error fetching teachers:", error);

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
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  try {
    const teacherId = Number(req.params.id);

    if (!Number.isInteger(teacherId) || teacherId <= 0) {
      res.status(400).json({
        success: false,
        message: "Invalid teacher ID.",
      });
      return;
    }

    const teacher = await Teacher.findByPk(teacherId, {
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
      message: "Teacher retrieved successfully.",
      data: teacher,
    });
  } catch (error) {
    console.error("Error fetching teacher:", error);

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

    // -----------------------------------------
    // Validate required fields
    // -----------------------------------------

    if (typeof teacherId !== "string" || !teacherId.trim()) {
      res.status(400).json({
        success: false,
        message: "Teacher ID is required.",
      });
      return;
    }

    if (typeof name !== "string" || !name.trim()) {
      res.status(400).json({
        success: false,
        message: "Teacher name is required.",
      });
      return;
    }

    if (typeof email !== "string" || !email.trim()) {
      res.status(400).json({
        success: false,
        message: "Teacher email is required.",
      });
      return;
    }

    if (
      departmentId === undefined ||
      departmentId === null ||
      departmentId === ""
    ) {
      res.status(400).json({
        success: false,
        message: "Department is required.",
      });
      return;
    }

    if (typeof position !== "string" || !position.trim()) {
      res.status(400).json({
        success: false,
        message: "Teacher position is required.",
      });
      return;
    }

    // -----------------------------------------
    // Convert department ID
    // -----------------------------------------

    const cleanDepartmentId = Number(departmentId);

    if (!Number.isInteger(cleanDepartmentId) || cleanDepartmentId <= 0) {
      res.status(400).json({
        success: false,
        message: "Invalid department ID.",
      });
      return;
    }

    // -----------------------------------------
    // Clean data
    // -----------------------------------------

    const cleanTeacherId = teacherId.trim();
    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPosition = position.trim();

    const cleanPhone = typeof phone === "string" ? phone.trim() || null : null;

    const cleanGender =
      typeof gender === "string" ? gender.trim() || null : null;

    const cleanQualification =
      typeof qualification === "string" ? qualification.trim() || null : null;

    const cleanJoinedDate = joinedDate || null;

    const cleanStatus = status === "inactive" ? "inactive" : "active";

    // -----------------------------------------
    // Check department
    // -----------------------------------------

    const department = await Department.findByPk(cleanDepartmentId);

    if (!department) {
      res.status(404).json({
        success: false,
        message: "Department not found.",
      });
      return;
    }

    // -----------------------------------------
    // Check duplicate teacher ID
    // -----------------------------------------

    const existingTeacher = await Teacher.findOne({
      where: {
        teacherId: cleanTeacherId,
      },
    });

    if (existingTeacher) {
      res.status(409).json({
        success: false,
        message: "Teacher ID already exists.",
      });
      return;
    }

    // -----------------------------------------
    // Check duplicate email
    // -----------------------------------------

    const existingEmail = await Teacher.findOne({
      where: {
        email: cleanEmail,
      },
    });

    if (existingEmail) {
      res.status(409).json({
        success: false,
        message: "Teacher email already exists.",
      });
      return;
    }

    // -----------------------------------------
    // Create teacher
    // -----------------------------------------

    const teacher = await Teacher.create({
      teacherId: cleanTeacherId,
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
    //   gender: cleanGender,
      departmentId: cleanDepartmentId,
      position: cleanPosition,
      qualification: cleanQualification,
      joinedDate: cleanJoinedDate,
      status: cleanStatus,
    });

    res.status(201).json({
      success: true,
      message: "Teacher created successfully.",
      data: teacher,
    });
  } catch (error) {
    console.error("Error creating teacher:", error);

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
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
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

    // -----------------------------------------
    // Clean Teacher ID
    // -----------------------------------------

    let cleanTeacherId = teacher.teacherId;

    if (teacherId !== undefined) {
      if (typeof teacherId !== "string" || !teacherId.trim()) {
        res.status(400).json({
          success: false,
          message: "Teacher ID is required.",
        });
        return;
      }

      cleanTeacherId = teacherId.trim();
    }

    // -----------------------------------------
    // Clean Name
    // -----------------------------------------

    let cleanName = teacher.name;

    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        res.status(400).json({
          success: false,
          message: "Teacher name is required.",
        });
        return;
      }

      cleanName = name.trim();
    }

    // -----------------------------------------
    // Clean Email
    // -----------------------------------------

    let cleanEmail = teacher.email;

    if (email !== undefined) {
      if (typeof email !== "string" || !email.trim()) {
        res.status(400).json({
          success: false,
          message: "Teacher email is required.",
        });
        return;
      }

      cleanEmail = email.trim().toLowerCase();
    }

    // -----------------------------------------
    // Department
    // -----------------------------------------

    let cleanDepartmentId = teacher.departmentId;

    if (
      departmentId !== undefined &&
      departmentId !== null &&
      departmentId !== ""
    ) {
      cleanDepartmentId = Number(departmentId);

      if (!Number.isInteger(cleanDepartmentId) || cleanDepartmentId <= 0) {
        res.status(400).json({
          success: false,
          message: "Invalid department ID.",
        });
        return;
      }

      const department = await Department.findByPk(cleanDepartmentId);

      if (!department) {
        res.status(404).json({
          success: false,
          message: "Department not found.",
        });
        return;
      }
    }

    // -----------------------------------------
    // Position
    // -----------------------------------------

    let cleanPosition = teacher.position;

    if (position !== undefined) {
      if (typeof position !== "string" || !position.trim()) {
        res.status(400).json({
          success: false,
          message: "Teacher position is required.",
        });
        return;
      }

      cleanPosition = position.trim();
    }

    // -----------------------------------------
    // Optional fields
    // -----------------------------------------

    const cleanPhone =
      phone !== undefined
        ? typeof phone === "string"
          ? phone.trim() || null
          : null
        : teacher.phone;

    const cleanGender =
      gender !== undefined
        ? typeof gender === "string"
          ? gender.trim() || null
          : null
        : teacher.gender;

    const cleanQualification =
      qualification !== undefined
        ? typeof qualification === "string"
          ? qualification.trim() || null
          : null
        : teacher.qualification;

    const cleanJoinedDate =
      joinedDate !== undefined ? joinedDate || null : teacher.joinedDate;

    // -----------------------------------------
    // Status
    // -----------------------------------------

    let cleanStatus = teacher.status;

    if (status !== undefined) {
      if (status !== "active" && status !== "inactive") {
        res.status(400).json({
          success: false,
          message: "Status must be active or inactive.",
        });
        return;
      }

      cleanStatus = status;
    }

    // -----------------------------------------
    // Check duplicate Teacher ID
    // -----------------------------------------

    if (cleanTeacherId !== teacher.teacherId) {
      const duplicateTeacher = await Teacher.findOne({
        where: {
          teacherId: cleanTeacherId,
        },
      });

      if (duplicateTeacher && duplicateTeacher.id !== teacher.id) {
        res.status(409).json({
          success: false,
          message: "Teacher ID already exists.",
        });
        return;
      }
    }

    // -----------------------------------------
    // Check duplicate email
    // -----------------------------------------

    if (cleanEmail !== teacher.email) {
      const duplicateEmail = await Teacher.findOne({
        where: {
          email: cleanEmail,
        },
      });

      if (duplicateEmail && duplicateEmail.id !== teacher.id) {
        res.status(409).json({
          success: false,
          message: "Teacher email already exists.",
        });
        return;
      }
    }

    // -----------------------------------------
    // Update teacher
    // -----------------------------------------

    await teacher.update({
      teacherId: cleanTeacherId,
      name: cleanName,
      email: cleanEmail,
      phone: cleanPhone,
    //   gender: cleanGender,
      departmentId: cleanDepartmentId,
      position: cleanPosition,
      qualification: cleanQualification,
      joinedDate: cleanJoinedDate,
      status: cleanStatus,
    });

    res.status(200).json({
      success: true,
      message: "Teacher updated successfully.",
      data: teacher,
    });
  } catch (error) {
    console.error("Error updating teacher:", error);

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
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
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
    console.error("Error deleting teacher:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete teacher.",
    });
  }
};

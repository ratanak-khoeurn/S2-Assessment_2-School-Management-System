import { Request, Response } from "express";
import { Department } from "../models/Department/Department.js";

// =====================================================
// GET ALL DEPARTMENTS
// GET /api/departments
// =====================================================
export const getDepartments = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const departments = await Department.findAll({
      order: [["id", "DESC"]],
    });

    res.status(200).json({
      success: true,
      message: "Departments retrieved successfully",
      data: departments,
    });
  } catch (error) {
    console.error("Get departments error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve departments",
    });
  }
};

// =====================================================
// GET DEPARTMENT BY ID
// GET /api/departments/:id
// =====================================================
export const getDepartmentById = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  try {
    const departmentId = Number(req.params.id);

    if (!Number.isInteger(departmentId) || departmentId <= 0) {
      res.status(400).json({
        success: false,
        message: "Invalid department ID",
      });
      return;
    }

    const department = await Department.findByPk(departmentId);

    if (!department) {
      res.status(404).json({
        success: false,
        message: "Department not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Department retrieved successfully",
      data: department,
    });
  } catch (error) {
    console.error("Get department by ID error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve department",
    });
  }
};

// =====================================================
// CREATE DEPARTMENT
// POST /api/departments
// =====================================================
export const createDepartment = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { departmentCode, departmentName, description, status } = req.body;

    // Validate required fields
    if (typeof departmentCode !== "string" || !departmentCode.trim()) {
      res.status(400).json({
        success: false,
        message: "Department code is required",
      });
      return;
    }

    if (typeof departmentName !== "string" || !departmentName.trim()) {
      res.status(400).json({
        success: false,
        message: "Department name is required",
      });
      return;
    }

    const cleanCode = departmentCode.trim();
    const cleanName = departmentName.trim();
    const cleanDescription =
      typeof description === "string" ? description.trim() || null : null;

    const cleanStatus = status === "inactive" ? "inactive" : "active";

    // Check duplicate department code
    const existingDepartment = await Department.findOne({
      where: {
        departmentCode: cleanCode,
      },
    });

    if (existingDepartment) {
      res.status(409).json({
        success: false,
        message: "Department code already exists",
      });
      return;
    }

    // Create department
    const department = await Department.create({
      departmentCode: cleanCode,
      departmentName: cleanName,
      description: cleanDescription,
      status: cleanStatus,
    });

    res.status(201).json({
      success: true,
      message: "Department created successfully",
      data: department,
    });
  } catch (error) {
    console.error("Create department error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create department",
    });
  }
};

// =====================================================
// UPDATE DEPARTMENT
// PUT /api/departments/:id
// =====================================================
export const updateDepartment = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  try {
    const departmentId = Number(req.params.id);

    if (!Number.isInteger(departmentId) || departmentId <= 0) {
      res.status(400).json({
        success: false,
        message: "Invalid department ID",
      });
      return;
    }

    const department = await Department.findByPk(departmentId);

    if (!department) {
      res.status(404).json({
        success: false,
        message: "Department not found",
      });
      return;
    }

    const { departmentCode, departmentName, description, status } = req.body;

    // -----------------------------------------
    // Clean values
    // -----------------------------------------

    const cleanCode =
      typeof departmentCode === "string"
        ? departmentCode.trim()
        : department.departmentCode;

    const cleanName =
      typeof departmentName === "string"
        ? departmentName.trim()
        : department.departmentName;

    const cleanDescription =
      description !== undefined
        ? typeof description === "string"
          ? description.trim() || null
          : null
        : department.description;

    const cleanStatus =
      status === "active" || status === "inactive" ? status : department.status;

    // -----------------------------------------
    // Validate
    // -----------------------------------------

    if (!cleanCode) {
      res.status(400).json({
        success: false,
        message: "Department code is required",
      });
      return;
    }

    if (!cleanName) {
      res.status(400).json({
        success: false,
        message: "Department name is required",
      });
      return;
    }

    // -----------------------------------------
    // Check duplicate code
    // -----------------------------------------

    if (cleanCode !== department.departmentCode) {
      const existingDepartment = await Department.findOne({
        where: {
          departmentCode: cleanCode,
        },
      });

      if (existingDepartment && existingDepartment.id !== department.id) {
        res.status(409).json({
          success: false,
          message: "Department code already exists",
        });
        return;
      }
    }

    // -----------------------------------------
    // Update
    // -----------------------------------------

    await department.update({
      departmentCode: cleanCode,
      departmentName: cleanName,
      description: cleanDescription,
      status: cleanStatus,
    });

    res.status(200).json({
      success: true,
      message: "Department updated successfully",
      data: department,
    });
  } catch (error) {
    console.error("Update department error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update department",
    });
  }
};

// =====================================================
// DELETE DEPARTMENT
// DELETE /api/departments/:id
// =====================================================
export const deleteDepartment = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  try {
    const departmentId = Number(req.params.id);

    if (!Number.isInteger(departmentId) || departmentId <= 0) {
      res.status(400).json({
        success: false,
        message: "Invalid department ID",
      });
      return;
    }

    const department = await Department.findByPk(departmentId);

    if (!department) {
      res.status(404).json({
        success: false,
        message: "Department not found",
      });
      return;
    }

    await department.destroy();

    res.status(200).json({
      success: true,
      message: "Department deleted successfully",
    });
  } catch (error) {
    console.error("Delete department error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete department",
    });
  }
};

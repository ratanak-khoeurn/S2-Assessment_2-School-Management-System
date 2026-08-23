import { Request, Response } from "express";
import { Department } from "../models/Department/Department.js";

export const getDepartments = async (
  req: Request,
  res: Response,
): Promise<void> => {
  res.redirect("/admin/departments");
};

export const getDepartmentById = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    const departmentId = Number(id);

    if (isNaN(departmentId)) {
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

export const createDepartment = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { departmentCode, departmentName, description, status } = req.body;

    if (!departmentCode || !departmentName) {
      res.status(400).json({
        success: false,
        message: "Department code and department name are required",
      });
      return;
    }

    // Check duplicate department code
    const existingDepartment = await Department.findOne({
      where: {
        departmentCode: departmentCode.trim(),
      },
    });

    if (existingDepartment) {
      res.status(409).json({
        success: false,
        message: "Department code already exists",
      });
      return;
    }

    const department = await Department.create({
      departmentCode: departmentCode.trim(),
      departmentName: departmentName.trim(),
      description: description?.trim() || null,
      status: status || "active",
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


export const updateDepartment = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    const departmentId = Number(id);

    if (isNaN(departmentId)) {
      res.status(400).json({
        success: false,
        message: "Invalid department ID",
      });
      return;
    }

    const { departmentCode, departmentName, description, status } = req.body;

    const department = await Department.findByPk(departmentId);

    if (!department) {
      res.status(404).json({
        success: false,
        message: "Department not found",
      });
      return;
    }

    // Check duplicate department code
    if (departmentCode && departmentCode.trim() !== department.departmentCode) {
      const existingDepartment = await Department.findOne({
        where: {
          departmentCode: departmentCode.trim(),
        },
      });

      if (existingDepartment) {
        res.status(409).json({
          success: false,
          message: "Department code already exists",
        });
        return;
      }
    }

    await department.update({
      departmentCode: departmentCode?.trim() ?? department.departmentCode,

      departmentName: departmentName?.trim() ?? department.departmentName,

      description:
        description !== undefined
          ? description?.trim() || null
          : department.description,

      status: status ?? department.status,
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


export const deleteDepartment = async (
  req: Request<{ id: string }>,
  res: Response,
): Promise<void> => {
  try {
    const { id } = req.params;

    const departmentId = Number(id);

    if (isNaN(departmentId)) {
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

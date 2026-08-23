import { Router } from "express";

import {
  getDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../controllers/departmentController.js";

export const departmentRouter = Router();

departmentRouter.get("/", getDepartments);

departmentRouter.get("/:id", getDepartmentById);

departmentRouter.post("/", createDepartment);

departmentRouter.put("/:id", updateDepartment);

departmentRouter.delete("/:id", deleteDepartment);

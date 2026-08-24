import { Router } from "express";
import { getHealth } from "../controllers/api.controller.js";
import departmentRouters from "./departmentRoutes.js";
import teacherRouters from "./teacherRoutes.js";
import { requireAdmin } from "../middleware/adminAuth.js";
export const apiRouter = Router();

// Health check endpoint
apiRouter.get("/health", getHealth);
apiRouter.use("/departments", requireAdmin, departmentRouters);
apiRouter.use("/teachers", requireAdmin, teacherRouters);
import { Router } from "express";
import {
  getAllEnrollments,
  createEnrollment,
  updateEnrollment,
  deleteEnrollment,
} from "../controllers/enrollment.controller.js";

export const enrollmentRouter = Router();

enrollmentRouter.get("/", getAllEnrollments);
enrollmentRouter.post("/", createEnrollment);
enrollmentRouter.put("/:id", updateEnrollment);
enrollmentRouter.delete("/:id", deleteEnrollment);

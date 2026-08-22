import { Router } from "express";
import {
  getAllTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} from "../controllers/teacher.controller.js";

export const teacherRouter = Router();

teacherRouter.get("/", getAllTeachers);
teacherRouter.get("/:id", getTeacherById);
teacherRouter.post("/", createTeacher);
teacherRouter.put("/:id", updateTeacher);
teacherRouter.delete("/:id", deleteTeacher);

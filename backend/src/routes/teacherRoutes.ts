import { Router } from "express";

import {
  getTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} from "../controllers/teacherController.js";

const router = Router();

// GET all teachers
router.get("/", getTeachers);

// GET one teacher
router.get("/:id", getTeacherById);

// CREATE teacher
router.post("/", createTeacher);

// UPDATE teacher
router.put("/:id", updateTeacher);

// DELETE teacher
router.delete("/:id", deleteTeacher);

export default router;

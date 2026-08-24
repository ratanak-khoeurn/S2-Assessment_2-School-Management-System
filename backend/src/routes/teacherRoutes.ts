import { Router } from "express";

import {
  getTeachers,
  getTeacherById,
  createTeacher,
  updateTeacher,
  deleteTeacher,
} from "../controllers/teacherController.js";

const router = Router();

// GET /api/teachers
router.get("/", getTeachers);

// GET /api/teachers/:id
router.get("/:id", getTeacherById);

// POST /api/teachers
router.post("/", createTeacher);

// PUT /api/teachers/:id
router.put("/:id", updateTeacher);

// DELETE /api/teachers/:id
router.delete("/:id", deleteTeacher);

export default router;

import { Router } from "express";
import {
  getAllSubjects,
  getSubjectById,
  createSubject,
  updateSubject,
  deleteSubject,
} from "../controllers/subject.controller.js";

export const subjectRouter = Router();

subjectRouter.get("/", getAllSubjects);
subjectRouter.get("/:id", getSubjectById);
subjectRouter.post("/", createSubject);
subjectRouter.put("/:id", updateSubject);
subjectRouter.delete("/:id", deleteSubject);

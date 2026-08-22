import { Router } from "express";
import {
  getAttendance,
  markBatchAttendance,
  createAttendance,
  updateAttendance,
  deleteAttendance,
} from "../controllers/attendance.controller.js";

export const attendanceRouter = Router();

attendanceRouter.get("/", getAttendance);
attendanceRouter.post("/batch", markBatchAttendance);
attendanceRouter.post("/", createAttendance);
attendanceRouter.put("/:id", updateAttendance);
attendanceRouter.delete("/:id", deleteAttendance);

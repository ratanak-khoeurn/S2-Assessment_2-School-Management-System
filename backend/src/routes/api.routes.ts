import { Router } from "express";
import { getHealth } from "../controllers/api.controller.js";
import { studentRouter } from "./student.routes.js";
import { subjectRouter } from "./subject.routes.js";
import { enrollmentRouter } from "./enrollment.routes.js";
import { attendanceRouter } from "./attendance.routes.js";
import { teacherRouter } from "./teacher.routes.js";

export const apiRouter = Router();

// Health check endpoint
apiRouter.get("/health", getHealth);

// Resource routers
apiRouter.use("/students", studentRouter);
apiRouter.use("/teachers", teacherRouter);
apiRouter.use("/subjects", subjectRouter);
apiRouter.use("/enrollments", enrollmentRouter);
apiRouter.use("/attendance", attendanceRouter);



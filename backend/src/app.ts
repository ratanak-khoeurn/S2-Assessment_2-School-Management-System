import path from "node:path";
import express, { type Express, type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { apiRouter } from "./routes/api.routes.js";
import authRoutes from "./routes/auth.js"
import adminRoutes from "./routes/admin.routes.js"
import { departmentRouter } from "./routes/department.js";

export const createApp = (): Express => {
  const app = express();

  // View engine (server-rendered admin panel)
  app.set("view engine", "ejs");
  app.set("views", path.join(process.cwd(), "views"));

  // Middlewares
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || "http://localhost:5173",
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Root / Health
  app.get("/", (_req: Request, res: Response) => {
    res.status(200).json({
      name: "School Management System API",
      status: "online",
      documentation: "/api/health",
    });
  });

  // Department Routes
  app.use("/departments", departmentRouter);

  // API Routes
  app.use("/api", apiRouter);
  app.use('/auth', authRoutes);

  // Server-rendered admin panel
  app.use('/admin', adminRoutes);

  // 404 handler
  app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: "Route not found" });
  });

  // Global Error Handler
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err.stack);
    res.status(500).json({
      error: "Internal Server Error",
      message: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  });

  return app;
};

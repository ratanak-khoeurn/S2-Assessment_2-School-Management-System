import express, { type Express, type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import { apiRouter } from "./routes/api.routes.js";

export const createApp = (): Express => {
  const app = express();

  // Middlewares
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || "http://localhost:5173",
      credentials: true,
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Root / Health
  app.get("/", (_req: Request, res: Response) => {
    res.status(200).json({
      name: "School Management System API",
      status: "online",
      documentation: "/api/health",
    });
  });

  // API Routes
  app.use("/api", apiRouter);

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

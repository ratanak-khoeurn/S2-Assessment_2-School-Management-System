import { Router } from "express";
import { getHealth } from "../controllers/api.controller.js";

export const apiRouter = Router();

// Health check endpoint
apiRouter.get("/health", getHealth);

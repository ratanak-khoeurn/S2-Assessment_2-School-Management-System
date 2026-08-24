import { Router } from "express";
import { getAdminReport } from "../controllers/reportController.js";

export const reportRouter = Router();

reportRouter.get("/", getAdminReport);

import type { Request, Response } from "express";

export const getHealth = (_req: Request, res: Response): void => {
  res.status(200).json({
    status: "success",
    message: "School Management System API is running",
    timestamp: new Date().toISOString(),
  });
};

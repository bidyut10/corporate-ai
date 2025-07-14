import { Router } from "express";
import {
  generateJobDescription,
  enhanceJobDescription,
} from "../controllers/gemini.controller.js";
import { verifyJWT, verifyPermission } from "../middlewares/auth.middleware.js";

const geminiRouter = Router();

// Protected routes - only authenticated users can use AI features
geminiRouter.use(verifyJWT);

// AI Job Description routes (employer/admin only)
geminiRouter.post("/generate-job-description", verifyPermission(["admin", "employer"]), generateJobDescription);
geminiRouter.post("/enhance-job-description", verifyPermission(["admin", "employer"]), enhanceJobDescription);

export { geminiRouter }; 
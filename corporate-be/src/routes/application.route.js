import { Router } from "express";
import {
  getApplicationsByJob,
  getApplicationById,
  getAllApplications,
} from "../controllers/application.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { createApplication } from "../services/geminiService.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const applicationRouter = Router();

// Create application with resume upload
applicationRouter.post("/", upload.single('resume'), createApplication);

// Get all applications for all jobs of the current user
applicationRouter.get("/all", verifyJWT, getAllApplications);

// Get all applications for a job
applicationRouter.get("/job/:jobId", getApplicationsByJob);

// Get application by id
applicationRouter.get("/:applicationId", getApplicationById);

export { applicationRouter }; 
import { Router } from "express";
import {
  getApplicationsByJob,
  getApplicationById,
} from "../controllers/application.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { createApplication } from "../services/geminiService.js";

const applicationRouter = Router();

// Create application with resume upload
applicationRouter.post("/", upload.single('resume'), createApplication);

// Get all applications for a job
applicationRouter.get("/job/:jobId", getApplicationsByJob);

// Get application by id
applicationRouter.get("/:applicationId", getApplicationById);

export { applicationRouter }; 
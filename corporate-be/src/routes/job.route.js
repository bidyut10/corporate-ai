import { Router } from "express";
import {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getMyJobs,
  toggleJobStatus,
  getJobStats,
} from "../controllers/job.controller.js";
import { verifyJWT, verifyPermission, optionalAuth } from "../middlewares/auth.middleware.js";

const jobRouter = Router();

// Public routes (with optional auth for better UX)
jobRouter.get("/", optionalAuth, getAllJobs);
jobRouter.get("/:jobId", optionalAuth, getJobById);

// Protected routes
jobRouter.use(verifyJWT);

// Job management routes (employer/admin only)
jobRouter.post("/", verifyPermission(["admin", "employer"]), createJob);
jobRouter.get("/my/jobs", verifyPermission(["admin", "employer"]), getMyJobs);
jobRouter.patch("/:jobId", verifyPermission(["admin", "employer"]), updateJob);
jobRouter.delete("/:jobId", verifyPermission(["admin", "employer"]), deleteJob);
jobRouter.patch("/:jobId/status", verifyPermission(["admin", "employer"]), toggleJobStatus);
jobRouter.get("/stats/overview", verifyPermission(["admin", "employer"]), getJobStats);

export { jobRouter }; 
import { Job } from "../models/job.model.js";
import { Application } from "../models/application.model.js";

// Create a new job
const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      skills,
      salary,
      experience,
      jobType,
    } = req.body;

    if (!title || !description || !location) {
      return res.status(400).json({ status: false, message: "Title, description, and location are required" });
    }

    const job = await Job.create({
      title,
      description,
      location,
      skills: skills || [],
      salary,
      experience,
      jobType,
      createdBy: req.user._id,
    });

    const createdJob = await Job.findById(job._id).populate("createdBy", "name email");

    return res.status(201).json({
      status: true,
      data: createdJob,
      message: "Job created successfully"
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: "Internal server error" });
  }
};

// Get all jobs with filtering and pagination
const getAllJobs = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search,
      location,
      jobType,
      status = "active",
    } = req.query;

    const query = { isDeleted: false, status };

    // Add search filter
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { skills: { $in: [new RegExp(search, "i")] } },
      ];
    }

    // Add location filter
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    // Add job type filter
    if (jobType) {
      query.jobType = jobType;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const jobs = await Job.find(query)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalJobs = await Job.countDocuments(query);

    return res.status(200).json({
      status: true,
      data: {
        jobs,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalJobs,
          pages: Math.ceil(totalJobs / parseInt(limit)),
        },
      },
      message: "Jobs fetched successfully"
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: "Internal server error" });
  }
};

// Get job by ID
const getJobById = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findOne({ jobId, isDeleted: false })
      .populate("createdBy", "name email")
      .populate("applicationsCount");

    if (!job) {
      return res.status(404).json({ status: false, message: "Job not found" });
    }

    return res.status(200).json({
      status: true,
      data: job,
      message: "Job fetched successfully"
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: "Internal server error" });
  }
};

// Update job
const updateJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const updateData = req.body;

    const job = await Job.findOne({ jobId, isDeleted: false });

    if (!job) {
      return res.status(404).json({ status: false, message: "Job not found" });
    }

    // Check if user is the creator or admin
    if (job.createdBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ status: false, message: "You don't have permission to update this job" });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      job._id,
      {
        $set: updateData,
      },
      { new: true }
    ).populate("createdBy", "name email");

    return res.status(200).json({
      status: true,
      data: updatedJob,
      message: "Job updated successfully"
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: "Internal server error" });
  }
};

// Soft delete job
const deleteJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findOne({ jobId, isDeleted: false });

    if (!job) {
      return res.status(404).json({ status: false, message: "Job not found" });
    }

    // Check if user is the creator or admin
    if (job.createdBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ status: false, message: "You don't have permission to delete this job" });
    }

    await job.softDelete();

    return res.status(200).json({
      status: true,
      message: "Job deleted successfully"
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: "Internal server error" });
  }
};

// Get jobs created by current user
const getMyJobs = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const query = { createdBy: req.user._id, isDeleted: false };

    if (status) {
      query.status = status;
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    const jobs = await Job.find(query)
      .populate("applicationsCount")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalJobs = await Job.countDocuments(query);

    return res.status(200).json({
      status: true,
      data: {
        jobs,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: totalJobs,
          pages: Math.ceil(totalJobs / parseInt(limit)),
        },
      },
      message: "Jobs fetched successfully"
    });
  } catch (error) {
    console.log(error);
    
    return res.status(500).json({ status: false, message: "Internal server error" });
  }
};

// Activate/Deactivate job
const toggleJobStatus = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { status } = req.body;

    if (!["active", "inactive", "closed"].includes(status)) {
      return res.status(400).json({ status: false, message: "Invalid status. Must be active, inactive, or closed" });
    }

    const job = await Job.findOne({ jobId, isDeleted: false });

    if (!job) {
      return res.status(404).json({ status: false, message: "Job not found" });
    }

    // Check if user is the creator or admin
    if (job.createdBy.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ status: false, message: "You don't have permission to update this job" });
    }

    job.status = status;
    if (status === "closed") {
      job.isDeleted = true;
    }

    await job.save();

    return res.status(200).json({
      status: true,
      data: job,
      message: "Job status updated successfully"
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: "Internal server error" });
  }
};

// Get job statistics (admin/employer only)
const getJobStats = async (req, res) => {
  try {
    const query = { isDeleted: false };

    // If not admin, only show user's jobs
    if (req.user.role !== "admin") {
      query.createdBy = req.user._id;
    }

    const totalJobs = await Job.countDocuments(query);
    const activeJobs = await Job.countDocuments({ ...query, status: "active" });
    const inactiveJobs = await Job.countDocuments({ ...query, status: "inactive" });
    const closedJobs = await Job.countDocuments({ ...query, status: "closed" });

    const stats = {
      total: totalJobs,
      active: activeJobs,
      inactive: inactiveJobs,
      closed: closedJobs,
    };

    return res.status(200).json({
      status: true,
      data: stats,
      message: "Job statistics fetched successfully"
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: "Internal server error" });
  }
};

export {
  createJob,
  getAllJobs,
  getJobById,
  updateJob,
  deleteJob,
  getMyJobs,
  toggleJobStatus,
  getJobStats,
}; 
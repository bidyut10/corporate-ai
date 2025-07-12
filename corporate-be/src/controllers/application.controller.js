import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import cloudinary from "../config/cloudinary.js";

// Get all applications for a job with filtering and sorting
export const getApplicationsByJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const {
      status,
      minScore,
      maxScore,
      sortBy = 'appliedAt',
      sortOrder = 'desc',
      page = 1,
      limit = 10
    } = req.query;

    // Find job
    let job = null;
    if (jobId.length === 24 && /^[0-9a-fA-F]{24}$/.test(jobId)) {
      job = await Job.findById(jobId);
    }
    if (!job) {
      job = await Job.findOne({ jobId: jobId });
    }
    if (!job) {
      return res.status(404).json({
        status: false,
        message: "Job not found"
      });
    }

    // Build query filters
    const filters = { jobId: job._id };

    if (status) {
      filters.status = status;
    }

    if (minScore || maxScore) {
      filters.aiScore = {};
      if (minScore) filters.aiScore.$gte = parseInt(minScore);
      if (maxScore) filters.aiScore.$lte = parseInt(maxScore);
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Get applications with pagination
    const applications = await Application.find(filters)
      .populate('jobId', 'title description experience salary location status')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit));

    // Get total count for pagination
    const totalApplications = await Application.countDocuments(filters);

    return res.status(200).json({
      status: true,
      data: applications,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalApplications / parseInt(limit)),
        totalApplications,
        hasNextPage: skip + applications.length < totalApplications,
        hasPrevPage: parseInt(page) > 1
      },
      jobDetails: {
        title: job.title,
        status: job.status,
        totalApplications
      }
    });
  } catch (error) {
    console.error("Get applications error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error"
    });
  }
};

// Get application by ID with full details
export const getApplicationById = async (req, res) => {
  try {
    const { applicationId } = req.params;

    if (!applicationId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        status: false,
        message: "Invalid application ID format"
      });
    }

    const application = await Application.findById(applicationId)
      .populate('jobId', 'title description experience salary skills location status requirements');

    if (!application) {
      return res.status(404).json({
        status: false,
        message: "Application not found"
      });
    }

    return res.status(200).json({
      status: true,
      data: application
    });
  } catch (error) {
    console.error("Get application error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error"
    });
  }
};

// Update application status
export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'reviewing', 'shortlisted', 'rejected', 'hired'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        status: false,
        message: "Invalid status. Must be one of: " + validStatuses.join(', ')
      });
    }

    const application = await Application.findByIdAndUpdate(
      applicationId,
      { status, lastUpdated: new Date() },
      { new: true }
    ).populate('jobId', 'title');

    if (!application) {
      return res.status(404).json({
        status: false,
        message: "Application not found"
      });
    }

    return res.status(200).json({
      status: true,
      data: application,
      message: "Application status updated successfully"
    });
  } catch (error) {
    console.error("Update application status error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error"
    });
  }
};

// Delete application (with resume cleanup)
export const deleteApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({
        status: false,
        message: "Application not found"
      });
    }

    // Delete resume from Cloudinary
    try {
      await cloudinary.uploader.destroy(application.resumePublicId, { resource_type: 'raw' });
    } catch (cloudinaryError) {
      console.error("Failed to delete resume from Cloudinary:", cloudinaryError);
    }

    // Delete application from database
    await Application.findByIdAndDelete(applicationId);

    return res.status(200).json({
      status: true,
      message: "Application deleted successfully"
    });
  } catch (error) {
    console.error("Delete application error:", error);
    return res.status(500).json({
      status: false,
      message: "Internal server error"
    });
  }
};
import mongoose from "mongoose";
import shortid from "shortid";

const JobSchema = new mongoose.Schema(
  {
    jobId: {
      type: String,
      unique: true,
      default: () => shortid.generate(),
      index: true,
    },
    title: {
      type: String,
      required: [true, "Job title is required"],
      trim: true,
      maxLength: [100, "Job title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Job description is required"],
      trim: true,
      maxLength: [2000, "Job description cannot exceed 2000 characters"],
    },
    location: {
      type: String,
      required: [true, "Job location is required"],
      trim: true,
      maxLength: [100, "Location cannot exceed 100 characters"],
    },
    skills: [{
      type: String,
      trim: true,
      maxLength: [50, "Skill name cannot exceed 50 characters"],
    }],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Job creator is required"],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "closed"],
      default: "active",
    },
    salary: {
      min: {
        type: Number,
        min: 0,
      },
      max: {
        type: Number,
        min: 0,
      },
      currency: {
        type: String,
        default: "USD",
        enum: ["USD", "EUR", "GBP", "INR"],
      },
    },
    experience: {
      min: {
        type: Number,
        min: 0,
        default: 0,
      },
      max: {
        type: Number,
        min: 0,
        default: 10,
      },
    },
    jobType: {
      type: String,
      enum: ["full-time", "part-time", "contract", "internship", "freelance"],
      default: "full-time",
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for applications count
JobSchema.virtual('applicationsCount', {
  ref: 'Application',
  localField: '_id',
  foreignField: 'jobId',
  count: true,
});

// Method to soft delete job
JobSchema.methods.softDelete = async function () {
  this.isDeleted = true;
  this.status = "closed";
  return await this.save();
};

// Method to activate job
JobSchema.methods.activate = async function () {
  this.isDeleted = false;
  this.status = "active";
  return await this.save();
};

// Index for better query performance
JobSchema.index({ jobId: 1, isDeleted: 1 });
JobSchema.index({ createdBy: 1, isDeleted: 1 });
JobSchema.index({ status: 1, isDeleted: 1 });
JobSchema.index({ location: 1, isDeleted: 1 });
JobSchema.index({ skills: 1, isDeleted: 1 });

export const Job = mongoose.model("Job", JobSchema); 
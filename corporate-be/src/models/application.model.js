import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema({
  // Job Reference
  jobId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job',
    required: true,
    index: true
  },

  // Personal Information
  applicantName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },

  applicantEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },

  phone: {
    type: String,
    required: true,
    trim: true,
    match: [/^[0-9+\-\s()]+$/, 'Please enter a valid phone number']
  },

  // Professional Links
  linkedin: {
    type: String,
    trim: true,
    match: [/^https?:\/\/(www\.)?linkedin\.com\/.*$/, 'Please enter a valid LinkedIn URL']
  },

  github: {
    type: String,
    trim: true,
    match: [/^https?:\/\/(www\.)?github\.com\/.*$/, 'Please enter a valid GitHub URL']
  },

  portfolio: {
    type: String,
    trim: true,
    match: [/^https?:\/\/.*$/, 'Please enter a valid portfolio URL']
  },

  // Job-related Information
  salaryExpectation: {
    type: Number,
    required: true,
    min: 0
  },

  experienceYears: {
    type: Number,
    required: true,
    min: 0,
    max: 50
  },

  noticePeriod: {
    type: Number,
    required: true,
    min: 0,
    max: 365 // days
  },

  // Resume Information
  resumeUrl: {
    type: String,
    required: true
  },

  resumePublicId: {
    type: String, // Cloudinary public ID for deletion
    required: true
  },

  // Basic AI Analysis Results (Original Schema)
  aiScore: {
    type: Number,
    min: 0,
    max: 100,
    default: null
  },

  aiHighlights: [{
    type: String,
    trim: true
  }],

  aiDetails: {
    type: String,
    trim: true
  },

  aiKeyPoints: [{
    type: String,
    trim: true
  }],

  // Enhanced AI Analysis Results
  aiCategoryScores: {
    technicalSkills: {
      type: Number,
      min: 0,
      max: 100,
      default: null
    },
    experienceRelevance: {
      type: Number,
      min: 0,
      max: 100,
      default: null
    },
    educationCertifications: {
      type: Number,
      min: 0,
      max: 100,
      default: null
    },
    projectsPortfolio: {
      type: Number,
      min: 0,
      max: 100,
      default: null
    },
    salaryAvailability: {
      type: Number,
      min: 0,
      max: 100,
      default: null
    },
    culturalFit: {
      type: Number,
      min: 0,
      max: 100,
      default: null
    },
    profileQuality: {
      type: Number,
      min: 0,
      max: 100,
      default: null
    }
  },

  aiConcerns: [{
    type: String,
    trim: true
  }],

  aiTechnicalSkills: [{
    type: String,
    trim: true
  }],

  aiExperienceHighlights: [{
    type: String,
    trim: true
  }],

  aiEducationDetails: [{
    type: String,
    trim: true
  }],

  aiProjectsAchievements: [{
    type: String,
    trim: true
  }],

  aiRecommendation: {
    type: String,
    enum: ['HIGHLY RECOMMENDED', 'RECOMMENDED', 'CONDITIONALLY RECOMMENDED', 'NOT RECOMMENDED', 'MANUAL REVIEW REQUIRED'],
    default: null
  },

  aiNextSteps: [{
    type: String,
    trim: true
  }],

  aiSalaryAssessment: {
    candidateExpectation: {
      type: Number,
      min: 0
    },
    budgetAlignment: {
      type: String,
      enum: ['Within Range', 'Above Range', 'Below Range', 'Manual Review Required'],
      default: null
    },
    negotiationPotential: {
      type: String,
      enum: ['High', 'Moderate', 'Low', 'Unknown'],
      default: null
    },
    marketRate: {
      type: String,
      enum: ['Above Market', 'Competitive', 'Below Market', 'Needs Assessment'],
      default: null
    }
  },

  // AI Analysis Metadata
  aiAnalysisStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'manual_review'],
    default: 'pending'
  },

  aiAnalysisDate: {
    type: Date,
    default: null
  },

  aiAnalysisVersion: {
    type: String,
    default: '1.0'
  },

  // Application Status
  status: {
    type: String,
    enum: ['pending', 'reviewing', 'shortlisted', 'interviewed', 'rejected', 'hired'],
    default: 'pending'
  },

  // HR Notes and Comments
  hrNotes: [{
    note: {
      type: String,
      trim: true
    },
    addedBy: {
      type: String,
      trim: true
    },
    addedAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Interview Information
  interviews: [{
    type: {
      type: String,
      enum: ['phone', 'video', 'in-person', 'technical', 'final'],
      required: true
    },
    scheduledAt: {
      type: Date,
      required: true
    },
    conductedBy: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled', 'rescheduled'],
      default: 'scheduled'
    },
    feedback: {
      type: String,
      trim: true
    },
    score: {
      type: Number,
      min: 0,
      max: 100
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],

  // Tracking Information
  appliedAt: {
    type: Date,
    default: Date.now
  },

  lastUpdated: {
    type: Date,
    default: Date.now
  },

  // Source tracking
  applicationSource: {
    type: String,
    enum: ['website', 'linkedin', 'referral', 'job_board', 'other'],
    default: 'website'
  },

  referralSource: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
applicationSchema.index({ jobId: 1, applicantEmail: 1 }, { unique: true });
applicationSchema.index({ jobId: 1, phone: 1 }, { unique: true });
applicationSchema.index({ aiScore: -1 });
applicationSchema.index({ appliedAt: -1 });
applicationSchema.index({ status: 1 });
applicationSchema.index({ aiRecommendation: 1 });
applicationSchema.index({ 'aiCategoryScores.technicalSkills': -1 });
applicationSchema.index({ 'aiCategoryScores.experienceRelevance': -1 });

// Compound indexes for advanced queries
applicationSchema.index({ jobId: 1, aiScore: -1, status: 1 });
applicationSchema.index({ jobId: 1, aiRecommendation: 1, appliedAt: -1 });

// Text search index for searching applications
applicationSchema.index({
  applicantName: 'text',
  applicantEmail: 'text',
  'aiTechnicalSkills': 'text',
  'aiExperienceHighlights': 'text'
});

// Virtual for overall recommendation strength
applicationSchema.virtual('recommendationStrength').get(function () {
  const recommendations = {
    'HIGHLY RECOMMENDED': 4,
    'RECOMMENDED': 3,
    'CONDITIONALLY RECOMMENDED': 2,
    'NOT RECOMMENDED': 1,
    'MANUAL REVIEW REQUIRED': 0
  };
  return recommendations[this.aiRecommendation] || 0;
});

// Virtual for AI analysis completeness
applicationSchema.virtual('aiAnalysisComplete').get(function () {
  return this.aiScore !== null &&
    this.aiHighlights && this.aiHighlights.length > 0 &&
    this.aiDetails &&
    this.aiRecommendation;
});

export const Application = mongoose.model('Application', applicationSchema);
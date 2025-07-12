import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import cloudinary from "../config/cloudinary.js";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../config/index.js";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);

/**
 * Enhanced prompt for comprehensive resume analysis
 */
function buildComprehensiveResumeAnalysisPrompt({ userDetails, jobDetails, resumeBuffer }) {
  const jobExperience = typeof jobDetails.experience === 'object'
    ? `${jobDetails.experience.min || 0}-${jobDetails.experience.max || 'N/A'} years`
    : `${jobDetails.experience || 'N/A'} years`;

  const jobSalary = typeof jobDetails.salary === 'object'
    ? `${jobDetails.salary.min || 0}-${jobDetails.salary.max || 'N/A'} ${jobDetails.salary.currency || 'USD'}`
    : `${jobDetails.salary || 'N/A'}`;

  return `
You are an expert AI recruiter and resume analyst. Your task is to comprehensively analyze a candidate's application for a specific job position. You will receive:

1. Job details and requirements
2. Candidate's personal and professional information
3. Resume content (PDF)

Please analyze ALL aspects and provide a detailed assessment.

---

🎯 JOB POSITION DETAILS:
Title: ${jobDetails.title}
Company: ${jobDetails.company || 'Not specified'}
Description: ${jobDetails.description}
Required Experience: ${jobExperience}
Salary Range: ${jobSalary}
Required Skills: ${jobDetails.skills ? jobDetails.skills.join(', ') : 'Not specified'}
Location: ${jobDetails.location || 'Not specified'}
Employment Type: ${jobDetails.employmentType || 'Not specified'}
Requirements: ${jobDetails.requirements || 'See job description'}

---

👤 CANDIDATE PROFILE:
Name: ${userDetails.name}
Email: ${userDetails.email}
Phone: ${userDetails.phone}
LinkedIn: ${userDetails.linkedin || 'Not provided'}
GitHub: ${userDetails.github || 'Not provided'}
Portfolio: ${userDetails.portfolio || 'Not provided'}
Expected Salary: ${userDetails.salaryExpectation}
Experience Years: ${userDetails.experienceYears} years
Notice Period: ${userDetails.noticePeriod} days

---

📄 RESUME ANALYSIS INSTRUCTIONS:
Please analyze the uploaded resume PDF and extract:
- Technical skills and proficiencies
- Work experience and achievements
- Education and certifications
- Projects and contributions
- Leadership and soft skills
- Any relevant accomplishments

---

🔍 COMPREHENSIVE EVALUATION CRITERIA:
1. **Technical Skills Match (30%)** - How well do the candidate's technical skills align with job requirements?
2. **Experience Relevance (25%)** - Quality and relevance of work experience vs. job requirements
3. **Education & Certifications (10%)** - Academic background and professional certifications
4. **Projects & Portfolio (15%)** - Quality of personal projects, GitHub contributions, portfolio
5. **Salary & Availability (10%)** - Salary expectations vs. budget, notice period feasibility
6. **Cultural Fit Indicators (5%)** - Communication skills, leadership experience, adaptability
7. **Overall Profile Quality (5%)** - Resume quality, professional presentation, completeness

---

📊 REQUIRED RESPONSE FORMAT:
You must return ONLY a valid JSON object with this exact structure:

{
  "overallScore": 85,
  "categoryScores": {
    "technicalSkills": 90,
    "experienceRelevance": 85,
    "educationCertifications": 80,
    "projectsPortfolio": 88,
    "salaryAvailability": 75,
    "culturalFit": 85,
    "profileQuality": 90
  },
  "strengths": [
    "Strong technical skills in React, Node.js, and MongoDB",
    "5+ years of relevant full-stack development experience",
    "Impressive GitHub portfolio with 50+ repositories",
    "Salary expectation within budget range",
    "Active open-source contributor"
  ],
  "concerns": [
    "Limited experience with specific framework mentioned in job",
    "Notice period slightly longer than preferred"
  ],
  "keyHighlights": [
    "Led development of 3 major web applications serving 100K+ users",
    "Expertise in modern JavaScript frameworks and cloud technologies",
    "Strong problem-solving skills demonstrated through complex projects",
    "Excellent communication skills evident from technical writing"
  ],
  "technicalSkillsFound": [
    "JavaScript (Expert)",
    "React (Advanced)",
    "Node.js (Advanced)",
    "MongoDB (Intermediate)",
    "AWS (Intermediate)",
    "Docker (Basic)"
  ],
  "experienceHighlights": [
    "Senior Full Stack Developer at TechCorp (2022-2024)",
    "Full Stack Developer at StartupXYZ (2020-2022)",
    "Freelance Web Developer (2018-2020)"
  ],
  "educationDetails": [
    "Bachelor of Science in Computer Science - University XYZ (2018)",
    "AWS Certified Developer Associate (2023)",
    "MongoDB Certified Developer (2022)"
  ],
  "projectsAndAchievements": [
    "Built e-commerce platform handling 10K+ daily transactions",
    "Developed real-time chat application with 1000+ concurrent users",
    "Created open-source library with 500+ GitHub stars"
  ],
  "recommendationScore": 85,
  "recommendation": "HIGHLY RECOMMENDED",
  "detailedAnalysis": "This candidate demonstrates exceptional technical competency and relevant experience for the Senior Full Stack Developer position. Their skill set aligns perfectly with our requirements, showing deep expertise in React, Node.js, and modern web technologies. The portfolio showcases impressive projects with real-world impact, and their open-source contributions indicate strong collaboration skills. While the notice period is slightly longer than ideal, the candidate's overall profile makes them a strong fit for our team culture and technical requirements.",
  "nextSteps": [
    "Schedule technical interview to assess coding skills",
    "Conduct system design discussion",
    "Cultural fit interview with team members",
    "Reference check with previous employers"
  ],
  "salaryAssessment": {
    "candidateExpectation": ${userDetails.salaryExpectation},
    "budgetAlignment": "Within Range",
    "negotiationPotential": "Moderate",
    "marketRate": "Competitive"
  }
}

---

❗ CRITICAL REQUIREMENTS:
- Return ONLY the JSON object above
- No markdown formatting, code blocks, or explanations
- All scores must be integers between 0-100
- Arrays should contain 3-7 relevant items
- Be specific and evidence-based in your analysis
- Extract actual information from the resume content
- Recommendation should be: "HIGHLY RECOMMENDED", "RECOMMENDED", "CONDITIONALLY RECOMMENDED", or "NOT RECOMMENDED"
- Provide actionable insights for hiring decision
`;
}

/**
 * Analyze resume and application with Gemini AI
 */
async function analyzeApplicationWithGemini(userDetails, jobDetails, resumeBuffer) {
  try {
    if (!config.GEMINI_API_KEY) {
      throw new Error("Gemini API key not configured");
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.2, // Lower temperature for more consistent analysis
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 2000,
      }
    });

    const prompt = buildComprehensiveResumeAnalysisPrompt({
      userDetails,
      jobDetails,
      resumeBuffer
    });

    console.log("Analyzing application with Gemini AI...");

    // Convert resume buffer to base64 for Gemini
    const resumeBase64 = resumeBuffer.toString('base64');

    const parts = [
      {
        text: prompt
      },
      {
        inlineData: {
          mimeType: "application/pdf",
          data: resumeBase64
        }
      }
    ];

    const result = await model.generateContent(parts);
    const response = await result.response;
    const text = response.text();

    console.log("Gemini AI Analysis Response:", text);

    // Clean and parse response
    const cleanText = text.trim()
      .replace(/```json\s*/, '')
      .replace(/```\s*$/, '')
      .replace(/^```/, '')
      .replace(/```$/, '');

    let analysis;
    try {
      analysis = JSON.parse(cleanText);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      console.error("Raw response:", text);
      throw new Error("Invalid JSON response from AI");
    }

    // Validate response structure
    if (!analysis.overallScore || !analysis.categoryScores || !analysis.strengths || !analysis.recommendation) {
      throw new Error("Invalid analysis structure from AI");
    }

    // Ensure score is within valid range
    analysis.overallScore = Math.max(0, Math.min(100, parseInt(analysis.overallScore)));

    return {
      success: true,
      data: analysis
    };

  } catch (error) {
    console.error("Gemini AI Analysis Error:", error);

    // Return enhanced fallback analysis
    return generateEnhancedFallbackAnalysis(userDetails, jobDetails);
  }
}

/**
 * Generate fallback analysis when AI fails
 */
function generateEnhancedFallbackAnalysis(userDetails, jobDetails) {
  const baseScore = 60;
  const experienceBonus = Math.min(20, userDetails.experienceYears * 2);
  const profileBonus = (userDetails.linkedin ? 5 : 0) + (userDetails.github ? 5 : 0) + (userDetails.portfolio ? 5 : 0);
  const overallScore = Math.min(100, baseScore + experienceBonus + profileBonus);

  return {
    success: true,
    data: {
      overallScore: overallScore,
      categoryScores: {
        technicalSkills: overallScore - 10,
        experienceRelevance: overallScore - 5,
        educationCertifications: overallScore - 15,
        projectsPortfolio: overallScore - 20,
        salaryAvailability: overallScore,
        culturalFit: overallScore - 5,
        profileQuality: overallScore - 10
      },
      strengths: [
        `${userDetails.experienceYears} years of professional experience`,
        userDetails.linkedin && "Professional LinkedIn profile available",
        userDetails.github && "GitHub profile with code repositories",
        userDetails.portfolio && "Personal portfolio website",
        "Complete application with all required information"
      ].filter(Boolean),
      concerns: [
        "AI analysis unavailable - manual review required",
        "Unable to analyze resume content automatically"
      ],
      keyHighlights: [
        `${userDetails.experienceYears} years of experience in the field`,
        `Salary expectation: ${userDetails.salaryExpectation}`,
        `Notice period: ${userDetails.noticePeriod} days`,
        "Application submitted with complete information"
      ],
      technicalSkillsFound: ["Manual review required"],
      experienceHighlights: [`${userDetails.experienceYears} years of professional experience`],
      educationDetails: ["Details available in resume"],
      projectsAndAchievements: ["Review portfolio and GitHub for projects"],
      recommendationScore: overallScore,
      recommendation: overallScore >= 80 ? "RECOMMENDED" : overallScore >= 60 ? "CONDITIONALLY RECOMMENDED" : "MANUAL REVIEW REQUIRED",
      detailedAnalysis: `Application received from ${userDetails.name} with ${userDetails.experienceYears} years of experience. Salary expectation is ${userDetails.salaryExpectation} with a notice period of ${userDetails.noticePeriod} days. Manual review of resume content is required as AI analysis was unavailable.`,
      nextSteps: [
        "Manual resume review required",
        "Verify technical skills through interview",
        "Assess cultural fit",
        "Check references"
      ],
      salaryAssessment: {
        candidateExpectation: userDetails.salaryExpectation,
        budgetAlignment: "Manual Review Required",
        negotiationPotential: "Unknown",
        marketRate: "Needs Assessment"
      }
    }
  };
}

/**
 * Create a new job application with AI analysis
 */
export const createApplication = async (req, res) => {
  try {
    const {
      jobId,
      applicantName,
      applicantEmail,
      phone,
      linkedin,
      github,
      portfolio,
      salaryExpectation,
      experienceYears,
      noticePeriod
    } = req.body;

    // Validate required fields
    if (!jobId || !applicantName || !applicantEmail || !phone ||
      !salaryExpectation || !experienceYears || !noticePeriod) {
      return res.status(400).json({
        status: false,
        message: "Missing required fields: jobId, applicantName, applicantEmail, phone, salaryExpectation, experienceYears, noticePeriod"
      });
    }

    // Validate and parse numeric fields
    const parsedSalary = parseFloat(salaryExpectation);
    const parsedExperience = parseInt(experienceYears);
    const parsedNoticePeriod = parseInt(noticePeriod);

    if (isNaN(parsedSalary) || parsedSalary < 0) {
      return res.status(400).json({
        status: false,
        message: "Invalid salary expectation"
      });
    }

    if (isNaN(parsedExperience) || parsedExperience < 0 || parsedExperience > 50) {
      return res.status(400).json({
        status: false,
        message: "Invalid experience years (0-50)"
      });
    }

    if (isNaN(parsedNoticePeriod) || parsedNoticePeriod < 0 || parsedNoticePeriod > 365) {
      return res.status(400).json({
        status: false,
        message: "Invalid notice period (0-365 days)"
      });
    }

    // Validate resume file
    if (!req.file) {
      return res.status(400).json({
        status: false,
        message: "Resume file is required"
      });
    }

    if (req.file.mimetype !== 'application/pdf') {
      return res.status(400).json({
        status: false,
        message: "Only PDF files are allowed"
      });
    }

    if (req.file.size > 5 * 1024 * 1024) { // 5MB limit
      return res.status(400).json({
        status: false,
        message: "Resume file size must be less than 5MB"
      });
    }

    // Find and validate job
    let job = null;
    console.log('Looking for job with ID:', jobId);

    // Check if jobId is a valid MongoDB ObjectId
    if (jobId.length === 24 && /^[0-9a-fA-F]{24}$/.test(jobId)) {
      job = await Job.findById(jobId);
    }

    // If not found by _id, try custom jobId field
    if (!job) {
      job = await Job.findOne({ jobId: jobId });
    }

    if (!job) {
      return res.status(404).json({
        status: false,
        message: "Job not found"
      });
    }

    if (job.status !== 'active') {
      return res.status(400).json({
        status: false,
        message: "This job is not accepting applications"
      });
    }

    // Check for duplicate applications
    const existingApplication = await Application.findOne({
      jobId: job._id,
      $or: [
        { applicantEmail: applicantEmail.toLowerCase() },
        { phone: phone.trim() }
      ]
    });

    if (existingApplication) {
      return res.status(409).json({
        status: false,
        message: "You have already applied for this job"
      });
    }

    // Create unique filename for resume
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substr(2, 9);
    const originalName = req.file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const resumeFileName = `${applicantName.replace(/[^a-zA-Z0-9]/g, '_')}_${timestamp}_${originalName}`;

    // Upload resume to Cloudinary
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'job-applications/resumes',
          resource_type: 'raw',
          format: 'pdf',
          public_id: `resume_${timestamp}_${randomString}`,
          original_filename: resumeFileName
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(new Error('Failed to upload resume'));
          } else {
            resolve(result);
          }
        }
      );
      uploadStream.end(req.file.buffer);
    });

    // Prepare user details for AI analysis
    const userDetails = {
      name: applicantName.trim(),
      email: applicantEmail.toLowerCase(),
      phone: phone.trim(),
      linkedin: linkedin?.trim() || null,
      github: github?.trim() || null,
      portfolio: portfolio?.trim() || null,
      salaryExpectation: parsedSalary,
      experienceYears: parsedExperience,
      noticePeriod: parsedNoticePeriod
    };

    // Analyze application with Gemini AI
    const aiAnalysis = await analyzeApplicationWithGemini(
      userDetails,
      job,
      req.file.buffer
    );

    // Prepare application data
    const applicationData = {
      jobId: job._id,
      applicantName: applicantName.trim(),
      applicantEmail: applicantEmail.toLowerCase(),
      phone: phone.trim(),
      linkedin: linkedin?.trim() || undefined,
      github: github?.trim() || undefined,
      portfolio: portfolio?.trim() || undefined,
      salaryExpectation: parsedSalary,
      experienceYears: parsedExperience,
      noticePeriod: parsedNoticePeriod,
      resumeUrl: uploadResult.secure_url,
      resumePublicId: uploadResult.public_id
    };

    // Add AI analysis results if available
    if (aiAnalysis.success && aiAnalysis.data) {
      const analysis = aiAnalysis.data;

      // Map the comprehensive analysis to schema fields
      applicationData.aiScore = analysis.overallScore;
      applicationData.aiHighlights = analysis.strengths || [];
      applicationData.aiDetails = analysis.detailedAnalysis || '';
      applicationData.aiKeyPoints = analysis.keyHighlights || [];

      // Store additional analysis data (you might want to add these fields to your schema)
      applicationData.aiCategoryScores = analysis.categoryScores;
      applicationData.aiConcerns = analysis.concerns;
      applicationData.aiTechnicalSkills = analysis.technicalSkillsFound;
      applicationData.aiExperienceHighlights = analysis.experienceHighlights;
      applicationData.aiEducationDetails = analysis.educationDetails;
      applicationData.aiProjectsAchievements = analysis.projectsAndAchievements;
      applicationData.aiRecommendation = analysis.recommendation;
      applicationData.aiNextSteps = analysis.nextSteps;
      applicationData.aiSalaryAssessment = analysis.salaryAssessment;
    }

    // Create application
    const application = await Application.create(applicationData);

    // Populate job details for response
    await application.populate('jobId', 'title description experience salary location company');

    return res.status(201).json({
      status: true,
      data: application,
      message: "Application submitted successfully",
      analysis: aiAnalysis.success ? {
        score: aiAnalysis.data.overallScore,
        recommendation: aiAnalysis.data.recommendation,
        highlights: aiAnalysis.data.strengths?.slice(0, 3) // Show top 3 strengths
      } : null
    });

  } catch (error) {
    console.error("Application creation error:", error);

    // Handle specific mongoose validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({
        status: false,
        message: "Validation error: " + validationErrors.join(', ')
      });
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({
        status: false,
        message: "You have already applied for this job"
      });
    }

    return res.status(500).json({
      status: false,
      message: "Internal server error"
    });
  }
};
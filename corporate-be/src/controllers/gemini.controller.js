import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../config/index.js";

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);

/**
 * Generate job description using Gemini AI
 */
export const generateJobDescription = async (req, res) => {
  try {
    const { prompt, jobDetails } = req.body;

    if (!prompt || !prompt.trim()) {
      return res.status(400).json({
        success: false,
        message: "Prompt is required"
      });
    }

    if (!config.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "AI service is not configured"
      });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.7,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 2000,
      }
    });

    // Build comprehensive prompt
    const enhancedPrompt = buildJobDescriptionPrompt(prompt, jobDetails);

    const result = await model.generateContent(enhancedPrompt);
    const response = await result.response;
    const generatedDescription = response.text();

    // Clean up the response
    const cleanDescription = generatedDescription
      .trim()
      .replace(/^```html\s*/, '')
      .replace(/```\s*$/, '')
      .replace(/^```/, '')
      .replace(/```$/, '');

    res.status(200).json({
      success: true,
      data: {
        description: cleanDescription
      }
    });

  } catch (error) {
    console.error("Error generating job description:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate job description. Please try again."
    });
  }
};

/**
 * Enhance existing job description using Gemini AI
 */
export const enhanceJobDescription = async (req, res) => {
  try {
    const { currentDescription, enhancementPrompt } = req.body;

    if (!currentDescription || !enhancementPrompt) {
      return res.status(400).json({
        success: false,
        message: "Current description and enhancement prompt are required"
      });
    }

    if (!config.GEMINI_API_KEY) {
      return res.status(500).json({
        success: false,
        message: "AI service is not configured"
      });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.6,
        topP: 0.8,
        topK: 40,
        maxOutputTokens: 2500,
      }
    });

    // Build enhancement prompt
    const enhancedPrompt = buildEnhancementPrompt(currentDescription, enhancementPrompt);

    const result = await model.generateContent(enhancedPrompt);
    const response = await result.response;
    const enhancedDescription = response.text();

    // Clean up the response
    const cleanDescription = enhancedDescription
      .trim()
      .replace(/^```html\s*/, '')
      .replace(/```\s*$/, '')
      .replace(/^```/, '')
      .replace(/```$/, '');

    res.status(200).json({
      success: true,
      data: {
        description: cleanDescription
      }
    });

  } catch (error) {
    console.error("Error enhancing job description:", error);
    res.status(500).json({
      success: false,
      message: "Failed to enhance job description. Please try again."
    });
  }
};

/**
 * Build comprehensive prompt for job description generation
 */
function buildJobDescriptionPrompt(userPrompt, jobDetails = {}) {
  const jobInfo = {
    title: jobDetails.title || "Not specified",
    location: jobDetails.location || "Not specified",
    skills: jobDetails.skills ? jobDetails.skills.join(', ') : "Not specified",
    jobType: jobDetails.jobType || "Not specified",
    experience: jobDetails.experience ? 
      `${jobDetails.experience.min || 0}-${jobDetails.experience.max || 'N/A'} years` : 
      "Not specified",
    salary: jobDetails.salary ? 
      `${jobDetails.salary.min || 0}-${jobDetails.salary.max || 'N/A'} ${jobDetails.salary.currency || 'USD'}` : 
      "Not specified"
  };

  return `
You are an expert HR professional and job description writer. Your task is to create a comprehensive, professional job description based on the user's request and any provided job details.

USER REQUEST: ${userPrompt}

AVAILABLE JOB DETAILS:
- Job Title: ${jobInfo.title}
- Location: ${jobInfo.location}
- Required Skills: ${jobInfo.skills}
- Job Type: ${jobInfo.jobType}
- Experience Required: ${jobInfo.experience}
- Salary Range: ${jobInfo.salary}

INSTRUCTIONS:
1. Create a professional, engaging job description that includes:
   - Clear job title and overview
   - Detailed responsibilities and duties
   - Required qualifications and skills
   - Preferred qualifications (if applicable)
   - Company culture and benefits (if mentioned)
   - Application instructions

2. Use proper HTML formatting with:
   - <h2> for section headers
   - <p> for paragraphs
   - <ul> and <li> for bullet points
   - <strong> for emphasis
   - <em> for italic text

3. Make the description:
   - Professional yet engaging
   - Clear and specific
   - Inclusive and welcoming
   - Optimized for job boards and ATS systems
   - Between 300-800 words

4. Structure the content with these sections:
   - Job Overview
   - Key Responsibilities
   - Required Qualifications
   - Preferred Qualifications (if applicable)
   - Benefits and Culture (if applicable)
   - How to Apply

5. If specific details are provided, use them. If not, make reasonable assumptions based on the job title and industry standards.

6. Ensure the description is compelling and will attract qualified candidates.

Please return ONLY the formatted HTML content without any additional explanations or markdown formatting.
`;
}

/**
 * Build prompt for job description enhancement
 */
function buildEnhancementPrompt(currentDescription, enhancementPrompt) {
  return `
You are an expert HR professional and job description writer. Your task is to enhance an existing job description based on the user's specific request.

CURRENT JOB DESCRIPTION:
${currentDescription}

ENHANCEMENT REQUEST: ${enhancementPrompt}

INSTRUCTIONS:
1. Enhance the existing job description according to the user's request
2. Maintain the existing structure and key information
3. Improve clarity, detail, and professionalism
4. Use proper HTML formatting with:
   - <h2> for section headers
   - <p> for paragraphs
   - <ul> and <li> for bullet points
   - <strong> for emphasis
   - <em> for italic text

5. Make the enhancements:
   - More detailed and specific
   - More engaging and compelling
   - Better organized and structured
   - More inclusive and welcoming
   - Optimized for job boards and ATS systems

6. Preserve all important information from the original description
7. Add relevant details based on the enhancement request
8. Ensure the final description is professional and comprehensive

Please return ONLY the enhanced HTML content without any additional explanations or markdown formatting.
`;
} 
# Application API Documentation

## Overview
The Application API now supports resume upload, Cloudinary storage, PDF text extraction, and AI-powered resume analysis using Google Gemini AI.

## Features
- ✅ Resume PDF upload and storage in Cloudinary
- ✅ PDF text extraction for AI analysis
- ✅ AI-powered resume matching using Google Gemini
- ✅ Comprehensive application data storage
- ✅ AI score filtering and sorting
- ✅ Application status management

## API Endpoints

### 1. Create Application with Resume Upload
**POST** `/api/applications`

Creates a new job application with resume upload, AI analysis, and stores all data in MongoDB.

#### Request Body (multipart/form-data)
```json
{
  "jobId": "507f1f77bcf86cd799439011",
  "applicantName": "John Doe",
  "applicantEmail": "john.doe@example.com",
  "phone": "+1234567890",
  "linkedin": "https://linkedin.com/in/johndoe",
  "github": "https://github.com/johndoe",
  "portfolio": "https://johndoe.dev",
  "salaryExpectation": 75000,
  "experienceYears": 3,
  "noticePeriod": 30,
  "resume": "[PDF File]"
}
```

#### Required Fields
- `jobId`: MongoDB ObjectId of the job
- `applicantName`: Full name of the applicant
- `applicantEmail`: Email address
- `phone`: Phone number
- `salaryExpectation`: Expected salary (number)
- `experienceYears`: Years of experience (number)
- `noticePeriod`: Notice period in days (number)
- `resume`: PDF file (max 5MB)

#### Optional Fields
- `linkedin`: LinkedIn profile URL
- `github`: GitHub profile URL
- `portfolio`: Portfolio website URL

#### Response
```json
{
  "status": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "jobId": "507f1f77bcf86cd799439011",
    "applicantName": "John Doe",
    "applicantEmail": "john.doe@example.com",
    "phone": "+1234567890",
    "linkedin": "https://linkedin.com/in/johndoe",
    "github": "https://github.com/johndoe",
    "portfolio": "https://johndoe.dev",
    "salaryExpectation": 75000,
    "experienceYears": 3,
    "noticePeriod": 30,
    "resumeUrl": "https://res.cloudinary.com/.../resume.pdf",
    "status": "applied",
    "aiScore": 85,
    "aiHighlights": [
      "3 years of React experience",
      "Proficient with Node.js and MongoDB",
      "Led frontend development team"
    ],
    "aiDetails": "John Doe is a strong match for the frontend developer role...",
    "aiKeyPoints": [
      "Excellent React skills",
      "Good communication skills",
      "Reasonable salary expectations"
    ],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  "message": "Application submitted successfully"
}
```

### 2. Get Applications by Job
**GET** `/api/applications/job/:jobId`

Retrieves all applications for a specific job.

#### Response
```json
{
  "status": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "jobId": {
        "_id": "507f1f77bcf86cd799439011",
        "title": "Frontend Developer",
        "description": "We are looking for a skilled frontend developer...",
        "experience": { "min": 2, "max": 5 },
        "salary": { "min": 60000, "max": 90000, "currency": "USD" }
      },
      "applicantName": "John Doe",
      "applicantEmail": "john.doe@example.com",
      "aiScore": 85,
      "status": "applied",
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ]
}
```

### 3. Get Applications with AI Score Filtering
**GET** `/api/applications/job/:jobId/filter`

Retrieves applications with filtering and sorting options.

#### Query Parameters
- `minScore`: Minimum AI score (number)
- `maxScore`: Maximum AI score (number)
- `status`: Application status filter
- `sortBy`: Sort field (`aiScore`, `createdAt`, `applicantName`)
- `sortOrder`: Sort order (`asc`, `desc`)

#### Example Request
```
GET /api/applications/job/507f1f77bcf86cd799439011/filter?minScore=70&status=applied&sortBy=aiScore&sortOrder=desc
```

#### Response
```json
{
  "status": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439012",
      "applicantName": "John Doe",
      "aiScore": 85,
      "status": "applied",
      "aiHighlights": ["3 years of React experience"],
      "createdAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "count": 1
}
```

### 4. Get Application by ID
**GET** `/api/applications/:applicationId`

Retrieves a specific application with full details.

#### Response
```json
{
  "status": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "jobId": {
      "_id": "507f1f77bcf86cd799439011",
      "title": "Frontend Developer",
      "description": "We are looking for a skilled frontend developer...",
      "experience": { "min": 2, "max": 5 },
      "salary": { "min": 60000, "max": 90000, "currency": "USD" },
      "skills": ["React", "JavaScript", "CSS"],
      "location": "New York, NY"
    },
    "applicantName": "John Doe",
    "applicantEmail": "john.doe@example.com",
    "phone": "+1234567890",
    "linkedin": "https://linkedin.com/in/johndoe",
    "github": "https://github.com/johndoe",
    "portfolio": "https://johndoe.dev",
    "salaryExpectation": 75000,
    "experienceYears": 3,
    "noticePeriod": 30,
    "resumeUrl": "https://res.cloudinary.com/.../resume.pdf",
    "status": "applied",
    "aiScore": 85,
    "aiHighlights": [
      "3 years of React experience",
      "Proficient with Node.js and MongoDB",
      "Led frontend development team"
    ],
    "aiDetails": "John Doe is a strong match for the frontend developer role...",
    "aiKeyPoints": [
      "Excellent React skills",
      "Good communication skills",
      "Reasonable salary expectations"
    ],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 5. Update Application Status
**PATCH** `/api/applications/:applicationId/status`

Updates the status of an application.

#### Request Body
```json
{
  "status": "reviewed"
}
```

#### Valid Status Values
- `applied`: Initial application status
- `reviewed`: Application has been reviewed
- `rejected`: Application has been rejected
- `accepted`: Application has been accepted

#### Response
```json
{
  "status": true,
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "status": "reviewed",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  },
  "message": "Status updated successfully"
}
```

### 6. Delete Application
**DELETE** `/api/applications/:applicationId`

Deletes an application and removes the resume from Cloudinary.

#### Response
```json
{
  "status": true,
  "message": "Application deleted successfully"
}
```

## AI Analysis Features

### Resume Matching Score
The AI analyzes the resume against the job requirements and provides:
- **Score**: 0-100 rating of match quality
- **Highlights**: Key strengths and relevant experience
- **Details**: Detailed analysis of the candidate's fit
- **Key Points**: Important considerations for hiring

### AI Prompt Structure
The system uses a structured prompt that includes:
1. Job details (title, description, requirements, salary)
2. Candidate profile (all application data)
3. Extracted resume text
4. Specific evaluation criteria

## Environment Variables

Add these to your `.env` file:

```env
# Gemini AI Configuration
GEMINI_API_KEY=your-gemini-api-key-here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## Error Handling

The API includes comprehensive error handling for:
- Missing required fields
- Invalid file types (PDF only)
- File size limits (5MB max)
- PDF parsing errors
- Cloudinary upload failures
- AI analysis failures
- Database errors

## File Upload Requirements

- **File Type**: PDF only
- **Max Size**: 5MB
- **Field Name**: `resume`
- **Content-Type**: `multipart/form-data`

## Database Schema

The Application model includes all fields from the original schema plus AI analysis results:

```javascript
{
  jobId: ObjectId,
  applicantName: String,
  applicantEmail: String,
  phone: String,
  linkedin: String,
  github: String,
  portfolio: String,
  salaryExpectation: Number,
  experienceYears: Number,
  noticePeriod: Number,
  resumeUrl: String,
  status: String,
  aiScore: Number,
  aiHighlights: [String],
  aiDetails: String,
  aiKeyPoints: [String],
  createdAt: Date,
  updatedAt: Date
}
``` 
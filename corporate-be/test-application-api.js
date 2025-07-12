// Test script for Application API
// Run with: node test-application-api.js

import FormData from 'form-data';
import fs from 'fs';
import path from 'path';

const API_BASE_URL = 'http://localhost:8800/api';

// Test data
const testJobId = '507f1f77bcf86cd799439011'; // Replace with actual job ID
const testApplicationData = {
  jobId: testJobId,
  applicantName: 'John Doe',
  applicantEmail: 'john.doe@example.com',
  phone: '+1234567890',
  linkedin: 'https://linkedin.com/in/johndoe',
  github: 'https://github.com/johndoe',
  portfolio: 'https://johndoe.dev',
  salaryExpectation: 75000,
  experienceYears: 3,
  noticePeriod: 30
};

// Helper function to make API requests
async function makeRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    console.error('Request failed:', error);
    return { status: 500, data: { error: error.message } };
  }
}

// Test 1: Create Application (without file for testing)
async function testCreateApplication() {
  console.log('\n=== Test 1: Create Application ===');
  
  const response = await makeRequest(`${API_BASE_URL}/applications`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(testApplicationData)
  });
  
  console.log('Status:', response.status);
  console.log('Response:', JSON.stringify(response.data, null, 2));
  
  return response.data.data?._id; // Return application ID for further tests
}

// Test 2: Get Applications by Job
async function testGetApplicationsByJob(jobId) {
  console.log('\n=== Test 2: Get Applications by Job ===');
  
  const response = await makeRequest(`${API_BASE_URL}/applications/job/${jobId}`);
  
  console.log('Status:', response.status);
  console.log('Response:', JSON.stringify(response.data, null, 2));
}

// Test 3: Get Applications with Filtering
async function testGetApplicationsWithFilter(jobId) {
  console.log('\n=== Test 3: Get Applications with AI Score Filtering ===');
  
  const response = await makeRequest(
    `${API_BASE_URL}/applications/job/${jobId}/filter?minScore=70&sortBy=aiScore&sortOrder=desc`
  );
  
  console.log('Status:', response.status);
  console.log('Response:', JSON.stringify(response.data, null, 2));
}

// Test 4: Get Application by ID
async function testGetApplicationById(applicationId) {
  console.log('\n=== Test 4: Get Application by ID ===');
  
  const response = await makeRequest(`${API_BASE_URL}/applications/${applicationId}`);
  
  console.log('Status:', response.status);
  console.log('Response:', JSON.stringify(response.data, null, 2));
}

// Test 5: Update Application Status
async function testUpdateApplicationStatus(applicationId) {
  console.log('\n=== Test 5: Update Application Status ===');
  
  const response = await makeRequest(`${API_BASE_URL}/applications/${applicationId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status: 'reviewed' })
  });
  
  console.log('Status:', response.status);
  console.log('Response:', JSON.stringify(response.data, null, 2));
}

// Test 6: Delete Application
async function testDeleteApplication(applicationId) {
  console.log('\n=== Test 6: Delete Application ===');
  
  const response = await makeRequest(`${API_BASE_URL}/applications/${applicationId}`, {
    method: 'DELETE'
  });
  
  console.log('Status:', response.status);
  console.log('Response:', JSON.stringify(response.data, null, 2));
}

// Main test function
async function runTests() {
  console.log('🚀 Starting Application API Tests...');
  
  try {
    // Test 1: Create application
    const applicationId = await testCreateApplication();
    
    if (applicationId) {
      // Test 2: Get applications by job
      await testGetApplicationsByJob(testJobId);
      
      // Test 3: Get applications with filtering
      await testGetApplicationsWithFilter(testJobId);
      
      // Test 4: Get specific application
      await testGetApplicationById(applicationId);
      
      // Test 5: Update status
      await testUpdateApplicationStatus(applicationId);
      
      // Test 6: Delete application
      await testDeleteApplication(applicationId);
    }
    
    console.log('\n✅ All tests completed!');
  } catch (error) {
    console.error('\n❌ Test failed:', error);
  }
}

// Instructions for testing with actual file upload
console.log(`
📋 Instructions for testing with file upload:

1. Create a test PDF file
2. Use a tool like Postman or curl to test the file upload endpoint:

curl -X POST http://localhost:8800/api/applications \\
  -F "jobId=${testJobId}" \\
  -F "applicantName=John Doe" \\
  -F "applicantEmail=john.doe@example.com" \\
  -F "phone=+1234567890" \\
  -F "linkedin=https://linkedin.com/in/johndoe" \\
  -F "github=https://github.com/johndoe" \\
  -F "portfolio=https://johndoe.dev" \\
  -F "salaryExpectation=75000" \\
  -F "experienceYears=3" \\
  -F "noticePeriod=30" \\
  -F "resume=@/path/to/your/resume.pdf"

3. Make sure you have set up your environment variables:
   - GEMINI_API_KEY
   - CLOUDINARY_CLOUD_NAME
   - CLOUDINARY_API_KEY
   - CLOUDINARY_API_SECRET
`);

// Run tests if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests();
}

export { runTests }; 
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8800';

export const generateJobDescription = async (prompt, jobDetails = {}) => {
  try {
    console.log('Calling Gemini AI:', { prompt, jobDetails });
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/gemini/generate-job-description`,
      { prompt, jobDetails },
      { withCredentials: true }
    );
    console.log('Gemini AI response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error generating job description:', error?.response?.data || error);
    throw error;
  }
};

export const enhanceJobDescription = async (currentDescription, enhancementPrompt) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/api/v1/gemini/enhance-job-description`,
      { currentDescription, enhancementPrompt },
      { withCredentials: true }
    );
    return response.data;
  } catch (error) {
    console.error('Error enhancing job description:', error);
    throw error;
  }
}; 
import axios from "axios";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:8800/api/v1",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true
});

// Add response interceptor to handle errors
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('user');
        }
        return Promise.reject(error);
    }
);

// Create a new job
export const createJob = async (jobData) => {
    try {
        const response = await apiClient.post("/jobs", jobData);
        return { success: response.data.status, data: response.data.data, message: response.data.message };
    } catch (error) {
        const message = error.response?.data?.message || "Failed to create job";
        return { success: false, message };
    }
};

// Get all jobs with filtering and pagination
export const getAllJobs = async (params = {}) => {
    try {
        const response = await apiClient.get("/jobs", { params });
        return { success: response.data.status, data: response.data.data, message: response.data.message };
    } catch (error) {
        const message = error.response?.data?.message || "Failed to fetch jobs";
        return { success: false, message };
    }
};

// Get job by ID
export const getJobById = async (jobId) => {
    try {
        const response = await apiClient.get(`/jobs/${jobId}`);
        return { success: response.data.status, data: response.data.data, message: response.data.message };
    } catch (error) {
        const message = error.response?.data?.message || "Failed to fetch job";
        return { success: false, message };
    }
};

// Update job
export const updateJob = async (jobId, updateData) => {
    try {
        const response = await apiClient.patch(`/jobs/${jobId}`, updateData);
        return { success: response.data.status, data: response.data.data, message: response.data.message };
    } catch (error) {
        const message = error.response?.data?.message || "Failed to update job";
        return { success: false, message };
    }
};

// Delete job
export const deleteJob = async (jobId) => {
    try {
        const response = await apiClient.delete(`/jobs/${jobId}`);
        return { success: response.data.status, message: response.data.message };
    } catch (error) {
        const message = error.response?.data?.message || "Failed to delete job";
        return { success: false, message };
    }
};

// Get my jobs (jobs created by current user)
export const getMyJobs = async (params = {}) => {
    try {
        const response = await apiClient.get("/jobs/my/jobs", { params });
        return { success: response.data.status, data: response.data.data, message: response.data.message };
    } catch (error) {
        const message = error.response?.data?.message || "Failed to fetch your jobs";
        return { success: false, message };
    }
};

// Toggle job status
export const toggleJobStatus = async (jobId, status) => {
    try {
        const response = await apiClient.patch(`/jobs/${jobId}/status`, { status });
        return { success: response.data.status, data: response.data.data, message: response.data.message };
    } catch (error) {
        const message = error.response?.data?.message || "Failed to update job status";
        return { success: false, message };
    }
};

// Get job statistics
export const getJobStats = async () => {
    try {
        const response = await apiClient.get("/jobs/stats/overview");
        return { success: response.data.status, data: response.data.data, message: response.data.message };
    } catch (error) {
        const message = error.response?.data?.message || "Failed to fetch job statistics";
        return { success: false, message };
    }
};

// Get applications
export const getApplications = async (params = {}) => {
    try {
        const response = await apiClient.get("/jobs/applications", { params });
        return { success: response.data.status, data: response.data.data };
    } catch (error) {
        const message = error.response?.data?.message || "Failed to fetch applications";
        return { success: false, message };
    }
};

// Default export
const jobService = {
    getJobStats,
    getAllJobs,
    getMyJobs,
    getJobById,
    createJob,
    updateJob,
    deleteJob,
    toggleJobStatus,
    getApplications
};

export default jobService; 
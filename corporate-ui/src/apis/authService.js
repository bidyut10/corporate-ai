import axios from "axios";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:8800/api/v1",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true // This is important for CORS and cookies
});

// Add request interceptor to handle CORS
apiClient.interceptors.request.use(
    (config) => {
        // No need to manually add Authorization header as cookies are sent automatically
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add response interceptor to handle token expiration
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid, clear local storage
            localStorage.removeItem('user');
        }
        return Promise.reject(error);
    }
);

export const loginUser = async (email, password) => {
    try {
        const response = await apiClient.post("/users/login", { email, password });
        if (response.data.status) {
            // Store user data (name, email) in localStorage, tokens are in cookies
            const userData = {
                _id: response.data.data.user._id,
                userId: response.data.data.user.userId,
                name: response.data.data.user.name,
                email: response.data.data.user.email,
                role: response.data.data.user.role,
            };
            localStorage.setItem("user", JSON.stringify(userData));
        }
        return { success: response.data.status, data: response.data };
    } catch (error) {
        const message = error.response?.data?.message || "Login failed. Please try again.";
        return { success: false, message };
    }
};

export const registerUser = async (userData) => {
    try {
        const response = await apiClient.post("/users/register", userData);
        if (response.data.status) {
            // Store user data (name, email) in localStorage, tokens are in cookies
            const userInfo = {
                _id: response.data.data.user._id,
                userId: response.data.data.user.userId,
                name: response.data.data.user.name,
                email: response.data.data.user.email,
                role: response.data.data.user.role,
            };
            localStorage.setItem("user", JSON.stringify(userInfo));
        }
        return { success: response.data.status, data: response.data };
    } catch (error) {
        const message = error.response?.data?.message || "Registration failed. Please try again.";
        return { success: false, message };
    }
};

export const validateToken = async () => {
    try {
        const response = await apiClient.get("/users/validate-token");
        if (response.data.status) {
            // Update user data in localStorage with fresh data
            const userData = {
                _id: response.data.data.user._id,
                userId: response.data.data.user.userId,
                name: response.data.data.user.name,
                email: response.data.data.user.email,
                role: response.data.data.user.role,
            };
            localStorage.setItem("user", JSON.stringify(userData));
        }
        return { success: response.data.status, data: response.data };
    } catch (error) {
        // Clear localStorage if token is invalid
        localStorage.removeItem('user');
        return { success: false, message: "Token validation failed" };
    }
};

export const logoutUser = async () => {
    try {
        await apiClient.post("/users/logout");
        localStorage.removeItem('user');
        return { success: true };
    } catch (error) {
        // Even if logout fails, clear localStorage
        localStorage.removeItem('user');
        return { success: false, message: "Logout failed" };
    }
};

export const updateUserProfile = async (updateData) => {
    try {
        const response = await apiClient.patch("/users/update-profile", updateData);
        if (response.data.status) {
            // Update user data in localStorage
            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            const updatedUser = {
                ...currentUser,
                ...response.data.data
            };
            localStorage.setItem("user", JSON.stringify(updatedUser));
        }
        return { success: response.data.status, data: response.data.data, message: response.data.message };
    } catch (error) {
        const message = error.response?.data?.message || "Failed to update profile";
        return { success: false, message };
    }
};

export const changePassword = async (passwordData) => {
    try {
        const response = await apiClient.patch("/users/change-password", passwordData);
        return { success: response.data.status, message: response.data.message };
    } catch (error) {
        const message = error.response?.data?.message || "Failed to change password";
        return { success: false, message };
    }
};

export const getCurrentUser = async () => {
    try {
        const response = await apiClient.get("/users/profile");
        if (response.data.status) {
            // Update user data in localStorage
            const userData = {
                _id: response.data.data._id,
                userId: response.data.data.userId,
                name: response.data.data.name,
                email: response.data.data.email,
                role: response.data.data.role,
            };
            localStorage.setItem("user", JSON.stringify(userData));
        }
        return { success: response.data.status, data: response.data.data };
    } catch (error) {
        const message = error.response?.data?.message || "Failed to fetch user profile";
        return { success: false, message };
    }
};

export const getApplications = async () => {
    try {
        const response = await apiClient.get("/jobs/applications");
        return { success: response.data.status, applications: response.data.data };
    } catch (error) {
        const message = error.response?.data?.message || "Failed to fetch applications";
        return { success: false, message, applications: [] };
    }
};

// Default export for backward compatibility
const authService = {
    loginUser,
    registerUser,
    validateToken,
    logoutUser,
    updateUserProfile,
    changePassword,
    getCurrentUser,
    getApplications
};

export default authService;
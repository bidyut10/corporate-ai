import axios from "axios";

const apiClient = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:4000/api",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true // This is important for CORS
});

// Add request interceptor to handle CORS
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export const loginUser = async (email, password) => {
    try {
        const response = await apiClient.post("/user/login", { email, password });
        if (response.data.success) {
            localStorage.setItem("user", JSON.stringify(response.data.data));
        }
        return { success: true, data: response.data };
    } catch (error) {
        const message = error.response?.data?.message || "Login failed. Please try again.";
        return { success: false, message };
    }
};

export const registerUser = async (userData) => {
    try {
        const response = await apiClient.post("/user/register", userData);
        if (response.data.success) {
            localStorage.setItem("user", JSON.stringify(response.data.data));
        }
        return { success: true, data: response.data };
    } catch (error) {
        const message = error.response?.data?.message || "Registration failed. Please try again.";
        return { success: false, message };
    }
};

export const requestPasswordReset = async (email) => {
    try {
        const response = await apiClient.post("/user/forgot-password", { email });
        return { success: true, data: response.data };
    } catch (error) {
        const message = error.response?.data?.message || "Failed to request password reset.";
        return { success: false, message };
    }
};
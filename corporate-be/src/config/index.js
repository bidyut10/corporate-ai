import dotenv from "dotenv";

dotenv.config();

export const config = {
  // Server Configuration
  PORT: process.env.PORT || 8800,
  NODE_ENV: process.env.NODE_ENV || "development",
  
  // MongoDB Configuration
  MONGO_URL: process.env.MONGO_URL || "mongodb://localhost:27017/corporate-be",
  
  // JWT Configuration
  JWT_SECRET: process.env.JWT_SECRET || "your-super-secret-jwt-key-here",
  JWT_EXPIRY: process.env.JWT_EXPIRY || "7d",
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "your-super-secret-refresh-key-here",
  JWT_REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY || "30d",
  
  // Cloudinary Configuration
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  
  // Gemini AI Configuration
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  
  // CORS Configuration
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:3000",
  
  // Rate Limiting
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 900000,
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
}; 
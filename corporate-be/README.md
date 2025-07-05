# User Upload Module - Simplified Backend

A simplified Node.js Express backend with user authentication, job management, and resume upload functionality.

## Features

- **User Authentication**: Register, login, logout with JWT tokens
- **Job Management**: Create, read, update, delete jobs with filtering and pagination
- **File Upload**: Resume upload support with multer
- **Role-based Access**: Admin and employer roles
- **Simple Error Handling**: Clean and straightforward error responses

## Project Structure

```
src/
├── app.js                 # Express app configuration
├── index.js              # Server entry point
├── config/
│   ├── index.js          # Environment configuration
│   └── cloudinary.js     # Cloudinary configuration
├── controllers/
│   ├── user.controller.js # User management controllers
│   └── job.controller.js  # Job management controllers
├── middlewares/
│   ├── auth.middleware.js # JWT authentication middleware
│   └── multer.middleware.js # File upload middleware
├── models/
│   ├── user.model.js     # User mongoose model
│   └── job.model.js      # Job mongoose model
├── routes/
│   ├── user.route.js     # User routes
│   └── job.route.js      # Job routes
├── database/
│   └── db.js            # MongoDB connection
└── auth/
    └── credentials.auth.js # Basic auth middleware
```

## API Response Format

All API responses follow a simple and consistent format:

### Success Response
```json
{
  "status": true,
  "data": { ... },
  "message": "Success message"
}
```

### Error Response
```json
{
  "status": false,
  "message": "Error message"
}
```

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file with your configuration:
   ```
   PORT=8800
   NODE_ENV=development
   MONGO_URL=mongodb://localhost:27017/corporate-be
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRY=7d
   JWT_REFRESH_SECRET=your-super-secret-refresh-key-here
   JWT_REFRESH_EXPIRY=30d
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   CORS_ORIGIN=http://localhost:3000
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### User Routes (`/api/v1/users`)

- `POST /register` - Register a new user
- `POST /login` - User login
- `POST /refresh-token` - Refresh access token
- `GET /profile` - Get current user profile (protected)
- `PATCH /update-profile` - Update user profile (protected)
- `PATCH /change-password` - Change password (protected)
- `DELETE /delete-account` - Delete account (protected)
- `POST /logout` - User logout (protected)
- `GET /all-profiles` - Get all users (admin only)

### Job Routes (`/api/v1/jobs`)

- `GET /` - Get all jobs (public, with optional auth)
- `GET /:jobId` - Get job by ID (public, with optional auth)
- `POST /` - Create a new job (employer/admin only)
- `PATCH /:jobId` - Update job (employer/admin only)
- `DELETE /:jobId` - Delete job (employer/admin only)
- `GET /my/jobs` - Get user's jobs (employer/admin only)
- `PATCH /:jobId/status` - Toggle job status (employer/admin only)
- `GET /stats/overview` - Get job statistics (employer/admin only)

## Error Handling

The application uses simple try-catch blocks for error handling with consistent HTTP status codes:

- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

## Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Rate limiting
- CORS protection
- Helmet security headers
- File upload validation

## Technologies Used

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Multer** - File uploads
- **Cloudinary** - Cloud storage
- **bcryptjs** - Password hashing
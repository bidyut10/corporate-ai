// Import necessary modules and dependencies
import { Router } from "express";
import {
  registerUser,
  loginUser,
  validateToken,
  logoutUser,
  refreshAccessToken,
  getCurrentUser,
  updateUserProfile,
  changeCurrentPassword,
  deleteAccount,
  getAllUsers,
} from "../controllers/user.controller.js";
import { verifyJWT, verifyPermission } from "../middlewares/auth.middleware.js";

// Create an Express Router instance
const userRouter = Router();

// Public routes
userRouter.post("/register", registerUser);
userRouter.post("/login", loginUser);
userRouter.post("/refresh-token", refreshAccessToken);
userRouter.get("/validate-token", validateToken);

// Protected routes
userRouter.use(verifyJWT); // Apply JWT verification to all routes below

userRouter.get("/profile", getCurrentUser);
userRouter.patch("/update-profile", updateUserProfile);
userRouter.patch("/change-password", changeCurrentPassword);
userRouter.delete("/delete-account", deleteAccount);
userRouter.post("/logout", logoutUser);

// Admin only routes
userRouter.get("/all-profiles", verifyPermission(["admin"]), getAllUsers);

export { userRouter };
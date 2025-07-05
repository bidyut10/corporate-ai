import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { config } from "../config/index.js";

// Helper function to send tokens
const sendAccessAndRefreshTokens = async (userId, res) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const options = {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        status: true,
        data: {
          user: {
            _id: user._id,
            userId: user.userId,
            name: user.name,
            email: user.email,
            role: user.role,
          },
          accessToken,
          refreshToken,
        },
        message: "User logged in successfully"
      });
  } catch (error) {
    res.status(500).json({ status: false, message: "Internal server error" });
  }
};

// Register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, role } = req.body;

    if ([name, email, password, confirmPassword].some((field) => field?.trim() === "")) {
      return res.status(400).json({ status: false, message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ status: false, message: "Passwords do not match" });
    }

    const existingUser = await User.findOne({ email, isDeleted: false });

    if (existingUser) {
      return res.status(409).json({ status: false, message: "User with this email already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
      confirmPassword,
      role: role
    });

    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if (!createdUser) {
      return res.status(500).json({ status: false, message: "Something went wrong" });
    }

    // Generate tokens for newly registered user
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    const options = {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
    };

    return res
      .status(201)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        status: true,
        data: {
          user: {
            _id: createdUser._id,
            userId: createdUser.userId,
            name: createdUser.name,
            email: createdUser.email,
            role: createdUser.role,
          },
          accessToken,
          refreshToken,
        },
        message: "User registered successfully"
      });
  } catch (error) {
    return res.status(500).json({ status: false, message: "Internal server error" });
  }
};

// Login user
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ status: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ email, isDeleted: false }).select("+password");

    if (!user) {
      return res.status(401).json({ status: false, message: "Invalid credentials" });
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
      return res.status(401).json({ status: false, message: "Invalid credentials" });
    }

    await sendAccessAndRefreshTokens(user._id, res);
  } catch (error) {
    return res.status(500).json({ status: false, message: "Internal server error" });
  }
};

// Validate token and return user info
const validateToken = async (req, res) => {
  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ 
        status: false, 
        message: "No token provided",
        isAuthenticated: false 
      });
    }

    const decodedToken = jwt.verify(token, config.JWT_SECRET);
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

    if (!user || user.isDeleted) {
      return res.status(401).json({ 
        status: false, 
        message: "Invalid token",
        isAuthenticated: false 
      });
    }

    return res.status(200).json({
      status: true,
      data: {
        user: {
          _id: user._id,
          userId: user.userId,
          name: user.name,
          email: user.email,
          role: user.role,
        }
      },
      message: "Token is valid",
      isAuthenticated: true
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        status: false, 
        message: "Token expired",
        isAuthenticated: false 
      });
    }
    return res.status(401).json({ 
      status: false, 
      message: "Invalid token",
      isAuthenticated: false 
    });
  }
};

// Logout user
const logoutUser = async (req, res) => {
  try {
    await User.findByIdAndUpdate(
      req.user._id,
      {
        $unset: {
          refreshToken: 1,
        },
      },
      {
        new: true,
      }
    );

    const options = {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
    };

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({ status: true, message: "User logged out successfully" });
  } catch (error) {
    return res.status(500).json({ status: false, message: "Internal server error" });
  }
};

// Refresh access token
const refreshAccessToken = async (req, res) => {
  try {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingRefreshToken) {
      return res.status(401).json({ status: false, message: "Unauthorized request" });
    }

    const decodedToken = jwt.verify(incomingRefreshToken, config.JWT_REFRESH_SECRET);

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      return res.status(401).json({ status: false, message: "Invalid refresh token" });
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      return res.status(401).json({ status: false, message: "Refresh token is expired or used" });
    }

    const options = {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
    };

    const accessToken = user.generateAccessToken();
    const newRefreshToken = user.generateRefreshToken();

    user.refreshToken = newRefreshToken;
    await user.save({ validateBeforeSave: false });

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json({
        status: true,
        data: { accessToken, refreshToken: newRefreshToken },
        message: "Access token refreshed"
      });
  } catch (error) {
    return res.status(401).json({ status: false, message: error?.message || "Invalid refresh token" });
  }
};

// Get current user
const getCurrentUser = async (req, res) => {
  try {
    return res.status(200).json({
      status: true,
      data: req.user,
      message: "User fetched successfully"
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: "Internal server error" });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name && !email) {
      return res.status(400).json({ status: false, message: "At least one field is required to update" });
    }

    const user = await User.findByIdAndUpdate(
      req.user?._id,
      {
        $set: {
          name: name || req.user.name,
          email: email || req.user.email,
        },
      },
      { new: true }
    ).select("-password");

    return res.status(200).json({
      status: true,
      data: user,
      message: "Profile updated successfully"
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: "Internal server error" });
  }
};

// Change password
const changeCurrentPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({ status: false, message: "All password fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ status: false, message: "New password and confirm password do not match" });
    }

    const user = await User.findById(req.user?._id).select("+password");

    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

    if (!isPasswordCorrect) {
      return res.status(400).json({ status: false, message: "Invalid old password" });
    }

    user.password = newPassword;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json({
      status: true,
      message: "Password changed successfully"
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: "Internal server error" });
  }
};

// Soft delete account
const deleteAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user?._id);

    if (!user) {
      return res.status(404).json({ status: false, message: "User not found" });
    }

    await user.softDelete();

    const options = {
      httpOnly: true,
      secure: config.NODE_ENV === "production",
    };

    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({ status: true, message: "Account deleted successfully" });
  } catch (error) {
    return res.status(500).json({ status: false, message: "Internal server error" });
  }
};

// Get all users (admin only)
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ isDeleted: false }).select("-password -refreshToken");

    return res.status(200).json({
      status: true,
      data: users,
      message: "Users fetched successfully"
    });
  } catch (error) {
    return res.status(500).json({ status: false, message: "Internal server error" });
  }
};

export {
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
};

import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { config } from "../config/index.js";

export const verifyJWT = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ status: false, message: "Unauthorized request" });
    }

    const decodedToken = jwt.verify(token, config.JWT_SECRET);

    const user = await User.findById(decodedToken?._id).select("-password -refreshToken");

    if (!user || user.isDeleted) {
      return res.status(401).json({ status: false, message: "Invalid Access Token" });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ status: false, message: error?.message || "Invalid access token" });
  }
};

export const verifyPermission = (roles = []) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ status: false, message: "User not authenticated" });
      }

      if (roles.length && !roles.includes(req.user.role)) {
        return res.status(403).json({ status: false, message: "You don't have permission to perform this action" });
      }

      next();
    } catch (error) {
      return res.status(500).json({ status: false, message: "Internal server error" });
    }
  };
};

export const optionalAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if (token) {
      const decodedToken = jwt.verify(token, config.JWT_SECRET);
      const user = await User.findById(decodedToken?._id).select("-password -refreshToken");
      
      if (user && !user.isDeleted) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    next();
  }
}; 
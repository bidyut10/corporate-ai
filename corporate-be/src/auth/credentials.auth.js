import { User } from "../models/user.model.js";

const authUserMiddleware = async (req, res, next) => {
  try {
    const { userName, password } = req.headers;

    if ([userName, password].some((field) => field?.trim() === "")) {
      return res.status(400).json({ status: false, message: "All fields are required" });
    }

    const existingUser = await User.findOne({ userName, password });

    if (existingUser) {
      req.user = existingUser;
      next();
    } else {
      return res.status(401).json({ status: false, message: "Unauthorized" });
    }
  } catch (error) {
    return res.status(500).json({ status: false, message: "Internal server error" });
  }
};

export { authUserMiddleware };

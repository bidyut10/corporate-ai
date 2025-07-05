import mongoose from "mongoose";
import { config } from "../config/index.js";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(config.MONGO_URL);
    console.log(`MongoDB connected successfully! DB HOST: ${connectionInstance.connection.host}`);
  } catch (error) {
    console.error("MongoDB Connection failed!!! ", error.message);
    process.exit(1);
  }
};

export default connectDB;
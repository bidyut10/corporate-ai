import dotenv from "dotenv"
import connectDB from "./database/db.js";
import { app } from './app.js'
import { config } from "./config/index.js";

dotenv.config({
  path: './.env'
})

// Connect to database
connectDB()
  .then(() => {
    app.listen(config.PORT, () => {
      console.log(`Server is running at port: ${config.PORT}`);
      console.log(`Environment: ${config.NODE_ENV}`);
      console.log(`Health check: http://localhost:${config.PORT}/health`);
    });
  })
  .catch((error) => {
    console.error("MongoDB Connection failed!!! ", error.message);
    process.exit(1);
  });

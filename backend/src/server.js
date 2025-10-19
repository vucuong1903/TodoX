import express from "express";
import dotenv from "dotenv";
import tasksRouters from "./routes/tasksRouters.js";
import connectDB from "./config/db.js";
import cors from "cors";
dotenv.config(); // load .env

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware để đọc JSON body
app.use(express.json());

// Middleware
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173" }));
// Routes
app.use("/tasks", tasksRouters);

// Kết nối DB
connectDB()
   .then(() => {
      app.listen(PORT, () => {
         console.log(`🚀 Server is running on port ${`http://localhost:${PORT}`}`);
      });
   })
   .catch((error) => {
      console.error("❌ MongoDB connection error:", error.message);
   });

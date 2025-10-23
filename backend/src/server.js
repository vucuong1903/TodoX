import express from "express";
import dotenv from "dotenv";
import authRouter from "./routes/authRouter.js";
import tasksRouters from "./routes/tasksRouters.js";
import userRouter from "./routes/userRoutes.js";
import connectDB from "./config/db.js";
import cors from "cors";
import path from "path";
import cookieParser from "cookie-parser";
import protectedRoute from "./middlewares/authMiddleware.js";
dotenv.config(); // load .env

const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

// Middleware để đọc JSON body
app.use(express.json());

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS
if (process.env.NODE_ENV === "production") {
   // Production: Allow requests from the same origin (since frontend is served from backend)
   app.use(
      cors({
         origin: true, // Allow same origin
         credentials: true,
      })
   );
} else {
   // Development: Allow requests from Vite dev server
   app.use(
      cors({
         origin: "http://localhost:5173",
         credentials: true,
      })
   );
}

// Routes
app.use("/auth", authRouter); // Auth routes không cần middleware
app.use("/tasks", protectedRoute, tasksRouters); // Tasks routes cần authentication
app.use("/users", protectedRoute, userRouter); // Users routes cần authentication
if (process.env.NODE_ENV === "production") {
   app.use(express.static(path.join(__dirname, "../frontend/dist")));

   app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
   });
}

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

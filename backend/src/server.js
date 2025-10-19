import express from "express";
import dotenv from "dotenv";
import tasksRouters from "./routes/tasksRouters.js";
import connectDB from "./config/db.js";
import cors from "cors";
import path from "path";

dotenv.config(); // load .env

const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();
// Middleware để đọc JSON body
app.use(express.json());

// Middleware
app.use(express.json());

if (process.env.NODE_ENV !== "production") {
   app.use(cors({ origin: "http://localhost:5173" }));
}
// Routes
app.use("/tasks", tasksRouters);

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

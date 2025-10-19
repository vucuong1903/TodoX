import mongoose from "mongoose";

console.log("Mongoose version:", mongoose.version);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI,);
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

export default connectDB;

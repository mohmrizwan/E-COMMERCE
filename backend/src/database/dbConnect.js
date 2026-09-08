import mongoose from "mongoose";

const dbConnect = async () => {
  console.log("🔥 dbConnect() called");

  try {
    console.log("🔄 Connecting MongoDB...");

    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.log("❌ MongoDB connection failed:", error.message);
  }
};

export default dbConnect;
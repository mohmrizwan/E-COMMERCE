import mongoose from "mongoose";

export const getMongoConnectionString = (env = process.env) => {
  const connectionString = String(env.MONGODB_URI || "").trim();
  if (!/^mongodb(?:\+srv)?:\/\//i.test(connectionString)) {
    throw new Error('MONGODB_URI must start with "mongodb://" or "mongodb+srv://"');
  }
  return connectionString;
};

const dbConnect = async () => {
  console.log("🔥 dbConnect() called");

  try {
    console.log("🔄 Connecting MongoDB...");

    await mongoose.connect(getMongoConnectionString(), {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.log("❌ MongoDB connection failed:", error.message);
    throw error;
  }
};

export default dbConnect;

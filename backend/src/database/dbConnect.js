import mongoose from "mongoose";

export const getMongoConnectionString = (env = process.env) => {
  const connectionString = String(env.MONGODB_URI || "").trim();
  if (!/^mongodb(?:\+srv)?:\/\//i.test(connectionString)) {
    throw new Error('MONGODB_URI must start with "mongodb://" or "mongodb+srv://"');
  }
  return connectionString;
};

const dbConnect = async () => {

  try {

    await mongoose.connect(getMongoConnectionString(), {
      serverSelectionTimeoutMS: 10000,
    });

  } catch (error) {
    throw error;
  }
};

export default dbConnect;

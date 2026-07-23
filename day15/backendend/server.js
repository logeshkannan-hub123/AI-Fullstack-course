import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

export async function disconnectDB() {
  await mongoose.connection.close();
}

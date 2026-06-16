import mongoose from "mongoose";

export async function connectDatabase() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.warn("MONGODB_URI is not set. Project history will be unavailable.");
    return;
  }

  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);
  
}

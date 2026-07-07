const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
  if (isConnected) {
    console.log("=> Using existing database connection");
    return;
  }

  console.log("=> Creating new database connection");
  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
      family: 4,
    });
    isConnected = db.connections[0].readyState === 1;
    console.log("MongoDB Connected successfully");
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
    throw error;
  }
};

module.exports = connectDB;
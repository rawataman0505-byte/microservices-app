const mongoose = require("mongoose");

const connectDB = async () => {
  try {
       await mongoose.connect(process.env.MONGO_URI, {
      authSource: "admin",
    });
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); // stop the app if connection fails
  }
};

module.exports = connectDB;
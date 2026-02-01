const mongoose = require("mongoose");

module.exports = async function connectDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("Missing MONGODB_URI in .env");
    process.exit(1);
  }
  try {
    await mongoose.connect(uri);
    console.log("MongoDB connected");
  } catch (e) {
    console.error("MongoDB error:", e.message);
    process.exit(1);
  }
};

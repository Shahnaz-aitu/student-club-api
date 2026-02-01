require("dotenv").config();
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");
const User = require("../models/User");

(async () => {
  await connectDB();

  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const username = process.env.ADMIN_USERNAME || "Admin";

  if (!email || !password) {
    console.log("Set ADMIN_EMAIL and ADMIN_PASSWORD in .env");
    process.exit(1);
  }

  const exists = await User.findOne({ email: email.toLowerCase() });
  if (exists) {
    console.log("Admin already exists:", email);
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await User.create({ username, email, passwordHash, role: "admin" });

  console.log("Admin created:", email);
  process.exit(0);
})();

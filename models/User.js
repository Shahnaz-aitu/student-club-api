const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true, minlength: 2, maxlength: 30 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
    clubs: [{ type: mongoose.Schema.Types.ObjectId, ref: "Club" }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
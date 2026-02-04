const mongoose = require("mongoose");

const clubSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 60 },
    description: { type: String, required: true, trim: true, minlength: 10, maxlength: 800 },
    location: { type: String, trim: true, maxlength: 120 },
    meetingTime: { type: String, trim: true, maxlength: 120 },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Club", clubSchema);

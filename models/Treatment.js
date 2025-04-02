const mongoose = require("mongoose");

const TreatmentSchema = new mongoose.Schema({
  service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true }, // Links to Service
  name: { type: String, required: true }, // Example: "PRP"
  description: { type: String },
  price: { type: Number, required: true },
  duration: { type: Number, required: true }, // Duration in minutes
  sessionsRequired: { type: Number, default: 1 }, // Number of sessions needed
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Treatment", TreatmentSchema);

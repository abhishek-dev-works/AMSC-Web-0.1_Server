const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema({
  name: { type: String, required: true }, // Example: "Hair Services"
  description: { type: String },
  treatments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Treatment" }], // List of treatments
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Service", ServiceSchema);

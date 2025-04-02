const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  phone: { type: String, unique: true, required: true },
  isWhatsapp: { type: Boolean, default: false },
  role: { type: String, enum: ["doctor", "patient"], default: "patient" },
});

module.exports = mongoose.model("User", UserSchema);

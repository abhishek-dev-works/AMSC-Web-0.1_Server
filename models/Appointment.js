const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
  date: { type: Date, required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date, required: true },
  status: { 
    type: String, 
    enum: ["requested", "confirmed", "scheduled", "completed", "canceled", "rejected"], 
    default: "requested" 
  },
  sessionNumber: { type: Number, default: 1 }, 
  parentAppointment: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment", default: null },
  notes: { type: String }
});

// Ensure startTime is before endTime before saving
AppointmentSchema.pre("save", function (next) {
  if (this.startTime >= this.endTime) {
    return next(new Error("End time must be after start time."));
  }
  next();
});

module.exports = mongoose.model("Appointment", AppointmentSchema);

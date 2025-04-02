const Appointment = require("../models/Appointment");

// Get all appointments
exports.getAllAppointments = async () => {
  return await Appointment.find().populate("patient doctor service", "name email");
};

// Get appointment by ID
exports.getAppointmentById = async (id) => {
  return await Appointment.findById(id).populate("patient doctor service", "name email");
};

// Create new appointment
exports.createAppointment = async (appointmentData) => {
  return await new Appointment(appointmentData).save();
};

// Update appointment by ID
exports.updateAppointmentById = async (id, updates) => {
  return await Appointment.findByIdAndUpdate(id, updates, { new: true });
};

// Delete appointment by ID
exports.deleteAppointmentById = async (id) => {
  return await Appointment.findByIdAndDelete(id);
};

// Delete multiple appointments
exports.deleteMultipleAppointments = async (ids) => {
  return await Appointment.deleteMany({ _id: { $in: ids } });
};

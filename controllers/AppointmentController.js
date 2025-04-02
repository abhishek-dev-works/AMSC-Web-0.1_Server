const appointmentService = require("../services/AppointmentService");

// Get all appointments
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await appointmentService.getAllAppointments();
    res.status(200).json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get appointment by ID
exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await appointmentService.getAppointmentById(req.params.id);
    if (!appointment) return res.status(404).json({ message: "Appointment not found" });
    res.status(200).json(appointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new appointment
exports.createAppointment = async (req, res) => {
  try {
    const appointment = await appointmentService.createAppointment(req.body);
    res.status(201).json(appointment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update appointment by ID
exports.updateAppointmentById = async (req, res) => {
  try {
    const updatedAppointment = await appointmentService.updateAppointmentById(req.params.id, req.body);
    if (!updatedAppointment) return res.status(404).json({ message: "Appointment not found" });
    res.status(200).json(updatedAppointment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete appointment by ID
exports.deleteAppointmentById = async (req, res) => {
  try {
    const deletedAppointment = await appointmentService.deleteAppointmentById(req.params.id);
    if (!deletedAppointment) return res.status(404).json({ message: "Appointment not found" });
    res.status(200).json({ message: "Appointment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete multiple appointments
exports.deleteMultipleAppointments = async (req, res) => {
  try {
    const { ids } = req.body; // Expecting an array of appointment IDs
    await appointmentService.deleteMultipleAppointments(ids);
    res.status(200).json({ message: "Appointments deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

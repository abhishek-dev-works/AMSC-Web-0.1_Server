const express = require("express");
const {
  getAllAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointmentById,
  deleteAppointmentById,
  deleteMultipleAppointments
} = require("../controllers/AppointmentController");

const router = express.Router();

router.get("/", getAllAppointments);
router.get("/:id", getAppointmentById);
router.post("/", createAppointment);
router.put("/:id", updateAppointmentById);
router.delete("/:id", deleteAppointmentById);
router.delete("/", deleteMultipleAppointments);

module.exports = router;

const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/OperationsController");

// Service routes
router.post("/services/create", ctrl.createService);
router.get("/services", ctrl.getAllServices);
router.get("/services/:id", ctrl.getServiceById);
router.put("/services/:id", ctrl.updateService);
router.delete("/services/:id", ctrl.deleteService);

// Treatment routes
router.post("/treatments/create", ctrl.createTreatment);
router.get("/treatments", ctrl.getAllTreatments);
router.get("/treatments/:id", ctrl.getTreatmentById);
router.put("/treatments/:id", ctrl.updateTreatment);
router.delete("/treatments/:id", ctrl.deleteTreatment);

module.exports = router;

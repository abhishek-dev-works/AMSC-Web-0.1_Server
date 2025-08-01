const Service = require("../models/Service");
const Treatment = require("../models/Treatment");

// SERVICE CONTROLLERS
exports.createService = async (req, res) => {
  try {
    const { name, description } = req.body;
    const service = new Service({ name, description });
    await service.save();
    res.status(201).json(service);
  } catch (err) {
    res.status(500).json({ error: "Failed to create service" });
  }
};

exports.getAllServices = async (req, res) => {
  try {
    const services = await Service.find().populate("treatments");
    res.json(services);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch services" });
  }
};

exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id).populate("treatments");
    if (!service) return res.status(404).json({ error: "Service not found" });
    res.json(service);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch service" });
  }
};

exports.updateService = async (req, res) => {
  try {
    const { name, description } = req.body;
    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { name, description },
      { new: true }
    );
    if (!service) return res.status(404).json({ error: "Service not found" });
    res.json(service);
  } catch (err) {
    res.status(500).json({ error: "Failed to update service" });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);
    if (!service) return res.status(404).json({ error: "Service not found" });
    await Treatment.deleteMany({ service: service._id }); // Cleanup
    res.json({ message: "Service and its treatments deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete service" });
  }
};

// TREATMENT CONTROLLERS
exports.createTreatment = async (req, res) => {
  try {
    const { service, name, description, price, duration, sessionsRequired } = req.body;
    const treatment = new Treatment({
      service,
      name,
      description,
      price,
      duration,
      sessionsRequired
    });
    await treatment.save();
    await Service.findByIdAndUpdate(service, { $push: { treatments: treatment._id } });
    res.status(201).json(treatment);
  } catch (err) {
    res.status(500).json({ error: "Failed to create treatment" });
  }
};

exports.getAllTreatments = async (req, res) => {
  try {
    const treatments = await Treatment.find().populate("service");
    res.json(treatments);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch treatments" });
  }
};

exports.getTreatmentById = async (req, res) => {
  try {
    const treatment = await Treatment.findById(req.params.id).populate("service");
    if (!treatment) return res.status(404).json({ error: "Treatment not found" });
    res.json(treatment);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch treatment" });
  }
};

exports.updateTreatment = async (req, res) => {
  try {
    const { name, description, price, duration, sessionsRequired } = req.body;
    const treatment = await Treatment.findByIdAndUpdate(
      req.params.id,
      { name, description, price, duration, sessionsRequired },
      { new: true }
    );
    if (!treatment) return res.status(404).json({ error: "Treatment not found" });
    res.json(treatment);
  } catch (err) {
    res.status(500).json({ error: "Failed to update treatment" });
  }
};

exports.deleteTreatment = async (req, res) => {
  try {
    const treatment = await Treatment.findByIdAndDelete(req.params.id);
    if (!treatment) return res.status(404).json({ error: "Treatment not found" });
    await Service.findByIdAndUpdate(treatment.service, {
      $pull: { treatments: treatment._id }
    });
    res.json({ message: "Treatment deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete treatment" });
  }
};
// controllers/patientController.js
const mongoose = require('mongoose');
const Patient = require('../models/Patient'); // adjust the path if different

// Create a new patient
exports.createPatient = async (req, res) => {
  try {
    const {
      name,
      dob,
      phone,
      email,
      address,
      emergencyContact,
      bloodGroup,
      allergies,
      notes,
    } = req.body;

    if (!name || !dob || !phone) {
      return res.status(400).json({ message: 'name, dob, and phone are required' });
    }

    const patient = await Patient.create({
      name,
      dob,
      phone,
      email,
      address,
      emergencyContact,
      bloodGroup,
      allergies,
      notes,
    });

    return res.status(201).json(patient);
  } catch (err) {
    // Handle duplicate key (e.g., unique phone/email)
    if (err?.code === 11000) {
      const fields = Object.keys(err.keyPattern || {});
      return res.status(409).json({ message: `Duplicate value for: ${fields.join(', ')}` });
    }
    console.error('createPatient error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get all patients (with optional pagination + search)
exports.getAllPatients = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || '20', 10), 1), 100);
    const q = (req.query.q || '').trim();

    const filter = {};
    if (q) {
      // text search on name/contact/email (ensure indexes exist)
      filter.$or = [
        { name: new RegExp(q, 'i') },
        { phone: new RegExp(q, 'i') },
        { email: new RegExp(q, 'i') },
      ];
    }

    const [items, total] = await Promise.all([
      Patient.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Patient.countDocuments(filter),
    ]);

    return res.json({
      items,
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error('getAllPatients error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Get a patient by ID
exports.getPatientById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid patient id' });
    }

    const patient = await Patient.findById(id).lean();
    if (!patient) return res.status(404).json({ message: 'Patient not found' });

    return res.json(patient);
  } catch (err) {
    console.error('getPatientById error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Update a patient
exports.updatePatient = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid patient id' });
    }

    const update = req.body; // trust only allowed fields in MVP; can whitelist if needed

    const updated = await Patient.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });

    if (!updated) return res.status(404).json({ message: 'Patient not found' });

    return res.json(updated);
  } catch (err) {
    if (err?.code === 11000) {
      const fields = Object.keys(err.keyPattern || {});
      return res.status(409).json({ message: `Duplicate value for: ${fields.join(', ')}` });
    }
    console.error('updatePatient error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// Delete a patient (hard delete)
// If you prefer soft-delete, add a boolean `isActive` field and set it false instead.
exports.deletePatient = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(400).json({ message: 'Invalid patient id' });
    }

    const deleted = await Patient.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Patient not found' });

    return res.json({ message: 'Patient deleted' });
  } catch (err) {
    console.error('deletePatient error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

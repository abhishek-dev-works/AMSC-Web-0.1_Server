const express = require('express');
const router = express.Router();
const partientController = require('../controllers/PatientController');
const { requireAuth } = require('../auth/auth.middleware'); // if you have auth

// router.use(requireAuth); // uncomment when auth is ready

router.post('/', partientController.createPatient);
router.get('/', partientController.getAllPatients);
router.get('/:id', partientController.getPatientById);
router.patch('/:id', partientController.updatePatient);
router.delete('/:id', partientController.deletePatient);

module.exports = router;

import { createNewAppointment, deleteAppointmentById, getAllAppointments, getAppointmentById, updateAppointmentById } from '../controllers/appointments.js';
import express from "express";
// import { handleValidation, validateAppointment, validateAppointmentPatch } from '../middleware/validator.js';

const router = express.Router();

// this is /appointments because it is defined in the routes/index.js file
router.get("/", getAllAppointments);

// then this will be /appointments/:id
router.get("/:id", getAppointmentById);

router.post("/", createNewAppointment);

router.put("/:id", updateAppointmentById);

router.delete("/:id", deleteAppointmentById);

export default router;
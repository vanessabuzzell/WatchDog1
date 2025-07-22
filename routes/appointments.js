import express from "express";
// import pkg from 'express-openid-connect';
import { requiresAuth } from "../middleware/auth.js";
import { createNewAppointment, deleteAppointmentById, getAllAppointments, getAppointmentById, updateAppointmentById } from '../controllers/appointments.js';

// const { requiresAuth } = pkg;
const router = express.Router();

router.use(requiresAuth());
// this is /appointments because it is defined in the routes/index.js file
router.get("/", getAllAppointments);

// then this will be /appointments/:id
router.get("/:id", getAppointmentById);

router.post("/", createNewAppointment);

router.put("/:id", updateAppointmentById);

router.delete("/:id", deleteAppointmentById);

export default router;
import mongoose from 'mongoose';
import AppointmentSchema from '../models/Appointment.js';

import Client from '../models/Client.js';
import Caregiver from '../models/Caregiver.js';
import Service from '../models/Service.js';


export const getAllAppointments = async (req, res) => {
    try {
        let appointments = {};
        if (req.query) {

            const query = {};
            if (req.query.client) query.client = req.query.client;
            if (req.query.caregiver) query.caregiver = req.query.caregiver;
            if (req.query.statusType) query.statusType = req.query.statusType;

            appointments = await AppointmentSchema.find(query).populate('client caregiver service');
        } else {
            appointments = await AppointmentSchema.find().populate('client caregiver service');
        }

        res.status(200).json(appointments);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

export const getAppointmentById = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid appointment ID" });
    }

    try {
        const appointment = await AppointmentSchema.findById(id).populate('client caregiver service');
        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }
        res.status(200).json(appointment);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

export const createNewAppointment = async (req, res) => {
    try {
        const { client, caregiver, service, aptDate } = req.body;

        // Check that a valid client, caregiver, and service were sent
        const [clientExists, caregiverExists, serviceExists] = await Promise.all([
            Client.findById(client),
            Caregiver.findById(caregiver),
            Service.findById(service),
        ]);

        if (!clientExists || !caregiverExists || !serviceExists) {
            return res.status(400).json({ message: "Invalid client, caregiver, or service reference" });
        }

        // Check that appointment date is not before today
        if (new Date(aptDate) < new Date()) {
            return res.status(400).json({ message: "Cannot create an appointment in the past." });
        }

        // Is there already an existing appointment on that date?
        const overlapping = await AppointmentSchema.findOne({
            caregiver,
            aptDate,
        });

        if (overlapping) {
            return res.status(409).json({ message: "Caregiver already has an appointment at this time." });
        }

        const appointment = new AppointmentSchema(req.body);
        await appointment.save();
        res.status(201).json({ message: "Appointment created", appointmentId: appointment._id });

        // Instead of the apt ID we could return apt with other related data
        // const populated = await appointment.populate('client caregiver service');
        // res.status(201).json({ message: "Appointment created", appointment: populated });

    } catch (err) {
        res.status(400).json({ message: "Validation error", error: err.message });
    }
};

export const updateAppointmentById = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid appointment ID" });
    }

    try {
        const result = await AppointmentSchema.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!result) {
            return res.status(404).json({ message: "Appointment not found" });
        }
        res.status(200).json({ message: "Appointment updated", appointment: result });
    } catch (err) {
        res.status(400).json({ message: "Update failed", error: err.message });
    }
};

export const deleteAppointmentById = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid appointment ID" });
    }

    try {
        const result = await AppointmentSchema.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ message: "Appointment not found" });
        }
        res.status(200).json({ message: "Appointment deleted" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

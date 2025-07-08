import ServiceSchema from '../models/services.js';
import mongoose from 'mongoose';
export const getAllServices = async (req, res) => {
    try {
        const services = await ServiceSchema.find();
        res.status(200).json(services);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

export const getServiceById = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid service ID" });
    }

    try {
        const service = await ServiceSchema.findById(id);
        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }
        res.status(200).json(service);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};


export const createNewService = async (req, res) => {
    try {
        const service = new ServiceSchema(req.body);
        await service.save();
        res.status(201).json({ message: "Service created", serviceId: service._id });
    } catch (err) {
        res.status(400).json({ message: "Validation error", error: err.message });
    }
};

export const updateServiceById = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid service ID" });
    }

    try {
        const result = await ServiceSchema.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!result) {
            return res.status(404).json({ message: "Service not found" });
        }
        res.status(204).json({ message: "Service updated", service: result });
    } catch (err) {
        res.status(400).json({ message: "Update failed", error: err.message });
    }
};

export const deleteServiceById = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid service ID" });
    }

    try {
        const result = await ServiceSchema.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ message: "Service not found" });
        }
        res.status(204).json({ message: "Service deleted" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
// This file defines the service controller functions for handling CRUD operations on services.
// It includes functions to get all services, get a service by ID, create a new service
// update a service by ID, and delete a service by ID. Each function handles errors appropriately
// and returns the appropriate HTTP status codes and messages.
// The functions use Mongoose to interact with the MongoDB database and validate ObjectIDs.    
import ClientSchema from '../models/Client.js';
import mongoose from 'mongoose';

export const getAllClients = async (req, res) => {
    try {
        const clients = await ClientSchema.find();
        res.status(200).json(clients);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

export const getClientById = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid client ID" });
    }

    try {
        const client = await ClientSchema.findById(id);
        if (!client) {
            return res.status(404).json({ message: "Client not found" });
        }
        res.status(200).json(client);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

export const createNewClient = async (req, res) => {
    try {
        const client = new ClientSchema(req.body);
        await client.save();
        res.status(201).json({ message: "Client created", clientId: client._id });
    } catch (err) {
        res.status(400).json({ message: "Validation error", error: err.message });
    }
};

export const updateClientById = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid client ID" });
    }

    try {
        const result = await ClientSchema.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!result) {
            return res.status(404).json({ message: "Client not found" });
        }
        res.status(200).json({ message: "Client updated", client: result });
    } catch (err) {
        res.status(400).json({ message: "Update failed", error: err.message });
    }
};

export const deleteClientById = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid client ID" });
    }

    try {
        const result = await ClientSchema.findByIdAndDelete(id);
        if (!result) {
            return res.status(404).json({ message: "Client not found" });
        }
        res.status(200).json({ message: "Client deleted" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

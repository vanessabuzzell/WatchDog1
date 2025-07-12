import CaregiverSchema from "../models/caregiver.js";
import mongoose from "mongoose";

export const getAllCaregivers = async (req, res) => {
    try {
        const caregivers = await CaregiverSchema.find();
        res.status(200).json(caregivers);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
}

export const getCaregiverById = async (req, res) => {
    const id = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid caregiver ID" });
    }
    try {
        const caregiver = await CaregiverSchema.findById(id);
        if (!caregiver) {
            return res.status(404).json({ message: "Caregiver not found"});
        }
        res.status(200).json(caregiver);
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message })
    }
};

export const createNewCaregiver = async (req, res) => {
    try {
        const caregiver = new CaregiverSchema(req.body);
        await caregiver.save();
        res.status(201).json({ message: "Caregiver created"})
    } catch (err) {
        res.status(400).json({ message: "Validation error", error: err.message });
    }
}

export const updateCaregiverById = async (req, res) => {
    const id = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid caregiver ID" });
    }
    try {
        const caregiver = await CaregiverSchema.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
        if (!result) {
            return res.status(404).json({ message: "Caregiver not found" });
        }
        res.status(204).json({ message: "Caregiver updated", caregiver: caregiver });
    } catch (err) {
        res.status(400).json({ message: "Update failed", error: err.message });
    }
}

export const deleteCaregiverById = async (req, res) => {
    const id = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid caregiver ID" });
    }

    try {
            const result = await CaregiverSchema.findByIdAndDelete(id);
            if (!result) {
                return res.status(404).json({ message: "Caregiver not found" });
            }
            res.status(200).json({ message: "Caregiver deleted" });
        } catch (err) {
            res.status(500).json({ message: "Server error", error: err.message });
    }
}
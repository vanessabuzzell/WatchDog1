import mongoose from "mongoose";

const caregiverSchema = new mongoose.Schema({
    name: { type: String, required: true },
    services: { type: [String], required: true }, 
    hourlyRate: { type: Number, required: true },
    availability: { type: [Date], required: true },
    yearsExperience: { type: Number, required: true },
    bio: { type: String, required: false },
    image: { type: String, required: false },
    email: { type: String, required: true },
    createdAt: { type: Date, default: Date.now, required: false },
});

const CaregiverSchema = mongoose.model('caregiver', caregiverSchema)

export default CaregiverSchema;
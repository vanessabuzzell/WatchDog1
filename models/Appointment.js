import mongoose from 'mongoose';
const { Schema } = mongoose;
const appointmentSchema = new Schema({
    client: { type: Schema.Types.ObjectId, ref: 'client', required: true },
    caregiver: { type: Schema.Types.ObjectId, ref: 'caregiver', required: true },
    service: { type: Schema.Types.ObjectId, ref: 'service', required: true },
    contact: { type: String, required: true },
    statusType: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled'], default: 'pending' },
    notes: { type: String, required: false },
    createdAt: { type: Date, default: Date.now },
    aptDate: { type: Date, required: true },
});

const AppointmentSchema = mongoose.model('appointment', appointmentSchema);

export default AppointmentSchema;
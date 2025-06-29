import mongoose from 'mongoose';

const clientSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    city: { type: String, required: true },
    location: { type: String, required: true },
    image: { type: String, required: false },
    bio: { type: String, required: false },
    createdAt: { type: Date, default: Date.now, required: false },
});

const ClientSchema = mongoose.model('client', clientSchema);

export default ClientSchema;
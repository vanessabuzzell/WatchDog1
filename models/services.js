import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema({ 
    serviceName: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    duration: { type: Number, required: true }, // in minutes
    createdAt: { type: Date, default: Date.now }
});

const ServiceSchema = mongoose.model('service', serviceSchema); 


export default ServiceSchema;
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const initDb = async (callback) => {
    const uri = process.env.MONGODB_URI;

    try {
        await mongoose.connect(uri);
        console.log("Connected to MongoDB");
        callback(null);
    } catch (err) {
        console.error("MongoDB connection error:", err);
        callback(err);
    }
};

export default { initDb };

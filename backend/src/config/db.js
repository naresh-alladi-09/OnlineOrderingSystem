import mongoose from 'mongoose';

let isMongoConnected = false;

export const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/food-ordering';
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2000,
    });
    isMongoConnected = true;
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    isMongoConnected = false;
    console.warn(`⚠️  MongoDB connection note: ${error.message}`);
    console.log(`⚡ Running with in-memory persistence fallback. Real-time operations, full CRUD, orders & admin work out of the box!`);
    console.log(`💡 To use MongoDB Atlas, paste your connection string into backend/.env (MONGODB_URI)`);
    return false;
  }
};

export const isDbConnected = () => isMongoConnected;


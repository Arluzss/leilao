import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || '', {
    });
    console.log('MongoDB Connected Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Connection failed!', error);
    process.exit(1);
  }
};

testConnection();

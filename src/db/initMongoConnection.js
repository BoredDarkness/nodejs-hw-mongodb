import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB } = process.env;
if (!MONGODB_USER || !MONGODB_PASSWORD || !MONGODB_URL || !MONGODB_DB) {
  console.error(
    'Missing: MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB',
  );
  process.exit(1);
}

export async function initMongoConnection() {
  try {
    await mongoose.connect(MONGODB_URL);
    console.log('MongoDB connected successfully!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    throw error;
  }
}

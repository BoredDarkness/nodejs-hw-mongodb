import mongoose from 'mongoose';

const { MONGODB_URL } = process.env;

if (!MONGODB_URL) {
  console.error('MONGODB_URL is not defined in .env');
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

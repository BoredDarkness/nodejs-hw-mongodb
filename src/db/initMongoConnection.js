import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGO_URI = `mongodb+srv://gwinnblaidd:kciMSm47wS7D9zw9@boreddarkness.cnpdg59.mongodb.net/contacts
?retryWrites=true&w=majority`;

export async function initMongoConnection() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Mongo connection successfully established!');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error.message);
    throw error;
  }
}

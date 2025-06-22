import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export function generateResetToken(email) {
  return jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '5m' });
}

export function verifyResetToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

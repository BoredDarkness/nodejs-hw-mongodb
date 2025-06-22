import createError from 'http-errors';
import { Session } from '../models/session.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export default async function authenticateRefresh(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return next(createError(401, 'Not authorized'));
  }

  // Перевіряємо, чи є сесія
  const session = await Session.findOne({ accessToken: token });
  if (!session) {
    return next(createError(401, 'Not authorized'));
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return next(createError(401, 'Not authorized'));
  }

  req.token = token;
  next();
}

import createError from 'http-errors';
import { User } from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import transport from '../services/mail.js';
import { generateResetToken, verifyResetToken } from '../utils/jwt.js';
import { Session } from '../models/session.js';
import dotenv from 'dotenv';
dotenv.config();

export async function register(req, res) {
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) throw createError(409, 'Email in use');

  const hash = await bcrypt.hash(password, 10);
  const newUser = await User.create({ name, email, password: hash });

  res.status(201).json({
    status: 201,
    message: 'User registered',
    data: { id: newUser._id, name: newUser.name, email: newUser.email },
  });
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw createError(401, 'Email or password is wrong');

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) throw createError(401, 'Email or password is wrong');

    const token = jwt.sign(
      { id: user._id.toString(), email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
    );

    const validUntil = new Date(Date.now() + 60 * 60 * 1000); // +1 год
    await Session.create({
      userId: user._id,
      accessToken: token,
      accessTokenValidUntil: validUntil,
    });

    res.status(200).json({
      status: 200,
      message: 'Login successful',
      data: { token },
    });
  } catch (err) {
    next(err);
  }
}

export async function sendResetEmail(req, res, next) {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw createError(404, 'User not found!');

  const token = generateResetToken(email);
  const resetLink = `${process.env.APP_DOMAIN}?token=${token}`;

  try {
    await transport.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Password reset',
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    });
  } catch (err) {
    console.error('sendMail Error:', err);
    return next(
      createError(500, 'Failed to send the email, please try again later.'),
    );
  }

  res.status(200).json({
    status: 200,
    message: 'Reset password email has been successfully sent.',
    data: {},
  });
}

export async function resetPassword(req, res) {
  const { token, password } = req.body;
  let payload;
  try {
    payload = verifyResetToken(token);
  } catch {
    throw createError(401, 'Token is expired or invalid.');
  }

  const user = await User.findOne({ email: payload.email });
  if (!user) throw createError(404, 'User not found!');

  const hashed = await bcrypt.hash(password, 10);
  user.password = hashed;
  await user.save();

  res.status(200).json({
    status: 200,
    message: 'Password has been successfully reset.',
    data: {},
  });
}

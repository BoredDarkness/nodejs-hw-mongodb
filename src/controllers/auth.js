import createError from 'http-errors';
import { User } from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Session } from '../models/session.js';
import transport from '../services/mail.js';
import { generateResetToken, verifyResetToken } from '../utils/jwt.js';
import dotenv from 'dotenv';
dotenv.config();

// — REGISTER
export async function register(req, res, next) {
  try {
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
  } catch (err) {
    next(err);
  }
}

// — LOGIN
export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw createError(401, 'Email or password is wrong');

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw createError(401, 'Email or password is wrong');

    const token = jwt.sign(
      { id: user._id.toString(), email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
    );

    const validUntil = new Date(Date.now() + 60 * 60 * 1000);
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

// — LOGOUT
export async function logout(req, res, next) {
  try {
    await Session.findOneAndDelete({ accessToken: req.token });
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
}

// — SEND RESET EMAIL
export async function sendResetEmail(req, res, next) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) throw createError(404, 'User not found!');

    const token = generateResetToken(email);
    const resetLink = `${process.env.APP_DOMAIN}/reset-password?token=${token}`;

    await transport.sendMail({
      from: process.env.SMTP_FROM,
      to: email,
      subject: 'Password reset',
      html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`,
    });

    res.status(200).json({
      status: 200,
      message: 'Reset password email has been successfully sent.',
      data: {},
    });
  } catch (err) {
    next(err(500, 'Failed to send the email, please try again later.'));
  }
}

// — RESET PASSWORD
export async function resetPassword(req, res, next) {
  try {
    const { token, password } = req.body;
    let payload;
    try {
      payload = verifyResetToken(token);
    } catch {
      throw createError(401, 'Token is expired or invalid.');
    }

    const user = await User.findOne({ email: payload.email });
    if (!user) throw createError(404, 'User not found!');

    user.password = await bcrypt.hash(password, 10);
    await user.save();

    res.status(200).json({
      status: 200,
      message: 'Password has been successfully reset.',
      data: {},
    });
  } catch (err) {
    next(err);
  }
}

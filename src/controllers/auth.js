import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { nanoid } from 'nanoid';

import { signToken, verifyToken } from '../utils/jwt.js';
import { sendResetEmail } from '../services/mail.js';
import { User } from '../models/user.js';
import {
  createSession,
  deleteSessionByUserId,
  findSessionByRefreshToken,
} from '../services/auth.js';

const RESET_TTL = '5m';

export async function registerController(req, res) {
  const { name, email, password } = req.body;
  if (await User.findOne({ email })) {
    throw createHttpError(409, 'Email in use');
  }
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hash });
  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: { _id: user._id, name: user.name, email: user.email },
  });
}

export async function loginController(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw createHttpError(401, 'Email or password is wrong');
  if (!(await bcrypt.compare(password, user.password))) {
    throw createHttpError(401, 'Email or password is wrong');
  }

  await deleteSessionByUserId(user._id);
  const accessToken = nanoid(32);
  const refreshToken = nanoid(64);
  const now = Date.now();

  await createSession({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(now + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(now + 30 * 24 * 60 * 60 * 1000),
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
  res.json({
    status: 200,
    message: 'Successfully logged in a user!',
    data: { accessToken },
  });
}

export async function refreshController(req, res) {
  const { refreshToken } = req.cookies;
  if (!refreshToken) throw createHttpError(401, 'Not authorized');

  const session = await findSessionByRefreshToken(refreshToken);
  if (!session) throw createHttpError(401, 'Not authorized');
  if (session.refreshTokenValidUntil < new Date()) {
    throw createHttpError(401, 'Refresh token expired');
  }

  await session.deleteOne();
  const accessToken = nanoid(32);
  const newRefresh = nanoid(64);
  const now = Date.now();

  await createSession({
    userId: session.userId,
    accessToken,
    refreshToken: newRefresh,
    accessTokenValidUntil: new Date(now + 15 * 60 * 1000),
    refreshTokenValidUntil: new Date(now + 30 * 24 * 60 * 60 * 1000),
  });

  res.cookie('refreshToken', newRefresh, {
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: { accessToken },
  });
}

export async function logoutController(req, res) {
  const { refreshToken } = req.cookies;
  if (!refreshToken) throw createHttpError(401, 'Not authorized');
  const session = await findSessionByRefreshToken(refreshToken);
  if (session) await session.deleteOne();
  res.clearCookie('refreshToken');
  res.status(204).send();
}

export async function sendResetEmailController(req, res) {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw createHttpError(404, 'User not found!');
  const token = signToken({ email }, RESET_TTL);
  try {
    await sendResetEmail(email, token);
  } catch {
    throw createHttpError(
      500,
      'Failed to send the email, please try again later.',
    );
  }
  res.status(200).json({
    status: 200,
    message: 'Reset password email has been successfully sent.',
    data: {},
  });
}

export async function resetPasswordController(req, res) {
  const { token, password } = req.body;
  let payload;
  try {
    payload = verifyToken(token);
  } catch {
    throw createHttpError(401, 'Token is expired or invalid.');
  }
  const user = await User.findOne({ email: payload.email });
  if (!user) throw createHttpError(404, 'User not found!');
  user.password = await bcrypt.hash(password, 10);
  await user.save();
  await deleteSessionByUserId(user._id);
  res.status(200).json({
    status: 200,
    message: 'Password has been successfully reset.',
    data: {},
  });
}

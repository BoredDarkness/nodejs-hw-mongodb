import bcrypt from 'bcrypt';
import createHttpError from 'http-errors';
import { nanoid } from 'nanoid';

import { User } from '../models/user.js';
import {
  createSession,
  deleteSessionByUserId,
  findSessionByRefreshToken,
} from '../services/auth.js';

const ACCESS_TTL = 15 * 60 * 1000;
const REFRESH_TTL = 30 * 24 * 60 * 60 * 1000;

export async function registerController(req, res) {
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) {
    throw createHttpError(409, 'Email in use');
  }

  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hash });

  res.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
  });
}

export async function loginController(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) throw createHttpError(401, 'Email or password is wrong');

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) throw createHttpError(401, 'Email or password is wrong');

  await deleteSessionByUserId(user._id);

  const accessToken = nanoid(32);
  const refreshToken = nanoid(64);
  const now = Date.now();

  await createSession({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(now + ACCESS_TTL),
    refreshTokenValidUntil: new Date(now + REFRESH_TTL),
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    maxAge: REFRESH_TTL,
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
    accessTokenValidUntil: new Date(now + ACCESS_TTL),
    refreshTokenValidUntil: new Date(now + REFRESH_TTL),
  });

  res.cookie('refreshToken', newRefresh, {
    httpOnly: true,
    maxAge: REFRESH_TTL,
  });

  res.json({
    status: 200,
    message: 'Successfully refreshed a session!',
    data: { accessToken },
  });
}

export async function logoutController(req, res) {
  await deleteSessionByUserId(req.user._id);
  res.clearCookie('refreshToken');
  res.status(204).send();
}

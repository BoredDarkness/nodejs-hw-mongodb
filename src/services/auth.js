import { Session } from '../models/session.js';

export async function createSession(data) {
  return Session.create(data);
}

export async function deleteSessionByUserId(userId) {
  return Session.deleteMany({ userId });
}

export async function findSessionByRefreshToken(token) {
  return Session.findOne({ refreshToken: token });
}

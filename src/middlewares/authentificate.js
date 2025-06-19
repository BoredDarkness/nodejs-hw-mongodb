import createHttpError from 'http-errors';
import { Session } from '../models/session.js';
import { User } from '../models/user.js';

export default async function authentificate(req, res, next) {
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  if (scheme !== 'Bearer' || !token) {
    return next(createHttpError(401, 'Not authorized'));
  }

  const session = await Session.findOne({ accessToken: token });
  if (!session) {
    return next(createHttpError(401, 'Not authorized'));
  }
  if (session.accessTokenValidUntil < new Date()) {
    return next(createHttpError(401, 'Access token expired'));
  }

  const user = await User.findById(session.userId).select('-password');
  if (!user) {
    return next(createHttpError(401, 'Not authorized'));
  }

  req.user = user;
  next();
}

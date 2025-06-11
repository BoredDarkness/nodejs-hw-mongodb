import createError from 'http-errors';
import { Session } from '../models/session.js';
import { User } from '../models/user.js';

export default async function authentificate(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const [scheme, token] = header.split(' ');
    if (scheme !== 'Bearer' || !token) {
      throw createError(401, 'Not authorized');
    }

    const session = await Session.findOne({ accessToken: token });
    if (!session) throw createError(401, 'Not authorized');
    if (session.accessTokenValidUntil < new Date())
      throw createError(401, 'Access token expired');

    const user = await User.findById(session.userId).select('-password');
    if (!user) throw createError(401, 'Not authorized');

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

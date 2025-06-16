import { Types } from 'mongoose';
import createHttpError from 'http-errors';

export const isValidId = (req, _, next) => {
  if (!Types.ObjectId.isValid(req.params.contactId)) {
    return next(createHttpError(400, 'Invalid contact ID'));
  }
  next();
};

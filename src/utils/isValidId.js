import { Types } from 'mongoose';
import createError from 'http-errors';
export const isValidId = (req, _, next) => {
  const { contactId } = req.params;
  if (!Types.ObjectId.isValid(contactId)) {
    next(createError(400, 'Invalid contact ID'));
    return;
  }
  next();
};

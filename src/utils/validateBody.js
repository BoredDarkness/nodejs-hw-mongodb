import createError from 'http-errors';
export const validateBody = (schema) => {
  return (req, _, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      next(createError(400, error.details[0].message));
      return;
    }
    next();
  };
};

import Joi from 'joi';

export const contactCreateSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.base': `"name" must be a string`,
    'any.required': `"name" is a required field`,
  }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .required()
    .messages({
      'string.email': `"email" must be a valid email`,
      'any.required': `"email" is a required field`,
    }),
  phoneNumber: Joi.string().required().messages({
    'string.base': `"phoneNumber" must be a string`,
    'any.required': `"phoneNumber" is a required field`,
  }),
  isFavourite: Joi.boolean().messages({
    'boolean.base': `"isFavourite" must be a boolean`,
  }),
  contactType: Joi.string()
    .valid('personal', 'work')
    .default('personal')
    .messages({
      'any.only': `"contactType" must be one of [personal, work]`,
    }),
  photo: Joi.string().uri().messages({
    'string.uri': `"photo" must be a valid URI`,
  }),
});

export const contactUpdateSchema = Joi.object({
  name: Joi.string().messages({
    'string.base': `"name" must be a string`,
  }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .messages({
      'string.email': `"email" must be a valid email`,
    }),
  phoneNumber: Joi.string().messages({
    'string.base': `"phoneNumber" must be a string`,
  }),
  isFavourite: Joi.boolean().messages({
    'boolean.base': `"isFavourite" must be a boolean`,
  }),
  contactType: Joi.string().valid('personal', 'work').messages({
    'any.only': `"contactType" must be one of [personal, work]`,
  }),
  photo: Joi.string().uri().messages({
    'string.uri': `"photo" must be a valid URI`,
  }),
})

  .min(1)
  .messages({
    'object.min': `"value" must have at least 1 key`,
  });

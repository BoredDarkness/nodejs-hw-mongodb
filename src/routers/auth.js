import { Router } from 'express';
import Joi from 'joi';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../utils/validateBody.js';

import {
  registerController,
  loginController,
  refreshController,
  logoutController,
  sendResetEmailController,
  resetPasswordController,
} from '../controllers/auth.js';

const router = Router();

// hw5
router.post(
  '/register',
  validateBody(
    Joi.object({
      name: Joi.string().min(3).max(30).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    }),
  ),
  ctrlWrapper(registerController),
);

router.post(
  '/login',
  validateBody(
    Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  ),
  ctrlWrapper(loginController),
);

router.post('/refresh', ctrlWrapper(refreshController));
router.post('/logout', ctrlWrapper(logoutController));

// hw6
router.post(
  '/send-reset-email',
  validateBody(Joi.object({ email: Joi.string().email().required() })),
  ctrlWrapper(sendResetEmailController),
);

router.post(
  '/reset-pwd',
  validateBody(
    Joi.object({
      token: Joi.string().required(),
      password: Joi.string().min(6).required(),
    }),
  ),
  ctrlWrapper(resetPasswordController),
);

export default router;

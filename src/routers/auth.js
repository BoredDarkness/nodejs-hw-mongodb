import Joi from 'joi';
import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../utils/validateBody.js';
import { registerSchema, loginSchema } from '../models/authSchemas.js';
import {
  registerController,
  loginController,
  refreshController,
  logoutController,
} from '../controllers/auth.js';

const router = Router();

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

router.post(
  '/register',
  validateBody(registerSchema),
  ctrlWrapper(registerController),
);

router.post('/login', validateBody(loginSchema), ctrlWrapper(loginController));

router.post('/refresh', ctrlWrapper(refreshController));
router.post('/logout', ctrlWrapper(logoutController));

export default router;

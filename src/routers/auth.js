import express from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../utils/validateBody.js';
import authenticate from '../middlewares/authenticate.js';
import authenticateRefresh from '../middlewares/authenticateRefresh.js';
import {
  registerSchema,
  loginSchema,
  sendResetSchema,
  resetPwdSchema,
} from '../models/authSchemas.js';
import {
  register,
  login,
  refresh,
  logout,
  sendResetEmail,
  resetPassword,
} from '../controllers/auth.js';

const router = express.Router();

router.post('/register', validateBody(registerSchema), ctrlWrapper(register));
router.post('/login', validateBody(loginSchema), ctrlWrapper(login));
router.post('/refresh', authenticateRefresh, ctrlWrapper(refresh));
router.post('/logout', authenticate, ctrlWrapper(logout));
router.post(
  '/send-reset-email',
  validateBody(sendResetSchema),
  ctrlWrapper(sendResetEmail),
);
router.post(
  '/reset-pwd',
  validateBody(resetPwdSchema),
  ctrlWrapper(resetPassword),
);

export default router;

import { Router } from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { authSchemas } from '../utils/schemas.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import {
  registerController,
  loginController,
  refreshController,
  logoutController,
} from '../controllers/auth.js';

const router = Router();

router.post(
  '/register',
  validateBody(authSchemas.register),
  ctrlWrapper(registerController),
);
router.post(
  '/login',
  validateBody(authSchemas.login),
  ctrlWrapper(loginController),
);
router.post('/refresh', ctrlWrapper(refreshController));
router.post('/logout', ctrlWrapper(logoutController));

export default router;

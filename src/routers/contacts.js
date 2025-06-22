import express from 'express';
import { upload } from '../utils/upload.js';
import authentificate from '../middlewares/authentificate.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../utils/validateBody.js';
import {
  contactCreateSchema,
  contactUpdateSchema,
} from '../models/contactSchemas.js';
import { createContact, updateContact } from '../controllers/contacts.js';

const router = express.Router();

router.post(
  '/',
  authentificate,
  upload.single('photo'),
  validateBody(contactCreateSchema),
  ctrlWrapper(createContact),
);

router.patch(
  '/:contactId',
  authentificate,
  upload.single('photo'),
  validateBody(contactUpdateSchema),
  ctrlWrapper(updateContact),
);

export default router;

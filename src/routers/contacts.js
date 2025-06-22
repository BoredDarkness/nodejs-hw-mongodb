import express from 'express';
import { upload } from '../utils/upload.js';
import authentificate from '../middlewares/authentificate.js';

import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../utils/validateBody.js';
import {
  contactCreateSchema,
  contactUpdateSchema,
} from '../models/contactSchemas.js';
import {
  getContacts,
  getContactById,
  createContact,
  updateContact,
  deleteContact,
} from '../controllers/contacts.js';

const router = express.Router();

router.get('/', authentificate, ctrlWrapper(getContacts));
router.get('/:contactId', authentificate, ctrlWrapper(getContactById));

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

router.delete('/:contactId', authentificate, ctrlWrapper(deleteContact));

export default router;

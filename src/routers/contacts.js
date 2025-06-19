import { Router } from 'express';
import { upload } from '../utils/upload.js';
import authentificate from '../middlewares/authentificate.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../utils/validateBody.js';
import { isValidId } from '../utils/isValidId.js';

import {
  createContactSchema,
  updateContactSchema,
} from '../models/contactSchemas.js';

import {
  listContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
} from '../controllers/contacts.js';

const router = Router();
router.use(authentificate);

router.get('/', ctrlWrapper(listContacts));
router.get('/:contactId', isValidId, ctrlWrapper(getContact));
router.post(
  '/',
  upload.single('photo'),
  validateBody(createContactSchema),
  ctrlWrapper(createContact),
);
router.patch(
  '/:contactId',
  isValidId,
  upload.single('photo'),
  validateBody(updateContactSchema),
  ctrlWrapper(updateContact),
);
router.delete('/:contactId', isValidId, ctrlWrapper(deleteContact));

export default router;

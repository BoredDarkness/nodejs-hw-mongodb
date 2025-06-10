import { Router } from 'express';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../utils/validateBody.js';
import { isValidId } from '../utils/isValidId.js';
import {
  listContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
} from '../controllers/contacts.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../models/contactSchemas.js';

const router = Router();

router.get('/', ctrlWrapper(listContacts));
router.get('/:contactId', ctrlWrapper(getContact));
router.post('/', ctrlWrapper(createContact));
router.patch('/:contactId', ctrlWrapper(updateContact));
router.delete('/:contactId', ctrlWrapper(deleteContact));
router.get('/', ctrlWrapper(listContacts));

router.get('/:contactId', isValidId, ctrlWrapper(getContact));

router.post(
  '/',

  validateBody(createContactSchema),

  ctrlWrapper(createContact),
);

router.patch(
  '/:contactId',

  isValidId,

  validateBody(updateContactSchema),

  ctrlWrapper(updateContact),
);
router.delete('/:contactId', isValidId, ctrlWrapper(deleteContact));

export default router;

import { Router } from 'express';
import { validateBody } from '../utils/validateBody.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import authentificate from '../middlewares/authentificate.js';
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
router.get('/:id', ctrlWrapper(getContact));

router.post('/', validateBody(createContactSchema), ctrlWrapper(createContact));

router.patch(
  '/:id',
  validateBody(updateContactSchema),
  ctrlWrapper(updateContact),
);

router.delete('/:id', ctrlWrapper(deleteContact));

export default router;

import { Router } from 'express';
import { validateBody } from '../middlewares/validateBody.js';
import { authenticate } from '../middlewares/authenticate.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { contactSchemas } from '../utils/schemas.js';
import {
  listContacts,
  getContact,
  createContact,
  updateContact,
  deleteContact,
} from '../controllers/contacts.js';

const router = Router();
router.use(authenticate);

router.get('/', ctrlWrapper(listContacts));
router.get('/:id', ctrlWrapper(getContact));
router.post(
  '/',
  validateBody(contactSchemas.create),
  ctrlWrapper(createContact),
);
router.patch(
  '/:id',
  validateBody(contactSchemas.update),
  ctrlWrapper(updateContact),
);
router.delete('/:id', ctrlWrapper(deleteContact));

export default router;

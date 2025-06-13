import createError from 'http-errors';
import {
  getAllContacts,
  getContactById,
  addContact,
  patchContact,
  removeContact,
} from '../services/contacts.js';

export async function listContacts(req, res) {
  const result = await getAllContacts({
    userId: req.user._id,
    page: Number(req.query.page) || 1,
    perPage: Number(req.query.perPage) || 10,
    sortBy: req.query.sortBy,
    sortOrder: req.query.sortOrder,
    type: req.query.type,
    isFavourite: req.query.isFavourite,
  });

  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: result,
  });
}

export async function getContact(req, res) {
  const { contactId } = req.params;
  const contact = await getContactById(contactId, req.user._id);
  if (!contact) {
    throw createError(404, 'Contact not found');
  }
  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
}

export async function createContact(req, res) {
  const contact = await addContact(req.body, req.user._id);
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
}

export async function updateContact(req, res) {
  const { contactId } = req.params;
  const updated = await patchContact(contactId, req.body, req.user._id);
  if (!updated) {
    throw createError(404, 'Contact not found');
  }
  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updated,
  });
}

export async function deleteContact(req, res) {
  const { contactId } = req.params;
  const deleted = await removeContact(contactId, req.user._id);
  if (!deleted) {
    throw createError(404, 'Contact not found');
  }
  res.status(204).send();
}

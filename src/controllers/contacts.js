import createHttpError from 'http-errors';
import {
  getAllContacts,
  getContactById,
  addContact,
  patchContact,
  removeContact,
} from '../services/contacts.js';

export async function listContacts(req, res) {
  const contacts = await getAllContacts();
  res.status(200).json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
}

export async function getContact(req, res) {
  const { contactId } = req.params;
  const contact = await getContactById(contactId);
  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }
  res.status(200).json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
}

export async function createContact(req, res) {
  const contact = await addContact(req.body);
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
}

export async function updateContact(req, res) {
  const { contactId } = req.params;
  const updated = await patchContact(contactId, req.body);
  if (!updated) {
    throw createHttpError(404, 'Contact not found');
  }
  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updated,
  });
}

export async function deleteContact(req, res) {
  const { contactId } = req.params;
  const deleted = await removeContact(contactId);
  if (!deleted) {
    throw createHttpError(404, 'Contact not found');
  }
  res.status(204).send();
}

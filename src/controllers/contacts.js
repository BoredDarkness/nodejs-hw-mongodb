import { getAllContacts, getContactById } from '../services/contacts.js';
import createError from 'http-errors';
import { addContact } from '../services/contacts.js';
import { patchContact } from '../services/contacts.js';
import { removeContact } from '../services/contacts.js';

export async function listContacts(req, res, next) {
  try {
    const contacts = await getAllContacts();
    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
}

export async function getContact(req, res, next) {
  try {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.status(200).json({
      status: 200,
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  } catch (error) {
    next(error);
  }
}

export async function createContact(req, res, next) {
  const { name, phoneNumber, email, isFavourite, contactType } = req.body;
  if (!name || !phoneNumber || !contactType) {
    throw createError(400, 'Missing required fields');
  }
  const contact = await addContact({
    name,
    phoneNumber,
    email,
    isFavourite,
    contactType,
  });
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
}

export async function updateContact(req, res, next) {
  const { contactId } = req.params;
  const data = req.body;
  const updated = await patchContact(contactId, data);
  if (!updated) {
    throw createError(404, 'Contact not found');
  }
  res.status(200).json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: updated,
  });
}

export async function deleteContact(req, res, next) {
  const { contactId } = req.params;
  const deleted = await removeContact(contactId);
  if (!deleted) {
    throw createError(404, 'Contact not found');
  }
  res.status(204).send();
}

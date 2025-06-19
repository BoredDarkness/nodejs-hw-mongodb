import createHttpError from 'http-errors';
import cloudinary from '../config/cloudinary.js';
import {
  getAllContacts,
  getContactById,
  addContact,
  patchContact,
  removeContact,
} from '../services/contacts.js';

export async function listContacts(req, res) {
  const { page, perPage, sortBy, sortOrder, type, isFavourite } = req.query;
  const result = await getAllContacts({
    userId: req.user._id,
    page: Number(page) || 1,
    perPage: Number(perPage) || 10,
    sortBy,
    sortOrder,
    type,
    isFavourite,
  });
  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: result,
  });
}

export async function getContact(req, res) {
  const contact = await getContactById(req.params.contactId, req.user._id);
  if (!contact) throw createHttpError(404, 'Contact not found');
  res.json({
    status: 200,
    message: `Successfully found contact with id ${req.params.contactId}!`,
    data: contact,
  });
}

export async function createContact(req, res) {
  const data = { ...req.body, userId: req.user._id };
  if (req.file) {
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'contacts' },
        (err, file) => (err ? reject(err) : resolve(file)),
      );
      stream.end(req.file.buffer);
    });
    data.photo = uploadResult.secure_url;
  }
  const contact = await addContact(data, req.user._id);
  res.status(201).json({
    status: 201,
    message: 'Successfully created a contact!',
    data: contact,
  });
}

export async function updateContact(req, res) {
  const updates = { ...req.body };
  if (req.file) {
    const uploadResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'contacts' },
        (err, file) => (err ? reject(err) : resolve(file)),
      );
      stream.end(req.file.buffer);
    });
    updates.photo = uploadResult.secure_url;
  }
  const contact = await patchContact(
    req.params.contactId,
    updates,
    req.user._id,
  );
  if (!contact) throw createHttpError(404, 'Contact not found');
  res.json({
    status: 200,
    message: 'Successfully patched a contact!',
    data: contact,
  });
}

export async function deleteContact(req, res) {
  const contact = await removeContact(req.params.contactId, req.user._id);
  if (!contact) throw createHttpError(404, 'Contact not found');
  res.status(204).send();
}

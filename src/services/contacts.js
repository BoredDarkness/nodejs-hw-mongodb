import { Contact } from '../models/contact.js';

export async function getAllContacts() {
  const contacts = await Contact.find({});
  return contacts;
}

export async function getContactById(id) {
  const contact = await Contact.findById(id);
  return contact;
}

export async function addContact(data) {
  const newContact = await Contact.create(data);
  return newContact;
}
export async function patchContact(id, data) {
  const updated = await Contact.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  return updated;
}
export async function removeContact(id) {
  const deleted = await Contact.findByIdAndDelete(id);
  return deleted;
}

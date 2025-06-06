import { Contact } from '../models/contact.js';

export async function getAllContacts() {
  const contacts = await Contact.find({});
  return contacts;
}

export async function getContactById(id) {
  const contact = await Contact.findById(id);
  return contact;
}

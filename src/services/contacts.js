import { Contact } from '../models/contact.js';

export async function getAllContacts(options = {}) {
  const {
    page = 1,
    perPage = 10,
    sortBy,
    sortOrder = 'asc',
    type,
    isFavourite,
  } = options;
  const filter = {};
  if (type) filter.contactType = type;
  if (isFavourite !== undefined) filter.isFavourite = isFavourite === 'true';

  const sortOptions = {};
  if (sortBy) {
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
  }

  const skip = (page - 1) * perPage;
  const limit = perPage;

  const [totalItems, data] = await Promise.all([
    Contact.countDocuments(filter),
    Contact.find(filter).sort(sortOptions).skip(skip).limit(limit),
  ]);

  const totalPages = Math.ceil(totalItems / perPage);

  return {
    data,
    page,
    perPage,
    totalItems,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages,
  };
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

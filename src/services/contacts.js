import { Contact } from '../models/contact.js';

export async function getAllContacts(options = {}) {
  const {
    userId,
    page = 1,
    perPage = 10,
    sortBy,
    sortOrder = 'asc',
    type,
    isFavourite,
  } = options;

  const filter = { userId };
  if (type) filter.contactType = type;
  if (isFavourite !== undefined) {
    filter.isFavourite = String(isFavourite) === 'true';
  }

  const sortOptions = {};
  if (sortBy) {
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;
  }

  const skip = (page - 1) * perPage;

  const [totalItems, data] = await Promise.all([
    Contact.countDocuments(filter),
    Contact.find(filter).sort(sortOptions).skip(skip).limit(perPage),
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

export async function getContactById(id, userId) {
  return Contact.findOne({ _id: id, userId });
}

export async function addContact(data, userId) {
  return Contact.create({ ...data, userId });
}

export async function patchContact(id, data, userId) {
  return Contact.findOneAndUpdate({ _id: id, userId }, data, {
    new: true,
    runValidators: true,
  });
}

export async function removeContact(id, userId) {
  return Contact.findOneAndDelete({ _id: id, userId });
}

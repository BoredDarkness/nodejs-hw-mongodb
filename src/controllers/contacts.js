import createError from 'http-errors';
import Contact from '../models/contact.js';
import cloudinary from '../config/cloudinary.js';

export async function getContacts(req, res, next) {
  try {
    const {
      page = 1,
      perPage = 10,
      sortBy = 'createdAt',
      sortOrder = 'asc',
      type,
      isFavourite,
    } = req.query;

    const skip = (page - 1) * perPage;
    const limit = Number(perPage);

    const filter = { userId: req.user.id };
    if (type) filter.contactType = type;
    if (typeof isFavourite !== 'undefined') {
      filter.isFavourite = isFavourite === 'true';
    }

    const totalItems = await Contact.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / limit);
    const sort = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

    const data = await Contact.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    res.status(200).json({
      status: 200,
      message: 'Successfully found contacts!',
      data: {
        data,
        page: Number(page),
        perPage: limit,
        totalItems,
        totalPages,
        hasPreviousPage: page > 1,
        hasNextPage: page < totalPages,
      },
    });
  } catch (err) {
    next(err);
  }
}

export async function getContactById(req, res, next) {
  try {
    const { contactId } = req.params;
    const contact = await Contact.findOne({
      _id: contactId,
      userId: req.user.id,
    }).lean();
    if (!contact) {
      throw createError(404, 'Contact not found');
    }
    res.status(200).json({
      status: 200,
      message: 'Successfully found contact!',
      data: contact,
    });
  } catch (err) {
    next(err);
  }
}

export async function createContact(req, res, next) {
  try {
    let photoUrl = null;
    if (req.file) {
      try {
        const uploadResult = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ folder: 'contacts' }, (err, result) => {
              if (err) return reject(err);
              resolve(result);
            })
            .end(req.file.buffer);
        });
        photoUrl = uploadResult.secure_url;
      } catch (err) {
        return next(err);
      }
    }

    const contact = await Contact.create({
      ...req.body,
      photo: photoUrl,
      userId: req.user.id,
    });

    res.status(201).json({
      status: 201,
      message: 'Successfully created a contact!',
      data: contact,
    });
  } catch (err) {
    next(err);
  }
}

export async function updateContact(req, res, next) {
  try {
    const update = { ...req.body };

    if (req.file) {
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream({ folder: 'contacts' }, (err, result) =>
            err ? reject(err) : resolve(result),
          )
          .end(req.file.buffer);
      });
      update.photo = uploadResult.secure_url;
    }

    const contact = await Contact.findByIdAndUpdate(
      req.params.contactId,
      update,
      { new: true },
    );
    if (!contact) throw createError(404, 'Contact not found');

    res.status(200).json({
      status: 200,
      message: 'Successfully patched a contact!',
      data: contact,
    });
  } catch (err) {
    next(err);
  }
}

export async function deleteContact(req, res, next) {
  try {
    const { contactId } = req.params;
    const contact = await Contact.findOneAndDelete({
      _id: contactId,
      userId: req.user.id,
    });
    if (!contact) {
      throw createError(404, 'Contact not found');
    }
    res.status(204).end();
  } catch (err) {
    next(err);
  }
}

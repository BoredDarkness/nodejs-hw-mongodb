import createError from 'http-errors';
import Contact from '../models/contact.js';
import cloudinary from '../config/cloudinary.js';

export async function createContact(req, res, next) {
  try {
    let photoUrl = null;
    if (req.file) {
      try {
        // Debug upload: log errors and result
        const uploadResult = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream({ folder: 'contacts' }, (err, result) => {
              if (err) {
                console.error('☁️ Cloudinary upload error:', err);
                return reject(err);
              }
              console.log('☁️ Cloudinary uploaded:', result);
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

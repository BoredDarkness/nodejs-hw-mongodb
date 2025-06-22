import { Schema, model } from 'mongoose';

const contactSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    isFavourite: { type: Boolean, default: false },
    contactType: { type: String, default: 'personal' },
    photo: { type: String, default: null },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
);

export default model('Contact', contactSchema);

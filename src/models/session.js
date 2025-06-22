import { Schema, model } from 'mongoose';

const sessionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    accessToken: {
      type: String,
      required: true,
    },
    accessTokenValidUntil: {
      type: Date,
      required: true,
    },

    refreshToken: {
      type: String,
    },
    refreshTokenValidUntil: {
      type: Date,
    },
  },
  { timestamps: true },
);

export const Session = model('Session', sessionSchema);

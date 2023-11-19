import { IUser } from '@/schema/user';
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema<IUser>(
  {
    first_name: String,
    last_name: String,
    email: { type: String, unique: true, lowercase: true },
    salt: String,
    hash: String,
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export const User = mongoose.models.User || mongoose.model('User', userSchema);

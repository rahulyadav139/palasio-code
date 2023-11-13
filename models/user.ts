import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    first_name: String,
    last_name: String,
    email: String,
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export const User = mongoose.models.User || mongoose.model('User', userSchema);

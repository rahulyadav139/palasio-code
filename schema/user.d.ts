import mongoose from 'mongoose';

export interface IUser {
  _id: mongoose.Types.ObjectId | string;
  first_name: string;
  last_name: string;
  email: string;
  salt: string;
  hash: string;
}

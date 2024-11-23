import mongoose from 'mongoose';

export interface IUser {
  _id: mongoose.Types.ObjectId | string;
  name: string;
  email: string;
  salt: string;
  hash: string;
}

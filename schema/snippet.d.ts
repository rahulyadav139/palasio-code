import mongoose from 'mongoose';

export interface ISnippet {
  _id?: mongoose.Types.ObjectId | string;
  data: string;
  author: mongoose.Types.ObjectId | string;
}

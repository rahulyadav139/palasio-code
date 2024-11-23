import mongoose from 'mongoose';

export interface ISnippet {
  _id: mongoose.Types.ObjectId;
  data: string;
  author?: mongoose.Types.ObjectId;
  // saved_by?: mongoose.Types.ObjectId[];
  language: string;
  name: string;
  uid: string;
  original_uid?: string;
  collaborators?: mongoose.Types.ObjectId[];
  isCollaborative: { type: boolean; default: false };
}

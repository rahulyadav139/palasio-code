import mongoose from 'mongoose';

const snippetSchema = new mongoose.Schema({
  uid: String,
  data: String,
  language: String,
  name: String,
  author: { type: mongoose.Types.ObjectId, ref: 'User' },
});

export const Snippet =
  mongoose.models.Snippet || mongoose.model('Snippet', snippetSchema);

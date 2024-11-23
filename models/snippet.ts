import { ISnippet } from '@/schema/snippet';
import mongoose from 'mongoose';

const snippetSchema = new mongoose.Schema<ISnippet>(
  {
    uid: { type: String, unique: true },
    original_uid: String,
    data: String,
    language: String,
    name: String,
    author: { type: mongoose.Types.ObjectId, ref: 'User' },
    // saved_by: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    collaborators: [{ type: mongoose.Types.ObjectId, ref: 'User' }],
    isCollaborative: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);

export const Snippet =
  mongoose.models.Snippet || mongoose.model('Snippet', snippetSchema);

export interface ISnippet {
  _id: string;
  // owner: string;
  language: string;
  author?: string;
  // saved_by?: string[];
  data: string;
  created_at: Date;
  updated_at: Date;
  uid: string;
  original_uid?: string;
  name: string;
  isCollaborative?: boolean;
}

export interface ICollaborativeSnippet extends ISnippet {
  collaborators: Collaborator[];
  author: string;
}

export interface Collaborator {
  _id: string;
  name: string;
  email: string;
}

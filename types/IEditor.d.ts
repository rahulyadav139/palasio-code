import { Doc } from 'yjs';

interface Collaboration {
  roomId: string;
  doc: Doc;
  awareness?: {
    name?: string;
    color?: string;
  };
  onConnected?: () => void;
}

export interface IEditor {
  initialState?: string;
  readonly?: boolean;
  language: string;
  collaboration?: Collaboration;
}

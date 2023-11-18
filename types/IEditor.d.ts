export interface IEditor {
  doc: string;
  readonly?: boolean;
  saveData?: boolean;
  saveDataHandler?: (string) => void;
  language: string;
}

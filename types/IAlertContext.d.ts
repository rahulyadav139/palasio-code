export interface IAlertContext {
  alert: alertStateType | null;
  setAlert: React.Dispatch<React.SetStateAction<alertStateType | null>>;
  setError: (message: string) => void;
  setSuccess: (message: string) => void;
  setWarning: (message: string) => void;
}

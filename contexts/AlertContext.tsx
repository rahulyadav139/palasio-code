import React, { ReactNode, createContext, useState } from 'react';

interface alertStateType {
  type: 'error' | 'warning' | 'success';
  message: string;
}

export interface IAlertContext {
  alert: alertStateType | null;
  setAlert: React.Dispatch<React.SetStateAction<alertStateType | null>>;
  setError: (message: string) => void;
  setSuccess: (message: string) => void;
  setWarning: (message: string) => void;
}

export const AlertContext = createContext<IAlertContext | null>(null);

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alertState, setAlertState] = useState<alertStateType | null>(null);

  const data = {
    alert: alertState,
    setAlert: setAlertState,
    setError(message: string) {
      setAlertState({ type: 'error', message });
    },
    setSuccess(message: string) {
      setAlertState({ type: 'error', message });
    },
    setWarning(message: string) {
      setAlertState({ type: 'error', message });
    },
  };

  return <AlertContext.Provider value={data}>{children}</AlertContext.Provider>;
};

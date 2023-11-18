import React, { ReactNode, createContext, useState } from 'react';

interface alertStateType {
  type: 'error' | 'warning' | 'success';
  message: string;
}

export interface IAlertContext {
  alert: alertStateType | null;
  setAlert: React.Dispatch<React.SetStateAction<alertStateType | null>>;
}

export const AlertContext = createContext<IAlertContext | null>(null);

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alertState, setAlertState] = useState<alertStateType | null>(null);

  return (
    <AlertContext.Provider
      value={{ alert: alertState, setAlert: setAlertState }}
    >
      {children}
    </AlertContext.Provider>
  );
};

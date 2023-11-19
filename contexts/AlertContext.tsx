'use client';
import React, { ReactNode, createContext, useState } from 'react';
import { IAlertContext } from '@/types';

interface alertStateType {
  type: 'error' | 'warning' | 'success';
  message: string;
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
      setAlertState({ type: 'success', message });
    },
    setWarning(message: string) {
      setAlertState({ type: 'warning', message });
    },
  };

  return <AlertContext.Provider value={data}>{children}</AlertContext.Provider>;
};

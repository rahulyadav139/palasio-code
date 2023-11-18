'use client';

import { AlertProvider } from '@/contexts/AlertContext';
import { UserProvider } from '@/contexts/UserContext';
import { FC, ReactNode } from 'react';
import { Alert } from './ui/Alert';

interface IProvider {
  children: ReactNode;
}

export const Provider: FC<IProvider> = ({ children }) => {
  return (
    <>
      <AlertProvider>
        <Alert />
        <UserProvider>{children}</UserProvider>
      </AlertProvider>
    </>
  );
};

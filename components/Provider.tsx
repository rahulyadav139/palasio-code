'use client';

import { AlertProvider, UserProvider } from '@/contexts';
import { FC, ReactNode } from 'react';
import { Alert } from '@/components';

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

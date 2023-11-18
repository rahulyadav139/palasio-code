'use client';

import { UserProvider } from '@/contexts/UserContext';
import { FC, ReactNode } from 'react';

interface IProvider {
  children: ReactNode;
}

export const Provider: FC<IProvider> = ({ children }) => {
  return (
    <>
      <UserProvider>{children}</UserProvider>
    </>
  );
};

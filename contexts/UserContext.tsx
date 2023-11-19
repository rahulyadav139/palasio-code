'use client';

import { IUser } from '@/types/IUser';
import React, { ReactNode, createContext, useState } from 'react';
import { IUserContext } from '@/types';

export const UserContext = createContext<IUserContext | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};

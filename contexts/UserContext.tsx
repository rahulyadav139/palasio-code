'use client';

import { IUser } from '@/types/IUser';
import React, { ReactNode, createContext, useState } from 'react';
import { IUserContext } from '@/types';
import { useError } from '@/hooks';
import axios, { AxiosError } from 'axios';

export const UserContext = createContext<IUserContext | null>(null);

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { errorHandler } = useError();

  const getUser = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get('/api/user');

      setUser(data.user);
    } catch (err) {
      // errorHandler(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const removeUser = () => setUser(null);

  const data = {
    getUser,
    removeUser,
    user,
    isLoading,
  };
  return <UserContext.Provider value={data}>{children}</UserContext.Provider>;
};

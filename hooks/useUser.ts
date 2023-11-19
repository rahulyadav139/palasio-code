import { UserContext } from '@/contexts';
import { useContext } from 'react';
import { IUserContext } from '@/types';

export const useUser = () => useContext(UserContext) as IUserContext;

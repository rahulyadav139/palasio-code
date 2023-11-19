import { AlertContext } from '@/contexts/AlertContext';
import { IAlertContext } from '@/types';
import { useContext } from 'react';

export const useAlert = () => useContext(AlertContext) as IAlertContext;

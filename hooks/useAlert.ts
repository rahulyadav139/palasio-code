import { AlertContext, IAlertContext } from '@/contexts/AlertContext';
import { useContext } from 'react';

export const useAlert = () => useContext(AlertContext) as IAlertContext

'use client';

import { ReactNode, useEffect, useState } from 'react';
import { UserContext } from '@/contexts/UserContext';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Typography } from '@mui/material';
import { Header } from '@/components';
import { useUser } from '@/hooks';
import { useAlert } from '@/hooks/useAlert';
import { useError } from '@/hooks/useError';

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const { user, setUser } = useUser();
  const { setAlert, setSuccess } = useAlert();
  const { errorHandler } = useError();
  const router = useRouter();

  useEffect(() => {
    if (user) return;
    (async () => {
      try {
        const { data } = await axios.get('/api/user');

        setUser(data.user);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          setSuccess('User logout');

          router.push('/login');

          return;
        }

        errorHandler(err);
      }
    })();
  }, [user]);

  if (!user) {
    return <Typography variant="body1">Loading...</Typography>;
  }
  return (
    <>
      <Header />
      {children}
    </>
  );
}

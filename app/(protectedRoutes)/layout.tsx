'use client';

import { ReactNode, useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Typography } from '@mui/material';
import { Header } from '@/components';
import { useUser } from '@/hooks';
import { useError } from '@/hooks/useError';

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const { user, setUser } = useUser();
  const { errorHandler, getStatusCode } = useError();
  const router = useRouter();

  useEffect(() => {
    if (user) return;
    (async () => {
      try {
        const { data } = await axios.get('/api/user');

        setUser(data.user);
      } catch (err) {
        const status = getStatusCode(err);
        if (status === 401) {
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

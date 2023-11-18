'use client';

import { ReactNode, useEffect, useState } from 'react';
import { UserContext } from '@/contexts/UserContext';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Typography } from '@mui/material';
import { Header } from '@/components';
import { useUser } from '@/hooks';

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const { user, setUser } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user) return;
    (async () => {
      try {
        const { data } = await axios.get('/api/user');

        setUser(data.user);
      } catch (err) {
        console.log(err);

        if (axios.isAxiosError(err)) {
          const status = err.response?.status;

          if (status === 401) {
            router.push('/login');
          }
        }
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

'use client';
import { useUser } from '@/hooks';
import { Typography } from '@mui/material';
import axios from 'axios';
import { ReactNode, useEffect, useState } from 'react';

export default function SharedRoutesLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user, setUser } = useUser();
  const [isLoading, setIsLoading] = useState<boolean>(!user);

  useEffect(() => {
    if (user) return;

    (async () => {
      try {
        const { data } = await axios.get('/api/user');

        setUser(data.user);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    })();
  }, [user]);

  if (isLoading) return <Typography variant="body2">Loading...</Typography>;

  return children;
}

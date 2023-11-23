'use client';
import { useUser, useError } from '@/hooks';
import axios from 'axios';
import { ReactNode, useEffect } from 'react';

export default function SharedRoutesLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user, setUser } = useUser();
  const { errorHandler } = useError();


  useEffect(() => {
    if (user) return;

    (async () => {
      try {
        const { data } = await axios.get('/api/user');

        setUser(data.user);
      } catch (err) {
        errorHandler(err);
      } 
    })();
  }, [user]);

  return children;
}

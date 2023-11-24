'use client';
import { useUser, useError } from '@/hooks';
import axios from 'axios';
import { ReactNode, useEffect } from 'react';

export default function SharedRoutesLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user, getUser } = useUser();
  const { errorHandler } = useError();

  useEffect(() => {
    if (user) return;

    getUser().catch(err => errorHandler(err));

    // (async () => {
    //   try {
    //     const { data } = await axios.get('/api/user');

    //     setUser(data.user);
    //   } catch (err) {
    //     errorHandler(err);
    //   }
    // })();
  }, [user]);

  return children;
}

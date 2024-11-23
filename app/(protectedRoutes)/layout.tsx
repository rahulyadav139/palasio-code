'use client';

import { ReactNode, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Loading } from '@/components';
import { useUser, useError } from '@/hooks';

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  const { user, getUser } = useUser();
  const { errorHandler, getStatusCode } = useError();
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    if (user) return;

    (async () => {
      try {
        await getUser();
      } catch (err) {
        const status = getStatusCode(err);
        if (status === 401) {
          const params = new URLSearchParams();
          params.append('redirect', path!);

          const url = `/login?${params.toString()}`;
          router.push(url);

          return;
        }

        errorHandler(err);
      }
    })();
  }, [user]);

  if (!user) {
    return <Loading />;
  }
  return children;
}

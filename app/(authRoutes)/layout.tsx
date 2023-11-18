import { ReactNode } from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default function AuthLayout({ children }: { children: ReactNode }) {
  const cookieStore = cookies();
  const token = cookieStore.get('token');

  if (token) {
    return redirect('/home');
  }
  return <>{children}</>;
}

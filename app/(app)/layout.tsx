import React from 'react';
import { cookies } from 'next/headers';
import { AppShell } from '@/components/app-shell';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const email = cookies().get('aire-session')?.value || '';
  return <AppShell email={email}>{children}</AppShell>;
}

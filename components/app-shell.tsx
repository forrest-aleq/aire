'use client';

import React, { useState } from 'react';
import { Sidebar } from './sidebar';
import { TopBar } from './topbar';
import { Toaster } from './toast';
import { CommandPalette } from './command-palette';
import { Onboarding } from './onboarding';
import { useIsMobile } from '@/lib/hooks';
import { C, SANS } from '@/lib/tokens';

export function AppShell({
  email,
  children,
}: {
  email: string;
  children: React.ReactNode;
}) {
  const isMobile = useIsMobile();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div style={{
      width: '100%', height: '100vh', display: 'flex',
      background: C.bg, color: C.text,
      fontFamily: SANS, fontSize: 14, lineHeight: 1.5,
      overflow: 'hidden', WebkitFontSmoothing: 'antialiased',
      position: 'relative',
    }}>
      <Sidebar
        email={email}
        isMobile={isMobile}
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
      />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 }}>
        <TopBar onMenu={() => setDrawerOpen(true)}/>
        <main style={{ flex: 1, overflow: 'hidden', background: C.bg }}>
          {children}
        </main>
      </div>
      <Toaster/>
      <CommandPalette/>
      <Onboarding/>
    </div>
  );
}

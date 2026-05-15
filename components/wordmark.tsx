'use client';

import React from 'react';
import { C, SERIF } from '@/lib/tokens';

export function Wordmark({
  size = 'md',
  variant = 'dark',
  mark = true,
}: {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'dark' | 'light';
  mark?: boolean;
}) {
  const sizes = {
    sm: { fs: 15, dot: 6,  gap: 8  },
    md: { fs: 18, dot: 7,  gap: 9  },
    lg: { fs: 26, dot: 9,  gap: 12 },
  } as const;
  const s = sizes[size];
  const color = variant === 'light' ? '#FFFFFF' : C.ink;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: s.gap,
      fontFamily: SERIF, fontStyle: 'italic', fontWeight: 600,
      fontSize: s.fs, color, letterSpacing: '-0.02em', lineHeight: 1,
    }}>
      {mark && (
        <span style={{
          width: s.dot, height: s.dot, borderRadius: '50%',
          background: C.accent,
          boxShadow: `0 0 0 3px ${C.accent}1F`,
          flexShrink: 0,
        }}/>
      )}
      Aire
    </span>
  );
}

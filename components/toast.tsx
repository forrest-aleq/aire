'use client';

import React, { useEffect, useState } from 'react';
import { Check, Info, AlertTriangle, X } from 'lucide-react';
import { C, SANS } from '@/lib/tokens';

export type Toast = {
  id: number;
  title: string;
  sub?: string;
  tone?: 'good' | 'accent' | 'warn';
  duration?: number;
};

type Listener = (t: Toast) => void;

const listeners = new Set<Listener>();
let nextId = 1;

export function toast(t: Omit<Toast, 'id'>) {
  const full: Toast = { id: nextId++, duration: 4000, ...t };
  listeners.forEach(l => l(full));
}

const TONE: Record<NonNullable<Toast['tone']>, { icon: any; fg: string; bg: string; bd: string }> = {
  good:   { icon: Check,          fg: C.good,   bg: C.goodSoft,   bd: '#D1F0DE' },
  accent: { icon: Info,           fg: C.accent, bg: C.accentSoft, bd: C.accentLine },
  warn:   { icon: AlertTriangle,  fg: C.warn,   bg: C.warnSoft,   bd: '#F2D9B1' },
};

export function Toaster() {
  const [items, setItems] = useState<Toast[]>([]);

  useEffect(() => {
    const onPush: Listener = t => {
      setItems(prev => [...prev, t]);
      if (t.duration) {
        setTimeout(() => {
          setItems(prev => prev.filter(x => x.id !== t.id));
        }, t.duration);
      }
    };
    listeners.add(onPush);
    return () => { listeners.delete(onPush); };
  }, []);

  const dismiss = (id: number) => setItems(prev => prev.filter(x => x.id !== id));

  return (
    <div style={{
      position: 'fixed', top: 16, right: 16, zIndex: 200,
      display: 'flex', flexDirection: 'column', gap: 10,
      pointerEvents: 'none',
    }}>
      {items.map(t => {
        const tone = TONE[t.tone || 'accent'];
        const Icon = tone.icon;
        return (
          <div key={t.id} style={{
            pointerEvents: 'auto',
            background: C.surface, border: `1px solid ${C.border}`,
            borderRadius: 12, padding: '12px 14px',
            display: 'flex', alignItems: 'flex-start', gap: 12,
            minWidth: 280, maxWidth: 380,
            boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 18px 48px -24px rgba(0,0,0,0.18)',
            animation: 'fadeUp 220ms ease-out both',
          }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8, flexShrink: 0,
              background: tone.bg, color: tone.fg, border: `1px solid ${tone.bd}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon size={15} strokeWidth={2.2}/>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: SANS, fontSize: 13, color: C.ink, fontWeight: 600,
                letterSpacing: '-0.005em', lineHeight: 1.3,
              }}>
                {t.title}
              </div>
              {t.sub && (
                <div style={{ fontFamily: SANS, fontSize: 12, color: C.text2, marginTop: 3, lineHeight: 1.45 }}>
                  {t.sub}
                </div>
              )}
            </div>
            <button
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss"
              style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                padding: 4, borderRadius: 6, color: C.text3, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = C.hover)}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <X size={13}/>
            </button>
          </div>
        );
      })}
    </div>
  );
}

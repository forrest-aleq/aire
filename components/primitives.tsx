'use client';

import React from 'react';
import { C, SANS, SERIF } from '@/lib/tokens';
import { SITUATION } from '@/lib/data';

export function Tag({ children, tone = 'neutral', size = 'sm' }: {
  children: React.ReactNode;
  tone?: 'neutral' | 'accent' | 'good' | 'warn' | 'alert';
  size?: 'sm' | 'xs';
}) {
  const tones = {
    neutral: { bg: C.panel,      fg: C.text2, bd: C.border },
    accent:  { bg: C.accentSoft, fg: C.accent, bd: C.accentLine },
    good:    { bg: C.goodSoft,   fg: C.good, bd: '#D1F0DE' },
    warn:    { bg: C.warnSoft,   fg: C.warn, bd: '#F2D9B1' },
    alert:   { bg: C.alertSoft,  fg: C.alert, bd: '#F5D0D0' },
  } as const;
  const t = tones[tone] || tones.neutral;
  const pad = size === 'xs' ? '2px 7px' : '3px 9px';
  const fs = size === 'xs' ? 11 : 12;
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap: 5,
      background: t.bg, color: t.fg, border: `1px solid ${t.bd}`,
      borderRadius: 6, padding: pad, fontFamily: SANS,
      fontSize: fs, fontWeight: 500, letterSpacing: '-0.005em', whiteSpace:'nowrap',
    }}>
      {children}
    </span>
  );
}

export function SituationTag({ situation, size = 'sm' }: {
  situation: string;
  size?: 'sm' | 'xs';
}) {
  const def = SITUATION[situation];
  if (!def) return null;
  const Icon = def.icon;
  const fs = size === 'xs' ? 11 : 12;
  return (
    <span style={{
      display:'inline-flex', alignItems:'center', gap: 6,
      background: def.priority ? C.accentSoft : C.panel,
      color: def.priority ? C.accent : C.text2,
      border: `1px solid ${def.priority ? C.accentLine : C.border}`,
      borderRadius: 6, padding: size === 'xs' ? '2px 7px' : '3px 9px',
      fontFamily: SANS, fontSize: fs, fontWeight: 500, letterSpacing: '-0.005em',
    }}>
      <Icon size={fs} strokeWidth={2}/>
      {def.label}
    </span>
  );
}

export function Score({ value, size = 'md' }: { value: number; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: { w: 44, h: 44, num: 18, lbl: 9 },
    md: { w: 56, h: 56, num: 22, lbl: 9 },
    lg: { w: 88, h: 88, num: 36, lbl: 10 },
  } as const;
  const s = sizes[size];
  const isHigh = value >= 85;
  return (
    <div style={{
      width: s.w, height: s.h, flexShrink: 0,
      borderRadius: 10,
      background: isHigh ? C.accent : C.panel,
      color: isHigh ? '#FFF' : C.text,
      border: isHigh ? 'none' : `1px solid ${C.border}`,
      display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center',
      fontFamily: SANS, lineHeight: 1,
    }}>
      <div style={{ fontSize: s.num, fontWeight: 600, letterSpacing: '-0.02em' }}>{value}</div>
      <div style={{
        fontSize: s.lbl, marginTop: 3, opacity: 0.7, fontWeight: 500,
        letterSpacing: '0.04em', textTransform: 'uppercase',
      }}>SCORE</div>
    </div>
  );
}

export function Btn({ children, variant = 'ghost', size = 'md', icon: Icon, onClick, full, type = 'button' }: {
  children?: React.ReactNode;
  variant?: 'primary' | 'accent' | 'ghost' | 'soft' | 'plain';
  size?: 'sm' | 'md';
  icon?: any;
  onClick?: () => void;
  full?: boolean;
  type?: 'button' | 'submit';
}) {
  const variants = {
    primary: { bg: C.ink,     fg: '#FFF',     bd: C.ink, hbg: '#262626' },
    accent:  { bg: C.accent,  fg: '#FFF',     bd: C.accent, hbg: '#2E2784' },
    ghost:   { bg: C.surface, fg: C.text,     bd: C.border, hbg: C.hover },
    soft:    { bg: C.panel,   fg: C.text,     bd: C.border, hbg: C.hover },
    plain:   { bg: 'transparent', fg: C.text2, bd: 'transparent', hbg: C.hover },
  } as const;
  const v = variants[variant];
  const sz = size === 'sm' ? { pad: '7px 12px', fs: 13 } : { pad: '9px 14px', fs: 14 };
  return (
    <button
      type={type}
      onClick={onClick}
      style={{
        display:'inline-flex', alignItems:'center', justifyContent:'center', gap: 7,
        background: v.bg, color: v.fg, border: `1px solid ${v.bd}`,
        borderRadius: 8, padding: sz.pad,
        fontFamily: SANS, fontWeight: 500, fontSize: sz.fs, letterSpacing: '-0.005em',
        cursor: 'pointer', transition: 'background 120ms', width: full ? '100%' : 'auto',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = v.hbg)}
      onMouseLeave={e => (e.currentTarget.style.background = v.bg)}
    >
      {Icon && <Icon size={sz.fs + 2} strokeWidth={1.8}/>}
      {children}
    </button>
  );
}

export function Stat({ label, value, sub, accent }: {
  label: string;
  value: React.ReactNode;
  sub?: React.ReactNode;
  accent?: boolean;
}) {
  return (
    <div>
      <div style={{
        fontFamily: SANS, fontSize: 12, color: C.text3, marginBottom: 8,
        fontWeight: 500, letterSpacing:'-0.005em',
      }}>
        {label}
      </div>
      <div style={{
        fontFamily: SANS,
        fontSize: 26,
        color: accent ? C.accent : C.ink,
        letterSpacing: '-0.025em', fontWeight: 500, lineHeight: 1,
      }}>
        {value}
      </div>
      {sub && (
        <div style={{ fontFamily: SANS, fontSize: 13, color: C.text3, marginTop: 8 }}>
          {sub}
        </div>
      )}
    </div>
  );
}

export function PageTitle({ title, sub, action }: {
  title: React.ReactNode;
  sub?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div style={{
      display:'flex', alignItems:'flex-end', justifyContent:'space-between',
      paddingBottom: 24, marginBottom: 28, borderBottom: `1px solid ${C.borderSoft}`,
    }}>
      <div>
        <div style={{ fontFamily: SANS, fontSize: 28, color: C.ink, letterSpacing:'-0.03em', fontWeight: 500, lineHeight: 1.1 }}>
          {title}
        </div>
        {sub && (
          <div style={{ fontFamily: SANS, fontSize: 15, color: C.text2, marginTop: 8 }}>
            {sub}
          </div>
        )}
      </div>
      {action}
    </div>
  );
}

export function SectionHeader({ title, sub, action }: {
  title: React.ReactNode;
  sub?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <div style={{ display:'flex', alignItems:'flex-end', justifyContent:'space-between', marginBottom: 16 }}>
      <div>
        <div style={{ fontFamily: SANS, fontSize: 18, color: C.ink, letterSpacing:'-0.02em', fontWeight: 500 }}>
          {title}
        </div>
        {sub && (
          <div style={{ fontFamily: SANS, fontSize: 13, color: C.text3, marginTop: 4 }}>
            {sub}
          </div>
        )}
      </div>
      {action}
    </div>
  );
}

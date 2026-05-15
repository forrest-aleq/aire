'use client';

import React, { useEffect, useState } from 'react';
import {
  Inbox, Send, PhoneIncoming, Phone, Layers, BookOpen, Heart, Lock, Home, Eye, Hammer,
  ArrowRight, Sparkles, MapPin, Lock as LockIcon, Command as CmdIcon,
} from 'lucide-react';
import { C, SANS, SERIF, MONO } from '@/lib/tokens';
import { useIsMobile } from '@/lib/hooks';

type Step = {
  title: string;
  body: string;
  visual: React.ReactNode;
};

function FlowDiagram() {
  const items = [
    { icon: Inbox,         label: 'Inbox' },
    { icon: Send,          label: 'Outreach' },
    { icon: PhoneIncoming, label: 'Front Desk' },
    { icon: Phone,         label: 'Dialer' },
    { icon: Layers,        label: 'Pipeline' },
  ];
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: 6, padding: '6px 4px', flexWrap: 'wrap', rowGap: 14,
    }}>
      {items.map((it, i) => {
        const Icon = it.icon;
        return (
          <React.Fragment key={it.label}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, minWidth: 72 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: C.accentSoft, color: C.accent,
                border: `1px solid ${C.accentLine}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={18} strokeWidth={1.8}/>
              </div>
              <div style={{ fontFamily: SANS, fontSize: 12, color: C.text2, fontWeight: 500, letterSpacing: '-0.005em' }}>
                {it.label}
              </div>
            </div>
            {i < items.length - 1 && (
              <ArrowRight size={14} color={C.text3} style={{ flexShrink: 0 }}/>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}

function SignalsGrid() {
  const items = [
    { icon: BookOpen, label: 'Pre-probate' },
    { icon: Heart,    label: 'Pre-divorce' },
    { icon: Lock,     label: 'Incarceration risk' },
    { icon: Home,     label: 'Old-roof permit' },
    { icon: Eye,      label: 'Drive-by vision' },
    { icon: Hammer,   label: 'Estate-sale' },
  ];
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8,
    }}>
      {items.map(it => {
        const Icon = it.icon;
        return (
          <div key={it.label} style={{
            display: 'flex', alignItems: 'center', gap: 10,
            padding: '10px 12px',
            background: C.accentSoft,
            border: `1px solid ${C.accentLine}`,
            borderRadius: 10,
          }}>
            <Icon size={15} color={C.accent} strokeWidth={2}/>
            <span style={{ fontFamily: SANS, fontSize: 12, color: C.accent, fontWeight: 500, letterSpacing: '-0.005em' }}>
              {it.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

function TerritoryVisual() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 28, background: C.panel, borderRadius: 12, border: `1px solid ${C.border}`,
      gap: 18,
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: 14,
        background: C.accent, color: '#FFF',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 0 0 6px ${C.accent}1A`,
      }}>
        <MapPin size={26} strokeWidth={2}/>
      </div>
      <div>
        <div style={{ fontFamily: SERIF, fontSize: 19, color: C.ink, fontWeight: 600, letterSpacing: '-0.015em', fontStyle: 'italic' }}>
          Sarasota County
        </div>
        <div style={{ fontFamily: SANS, fontSize: 12, color: C.text3, marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
          <LockIcon size={11} color={C.accent} strokeWidth={2.2}/>
          Operator + Exclusive · 184,217 parcels
        </div>
      </div>
    </div>
  );
}

function PaletteVisual() {
  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.border}`,
      borderRadius: 12, overflow: 'hidden',
      boxShadow: '0 1px 3px rgba(0,0,0,0.03), 0 16px 32px -20px rgba(0,0,0,0.16)',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '12px 14px', borderBottom: `1px solid ${C.borderSoft}`,
      }}>
        <span style={{
          width: 14, height: 14, borderRadius: 4, background: C.panel,
          border: `1px solid ${C.border}`,
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <CmdIcon size={9} color={C.text3}/>
        </span>
        <span style={{ fontFamily: SANS, fontSize: 13, color: C.text3 }}>
          Jump to a lead, page, or action…
        </span>
        <span style={{
          marginLeft: 'auto',
          fontFamily: MONO, fontSize: 11, color: C.text3,
          background: C.panel, border: `1px solid ${C.border}`,
          borderRadius: 5, padding: '2px 6px',
        }}>⌘K</span>
      </div>
      {[
        { label: 'Acquisition Inbox',  sub: 'Today’s ranked queue' },
        { label: 'Margaret L. Holloway', sub: '2847 Oleander Way · score 94' },
        { label: 'Export today’s list',  sub: 'Download as CSV' },
      ].map((row, i) => (
        <div key={row.label} style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '10px 14px',
          background: i === 1 ? C.hover : 'transparent',
          borderBottom: i < 2 ? `1px solid ${C.borderSoft}` : 'none',
        }}>
          <span style={{
            width: 22, height: 22, borderRadius: 6,
            background: i === 1 ? C.accentSoft : C.panel,
            border: `1px solid ${i === 1 ? C.accentLine : C.border}`,
          }}/>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: SANS, fontSize: 12, color: C.ink, fontWeight: 500, letterSpacing: '-0.005em' }}>
              {row.label}
            </div>
            <div style={{ fontFamily: SANS, fontSize: 11, color: C.text3, marginTop: 1 }}>
              {row.sub}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

const STEPS: Step[] = [
  {
    title: 'Welcome to Aire.',
    body: 'You operate Sarasota County under the Operator + Exclusive tier. The six proprietary signals belong only to you in this territory.',
    visual: <TerritoryVisual/>,
  },
  {
    title: 'Six pre-event signals.',
    body: 'Surfaces sellers before any other vendor sees them. Standard categories are also covered — but these are the moat.',
    visual: <SignalsGrid/>,
  },
  {
    title: 'The workflow loop.',
    body: 'Inbox each morning · operator-approved outreach · inbound AI takes callbacks · whisper coach on every dial · pipeline through close.',
    visual: <FlowDiagram/>,
  },
  {
    title: 'One key to move anywhere.',
    body: 'Press ⌘K from anywhere — jump to a lead, a page, or a workflow action. The fastest path through the platform.',
    visual: <PaletteVisual/>,
  },
];

export function Onboarding() {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    try {
      if (!localStorage.getItem('aire-onboarded')) {
        const t = setTimeout(() => setOpen(true), 600);
        return () => clearTimeout(t);
      }
    } catch {}
  }, []);

  // Esc to dismiss.
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') finish();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft')  back();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, step]);

  const finish = () => {
    try {
      localStorage.setItem('aire-onboarded', '1');
      // Suppress the duplicate welcome toast on this session.
      sessionStorage.setItem('aire-welcomed', '1');
    } catch {}
    setOpen(false);
  };

  const next = () => setStep(s => (s + 1 < STEPS.length ? s + 1 : (finish(), s)));
  const back = () => setStep(s => Math.max(0, s - 1));

  if (!open) return null;

  const s = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed', inset: 0, zIndex: 320,
        background: 'rgba(10, 10, 10, 0.42)',
        backdropFilter: 'blur(2px) saturate(140%)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 16,
        animation: 'fadeUp 180ms ease-out both',
      }}
    >
      <div
        style={{
          width: 'min(560px, 100%)',
          maxHeight: '90vh', overflow: 'auto',
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 16,
          boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 40px 80px -32px rgba(0,0,0,0.28)',
          display: 'flex', flexDirection: 'column',
          animation: 'fadeUp 240ms ease-out both',
        }}
      >
        {/* Header — step counter + dots */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 18px', borderBottom: `1px solid ${C.borderSoft}`,
        }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            fontFamily: SANS, fontSize: 11, color: C.text3,
            textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600,
          }}>
            <Sparkles size={11} color={C.accent} strokeWidth={2.2}/>
            Getting started · {step + 1} of {STEPS.length}
          </div>
          <div style={{ display: 'flex', gap: 5 }}>
            {STEPS.map((_, i) => (
              <span key={i} style={{
                width: i === step ? 20 : 6, height: 6, borderRadius: 3,
                background: i === step ? C.accent : i < step ? C.accentLine : C.border,
                transition: 'all 200ms ease-out',
              }}/>
            ))}
          </div>
        </div>

        {/* Body */}
        <div style={{
          padding: isMobile ? '24px 22px 18px' : '32px 32px 24px',
          display: 'flex', flexDirection: 'column', gap: 22,
        }}>
          <div>
            <h2 style={{
              fontFamily: SERIF, fontStyle: 'italic',
              fontSize: isMobile ? 26 : 32,
              color: C.ink, fontWeight: 500,
              letterSpacing: '-0.025em', lineHeight: 1.1,
              margin: 0,
            }}>
              {s.title}
            </h2>
            <p style={{
              fontFamily: SANS, fontSize: isMobile ? 14 : 15,
              color: C.text2, marginTop: 12, lineHeight: 1.6,
              maxWidth: 460,
            }}>
              {s.body}
            </p>
          </div>
          <div>{s.visual}</div>
        </div>

        {/* Footer */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 10, padding: '14px 18px',
          borderTop: `1px solid ${C.borderSoft}`, background: C.panel,
        }}>
          <button
            onClick={finish}
            style={{
              background: 'transparent', border: 'none', cursor: 'pointer',
              fontFamily: SANS, fontSize: 13, color: C.text3, fontWeight: 500,
              letterSpacing: '-0.005em', padding: '6px 4px',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = C.text2)}
            onMouseLeave={e => (e.currentTarget.style.color = C.text3)}
          >
            Skip tour
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {step > 0 && (
              <button
                onClick={back}
                style={{
                  padding: '8px 14px', borderRadius: 8,
                  background: C.surface, color: C.text, border: `1px solid ${C.border}`,
                  fontFamily: SANS, fontSize: 13, fontWeight: 500,
                  letterSpacing: '-0.005em', cursor: 'pointer',
                }}
              >
                Back
              </button>
            )}
            <button
              onClick={isLast ? finish : next}
              style={{
                padding: '8px 16px', borderRadius: 8,
                background: C.ink, color: '#FFF', border: 'none',
                fontFamily: SANS, fontSize: 13, fontWeight: 500,
                letterSpacing: '-0.005em', cursor: 'pointer',
                display: 'inline-flex', alignItems: 'center', gap: 6,
              }}
            >
              {isLast ? 'Get started' : 'Next'}
              <ArrowRight size={13}/>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

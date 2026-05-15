'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Search, Bell, Plus, Sparkles, PhoneIncoming, Send, RefreshCw, Mail, Menu,
} from 'lucide-react';
import { C, SANS, MONO } from '@/lib/tokens';
import { Btn } from './primitives';
import { openCommandPalette } from './command-palette';
import { useIsMobile } from '@/lib/hooks';

type Notif = {
  icon: any;
  tone: 'accent' | 'good' | 'neutral';
  title: string;
  sub: string;
  age: string;
  unread?: boolean;
};

const NOTIFICATIONS: Notif[] = [
  { icon: PhoneIncoming, tone: 'accent',  title: 'Daniel Torres called back',     sub: 'Front Desk booked a Friday walkthrough at 4:00pm.',     age: '4 min',         unread: true },
  { icon: Sparkles,      tone: 'accent',  title: 'New priority lead in Venice',   sub: 'Estate of A. Yi · 7204 Catalina Ct · est. $476k equity', age: '14 min',        unread: true },
  { icon: Send,          tone: 'neutral', title: 'Letter approved and sent',      sub: 'William Pratt · 891 Cedar Glen Ln',                      age: '1 hr',          unread: true },
  { icon: RefreshCw,     tone: 'good',    title: 'MLS feed synced',               sub: '23 new properties scored overnight.',                    age: 'today, 6:14am' },
  { icon: Mail,          tone: 'neutral', title: 'Linda Vega-Brennan replied',    sub: '“Wednesday afternoon works.”',                           age: 'yesterday' },
];

const TONE_COLOR: Record<Notif['tone'], { bg: string; fg: string }> = {
  accent:  { bg: C.accentSoft, fg: C.accent },
  good:    { bg: C.goodSoft,   fg: C.good },
  neutral: { bg: C.panel,      fg: C.text2 },
};

export function TopBar({ onMenu }: { onMenu?: () => void }) {
  const bellRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  const unreadCount = NOTIFICATIONS.filter(n => n.unread).length;

  // Click outside closes notifications.
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (!bellRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <header style={{
      height: 56, background: C.surface, borderBottom: `1px solid ${C.borderSoft}`,
      display:'flex', alignItems:'center', padding: isMobile ? '0 14px' : '0 28px',
      gap: isMobile ? 8 : 16, flexShrink: 0,
    }}>
      {isMobile && (
        <button
          onClick={onMenu}
          aria-label="Open navigation"
          style={{
            width: 36, height: 36, background: 'transparent', border: `1px solid ${C.border}`,
            borderRadius: 8, cursor: 'pointer', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <Menu size={17} color={C.text2}/>
        </button>
      )}

      <button
        onClick={() => openCommandPalette()}
        aria-label="Open command palette"
        style={{
          flex: 1, display:'flex', alignItems:'center', gap: 10,
          maxWidth: isMobile ? undefined : 520,
          background: C.panel, border: `1px solid ${C.border}`, borderRadius: 8,
          padding: '7px 10px 7px 12px',
          cursor: 'pointer', textAlign: 'left',
          transition: 'border-color 120ms, background 120ms',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = C.surface; e.currentTarget.style.borderColor = C.accentLine; }}
        onMouseLeave={e => { e.currentTarget.style.background = C.panel; e.currentTarget.style.borderColor = C.border; }}
      >
        <Search size={15} color={C.text3} strokeWidth={2}/>
        <span style={{
          flex: 1, fontFamily: SANS, fontSize: 14, color: C.text3, letterSpacing:'-0.005em',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {isMobile ? 'Search…' : 'Search owners, addresses, situations…'}
        </span>
        <kbd style={{
          display: 'inline-flex', alignItems: 'center', gap: 2,
          fontFamily: MONO, fontSize: 11, color: C.text3,
          background: C.surface, border: `1px solid ${C.border}`,
          borderRadius: 5, padding: '2px 6px', lineHeight: 1,
        }}>
          ⌘K
        </kbd>
      </button>

      <div style={{ marginLeft: 'auto', display:'flex', alignItems:'center', gap: isMobile ? 4 : 12 }}>
        {!isMobile && (
          <div style={{ display:'flex', alignItems:'center', gap: 8, fontFamily: SANS, fontSize: 12, color: C.text3 }}>
            <span style={{
              width: 7, height: 7, borderRadius: '50%',
              background: C.good, boxShadow: `0 0 0 3px ${C.good}1F`,
            }}/>
            MLS · synced 2 min ago
          </div>
        )}

        {!isMobile && <Btn variant="ghost" size="sm" icon={Plus}>New lead</Btn>}

        <div ref={bellRef} style={{ position: 'relative' }}>
          <button
            aria-label="Notifications"
            onClick={() => setOpen(v => !v)}
            style={{
              background: open ? C.hover : 'transparent', border:'none', cursor:'pointer',
              position:'relative', padding: 7, borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'background 120ms',
            }}
            onMouseEnter={e => { if (!open) e.currentTarget.style.background = C.hover; }}
            onMouseLeave={e => { if (!open) e.currentTarget.style.background = 'transparent'; }}
          >
            <Bell size={17} color={C.text2} strokeWidth={1.8}/>
            {unreadCount > 0 && (
              <span style={{
                position:'absolute', top: 2, right: 2,
                minWidth: 16, height: 16, padding: '0 4px', borderRadius: 8,
                background: C.accent, color: '#FFF',
                fontFamily: SANS, fontSize: 10, fontWeight: 600, lineHeight: 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                border: `1.5px solid ${C.surface}`,
              }}>
                {unreadCount}
              </span>
            )}
          </button>

          {open && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 8px)', right: 0,
              width: isMobile ? '92vw' : 380, maxWidth: 'calc(100vw - 24px)',
              maxHeight: '70vh', overflow: 'auto',
              background: C.surface, border: `1px solid ${C.border}`,
              borderRadius: 12, boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 24px 60px -28px rgba(0,0,0,0.18)',
              zIndex: 100,
            }}>
              <div style={{
                display:'flex', alignItems:'center', justifyContent:'space-between',
                padding: '12px 14px', borderBottom: `1px solid ${C.borderSoft}`,
              }}>
                <div style={{ fontFamily: SANS, fontSize: 13, color: C.ink, fontWeight: 600, letterSpacing: '-0.005em' }}>
                  Activity
                </div>
                <button style={{
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  fontFamily: SANS, fontSize: 12, color: C.accent, fontWeight: 500,
                  padding: 4, borderRadius: 4,
                }}>
                  Mark all read
                </button>
              </div>

              <div>
                {NOTIFICATIONS.map((n, i) => {
                  const Icon = n.icon;
                  const t = TONE_COLOR[n.tone];
                  return (
                    <div key={i}
                      style={{
                        display: 'flex', gap: 12, padding: '12px 14px',
                        borderBottom: i < NOTIFICATIONS.length - 1 ? `1px solid ${C.borderSoft}` : 'none',
                        background: n.unread ? '#FBFAFD' : 'transparent',
                        cursor: 'pointer', transition: 'background 120ms',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = C.hover)}
                      onMouseLeave={e => (e.currentTarget.style.background = n.unread ? '#FBFAFD' : 'transparent')}
                    >
                      <div style={{
                        width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                        background: t.bg, color: t.fg,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Icon size={15} strokeWidth={2}/>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8,
                        }}>
                          <div style={{
                            fontFamily: SANS, fontSize: 13, color: C.ink, fontWeight: 500,
                            letterSpacing: '-0.005em', lineHeight: 1.3,
                          }}>
                            {n.title}
                          </div>
                          <div style={{
                            fontFamily: SANS, fontSize: 11, color: C.text3, flexShrink: 0,
                          }}>
                            {n.age}
                          </div>
                        </div>
                        <div style={{
                          fontFamily: SANS, fontSize: 12, color: C.text2, marginTop: 3, lineHeight: 1.45,
                        }}>
                          {n.sub}
                        </div>
                      </div>
                      {n.unread && (
                        <span style={{
                          width: 6, height: 6, borderRadius: '50%', background: C.accent,
                          flexShrink: 0, alignSelf: 'center',
                        }}/>
                      )}
                    </div>
                  );
                })}
              </div>

              <div style={{
                padding: '10px 14px', borderTop: `1px solid ${C.borderSoft}`,
                textAlign: 'center',
              }}>
                <button style={{
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  fontFamily: SANS, fontSize: 12, color: C.text2, fontWeight: 500,
                  letterSpacing: '-0.005em',
                }}>
                  View all activity
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  Inbox, Activity, Phone, PhoneIncoming, Send, Map as MapIcon, Layers,
  LogOut, X,
} from 'lucide-react';
import { C, SANS } from '@/lib/tokens';
import { NAV_COUNTS } from '@/lib/data';
import { Wordmark } from './wordmark';

const ITEMS = [
  { href: '/today',      label: 'Inbox',         icon: Inbox },
  { href: '/situations', label: 'Signals',       icon: Activity },
  { href: '/outreach',   label: 'Outreach',      icon: Send },
  { href: '/calling',    label: 'Dialer',        icon: Phone },
  { href: '/front-desk', label: 'Front Desk',    icon: PhoneIncoming },
  { href: '/pipeline',   label: 'Pipeline',      icon: Layers },
  { href: '/market',     label: 'Territory',     icon: MapIcon },
];

function deriveIdentity(email: string) {
  const fallback = { initials: 'YO', name: 'You', org: '' };
  if (!email) return fallback;
  const [localRaw, domainRaw] = email.split('@');
  const local = (localRaw || '').trim();
  const domain = (domainRaw || '').trim();
  if (!local) return fallback;
  const parts = local.split(/[._-]+/).filter(Boolean);
  const initials = (parts.length >= 2
    ? parts[0][0] + parts[1][0]
    : local.slice(0, 2)
  ).toUpperCase();
  const name = parts.map(p => p[0].toUpperCase() + p.slice(1).toLowerCase()).join(' ');
  const orgRoot = (domain.split('.')[0] || '').trim();
  const org = orgRoot ? orgRoot[0].toUpperCase() + orgRoot.slice(1) : '';
  return { initials, name, org };
}

export function Sidebar({
  email = '',
  isMobile = false,
  open = false,
  onClose,
}: {
  email?: string;
  isMobile?: boolean;
  open?: boolean;
  onClose?: () => void;
}) {
  const pathname = usePathname() || '/today';
  const router = useRouter();
  const { initials, name, org } = deriveIdentity(email);

  const isActive = (href: string) => {
    if (href === '/today') {
      return pathname === '/today' || pathname.startsWith('/leads');
    }
    return pathname.startsWith(href);
  };

  // Close drawer on route change (mobile).
  useEffect(() => {
    if (isMobile && open) onClose?.();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Esc to close drawer.
  useEffect(() => {
    if (!isMobile || !open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose?.(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isMobile, open, onClose]);

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  };

  const asideStyle: React.CSSProperties = {
    width: 240, background: C.surface, borderRight: `1px solid ${C.borderSoft}`,
    display:'flex', flexDirection:'column', flexShrink: 0,
    paddingTop: 20, paddingBottom: 16,
    ...(isMobile ? {
      position: 'fixed', top: 0, left: 0, bottom: 0,
      zIndex: 250, transform: open ? 'translateX(0)' : 'translateX(-100%)',
      transition: 'transform 220ms cubic-bezier(0.2, 0.8, 0.2, 1)',
      boxShadow: open ? '0 40px 80px -32px rgba(0,0,0,0.28)' : 'none',
    } : {}),
  };

  return (
    <>
      {isMobile && open && (
        <div
          onClick={onClose}
          aria-hidden="true"
          style={{
            position: 'fixed', inset: 0, zIndex: 240,
            background: 'rgba(10, 10, 10, 0.32)',
            animation: 'fadeUp 160ms ease-out both',
          }}
        />
      )}

      <aside style={asideStyle}>
        <div style={{
          padding: '0 20px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <Link href="/today" style={{ textDecoration: 'none' }} onClick={onClose}>
            <Wordmark size="md"/>
          </Link>
          {isMobile && (
            <button
              onClick={onClose}
              aria-label="Close navigation"
              style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                padding: 6, borderRadius: 6, color: C.text3,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <X size={16}/>
            </button>
          )}
        </div>

        <nav style={{ padding: '0 12px', display:'flex', flexDirection:'column', gap: 2, flex: 1 }}>
          {ITEMS.map(it => {
            const active = isActive(it.href);
            const Icon = it.icon;
            const count = NAV_COUNTS[it.href];
            return (
              <Link key={it.href} href={it.href}
                style={{
                  display:'flex', alignItems:'center', gap: 10,
                  padding: '8px 12px', borderRadius: 6,
                  background: active ? C.hover : 'transparent',
                  color: active ? C.ink : C.text2,
                  textDecoration: 'none', textAlign:'left',
                  fontFamily: SANS, fontSize: 14, fontWeight: 500,
                  letterSpacing: '-0.005em',
                  transition: 'background 120ms',
                }}
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLAnchorElement).style.background = C.hover; }}
                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'; }}>
                <Icon size={16} strokeWidth={active ? 2.2 : 1.8}/>
                <span style={{ flex: 1 }}>{it.label}</span>
                {count != null && (
                  <span style={{
                    minWidth: 20, height: 18, padding: '0 6px', borderRadius: 9,
                    background: active ? C.accentSoft : C.panel,
                    color: active ? C.accent : C.text3,
                    border: `1px solid ${active ? C.accentLine : C.border}`,
                    fontFamily: SANS, fontSize: 11, fontWeight: 600, lineHeight: 1,
                    letterSpacing: '-0.005em',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom: account */}
        <div style={{ padding: '12px 12px 0', borderTop: `1px solid ${C.borderSoft}`, marginTop: 16 }}>
          <div
            style={{
              display:'flex', alignItems:'center', gap: 10, padding: '6px 8px',
              borderRadius: 8, transition: 'background 120ms',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = C.hover)}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <div style={{
                width: 30, height: 30, borderRadius: 9, background: C.ink, color: '#FFF',
                display:'flex', alignItems:'center', justifyContent:'center',
                fontFamily: SANS, fontSize: 12, fontWeight: 600, letterSpacing: '-0.005em',
              }}>{initials}</div>
              <span
                title="Online"
                style={{
                  position: 'absolute', bottom: -1, right: -1,
                  width: 9, height: 9, borderRadius: '50%',
                  background: C.good, border: `2px solid ${C.surface}`,
                }}
              />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontFamily: SANS, fontSize: 13, color: C.ink, fontWeight: 500, letterSpacing:'-0.005em',
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {name}
              </div>
              <div style={{
                fontFamily: SANS, fontSize: 11, color: C.text3, marginTop: 2,
                overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {email || `${org || 'Personal'} · Sarasota Co.`}
              </div>
            </div>
            <button
              onClick={handleLogout}
              title="Sign out"
              aria-label="Sign out"
              style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                padding: 6, borderRadius: 6, color: C.text3, display:'flex',
                alignItems:'center', justifyContent:'center',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = C.border)}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
              <LogOut size={14}/>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}

'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Inbox, Activity, Phone, PhoneIncoming, Send, Map as MapIcon, Layers,
  Search, Sparkles, BookOpen, LogOut, Download, Plus, Mail, ArrowRight,
  CornerDownLeft, Command as CmdIcon,
} from 'lucide-react';
import { C, SANS, SERIF, MONO } from '@/lib/tokens';
import { LEADS } from '@/lib/data';
import { toast } from './toast';

type Action =
  | { kind: 'route'; path: string }
  | { kind: 'callback'; run: () => void };

type Item = {
  id: string;
  label: string;
  sub?: string;
  icon: any;
  hint?: string;
  section: 'page' | 'lead' | 'action';
  keywords?: string;
  action: Action;
};

const listeners = new Set<(open: boolean) => void>();
export function openCommandPalette() {
  listeners.forEach(l => l(true));
}

const PAGES: Omit<Item, 'action'>[] = [
  { id: 'p-today',      label: 'Acquisition Inbox', sub: "Today's ranked queue, top of the list first", icon: Inbox,         section: 'page', hint: 'G I' },
  { id: 'p-situations', label: 'Signals',           sub: 'Proprietary + standard signal coverage',      icon: Activity,      section: 'page', hint: 'G S' },
  { id: 'p-outreach',   label: 'Outreach',          sub: 'Mailers, consent-gated SMS, scripts',         icon: Send,          section: 'page', hint: 'G O' },
  { id: 'p-calling',    label: 'Dialer',            sub: 'Human-dialed with AI whisper coach',          icon: Phone,         section: 'page', hint: 'G D' },
  { id: 'p-front-desk', label: 'Front Desk',        sub: 'Inbound AI on your tracked number',           icon: PhoneIncoming, section: 'page', hint: 'G F' },
  { id: 'p-pipeline',   label: 'Pipeline',          sub: 'Every conversation through close',            icon: Layers,        section: 'page', hint: 'G P' },
  { id: 'p-market',     label: 'Territory',         sub: 'Exclusivity, buy-box, coverage',              icon: MapIcon,       section: 'page', hint: 'G T' },
  { id: 'p-kit',        label: 'Design Kit',        sub: 'Tokens and primitives',                       icon: BookOpen,      section: 'page' },
];

const PAGE_ROUTES: Record<string, string> = {
  'p-today': '/today',
  'p-situations': '/situations',
  'p-outreach': '/outreach',
  'p-calling': '/calling',
  'p-front-desk': '/front-desk',
  'p-pipeline': '/pipeline',
  'p-market': '/market',
  'p-kit': '/kit',
};

const SECTION_LABEL: Record<Item['section'], string> = {
  page: 'Pages',
  lead: 'Recent leads',
  action: 'Actions',
};

const SECTION_ORDER: Item['section'][] = ['page', 'lead', 'action'];

function recentLeadIds(): string[] {
  try {
    const raw = localStorage.getItem('aire-recent-leads');
    if (raw) {
      const parsed = JSON.parse(raw) as string[];
      if (Array.isArray(parsed)) return parsed;
    }
  } catch {}
  return [];
}

export function CommandPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [activeIdx, setActiveIdx] = useState(0);
  const [recent, setRecent] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // External open trigger + global ⌘K / Ctrl+K shortcut.
  useEffect(() => {
    const onOpen = (v: boolean) => setOpen(v);
    listeners.add(onOpen);
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => {
      listeners.delete(onOpen);
      window.removeEventListener('keydown', handler);
    };
  }, []);

  // When opening: reset state, focus input, refresh recent.
  useEffect(() => {
    if (!open) return;
    setQ('');
    setActiveIdx(0);
    setRecent(recentLeadIds());
    setTimeout(() => inputRef.current?.focus(), 30);
  }, [open]);

  const recentLeads = useMemo(() => {
    const ids = recent.length ? recent : LEADS.slice(0, 4).map(l => l.id);
    return ids
      .map(id => LEADS.find(l => l.id === id))
      .filter((l): l is typeof LEADS[number] => Boolean(l))
      .slice(0, 5);
  }, [recent]);

  const handleLogout = async () => {
    await fetch('/api/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  };

  const items: Item[] = useMemo(() => {
    const pageItems: Item[] = PAGES.map(p => ({
      ...p,
      action: { kind: 'route', path: PAGE_ROUTES[p.id] },
    }));
    const leadItems: Item[] = recentLeads.map(l => ({
      id: `lead-${l.id}`,
      label: l.owner,
      sub: `${l.address} · score ${l.score}`,
      icon: Sparkles,
      section: 'lead' as const,
      keywords: `${l.address} ${l.city} ${l.id}`,
      action: { kind: 'route', path: `/leads/${l.id}` },
    }));
    const actionItems: Item[] = [
      {
        id: 'a-new-lead', label: 'New lead', sub: 'Manually add a property',
        icon: Plus, section: 'action',
        action: { kind: 'callback', run: () => toast({ tone: 'accent', title: 'New lead form coming', sub: 'Hooked into the importer next sprint.' }) },
      },
      {
        id: 'a-export', label: "Export today's list", sub: 'Download as CSV',
        icon: Download, section: 'action',
        action: { kind: 'callback', run: () => toast({ tone: 'good', title: 'Exported today.csv', sub: '8 leads · sent to your downloads' }) },
      },
      {
        id: 'a-mark-read', label: 'Mark notifications read', sub: 'Clear the activity badge',
        icon: Mail, section: 'action',
        action: { kind: 'callback', run: () => toast({ tone: 'good', title: 'Notifications cleared' }) },
      },
      {
        id: 'a-logout', label: 'Sign out', sub: 'End this session',
        icon: LogOut, section: 'action',
        action: { kind: 'callback', run: handleLogout },
      },
    ];
    return [...pageItems, ...leadItems, ...actionItems];
  }, [recentLeads]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return items;
    return items.filter(it => {
      const hay = `${it.label} ${it.sub || ''} ${it.keywords || ''}`.toLowerCase();
      return hay.includes(needle);
    });
  }, [items, q]);

  // Reset selection when filter changes.
  useEffect(() => { setActiveIdx(0); }, [q]);

  // Keep selected item scrolled into view.
  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.querySelector<HTMLDivElement>(`[data-idx="${activeIdx}"]`);
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIdx, open]);

  const run = (it: Item) => {
    setOpen(false);
    if (it.action.kind === 'route') {
      if (it.action.path.startsWith('/leads/')) {
        try {
          const id = it.action.path.split('/').pop()!;
          const next = [id, ...recent.filter(x => x !== id)].slice(0, 8);
          localStorage.setItem('aire-recent-leads', JSON.stringify(next));
        } catch {}
      }
      router.push(it.action.path);
    } else {
      it.action.run();
    }
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { e.preventDefault(); setOpen(false); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIdx(i => Math.min(filtered.length - 1, i + 1)); return; }
    if (e.key === 'ArrowUp')   { e.preventDefault(); setActiveIdx(i => Math.max(0, i - 1)); return; }
    if (e.key === 'Enter')     { e.preventDefault(); const it = filtered[activeIdx]; if (it) run(it); return; }
  };

  if (!open) return null;

  // Group filtered items by section, preserving section order.
  const grouped: Array<{ section: Item['section']; items: { it: Item; idx: number }[] }> = [];
  filtered.forEach((it, idx) => {
    let bucket = grouped.find(g => g.section === it.section);
    if (!bucket) {
      bucket = { section: it.section, items: [] };
      grouped.push(bucket);
    }
    bucket.items.push({ it, idx });
  });
  grouped.sort((a, b) => SECTION_ORDER.indexOf(a.section) - SECTION_ORDER.indexOf(b.section));

  return (
    <div
      role="dialog"
      aria-modal="true"
      onClick={() => setOpen(false)}
      style={{
        position: 'fixed', inset: 0, zIndex: 300,
        background: 'rgba(10, 10, 10, 0.42)',
        backdropFilter: 'blur(2px) saturate(140%)',
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        padding: 'max(8vh, 56px) 16px 16px',
        animation: 'fadeUp 160ms ease-out both',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        onKeyDown={onKey}
        style={{
          width: 'min(640px, 92vw)', maxHeight: '80vh',
          background: C.surface, border: `1px solid ${C.border}`,
          borderRadius: 14, overflow: 'hidden',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 40px 80px -32px rgba(0,0,0,0.28)',
          display: 'flex', flexDirection: 'column',
          animation: 'fadeUp 200ms ease-out both',
        }}
      >
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: '14px 16px', borderBottom: `1px solid ${C.borderSoft}`,
        }}>
          <Search size={16} color={C.text3} strokeWidth={2}/>
          <input
            ref={inputRef}
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Jump to a lead, page, or action…"
            style={{
              flex: 1, border: 'none', outline: 'none', background: 'transparent',
              fontFamily: SANS, fontSize: 16, color: C.text, letterSpacing: '-0.005em',
            }}
          />
          <kbd style={{
            fontFamily: MONO, fontSize: 11, color: C.text3,
            background: C.panel, border: `1px solid ${C.border}`,
            borderRadius: 5, padding: '2px 6px', lineHeight: 1,
          }}>Esc</kbd>
        </div>

        <div
          ref={listRef}
          style={{
            flex: 1, overflowY: 'auto', padding: 6,
          }}
        >
          {filtered.length === 0 && (
            <div style={{
              padding: '40px 20px', textAlign: 'center',
              fontFamily: SERIF, fontStyle: 'italic', fontSize: 15, color: C.text3,
            }}>
              Nothing matches “{q}”.
            </div>
          )}

          {grouped.map(group => (
            <div key={group.section} style={{ marginBottom: 4 }}>
              <div style={{
                padding: '8px 12px 4px',
                fontFamily: SANS, fontSize: 11, color: C.text3,
                textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600,
              }}>
                {SECTION_LABEL[group.section]}
              </div>
              {group.items.map(({ it, idx }) => {
                const Icon = it.icon;
                const active = idx === activeIdx;
                return (
                  <div
                    key={it.id}
                    data-idx={idx}
                    onMouseEnter={() => setActiveIdx(idx)}
                    onClick={() => run(it)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '10px 12px', borderRadius: 8,
                      background: active ? C.hover : 'transparent',
                      cursor: 'pointer',
                    }}
                  >
                    <div style={{
                      width: 28, height: 28, borderRadius: 7, flexShrink: 0,
                      background: active ? C.accentSoft : C.panel,
                      color: active ? C.accent : C.text2,
                      border: `1px solid ${active ? C.accentLine : C.border}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon size={14} strokeWidth={2}/>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontFamily: SANS, fontSize: 14, color: C.ink, fontWeight: 500,
                        letterSpacing: '-0.005em',
                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                      }}>
                        {it.label}
                      </div>
                      {it.sub && (
                        <div style={{
                          fontFamily: SANS, fontSize: 12, color: C.text3, marginTop: 2,
                          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                        }}>
                          {it.sub}
                        </div>
                      )}
                    </div>
                    {it.hint && !active && (
                      <kbd style={{
                        fontFamily: MONO, fontSize: 11, color: C.text3,
                        background: C.panel, border: `1px solid ${C.border}`,
                        borderRadius: 5, padding: '2px 6px', lineHeight: 1,
                      }}>
                        {it.hint}
                      </kbd>
                    )}
                    {active && (
                      <CornerDownLeft size={13} color={C.text3}/>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '8px 14px', borderTop: `1px solid ${C.borderSoft}`,
          background: C.panel,
          fontFamily: SANS, fontSize: 11, color: C.text3,
        }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <kbd style={kbdStyle}>↑</kbd><kbd style={kbdStyle}>↓</kbd> navigate
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
              <kbd style={kbdStyle}>↵</kbd> select
            </span>
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <CmdIcon size={11}/> K to open anywhere
          </span>
        </div>
      </div>
    </div>
  );
}

const kbdStyle: React.CSSProperties = {
  fontFamily: 'inherit', fontSize: 10, color: C.text2,
  background: C.surface, border: `1px solid ${C.border}`,
  borderRadius: 4, padding: '1px 5px', lineHeight: 1,
};

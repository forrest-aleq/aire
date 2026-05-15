'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Filter, Download, Mail, MessageSquare, ArrowRight, X,
} from 'lucide-react';
import { C, SANS, SERIF } from '@/lib/tokens';
import { LEADS, SITUATION } from '@/lib/data';
import {
  Tag, SituationTag, Score, Btn, Stat, PageTitle, SectionHeader,
} from '@/components/primitives';
import { Map } from '@/components/map';
import { House } from '@/components/house';
import { toast } from '@/components/toast';
import { useIsMobile } from '@/lib/hooks';

export default function TodayPage() {
  return (
    <Suspense fallback={null}>
      <TodayInner/>
    </Suspense>
  );
}

function TodayInner() {
  const router = useRouter();
  const params = useSearchParams();
  const signalFilter = params.get('signal');
  const isMobile = useIsMobile();
  const [filter, setFilter] = useState<'all' | 'priority' | 'not-contacted'>('all');
  const [selectedId, setSelectedId] = useState(LEADS[0].id);
  const [name, setName] = useState('');
  const [greeting, setGreeting] = useState('Good morning');
  const [dateStr, setDateStr] = useState('Today');

  useEffect(() => {
    const m = document.cookie.match(/(?:^|;\s*)aire-session=([^;]+)/);
    if (m) {
      const email = decodeURIComponent(m[1]);
      const local = (email.split('@')[0] || '').split(/[._-]+/).filter(Boolean);
      if (local.length) setName(local[0][0].toUpperCase() + local[0].slice(1).toLowerCase());
    }
    const now = new Date();
    const h = now.getHours();
    const greet = h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
    setGreeting(greet);
    setDateStr(now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }));

    // First-ever sign-in shows the onboarding modal (Onboarding component owns that flag).
    // For returning sessions, fire a welcome toast once per session.
    const onboarded = localStorage.getItem('aire-onboarded');
    const welcomed  = sessionStorage.getItem('aire-welcomed');
    if (onboarded && !welcomed) {
      sessionStorage.setItem('aire-welcomed', '1');
      const m = document.cookie.match(/(?:^|;\s*)aire-session=([^;]+)/);
      const email = m ? decodeURIComponent(m[1]) : '';
      const local = (email.split('@')[0] || '').split(/[._-]+/).filter(Boolean);
      const first = local.length ? local[0][0].toUpperCase() + local[0].slice(1).toLowerCase() : '';
      setTimeout(() => {
        toast({
          tone: 'accent',
          title: `${greet}${first ? `, ${first}` : ''}.`,
          sub: '3 new leads since last visit. ⌘K to jump anywhere.',
        });
      }, 450);
    }
  }, []);

  const filtered = useMemo(() => {
    let l = [...LEADS];
    if (signalFilter) l = l.filter(x => x.situations.includes(signalFilter));
    if (filter === 'priority') l = l.filter(x => x.situations.some(s => SITUATION[s]?.priority));
    if (filter === 'not-contacted') l = l.filter(x => !x.contacted);
    return l.sort((a, b) => b.score - a.score);
  }, [filter, signalFilter]);

  const selected = LEADS.find(l => l.id === selectedId) || LEADS[0];
  const topThree = filtered.slice(0, 3);
  const open = (id: string) => router.push(`/leads/${id}`);

  return (
    <div style={{ height: '100%', overflow: 'auto' }}>
      <div style={{ padding: isMobile ? '20px 16px 40px' : '32px 36px', maxWidth: 1500, margin: '0 auto' }}>
        <PageTitle
          title={
            <span style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 500 }}>
              {greeting}{name ? `, ${name}` : ''}.
            </span>
          }
          sub={
            <span style={{ display: 'inline-flex', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <span>{dateStr} · {filtered.length} leads worth a look in Venice</span>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '3px 9px', borderRadius: 999,
                background: C.accentSoft, color: C.accent,
                fontSize: 12, fontWeight: 500,
                border: `1px solid ${C.accentLine}`,
              }}>
                <span style={{
                  width: 6, height: 6, borderRadius: '50%', background: C.accent,
                  animation: 'pulse 2s ease-in-out infinite',
                }}/>
                3 new since yesterday
              </span>
            </span>
          }
          action={
            <div style={{ display: 'flex', gap: 8 }}>
              <Btn variant="ghost" size="sm" icon={Filter}
                   onClick={() => toast({ tone: 'accent', title: 'Filter the Inbox', sub: 'By signal, score, equity, city — coming next sprint.' })}>
                Filter
              </Btn>
              <Btn variant="ghost" size="sm" icon={Download}
                   onClick={() => toast({ tone: 'good', title: 'Exported today.csv', sub: `${filtered.length} leads · sent to your downloads.` })}>
                Export
              </Btn>
            </div>
          }
        />

        {signalFilter && SITUATION[signalFilter] && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            padding: '8px 14px', borderRadius: 999,
            background: C.accentSoft, border: `1px solid ${C.accentLine}`,
            color: C.accent, fontFamily: SANS, fontSize: 13, fontWeight: 500,
            letterSpacing: '-0.005em', marginBottom: 24,
          }}>
            Filtered by signal · <strong style={{ fontWeight: 600 }}>{SITUATION[signalFilter].label}</strong>
            <span style={{ color: C.accent, opacity: 0.6 }}>· {filtered.length} {filtered.length === 1 ? 'lead' : 'leads'}</span>
            <button
              onClick={() => router.push('/today')}
              aria-label="Clear signal filter"
              style={{
                background: 'transparent', border: 'none', cursor: 'pointer',
                padding: 2, borderRadius: 4, color: C.accent, display: 'flex', alignItems: 'center',
                marginLeft: 4,
              }}>
              <X size={13} strokeWidth={2.4}/>
            </button>
          </div>
        )}

        <SectionHeader
          title="Best three to call today"
          sub={signalFilter ? `Top scores within ${SITUATION[signalFilter]?.label || 'this signal'}` : 'Ranked by how likely the owner is to sell'}
        />

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: 16, marginBottom: isMobile ? 28 : 40,
        }}>
          {topThree.map((l, i) => (
            <div key={l.id}
              onClick={() => open(l.id)}
              style={{
                background: C.surface, border: `1px solid ${C.border}`,
                borderRadius: 12, padding: 20, cursor: 'pointer',
                transition: 'border-color 120ms, box-shadow 120ms',
                animation: `fadeUp 320ms ease-out both`,
                animationDelay: `${i * 70}ms`,
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = C.text3; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = 'none'; }}>
              <div style={{
                aspectRatio: '7/4', background: C.panel,
                borderRadius: 8, marginBottom: 16, overflow: 'hidden',
                border: `1px solid ${C.borderSoft}`,
              }}>
                <House lead={l}/>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 14 }}>
                <Score value={l.score} size="md"/>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: SERIF, fontSize: 19, color: C.ink, fontWeight: 600, letterSpacing: '-0.015em', lineHeight: 1.2, marginBottom: 4 }}>
                    {l.owner}
                  </div>
                  <div style={{ fontFamily: SANS, fontSize: 14, color: C.text2 }}>
                    {l.address}
                  </div>
                  <div style={{ fontFamily: SANS, fontSize: 13, color: C.text3, marginTop: 2 }}>
                    {l.city}
                  </div>
                </div>
              </div>

              <div style={{
                background: C.panel, borderRadius: 8, padding: 14,
                marginBottom: 14,
              }}>
                <div style={{ fontFamily: SANS, fontSize: 12, color: C.text3, fontWeight: 500, marginBottom: 6 }}>
                  Why this one
                </div>
                <div style={{ fontFamily: SANS, fontSize: 14, color: C.text, lineHeight: 1.45 }}>
                  {l.whyShort}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div>
                  <div style={{ fontFamily: SANS, fontSize: 12, color: C.text3 }}>Estimated equity</div>
                  <div style={{ fontFamily: SANS, fontSize: 20, color: C.ink, fontWeight: 600, letterSpacing: '-0.02em', marginTop: 2 }}>
                    ${l.equity.toLocaleString()}
                  </div>
                </div>
                <Btn variant="accent" size="sm">Open lead</Btn>
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 16 }}>
          <SectionHeader title="All leads" sub={`${filtered.length} in your market`}/>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: 24,
        }}>
          {/* List */}
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ display: 'flex', gap: 4, padding: 12, borderBottom: `1px solid ${C.borderSoft}` }}>
              {[
                { id: 'all', label: 'All' },
                { id: 'priority', label: 'Priority signals' },
                { id: 'not-contacted', label: 'Not contacted yet' },
              ].map(t => (
                <button key={t.id} onClick={() => setFilter(t.id as any)}
                  style={{
                    padding: '6px 12px', borderRadius: 6, border: 'none',
                    background: filter === t.id ? C.hover : 'transparent',
                    color: filter === t.id ? C.ink : C.text2,
                    fontFamily: SANS, fontSize: 13, fontWeight: 500,
                    cursor: 'pointer', letterSpacing: '-0.005em',
                  }}>
                  {t.label}
                </button>
              ))}
            </div>

            <div>
              {filtered.map((l, i) => {
                const isSel = l.id === selected.id;
                return (
                  <div key={l.id}
                    onClick={() => setSelectedId(l.id)}
                    onDoubleClick={() => open(l.id)}
                    style={{
                      padding: '16px 18px',
                      borderBottom: i < filtered.length - 1 ? `1px solid ${C.borderSoft}` : 'none',
                      background: isSel ? C.hover : 'transparent',
                      cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 14,
                    }}>
                    <Score value={l.score} size="sm"/>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <span style={{ fontFamily: SERIF, fontSize: 15, color: C.ink, fontWeight: 600, letterSpacing: '-0.01em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {l.owner}
                        </span>
                        {l.contacted && <Tag tone="good" size="xs">Contacted</Tag>}
                      </div>
                      <div style={{ fontFamily: SANS, fontSize: 13, color: C.text2 }}>
                        {l.address}
                      </div>
                      <div style={{ marginTop: 8 }}>
                        <SituationTag situation={l.primary} size="xs"/>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontFamily: SANS, fontSize: 15, color: C.ink, fontWeight: 600, letterSpacing: '-0.015em' }}>
                        ${(l.equity / 1000).toFixed(0)}k
                      </div>
                      <div style={{ fontFamily: SANS, fontSize: 12, color: C.text3, marginTop: 2 }}>
                        equity
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Map + preview */}
          <div>
            <Map leads={LEADS} selectedId={selected.id} onSelect={setSelectedId} height={360}/>

            <div style={{
              marginTop: 16, background: C.surface, border: `1px solid ${C.border}`,
              borderRadius: 12, padding: 20,
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
                <div>
                  <div style={{ fontFamily: SERIF, fontSize: 18, color: C.ink, fontWeight: 600, letterSpacing: '-0.015em', marginBottom: 4 }}>
                    {selected.owner}
                  </div>
                  <div style={{ fontFamily: SANS, fontSize: 14, color: C.text2 }}>
                    {selected.address} · {selected.city}
                  </div>
                </div>
                <Score value={selected.score} size="md"/>
              </div>

              <div style={{ display: 'flex', gap: 6, marginBottom: 16, flexWrap: 'wrap' }}>
                {selected.situations.map(s => <SituationTag key={s} situation={s} size="xs"/>)}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, paddingTop: 14, borderTop: `1px solid ${C.borderSoft}` }}>
                <Stat label="Value" value={`$${(selected.avm / 1000).toFixed(0)}k`}/>
                <Stat label="Equity" value={`$${(selected.equity / 1000).toFixed(0)}k`} accent/>
                <Stat label="Bed/Bath" value={`${selected.beds} / ${selected.baths}`}/>
              </div>

              <div style={{ marginTop: 16, display: 'flex', gap: 8 }}>
                <Btn variant="ghost" size="sm" icon={Mail}
                     onClick={() => toast({ tone: 'accent', title: 'Mailer drafted', sub: `Aire wrote a starting point for ${selected.owner}. Open the lead to review.` })}>
                  Mail
                </Btn>
                <Btn variant="ghost" size="sm" icon={MessageSquare}
                     onClick={() => toast({ tone: 'warn', title: 'Texting needs consent', sub: 'Mail first. SMS opens after the seller opts in.' })}>
                  Text
                </Btn>
                <Btn variant="accent" size="sm" icon={ArrowRight} onClick={() => open(selected.id)}>Open</Btn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

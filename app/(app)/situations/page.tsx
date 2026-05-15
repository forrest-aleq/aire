'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, Sparkles, ShieldCheck } from 'lucide-react';
import { C, SANS } from '@/lib/tokens';
import { SITUATION } from '@/lib/data';
import { Tag, Stat, PageTitle, SectionHeader } from '@/components/primitives';
import { useIsMobile } from '@/lib/hooks';

export default function SituationsPage() {
  const router = useRouter();
  const isMobile = useIsMobile();
  const groups = [
    {
      title: 'Proprietary signals',
      sub: 'Six pre-event categories no other vendor surfaces at scale.',
      badge: 'Moat',
      keys: ['inherited-recent','separating','owner-in-jail','old-roof','vacant-damaged','estate-sale'],
    },
    {
      title: 'Standard coverage',
      sub: 'Table-stakes categories. Equal coverage to the incumbents — sharper scoring.',
      badge: 'Included',
      keys: [
        'in-probate','divorce','behind-on-payments','code-issues','tax-trouble','fire-flood',
        'long-on-market','older-owner','vacant','paid-off',
      ],
    },
  ];

  const stats: Record<string, { active: number; new7: number; deals: string }> = {
    'inherited-recent':  { active: 47,  new7: 12, deals: '1 in 5' },
    'separating':        { active: 28,  new7: 6,  deals: '1 in 7' },
    'owner-in-jail':     { active: 9,   new7: 2,  deals: '1 in 5' },
    'old-roof':          { active: 412, new7: 38, deals: '1 in 12' },
    'vacant-damaged':    { active: 156, new7: 24, deals: '1 in 9' },
    'estate-sale':       { active: 18,  new7: 5,  deals: '1 in 6' },
    'in-probate':        { active: 84,  new7: 14, deals: '1 in 8' },
    'divorce':           { active: 62,  new7: 9,  deals: '1 in 11' },
    'behind-on-payments':{ active: 124, new7: 18, deals: '1 in 10' },
    'code-issues':       { active: 287, new7: 41, deals: '1 in 16' },
    'tax-trouble':       { active: 92,  new7: 11, deals: '1 in 13' },
    'fire-flood':        { active: 14,  new7: 2,  deals: '1 in 8' },
    'older-owner':       { active: 1284,new7: 67, deals: '1 in 25' },
    'vacant':            { active: 218, new7: 19, deals: '1 in 14' },
    'paid-off':          { active: 1842,new7: 84, deals: '1 in 20' },
    'long-on-market':    { active: 96,  new7: 14, deals: '1 in 16' },
  };

  return (
    <div style={{ height: '100%', overflow:'auto' }}>
      <div style={{ padding: isMobile ? '20px 16px 40px' : '32px 36px', maxWidth: 1500, margin:'0 auto' }}>
        <PageTitle
          title="Signal Engine"
          sub={
            <span style={{ display: 'inline-flex', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <span>What we're watching across Sarasota County right now. Six proprietary signals + ten standard.</span>
              <Tag tone="accent" size="xs">
                <Sparkles size={11} strokeWidth={2.2}/> Refreshed nightly · last 6:14am
              </Tag>
            </span>
          }
        />

        <div style={{
          display:'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          gap: isMobile ? 12 : 16, marginBottom: 40,
        }}>
          {[
            { l:'Active signals',    v:'4,743', sub:'Across 16 categories' },
            { l:'New this week',     v:'366',   sub:'+12% vs last week' },
            { l:'Average score',     v:'64',    sub:'Up 2 from a month ago' },
            { l:'Score ≥ 80',        v:'342',   sub:"Worth your acquisition manager's time" },
          ].map((m, i) => (
            <div key={i} style={{ background: C.surface, border:`1px solid ${C.border}`, borderRadius: 12, padding: isMobile ? 14 : 22 }}>
              <Stat label={m.l} value={m.v} sub={m.sub}/>
            </div>
          ))}
        </div>

        {groups.map(g => (
          <div key={g.title} style={{ marginBottom: 40 }}>
            <SectionHeader
              title={
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
                  {g.title}
                  <Tag tone={g.badge === 'Moat' ? 'accent' : 'neutral'} size="xs">
                    {g.badge === 'Moat' && <Sparkles size={10} strokeWidth={2.2}/>}
                    {g.badge}
                  </Tag>
                </span>
              }
              sub={g.sub}
            />
            <div style={{ background: C.surface, border:`1px solid ${C.border}`, borderRadius: 12, overflow:'hidden' }}>
              {g.keys.map((k, i) => {
                const def = SITUATION[k];
                const s = stats[k];
                const Icon = def.icon;
                const moat = def.tier === 'moat';
                return (
                  <div
                    key={k}
                    onClick={() => router.push(`/today?signal=${k}`)}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: isMobile ? '1fr' : '1fr 120px 120px 120px 40px',
                      padding: isMobile ? '14px 18px' : '18px 22px', alignItems:'center', gap: isMobile ? 10 : 16,
                      borderBottom: i < g.keys.length - 1 ? `1px solid ${C.borderSoft}` : 'none',
                      cursor: 'pointer', transition: 'background 120ms',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = C.hover)}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div style={{ display:'flex', alignItems:'flex-start', gap: 14 }}>
                      <div style={{
                        width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                        background: moat ? C.accentSoft : C.panel,
                        color: moat ? C.accent : C.text2,
                        display:'flex', alignItems:'center', justifyContent:'center',
                        border: `1px solid ${moat ? C.accentLine : C.border}`,
                      }}>
                        <Icon size={18} strokeWidth={1.8}/>
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ display:'flex', alignItems:'center', gap: 8, flexWrap: 'wrap' }}>
                          <span style={{ fontFamily: SANS, fontSize: 15, color: C.ink, fontWeight: 500, letterSpacing:'-0.01em' }}>
                            {def.label}
                          </span>
                          {moat && <Tag tone="accent" size="xs">Proprietary</Tag>}
                        </div>
                        <div style={{ fontFamily: SANS, fontSize: 13, color: C.text2, marginTop: 4, lineHeight: 1.5 }}>
                          {def.reason}
                        </div>
                        {def.source && (
                          <div style={{
                            fontFamily: SANS, fontSize: 11, color: C.text3, marginTop: 4,
                            letterSpacing: '0.02em',
                          }}>
                            Source · {def.source}
                          </div>
                        )}
                      </div>
                    </div>
                    {isMobile ? (
                      <div style={{
                        display: 'flex', gap: 18, paddingLeft: 52,
                        fontFamily: SANS, fontSize: 13, color: C.text2,
                      }}>
                        <span><strong style={{ color: C.ink, fontWeight: 600 }}>{s.active.toLocaleString()}</strong> active</span>
                        <span><strong style={{ color: C.ink, fontWeight: 600 }}>+{s.new7}</strong> this wk</span>
                        <span>closes <strong style={{ color: C.ink, fontWeight: 600 }}>{s.deals}</strong></span>
                      </div>
                    ) : (
                      <>
                        <div style={{ textAlign:'right' }}>
                          <div style={{ fontFamily: SANS, fontSize: 12, color: C.text3 }}>Active</div>
                          <div style={{ fontFamily: SANS, fontSize: 17, color: C.ink, fontWeight: 600, letterSpacing:'-0.015em', marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>
                            {s.active.toLocaleString()}
                          </div>
                        </div>
                        <div style={{ textAlign:'right' }}>
                          <div style={{ fontFamily: SANS, fontSize: 12, color: C.text3 }}>New / week</div>
                          <div style={{ fontFamily: SANS, fontSize: 17, color: C.ink, fontWeight: 600, letterSpacing:'-0.015em', marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>
                            +{s.new7}
                          </div>
                        </div>
                        <div style={{ textAlign:'right' }}>
                          <div style={{ fontFamily: SANS, fontSize: 12, color: C.text3 }}>Closes</div>
                          <div style={{ fontFamily: SANS, fontSize: 15, color: C.text, fontWeight: 500, marginTop: 2 }}>
                            {s.deals}
                          </div>
                        </div>
                        <ChevronRight size={16} color={C.text3} style={{ justifySelf:'end' }}/>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        <div style={{
          padding: 18, background: C.panel, border: `1px solid ${C.border}`,
          borderRadius: 12, display: 'flex', gap: 12, alignItems: 'flex-start',
        }}>
          <ShieldCheck size={18} color={C.good} strokeWidth={2}/>
          <div style={{ fontFamily: SANS, fontSize: 13, color: C.text2, lineHeight: 1.6 }}>
            <strong style={{ color: C.ink, fontWeight: 600 }}>Public records only.</strong>{' '}
            Aire scores against obituaries, county filings, MLS feeds, municipal permits, FEMA disaster declarations, and licensed property data (BatchData, ATTOM). No purchased PII. No scraping anything that requires a login.
          </div>
        </div>
      </div>
    </div>
  );
}

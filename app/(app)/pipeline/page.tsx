'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Filter, Download } from 'lucide-react';
import { C, SANS, SERIF } from '@/lib/tokens';
import { Tag, Btn, Score, Stat, PageTitle } from '@/components/primitives';
import { PIPELINE_STAGES, PIPELINE_CARDS } from '@/lib/data';
import { useIsMobile } from '@/lib/hooks';
import { toast } from '@/components/toast';

export default function PipelinePage() {
  const router = useRouter();
  const isMobile = useIsMobile();

  return (
    <div style={{ height: '100%', overflow:'auto' }}>
      <div style={{ padding: isMobile ? '20px 16px 40px' : '32px 36px', maxWidth: 1500, margin:'0 auto' }}>
        <PageTitle
          title="Pipeline"
          sub="Every conversation in motion, from first-touch through close."
          action={
            <div style={{ display:'flex', gap: 8 }}>
              <Btn variant="ghost" size="sm" icon={Filter}
                   onClick={() => toast({ tone: 'accent', title: 'Filter pipeline', sub: 'Stage, signal, owner — sliced any way. Coming next sprint.' })}>
                Filter
              </Btn>
              <Btn variant="ghost" size="sm" icon={Download}
                   onClick={() => toast({ tone: 'good', title: 'Pipeline exported', sub: '16 cards · pipeline.csv sent to downloads.' })}>
                Export
              </Btn>
            </div>
          }
        />

        <div style={{
          display:'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(5, 1fr)',
          gap: isMobile ? 12 : 16, marginBottom: 36,
        }}>
          {[
            { l:'In pipeline (AVM)',   v:'$8.4M',   sub:'Across all open stages' },
            { l:'Weighted pipeline',   v:'$1.9M',   sub:'Probability-adjusted' },
            { l:'Avg cycle',           v:'34 days', sub:'First-touch → contract' },
            { l:'Under contract',      v:'3',       sub:'$127k fees YTD' },
            { l:'Closed this month',   v:'1',       sub:'$46k fee · May 6' },
          ].map((m, i) => (
            <div key={i} style={{ background: C.surface, border:`1px solid ${C.border}`, borderRadius: 12, padding: isMobile ? 14 : 22 }}>
              <Stat label={m.l} value={m.v} sub={m.sub}/>
            </div>
          ))}
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? `repeat(${PIPELINE_STAGES.length}, 78vw)` : `repeat(${PIPELINE_STAGES.length}, 1fr)`,
          gap: 14, minHeight: 600,
          overflowX: isMobile ? 'auto' : 'visible',
          paddingBottom: isMobile ? 16 : 0,
          marginRight: isMobile ? -16 : 0,
        }}>
          {PIPELINE_STAGES.map(stage => {
            const cards = PIPELINE_CARDS.filter(c => c.stage === stage.id);
            return (
              <div key={stage.id} style={{
                background: C.panel, border:`1px solid ${C.border}`, borderRadius: 12,
                display:'flex', flexDirection:'column', minWidth: 0,
              }}>
                <div style={{
                  padding:'14px 16px', borderBottom: `1px solid ${C.border}`,
                  display:'flex', alignItems:'center', justifyContent:'space-between',
                }}>
                  <span style={{ fontFamily: SANS, fontSize: 13, color: C.ink, fontWeight: 600, letterSpacing:'-0.005em' }}>
                    {stage.label}
                  </span>
                  <span style={{
                    fontFamily: SANS, fontSize: 12, color: C.text3, fontWeight: 500,
                    background: C.surface, border: `1px solid ${C.border}`,
                    borderRadius: 999, padding: '2px 8px', fontVariantNumeric: 'tabular-nums',
                  }}>
                    {cards.length}
                  </span>
                </div>
                <div style={{ flex: 1, padding: 10, display:'flex', flexDirection:'column', gap: 8 }}>
                  {cards.map((c, i) => (
                    <div
                      key={i}
                      onClick={() => {
                        if (c.leadId) {
                          router.push(`/leads/${c.leadId}`);
                        } else {
                          toast({ tone: 'accent', title: `${c.name}`, sub: 'This card was added manually — full lead profile coming.' });
                        }
                      }}
                      style={{
                        background: C.surface, border:`1px solid ${C.border}`, borderRadius: 10, padding: 12,
                        cursor: 'pointer', transition: 'border-color 120ms, box-shadow 120ms',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = C.text3; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = C.border; e.currentTarget.style.boxShadow = 'none'; }}
                    >
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom: 8 }}>
                        <Tag tone="accent" size="xs">{c.situation}</Tag>
                        <Score value={c.score} size="sm"/>
                      </div>
                      <div style={{ fontFamily: SERIF, fontSize: 14, color: C.ink, fontWeight: 600, letterSpacing:'-0.01em', lineHeight: 1.3, marginBottom: 4 }}>
                        {c.name}
                      </div>
                      <div style={{ fontFamily: SANS, fontSize: 12, color: C.text3, marginBottom: 10 }}>
                        {c.addr}
                      </div>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline' }}>
                        <span style={{ fontFamily: SANS, fontSize: 13, color: C.accent, fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
                          ${(c.value/1000).toFixed(0)}k
                        </span>
                        <span style={{ fontFamily: SANS, fontSize: 11, color: C.text3 }}>
                          {c.age}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

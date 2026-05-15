'use client';

import React from 'react';
import { Plus, Lock, ShieldCheck, Sparkles, MapPin } from 'lucide-react';
import { C, SANS, SERIF } from '@/lib/tokens';
import { Btn, Stat, PageTitle, SectionHeader, Tag } from '@/components/primitives';
import { Map } from '@/components/map';
import { LEADS, SITUATION, SITUATION_KEYS_MOAT } from '@/lib/data';
import { useIsMobile } from '@/lib/hooks';
import { toast } from '@/components/toast';

export default function TerritoryPage() {
  const isMobile = useIsMobile();
  const cities = [
    { city:'Venice',       props: 38214, active: 1284, mailers: 842,  cycle: '4 weeks',  ytd: 184000 },
    { city:'Sarasota',     props: 52680, active: 1542, mailers: 1207, cycle: '6 weeks',  ytd: 156000 },
    { city:'North Port',   props: 31402, active: 872,  mailers: 491,  cycle: '5 weeks',  ytd: 91000  },
    { city:'Englewood',    props: 18742, active: 504,  mailers: 312,  cycle: '4 weeks',  ytd: 56000  },
    { city:'Osprey',       props: 8128,  active: 218,  mailers: 167,  cycle: '5 weeks',  ytd: 0      },
    { city:'Nokomis',      props: 9416,  active: 184,  mailers: 114,  cycle: '4 weeks',  ytd: 0      },
    { city:'Siesta Key',   props: 5612,  active: 87,   mailers: 28,   cycle: '7 weeks',  ytd: 0      },
    { city:'Longboat Key', props: 4023,  active: 52,   mailers: 23,   cycle: '7 weeks',  ytd: 0      },
  ];

  const buyBox = [
    { k: 'Price range',      v: '$150k – $725k' },
    { k: 'Beds / baths',     v: '≥ 2 / ≥ 1' },
    { k: 'Square feet',      v: '1,200 – 3,200' },
    { k: 'Condition',        v: 'Any (cash buyer)' },
    { k: 'Title status',     v: 'Free-and-clear preferred' },
    { k: 'Min motivation',   v: 'Score ≥ 60' },
  ];

  return (
    <div style={{ height: '100%', overflow:'auto' }}>
      <div style={{ padding: isMobile ? '20px 16px 40px' : '32px 36px', maxWidth: 1500, margin:'0 auto' }}>
        <PageTitle
          title="Territory"
          sub={
            <span style={{ display: 'inline-flex', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
              <MapPin size={13} color={C.text3}/>
              Sarasota County, FL · 184,217 parcels · 8 cities
            </span>
          }
          action={
            <Btn variant="ghost" icon={Plus}
                 onClick={() => toast({ tone: 'accent', title: 'Expand into another territory', sub: 'Operator + Exclusive · $2,500/mo per city. We confirm signal-availability before activation.' })}>
              Add a market
            </Btn>
          }
        />

        <div style={{
          background: C.accentSoft, border:`1px solid ${C.accentLine}`, borderRadius: 12,
          padding: isMobile ? 18 : 22, marginBottom: 28,
          display:'flex', gap: 16, alignItems:'flex-start',
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: 10, background: C.surface,
            border: `1px solid ${C.accentLine}`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink: 0,
          }}>
            <Lock size={20} color={C.accent}/>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
              <div style={{ fontFamily: SERIF, fontSize: isMobile ? 17 : 18, color: C.ink, fontWeight: 600, letterSpacing:'-0.015em' }}>
                Operator + Exclusive · Sarasota County
              </div>
              <Tag tone="accent" size="xs">
                <Sparkles size={10} strokeWidth={2.2}/> Exclusive
              </Tag>
            </div>
            <div style={{ fontFamily: SANS, fontSize: 14, color: C.text, lineHeight: 1.55, marginBottom: 12 }}>
              You're the only operator in Sarasota County with access to the six proprietary signals. Other Aire customers in your area only see standard coverage.
            </div>
            <div style={{
              display: 'grid', gap: 8,
              gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
            }}>
              {SITUATION_KEYS_MOAT.map(k => {
                const Icon = SITUATION[k].icon;
                return (
                  <div key={k} style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    fontFamily: SANS, fontSize: 12, color: C.text2,
                  }}>
                    <Icon size={13} color={C.accent} strokeWidth={2}/>
                    {SITUATION[k].label}
                  </div>
                );
              })}
            </div>
            <div style={{
              marginTop: 14, paddingTop: 12, borderTop: `1px solid ${C.accentLine}`,
              display:'flex', gap: 18, flexWrap: 'wrap',
              fontFamily: SANS, fontSize: 12, color: C.text2,
            }}>
              <span><strong style={{ color: C.ink }}>Term:</strong> 12 months · auto-renew</span>
              <span><strong style={{ color: C.ink }}>Cost:</strong> $2,500/mo</span>
              <span><strong style={{ color: C.ink }}>Next renewal:</strong> Apr 30, 2027</span>
            </div>
          </div>
        </div>

        <div style={{
          display:'grid',
          gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr',
          gap: 24, marginBottom: 32,
        }}>
          <Map leads={LEADS} selectedId={null} onSelect={()=>{}} height={isMobile ? 280 : 420}/>
          <div style={{
            background: C.surface, border:`1px solid ${C.border}`, borderRadius: 12,
            padding: 22, display:'flex', flexDirection:'column', gap: 22,
          }}>
            <Stat label="Parcels in territory"   value="184,217"/>
            <Stat label="Active signals"          value="4,743" sub="2.6% of parcels worth a look"/>
            <Stat label="First-touch (90 days)"   value="3,184" sub="1.7% of the market reached"/>
            <Stat label="Lead → contract"         value="2.1%"  sub="One closing per ~50 leads"/>
            <Stat label="Avg assignment fee"      value="$42,600" sub="Last 12 closings"/>
            <Stat label="YTD assignment fees"     value="$487,000" accent/>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1.4fr 1fr',
          gap: 24, marginBottom: 32,
        }}>
          <div>
            <SectionHeader title="By city" sub="Where assignment fees actually came from"/>
            <div style={{ background: C.surface, border:`1px solid ${C.border}`, borderRadius: 12, overflow:'hidden' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1.4fr 1fr 1fr' : '1.4fr 1fr 1fr 1fr 1fr 1fr',
                padding: isMobile ? '12px 18px' : '14px 22px',
                background: C.panel, borderBottom:`1px solid ${C.border}`,
                fontFamily: SANS, fontSize: 12, color: C.text3, fontWeight: 600,
                letterSpacing: '0.02em', textTransform: 'uppercase',
              }}>
                <span>City</span>
                {!isMobile && <span style={{ textAlign:'right' }}>Parcels</span>}
                <span style={{ textAlign:'right' }}>Active</span>
                {!isMobile && <span style={{ textAlign:'right' }}>First-touch</span>}
                {!isMobile && <span style={{ textAlign:'right' }}>Cycle</span>}
                <span style={{ textAlign:'right' }}>YTD fees</span>
              </div>
              {cities.map((m, i) => (
                <div key={m.city} style={{
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1.4fr 1fr 1fr' : '1.4fr 1fr 1fr 1fr 1fr 1fr',
                  padding: isMobile ? '14px 18px' : '16px 22px', alignItems:'center',
                  borderBottom: i < cities.length-1 ? `1px solid ${C.borderSoft}` : 'none',
                }}>
                  <span style={{ fontFamily: SANS, fontSize: 14, color: C.ink, fontWeight: 500, letterSpacing:'-0.005em' }}>{m.city}</span>
                  {!isMobile && <span style={{ textAlign:'right', fontFamily: SANS, fontSize: 14, color: C.text2, fontVariantNumeric: 'tabular-nums' }}>{m.props.toLocaleString()}</span>}
                  <span style={{ textAlign:'right', fontFamily: SANS, fontSize: 14, color: C.ink, fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>{m.active.toLocaleString()}</span>
                  {!isMobile && <span style={{ textAlign:'right', fontFamily: SANS, fontSize: 14, color: C.text2, fontVariantNumeric: 'tabular-nums' }}>{m.mailers.toLocaleString()}</span>}
                  {!isMobile && <span style={{ textAlign:'right', fontFamily: SANS, fontSize: 14, color: C.text2 }}>{m.cycle}</span>}
                  <span style={{
                    textAlign:'right', fontFamily: SANS, fontSize: 14,
                    color: m.ytd ? C.accent : C.text3,
                    fontWeight: m.ytd ? 600 : 400,
                    fontVariantNumeric: 'tabular-nums',
                  }}>
                    {m.ytd ? `$${(m.ytd/1000).toFixed(0)}k` : '—'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionHeader title="Buy-box" sub="Aire only routes leads that match"/>
            <div style={{ background: C.surface, border:`1px solid ${C.border}`, borderRadius: 12, overflow:'hidden' }}>
              {buyBox.map((row, i) => (
                <div key={row.k} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
                  padding: '14px 18px',
                  borderBottom: i < buyBox.length - 1 ? `1px solid ${C.borderSoft}` : 'none',
                }}>
                  <span style={{ fontFamily: SANS, fontSize: 13, color: C.text2 }}>{row.k}</span>
                  <span style={{ fontFamily: SANS, fontSize: 14, color: C.ink, fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>{row.v}</span>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 12 }}>
              <Btn variant="ghost" size="sm"
                   onClick={() => toast({ tone: 'accent', title: 'Edit buy-box', sub: 'Change filters tonight; new buy-box applies to tomorrow’s Inbox.' })}>
                Edit buy-box
              </Btn>
            </div>
          </div>
        </div>

        <div style={{
          padding: 18, background: C.panel, border: `1px solid ${C.border}`,
          borderRadius: 12, display: 'flex', gap: 12, alignItems: 'flex-start',
        }}>
          <ShieldCheck size={18} color={C.good} strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }}/>
          <div style={{ fontFamily: SANS, fontSize: 13, color: C.text2, lineHeight: 1.6 }}>
            <strong style={{ color: C.ink, fontWeight: 600 }}>Data sources.</strong>{' '}
            BatchData (ownership, equity, AVM) · ATTOM (deeds, foreclosure, permits) · county scrapers (probate, divorce, code violations, felony filings) · Legacy.com obituary feed · municipal permit databases · FEMA + NOAA · Mapillary + licensed Street View tiles for vision.
          </div>
        </div>
      </div>
    </div>
  );
}

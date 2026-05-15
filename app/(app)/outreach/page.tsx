'use client';

import React from 'react';
import { FileText, Plus, MoreHorizontal, ShieldCheck, Mail, MessageSquare } from 'lucide-react';
import { C, SANS, SERIF } from '@/lib/tokens';
import { Tag, Btn, Stat, PageTitle, SectionHeader, SituationTag } from '@/components/primitives';
import { useIsMobile } from '@/lib/hooks';
import { toast } from '@/components/toast';

export default function OutreachPage() {
  const isMobile = useIsMobile();

  const campaigns = [
    { name: 'Pre-probate — Caring tone',           ch: 'Mail', audience: 'Pre-probate match · Sarasota Co.',     sent: 247,  response: 31,  deals: 4,  status: 'Running',  cycle: 'Weekly' },
    { name: 'Senior high-equity — Q2',             ch: 'Mail', audience: '70+ · free-and-clear · ≥ $200k equity',sent: 1840, response: 142, deals: 11, status: 'Running',  cycle: 'Monthly' },
    { name: 'Old-roof permit list',                ch: 'Mail', audience: 'No roof permit on file in 15+ yrs',    sent: 412,  response: 38,  deals: 3,  status: 'Running',  cycle: 'Bi-weekly' },
    { name: 'Estate sale — same-week follow-up',   ch: 'SMS',  audience: 'Replied to letter · opted in to SMS',  sent: 28,   response: 9,   deals: 2,  status: 'Running',  cycle: 'Triggered' },
    { name: 'Drive-by vision flags',               ch: 'Mail', audience: 'Vision model damage flag ≥ 0.7',        sent: 84,   response: 11,  deals: 1,  status: 'Running',  cycle: 'Weekly' },
    { name: 'Probate + code violations overlap',   ch: 'Mail', audience: 'In probate · ≥ 2 open citations',      sent: 56,   response: 8,   deals: 1,  status: 'Paused',   cycle: 'Bi-weekly' },
  ];

  const templates = [
    { name: 'Pre-probate — Caring',     situation: 'inherited-recent', preview: 'Dear [first name],\n\nI know you and your family are still navigating the loss of [name]. I work with families here in Venice in situations like yours...' },
    { name: 'Probate filed — Practical',situation: 'in-probate',       preview: 'Hello,\n\nI work with families in Sarasota County going through probate. I saw the filing for the property at [address] and wanted to introduce myself...' },
    { name: 'Senior, free-and-clear',   situation: 'older-owner',      preview: 'Dear [owner name],\n\nMy name is Forrest. I am a local buyer here in Venice and I have helped a few of your neighbors transition out of their homes...' },
    { name: 'Old-roof — Roof-aware',    situation: 'old-roof',         preview: "I noticed your roof is on record from [year]. A roof replacement runs $15,000 to $25,000 these days. We work with sellers who'd rather sell as-is..." },
  ];

  return (
    <div style={{ height: '100%', overflow:'auto' }}>
      <div style={{ padding: isMobile ? '20px 16px 40px' : '32px 36px', maxWidth: 1500, margin:'0 auto' }}>
        <PageTitle
          title="Outreach Engine"
          sub={
            <span style={{ display: 'inline-flex', alignItems: 'center', flexWrap: 'wrap', gap: 10 }}>
              <span>Mail-first, consent-gated SMS. Every send routes through Lob or A2P 10DLC.</span>
              <Tag tone="good" size="xs">
                <ShieldCheck size={11} strokeWidth={2.2}/> TCPA-safe
              </Tag>
            </span>
          }
          action={
            <div style={{ display:'flex', gap: 8, flexWrap: 'wrap' }}>
              <Btn variant="ghost" size="sm" icon={FileText}
                   onClick={() => toast({ tone: 'accent', title: 'Templates library', sub: 'Per-signal mail + SMS templates. Scroll down to see what ships with the platform.' })}>
                Templates
              </Btn>
              <Btn variant="accent" size="sm" icon={Plus}
                   onClick={() => toast({ tone: 'accent', title: 'New campaign', sub: 'Pick a signal, an audience, and a tone. We draft the rest.' })}>
                New campaign
              </Btn>
            </div>
          }
        />

        <div style={{
          display:'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(5, 1fr)',
          gap: isMobile ? 12 : 16, marginBottom: 40,
        }}>
          {[
            { l:'First-touches sent',  v:'2,667', sub:'Last 30 days' },
            { l:'Reply rate',          v:'8.7%',  sub:'+1.2% vs last month' },
            { l:'Cost per reply',      v:'$5.84', sub:'Blended across channels' },
            { l:'Cost per deal',       v:'$847',  sub:'Last 90 days' },
            { l:'Avg assignment fee',  v:'$42.6k',sub:'Last 8 closings' },
          ].map((m, i) => (
            <div key={i} style={{ background: C.surface, border:`1px solid ${C.border}`, borderRadius: 12, padding: isMobile ? 14 : 20 }}>
              <Stat label={m.l} value={m.v} sub={m.sub}/>
            </div>
          ))}
        </div>

        <SectionHeader title="Running right now" sub={`${campaigns.filter(c => c.status === 'Running').length} active · ${campaigns.filter(c => c.status === 'Paused').length} paused`}/>
        <div style={{ background: C.surface, border:`1px solid ${C.border}`, borderRadius: 12, overflow: 'auto', marginBottom: 40 }}>
          {isMobile ? (
            campaigns.map((c, i) => (
              <div
                key={i}
                onClick={() => toast({ tone: 'accent', title: c.name, sub: `${c.sent.toLocaleString()} sent · ${c.response} replies · ${c.deals} deals. Click-through opens the campaign in next sprint.` })}
                style={{
                  padding: 16,
                  borderBottom: i < campaigns.length - 1 ? `1px solid ${C.borderSoft}` : 'none',
                  cursor: 'pointer',
                }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontFamily: SANS, fontSize: 14, color: C.ink, fontWeight: 500, letterSpacing:'-0.005em' }}>{c.name}</div>
                    <div style={{ fontFamily: SANS, fontSize: 12, color: C.text2, marginTop: 3 }}>{c.audience}</div>
                  </div>
                  <Tag tone={c.status==='Running' ? 'good' : 'neutral'} size="xs">{c.status}</Tag>
                </div>
                <div style={{ display: 'flex', gap: 14, fontFamily: SANS, fontSize: 12, color: C.text2 }}>
                  <Tag size="xs">{c.ch === 'Mail' ? <><Mail size={10}/> Mail</> : <><MessageSquare size={10}/> SMS</>}</Tag>
                  <span><strong style={{ color: C.ink }}>{c.sent.toLocaleString()}</strong> sent</span>
                  <span><strong style={{ color: C.ink }}>{c.response}</strong> replies</span>
                  <span style={{ color: c.deals ? C.accent : C.text3 }}><strong>{c.deals}</strong> deals</span>
                </div>
              </div>
            ))
          ) : (
            <>
              <div style={{
                display:'grid', gridTemplateColumns: '2fr 80px 1.6fr 90px 110px 70px 110px 40px',
                padding:'14px 22px', background: C.panel, borderBottom: `1px solid ${C.border}`,
                fontFamily: SANS, fontSize: 12, color: C.text3, fontWeight: 600,
                letterSpacing: '0.02em', textTransform: 'uppercase',
              }}>
                <span>Campaign</span><span>Channel</span><span>Audience</span>
                <span style={{ textAlign:'right' }}>Sent</span>
                <span style={{ textAlign:'right' }}>Replies</span>
                <span style={{ textAlign:'right' }}>Deals</span>
                <span>Status</span><span/>
              </div>
              {campaigns.map((c, i) => (
                <div
                  key={i}
                  onClick={() => toast({ tone: 'accent', title: c.name, sub: `${c.sent.toLocaleString()} sent · ${c.response} replies · ${c.deals} deals.` })}
                  style={{
                    display:'grid', gridTemplateColumns: '2fr 80px 1.6fr 90px 110px 70px 110px 40px',
                    padding:'16px 22px', alignItems:'center',
                    borderBottom: i < campaigns.length - 1 ? `1px solid ${C.borderSoft}` : 'none',
                    cursor: 'pointer', transition: 'background 120ms',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = C.hover)}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div>
                    <div style={{ fontFamily: SANS, fontSize: 14, color: C.ink, fontWeight: 500, letterSpacing:'-0.005em' }}>{c.name}</div>
                    <div style={{ fontFamily: SANS, fontSize: 11, color: C.text3, marginTop: 3 }}>{c.cycle}</div>
                  </div>
                  <Tag size="xs">{c.ch === 'Mail' ? <><Mail size={10}/> Mail</> : <><MessageSquare size={10}/> SMS</>}</Tag>
                  <span style={{ fontFamily: SANS, fontSize: 13, color: C.text2 }}>{c.audience}</span>
                  <span style={{ textAlign:'right', fontFamily: SANS, fontSize: 14, color: C.text, fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>{c.sent.toLocaleString()}</span>
                  <span style={{ textAlign:'right', fontFamily: SANS, fontSize: 14, color: C.text, fontVariantNumeric: 'tabular-nums' }}>
                    {c.response} <span style={{ color: C.text3 }}>· {((c.response/c.sent)*100).toFixed(1)}%</span>
                  </span>
                  <span style={{ textAlign:'right', fontFamily: SANS, fontSize: 14, color: c.deals ? C.accent : C.text3, fontWeight: c.deals ? 600 : 400, fontVariantNumeric: 'tabular-nums' }}>{c.deals}</span>
                  <Tag tone={c.status==='Running' ? 'good' : 'neutral'} size="xs">{c.status}</Tag>
                  <button
                    aria-label="Campaign actions"
                    onClick={(e) => {
                      e.stopPropagation();
                      toast({ tone: 'accent', title: c.name, sub: c.status === 'Running' ? 'Pause · duplicate · archive — coming next sprint.' : 'Resume · duplicate · archive — coming next sprint.' });
                    }}
                    style={{
                      background: 'transparent', border: 'none', cursor: 'pointer',
                      padding: 4, borderRadius: 4, color: C.text3,
                      justifySelf:'end', display: 'flex', alignItems: 'center',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = C.text)}
                    onMouseLeave={e => (e.currentTarget.style.color = C.text3)}>
                    <MoreHorizontal size={16}/>
                  </button>
                </div>
              ))}
            </>
          )}
        </div>

        <SectionHeader title="Letter templates" sub="Pre-written starting points per signal. Operator edits before send."/>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
          gap: 16, marginBottom: 32,
        }}>
          {templates.map((t, i) => (
            <div key={i} style={{ background: C.surface, border:`1px solid ${C.border}`, borderRadius: 12, padding: 22 }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom: 14, gap: 12 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: SERIF, fontSize: 17, color: C.ink, fontWeight: 600, marginBottom: 8, letterSpacing:'-0.015em' }}>{t.name}</div>
                  <SituationTag situation={t.situation} size="xs"/>
                </div>
                <Btn variant="ghost" size="sm"
                     onClick={() => toast({ tone: 'accent', title: 'Template opened', sub: `${t.name} · ready to edit before send.` })}>
                  Edit
                </Btn>
              </div>
              <div style={{
                fontFamily: SERIF, fontSize: 14, color: C.text2, lineHeight: 1.7,
                whiteSpace:'pre-wrap', background: C.panel, padding: 16, borderRadius: 10,
                border:`1px solid ${C.borderSoft}`,
              }}>
                {t.preview}
              </div>
            </div>
          ))}
        </div>

        <div style={{
          padding: 18, background: C.panel, border: `1px solid ${C.border}`,
          borderRadius: 12, display: 'flex', gap: 12, alignItems: 'flex-start',
        }}>
          <ShieldCheck size={18} color={C.good} strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }}/>
          <div style={{ fontFamily: SANS, fontSize: 13, color: C.text2, lineHeight: 1.65 }}>
            <strong style={{ color: C.ink, fontWeight: 600 }}>How outreach actually runs.</strong>{' '}
            Mailers fulfilled by Lob, ~48–60¢/piece, arrival in 4–6 business days. SMS only fires after the seller opts in — every campaign is registered under A2P 10DLC with use-case copy on file. No autonomous AI calling. No AI-voice voicemail drops. Aire whispers during human dials; the seller talks to a person.
          </div>
        </div>
      </div>
    </div>
  );
}

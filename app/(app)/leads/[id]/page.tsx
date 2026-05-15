'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ChevronLeft, Mail, MessageSquare, PhoneCall, Phone,
  AlertTriangle, Eye,
} from 'lucide-react';
import { C, SANS, SERIF } from '@/lib/tokens';
import { LEADS, SITUATION, type Lead } from '@/lib/data';
import {
  Tag, SituationTag, Score, Btn, Stat, SectionHeader,
} from '@/components/primitives';
import { House } from '@/components/house';
import { toast } from '@/components/toast';
import { useIsMobile, useRelativeTime } from '@/lib/hooks';

export default function LeadDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const lead = LEADS.find(l => l.id === params.id);

  if (!lead) {
    return (
      <div style={{ padding: 48, fontFamily: SERIF, fontSize: 20, color: C.text2 }}>
        That lead doesn't exist anymore.{' '}
        <a href="/today" style={{ color: C.accent }}>Back to today's leads</a>
      </div>
    );
  }

  return (
    <LeadDetailInner
      lead={lead}
      onBack={() => router.push('/today')}
      onOpenDialer={(tone: string, contactIdx?: number) => {
        const qs = new URLSearchParams({ lead: lead.id, tone });
        if (contactIdx != null) qs.set('contact', String(contactIdx));
        router.push(`/calling?${qs.toString()}`);
      }}
    />
  );
}

function LeadDetailInner({
  lead, onBack, onOpenDialer,
}: {
  lead: Lead;
  onBack: () => void;
  onOpenDialer: (tone: string, contactIdx?: number) => void;
}) {
  const isMobile = useIsMobile();
  const [tone, setTone] = useState<'caring' | 'direct' | 'family'>('caring');
  const [lastViewedAt, setLastViewedAt] = useState<number | null>(null);
  const lastViewed = useRelativeTime(lastViewedAt);

  // Record this view (after a beat so the "last viewed" line shows the *previous* visit)
  // and add the lead to the recent-leads palette source.
  useEffect(() => {
    const key = `aire-lead-viewed-${lead.id}`;
    try {
      const prev = localStorage.getItem(key);
      setLastViewedAt(prev ? Number(prev) : null);
    } catch {}
    const writeTimer = setTimeout(() => {
      try {
        localStorage.setItem(key, String(Date.now()));
        const raw = localStorage.getItem('aire-recent-leads');
        const list: string[] = raw ? JSON.parse(raw) : [];
        const next = [lead.id, ...list.filter((x: string) => x !== lead.id)].slice(0, 8);
        localStorage.setItem('aire-recent-leads', JSON.stringify(next));
      } catch {}
    }, 1500);
    return () => clearTimeout(writeTimer);
  }, [lead.id]);

  const scripts: Record<string, Record<string, string>> = {
    'inherited-recent': {
      caring:  `Hi, is this Daniel?\n\nMy name is Forrest. I work with families here in Venice who are figuring out what to do with a parent's home. I came across the property on Oleander Way, and I know it's only been a few weeks since your mom passed.\n\nI'm not asking you to make any decisions today. I just wanted to introduce myself so that whenever you and your sister are ready to talk about the house, you have someone local who handles these situations respectfully.\n\nWould it be okay if I followed up with you in a couple weeks?`,
      direct:  `Daniel — this is Forrest with Brechin Capital. Quick reason for the call: your mother's house on Oleander Way. We buy houses in that neighborhood, cash, can close in two weeks, you don't have to clean anything out or fix anything up. No pressure today. I just wanted you to know that's an option whenever your family is ready. Worth a five-minute call later this week?`,
      family:  `Daniel, I'm so sorry about your mom. I'm a local buyer in Venice. I help families in your situation handle the property side of things when you're ready. No pressure today — I just want you and Sarah to have a name you can call when the conversation comes up.`,
    },
    'in-probate': {
      caring:  `Hi Anthony, my name is Forrest. I work with families in Sarasota County going through probate. I saw the filing for your father's estate and wanted to introduce myself in case you and Linda would rather sell the property directly than go through listing it with an agent.`,
      direct:  `Anthony — Forrest, Brechin Capital. We buy probate properties for cash, close in two weeks, you don't fix anything. The house on Pinebrook has three open code violations — those add up fast. Want me to send you some numbers?`,
      family:  `Anthony, I'm a local who helps families settle estate properties without all the headache. Would you and Linda be open to a quick call about Pinebrook?`,
    },
  };

  const script = scripts[lead.primary]?.[tone]
    || `Hi ${lead.contacts[0]?.name?.split(' ')[0] || 'there'}, I'm reaching out about ${lead.address}...`;

  return (
    <div style={{ height: '100%', overflow: 'auto' }}>
      <div style={{ padding: isMobile ? '16px 14px 8px' : '24px 36px 8px', maxWidth: 1500, margin: '0 auto' }}>
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: isMobile ? 16 : 24, gap: 12, flexWrap: 'wrap',
        }}>
          <button onClick={onBack} style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'transparent', border: 'none', color: C.text2,
            fontFamily: SANS, fontSize: 14, fontWeight: 500, cursor: 'pointer',
            padding: 0, letterSpacing: '-0.005em',
          }}>
            <ChevronLeft size={16}/> Back to today's leads
          </button>
          {lastViewedAt && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              fontFamily: SANS, fontSize: 12, color: C.text3,
            }}>
              <Eye size={12} strokeWidth={2}/>
              You last viewed this {lastViewed}
            </span>
          )}
        </div>

        {/* Header */}
        <div style={{
          background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12,
          padding: isMobile ? 20 : 28, marginBottom: 24,
        }}>
          <div style={{
            display: 'flex', gap: isMobile ? 16 : 28,
            alignItems: isMobile ? 'flex-start' : 'flex-start',
            flexDirection: isMobile ? 'column' : 'row',
          }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', flex: 1, minWidth: 0 }}>
              <Score value={lead.score} size={isMobile ? 'md' : 'lg'}/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', gap: 6, marginBottom: 12, flexWrap: 'wrap' }}>
                  {lead.situations.map(s => <SituationTag key={s} situation={s} size="xs"/>)}
                  {lead.contacted && <Tag tone="good" size="xs">First-touched</Tag>}
                </div>
                <div style={{
                  fontFamily: SERIF, fontSize: isMobile ? 24 : 32, color: C.ink, fontWeight: 600,
                  letterSpacing: '-0.025em', lineHeight: 1.15, marginBottom: 6,
                }}>
                  {lead.owner}
                </div>
                <div style={{ fontFamily: SANS, fontSize: isMobile ? 14 : 16, color: C.text }}>
                  {lead.address} · {lead.city}
                </div>
                <div style={{ fontFamily: SANS, fontSize: 14, color: C.text3, marginTop: 6 }}>
                  {lead.status}
                </div>
              </div>
            </div>
            <div style={{
              display: 'flex', gap: 8, flexWrap: 'wrap',
              width: isMobile ? '100%' : 'auto',
            }}>
              <Btn variant="ghost" icon={Mail}
                   onClick={() => toast({ tone: 'accent', title: 'Letter queued', sub: `“Recently inherited — Caring” to ${lead.owner}. Review before send.` })}>
                Send letter
              </Btn>
              <Btn variant="ghost" icon={MessageSquare}
                   onClick={() => toast({ tone: 'warn', title: 'Consent required', sub: 'A2P SMS only after the seller opts in. Mail or call first.' })}>
                Send text
              </Btn>
              <Btn variant="accent" icon={PhoneCall} onClick={() => onOpenDialer(tone)}>Call now</Btn>
            </div>
          </div>

          <div style={{
            marginTop: 24, paddingTop: 20, borderTop: `1px solid ${C.borderSoft}`,
            display: 'grid',
            gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(6, 1fr)',
            gap: isMobile ? 18 : 24,
          }}>
            <Stat label="House value" value={`$${(lead.avm / 1000).toFixed(0)}k`}/>
            <Stat label="Mortgage" value={lead.mortgage ? `$${(lead.mortgage / 1000).toFixed(0)}k` : 'None'}/>
            <Stat label="Estimated equity" value={`$${(lead.equity / 1000).toFixed(0)}k`} accent/>
            <Stat label="Bed / Bath" value={`${lead.beds} / ${lead.baths}`}/>
            <Stat label="Square feet" value={lead.sqft.toLocaleString()}/>
            <Stat label="Year built" value={lead.year}/>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 380px',
          gap: 24,
        }}>
          <div>
            {/* Why */}
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24, marginBottom: 24 }}>
              <SectionHeader title="Why this lead is worth your time"/>
              <div style={{ fontFamily: SERIF, fontSize: 17, color: C.text, lineHeight: 1.6, marginBottom: 22, fontStyle: 'italic' }}>
                {lead.whyShort}
              </div>
              {lead.reasons.map((r, i) => (
                <div key={i} style={{ marginBottom: i < lead.reasons.length - 1 ? 14 : 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
                    <span style={{ fontFamily: SANS, fontSize: 14, color: C.text }}>{r.label}</span>
                    <span style={{ fontFamily: SANS, fontSize: 13, color: C.text3, fontWeight: 500 }}>+{r.weight} points</span>
                  </div>
                  <div style={{ height: 4, background: C.panel, borderRadius: 2 }}>
                    <div style={{ width: `${r.weight * 2.5}%`, height: '100%', background: C.accent, borderRadius: 2 }}/>
                  </div>
                </div>
              ))}
            </div>

            {/* Sensitive notice */}
            {lead.sensitive && (
              <div style={{
                background: C.warnSoft, border: `1px solid #F2D9B1`, borderRadius: 12,
                padding: 18, marginBottom: 24, display: 'flex', gap: 14,
              }}>
                <AlertTriangle size={20} color={C.warn} style={{ flexShrink: 0, marginTop: 2 }}/>
                <div>
                  <div style={{ fontFamily: SANS, fontSize: 14, fontWeight: 600, color: C.warn, marginBottom: 4 }}>
                    Be thoughtful about how you reach out
                  </div>
                  <div style={{ fontFamily: SANS, fontSize: 14, color: C.text, lineHeight: 1.55 }}>
                    Contact the family, not the owner. Lead with empathy, not the case. Don't bring up the situation directly on first contact.
                  </div>
                </div>
              </div>
            )}

            {/* Timeline */}
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24, marginBottom: 24 }}>
              <SectionHeader title="What's happened" sub="Everything we've noticed about this property"/>
              <div>
                {lead.timeline.map((t, i) => (
                  <div key={i} style={{ display: 'flex', gap: 16, paddingBottom: i < lead.timeline.length - 1 ? 18 : 0 }}>
                    <div style={{ width: 90, flexShrink: 0, fontFamily: SANS, fontSize: 13, color: C.text3, fontWeight: 500, paddingTop: 2 }}>
                      {t.date}
                    </div>
                    <div style={{ width: 2, background: C.border, position: 'relative', flexShrink: 0 }}>
                      <div style={{ position: 'absolute', left: -4, top: 2, width: 10, height: 10, borderRadius: '50%', background: C.accent, border: `2px solid ${C.surface}` }}/>
                    </div>
                    <div style={{ fontFamily: SANS, fontSize: 14, color: C.text, paddingTop: 1, lineHeight: 1.5 }}>
                      {t.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Contacts */}
            {lead.contacts.length > 0 && (
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24, marginBottom: 24 }}>
                <SectionHeader
                  title="Who to talk to"
                  sub="Family members we found, ranked by how easy they are to reach"
                />
                <div>
                  {lead.contacts.map((c, i) => (
                    <div key={i} style={{
                      display: 'flex', alignItems: 'center', gap: isMobile ? 12 : 16,
                      padding: '16px 0', flexWrap: isMobile ? 'wrap' : 'nowrap',
                      borderBottom: i < lead.contacts.length - 1 ? `1px solid ${C.borderSoft}` : 'none',
                    }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: 10, background: C.panel,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontFamily: SANS, fontSize: 14, fontWeight: 500, color: C.text2,
                        flexShrink: 0,
                      }}>
                        {c.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                      </div>
                      <div style={{ flex: 1, minWidth: isMobile ? 0 : 'auto' }}>
                        <div style={{ fontFamily: SANS, fontSize: 15, color: C.ink, fontWeight: 500, letterSpacing: '-0.01em' }}>
                          {c.name}
                        </div>
                        <div style={{ fontFamily: SANS, fontSize: 13, color: C.text2, marginTop: 2 }}>
                          {c.rel} · {c.age} · {c.loc}
                        </div>
                      </div>
                      <div style={{
                        fontFamily: SANS, fontSize: 14, color: C.text, letterSpacing: '-0.005em',
                        order: isMobile ? 1 : 0, marginLeft: isMobile ? 52 : 0,
                        width: isMobile ? '100%' : 'auto',
                        display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'space-between',
                      }}>
                        <span>{c.phone}</span>
                        <Tag tone={c.q === 'Best' ? 'good' : 'neutral'} size="xs">
                          {c.q === 'Best' ? 'Best number' : 'Backup'}
                        </Tag>
                      </div>
                      <button
                        aria-label={`Call ${c.name}`}
                        onClick={() => onOpenDialer(tone, i)}
                        style={{ width: 32, height: 32, background: C.panel, border: `1px solid ${C.border}`, borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                        onMouseEnter={e => { e.currentTarget.style.background = C.accentSoft; e.currentTarget.style.borderColor = C.accentLine; }}
                        onMouseLeave={e => { e.currentTarget.style.background = C.panel; e.currentTarget.style.borderColor = C.border; }}>
                        <Phone size={14} color={C.text2}/>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* House + details */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
              gap: 16, marginBottom: 24,
            }}>
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden' }}>
                <div style={{ aspectRatio: '7/4' }}>
                  <House lead={lead}/>
                </div>
                <div style={{ padding: 14, fontFamily: SANS, fontSize: 13, color: C.text3, textAlign: 'center' }}>
                  Based on the latest drive-by photos
                </div>
              </div>
              <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12, padding: 24 }}>
                <SectionHeader title="The house"/>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  {[
                    ['Built', lead.year.toString()],
                    ['Bedrooms', lead.beds.toString()],
                    ['Bathrooms', lead.baths.toString()],
                    ['Square feet', lead.sqft.toLocaleString()],
                    ['Last sold', lead.lastSale],
                    ['Equity share', `${Math.round(lead.equity / lead.avm * 100)}% of value`],
                  ].map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                      <span style={{ fontFamily: SANS, fontSize: 13, color: C.text3 }}>{k}</span>
                      <span style={{ fontFamily: SANS, fontSize: 14, color: C.text, fontWeight: 500 }}>{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT — outreach panel */}
          <div>
            <div style={{
              background: C.surface, border: `1px solid ${C.border}`, borderRadius: 12,
              padding: 22, position: 'sticky', top: 24,
            }}>
              <SectionHeader
                title="What to say"
                sub="A starting point for your call or letter"
              />

              <div style={{ marginBottom: 16 }}>
                <div style={{ fontFamily: SANS, fontSize: 12, color: C.text3, marginBottom: 8, fontWeight: 500 }}>
                  Pick a tone
                </div>
                <div style={{ display: 'flex', gap: 4, padding: 3, background: C.panel, borderRadius: 8 }}>
                  {[
                    { id: 'caring', label: 'Caring' },
                    { id: 'direct', label: 'Direct' },
                    { id: 'family', label: 'Family-focused' },
                  ].map(t => (
                    <button key={t.id} onClick={() => setTone(t.id as any)}
                      style={{
                        flex: 1, padding: '7px 4px', borderRadius: 6, border: 'none',
                        background: tone === t.id ? C.surface : 'transparent',
                        color: tone === t.id ? C.ink : C.text2,
                        boxShadow: tone === t.id ? '0 1px 2px rgba(0,0,0,0.06)' : 'none',
                        fontFamily: SANS, fontSize: 12, fontWeight: 500, cursor: 'pointer',
                        letterSpacing: '-0.005em',
                      }}>{t.label}</button>
                  ))}
                </div>
              </div>

              <div style={{
                background: C.panel, borderRadius: 10, padding: 18,
                fontFamily: SERIF, fontSize: 15, color: C.text, lineHeight: 1.65,
                whiteSpace: 'pre-wrap', marginBottom: 16, minHeight: 280,
              }}>
                {script}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 18 }}>
                <Btn variant="accent" icon={PhoneCall} full onClick={() => onOpenDialer(tone)}>Call with this script</Btn>
                <Btn variant="ghost" icon={Mail} full
                     onClick={() => toast({ tone: 'accent', title: 'Mailer drafted', sub: `Lob fulfillment · arrives in 4–6 days. Review before send.` })}>
                  Use in a letter
                </Btn>
                <Btn variant="ghost" icon={MessageSquare} full
                     onClick={() => toast({ tone: 'warn', title: 'Texting needs consent', sub: 'Send the letter first. We open A2P SMS once the seller opts in.' })}>
                  Make a shorter text
                </Btn>
              </div>

              <div style={{
                paddingTop: 16, borderTop: `1px solid ${C.borderSoft}`,
                fontFamily: SANS, fontSize: 12, color: C.text3, lineHeight: 1.6,
              }}>
                Aire writes the starting point. You make it your own before sending. Aire never calls or texts anyone on its own — that's against the law for cold outreach.
              </div>
            </div>
          </div>
        </div>

        <div style={{ height: 48 }}/>
      </div>
    </div>
  );
}

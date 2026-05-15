'use client';

import React, { useEffect, useMemo, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Mic, Pause, PhoneOff, PhoneCall, Check, Sparkles, ShieldCheck, ChevronLeft } from 'lucide-react';
import { C, SANS, SERIF } from '@/lib/tokens';
import { Btn, Score, Stat, SituationTag, Tag } from '@/components/primitives';
import { LEADS, SITUATION, type Lead } from '@/lib/data';
import { useIsMobile } from '@/lib/hooks';
import { toast } from '@/components/toast';

type CallState = 'idle' | 'dialing' | 'live' | 'ended';
type Tone = 'caring' | 'direct' | 'family';
type Archetype = 'empathetic' | 'practical' | 'neighborly';

type ScriptLine = { t: number; who: 'you' | 'them'; text: string };
type Tip = { t: number; kind: 'note' | 'tip' | 'objection' | 'good'; text: string };

const TONE_TO_ARCHETYPE: Record<Tone, Archetype> = {
  caring: 'empathetic',
  direct: 'practical',
  family: 'neighborly',
};

/* ────────────────────────────────────────────────────────────
   Special-cased script for the marquee lead. Untouched.
   ────────────────────────────────────────────────────────── */

const L2847_SCRIPT: ScriptLine[] = [
  { t: 2,  who: 'them', text: 'Hello?' },
  { t: 4,  who: 'you',  text: "Hi, is this Daniel? My name is Forrest, I'm with Brechin Capital here in Venice." },
  { t: 9,  who: 'them', text: 'Uh, yeah, this is Daniel.' },
  { t: 12, who: 'you',  text: "I'm reaching out because I work with families navigating an estate. I came across the property on Oleander Way—" },
  { t: 18, who: 'them', text: 'Wait, who gave you my number?' },
  { t: 21, who: 'you',  text: "It's public record information. I want to be upfront — I'm not asking you to make any decisions today." },
  { t: 27, who: 'them', text: "Look, my mom just passed three weeks ago. I'm not really thinking about the house." },
  { t: 33, who: 'you',  text: "I completely understand. I'm so sorry for your loss. I just wanted to introduce myself so when the family does start thinking about it, you have someone local to call." },
  { t: 42, who: 'them', text: "Yeah, okay. That's... actually, my sister and I were going to talk about it this weekend." },
  { t: 49, who: 'you',  text: "I'd be glad to be a resource. Would it be okay if I sent you and Sarah a short letter in the mail — nothing fancy, just my information and how I work?" },
  { t: 55, who: 'them', text: 'Yeah, that would be fine.' },
];

const L2847_TIPS: Tip[] = [
  { t: 6,  kind: 'note',      text: 'Owner: Margaret Holloway · passed away March 14 · son Daniel (52) in Tampa' },
  { t: 14, kind: 'tip',       text: "Don't lead with an offer. Acknowledge the loss first." },
  { t: 20, kind: 'objection', text: "He's asking where you got his number. Be upfront — it's public record." },
  { t: 30, kind: 'good',      text: "He's softening. Stay warm and offer to be a resource, not pressure him." },
  { t: 38, kind: 'note',      text: 'He mentioned a sister, Sarah, in Asheville. Note her for the follow-up letter.' },
  { t: 50, kind: 'good',      text: "He said yes. Don't push for more. Just send the letter you offered." },
];

const L2847_RECAP =
  "Daniel was guarded at first about how you got his number — you handled it well by being upfront. He shared that he and his sister Sarah are planning to talk about the house this weekend. He agreed to receive a letter from you with your information. No commitment beyond that.";

/* ────────────────────────────────────────────────────────────
   Archetype templates (used for every lead other than L-2847).
   Substitution vars: ${first}, ${street}, ${operator}
   ────────────────────────────────────────────────────────── */

const ARCHETYPE_SCRIPTS: Record<Archetype, ScriptLine[]> = {
  empathetic: [
    { t: 2,  who: 'them', text: 'Hello?' },
    { t: 4,  who: 'you',  text: "Hi, is this ${first}? My name is ${operator}, I'm with Brechin Capital here in Venice." },
    { t: 9,  who: 'them', text: "Uh, yeah, this is ${first}." },
    { t: 12, who: 'you',  text: "I'm reaching out because I work with families navigating situations like this. I came across the property on ${street}—" },
    { t: 18, who: 'them', text: 'Wait, who gave you my number?' },
    { t: 21, who: 'you',  text: "It's public record information. I want to be upfront — I'm not asking you to make any decisions today." },
    { t: 27, who: 'them', text: "Look, this isn't really the best time for me." },
    { t: 33, who: 'you',  text: "I completely understand. I just wanted to introduce myself so when the time does come, you have someone local to call." },
    { t: 42, who: 'them', text: "Yeah, okay. That's actually... we were going to talk about it soon." },
    { t: 49, who: 'you',  text: "I'd be glad to be a resource. Would it be okay if I sent you a short letter in the mail — just my information and how I work?" },
    { t: 55, who: 'them', text: 'Yeah, that would be fine.' },
  ],
  practical: [
    { t: 2,  who: 'them', text: 'Hello?' },
    { t: 4,  who: 'you',  text: "Hi, is this ${first}? ${operator} with Brechin Capital here in Venice. Got a minute?" },
    { t: 9,  who: 'them', text: "Uh, what's this about?" },
    { t: 12, who: 'you',  text: "I work with homeowners in Sarasota County who are working through a tight spot on their property. I came across ${street}—" },
    { t: 18, who: 'them', text: "We're not selling." },
    { t: 21, who: 'you',  text: "Got it. Wanted to make sure you know your options. We buy as-is, cash, can close in two weeks. No fees, no commissions." },
    { t: 27, who: 'them', text: 'Look, I appreciate it but we are handling it.' },
    { t: 33, who: 'you',  text: "Totally fair. If anything changes, would you mind keeping my name? No expectation to use it." },
    { t: 42, who: 'them', text: 'Sure, fine.' },
    { t: 49, who: 'you',  text: "I'll drop a one-pager in the mail so you have it. Mailing address is the property itself?" },
    { t: 55, who: 'them', text: 'Yeah.' },
  ],
  neighborly: [
    { t: 2,  who: 'them', text: 'Hello?' },
    { t: 4,  who: 'you',  text: "Hi, is this ${first}? ${operator} — I'm a local buyer here in Venice." },
    { t: 9,  who: 'them', text: "Yes, this is ${first}. What can I do for you?" },
    { t: 12, who: 'you',  text: "I work with homeowners in the area who are thinking about what's next — downsizing, moving closer to family, that kind of thing. Wondered if you'd thought about it." },
    { t: 18, who: 'them', text: 'Not really, no.' },
    { t: 21, who: 'you',  text: "That's fine. No agenda today. I help neighbors in your situation when the time does come — figured I'd introduce myself." },
    { t: 27, who: 'them', text: 'Where did you get our number?' },
    { t: 33, who: 'you',  text: "Public records. I'm not selling anything, not asking for a meeting. Just want you to have a name to call when it does come up." },
    { t: 42, who: 'them', text: "Well, that's kind of you. I'll keep you in mind." },
    { t: 49, who: 'you',  text: "Mind if I drop a card in the mail? Just so my name is on something." },
    { t: 55, who: 'them', text: 'Sure.' },
  ],
};

function archetypeTips(arc: Archetype, lead: Lead, contactFirst: string): Tip[] {
  const primaryLabel = SITUATION[lead.primary]?.label || 'Signal';
  const c0 = lead.contacts[0];
  if (arc === 'empathetic') {
    return [
      { t: 6,  kind: 'note',      text: `Lead: ${lead.owner} · ${primaryLabel}${c0 ? ` · primary contact ${c0.name} (${c0.age}, ${c0.loc})` : ''}` },
      { t: 14, kind: 'tip',       text: "Don't lead with an offer. Acknowledge the situation first." },
      { t: 20, kind: 'objection', text: "They're asking about the number. Be upfront — public records." },
      { t: 30, kind: 'good',      text: "They're softening. Offer to be a resource, not a pressure point." },
      { t: 38, kind: 'note',      text: 'Note any co-decision-makers they mention (sibling, spouse) for the letter.' },
      { t: 50, kind: 'good',      text: 'They said yes to the letter. Send what you offered — no more.' },
    ];
  }
  if (arc === 'practical') {
    return [
      { t: 6,  kind: 'note',      text: `Lead: ${lead.owner} · ${primaryLabel}${c0 ? ` · contact ${contactFirst}` : ''}` },
      { t: 14, kind: 'tip',       text: "Lead with the option, not the situation. People in a pinch don't want a lecture." },
      { t: 20, kind: 'objection', text: "They said 'not selling.' Don't push — pivot to information." },
      { t: 30, kind: 'good',      text: "They're engaged enough to listen. Stay tactical, no oversell." },
      { t: 50, kind: 'good',      text: 'A mailer is enough today. Send the one-pager.' },
    ];
  }
  return [
    { t: 6,  kind: 'note',      text: `Lead: ${lead.owner} · long tenure · ${primaryLabel}` },
    { t: 14, kind: 'tip',       text: "Easygoing tone. You're a neighbor, not a vendor." },
    { t: 20, kind: 'objection', text: "They're not in a hurry — don't rush them." },
    { t: 30, kind: 'good',      text: 'They appreciate being introduced. Keep it light.' },
    { t: 50, kind: 'good',      text: 'A tasteful note in the mail. Letterhead matters here.' },
  ];
}

function archetypeRecap(arc: Archetype, lead: Lead, contactFirst: string): string {
  const primaryLabel = (SITUATION[lead.primary]?.label || 'this signal').toLowerCase();
  if (arc === 'empathetic') {
    return `${contactFirst} was guarded about how you got the number — you handled it well by being upfront. They acknowledged the situation around ${lead.address} and agreed to receive a letter with your information. No commitment beyond that.`;
  }
  if (arc === 'practical') {
    return `${contactFirst} pushed back early — "not selling" — but engaged once you pivoted to options. They agreed to a one-pager in the mail. Property: ${lead.address}. Next move is whether anything changes on their end.`;
  }
  return `${contactFirst} was easygoing and curious why you called. You introduced yourself without pressure and offered a card. They said yes to mail. Worth a respectful follow-up note when ${primaryLabel} matures.`;
}

function streetOnly(addr: string): string {
  // "2847 Oleander Way" → "Oleander Way"
  const parts = addr.split(' ');
  if (parts.length <= 1) return addr;
  // drop the leading number
  return parts.slice(1).join(' ');
}

function firstNameOf(full: string): string {
  return (full || '').split(' ')[0] || 'there';
}

function substitute(text: string, vars: Record<string, string>): string {
  return text.replace(/\$\{(\w+)\}/g, (_, k) => vars[k] ?? '');
}

/* ────────────────────────────────────────────────────────────
   Page
   ────────────────────────────────────────────────────────── */

export default function DialerPage() {
  return (
    <Suspense fallback={<DialerSkeleton/>}>
      <DialerInner/>
    </Suspense>
  );
}

function DialerSkeleton() {
  return (
    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.text3, fontFamily: SANS }}>
      Loading dialer…
    </div>
  );
}

function DialerInner() {
  const isMobile = useIsMobile();
  const router = useRouter();
  const params = useSearchParams();
  const leadId = params.get('lead') || 'L-2847';
  const toneParam = (params.get('tone') as Tone | null) || 'caring';
  const contactIdx = Math.max(0, Number(params.get('contact') ?? 0));

  const lead = useMemo(() => LEADS.find(l => l.id === leadId) || LEADS[0], [leadId]);
  const archetype: Archetype = TONE_TO_ARCHETYPE[toneParam] ?? 'empathetic';

  const [state, setState] = useState<CallState>('idle');
  const [seconds, setSeconds] = useState(0);
  const [operatorFirst, setOperatorFirst] = useState('Forrest');

  useEffect(() => {
    const m = document.cookie.match(/(?:^|;\s*)aire-session=([^;]+)/);
    if (m) {
      const email = decodeURIComponent(m[1]);
      const local = (email.split('@')[0] || '').split(/[._-]+/).filter(Boolean);
      if (local.length) setOperatorFirst(local[0][0].toUpperCase() + local[0].slice(1).toLowerCase());
    }
  }, []);

  // Reset transcript when lead/tone changes
  useEffect(() => { setState('idle'); setSeconds(0); }, [lead.id, archetype]);

  const contact = lead.contacts[contactIdx] || lead.contacts[0];
  const contactName = contact?.name || lead.owner;
  const contactFirst = firstNameOf(contactName);
  const contactRel = contact?.rel || 'Owner';
  const street = streetOnly(lead.address);
  const cityShort = lead.city.split(',')[0] || 'Venice';

  // The L-2847 hand-tuned script is empathetic-flavored. Only use it when the operator
  // actually picked the caring tone; otherwise fall back to the generic archetype.
  const isMarquee = lead.id === 'L-2847' && archetype === 'empathetic';
  const baseScript = isMarquee ? L2847_SCRIPT : ARCHETYPE_SCRIPTS[archetype];
  const callScript: ScriptLine[] = useMemo(() => baseScript.map(line => ({
    ...line,
    text: substitute(line.text, { first: contactFirst, street, operator: operatorFirst }),
  })), [baseScript, contactFirst, street, operatorFirst]);
  const tips: Tip[] = useMemo(
    () => (isMarquee ? L2847_TIPS : archetypeTips(archetype, lead, contactFirst)),
    [isMarquee, archetype, lead, contactFirst]
  );
  const recap = useMemo(
    () => (isMarquee ? L2847_RECAP : archetypeRecap(archetype, lead, contactFirst)),
    [isMarquee, archetype, lead, contactFirst]
  );

  const transcript = callScript.filter(s => s.t <= seconds);
  const liveTips = tips.filter(s => s.t <= seconds);

  useEffect(() => {
    if (state !== 'live') return;
    const id = setInterval(() => setSeconds(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [state]);

  const startCall = () => { setSeconds(0); setState('dialing'); setTimeout(() => setState('live'), 1500); };
  const endCall = () => setState('ended');
  const restart = () => { setSeconds(0); setState('idle'); };

  const mmss = `${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;

  return (
    <div style={{ height: '100%', display:'flex', flexDirection: isMobile ? 'column' : 'row' }}>
      {/* Left — call */}
      <div style={{
        flex: 1, display:'flex', flexDirection:'column',
        background: C.surface,
        borderRight: isMobile ? 'none' : `1px solid ${C.borderSoft}`,
        minHeight: 0,
      }}>
        <div style={{ padding: isMobile ? '18px 18px' : '24px 32px', borderBottom:`1px solid ${C.borderSoft}` }}>
          {/* Back-to-lead */}
          <button
            onClick={() => router.push(`/leads/${lead.id}`)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4,
              background: 'transparent', border: 'none', color: C.text3,
              fontFamily: SANS, fontSize: 12, fontWeight: 500, cursor: 'pointer',
              padding: 0, marginBottom: 10, letterSpacing: '-0.005em',
            }}>
            <ChevronLeft size={13}/> Back to {lead.owner}
          </button>

          <div style={{
            display:'flex', alignItems: isMobile ? 'flex-start' : 'center',
            justifyContent:'space-between', gap: 16,
            flexDirection: isMobile ? 'column' : 'row',
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                fontFamily: SANS, fontSize: 12, color: state === 'live' ? C.accent : C.text3,
                fontWeight: state === 'live' ? 600 : 500, marginBottom: 6,
              }}>
                {state === 'live' && (
                  <span style={{
                    width: 7, height: 7, borderRadius: '50%', background: C.accent,
                    boxShadow: `0 0 0 3px ${C.accent}1F`,
                    animation: 'pulse 1.4s ease-in-out infinite',
                  }}/>
                )}
                {state === 'idle'    && 'Ready to dial'}
                {state === 'dialing' && 'Dialing…'}
                {state === 'live'    && `Live · ${mmss}`}
                {state === 'ended'   && `Call ended · ${mmss}`}
              </div>
              <div style={{ fontFamily: SERIF, fontSize: isMobile ? 20 : 24, color: C.ink, fontWeight: 600, letterSpacing:'-0.02em' }}>
                Calling {contactName}
              </div>
              <div style={{ fontFamily: SANS, fontSize: 14, color: C.text2, marginTop: 4 }}>
                {contactRel === 'Owner' ? `Owner` : `${contactRel} of ${lead.owner.replace(/^Estate of /, '')}`} · About the house on {street}
              </div>
              <div style={{ marginTop: 8, display: 'inline-flex', gap: 6 }}>
                <Tag tone="accent" size="xs">{toneParam === 'caring' ? 'Caring' : toneParam === 'direct' ? 'Direct' : 'Family-focused'} script</Tag>
                <Tag size="xs">{SITUATION[lead.primary]?.label || 'Signal'}</Tag>
              </div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap: 10 }}>
              {state === 'idle' && <Btn variant="accent" icon={PhoneCall} onClick={startCall}>Start call</Btn>}
              {state === 'live' && (
                <>
                  <button
                    aria-label="Mute"
                    onClick={() => toast({ tone: 'accent', title: 'Muted', sub: 'Your mic is off. Tap again to unmute.' })}
                    style={{ width: 44, height: 44, background: C.panel, border:`1px solid ${C.border}`, borderRadius: 10, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Mic size={18} color={C.text2}/>
                  </button>
                  <button
                    aria-label="Hold"
                    onClick={() => toast({ tone: 'accent', title: 'Call on hold', sub: 'Aire is playing your hold message.' })}
                    style={{ width: 44, height: 44, background: C.panel, border:`1px solid ${C.border}`, borderRadius: 10, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <Pause size={18} color={C.text2}/>
                  </button>
                  <button onClick={endCall} aria-label="End call" style={{ width: 44, height: 44, background: C.alert, border:'none', borderRadius: 10, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>
                    <PhoneOff size={18} color="#FFF"/>
                  </button>
                </>
              )}
              {state === 'ended' && <Btn variant="ghost" onClick={restart}>New call</Btn>}
            </div>
          </div>

          {state === 'live' && (
            <div style={{ marginTop: 18, height: 32, display:'flex', alignItems:'center', gap: 2 }}>
              {Array.from({length: 100}).map((_, i) => {
                const h = 4 + Math.abs(Math.sin((seconds + i) * 0.5) * 22) + (Math.random()-0.5)*3;
                return <div key={i} style={{ width: 2, height: h, background: i > (seconds % 100) ? C.border : C.accent, borderRadius: 1 }}/>;
              })}
            </div>
          )}
        </div>

        <div style={{ flex: 1, overflowY:'auto', padding: isMobile ? '20px 20px' : '28px 32px' }}>
          {state === 'idle' && (
            <div style={{ maxWidth: 540, fontFamily: SERIF, fontSize: 16, color: C.text2, lineHeight: 1.7, fontStyle:'italic' }}>
              Press <strong style={{ color: C.text, fontStyle:'normal' }}>Start call</strong> to dial {contactFirst}. The transcript will appear here and Aire will whisper coaching on the right side as the conversation unfolds — what to say, how to handle pushback, when to pull back. You do the talking. Aire just helps.
            </div>
          )}

          {transcript.map((line, i) => (
            <div key={i} style={{
              marginBottom: 22,
              animation: 'fadeUp 280ms ease-out both',
            }}>
              <div style={{
                fontFamily: SANS, fontSize: 12, color: line.who === 'you' ? C.accent : C.text3,
                fontWeight: 500, marginBottom: 5, letterSpacing:'-0.005em',
              }}>
                {line.who === 'you' ? operatorFirst : contactFirst} · {String(Math.floor(line.t/60)).padStart(2,'0')}:{String(line.t%60).padStart(2,'0')}
              </div>
              <div style={{
                fontFamily: SERIF, fontSize: isMobile ? 15 : 17, color: line.who === 'you' ? C.ink : C.text,
                lineHeight: 1.55, fontStyle: line.who === 'them' ? 'italic' : 'normal',
              }}>
                {line.text}
              </div>
            </div>
          ))}

          {state === 'ended' && (
            <div style={{
              marginTop: 32, padding: 24, background: C.goodSoft,
              border:`1px solid #D1F0DE`, borderRadius: 12,
            }}>
              <div style={{ display:'flex', alignItems:'center', gap: 8, marginBottom: 12 }}>
                <Check size={18} color={C.good} strokeWidth={2.2}/>
                <span style={{ fontFamily: SANS, fontSize: 14, color: C.good, fontWeight: 600 }}>
                  Call went well
                </span>
              </div>
              <div style={{ fontFamily: SERIF, fontSize: 16, color: C.text, lineHeight: 1.6, marginBottom: 16 }}>
                {recap}
              </div>
              <div style={{ fontFamily: SANS, fontSize: 14, color: C.text, marginBottom: 18 }}>
                <strong>What to do next:</strong>
                <ul style={{ marginTop: 8, paddingLeft: 22, lineHeight: 1.8 }}>
                  <li>Send the &ldquo;{SITUATION[lead.primary]?.label || 'Pre-probate match'} — {toneParam === 'caring' ? 'Caring' : toneParam === 'direct' ? 'Practical' : 'Neighborly'}&rdquo; letter to {contactFirst}</li>
                  <li>Set a reminder to follow up in two weeks</li>
                  <li>Move {lead.owner} to &ldquo;Contacted&rdquo; in your pipeline</li>
                </ul>
              </div>
              <div style={{ display:'flex', gap: 10, flexWrap: 'wrap' }}>
                <Btn variant="accent" size="sm" onClick={() => {
                  toast({ tone: 'good', title: 'Three actions queued', sub: `Letter drafted · reminder set · ${lead.owner} moved to Contacted.` });
                  setTimeout(() => router.push('/pipeline'), 800);
                }}>Do all three</Btn>
                <Btn variant="ghost" size="sm" onClick={() =>
                  toast({ tone: 'accent', title: 'Recap opened', sub: 'Edit what Aire heard before it logs to the lead.' })
                }>Edit recap</Btn>
              </div>
            </div>
          )}
        </div>

        <div style={{
          padding: isMobile ? '12px 18px' : '14px 32px',
          borderTop:`1px solid ${C.borderSoft}`, background: C.panel,
          display:'flex', justifyContent:'space-between', alignItems: 'center',
          flexWrap: 'wrap', gap: 10,
        }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            fontFamily: SANS, fontSize: 12, color: C.text3,
          }}>
            <ShieldCheck size={12} color={C.good} strokeWidth={2.2}/>
            Human-dialed · AI whispers, never speaks for you
          </span>
          <span style={{ fontFamily: SANS, fontSize: 12, color: C.text3 }}>
            Local time in {contact?.loc?.split(',')[0] || cityShort}: 2:47 PM
          </span>
        </div>
      </div>

      {/* Right — coaching */}
      <div style={{
        width: isMobile ? '100%' : 380,
        background: C.surface,
        display:'flex', flexDirection:'column',
        borderTop: isMobile ? `1px solid ${C.borderSoft}` : 'none',
        maxHeight: isMobile ? '60vh' : 'none',
        overflow: isMobile ? 'auto' : 'visible',
      }}>
        <div style={{ padding:'24px 24px 16px', borderBottom:`1px solid ${C.borderSoft}` }}>
          <div style={{ display:'flex', alignItems:'flex-start', gap: 14, marginBottom: 18 }}>
            <Score value={lead.score} size="md"/>
            <div style={{ minWidth: 0 }}>
              <div style={{ display:'flex', gap: 4, marginBottom: 6, flexWrap:'wrap' }}>
                <SituationTag situation={lead.primary} size="xs"/>
              </div>
              <div style={{ fontFamily: SERIF, fontSize: 16, color: C.ink, fontWeight: 600, letterSpacing:'-0.01em', marginBottom: 2 }}>
                {lead.owner}
              </div>
              <div style={{ fontFamily: SANS, fontSize: 13, color: C.text2 }}>
                {lead.address} · {cityShort}
              </div>
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 14 }}>
            <Stat label="House value" value={`$${(lead.avm / 1000).toFixed(0)}k`}/>
            <Stat label="Equity" value={`$${(lead.equity / 1000).toFixed(0)}k`} accent/>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px' }}>
          <div style={{ fontFamily: SANS, fontSize: 12, color: C.text3, fontWeight: 500, marginBottom: 14, display:'flex', alignItems:'center', gap: 8 }}>
            <Sparkles size={13} color={C.accent}/>
            Live coaching
          </div>

          {liveTips.length === 0 && (
            <div style={{ fontFamily: SERIF, fontSize: 14, color: C.text3, fontStyle:'italic', lineHeight: 1.65 }}>
              Tips will appear here as the call goes on. Things like what to say next, how to handle pushback, and what to watch for.
            </div>
          )}

          {liveTips.map((tip, i) => {
            const tones: Record<string, { c: string; bg: string; bd: string; label: string }> = {
              note:      { c: C.text2,  bg: C.panel,     bd: C.border,    label: 'About the lead' },
              tip:       { c: C.accent, bg: C.accentSoft,bd: C.accentLine,label: 'Try this' },
              objection: { c: C.warn,   bg: C.warnSoft,  bd: '#F2D9B1',   label: 'Watch out' },
              good:      { c: C.good,   bg: C.goodSoft,  bd: '#D1F0DE',   label: 'Good sign' },
            };
            const t = tones[tip.kind];
            return (
              <div key={i} style={{
                background: t.bg, border:`1px solid ${t.bd}`, borderRadius: 10,
                padding: '12px 14px', marginBottom: 10,
                animation: 'fadeUp 240ms ease-out both',
              }}>
                <div style={{ fontFamily: SANS, fontSize: 11, color: t.c, fontWeight: 600, marginBottom: 6, letterSpacing:'-0.005em' }}>
                  {t.label}
                </div>
                <div style={{ fontFamily: SANS, fontSize: 14, color: C.text, lineHeight: 1.5 }}>
                  {tip.text}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

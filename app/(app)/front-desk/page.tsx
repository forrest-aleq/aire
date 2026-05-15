'use client';

import React, { useEffect, useState } from 'react';
import { Settings, Eye, Sparkles, ShieldCheck } from 'lucide-react';
import { C, SANS, SERIF } from '@/lib/tokens';
import { Btn, Stat, PageTitle, SectionHeader, Tag } from '@/components/primitives';
import { useIsMobile } from '@/lib/hooks';
import { toast } from '@/components/toast';

function fmtDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function FrontDeskPage() {
  const isMobile = useIsMobile();
  const [liveSeconds, setLiveSeconds] = useState(107); // start at 01:47

  useEffect(() => {
    const id = setInterval(() => setLiveSeconds(s => s + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const live = [
    { from: '(941) 555-0289', name: 'Margaret K. Holloway', re: 'About 2847 Oleander', signal: 'Pre-probate match' },
  ];
  const recent = [
    { from: '(813) 555-0142', name: 'Daniel R. Holloway',        re: '2847 Oleander', dur: '4 min',  outcome: 'Walkthrough booked',   when: 'Today, 2:47 PM',     good: true },
    { from: '(704) 555-0193', name: 'Anthony Vega',              re: '1142 Pinebrook',dur: '2 min',  outcome: 'Callback requested',   when: 'Today, 1:18 PM',     good: true },
    { from: '(941) 555-0728', name: 'Karen Madsen',              re: '1408 Magnolia', dur: '1 min',  outcome: 'Not interested',       when: 'Today, 11:32 AM',    good: false },
    { from: '(716) 555-0392', name: 'Carolyn Murphy-Esposito',   re: '4256 Tarpon',   dur: '6 min',  outcome: 'Walkthrough booked',   when: 'Yesterday, 4:14 PM', good: true },
    { from: '(404) 555-0721', name: 'Jennifer Reeves-Park',      re: '5612 Sandcastle',dur: '4 min', outcome: 'Family discussing',    when: 'Yesterday, 11:02 AM',good: null },
    { from: '(828) 555-0317', name: 'Sarah Holloway-Chen',       re: '2847 Oleander', dur: '9 min',  outcome: 'Walkthrough booked',   when: 'Tuesday',            good: true },
  ];
  const appts = [
    { when: 'Today, 4:00 PM',     who: 'Daniel Holloway',         where: '2847 Oleander Way',  type: 'In person' },
    { when: 'Tomorrow, 10:30 AM', who: 'Anthony Vega',            where: '1142 Pinebrook Rd',  type: 'In person' },
    { when: 'Friday, 2:00 PM',    who: 'Carolyn Murphy-Esposito', where: '4256 Tarpon Dr',     type: 'In person' },
    { when: 'Monday, 9:00 AM',    who: 'Sarah Holloway-Chen',     where: 'Phone call',         type: 'Phone' },
  ];

  return (
    <div style={{ height: '100%', overflow:'auto' }}>
      <div style={{ padding: isMobile ? '20px 16px 40px' : '32px 36px', maxWidth: 1500, margin:'0 auto' }}>
        <PageTitle
          title="Front Desk"
          sub={
            <span style={{ display: 'inline-flex', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
              <span>Inbound only. Sellers call your tracked number; Aire qualifies, books, and hands off.</span>
              <Tag tone="good" size="xs">
                <ShieldCheck size={11} strokeWidth={2.2}/> TCPA-safe
              </Tag>
            </span>
          }
          action={
            <Btn variant="ghost" size="sm" icon={Settings}
                 onClick={() => toast({ tone: 'accent', title: 'Phone settings', sub: 'Tracked number, business hours, hand-off rules — coming next sprint.' })}>
              Phone settings
            </Btn>
          }
        />

        <div style={{
          display:'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(5, 1fr)',
          gap: isMobile ? 12 : 16, marginBottom: 32,
        }}>
          {[
            { l:'Calls answered',     v:'247',   sub:'Last 30 days · every one' },
            { l:'Average length',     v:'2:43',  sub:'18 sec shorter than last month' },
            { l:'Qualified',          v:'89',    sub:'36% of callers' },
            { l:'Walkthroughs booked',v:'34',    sub:'14% of all callers' },
            { l:'After hours',        v:'41%',   sub:"Calls you would have missed" },
          ].map((m, i) => (
            <div key={i} style={{ background: C.surface, border:`1px solid ${C.border}`, borderRadius: 12, padding: isMobile ? 14 : 20 }}>
              <Stat label={m.l} value={m.v} sub={m.sub}/>
            </div>
          ))}
        </div>

        <div style={{
          display:'grid',
          gridTemplateColumns: isMobile ? '1fr' : '2fr 1fr',
          gap: 24,
        }}>
          <div>
            {live.length > 0 && (
              <>
                <SectionHeader title="Happening now"/>
                <div style={{
                  background: C.surface, border: `1px solid ${C.accent}`,
                  borderRadius: 12, padding: 20, marginBottom: 28,
                }}>
                  {live.map((c, i) => (
                    <div key={i} style={{
                      display:'flex', alignItems:'center', gap: 16, flexWrap: isMobile ? 'wrap' : 'nowrap',
                    }}>
                      <div style={{ position:'relative', flexShrink: 0 }}>
                        <div style={{ width: 10, height: 10, borderRadius:'50%', background: C.accent, animation:'pulse 1.6s ease-in-out infinite' }}/>
                        <div style={{ position:'absolute', top: -4, left: -4, width: 18, height: 18, borderRadius:'50%', border:`2px solid ${C.accent}`, opacity: 0.4 }}/>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: SERIF, fontSize: isMobile ? 15 : 16, color: C.ink, fontWeight: 600, letterSpacing:'-0.01em' }}>
                          {c.name} is on the line
                        </div>
                        <div style={{ fontFamily: SANS, fontSize: 14, color: C.text2, marginTop: 3 }}>
                          {c.from} · {c.re}
                        </div>
                        <div style={{ fontFamily: SANS, fontSize: 12, color: C.accent, marginTop: 4, fontWeight: 500 }}>
                          Signal: {c.signal}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 14, flexShrink: 0, marginLeft: isMobile ? 'auto' : 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 3, height: 28 }}>
                          {Array.from({ length: 14 }).map((_, j) => {
                            const h = 5 + Math.abs(Math.sin((liveSeconds + j * 0.7) * 0.9) * 18) + 2;
                            return (
                              <div key={j} style={{
                                width: 2.5, height: h, background: C.accent, borderRadius: 1,
                                opacity: 0.45 + (j % 3) * 0.18,
                              }}/>
                            );
                          })}
                        </div>
                        <div style={{
                          fontFamily: SANS, fontSize: 18, color: C.accent, fontWeight: 600,
                          letterSpacing:'-0.015em', minWidth: 56, textAlign: 'right',
                        }}>
                          {fmtDuration(liveSeconds)}
                        </div>
                        <Btn variant="ghost" size="sm" icon={Eye}
                             onClick={() => toast({ tone: 'accent', title: 'Listening in', sub: 'Joining the call muted. The seller won’t hear you.' })}>
                          Listen
                        </Btn>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            <SectionHeader title="Recent callbacks" sub={`${recent.length} people reached you · last 48 hours`}/>
            <div style={{ background: C.surface, border:`1px solid ${C.border}`, borderRadius: 12, overflow:'hidden' }}>
              {recent.map((r, i) => (
                <div
                  key={i}
                  onClick={() => toast({
                    tone: 'accent',
                    title: `${r.name} · ${r.dur}`,
                    sub: `${r.outcome}. Full transcript and recap opening — wire to lead next.`,
                  })}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : '1.4fr 1.4fr 60px 1.4fr 1fr',
                    padding: isMobile ? '14px 18px' : '16px 22px', alignItems:'center', gap: 12,
                    borderBottom: i < recent.length - 1 ? `1px solid ${C.borderSoft}` : 'none',
                    cursor: 'pointer', transition: 'background 120ms',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = C.hover)}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div>
                    <div style={{ fontFamily: SANS, fontSize: 14, color: C.ink, fontWeight: 500, letterSpacing:'-0.005em' }}>{r.name}</div>
                    <div style={{ fontFamily: SANS, fontSize: 13, color: C.text3, marginTop: 2 }}>{r.from}</div>
                  </div>
                  <div style={{ fontFamily: SANS, fontSize: 13, color: C.text2 }}>{r.re}</div>
                  {!isMobile && <span style={{ fontFamily: SANS, fontSize: 13, color: C.text2 }}>{r.dur}</span>}
                  <div style={{ fontFamily: SANS, fontSize: 14, color: C.text, display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <span style={{
                      width: 6, height: 6, borderRadius: '50%',
                      background: r.good === true ? C.good : r.good === false ? C.alert : C.text3,
                    }}/>
                    {r.outcome}
                  </div>
                  <span style={{
                    fontFamily: SANS, fontSize: 13, color: C.text3,
                    textAlign: isMobile ? 'left' : 'right',
                  }}>{isMobile ? `${r.dur} · ${r.when}` : r.when}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <SectionHeader title="Coming up" sub={`${appts.length} walkthroughs booked`}/>
            <div style={{ background: C.surface, border:`1px solid ${C.border}`, borderRadius: 12, overflow:'hidden' }}>
              {appts.map((a, i) => (
                <div
                  key={i}
                  onClick={() => toast({
                    tone: 'accent',
                    title: `${a.when} · ${a.who}`,
                    sub: `${a.where} · ${a.type}. Opens the calendar event with prep notes attached.`,
                  })}
                  style={{
                    padding: '18px 20px',
                    borderBottom: i < appts.length - 1 ? `1px solid ${C.borderSoft}` : 'none',
                    cursor: 'pointer', transition: 'background 120ms',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = C.hover)}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <div style={{ fontFamily: SANS, fontSize: 12, color: C.accent, fontWeight: 600, marginBottom: 6 }}>
                    {a.when}
                  </div>
                  <div style={{ fontFamily: SERIF, fontSize: 16, color: C.ink, fontWeight: 600, letterSpacing:'-0.01em', marginBottom: 3 }}>
                    {a.who}
                  </div>
                  <div style={{ fontFamily: SANS, fontSize: 13, color: C.text2 }}>
                    {a.where} · {a.type}
                  </div>
                </div>
              ))}
            </div>

            <div style={{
              marginTop: 16, padding: 18, background: C.panel, border:`1px solid ${C.border}`,
              borderRadius: 12,
            }}>
              <div style={{ display:'flex', gap: 10 }}>
                <Sparkles size={16} color={C.accent} style={{ flexShrink: 0, marginTop: 2 }}/>
                <div style={{ fontFamily: SANS, fontSize: 13, color: C.text2, lineHeight: 1.6 }}>
                  Aire answers your tracked number, qualifies the seller, takes down the property condition, and books on your calendar. Inbound only — we never AI-dial cold numbers.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

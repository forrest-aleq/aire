'use client';

import Link from 'next/link';
import {
  BookOpen, Heart, Lock, Home, Eye, Hammer,
  Gavel, AlertTriangle, FileText, Flame,
  Users, ShieldCheck, Clock, DollarSign,
  ArrowRight, Check, PhoneIncoming, Send, Activity, Sparkles, Menu, X,
} from 'lucide-react';
import { useState } from 'react';
import { C, SERIF, SANS } from '@/lib/tokens';
import { Wordmark } from '@/components/wordmark';
import { useIsMobile } from '@/lib/hooks';

/* ---------- nav ---------- */

function NavBar() {
  const isMobile = useIsMobile(820);
  const [open, setOpen] = useState(false);
  return (
    <nav style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(255,255,255,0.85)',
      backdropFilter: 'saturate(180%) blur(10px)',
      borderBottom: `1px solid ${C.borderSoft}`,
    }}>
      <div style={{
        maxWidth: 1240, margin: '0 auto', padding: isMobile ? '14px 18px' : '16px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
          <Wordmark size={isMobile ? 'sm' : 'md'}/>
        </Link>

        {!isMobile && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 26 }}>
            <Link href="#how" style={navLink}>How it works</Link>
            <Link href="#signals" style={navLink}>Signals</Link>
            <Link href="#territory" style={navLink}>Territory</Link>
            <Link href="#pricing" style={navLink}>Pricing</Link>
            <div style={{ width: 1, height: 18, background: C.border }}/>
            <Link href="/login" style={navLink}>Sign in</Link>
            <Link href="/signup" style={{
              fontFamily: SANS, fontSize: 14, fontWeight: 500,
              background: C.ink, color: '#FFF', padding: '8px 14px', borderRadius: 8,
              letterSpacing: '-0.005em',
            }}>
              Request access
            </Link>
          </div>
        )}

        {isMobile && (
          <button
            aria-label="Menu"
            onClick={() => setOpen(v => !v)}
            style={{
              width: 36, height: 36, background: 'transparent',
              border: `1px solid ${C.border}`, borderRadius: 8, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
            {open ? <X size={17} color={C.text2}/> : <Menu size={17} color={C.text2}/>}
          </button>
        )}
      </div>

      {isMobile && open && (
        <div style={{
          borderTop: `1px solid ${C.borderSoft}`,
          padding: 16, display: 'flex', flexDirection: 'column', gap: 4,
          background: C.surface,
        }}>
          {[
            { href: '#how',      label: 'How it works' },
            { href: '#signals',  label: 'Signals' },
            { href: '#territory',label: 'Territory' },
            { href: '#pricing',  label: 'Pricing' },
            { href: '/login',    label: 'Sign in' },
          ].map(it => (
            <Link key={it.href} href={it.href} onClick={() => setOpen(false)} style={{
              padding: '12px 14px', borderRadius: 8,
              fontFamily: SANS, fontSize: 15, color: C.text, fontWeight: 500,
              letterSpacing: '-0.005em',
            }}>
              {it.label}
            </Link>
          ))}
          <Link href="/signup" onClick={() => setOpen(false)} style={{
            padding: '12px 14px', borderRadius: 8,
            fontFamily: SANS, fontSize: 15, fontWeight: 500,
            background: C.ink, color: '#FFF', letterSpacing: '-0.005em',
            textAlign: 'center', marginTop: 6,
          }}>
            Request access
          </Link>
        </div>
      )}
    </nav>
  );
}

const navLink: React.CSSProperties = {
  fontFamily: SANS, fontSize: 14, color: C.text2, fontWeight: 500,
};

/* ---------- hero ---------- */

function Hero() {
  const isMobile = useIsMobile();
  return (
    <section style={{
      maxWidth: 1240, margin: '0 auto',
      padding: isMobile ? '48px 18px 36px' : '96px 32px 72px',
      position: 'relative',
    }}>
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        background: C.accentSoft, border: `1px solid ${C.accentLine}`, borderRadius: 999,
        padding: '6px 12px', marginBottom: isMobile ? 24 : 32,
        fontFamily: SANS, fontSize: 12, color: C.accent, fontWeight: 500,
        letterSpacing: '-0.005em',
      }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: C.accent }}/>
        Sarasota · Hillsborough · Pinellas · Lee · Manatee
      </div>

      <h1 style={{
        fontFamily: SERIF,
        fontSize: isMobile ? 44 : 78,
        lineHeight: 0.98,
        letterSpacing: '-0.035em',
        fontWeight: 600,
        color: C.ink,
        margin: 0,
        maxWidth: 940,
      }}>
        Lists are downstream.
        <br/>
        Surface the seller
        <br/>
        <em style={{ fontStyle: 'italic', color: C.accent, fontWeight: 500 }}>before the lawyer files.</em>
      </h1>

      <p style={{
        fontFamily: SERIF, fontSize: isMobile ? 17 : 22, lineHeight: 1.55, color: C.text2,
        margin: isMobile ? '24px 0 32px' : '36px 0 44px', maxWidth: 680, fontWeight: 400,
      }}>
        Six proprietary pre-event signals — obituary matches, pre-divorce patterns, incarceration risk,
        old-roof permits, drive-by vision, estate-sale activity — scored nightly and routed to one operator
        per territory. The seller leads no vendor's list has yet.
      </p>

      <div style={{
        display: 'flex', alignItems: 'center', gap: 14,
        marginBottom: isMobile ? 40 : 64,
        flexWrap: 'wrap',
      }}>
        <Link href="/signup" style={{
          fontFamily: SANS, fontSize: 15, fontWeight: 500,
          background: C.ink, color: '#FFF', padding: '14px 22px', borderRadius: 10,
          letterSpacing: '-0.005em',
          display: 'inline-flex', alignItems: 'center', gap: 8,
        }}>
          Request access <ArrowRight size={16}/>
        </Link>
        <Link href="/login" style={{
          fontFamily: SANS, fontSize: 15, fontWeight: 500,
          background: 'transparent', color: C.text, padding: '14px 22px', borderRadius: 10,
          border: `1px solid ${C.border}`, letterSpacing: '-0.005em',
        }}>
          See it in action
        </Link>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
        gap: isMobile ? 24 : 28, paddingTop: isMobile ? 24 : 32,
        borderTop: `1px solid ${C.borderSoft}`,
      }}>
        {[
          { v: '184k', l: 'Parcels scored daily, Sarasota Co.' },
          { v: '6',    l: 'Proprietary signals · exclusive by territory' },
          { v: '8.7%', l: 'First-touch reply rate' },
          { v: '34d',  l: 'Avg first-touch → contract' },
        ].map(m => (
          <div key={m.l}>
            <div style={{
              fontFamily: SERIF, fontSize: isMobile ? 30 : 36, color: C.ink, fontWeight: 600,
              letterSpacing: '-0.025em', lineHeight: 1, fontVariantNumeric: 'tabular-nums',
            }}>
              {m.v}
            </div>
            <div style={{ fontFamily: SANS, fontSize: 13, color: C.text3, marginTop: 8, lineHeight: 1.5 }}>
              {m.l}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------- product preview ---------- */

function ProductPreview() {
  const isMobile = useIsMobile();
  return (
    <section style={{
      background: C.panel,
      borderTop: `1px solid ${C.borderSoft}`,
      borderBottom: `1px solid ${C.borderSoft}`,
    }}>
      <div style={{
        maxWidth: 1240, margin: '0 auto',
        padding: isMobile ? '56px 18px' : '88px 32px',
      }}>
        <div style={{ marginBottom: isMobile ? 32 : 48 }}>
          <div style={{ fontFamily: SANS, fontSize: 12, color: C.accent, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 14 }}>
            The product
          </div>
          <h2 style={{
            fontFamily: SERIF, fontSize: isMobile ? 30 : 48, color: C.ink,
            letterSpacing: '-0.03em', margin: 0, fontWeight: 600, lineHeight: 1.05,
            maxWidth: 720,
          }}>
            A short list every morning. The right call by lunch.
          </h2>
        </div>

        <div style={{
          background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14,
          padding: isMobile ? 18 : 28, boxShadow: '0 1px 3px rgba(0,0,0,0.03), 0 24px 48px -28px rgba(0,0,0,0.18)',
        }}>
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            marginBottom: 20, gap: 12, flexWrap: 'wrap',
          }}>
            <div>
              <div style={{ fontFamily: SANS, fontSize: 12, color: C.text3, marginBottom: 4, fontWeight: 500 }}>
                Today · 8 leads worth a look
              </div>
              <div style={{ fontFamily: SERIF, fontSize: 22, color: C.ink, fontWeight: 600, letterSpacing: '-0.02em', fontStyle: 'italic' }}>
                Acquisition Inbox
              </div>
            </div>
            {!isMobile && (
              <div style={{ display: 'flex', gap: 8 }}>
                <span style={chipStyle}>Filter</span>
                <span style={chipStyle}>Export</span>
              </div>
            )}
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: 16,
          }}>
            {[
              { score: 94, owner: 'Margaret L. Holloway',     addr: '2847 Oleander Way',  tag: 'Pre-probate match', why: "Obituary published 3 weeks ago. Property is free-and-clear. Utilities off.", equity: '$412k' },
              { score: 91, owner: 'Estate of Robert M. Vega', addr: '1142 Pinebrook Rd',  tag: 'Probate filed',     why: 'Estate in probate. Three open city code violations. Visibly vacant.', equity: '$345k' },
              { score: 87, owner: 'Patricia & Donald Reeves', addr: '5612 Sandcastle Dr', tag: 'Senior, high equity', why: 'Couple in their late 70s. Paid off long ago. Roof permit on file from 2003.', equity: '$295k' },
            ].map((l, i) => (
              <div key={i} style={{ border: `1px solid ${C.border}`, borderRadius: 10, padding: 16, background: '#fff' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 8,
                    background: l.score >= 85 ? C.accent : C.panel,
                    color: l.score >= 85 ? '#FFF' : C.text,
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                    fontFamily: SANS, fontWeight: 600, lineHeight: 1, flexShrink: 0,
                  }}>
                    <span style={{ fontSize: 16, letterSpacing: '-0.02em' }}>{l.score}</span>
                    <span style={{ fontSize: 8, opacity: 0.7, marginTop: 2, letterSpacing: '0.04em' }}>SCORE</span>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: SERIF, fontSize: 15, fontWeight: 600, color: C.ink, letterSpacing: '-0.01em', lineHeight: 1.2, marginBottom: 3 }}>
                      {l.owner}
                    </div>
                    <div style={{ fontFamily: SANS, fontSize: 12, color: C.text3 }}>{l.addr}</div>
                  </div>
                </div>
                <span style={{
                  display: 'inline-flex', alignItems: 'center',
                  background: C.accentSoft, color: C.accent, border: `1px solid ${C.accentLine}`,
                  borderRadius: 6, padding: '2px 7px', fontFamily: SANS, fontSize: 11, fontWeight: 500, marginBottom: 10,
                }}>
                  {l.tag}
                </span>
                <div style={{ fontFamily: SANS, fontSize: 13, color: C.text2, lineHeight: 1.5, marginBottom: 12 }}>
                  {l.why}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: 10, borderTop: `1px solid ${C.borderSoft}` }}>
                  <span style={{ fontFamily: SANS, fontSize: 11, color: C.text3 }}>Equity</span>
                  <span style={{ fontFamily: SANS, fontSize: 15, fontWeight: 600, color: C.ink, letterSpacing: '-0.01em', fontVariantNumeric: 'tabular-nums' }}>{l.equity}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const chipStyle: React.CSSProperties = {
  fontFamily: SANS, fontSize: 12, color: C.text3,
  background: C.panel, padding: '6px 10px', borderRadius: 6,
};

/* ---------- signals ---------- */

const MOAT_SIGNALS = [
  { icon: BookOpen, label: 'Pre-probate match',         desc: 'Obituaries cross-referenced against owned property — weeks before any probate filing.' },
  { icon: Heart,    label: 'Pre-divorce signals',       desc: 'Joint-ownership homes with early-stage civil patterns. Before the petition.' },
  { icon: Lock,     label: 'Incarceration risk',        desc: 'Felony filings against sole-titled owners. Long runway, motivated family.' },
  { icon: Home,     label: 'Old-roof permit cross-ref', desc: 'No roof permit on file in 15+ years. Operator gets ahead of the bill.' },
  { icon: Eye,      label: 'Drive-by computer vision',  desc: 'Vision model on licensed street-level imagery flags damage, vacancy, neglect.' },
  { icon: Hammer,   label: 'Estate-sale activity',      desc: 'EstateSales.net + Marketplace surface the houses about to follow the contents.' },
];

const STANDARD_SIGNALS = [
  { icon: Gavel,         label: 'Probate filed',       desc: 'Estate going through the court.' },
  { icon: Heart,         label: 'Divorce filed',       desc: 'Jointly-owned property, petition on record.' },
  { icon: AlertTriangle, label: 'Pre-foreclosure',     desc: 'Notice of Default on record.' },
  { icon: FileText,      label: 'Code violations',     desc: 'Open citations stacking up.' },
  { icon: DollarSign,    label: 'Tax delinquent',      desc: 'Behind on property taxes.' },
  { icon: Flame,         label: 'Fire or flood',       desc: 'Insurance claim or FEMA-zone overlap.' },
  { icon: Users,         label: 'Senior, high equity', desc: 'Long-tenured owner over 70 with significant equity.' },
  { icon: Home,          label: 'Vacant',              desc: 'Utility shut-off, no occupancy.' },
  { icon: ShieldCheck,   label: 'Free and clear',      desc: 'No mortgage of record.' },
  { icon: Clock,         label: 'MLS overstay',        desc: '180+ days listed, multiple price drops.' },
];

function SignalsSection() {
  const isMobile = useIsMobile();
  return (
    <section id="signals" style={{ background: C.bg }}>
      <div style={{
        maxWidth: 1240, margin: '0 auto',
        padding: isMobile ? '72px 18px' : '120px 32px',
      }}>
        <div style={{ textAlign: 'center', maxWidth: 740, margin: '0 auto 56px' }}>
          <div style={{ fontFamily: SANS, fontSize: 12, color: C.accent, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 14 }}>
            Signal engine
          </div>
          <h2 style={{
            fontFamily: SERIF, fontSize: isMobile ? 34 : 56, color: C.ink,
            letterSpacing: '-0.03em', margin: 0, fontWeight: 600, lineHeight: 1.05,
          }}>
            Six pre-event signals. Ten table-stakes. One score.
          </h2>
          <p style={{
            fontFamily: SERIF, fontSize: isMobile ? 16 : 20, color: C.text2,
            marginTop: 20, lineHeight: 1.55,
          }}>
            We don't sell lists. We score every parcel in your territory against the catalogue every night
            and surface a short queue worth your acquisition manager's time.
          </p>
        </div>

        <div style={{ marginBottom: 56 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
            <span style={pill('accent')}>
              <Sparkles size={11} strokeWidth={2.2}/> Proprietary
            </span>
            <h3 style={{ fontFamily: SERIF, fontSize: isMobile ? 22 : 28, color: C.ink, letterSpacing: '-0.02em', margin: 0, fontWeight: 600 }}>
              The six no other vendor surfaces
            </h3>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: 1, background: C.border, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden',
          }}>
            {MOAT_SIGNALS.map(it => <SignalCard key={it.label} item={it} accent/>)}
          </div>
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
            <span style={pill('neutral')}>Standard coverage</span>
            <h3 style={{ fontFamily: SERIF, fontSize: isMobile ? 22 : 28, color: C.ink, letterSpacing: '-0.02em', margin: 0, fontWeight: 600 }}>
              Table-stakes the platform must carry
            </h3>
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
            gap: 1, background: C.border, border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden',
          }}>
            {STANDARD_SIGNALS.map(it => <SignalCard key={it.label} item={it}/>)}
          </div>
        </div>
      </div>
    </section>
  );
}

function SignalCard({ item, accent }: { item: { icon: any; label: string; desc: string }; accent?: boolean }) {
  const Icon = item.icon;
  return (
    <div style={{ background: C.surface, padding: 24 }}>
      <div style={{
        width: 38, height: 38, borderRadius: 10,
        background: accent ? C.accentSoft : C.panel,
        color: accent ? C.accent : C.text2,
        border: `1px solid ${accent ? C.accentLine : C.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 16,
      }}>
        <Icon size={18} strokeWidth={1.8}/>
      </div>
      <div style={{ fontFamily: SERIF, fontSize: 17, fontWeight: 600, color: C.ink, letterSpacing: '-0.015em', marginBottom: 6 }}>
        {item.label}
      </div>
      <div style={{ fontFamily: SANS, fontSize: 14, color: C.text2, lineHeight: 1.55 }}>
        {item.desc}
      </div>
    </div>
  );
}

function pill(tone: 'accent' | 'neutral'): React.CSSProperties {
  const a = tone === 'accent';
  return {
    display: 'inline-flex', alignItems: 'center', gap: 5,
    fontFamily: SANS, fontSize: 11,
    color: a ? C.accent : C.text2, fontWeight: 600,
    letterSpacing: '0.06em', textTransform: 'uppercase',
    background: a ? C.accentSoft : C.panel,
    border: `1px solid ${a ? C.accentLine : C.border}`,
    borderRadius: 999, padding: '4px 10px',
  };
}

/* ---------- how it works ---------- */

const STEPS = [
  {
    n: '01', icon: Activity,
    title: 'Aire surfaces them.',
    body: 'Every night we re-score every parcel in your territory against sixteen signals. Each morning you get a ranked queue — usually five to twelve names — with motivation score and the three contributing factors.',
  },
  {
    n: '02', icon: Send,
    title: 'You reach out.',
    body: 'Mailers fulfilled by Lob. Consent-gated SMS through A2P 10DLC. Scripts auto-drafted per signal — you edit before send. Aire never AI-calls cold numbers; that is not legally deployable.',
  },
  {
    n: '03', icon: PhoneIncoming,
    title: 'Front Desk takes callbacks.',
    body: 'When the seller calls your tracked number — usually after hours — Aire qualifies, takes property notes, and books a walkthrough on your calendar. You wake up to a summary on your phone.',
  },
  {
    n: '04', icon: ArrowRight,
    title: 'You close.',
    body: 'Live whisper coach on every human dial. Pipeline tracks every conversation from first-touch through assignment fee. Outcome feeds back into next night\'s scoring.',
  },
];

function HowItWorks() {
  const isMobile = useIsMobile();
  return (
    <section id="how" style={{
      background: C.panel, borderTop: `1px solid ${C.borderSoft}`, borderBottom: `1px solid ${C.borderSoft}`,
    }}>
      <div style={{
        maxWidth: 1240, margin: '0 auto',
        padding: isMobile ? '72px 18px' : '120px 32px',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 2fr',
          gap: isMobile ? 32 : 64,
          alignItems: 'start',
        }}>
          <div style={{ position: isMobile ? 'static' : 'sticky', top: 100 }}>
            <div style={{ fontFamily: SANS, fontSize: 12, color: C.accent, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 14 }}>
              How it works
            </div>
            <h2 style={{
              fontFamily: SERIF, fontSize: isMobile ? 32 : 48, color: C.ink,
              letterSpacing: '-0.03em', margin: 0, fontWeight: 600, lineHeight: 1.05,
            }}>
              Four steps, done well.
            </h2>
            <p style={{ fontFamily: SERIF, fontSize: isMobile ? 16 : 18, color: C.text2, marginTop: 24, lineHeight: 1.6 }}>
              Aire is not a CRM you have to load up. It is the quiet operator next to you, doing the parts
              you keep meaning to do.
            </p>
          </div>

          <div>
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={s.n} style={{
                  paddingBottom: i < STEPS.length - 1 ? 40 : 0,
                  marginBottom: i < STEPS.length - 1 ? 40 : 0,
                  borderBottom: i < STEPS.length - 1 ? `1px solid ${C.borderSoft}` : 'none',
                  display: 'grid',
                  gridTemplateColumns: isMobile ? '1fr' : '80px 1fr',
                  gap: isMobile ? 16 : 32,
                }}>
                  <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                    <span style={{
                      fontFamily: SERIF, fontSize: 22, color: C.text3, fontWeight: 500,
                      letterSpacing: '-0.02em', fontStyle: 'italic',
                    }}>
                      {s.n}
                    </span>
                    <div style={{
                      width: 40, height: 40, borderRadius: 10,
                      background: C.surface, border: `1px solid ${C.border}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', color: C.accent,
                    }}>
                      <Icon size={18} strokeWidth={1.8}/>
                    </div>
                  </div>
                  <div style={{ paddingTop: isMobile ? 0 : 6 }}>
                    <h3 style={{
                      fontFamily: SERIF, fontSize: isMobile ? 22 : 30, color: C.ink,
                      letterSpacing: '-0.025em', margin: 0, fontWeight: 600, lineHeight: 1.15,
                    }}>
                      {s.title}
                    </h3>
                    <p style={{
                      fontFamily: SANS, fontSize: isMobile ? 14 : 16, color: C.text2,
                      marginTop: 14, lineHeight: 1.65,
                    }}>
                      {s.body}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- territory ---------- */

function Territory() {
  const isMobile = useIsMobile();
  return (
    <section id="territory">
      <div style={{
        maxWidth: 1240, margin: '0 auto',
        padding: isMobile ? '72px 18px' : '120px 32px',
      }}>
        <div style={{
          background: C.ink, color: '#FFF', borderRadius: 20,
          padding: isMobile ? '48px 24px' : '72px 64px',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', top: -100, right: -100, width: 400, height: 400,
            background: `radial-gradient(circle, ${C.accent}55 0%, transparent 70%)`,
            pointerEvents: 'none',
          }}/>

          <div style={{ position: 'relative', maxWidth: 720 }}>
            <div style={{ fontFamily: SANS, fontSize: 12, color: '#A5A8E0', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 18 }}>
              Territory exclusivity
            </div>
            <h2 style={{
              fontFamily: SERIF, fontSize: isMobile ? 34 : 56, color: '#FFF',
              letterSpacing: '-0.03em', margin: 0, fontWeight: 600, lineHeight: 1.05,
            }}>
              One operator per moat.
              <br/>
              <em style={{ fontStyle: 'italic', color: '#C3C6F0', fontWeight: 500 }}>Six months in, you'll know why.</em>
            </h2>
            <p style={{
              fontFamily: SERIF, fontSize: isMobile ? 17 : 20, color: '#C8CAD8',
              marginTop: 28, lineHeight: 1.55,
            }}>
              The six proprietary signals are sold exclusively, one operator per territory. Standard
              coverage stays available to others — but the pre-event categories are the moat, and the
              moat is yours.
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
              gap: isMobile ? 24 : 32, marginTop: 40, paddingTop: 32,
              borderTop: '1px solid rgba(255,255,255,0.1)',
            }}>
              {[
                ['City',     '$2,500 / mo'],
                ['State',    '$7,500 / mo'],
                ['National', '$4,000 / mo (non-exclusive)'],
              ].map(([v, l]) => (
                <div key={v}>
                  <div style={{
                    fontFamily: SERIF, fontSize: isMobile ? 22 : 28, color: '#FFF', fontWeight: 600,
                    letterSpacing: '-0.025em',
                  }}>
                    {v}
                  </div>
                  <div style={{ fontFamily: SANS, fontSize: 13, color: '#888BA8', marginTop: 6, fontVariantNumeric: 'tabular-nums' }}>
                    {l}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- pricing ---------- */

type Tier = {
  name: string;
  price: string;
  per: string;
  sub: string;
  bullets: string[];
  recommended?: boolean;
  enterprise?: boolean;
};

const TIERS: Tier[] = [
  {
    name: 'Operator',
    price: '$499',
    per: '/ mo',
    sub: 'One city · all signals · no exclusivity',
    bullets: [
      'Full AI workflow (inbox, dialer, Front Desk, pipeline)',
      'All 16 signals — standard coverage',
      'Mailers fulfilled by Lob (pass-through)',
      'A2P 10DLC SMS (pass-through)',
    ],
  },
  {
    name: 'Operator + Exclusive',
    price: '$2,500',
    per: '/ mo',
    sub: 'One city · exclusive proprietary signals',
    bullets: [
      'Everything in Operator',
      'Exclusive access to the 6 proprietary signals in your city',
      'Capped at 1 buyer per city for the moat',
      'Priority data refresh + dedicated success',
    ],
    recommended: true,
  },
  {
    name: 'Regional',
    price: '$1,500',
    per: '/ mo',
    sub: 'One state · all signals · no exclusivity',
    bullets: [
      'Full AI workflow across one state',
      'All 16 signals — standard coverage',
      'Higher monthly credit pack included',
    ],
  },
  {
    name: 'Regional + Exclusive',
    price: '$7,500',
    per: '/ mo',
    sub: 'One state · exclusive proprietary signals',
    bullets: [
      'Everything in Regional',
      'Exclusive proprietary signals across one state',
      'Capped at 1 buyer per state for the moat',
      'Quarterly business review',
    ],
  },
  {
    name: 'National',
    price: '$4,000',
    per: '/ mo',
    sub: 'All counties · no exclusivity',
    bullets: [
      'All 16 signals, every county',
      'Best fit for non-territorial buyers (institutional iBuyers, REITs)',
      'No exclusivity layer',
    ],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    per: '',
    sub: 'Multi-seat · multi-territory exclusivity · dedicated success',
    bullets: [
      'Custom data pulls + private signals',
      'Multi-territory exclusivity carve-outs',
      'SLAs, SSO, custom integrations',
      'Family-office and fund pricing',
    ],
    enterprise: true,
  },
];

function PricingCTA() {
  const isMobile = useIsMobile();
  return (
    <section id="pricing" style={{ background: C.bg, borderTop: `1px solid ${C.borderSoft}` }}>
      <div style={{
        maxWidth: 1240, margin: '0 auto',
        padding: isMobile ? '72px 18px' : '120px 32px',
      }}>
        <div style={{ textAlign: 'center', maxWidth: 760, margin: '0 auto 56px' }}>
          <div style={{ fontFamily: SANS, fontSize: 12, color: C.accent, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 14 }}>
            Pricing
          </div>
          <h2 style={{
            fontFamily: SERIF, fontSize: isMobile ? 34 : 56, color: C.ink,
            letterSpacing: '-0.03em', margin: 0, fontWeight: 600, lineHeight: 1.05,
          }}>
            Subscription + territory exclusivity.
          </h2>
          <p style={{
            fontFamily: SERIF, fontSize: isMobile ? 17 : 20, color: C.text2,
            marginTop: 20, lineHeight: 1.55,
          }}>
            Pricing is tied to territory size and exclusivity, not feature gating. Every tier ships the
            same AI workflow. Mailers, SMS, and voice minutes pass through at carrier cost with a monthly
            credit pack included.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)',
          gap: 16,
        }}>
          {TIERS.map(t => (
            <div key={t.name} style={{
              background: t.recommended ? C.ink : C.surface,
              color: t.recommended ? '#FFF' : C.text,
              border: `1px solid ${t.recommended ? C.ink : C.border}`,
              borderRadius: 14, padding: 28,
              display: 'flex', flexDirection: 'column', gap: 18,
              boxShadow: t.recommended
                ? '0 1px 3px rgba(0,0,0,0.04), 0 32px 80px -40px rgba(55,48,163,0.5)'
                : '0 1px 3px rgba(0,0,0,0.02)',
              position: 'relative', overflow: 'hidden',
            }}>
              {t.recommended && (
                <div style={{
                  position: 'absolute', top: 14, right: 14,
                  display: 'inline-flex', alignItems: 'center', gap: 5,
                  background: 'rgba(255,255,255,0.08)', color: '#C3C6F0',
                  border: '1px solid rgba(255,255,255,0.16)',
                  borderRadius: 999, padding: '3px 9px',
                  fontFamily: SANS, fontSize: 10, fontWeight: 600,
                  letterSpacing: '0.06em', textTransform: 'uppercase',
                }}>
                  <Sparkles size={10} strokeWidth={2.2}/> Most operators
                </div>
              )}

              <div>
                <div style={{
                  fontFamily: SANS, fontSize: 12,
                  color: t.recommended ? '#A5A8E0' : C.text3,
                  fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase',
                  marginBottom: 14,
                }}>
                  {t.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                  <span style={{
                    fontFamily: SERIF, fontSize: isMobile ? 38 : 44,
                    color: t.recommended ? '#FFF' : C.ink,
                    fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1,
                    fontVariantNumeric: 'tabular-nums',
                  }}>
                    {t.price}
                  </span>
                  {t.per && (
                    <span style={{
                      fontFamily: SANS, fontSize: 14,
                      color: t.recommended ? '#A5A8E0' : C.text3,
                    }}>
                      {t.per}
                    </span>
                  )}
                </div>
                <div style={{
                  fontFamily: SANS, fontSize: 13,
                  color: t.recommended ? '#C8CAD8' : C.text2,
                  marginTop: 8, lineHeight: 1.5,
                }}>
                  {t.sub}
                </div>
              </div>

              <div style={{
                paddingTop: 14, borderTop: `1px solid ${t.recommended ? 'rgba(255,255,255,0.1)' : C.borderSoft}`,
                display: 'flex', flexDirection: 'column', gap: 10,
              }}>
                {t.bullets.map(b => (
                  <div key={b} style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <Check size={14} strokeWidth={2.5} color={t.recommended ? '#C3C6F0' : C.accent} style={{ marginTop: 2, flexShrink: 0 }}/>
                    <span style={{
                      fontFamily: SANS, fontSize: 13,
                      color: t.recommended ? '#E1E2F3' : C.text,
                      letterSpacing: '-0.005em', lineHeight: 1.5,
                    }}>
                      {b}
                    </span>
                  </div>
                ))}
              </div>

              <Link href={t.enterprise ? '/signup' : '/signup'} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                fontFamily: SANS, fontSize: 14, fontWeight: 500,
                background: t.recommended ? '#FFF' : C.ink,
                color: t.recommended ? C.ink : '#FFF',
                padding: '12px 18px', borderRadius: 10,
                letterSpacing: '-0.005em', marginTop: 'auto',
              }}>
                {t.enterprise ? 'Talk to us' : 'Request access'} <ArrowRight size={14}/>
              </Link>
            </div>
          ))}
        </div>

        <div style={{
          marginTop: 28, padding: 18,
          background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12,
          display: 'flex', gap: 12, alignItems: 'flex-start',
        }}>
          <ShieldCheck size={18} color={C.good} strokeWidth={2} style={{ flexShrink: 0, marginTop: 1 }}/>
          <div style={{ fontFamily: SANS, fontSize: 13, color: C.text2, lineHeight: 1.6 }}>
            Aire is TCPA-safe by design. We do not autonomously cold-call sellers with synthetic voice.
            Inbound AI runs on Retell with full SOC 2 + BAA. SMS is registered under A2P 10DLC with
            per-campaign use cases on file. Mailers via Lob.
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- footer ---------- */

function Footer() {
  const isMobile = useIsMobile();
  return (
    <footer style={{ background: C.panel, borderTop: `1px solid ${C.borderSoft}` }}>
      <div style={{
        maxWidth: 1240, margin: '0 auto',
        padding: isMobile ? '36px 18px' : '48px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexDirection: isMobile ? 'column' : 'row',
        gap: 18,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Wordmark size="sm"/>
          <span style={{ fontFamily: SANS, fontSize: 13, color: C.text3 }}>
            A Brechin Capital company
          </span>
        </div>
        <div style={{ display: 'flex', gap: 24, fontFamily: SANS, fontSize: 13, color: C.text3 }}>
          <Link href="/login">Sign in</Link>
          <Link href="/signup">Request access</Link>
          <span>© 2026</span>
        </div>
      </div>
    </footer>
  );
}

export default function LandingPage() {
  return (
    <div style={{ background: C.bg, minHeight: '100vh' }}>
      <NavBar/>
      <Hero/>
      <ProductPreview/>
      <SignalsSection/>
      <HowItWorks/>
      <Territory/>
      <PricingCTA/>
      <Footer/>
    </div>
  );
}

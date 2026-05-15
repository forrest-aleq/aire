'use client';

import React from 'react';
import { C, SANS, SERIF, MONO } from '@/lib/tokens';
import { SITUATION } from '@/lib/data';
import {
  Tag, SituationTag, Score, Btn, Stat, PageTitle, SectionHeader,
} from '@/components/primitives';
import {
  Send, Phone, Plus, ArrowRight, Check, Sparkles, Filter, Download,
} from 'lucide-react';

type Swatch = { name: string; value: string; ink?: boolean };

const SURFACE: Swatch[] = [
  { name: 'bg',         value: C.bg },
  { name: 'surface',    value: C.surface },
  { name: 'panel',      value: C.panel },
  { name: 'hover',      value: C.hover },
  { name: 'border',     value: C.border },
  { name: 'borderSoft', value: C.borderSoft },
];

const INK: Swatch[] = [
  { name: 'ink',      value: C.ink,      ink: true },
  { name: 'text',     value: C.text,     ink: true },
  { name: 'text2',    value: C.text2,    ink: true },
  { name: 'text3',    value: C.text3 },
  { name: 'textMute', value: C.textMute },
];

const ACCENT: Swatch[] = [
  { name: 'accent',     value: C.accent, ink: true },
  { name: 'accentSoft', value: C.accentSoft },
  { name: 'accentLine', value: C.accentLine },
];

const FUNCTIONAL: Swatch[] = [
  { name: 'good',      value: C.good, ink: true },
  { name: 'goodSoft',  value: C.goodSoft },
  { name: 'warn',      value: C.warn, ink: true },
  { name: 'warnSoft',  value: C.warnSoft },
  { name: 'alert',     value: C.alert, ink: true },
  { name: 'alertSoft', value: C.alertSoft },
];

function Swatches({ items }: { items: Swatch[] }) {
  return (
    <div style={{
      display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 12,
    }}>
      {items.map(s => (
        <div key={s.name} style={{
          border: `1px solid ${C.border}`, borderRadius: 10, overflow: 'hidden', background: C.surface,
        }}>
          <div style={{ height: 56, background: s.value }}/>
          <div style={{ padding: '10px 12px', borderTop: `1px solid ${C.borderSoft}` }}>
            <div style={{ fontFamily: SANS, fontSize: 13, color: C.ink, fontWeight: 500, letterSpacing: '-0.005em' }}>
              C.{s.name}
            </div>
            <div style={{ fontFamily: MONO, fontSize: 12, color: C.text3, marginTop: 2 }}>
              {s.value}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function Block({ children, label }: { children: React.ReactNode; label?: string }) {
  return (
    <div>
      {label && (
        <div style={{
          fontFamily: SANS, fontSize: 11, color: C.text3,
          textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 500, marginBottom: 10,
        }}>
          {label}
        </div>
      )}
      <div style={{
        display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12,
        padding: 20, border: `1px solid ${C.border}`, borderRadius: 12, background: C.surface,
      }}>
        {children}
      </div>
    </div>
  );
}

function Spec({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
      padding: '12px 16px', borderBottom: `1px solid ${C.borderSoft}`,
    }}>
      <div style={{ fontFamily: SANS, fontSize: 13, color: C.text2 }}>{label}</div>
      <div style={{ fontFamily: MONO, fontSize: 13, color: C.ink }}>{value}</div>
    </div>
  );
}

function Section({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <section style={{ marginTop: 56 }}>
      <SectionHeader title={title} sub={sub}/>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>{children}</div>
    </section>
  );
}

export default function DesignKitPage() {
  return (
    <div style={{
      minHeight: '100vh', background: C.bg, color: C.text,
      fontFamily: SANS, padding: '64px 32px 96px',
    }}>
      <div style={{ maxWidth: 1040, margin: '0 auto' }}>
        <PageTitle
          title={<span style={{ fontFamily: SERIF, fontStyle: 'italic', fontWeight: 500 }}>Design Kit</span>}
          sub="Tokens, primitives, and the visual rules behind every Aire screen."
          action={<Tag tone="accent"><Sparkles size={12} strokeWidth={2}/> Living reference</Tag>}
        />

        <Section title="Colors" sub="One indigo accent. Everything else is grayscale or functional.">
          <div>
            <div style={{ fontFamily: SANS, fontSize: 12, color: C.text3, marginBottom: 10, fontWeight: 500 }}>
              Surface
            </div>
            <Swatches items={SURFACE}/>
          </div>
          <div>
            <div style={{ fontFamily: SANS, fontSize: 12, color: C.text3, marginBottom: 10, fontWeight: 500 }}>
              Ink
            </div>
            <Swatches items={INK}/>
          </div>
          <div>
            <div style={{ fontFamily: SANS, fontSize: 12, color: C.text3, marginBottom: 10, fontWeight: 500 }}>
              Accent — use surgically
            </div>
            <Swatches items={ACCENT}/>
          </div>
          <div>
            <div style={{ fontFamily: SANS, fontSize: 12, color: C.text3, marginBottom: 10, fontWeight: 500 }}>
              Functional
            </div>
            <Swatches items={FUNCTIONAL}/>
          </div>
        </Section>

        <Section title="Typography" sub="Newsreader for editorial moments, Inter Tight everywhere else, JetBrains Mono for identifiers.">
          <div style={{
            padding: 28, border: `1px solid ${C.border}`, borderRadius: 12, background: C.surface,
            display: 'flex', flexDirection: 'column', gap: 22,
          }}>
            <div>
              <div style={{ fontFamily: SANS, fontSize: 11, color: C.text3, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                Serif · Newsreader 500 italic · 48
              </div>
              <div style={{ fontFamily: SERIF, fontSize: 48, fontStyle: 'italic', fontWeight: 500, color: C.ink, letterSpacing: '-0.03em', lineHeight: 1.05 }}>
                Find sellers before anyone else does.
              </div>
            </div>
            <div>
              <div style={{ fontFamily: SANS, fontSize: 11, color: C.text3, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                Sans · Inter Tight 500 · 28 / 18 / 14 / 12
              </div>
              <div style={{ fontFamily: SANS, fontSize: 28, fontWeight: 500, color: C.ink, letterSpacing: '-0.025em', lineHeight: 1.1 }}>
                Today’s leads in Sarasota County
              </div>
              <div style={{ fontFamily: SANS, fontSize: 18, fontWeight: 500, color: C.ink, letterSpacing: '-0.02em', marginTop: 8 }}>
                Twelve new situations since yesterday
              </div>
              <div style={{ fontFamily: SANS, fontSize: 14, color: C.text, marginTop: 8 }}>
                Body copy reads at 14px with a 1.5 line height. Numerals tabular-feel in dense tables; otherwise default.
              </div>
              <div style={{ fontFamily: SANS, fontSize: 12, color: C.text3, marginTop: 6 }}>
                Caption · 12px · text3
              </div>
            </div>
            <div>
              <div style={{ fontFamily: SANS, fontSize: 11, color: C.text3, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                Mono · JetBrains Mono 500 · 14
              </div>
              <div style={{ fontFamily: MONO, fontSize: 14, color: C.ink }}>
                L-2847 · 2847 Oleander Way · 94
              </div>
            </div>
          </div>
        </Section>

        <Section title="Buttons" sub="Five variants. Use primary for the single most important action on a screen, accent only for indigo moments.">
          <Block label="Primary">
            <Btn variant="primary">Save lead</Btn>
            <Btn variant="primary" icon={Plus}>New lead</Btn>
            <Btn variant="primary" size="sm">Save</Btn>
          </Block>
          <Block label="Accent">
            <Btn variant="accent" icon={Send}>Send letter</Btn>
            <Btn variant="accent" size="sm" icon={Phone}>Call now</Btn>
          </Block>
          <Block label="Ghost (default)">
            <Btn icon={Filter}>Filter</Btn>
            <Btn icon={Download}>Export</Btn>
            <Btn>Cancel</Btn>
          </Block>
          <Block label="Soft + Plain">
            <Btn variant="soft" icon={Check}>Mark done</Btn>
            <Btn variant="plain" icon={ArrowRight}>Skip</Btn>
          </Block>
        </Section>

        <Section title="Tags" sub="Compact, tonal labels. xs for inline-with-text use; sm everywhere else.">
          <Block label="Tones · sm">
            <Tag>Neutral</Tag>
            <Tag tone="accent">Accent</Tag>
            <Tag tone="good">Good</Tag>
            <Tag tone="warn">Warn</Tag>
            <Tag tone="alert">Alert</Tag>
          </Block>
          <Block label="Tones · xs">
            <Tag size="xs">Neutral</Tag>
            <Tag size="xs" tone="accent">Accent</Tag>
            <Tag size="xs" tone="good">Good</Tag>
            <Tag size="xs" tone="warn">Warn</Tag>
            <Tag size="xs" tone="alert">Alert</Tag>
          </Block>
        </Section>

        <Section title="Situation tags" sub="One per situation in SITUATION. Priority situations render in accent; the rest stay neutral.">
          <Block>
            {Object.keys(SITUATION).map(key => (
              <SituationTag key={key} situation={key}/>
            ))}
          </Block>
        </Section>

        <Section title="Score" sub="Lead score 0–100. ≥85 fills with accent.">
          <Block label="Sizes">
            <Score value={72} size="sm"/>
            <Score value={94} size="sm"/>
            <Score value={72} size="md"/>
            <Score value={94} size="md"/>
            <Score value={72} size="lg"/>
            <Score value={94} size="lg"/>
          </Block>
        </Section>

        <Section title="Stat" sub="Headline number with optional sub. Use accent sparingly — usually for the one number that matters most.">
          <div style={{
            display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32,
            padding: 28, border: `1px solid ${C.border}`, borderRadius: 12, background: C.surface,
          }}>
            <Stat label="New today" value="12"/>
            <Stat label="In pipeline" value="38" sub="↑ 6 this week"/>
            <Stat label="Closing soon" value="3" sub="signs Monday"/>
            <Stat label="Fees this month" value="$46,000" accent/>
          </div>
        </Section>

        <Section title="Headers" sub="PageTitle for the top of a route. SectionHeader for groups inside a page.">
          <div style={{ padding: 28, border: `1px solid ${C.border}`, borderRadius: 12, background: C.surface }}>
            <PageTitle
              title="Today"
              sub="Twelve new situations since yesterday."
              action={<Btn variant="primary" icon={Plus}>New lead</Btn>}
            />
            <SectionHeader
              title="Priority"
              sub="Movement in the last 24 hours."
              action={<Btn size="sm" icon={Filter}>Filter</Btn>}
            />
          </div>
        </Section>

        <Section title="Geometry" sub="The numeric rules behind every primitive.">
          <div style={{
            border: `1px solid ${C.border}`, borderRadius: 12, overflow: 'hidden', background: C.surface,
          }}>
            <Spec label="Radius · Tag"               value="6px"/>
            <Spec label="Radius · Button"            value="8px"/>
            <Spec label="Radius · Score / Card"      value="10–12px"/>
            <Spec label="Border · default"           value="1px solid C.border"/>
            <Spec label="Border · soft divider"      value="1px solid C.borderSoft"/>
            <Spec label="Letter-spacing · body"      value="-0.005em"/>
            <Spec label="Letter-spacing · headline"  value="-0.02em to -0.03em"/>
            <Spec label="Font weight · default"      value="500"/>
            <Spec label="Shadows"                    value="none — rely on hairlines"/>
          </div>
        </Section>

        <div style={{
          marginTop: 64, paddingTop: 24, borderTop: `1px solid ${C.borderSoft}`,
          fontFamily: SANS, fontSize: 12, color: C.text3,
        }}>
          Tokens live in <span style={{ fontFamily: MONO }}>lib/tokens.ts</span>.
          Primitives live in <span style={{ fontFamily: MONO }}>components/primitives.tsx</span>.
          Edit those first; this page reflects them.
        </div>
      </div>
    </div>
  );
}

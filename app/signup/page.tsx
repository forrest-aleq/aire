'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowRight, Check } from 'lucide-react';
import { C, SERIF, SANS } from '@/lib/tokens';
import { Wordmark } from '@/components/wordmark';
import { useIsMobile } from '@/lib/hooks';

export default function SignupPage() {
  const router = useRouter();
  const isMobile = useIsMobile(900);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: '', email: '', company: '', county: '', state: 'FL',
  });
  const [loading, setLoading] = useState(false);

  const handle = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // For the prototype, also drop them straight into the app on submit.
    await fetch('/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: form.email || 'guest@aire.app', password: 'guest' }),
    });
    setSubmitted(true);
    setLoading(false);
  };

  if (submitted) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.bg, padding: 32 }}>
        <div style={{
          background: C.surface, border: `1px solid ${C.border}`, borderRadius: 16,
          padding: 48, maxWidth: 520, width: '100%', textAlign: 'center',
        }}>
          <div style={{
            width: 56, height: 56, borderRadius: '50%', background: C.accentSoft,
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24,
          }}>
            <Check size={28} color={C.accent} strokeWidth={2}/>
          </div>
          <h1 style={{ fontFamily: SERIF, fontSize: 32, color: C.ink, fontWeight: 600, letterSpacing: '-0.025em', margin: 0, lineHeight: 1.1 }}>
            We got your request.
          </h1>
          <p style={{ fontFamily: SERIF, fontSize: 17, color: C.text2, marginTop: 16, lineHeight: 1.6 }}>
            We meet with every county operator before signing. Someone from our side will reach out
            within two business days to {form.email || 'you'} about {form.county || 'your county'}.
          </p>
          <p style={{ fontFamily: SANS, fontSize: 14, color: C.text3, marginTop: 24, lineHeight: 1.6 }}>
            While you wait, you can preview the product with a demo account:
          </p>
          <button
            onClick={() => { router.push('/today'); router.refresh(); }}
            style={{
              marginTop: 16, padding: '12px 20px', borderRadius: 10,
              background: C.ink, color: '#FFF', border: 'none', cursor: 'pointer',
              fontFamily: SANS, fontSize: 15, fontWeight: 500,
              display: 'inline-flex', alignItems: 'center', gap: 8,
            }}>
            Take a look <ArrowRight size={16}/>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'flex-start',
      background: C.bg, padding: isMobile ? '32px 18px 48px' : '48px 32px',
    }}>
      <div style={{ maxWidth: 920, margin: '0 auto', width: '100%' }}>
        <Link href="/" style={{ display: 'inline-flex', textDecoration: 'none', marginBottom: isMobile ? 32 : 48 }}>
          <Wordmark size="md"/>
        </Link>

        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? '1fr' : '1fr 1.2fr',
          gap: isMobile ? 32 : 64, alignItems: 'start',
        }}>
          <div style={{ position: isMobile ? 'static' : 'sticky', top: 48 }}>
            <h1 style={{
              fontFamily: SERIF, fontSize: isMobile ? 36 : 52, color: C.ink,
              fontWeight: 600, letterSpacing: '-0.03em', margin: 0, lineHeight: 1.05,
            }}>
              Take a territory.
            </h1>
            <p style={{
              fontFamily: SERIF, fontSize: isMobile ? 17 : 19, color: C.text2,
              marginTop: 22, lineHeight: 1.6,
            }}>
              Tell us where you operate and we'll let you know if the proprietary signals are still open
              in your market. If they are, we'll set up a thirty-minute call to walk through the platform
              and talk through whether Aire is a fit.
            </p>

            <div style={{ marginTop: 32, padding: 22, background: C.panel, border: `1px solid ${C.border}`, borderRadius: 12 }}>
              <div style={{ fontFamily: SANS, fontSize: 12, color: C.accent, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 10 }}>
                What to expect
              </div>
              <ul style={{ fontFamily: SANS, fontSize: 14, color: C.text2, lineHeight: 1.7, margin: 0, paddingLeft: 18 }}>
                <li>Reply within two business days</li>
                <li>Thirty-minute walkthrough call</li>
                <li>Two-week pilot in your market before commit</li>
                <li>Operator + Exclusive · $2,500/mo per city</li>
              </ul>
            </div>
          </div>

          <form onSubmit={submit} style={{
            background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: 36,
            display: 'flex', flexDirection: 'column', gap: 18,
            boxShadow: '0 1px 3px rgba(0,0,0,0.02), 0 24px 60px -32px rgba(0,0,0,0.16)',
          }}>
            <div>
              <label style={inputLabel}>Your name</label>
              <input required value={form.name} onChange={handle('name')} placeholder="Forrest Hosten" style={inputStyle} />
            </div>
            <div>
              <label style={inputLabel}>Work email</label>
              <input required type="email" value={form.email} onChange={handle('email')} placeholder="you@company.com" style={inputStyle} />
            </div>
            <div>
              <label style={inputLabel}>Company</label>
              <input value={form.company} onChange={handle('company')} placeholder="Brechin Capital" style={inputStyle} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12 }}>
              <div>
                <label style={inputLabel}>County of operation</label>
                <input required value={form.county} onChange={handle('county')} placeholder="Sarasota County" style={inputStyle} />
              </div>
              <div>
                <label style={inputLabel}>State</label>
                <select value={form.state} onChange={handle('state')} style={{...inputStyle, appearance: 'auto'}}>
                  {['FL','GA','SC','NC','TX','AZ','TN','AL'].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                marginTop: 8, padding: '13px 18px', borderRadius: 10,
                background: C.ink, color: '#FFF', border: 'none', cursor: loading ? 'wait' : 'pointer',
                fontFamily: SANS, fontSize: 15, fontWeight: 500, letterSpacing: '-0.005em',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                opacity: loading ? 0.6 : 1,
              }}>
              {loading ? 'Sending…' : <>Request access <ArrowRight size={16}/></>}
            </button>

            <div style={{ fontFamily: SANS, fontSize: 12, color: C.text3, textAlign: 'center', lineHeight: 1.55 }}>
              Already have an account?{' '}
              <Link href="/login" style={{ color: C.accent, fontWeight: 500 }}>Sign in</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

const inputLabel: React.CSSProperties = {
  fontFamily: SANS, fontSize: 13, color: C.text2, fontWeight: 500,
  display: 'block', marginBottom: 6, letterSpacing: '-0.005em',
};
const inputStyle: React.CSSProperties = {
  width: '100%', padding: '11px 14px', borderRadius: 8,
  border: `1px solid ${C.border}`, background: C.surface,
  fontFamily: SANS, fontSize: 15, color: C.text,
  outline: 'none', letterSpacing: '-0.005em',
};

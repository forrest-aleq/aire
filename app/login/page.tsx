'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, BookOpen, Lock, Eye } from 'lucide-react';
import { C, SERIF, SANS } from '@/lib/tokens';
import { Wordmark } from '@/components/wordmark';
import { useIsMobile } from '@/lib/hooks';

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get('next') || '/today';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.error || 'Could not sign you in');
        setLoading(false);
        return;
      }
      router.push(next);
      router.refresh();
    } catch (err) {
      setError('Could not reach the server');
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 380, width: '100%' }}>
      <div>
        <label style={{ fontFamily: SANS, fontSize: 13, color: C.text2, fontWeight: 500, display: 'block', marginBottom: 6, letterSpacing: '-0.005em' }}>
          Email
        </label>
        <input
          type="email"
          autoFocus
          required
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="you@company.com"
          style={{
            width: '100%', padding: '11px 14px', borderRadius: 8,
            border: `1px solid ${C.border}`, background: C.surface,
            fontFamily: SANS, fontSize: 15, color: C.text,
            outline: 'none', letterSpacing: '-0.005em',
          }}
          onFocus={e => (e.target.style.borderColor = C.accent)}
          onBlur={e => (e.target.style.borderColor = C.border)}
        />
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
          <label style={{ fontFamily: SANS, fontSize: 13, color: C.text2, fontWeight: 500, letterSpacing: '-0.005em' }}>
            Password
          </label>
          <Link href="#" style={{ fontFamily: SANS, fontSize: 12, color: C.accent, fontWeight: 500 }}>
            Forgot?
          </Link>
        </div>
        <input
          type="password"
          required
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="••••••••"
          style={{
            width: '100%', padding: '11px 14px', borderRadius: 8,
            border: `1px solid ${C.border}`, background: C.surface,
            fontFamily: SANS, fontSize: 15, color: C.text,
            outline: 'none', letterSpacing: '-0.005em',
          }}
          onFocus={e => (e.target.style.borderColor = C.accent)}
          onBlur={e => (e.target.style.borderColor = C.border)}
        />
      </div>

      {error && (
        <div style={{
          background: C.alertSoft, border: `1px solid #F5D0D0`, borderRadius: 8,
          padding: '10px 14px', fontFamily: SANS, fontSize: 13, color: C.alert,
        }}>
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        style={{
          marginTop: 8, padding: '12px 18px', borderRadius: 8,
          background: C.ink, color: '#FFF', border: 'none', cursor: loading ? 'wait' : 'pointer',
          fontFamily: SANS, fontSize: 15, fontWeight: 500, letterSpacing: '-0.005em',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          opacity: loading ? 0.6 : 1, transition: 'opacity 120ms',
        }}>
        {loading ? 'Signing in…' : <>Sign in <ArrowRight size={16}/></>}
      </button>

      <div style={{
        fontFamily: SANS, fontSize: 13, color: C.text3, textAlign: 'center', marginTop: 8,
      }}>
        Don't have an account yet?{' '}
        <Link href="/signup" style={{ color: C.accent, fontWeight: 500 }}>
          Request access
        </Link>
      </div>
    </form>
  );
}

export default function LoginPage() {
  return <LoginPageInner/>;
}

function LoginPageInner() {
  const isMobile = useIsMobile(900);
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: isMobile ? 'column' : 'row',
      background: C.surface,
    }}>
      {/* Left — brand panel */}
      <div style={{
        flex: isMobile ? '0 0 auto' : 1.1,
        background: C.ink, color: '#FFF',
        padding: isMobile ? '32px 24px' : '40px 56px',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -120, left: -120, width: 480, height: 480,
          background: `radial-gradient(circle, ${C.accent}77 0%, transparent 70%)`,
        }}/>
        <div style={{
          position: 'absolute', bottom: -160, right: -100, width: 400, height: 400,
          background: `radial-gradient(circle, ${C.accent}44 0%, transparent 70%)`,
        }}/>

        <Link href="/" style={{ position: 'relative', textDecoration: 'none' }}>
          <Wordmark size="md" variant="light"/>
        </Link>

        <div style={{ position: 'relative', maxWidth: 460 }}>
          <h2 style={{ fontFamily: SERIF, fontSize: 44, color: '#FFF', fontWeight: 600, letterSpacing: '-0.025em', lineHeight: 1.1, margin: 0 }}>
            Lists are downstream.
          </h2>
          <p style={{ fontFamily: SERIF, fontSize: 17, color: '#C8CAD8', marginTop: 22, lineHeight: 1.6, fontStyle: 'italic' }}>
            Pre-probate. Pre-divorce. Incarceration risk. Old-roof permit cross-refs.
            Six proprietary signals that surface the seller before the lawyer files —
            scored every night, exclusive to your territory.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 36 }}>
            {[
              { icon: BookOpen, label: 'Pre-probate match',    sub: '47 active in Sarasota Co.' },
              { icon: Lock,     label: 'Incarceration risk',   sub: '9 active in Sarasota Co.' },
              { icon: Eye,      label: 'Drive-by computer vision', sub: '156 active in Sarasota Co.' },
            ].map(it => {
              const Icon = it.icon;
              return (
                <div key={it.label} style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 8, background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C3C6F0',
                  }}>
                    <Icon size={16} strokeWidth={1.8}/>
                  </div>
                  <div>
                    <div style={{ fontFamily: SANS, fontSize: 14, color: '#FFF', fontWeight: 500 }}>{it.label}</div>
                    <div style={{ fontFamily: SANS, fontSize: 12, color: '#888BA8', marginTop: 2 }}>{it.sub}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ position: 'relative', fontFamily: SANS, fontSize: 12, color: '#888BA8' }}>
          A Brechin Capital company · © 2026
        </div>
      </div>

      {/* Right — form */}
      <div style={{
        flex: 1,
        padding: isMobile ? '32px 24px 48px' : '40px 56px',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center',
      }}>
        <div style={{ width: '100%', maxWidth: 380, marginBottom: 40 }}>
          <h1 style={{ fontFamily: SERIF, fontSize: 36, color: C.ink, fontWeight: 600, letterSpacing: '-0.025em', margin: 0, lineHeight: 1.1 }}>
            Welcome back.
          </h1>
          <p style={{ fontFamily: SANS, fontSize: 15, color: C.text2, marginTop: 12 }}>
            Sign in to see today's leads in your market.
          </p>
        </div>
        <Suspense fallback={null}>
          <LoginForm/>
        </Suspense>
      </div>
    </div>
  );
}

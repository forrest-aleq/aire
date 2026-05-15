import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const email = (body?.email || '').trim();
  const password = (body?.password || '').trim();

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
  }

  // Mock auth — any non-empty credentials work.
  // Replace with real auth (NextAuth, Clerk, Supabase, your own) for production.
  const res = NextResponse.json({ ok: true, email });
  res.cookies.set('aire-session', email, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 30, // 30 days
  });
  return res;
}

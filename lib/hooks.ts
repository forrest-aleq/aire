'use client';

import { useEffect, useState } from 'react';

export function useIsMobile(breakpoint = 720): boolean {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, [breakpoint]);
  return isMobile;
}

export function useRelativeTime(ts: number | null): string {
  const [now, setNow] = useState<number>(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);
  if (!ts) return '';
  const diffMs = now - ts;
  const sec = Math.max(0, Math.floor(diffMs / 1000));
  if (sec < 45)          return 'just now';
  if (sec < 90)          return '1 min ago';
  const min = Math.floor(sec / 60);
  if (min < 60)          return `${min} min ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24)           return `${hr} hr ago`;
  const day = Math.floor(hr / 24);
  if (day < 7)           return `${day} day${day === 1 ? '' : 's'} ago`;
  return new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

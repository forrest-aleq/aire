'use client';

import React from 'react';
import type { Lead } from '@/lib/data';

export function House({ lead }: { lead: Lead }) {
  const w = 280, h = 200;
  const vacant   = lead.situations.includes('vacant') || lead.situations.includes('vacant-damaged');
  const damaged  = lead.situations.includes('vacant-damaged');
  const overgrown = lead.situations.includes('code-issues') || lead.situations.includes('vacant-damaged');
  const oldRoof  = lead.situations.includes('old-roof');

  const sky    = '#F4F4F5';
  const grass  = overgrown ? '#9CA888' : '#B8C5A6';
  const wall   = vacant ? '#D8D3CC' : '#E2DDD2';
  const roof   = damaged ? '#3A3A3A' : oldRoof ? '#6B5944' : '#4A4036';

  // Deterministic "random" grass blades — uses index so SSR/CSR match.
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', height: '100%', display:'block' }}>
      <rect x="0" y="0" width={w} height={h*0.7} fill={sky}/>
      <rect x="0" y={h*0.7} width={w} height={h*0.3} fill={grass}/>
      {overgrown && Array.from({length: 30}).map((_, i) => (
        <line key={i} x1={i * w/30} y1={h*0.78} x2={i * w/30 + 1} y2={h*0.7} stroke="#7A8A65" strokeWidth="0.6"/>
      ))}
      <circle cx={w*0.1} cy={h*0.55} r={h*0.13} fill="#5A6B4F"/>
      <circle cx={w*0.92} cy={h*0.5} r={h*0.16} fill="#5A6B4F"/>
      <rect x={w*0.3} y={h*0.42} width={w*0.4} height={h*0.32} fill={wall} stroke="rgba(0,0,0,0.08)"/>
      <polygon points={`${w*0.27},${h*0.42} ${w*0.5},${h*0.22} ${w*0.73},${h*0.42}`} fill={roof}/>
      {damaged && <polygon points={`${w*0.35},${h*0.34} ${w*0.5},${h*0.25} ${w*0.55},${h*0.34}`} fill="#2E4661"/>}
      <rect x={w*0.46} y={h*0.55} width={w*0.08} height={h*0.19} fill={vacant ? '#3D332A' : '#594632'}/>
      <rect x={w*0.34} y={h*0.5} width={w*0.07} height={h*0.08} fill={vacant ? '#1F1F1F' : '#A8C5D8'} stroke="rgba(0,0,0,0.15)"/>
      <rect x={w*0.59} y={h*0.5} width={w*0.07} height={h*0.08} fill={vacant ? '#1F1F1F' : '#A8C5D8'} stroke="rgba(0,0,0,0.15)"/>
      {damaged && <line x1={w*0.32} y1={h*0.45} x2={w*0.36} y2={h*0.72} stroke="#2E2620" strokeWidth="1.5"/>}
    </svg>
  );
}

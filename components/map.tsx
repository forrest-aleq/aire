'use client';

import React from 'react';
import { C, SANS } from '@/lib/tokens';
import type { Lead } from '@/lib/data';

export function Map({ leads, selectedId, onSelect, height = 460 }: {
  leads: Lead[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  height?: number;
}) {
  const streets = [
    { d: 'M0,30 Q40,28 100,32' },
    { d: 'M0,72 Q50,75 100,70' },
    { d: 'M22,0 Q24,50 26,100' },
    { d: 'M58,0 Q56,50 60,100' },
    { d: 'M82,0 Q80,50 78,100' },
    { d: 'M0,52 Q50,50 100,54' },
    { d: 'M0,90 Q50,88 100,92' },
  ];

  return (
    <div style={{
      width: '100%', height,
      background: C.panel,
      border: `1px solid ${C.border}`, borderRadius: 12,
      position:'relative', overflow:'hidden',
    }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width:'100%', height:'100%', display:'block' }}>
        <defs>
          <pattern id="mapGrid" width="2.5" height="2.5" patternUnits="userSpaceOnUse">
            <path d="M 2.5 0 L 0 0 0 2.5" fill="none" stroke={C.borderSoft} strokeWidth="0.08"/>
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#mapGrid)"/>

        {/* water */}
        <path d="M 78,0 Q 90,30 100,42 L 100,0 Z" fill="#E9EFF1"/>

        {/* streets */}
        {streets.map((s, i) => (
          <path key={i} d={s.d} fill="none" stroke={C.border} strokeWidth="0.45" opacity="0.85"/>
        ))}

        {/* pins */}
        {leads.map(l => {
          const isSel = l.id === selectedId;
          const isHigh = l.score >= 85;
          const fill = isHigh ? C.accent : '#3F3F46';
          return (
            <g key={l.id} style={{ cursor:'pointer' }} onClick={() => onSelect(l.id)}>
              {isSel && <circle cx={l.coord.x} cy={l.coord.y} r="5" fill={fill} opacity="0.15"/>}
              <circle cx={l.coord.x} cy={l.coord.y} r={isSel ? 2.4 : 1.9}
                      fill={fill} stroke="#FFF" strokeWidth="0.4"/>
              <text x={l.coord.x + 3} y={l.coord.y + 0.5}
                    fontSize="2.2" fill={C.ink} fontFamily={SANS} fontWeight="600"
                    letterSpacing="-0.02em">
                {l.score}
              </text>
            </g>
          );
        })}
      </svg>

      <div style={{
        position:'absolute', bottom: 14, left: 14,
        background: C.surface, border:`1px solid ${C.border}`, borderRadius: 8,
        padding: '8px 12px', fontFamily: SANS, fontSize: 12, color: C.text2,
        display:'flex', alignItems:'center', gap: 12,
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
          <span style={{ width:8, height:8, borderRadius:'50%', background: C.accent }}/>
          <span>Best leads</span>
        </div>
        <span style={{ width: 1, height: 12, background: C.border }}/>
        <div style={{ display:'flex', alignItems:'center', gap:6 }}>
          <span style={{ width:8, height:8, borderRadius:'50%', background:'#3F3F46' }}/>
          <span>Good leads</span>
        </div>
      </div>

      <div style={{
        position:'absolute', bottom: 14, right: 14,
        background: C.surface, border:`1px solid ${C.border}`, borderRadius: 8,
        padding: '8px 12px', fontFamily: SANS, fontSize: 12, color: C.text2,
      }}>
        Venice · Sarasota County
      </div>
    </div>
  );
}

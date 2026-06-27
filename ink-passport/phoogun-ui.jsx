// ============================================================
// PHOOGUN INK PASSPORT — shared UI primitives
// ============================================================
const { useState, useMemo, useEffect } = React;

// --- Minimal stroke icon set (24x24, currentColor) ---
const ICON_PATHS = {
  grid: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
  heart: 'M19 14c1.49-1.46 3-3.21 3-5.5A4.5 4.5 0 0 0 12 5.5 4.5 4.5 0 0 0 2 8.5c0 2.29 1.51 4.04 3 5.5l7 7z',
  pass: 'M3 5h18v14H3zM3 10h18M7 15h5',
  calendar: 'M3 5h18v16H3zM3 9h18M8 3v4M16 3v4',
  check: 'M20 6 9 17l-5-5',
  arrowRight: 'M5 12h14M13 5l7 7-7 7',
  arrowLeft: 'M19 12H5M11 19l-7-7 7-7',
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z',
  droplet: 'M12 3s6 6 6 10a6 6 0 0 1-12 0c0-4 6-10 6-10z',
  sun: 'M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10zM12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4',
  ban: 'M5.6 5.6a9 9 0 1 0 12.8 12.8A9 9 0 0 0 5.6 5.6zM5.6 5.6l12.8 12.8',
  clock: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2',
  star: 'M12 3l2.9 5.9 6.5.9-4.7 4.6 1.1 6.5L12 17.8 6.2 21l1.1-6.5L2.6 9.8l6.5-.9z',
  gift: 'M20 12v9H4v-9M2 7h20v5H2zM12 22V7M12 7S11 3 8 3 5 7 8 7M12 7s1-4 4-4 3 4 0 4',
  spark: 'M12 2v6M12 16v6M2 12h6M16 12h6M5 5l3 3M16 16l3 3M19 5l-3 3M8 16l-3 3',
  logout: 'M9 21H4V3h5M16 17l5-5-5-5M21 12H9',
  flame: 'M12 22c4 0 7-2.7 7-7 0-4-3-6-3-9 0 2-2 3-3 4 0-3-2-5-3-7-1 4-5 5-5 11 0 4.3 3 8 7 8z',
  bell: 'M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0',
  needle: 'M3 21l7-7M14 4l6 6-9 2-3-3z',
  map: 'M9 3 3 6v15l6-3 6 3 6-3V3l-6 3-6-3zM9 3v15M15 6v15',
};
function Icon({ name, className = 'w-5 h-5', stroke = 2 }) {
  const d = ICON_PATHS[name] || ICON_PATHS.grid;
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke}
      strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {d.split('M').filter(Boolean).map((seg, i) => <path key={i} d={'M' + seg} />)}
    </svg>
  );
}

// --- tiny helpers ---
const tx = (lang, th, en) => (lang === 'TH' ? th : en);

// Mono micro-label
function Micro({ children, className = '' }) {
  return (
    <span className={`font-mono text-[10px] tracking-[0.2em] uppercase text-gray-500 ${className}`}>
      {children}
    </span>
  );
}

// Section heading with crimson tick
function SectionHead({ kicker, title, sub }) {
  return (
    <div className="space-y-1">
      {kicker && <Micro className="text-crimson/80">{kicker}</Micro>}
      <h2 className="font-heading text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2.5">
        <span className="w-2.5 h-2.5 bg-crimson rounded-sm shrink-0" />
        {title}
      </h2>
      {sub && <p className="text-gray-500 text-xs font-mono mt-1">{sub}</p>}
    </div>
  );
}

// Card shell
function Panel({ children, className = '', glow = false }) {
  return (
    <div className={`relative bg-[#131313] border border-[#222] rounded-2xl ${glow ? 'glow-hover' : ''} ${className}`}>
      {children}
    </div>
  );
}

// Progress ring (SVG circle — allowed primitive)
function Ring({ value, size = 132, stroke = 9, children }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - Math.max(0, Math.min(1, value)));
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#222" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--color-crimson)"
          strokeWidth={stroke} strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s cubic-bezier(.4,0,.2,1)' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {children}
      </div>
    </div>
  );
}

function StarRow({ n = 5, className = 'w-3.5 h-3.5' }) {
  return (
    <div className="flex gap-0.5 text-crimson">
      {Array.from({ length: 5 }).map((_, i) => (
        <Icon key={i} name="star" className={`${className} ${i < n ? 'fill-crimson' : 'opacity-25'}`} stroke={1.5} />
      ))}
    </div>
  );
}

Object.assign(window, { Icon, tx, Micro, SectionHead, Panel, Ring, StarRow });

// ============================================================
// PHOOGUN TATTOO — Shared UI primitives
// ============================================================
const { useState, useEffect, useRef, useMemo, useCallback } = React;

// Icon paths (24x24, stroke)
const ICONS = {
  grid: 'M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z',
  image: 'M3 3h18v18H3zM3 14l5-5 4 4 3-3 5 5',
  folder: 'M3 7h4l2-2h12v14H3zM3 11h18',
  tag: 'M12 2l9 9-7 7L5 9V2h7zM9 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2',
  star: 'M12 2l2.9 6 6.6.9-4.8 4.6 1.1 6.5L12 17l-5.8 3 1.1-6.5L2.5 9l6.6-.9z',
  check: 'M20 6 9 17l-5-5',
  x: 'M18 6 6 18M6 6l12 12',
  plus: 'M12 5v14M5 12h14',
  edit: 'M11 4H4v16h16v-7M18.5 2.5a2.1 2.1 0 0 1 3 3L12 15l-4 1 1-4z',
  trash: 'M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6',
  eye: 'M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6',
  heart: 'M19 14c1.5-1.5 3-3.2 3-5.5A4.5 4.5 0 0 0 12 5a4.5 4.5 0 0 0-10 3.5c0 2.3 1.5 4 3 5.5l7 7z',
  settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 0 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 0 1-2.8-2.8l.1-.1A1.6 1.6 0 0 0 4.7 15a1.6 1.6 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 0 1 2.8-2.8l.1.1A1.6 1.6 0 0 0 9 4.7a1.6 1.6 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 0 1 2.8 2.8l-.1.1A1.6 1.6 0 0 0 19.4 15z',
  bar: 'M18 20V10M12 20V4M6 20v-6',
  map: 'M9 3 3 6v15l6-3 6 3 6-3V3l-6 3-6-3zM9 3v15M15 6v15',
  link: 'M10 13a5 5 0 0 0 7.5.7l3-3a5 5 0 0 0-7-7L12 5',
  phone: 'M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.1-8.7A2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7 12.8 12.8 0 0 0 .7 2.8 2 2 0 0 1-.5 2.1l-1.3 1.3a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5 12.8 12.8 0 0 0 2.8.7A2 2 0 0 1 22 16.9z',
  arrow_l: 'M15 18l-6-6 6-6',
  arrow_r: 'M9 18l6-6-6-6',
  arrow_up: 'M18 15l-6-6-6 6',
  logout: 'M9 21H4V3h5M16 17l5-5-5-5M21 12H9',
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z',
  promote: 'M13 2L3 14h9l-1 8 10-12h-9z',
  fb: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z',
  ig: 'M16 3H8a5 5 0 0 0-5 5v8a5 5 0 0 0 5 5h8a5 5 0 0 0 5-5V8a5 5 0 0 0-5-5zM12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8zm4.5-1.5a1 1 0 1 1 0 2 1 1 0 0 1 0-2',
  tt: 'M19.6 3a3 3 0 0 1-2.1-.8 3 3 0 0 1-.9-2.2h-2.5v13a1.8 1.8 0 0 1-1.8 1.8 1.8 1.8 0 0 1-1.8-1.8 1.8 1.8 0 0 1 1.8-1.8c.2 0 .4 0 .5.1V9.5c-.2 0-.4 0-.5 0a4.3 4.3 0 0 0-4.3 4.3 4.3 4.3 0 0 0 4.3 4.3 4.3 4.3 0 0 0 4.3-4.3V7.3a7.5 7.5 0 0 0 4.5 1.5V6.3A3 3 0 0 1 19.6 3z',
  line: 'M12 2C6.5 2 2 5.9 2 10.7c0 4.7 4.5 8.7 10 8.7.5 0 1 0 1.4-.1l4.2 2.6-.9-3.5C19.6 16.5 22 13.8 22 10.7 22 5.9 17.5 2 12 2z',
  tw: 'M23 3a10.9 10.9 0 0 1-3.1.9 4.5 4.5 0 0 0 2-2.5 9 9 0 0 1-2.9 1.1A4.5 4.5 0 0 0 11.5 7a12.8 12.8 0 0 1-9.3-4.7 4.5 4.5 0 0 0 1.4 6A4.5 4.5 0 0 1 1.6 8v.1a4.5 4.5 0 0 0 3.6 4.4 4.5 4.5 0 0 1-2 .1 4.5 4.5 0 0 0 4.2 3.1A9 9 0 0 1 1 19.5a12.8 12.8 0 0 0 6.9 2c8.3 0 12.8-6.9 12.8-12.8v-.6A9.2 9.2 0 0 0 23 3z',
};

function Icon({ name, className = 'w-5 h-5', stroke = 2 }) {
  const d = ICONS[name] || ICONS.grid;
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke}
      strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      {d.split('M').filter(Boolean).map((seg, i) => <path key={i} d={'M' + seg} />)}
    </svg>
  );
}

const tx = (lang, th, en) => lang === 'TH' ? th : en;

function Micro({ children, className = '' }) {
  return <span className={`font-mono text-[10px] tracking-[0.2em] uppercase ${className}`}>{children}</span>;
}

function StarRow({ n = 5, size = 'w-3.5 h-3.5' }) {
  return (
    <span className="flex gap-0.5 text-crimson">
      {[1,2,3,4,5].map(i => (
        <Icon key={i} name="star" className={`${size} ${i <= n ? 'fill-crimson' : 'opacity-20'}`} stroke={1} />
      ))}
    </span>
  );
}

function Badge({ children, tone = 'gray' }) {
  const cls = { gray: 'bg-[#1a1a1a] border-[#2a2a2a] text-gray-400', crimson: 'bg-crimson/10 border-crimson/30 text-crimson', green: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400', amber: 'bg-amber-500/10 border-amber-500/30 text-amber-400' };
  return <span className={`inline-flex items-center px-2 py-0.5 rounded-full border font-mono text-[9px] tracking-widest uppercase ${cls[tone]}`}>{children}</span>;
}

function Panel({ children, className = '' }) {
  return <div className={`bg-[#111] border border-[#222] rounded-2xl ${className}`}>{children}</div>;
}

function Btn({ children, onClick, variant = 'primary', size = 'md', className = '', disabled = false, type = 'button' }) {
  const v = {
    primary: 'bg-crimson hover:bg-red-600 text-white shadow-[0_0_15px_rgba(230,25,46,0.3)]',
    outline: 'bg-transparent border border-[#333] hover:border-crimson text-gray-300 hover:text-white',
    ghost: 'bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white',
    danger: 'bg-rose-500/10 border border-rose-500/30 text-rose-400 hover:bg-rose-500/20',
  };
  const s = { sm: 'px-3 py-1.5 text-[10px]', md: 'px-5 py-2.5 text-xs', lg: 'px-7 py-3.5 text-sm' };
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={`font-heading font-bold tracking-widest uppercase rounded-full transition cursor-pointer flex items-center gap-2 ${v[variant]} ${s[size]} ${disabled ? 'opacity-40 cursor-not-allowed' : ''} ${className}`}>
      {children}
    </button>
  );
}

function Input({ label, value, onChange, placeholder = '', type = 'text', mono = false }) {
  return (
    <div className="space-y-1.5">
      {label && <Micro className="block text-gray-500">{label}</Micro>}
      <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className={`w-full bg-black/60 border border-[#2a2a2a] focus:border-crimson/50 outline-none rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 transition ${mono ? 'font-mono' : 'font-sans'}`} />
    </div>
  );
}

function Textarea({ label, value, onChange, placeholder = '', rows = 3 }) {
  return (
    <div className="space-y-1.5">
      {label && <Micro className="block text-gray-500">{label}</Micro>}
      <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
        className="w-full bg-black/60 border border-[#2a2a2a] focus:border-crimson/50 outline-none rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 transition resize-none font-sans" />
    </div>
  );
}

// Toast hook
function useToast() {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((title, msg, type = 'info') => {
    const id = `t${Date.now()}`;
    setToasts(p => [...p, { id, title, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000);
  }, []);
  const dismiss = useCallback(id => setToasts(p => p.filter(t => t.id !== id)), []);
  return { toasts, push, dismiss };
}

function ToastStack({ toasts, dismiss }) {
  const colors = { success: 'border-emerald-500/30 text-emerald-400', error: 'border-rose-500/30 text-rose-400', info: 'border-sky-500/30 text-sky-400', warning: 'border-amber-500/30 text-amber-400' };
  return (
    <div className="fixed bottom-20 sm:bottom-5 right-3 sm:right-5 z-[100] flex flex-col gap-2 w-[calc(100vw-1.5rem)] sm:max-w-sm pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className={`flex gap-3 p-4 rounded-2xl border bg-neutral-950/95 backdrop-blur shadow-xl pointer-events-auto ${colors[t.type]}`}>
          <div className="flex-1">
            <p className="font-heading font-black text-xs uppercase tracking-wider text-white">{t.title}</p>
            <p className="font-sans text-[11px] text-gray-400 mt-0.5 leading-relaxed">{t.msg}</p>
          </div>
          <button onClick={() => dismiss(t.id)} className="text-gray-600 hover:text-white transition cursor-pointer shrink-0">✕</button>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, { Icon, tx, Micro, StarRow, Badge, Panel, Btn, Input, Textarea, useToast, ToastStack });

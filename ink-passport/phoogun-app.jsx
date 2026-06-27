// ============================================================
// PHOOGUN INK PASSPORT — App shell (nav, lang, toasts, routing)
// ============================================================
function App() {
  const { MEMBER } = window.PHG;
  const [lang, setLang] = useState(() => localStorage.getItem('phg_lang') || 'TH');
  const [tab, setTab] = useState(() => localStorage.getItem('phg_tab') || 'dash');
  const [toasts, setToasts] = useState([]);

  useEffect(() => { localStorage.setItem('phg_lang', lang); }, [lang]);
  useEffect(() => { localStorage.setItem('phg_tab', tab); }, [tab]);

  const toast = (title, message, type = 'info') => {
    const id = `t-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    setToasts(p => [...p, { id, title, message, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4200);
  };

  const go = (t) => { setTab(t); window.scrollTo({ top: 0, behavior: 'smooth' }); };

  const NAV = [
    { key: 'dash', icon: 'grid', th: 'หน้าหลัก', en: 'Dashboard' },
    { key: 'aftercare', icon: 'droplet', th: 'การดูแล', en: 'Aftercare' },
    { key: 'inkpass', icon: 'flame', th: 'อิงค์ พาส', en: 'Ink Pass' },
    { key: 'bookings', icon: 'calendar', th: 'การจอง', en: 'Bookings' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* ===== Top bar ===== */}
      <header className="sticky top-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#1a1a1a]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-tr-md rounded-bl-md bg-crimson flex items-center justify-center font-heading text-lg font-bold text-white shadow-[0_0_12px_rgba(230,25,46,0.5)]">P</span>
            <div className="leading-none">
              <div className="font-heading tracking-[0.2em] text-base font-bold text-white uppercase">Phoogun</div>
              <div className="font-mono text-[8px] tracking-[0.3em] text-crimson uppercase mt-0.5">Ink Passport</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* member chip */}
            <div className="hidden sm:flex items-center gap-2.5 bg-[#131313] border border-[#222] rounded-full pl-1 pr-3.5 py-1">
              <img src={MEMBER.avatar} alt="" referrerPolicy="no-referrer" className="w-7 h-7 rounded-full object-cover border border-crimson/30" />
              <div className="leading-none">
                <div className="text-[11px] text-white font-semibold">{tx(lang, MEMBER.nameTh, MEMBER.nameEn).split(' ')[0]}</div>
                <div className="font-mono text-[8px] text-gray-500 tracking-widest">#{MEMBER.id}</div>
              </div>
            </div>
            {/* lang toggle */}
            <div className="bg-[#1a1a1a] rounded px-1.5 py-1 flex gap-1.5 text-xs font-mono font-bold text-gray-400">
              {['TH', 'EN'].map(L => (
                <button key={L} onClick={() => setLang(L)}
                  className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${lang === L ? 'bg-crimson text-white font-black' : 'hover:text-white'}`}>{L}</button>
              ))}
            </div>
            {/* back to site */}
            <button onClick={() => toast(tx(lang, 'กลับสู่หน้าเว็บหลัก', 'Back to main site'), tx(lang, 'ออกจากพื้นที่สมาชิกกลับสู่แกลเลอรีสาธารณะ', 'Leaving the member area for the public gallery'), 'info')}
              className="hidden md:flex items-center gap-1.5 bg-black text-gray-300 font-heading text-[11px] tracking-wider border border-[#333] hover:border-crimson hover:text-white px-4 py-2 rounded-full cursor-pointer transition">
              <Icon name="logout" className="w-3.5 h-3.5 text-crimson" /> {tx(lang, 'ออก', 'Exit')}
            </button>
          </div>
        </div>

        {/* tab nav */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <nav className="flex gap-1 -mb-px overflow-x-auto">
            {NAV.map(n => (
              <button key={n.key} onClick={() => go(n.key)}
                className={`flex items-center gap-2 px-4 py-3 font-heading text-xs tracking-widest uppercase whitespace-nowrap border-b-2 transition cursor-pointer
                  ${tab === n.key ? 'border-crimson text-crimson' : 'border-transparent text-gray-500 hover:text-white'}`}>
                <Icon name={n.icon} className="w-4 h-4" /> {tx(lang, n.th, n.en)}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* marquee */}
      <div className="bg-[#080808] border-b border-[#1a1a1a] py-2.5 overflow-hidden flex select-none">
        <div className="flex gap-8 animate-marquee whitespace-nowrap text-[10px] font-mono font-bold tracking-[0.25em] text-gray-600 uppercase">
          {Array.from({ length: 2 }).map((_, k) => (
            <React.Fragment key={k}>
              <span>• MEMBER LOUNGE</span>
              <span className="text-crimson">• AFTERCARE TRACKER</span>
              <span>• INK PASS REWARDS</span>
              <span className="text-crimson">• PRIORITY BOOKING</span>
              <span>• PHOOGUN TATTOO · BANGKOK</span>
              <span className="text-crimson">• NEO-IREZUMI · CYBER-BLACKWORK</span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* ===== Main ===== */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-20">
        {tab === 'dash' && <Dashboard lang={lang} go={go} toast={toast} />}
        {tab === 'aftercare' && <Aftercare lang={lang} toast={toast} />}
        {tab === 'inkpass' && <InkPass lang={lang} toast={toast} />}
        {tab === 'bookings' && <Bookings lang={lang} toast={toast} />}
      </main>

      {/* footer */}
      <footer className="border-t border-[#1a1a1a] py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <Micro className="text-gray-600">© 2026 Phoogun Tattoo · Ink Passport v1.0</Micro>
          <Micro className="text-gray-700">{tx(lang, 'ศิลปะบนเรือนร่าง · กรุงเทพฯ', 'Body Art Dimension · Bangkok')}</Micro>
        </div>
      </footer>

      {/* ===== Toasts ===== */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        {toasts.map(t => {
          const tones = {
            success: 'border-emerald-500/30', error: 'border-rose-500/30',
            info: 'border-sky-500/30', warning: 'border-amber-500/30',
          };
          const ic = { success: 'check', error: 'ban', info: 'spark', warning: 'bell' };
          const cl = { success: 'text-emerald-400', error: 'text-rose-500', info: 'text-sky-400', warning: 'text-amber-400' };
          return (
            <div key={t.id} className={`flex items-start gap-3 p-4 rounded-2xl border bg-neutral-950/95 backdrop-blur-md shadow-xl pointer-events-auto animate-fadeIn ${tones[t.type]}`}>
              <Icon name={ic[t.type]} className={`w-5 h-5 shrink-0 ${cl[t.type]}`} />
              <div className="flex-1 space-y-0.5">
                <h4 className="text-xs font-black text-white font-heading uppercase tracking-wider">{t.title}</h4>
                <p className="text-[11px] text-gray-400 leading-relaxed">{t.message}</p>
              </div>
              <button onClick={() => setToasts(p => p.filter(x => x.id !== t.id))} className="text-gray-500 hover:text-white transition cursor-pointer shrink-0">✕</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);

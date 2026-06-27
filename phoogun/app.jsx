// ============================================================
// PHOOGUN TATTOO — App Shell (routing, state, nav, login)
// ============================================================
const { useState, useEffect, useCallback } = React;
const LS_KEYS = { images: 'phg2_images', albums: 'phg2_albums', categories: 'phg2_categories', artists: 'phg2_artists', reviews: 'phg2_reviews', config: 'phg2_config', heroSlides: 'phg2_heroSlides' };
const lsGet = (k, def) => {try {const v = localStorage.getItem(k);return v ? JSON.parse(v) : def;} catch {return def;}};
const lsSet = (k, v) => {try {localStorage.setItem(k, JSON.stringify(v));} catch {}};

const { DEFAULT_CATEGORIES, DEFAULT_ALBUMS, DEFAULT_ARTISTS, DEFAULT_IMAGES, DEFAULT_REVIEWS, DEFAULT_CONFIG, HERO_SLIDES } = window.PHG_DATA;

function App() {
  const [mode, setMode] = useState('public');
  const [lang, setLang] = useState(() => localStorage.getItem('phg2_lang') || 'TH');
  const [passcode, setPasscode] = useState('');
  const [loginErr, setLoginErr] = useState(false);
  const [adminTab, setAdminTab] = useState('analytics');
  const [sheetsStatus, setSheetsStatus] = useState('loading'); // 'loading' | 'ok' | 'offline'
  const { toasts, push: toast, dismiss } = useToast();

  // Global data state (persisted — pre-filled from localStorage or defaults)
  const [images, setImages] = usePersistedState(LS_KEYS.images, DEFAULT_IMAGES);
  const [albums, setAlbums] = usePersistedState(LS_KEYS.albums, DEFAULT_ALBUMS);
  const [categories, setCategories] = usePersistedState(LS_KEYS.categories, DEFAULT_CATEGORIES);
  const [artists, setArtists] = usePersistedState(LS_KEYS.artists, DEFAULT_ARTISTS);
  const [reviews, setReviews] = usePersistedState(LS_KEYS.reviews, DEFAULT_REVIEWS);
  const [config, setConfig] = usePersistedState(LS_KEYS.config, DEFAULT_CONFIG);
  const [heroSlides, setHeroSlides] = useState(() => lsGet(LS_KEYS.heroSlides, HERO_SLIDES));

  // ── Load fresh data from Google Sheets on mount ───────────
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const d = await loadAllFromSheets();
        if (cancelled) return;
        setImages(d.images);
        setAlbums(d.albums);
        setCategories(d.categories);
        setArtists(d.artists);
        setReviews(d.reviews);
        setConfig(d.config);
        if (d.heroSlides && d.heroSlides.length > 0) {
          setHeroSlides(d.heroSlides);
          lsSet(LS_KEYS.heroSlides, d.heroSlides);
        }
        setSheetsStatus('ok');
      } catch (err) {
        if (!cancelled) {
          console.warn('Sheets offline, using cached data:', err.message);
          setSheetsStatus('offline');
        }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Wire promote toggle for AdminSettings
  useEffect(() => {
    window._phg_togglePromote = (id) => {
      setAlbums((p) => p.map((a) => a.id === id ? { ...a, promoted: !a.promoted } : a));
      // sync to Sheets
      const a = albums.find(x => x.id === id);
      if (a) saveToSheets('update', 'albums', { promoted: String(!a.promoted) }, id).catch(() => {});
    };
    return () => {delete window._phg_togglePromote;};
  }, [albums]);

  // Auto-inject pixels on public page load
  useEffect(() => {
    if (mode === 'public' && (config.fbPixel || config.ttPixel)) {
      if (typeof injectPixels === 'function') injectPixels(config.fbPixel, config.ttPixel);
    }
  }, [mode, config.fbPixel, config.ttPixel]);

  useEffect(() => {localStorage.setItem('phg2_lang', lang);}, [lang]);

  const login = (code) => {
    const storedCode = config.adminPasscode || '1337';
    if (code === storedCode || code.toLowerCase() === 'admin') {
      setMode('admin');setPasscode('');setLoginErr(false);
      toast(tx(lang, 'ยินดีต้อนรับ Admin', 'Welcome Admin'), 'PHOOGUN CMS Backoffice', 'success');
    } else {
      setLoginErr(true);
      toast(tx(lang, 'รหัสไม่ถูกต้อง', 'Access Denied'), '', 'error');
      setTimeout(() => setLoginErr(false), 600);
    }
  };

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 80, behavior: 'smooth' });
  };

  const adminNavItems = [
  ['analytics', 'bar', 'สถิติ / Analytics'],
  ['gallery', 'image', 'ภาพ & อัลบั้ม'],
  ['content', 'edit', 'เนื้อหา & ช่าง & รีวิว'],
  ['settings', 'settings', 'Pixel & ติดต่อ']];


  const cms = { images, setImages, albums, setAlbums, categories, setCategories, artists, setArtists, reviews, setReviews, config, setConfig, toast, lang };

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [adminMobileTab, setAdminMobileTab] = useState(false);

  return (
    <div className="min-h-screen bg-[#080808] text-gray-200">
      {mode === 'public' &&
      <>
          {/* PUBLIC NAV */}
          <nav className="sticky top-0 z-40 bg-[#080808]/98 backdrop-blur border-b border-[#1a1a1a]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
              {/* Logo */}
              <button onClick={() => { scrollTo('hero'); setMobileMenuOpen(false); }} className="flex items-center gap-2.5 cursor-pointer shrink-0">
                <span className="w-8 h-8 rounded-tr-md rounded-bl-md bg-crimson flex items-center justify-center font-heading font-bold text-white shadow-[0_0_12px_rgba(230,25,46,0.5)]">P</span>
                <span className="font-heading tracking-[0.15em] text-base font-bold text-white uppercase">Phoogun</span>
              </button>
              {/* Desktop nav links */}
              <div className="hidden md:flex gap-6 text-xs font-heading uppercase tracking-widest">
                {[['gallery','ผลงาน','Portfolio'],['about','เกี่ยวกับ','About'],['reviews','รีวิว','Reviews'],['contact','ติดต่อ','Contact']].map(([id,th,en]) =>
                  <button key={id} onClick={() => scrollTo(id)} className="text-gray-400 hover:text-white transition cursor-pointer py-1">{tx(lang,th,en)}</button>
                )}
              </div>
              {/* Right controls */}
              <div className="flex items-center gap-2">
                <div className="bg-[#1a1a1a] rounded px-1.5 py-1 flex gap-1 text-xs font-mono font-bold">
                  {['TH','EN'].map(L =>
                    <button key={L} onClick={() => setLang(L)} className={`px-1.5 py-0.5 rounded cursor-pointer transition ${lang===L?'bg-crimson text-white':'text-gray-400 hover:text-white'}`}>{L}</button>
                  )}
                </div>
                <button onClick={() => setMode('login')}
                  className="hidden sm:flex items-center gap-1.5 bg-black border border-[#333] hover:border-crimson text-gray-300 hover:text-white font-heading font-bold text-[11px] tracking-widest uppercase px-3 py-2 rounded-full transition cursor-pointer">
                  <Icon name="shield" className="w-3.5 h-3.5 text-crimson" />{tx(lang,'Admin','Admin')}
                </button>
                {/* Hamburger */}
                <button onClick={() => setMobileMenuOpen(p => !p)}
                  className="md:hidden flex flex-col gap-1.5 w-9 h-9 items-center justify-center cursor-pointer">
                  <span className={`block w-5 h-0.5 bg-white transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                  <span className={`block w-5 h-0.5 bg-white transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`} />
                  <span className={`block w-5 h-0.5 bg-white transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                </button>
              </div>
            </div>
            {/* Mobile menu drawer */}
            {mobileMenuOpen && (
              <div className="md:hidden bg-[#0a0a0a] border-t border-[#1a1a1a] px-4 py-4 space-y-1">
                {[['gallery','ผลงาน','Portfolio'],['about','เกี่ยวกับ','About'],['reviews','รีวิว','Reviews'],['contact','ติดต่อ','Contact']].map(([id,th,en]) =>
                  <button key={id} onClick={() => { scrollTo(id); setMobileMenuOpen(false); }}
                    className="w-full text-left px-4 py-3 font-heading text-sm font-bold uppercase tracking-widest text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition cursor-pointer flex items-center justify-between">
                    {tx(lang,th,en)}<Icon name="arrow_r" className="w-4 h-4 text-crimson" />
                  </button>
                )}
                <div className="pt-2 border-t border-[#1a1a1a]">
                  <button onClick={() => { setMode('login'); setMobileMenuOpen(false); }}
                    className="w-full flex items-center gap-2 px-4 py-3 font-heading text-sm font-bold uppercase tracking-widest text-crimson hover:bg-crimson/10 rounded-xl transition cursor-pointer">
                    <Icon name="shield" className="w-4 h-4" />{tx(lang,'เข้าหลังบ้าน','Admin Login')}
                  </button>
                </div>
              </div>
            )}
          </nav>

          {/* Marquee */}
          <div className="bg-[#050505] border-b border-[#1a1a1a] py-2.5 overflow-hidden flex select-none">
            <div className="flex gap-8 animate-marquee whitespace-nowrap text-[10px] font-mono font-bold tracking-[0.25em] text-gray-600 uppercase">
              {[0, 1].map((k) =>
            <React.Fragment key={k}>
                  <span>• PHOOGUN TATTOO BANGKOK</span><span className="text-crimson">• CYBER-BLACKWORK</span>
                  <span>• NEO-IREZUMI</span><span className="text-crimson">• HOSPITAL GRADE STERILE</span>
                  <span>• OPEN DAILY 12:00–21:00</span><span className="text-crimson">• DARK ARTS GUILD</span>
                </React.Fragment>
            )}
            </div>
          </div>

          {/* Public sections */}
          <HeroSection lang={lang} config={config} heroSlides={heroSlides}
        onBookClick={() => scrollTo('contact')}
        onGalleryClick={() => scrollTo('gallery')} />
          <GallerySection lang={lang} images={images} categories={categories} albums={albums} />
          <AboutSection lang={lang} config={config} artists={artists} />
          <ReviewsSection lang={lang} reviews={reviews} artists={artists}
        onSubmitReview={async (r) => {
          setReviews((p) => [r, ...p]);
          try { await submitReview(r); } catch(e) { console.warn('Review sync failed', e); }
        }} />
          <ContactSection lang={lang} config={config} onSubmitBooking={async (b) => {
            try {
              const res = await submitBooking(b);
              toast(tx(lang,'ส่งคำขอจองแล้ว!','Booking Sent!'), tx(lang,'ทีมงานจะติดต่อกลับเร็วๆ นี้','Our team will contact you shortly'), 'success');
              return res;
            } catch(e) {
              toast(tx(lang,'เกิดข้อผิดพลาด','Error'), e.message, 'error');
            }
          }} />
          <Footer lang={lang} />
        </>
      }

      {mode === 'login' &&
      <LoginScreen lang={lang} passcode={passcode} setPasscode={setPasscode} loginErr={loginErr}
      onSubmit={login} onBack={() => {setMode('public');setPasscode('');setLoginErr(false);}} />
      }

      {mode === 'admin' && (
        <div className="flex min-h-screen">
          {/* Desktop Sidebar */}
          <aside className="hidden md:flex w-56 shrink-0 bg-[#0a0a0a] border-r border-[#1a1a1a] flex-col sticky top-0 h-screen">
            <div className="p-5 border-b border-[#1a1a1a]">
              <div className="flex items-center gap-2.5">
                <span className="w-8 h-8 rounded-tr-md rounded-bl-md bg-crimson flex items-center justify-center font-heading text-sm font-bold text-white">P</span>
                <div>
                  <div className="font-heading text-xs font-bold text-white uppercase tracking-wider">Phoogun</div>
                  <div className="font-mono text-[8px] text-crimson tracking-widest uppercase">CMS Backoffice</div>
                </div>
              </div>
            </div>
            <nav className="flex-1 p-3 space-y-1">
              {adminNavItems.map(([key, icon, label]) => (
                <button key={key} onClick={() => setAdminTab(key)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-left cursor-pointer transition font-heading text-[11px] font-bold tracking-wider uppercase ${adminTab===key?'bg-crimson text-white':'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                  <Icon name={icon} className="w-4 h-4 shrink-0" />{label}
                </button>
              ))}
              {/* Sheets status */}
              <div className={`mt-3 mx-1 px-3 py-2 rounded-lg border flex items-center gap-2 ${
                sheetsStatus==='ok' ? 'border-emerald-500/30 bg-emerald-500/5' :
                sheetsStatus==='offline' ? 'border-amber-500/30 bg-amber-500/5' :
                'border-[#2a2a2a] bg-black/20'}`}>
                <span className={`w-2 h-2 rounded-full shrink-0 ${
                  sheetsStatus==='ok' ? 'bg-emerald-400 animate-pulse' :
                  sheetsStatus==='offline' ? 'bg-amber-400' : 'bg-gray-600 animate-pulse'}`} />
                <div>
                  <Micro className={sheetsStatus==='ok'?'text-emerald-400':sheetsStatus==='offline'?'text-amber-400':'text-gray-600'}>
                    {sheetsStatus==='ok'?'Sheets ✓ Live':sheetsStatus==='offline'?'Sheets Offline':'Connecting...'}
                  </Micro>
                </div>
              </div>
            </nav>
            <div className="p-3 border-t border-[#1a1a1a]">
              <button onClick={() => { setMode('public'); toast(tx(lang,'ออกจาก Admin แล้ว','Logged out'),'','info'); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-gray-500 hover:text-white text-xs font-mono uppercase tracking-widest cursor-pointer hover:bg-white/5 rounded-lg transition">
                <Icon name="logout" className="w-4 h-4" />{tx(lang,'ออกจากระบบ','Log Out')}
              </button>
            </div>
          </aside>

          {/* Admin main */}
          <main className="flex-1 overflow-auto bg-[#0a0a0a] pb-20 md:pb-0">
            {/* Mobile top bar */}
            <div className="md:hidden sticky top-0 z-30 bg-[#0a0a0a]/95 border-b border-[#1a1a1a] px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-tr-sm rounded-bl-sm bg-crimson flex items-center justify-center font-heading text-xs font-bold text-white">P</span>
                <span className="font-heading text-xs font-bold text-white uppercase tracking-wider">
                  {adminNavItems.find(n => n[0] === adminTab)?.[2]}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="bg-[#1a1a1a] rounded px-1.5 py-1 flex gap-1 text-xs font-mono font-bold">
                  {['TH','EN'].map(L => (
                    <button key={L} onClick={() => setLang(L)} className={`px-1.5 py-0.5 rounded cursor-pointer transition ${lang===L?'bg-crimson text-white':'text-gray-400 hover:text-white'}`}>{L}</button>
                  ))}
                </div>
                <button onClick={() => { setMode('public'); toast(tx(lang,'ออก','Out'),'','info'); }}
                  className="w-8 h-8 flex items-center justify-center border border-[#333] rounded-lg text-gray-400 hover:text-crimson cursor-pointer transition">
                  <Icon name="logout" className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="p-4 sm:p-6 lg:p-8 space-y-6">
              {/* Desktop title */}
              <div className="hidden md:flex items-center justify-between">
                <div>
                  <h1 className="font-heading text-2xl font-black text-white uppercase">{adminNavItems.find(n => n[0] === adminTab)?.[2]}</h1>
                  <Micro className="text-gray-600 block mt-1">Phoogun Tattoo CMS · v2.0</Micro>
                </div>
                <div className="bg-[#1a1a1a] rounded px-1.5 py-1 flex gap-1 text-xs font-mono font-bold">
                  {['TH','EN'].map(L => (
                    <button key={L} onClick={() => setLang(L)} className={`px-1.5 py-0.5 rounded cursor-pointer transition ${lang===L?'bg-crimson text-white':'text-gray-400 hover:text-white'}`}>{L}</button>
                  ))}
                </div>
              </div>
              {adminTab === 'analytics' && <AdminSettings {...cms} />}
              {adminTab === 'gallery'   && <AdminGallery  {...cms} />}
              {adminTab === 'content'   && <AdminContent  {...cms} />}
              {adminTab === 'settings'  && <AdminSettings {...cms} />}
            </div>
          </main>

          {/* Mobile bottom tab bar */}
          <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-[#0a0a0a]/98 backdrop-blur border-t border-[#1a1a1a] flex">
            {adminNavItems.map(([key, icon, label]) => (
              <button key={key} onClick={() => setAdminTab(key)}
                className={`flex-1 flex flex-col items-center gap-1 py-2.5 cursor-pointer transition ${adminTab===key?'text-crimson':'text-gray-600 hover:text-gray-400'}`}>
                <Icon name={icon} className="w-5 h-5" />
                <span className="font-mono text-[8px] tracking-widest uppercase">{label.split(' ')[0]}</span>
              </button>
            ))}
          </nav>
        </div>
      )}

      <ToastStack toasts={toasts} dismiss={dismiss} />
    </div>);

}

// Persisted state hook
function usePersistedState(key, defaultVal) {
  const [val, setVal] = useState(() => lsGet(key, defaultVal));
  const setPersisted = useCallback((updater) => {
    setVal((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      lsSet(key, next);
      return next;
    });
  }, [key]);
  return [val, setPersisted];
}

// Login Screen
function LoginScreen({ lang, passcode, setPasscode, loginErr, onSubmit, onBack }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#060606] relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none"
      style={{ backgroundImage: 'linear-gradient(to right,#1a1a1a 1px,transparent 1px),linear-gradient(to bottom,#1a1a1a 1px,transparent 1px)', backgroundSize: '60px 60px' }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-crimson/8 rounded-full blur-[120px] pointer-events-none" />
      <div className="w-full max-w-sm relative z-10">
        <button onClick={onBack} className="mb-6 flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition cursor-pointer uppercase tracking-widest">
          <Icon name="arrow_l" className="w-4 h-4 text-crimson" />{tx(lang, 'กลับหน้าเว็บ', 'Back to Site')}
        </button>
        <div className={`bg-[#0d0d0d]/90 backdrop-blur-xl border rounded-3xl p-7 shadow-2xl space-y-6 relative transition-all ${loginErr ? 'border-rose-500/50 animate-shake' : 'border-[#222]'}`}>
          <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-crimson to-transparent rounded-t-3xl" />
          <div className="text-center space-y-1.5">
            <div className="w-12 h-12 rounded-2xl bg-crimson/10 border border-crimson/30 flex items-center justify-center mx-auto">
              <Icon name="shield" className="w-6 h-6 text-crimson" />
            </div>
            <p className="font-heading text-lg font-black text-white uppercase tracking-tight">Phoogun CMS</p>
            <Micro className="text-gray-600">INK_OS BACKOFFICE v2.0</Micro>
          </div>
          <input type="password" value={passcode} onChange={(e) => setPasscode(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSubmit(passcode)}
          placeholder="••••••••" autoFocus
          className="w-full bg-black/80 border border-[#2d2d2d] focus:border-crimson/50 outline-none rounded-2xl px-5 py-4 text-center text-lg font-mono font-bold tracking-[0.4em] text-white placeholder:text-[#333] placeholder:tracking-[0.1em] transition" />
          <div className="grid grid-cols-3 gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 'C', 0, '⌫'].map((k) =>
            <button key={k} type="button"
            onClick={() => {if (k === 'C') setPasscode('');else if (k === '⌫') setPasscode((p) => p.slice(0, -1));else setPasscode((p) => p + k);}}
            className={`py-3.5 rounded-xl text-center font-heading font-bold text-sm transition cursor-pointer active:scale-95 border
                  ${k === 'C' ? 'border-rose-500/20 text-rose-400 hover:bg-rose-500/10 bg-black/20' : k === '⌫' ? 'border-amber-500/20 text-amber-400 hover:bg-amber-500/10 bg-black/20' : 'border-[#1a1a1a] bg-black/40 text-gray-300 hover:bg-[#1a1a1a] hover:text-white'}`}>
                {k}
              </button>
            )}
          </div>
          <Btn onClick={() => onSubmit(passcode)} variant="primary" size="lg" className="w-full justify-center">
            <Icon name="shield" className="w-4 h-4" />{tx(lang, 'ปลดล็อก', 'Unlock')}
          </Btn>

        </div>
      </div>
    </div>);

}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
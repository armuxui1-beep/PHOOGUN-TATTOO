// ============================================================
// SCREEN — My Bookings
// ============================================================
function Bookings({ lang, toast }) {
  const { BOOKINGS } = window.PHG;
  const [tab, setTab] = useState('upcoming');

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <SectionHead
          kicker={tx(lang, 'คิวของฉัน', 'My sessions')}
          title={tx(lang, 'การจองคิว', 'My Bookings')}
          sub={tx(lang, 'คิวที่กำลังจะถึงและประวัติการสักของคุณ', 'Upcoming appointments and your ink history')}
        />
        <button onClick={() => toast(tx(lang, 'เปิดระบบจองคิว', 'Booking desk'), tx(lang, 'เลือกช่าง สไตล์ และเวลาที่สะดวก', 'Pick an artist, style and a time that suits you'), 'info')}
          className="self-start sm:self-auto bg-crimson hover:bg-red-600 text-white font-heading font-bold text-xs tracking-widest uppercase px-6 py-3 rounded-full shadow-[0_0_18px_rgba(230,25,46,0.35)] transition cursor-pointer flex items-center gap-2">
          <Icon name="needle" className="w-4 h-4" /> {tx(lang, 'จองคิวใหม่', 'New booking')}
        </button>
      </div>

      {/* segmented tabs */}
      <div className="inline-flex bg-[#131313] border border-[#222] rounded-full p-1">
        {[['upcoming', 'กำลังจะถึง', 'Upcoming', BOOKINGS.upcoming.length], ['history', 'ประวัติ', 'History', BOOKINGS.history.length]].map(([k, th, en, n]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`px-5 py-2 rounded-full font-mono text-[10px] tracking-widest uppercase transition cursor-pointer
              ${tab === k ? 'bg-crimson text-white' : 'text-gray-400 hover:text-white'}`}>
            {tx(lang, th, en)} · {n}
          </button>
        ))}
      </div>

      {tab === 'upcoming' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {BOOKINGS.upcoming.map(b => {
            const [dd, mon] = b.dateEn.split(' ');
            const day = b.dateEn.split(', ')[0].split(' ')[1];
            return (
              <Panel key={b.id} glow className="overflow-hidden">
                <div className="flex">
                  <div className="relative w-28 shrink-0">
                    <img src={b.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#131313]" />
                  </div>
                  <div className="flex-1 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-crimson/10 border border-crimson/30 flex flex-col items-center justify-center shrink-0">
                          <span className="font-heading text-base font-black text-white leading-none">{day}</span>
                          <span className="font-mono text-[8px] text-crimson tracking-widest">{mon.toUpperCase()}</span>
                        </div>
                        <div>
                          <p className="font-heading text-sm font-bold text-white uppercase">{tx(lang, b.styleTh, b.styleEn)}</p>
                          <p className="font-mono text-[10px] text-gray-500 mt-0.5">{b.time} · {tx(lang, b.artistTh, b.artistEn)}</p>
                        </div>
                      </div>
                      <StatusPill lang={lang} status={b.status} />
                    </div>
                    <p className="text-gray-400 text-xs mt-3 leading-relaxed">{tx(lang, b.sessionTh, b.sessionEn)}</p>
                    <div className="flex items-center gap-2 mt-4">
                      <Micro className="text-gray-600">#{b.id}</Micro>
                      <span className="text-gray-700">·</span>
                      <button onClick={() => toast(tx(lang, 'ส่งคำขอเลื่อนแล้ว', 'Reschedule requested'), tx(lang, 'ทีมงานจะติดต่อยืนยันเวลาใหม่', 'Our team will confirm a new time'), 'info')}
                        className="font-mono text-[10px] tracking-widest uppercase text-crimson hover:text-white transition cursor-pointer">
                        {tx(lang, 'เลื่อนคิว', 'Reschedule')}
                      </button>
                    </div>
                  </div>
                </div>
              </Panel>
            );
          })}
        </div>
      ) : (
        <Panel className="divide-y divide-[#1f1f1f]">
          {BOOKINGS.history.map(b => (
            <div key={b.id} className="flex items-center gap-4 p-4 hover:bg-white/[0.015] transition">
              <div className="w-14 h-14 rounded-xl overflow-hidden border border-[#222] shrink-0">
                <img src={b.image} alt="" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-heading text-sm font-bold text-white uppercase truncate">{tx(lang, b.sessionTh, b.sessionEn)}</p>
                <p className="font-mono text-[10px] text-gray-500 mt-0.5">
                  {tx(lang, b.dateTh, b.dateEn)} · {tx(lang, b.artistTh, b.artistEn)} · {tx(lang, b.styleTh, b.styleEn)}
                </p>
              </div>
              <div className="text-right shrink-0">
                <span className="font-heading text-sm font-black text-emerald-400">+{b.points.toLocaleString()}</span>
                <Micro className="block text-gray-600">{tx(lang, 'แต้ม', 'pts')}</Micro>
              </div>
            </div>
          ))}
        </Panel>
      )}
    </div>
  );
}

function StatusPill({ lang, status }) {
  const map = {
    Confirmed: ['bg-emerald-500/10 border-emerald-500/30 text-emerald-400', tx(lang, 'ยืนยันแล้ว', 'Confirmed')],
    Pending: ['bg-amber-500/10 border-amber-500/30 text-amber-400', tx(lang, 'รอยืนยัน', 'Pending')],
  };
  const [cls, label] = map[status] || map.Pending;
  return (
    <span className={`shrink-0 font-mono text-[9px] tracking-widest uppercase px-2.5 py-1 rounded-full border ${cls}`}>{label}</span>
  );
}

Object.assign(window, { Bookings });

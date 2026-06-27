// ============================================================
// SCREEN — Member Dashboard
// ============================================================
function tierFor(points) {
  const T = window.PHG.TIERS;
  let cur = T[0], next = null;
  for (let i = 0; i < T.length; i++) {
    if (points >= T[i].min) { cur = T[i]; next = T[i + 1] || null; }
  }
  return { cur, next };
}

function Dashboard({ lang, go, toast }) {
  const { MEMBER, HEALING, BOOKINGS } = window.PHG;
  const { cur, next } = tierFor(MEMBER.points);
  const toNext = next ? next.min - MEMBER.points : 0;
  const tierPct = next ? (MEMBER.points - cur.min) / (next.min - cur.min) : 1;
  const nextApt = BOOKINGS.upcoming[0];
  const healPct = HEALING.dayOf / HEALING.totalDays;
  const tasksDone = HEALING.todayTasks.filter(t => t.done).length;

  // days until next appointment (from "today" = inkedOn-ish reference 2026-06-15)
  const today = new Date('2026-06-15');
  const aptDate = new Date('2026-06-28');
  const daysToApt = Math.round((aptDate - today) / 86400000);

  return (
    <div className="space-y-8 animate-fadeIn">

      {/* Welcome banner */}
      <Panel className="overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-crimson to-transparent" />
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{ backgroundImage: `url('${HEALING.image}')`, backgroundSize: 'cover', backgroundPosition: 'center 30%', filter: 'grayscale(1)' }} />
        <div className="relative p-6 sm:p-8 flex flex-col lg:flex-row gap-8 lg:items-center justify-between">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border border-crimson/30 shadow-[0_0_18px_rgba(230,25,46,0.25)] shrink-0">
              <img src={MEMBER.avatar} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
            </div>
            <div className="space-y-1.5">
              <Micro>{tx(lang, 'ยินดีต้อนรับกลับ', 'Welcome back')} · #{MEMBER.id}</Micro>
              <h1 className="font-heading text-2xl sm:text-3xl font-black text-white uppercase tracking-tight leading-none">
                {tx(lang, MEMBER.nameTh, MEMBER.nameEn)}
                <span className="text-crimson"> “{MEMBER.handle}”</span>
              </h1>
              <div className="flex items-center gap-2 pt-1">
                <span className="inline-flex items-center gap-1.5 bg-crimson/10 border border-crimson/30 text-crimson font-mono text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-full">
                  <Icon name="flame" className="w-3 h-3" stroke={2} /> {tx(lang, cur.th, cur.en)} {tx(lang, 'ทีเออร์', 'Tier')}
                </span>
                <Micro className="text-gray-600">{tx(lang, 'สมาชิกตั้งแต่', 'Member since')} {MEMBER.since}</Micro>
              </div>
            </div>
          </div>

          {/* points + tier progress */}
          <div className="lg:w-[340px] w-full bg-black/40 border border-[#222] rounded-2xl p-5 space-y-3">
            <div className="flex items-end justify-between">
              <div>
                <Micro>{tx(lang, 'แต้มสะสม', 'Ink Points')}</Micro>
                <div className="font-heading text-4xl font-black text-white leading-none mt-1">
                  {MEMBER.points.toLocaleString()}
                </div>
              </div>
              <button onClick={() => go('inkpass')}
                className="text-crimson hover:text-white transition font-mono text-[10px] tracking-widest uppercase flex items-center gap-1 cursor-pointer">
                {tx(lang, 'ใช้แต้ม', 'Redeem')} <Icon name="arrowRight" className="w-3 h-3" />
              </button>
            </div>
            <div>
              <div className="h-1.5 bg-[#1f1f1f] rounded-full overflow-hidden">
                <div className="h-full bg-crimson rounded-full transition-all duration-700" style={{ width: `${tierPct * 100}%` }} />
              </div>
              <p className="font-mono text-[10px] text-gray-500 mt-2">
                {next
                  ? tx(lang, `อีก ${toNext.toLocaleString()} แต้มสู่ระดับ ${next.th}`, `${toNext.toLocaleString()} pts to ${next.en}`)
                  : tx(lang, 'ระดับสูงสุดแล้ว', 'Top tier reached')}
              </p>
            </div>
          </div>
        </div>
      </Panel>

      {/* Stat tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatTile lang={lang} icon="droplet" tone="crimson"
          label={tx(lang, 'กำลังฟื้นตัว', 'Healing now')}
          value={`${HEALING.dayOf}/${HEALING.totalDays}`}
          sub={tx(lang, 'วันที่', 'Day')} onClick={() => go('aftercare')} />
        <StatTile lang={lang} icon="calendar" tone="sky"
          label={tx(lang, 'คิวถัดไป', 'Next session')}
          value={`${daysToApt}${tx(lang, ' วัน', 'd')}`}
          sub={nextApt.time} onClick={() => go('bookings')} />
        <StatTile lang={lang} icon="needle" tone="amber"
          label={tx(lang, 'เข้ารับบริการ', 'Lifetime visits')}
          value={MEMBER.visits} sub={tx(lang, 'ครั้ง', 'sessions')} onClick={() => go('bookings')} />
        <StatTile lang={lang} icon="gift" tone="emerald"
          label={tx(lang, 'รางวัลที่แลกได้', 'Rewards ready')}
          value={REWARDS_READY(MEMBER.points)} sub={tx(lang, 'รายการ', 'items')} onClick={() => go('inkpass')} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Healing feature card */}
        <Panel glow className="lg:col-span-2 p-6 cursor-pointer group" >
          <div onClick={() => go('aftercare')} className="flex flex-col sm:flex-row gap-6">
            <div className="relative w-full sm:w-44 h-44 rounded-xl overflow-hidden border border-[#222] shrink-0">
              <img src={HEALING.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
              <span className="absolute bottom-2 left-2 bg-crimson text-white font-mono text-[9px] tracking-widest uppercase px-2 py-0.5 rounded">
                {tx(lang, 'กำลังหาย', 'Healing')}
              </span>
            </div>
            <div className="flex-1 min-w-0 flex flex-col">
              <Micro className="text-crimson/80">{tx(lang, 'บันทึกการดูแลรอยสัก', 'Aftercare journey')}</Micro>
              <h3 className="font-heading text-xl font-black text-white uppercase tracking-tight mt-1.5">
                {tx(lang, HEALING.pieceTh, HEALING.pieceEn)}
              </h3>
              <p className="text-gray-500 text-xs font-mono mt-1">
                {tx(lang, 'โดยช่าง', 'by')} {tx(lang, HEALING.artistTh, HEALING.artistEn)} · {tx(lang, HEALING.placement_th, HEALING.placement_en)}
              </p>
              <div className="mt-auto pt-4 flex items-center gap-5">
                <div className="flex-1">
                  <div className="flex justify-between mb-1.5">
                    <Micro className="text-gray-400">{tx(lang, 'ความคืบหน้า', 'Progress')}</Micro>
                    <span className="font-mono text-[10px] text-crimson">{Math.round(healPct * 100)}%</span>
                  </div>
                  <div className="h-2 bg-[#1f1f1f] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-crimson to-red-500 rounded-full" style={{ width: `${healPct * 100}%` }} />
                  </div>
                  <p className="font-mono text-[10px] text-gray-500 mt-2">
                    {tx(lang, `งานวันนี้ ${tasksDone}/${HEALING.todayTasks.length} เสร็จแล้ว`, `${tasksDone}/${HEALING.todayTasks.length} care tasks done today`)}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-crimson font-mono text-[10px] tracking-widest uppercase group-hover:gap-2.5 transition-all">
                  {tx(lang, 'ดูแล', 'Open')} <Icon name="arrowRight" className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        </Panel>

        {/* Next appointment */}
        <Panel className="p-6 flex flex-col">
          <Micro className="text-crimson/80">{tx(lang, 'นัดหมายถัดไป', 'Next appointment')}</Micro>
          <div className="mt-3 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-crimson/10 border border-crimson/30 flex flex-col items-center justify-center shrink-0">
              <span className="font-heading text-base font-black text-white leading-none">28</span>
              <span className="font-mono text-[8px] text-crimson tracking-widest">JUN</span>
            </div>
            <div className="min-w-0">
              <p className="font-heading text-sm font-bold text-white uppercase truncate">{tx(lang, nextApt.styleTh, nextApt.styleEn)}</p>
              <p className="font-mono text-[10px] text-gray-500">{nextApt.time} · {tx(lang, nextApt.artistTh, nextApt.artistEn)}</p>
            </div>
          </div>
          <p className="text-gray-400 text-xs mt-3 leading-relaxed">{tx(lang, nextApt.sessionTh, nextApt.sessionEn)}</p>
          <div className="mt-auto pt-4 grid grid-cols-2 gap-2">
            <button onClick={() => go('bookings')} className="bg-[#1a1a1a] hover:bg-[#222] border border-[#2a2a2a] text-gray-300 hover:text-white font-mono text-[10px] tracking-widest uppercase py-2.5 rounded-lg transition cursor-pointer">
              {tx(lang, 'รายละเอียด', 'Details')}
            </button>
            <button onClick={() => toast(tx(lang, 'ส่งคำขอเลื่อนแล้ว', 'Reschedule requested'), tx(lang, 'ทีมงานจะติดต่อกลับเพื่อยืนยันเวลาใหม่', 'Our team will confirm a new time shortly'), 'info')}
              className="bg-crimson/10 hover:bg-crimson/20 border border-crimson/30 text-crimson font-mono text-[10px] tracking-widest uppercase py-2.5 rounded-lg transition cursor-pointer">
              {tx(lang, 'เลื่อนคิว', 'Reschedule')}
            </button>
          </div>
        </Panel>
      </div>
    </div>
  );
}

function REWARDS_READY(points) {
  return window.PHG.REWARDS.filter(r => points >= r.cost).length;
}

function StatTile({ lang, icon, label, value, sub, tone, onClick }) {
  const tones = {
    crimson: 'text-crimson border-crimson/30 bg-crimson/5',
    sky: 'text-sky-400 border-sky-500/30 bg-sky-500/5',
    amber: 'text-amber-400 border-amber-500/30 bg-amber-500/5',
    emerald: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5',
  };
  return (
    <button onClick={onClick}
      className="text-left bg-[#131313] border border-[#222] rounded-2xl p-5 hover:border-[#333] transition cursor-pointer group">
      <div className={`w-9 h-9 rounded-lg border flex items-center justify-center mb-3 ${tones[tone]}`}>
        <Icon name={icon} className="w-4 h-4" />
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className="font-heading text-2xl font-black text-white leading-none">{value}</span>
        <span className="font-mono text-[10px] text-gray-500 uppercase">{sub}</span>
      </div>
      <Micro className="block mt-1.5 text-gray-500 group-hover:text-gray-400 transition">{label}</Micro>
    </button>
  );
}

Object.assign(window, { Dashboard, tierFor });

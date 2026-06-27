// ============================================================
// SCREEN — Aftercare Healing Journey  (hero feature)
// ============================================================
function Aftercare({ lang, toast }) {
  const { HEALING } = window.PHG;
  const healPct = HEALING.dayOf / HEALING.totalDays;

  // current stage index
  const curStageIdx = HEALING.stages.findIndex(s => HEALING.dayOf >= s.dayFrom && HEALING.dayOf <= s.dayTo);
  const [openStage, setOpenStage] = useState(curStageIdx < 0 ? 1 : curStageIdx);

  const [tasks, setTasks] = useState(HEALING.todayTasks);
  const doneCount = tasks.filter(t => t.done).length;
  const toggle = (id) => {
    setTasks(prev => {
      const nxt = prev.map(t => t.id === id ? { ...t, done: !t.done } : t);
      if (nxt.every(t => t.done) && !prev.every(t => t.done)) {
        toast(tx(lang, 'ดูแลครบทุกข้อแล้ว!', 'All care done!'), tx(lang, 'เยี่ยมมาก รอยสักของคุณจะหายสวย +20 แต้ม', 'Nice — your ink is healing well. +20 pts'), 'success');
      }
      return nxt;
    });
  };

  const stage = HEALING.stages[openStage];

  return (
    <div className="space-y-8 animate-fadeIn">
      <SectionHead
        kicker={tx(lang, 'บันทึกการดูแล', 'Aftercare')}
        title={tx(lang, 'เส้นทางการฟื้นตัว', 'Healing Journey')}
        sub={tx(lang, 'ติดตามการหายของรอยสักวันต่อวัน พร้อมคำแนะนำการดูแล', 'Track your tattoo healing day by day with care guidance')}
      />

      {/* Top: ring + piece */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Panel className="p-6 flex items-center gap-6">
          <Ring value={healPct} size={120} stroke={9}>
            <span className="font-heading text-3xl font-black text-white leading-none">{HEALING.dayOf}</span>
            <Micro className="text-gray-500 mt-1">/ {HEALING.totalDays} {tx(lang, 'วัน', 'days')}</Micro>
          </Ring>
          <div className="space-y-2">
            <Micro className="text-crimson/80">{tx(lang, 'ระยะปัจจุบัน', 'Current stage')}</Micro>
            <p className="font-heading text-lg font-black text-white uppercase leading-tight">{tx(lang, stage.th, stage.en)}</p>
            <p className="text-gray-400 text-xs leading-relaxed">{tx(lang, HEALING.stages[curStageIdx].desc_th, HEALING.stages[curStageIdx].desc_en)}</p>
          </div>
        </Panel>

        <Panel className="lg:col-span-2 p-6 flex flex-col sm:flex-row gap-6">
          <div className="relative w-full sm:w-40 h-40 rounded-xl overflow-hidden border border-[#222] shrink-0">
            <img src={HEALING.image} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          </div>
          <div className="flex-1 space-y-2.5">
            <Micro className="text-crimson/80">{tx(lang, 'ผลงานที่กำลังดูแล', 'Piece in care')}</Micro>
            <h3 className="font-heading text-xl font-black text-white uppercase tracking-tight">{tx(lang, HEALING.pieceTh, HEALING.pieceEn)}</h3>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <Field lang={lang} k={['ช่างสัก', 'Artist']} v={tx(lang, HEALING.artistTh, HEALING.artistEn)} />
              <Field lang={lang} k={['ตำแหน่ง', 'Placement']} v={tx(lang, HEALING.placement_th, HEALING.placement_en)} />
              <Field lang={lang} k={['วันที่สัก', 'Inked on']} v={lang === 'TH' ? '9 มิ.ย. 2026' : 'Jun 9, 2026'} />
              <Field lang={lang} k={['หายสนิทประมาณ', 'Fully healed ~']} v={lang === 'TH' ? '9 ก.ค. 2026' : 'Jul 9, 2026'} />
            </div>
          </div>
        </Panel>
      </div>

      {/* Stage timeline */}
      <Panel className="p-6">
        <Micro className="text-crimson/80">{tx(lang, 'ไทม์ไลน์การฟื้นตัว', 'Recovery timeline')}</Micro>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
          {HEALING.stages.map((s, i) => {
            const state = i < curStageIdx ? 'done' : i === curStageIdx ? 'current' : 'upcoming';
            const active = i === openStage;
            return (
              <button key={s.key} onClick={() => setOpenStage(i)}
                className={`text-left rounded-xl border p-4 transition cursor-pointer relative overflow-hidden
                  ${active ? 'border-crimson/50 bg-crimson/5' : 'border-[#222] bg-black/30 hover:border-[#333]'}`}>
                {state === 'current' && <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-crimson animate-pulse" />}
                <div className="flex items-center gap-2">
                  <span className={`w-6 h-6 rounded-md flex items-center justify-center font-mono text-[10px] font-bold
                    ${state === 'done' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : state === 'current' ? 'bg-crimson text-white' : 'bg-[#1a1a1a] text-gray-500 border border-[#2a2a2a]'}`}>
                    {state === 'done' ? <Icon name="check" className="w-3.5 h-3.5" /> : i + 1}
                  </span>
                  <span className="font-mono text-[10px] tracking-widest text-gray-500 uppercase">{s.range}</span>
                </div>
                <p className="font-heading text-sm font-bold text-white uppercase mt-2.5">{tx(lang, s.th, s.en)}</p>
                <Micro className={`block mt-1 ${state === 'current' ? 'text-crimson/70' : 'text-gray-600'}`}>
                  {state === 'done' ? tx(lang, 'ผ่านแล้ว', 'Completed') : state === 'current' ? tx(lang, 'ตอนนี้', 'In progress') : tx(lang, 'กำลังจะถึง', 'Upcoming')}
                </Micro>
              </button>
            );
          })}
        </div>

        {/* selected stage detail */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
          <div className="bg-black/30 border border-[#222] rounded-xl p-5">
            <div className="flex items-center gap-2 text-emerald-400 mb-3">
              <Icon name="check" className="w-4 h-4" /><Micro className="text-emerald-400/80">{tx(lang, 'ควรทำ', 'Do')}</Micro>
            </div>
            <ul className="space-y-2.5">
              {stage.dos.map((d, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-gray-300">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                  {tx(lang, d.th, d.en)}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-black/30 border border-[#222] rounded-xl p-5">
            <div className="flex items-center gap-2 text-crimson mb-3">
              <Icon name="ban" className="w-4 h-4" /><Micro className="text-crimson/80">{tx(lang, 'ห้ามทำ', "Don't")}</Micro>
            </div>
            <ul className="space-y-2.5">
              {stage.donts.map((d, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-gray-300">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-crimson shrink-0" />
                  {tx(lang, d.th, d.en)}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Panel>

      {/* Today's checklist + photo log */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* checklist */}
        <Panel className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between">
            <Micro className="text-crimson/80">{tx(lang, 'เช็กลิสต์วันนี้', "Today's care")}</Micro>
            <span className="font-mono text-[10px] text-gray-500">{doneCount}/{tasks.length}</span>
          </div>
          <div className="h-1.5 bg-[#1f1f1f] rounded-full overflow-hidden mt-3 mb-4">
            <div className="h-full bg-crimson rounded-full transition-all duration-500" style={{ width: `${(doneCount / tasks.length) * 100}%` }} />
          </div>
          <div className="space-y-2">
            {tasks.map(t => (
              <button key={t.id} onClick={() => toggle(t.id)}
                className={`w-full flex items-center gap-3 p-3 rounded-xl border transition cursor-pointer text-left
                  ${t.done ? 'bg-crimson/5 border-crimson/25' : 'bg-black/30 border-[#222] hover:border-[#333]'}`}>
                <span className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border transition
                  ${t.done ? 'bg-crimson border-crimson text-white' : 'border-[#3a3a3a] text-transparent'}`}>
                  <Icon name="check" className="w-3.5 h-3.5" stroke={3} />
                </span>
                <span className={`text-sm transition ${t.done ? 'text-gray-500 line-through' : 'text-gray-200'}`}>
                  {tx(lang, t.th, t.en)}
                </span>
              </button>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2.5 bg-black/40 border border-[#222] rounded-xl p-3">
            <Icon name="bell" className="w-4 h-4 text-amber-400 shrink-0" />
            <p className="text-xs text-gray-400 leading-snug">
              {tx(lang, 'แจ้งเตือนถัดไป — ทาโลชั่น 21:00 น.', 'Next reminder — moisturize at 9:00 PM')}
            </p>
          </div>
        </Panel>

        {/* photo log */}
        <Panel className="lg:col-span-3 p-6">
          <div className="flex items-center justify-between mb-4">
            <Micro className="text-crimson/80">{tx(lang, 'ไดอารีรูปภาพการหาย', 'Healing photo log')}</Micro>
            <span className="font-mono text-[10px] text-gray-500">{tx(lang, 'ลากรูปวันนี้มาวาง', 'Drop today’s photo')}</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {HEALING.log.map((p) => (
              <div key={p.day} className="space-y-2">
                {p.filled ? (
                  <div className="relative aspect-square rounded-xl overflow-hidden border border-[#222]">
                    <img src={p.img} alt="" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <span className="absolute bottom-1.5 left-1.5 font-mono text-[9px] text-emerald-400 flex items-center gap-1">
                      <Icon name="check" className="w-3 h-3" /> {tx(lang, p.th, p.en)}
                    </span>
                  </div>
                ) : (
                  <image-slot id={`heal-day-${p.day}`} shape="rounded" radius="12"
                    style={{ display: 'block', width: '100%', aspectRatio: '1 / 1' }}
                    placeholder={tx(lang, 'เพิ่มรูปวันนี้', 'Add today')}></image-slot>
                )}
                <Micro className="block text-center text-gray-600">{tx(lang, p.th, p.en)} · D{p.day}</Micro>
              </div>
            ))}
          </div>
          <button onClick={() => toast(tx(lang, 'ส่งให้ช่างตรวจแล้ว', 'Sent to your artist'), tx(lang, 'พิมพ์ดาวจะช่วยดูการหายของรอยสักให้', 'Pimdao will review your healing progress'), 'success')}
            className="mt-4 w-full bg-[#1a1a1a] hover:bg-[#222] border border-[#2a2a2a] text-gray-300 hover:text-white font-mono text-[10px] tracking-widest uppercase py-3 rounded-xl transition cursor-pointer flex items-center justify-center gap-2">
            <Icon name="shield" className="w-3.5 h-3.5 text-crimson" />
            {tx(lang, 'ส่งรูปให้ช่างตรวจการหาย', 'Send log to artist for check-up')}
          </button>
        </Panel>
      </div>
    </div>
  );
}

function Field({ lang, k, v }) {
  return (
    <div>
      <Micro className="block text-gray-600">{tx(lang, k[0], k[1])}</Micro>
      <p className="text-sm text-white mt-0.5">{v}</p>
    </div>
  );
}

Object.assign(window, { Aftercare });

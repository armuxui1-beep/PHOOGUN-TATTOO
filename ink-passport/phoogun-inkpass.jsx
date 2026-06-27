// ============================================================
// SCREEN — Ink Pass / Rewards
// ============================================================
function InkPass({ lang, toast }) {
  const { MEMBER, TIERS, REWARDS, POINTS_LEDGER } = window.PHG;
  const [points, setPoints] = useState(MEMBER.points);
  const [redeemed, setRedeemed] = useState([]);

  const { cur, next } = tierFor(points);
  const tierPct = next ? (points - cur.min) / (next.min - cur.min) : 1;
  const curIdx = TIERS.findIndex(t => t.key === cur.key);

  const redeem = (r) => {
    if (points < r.cost || redeemed.includes(r.id)) return;
    setPoints(p => p - r.cost);
    setRedeemed(prev => [...prev, r.id]);
    toast(tx(lang, 'แลกรางวัลสำเร็จ', 'Reward redeemed'), tx(lang, `${r.th} — โค้ดถูกส่งเข้าบัญชีของคุณแล้ว`, `${r.en} — voucher added to your account`), 'success');
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <SectionHead
        kicker={tx(lang, 'สมาชิกภาพ', 'Membership')}
        title={tx(lang, 'อิงค์ พาส', 'Ink Pass')}
        sub={tx(lang, 'สะสมแต้มจากทุกเซสชัน ปลดล็อกระดับและแลกรางวัล', 'Earn points every session — climb tiers and redeem rewards')}
      />

      {/* Tier ladder */}
      <Panel className="p-6 sm:p-8 overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-crimson to-transparent" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-end gap-3">
            <div>
              <Micro className="text-crimson/80">{tx(lang, 'แต้มคงเหลือ', 'Balance')}</Micro>
              <div className="font-heading text-5xl font-black text-white leading-none mt-1">{points.toLocaleString()}</div>
            </div>
            <span className="inline-flex items-center gap-1.5 bg-crimson/10 border border-crimson/30 text-crimson font-mono text-[10px] tracking-widest uppercase px-2.5 py-1 rounded-full mb-1">
              <Icon name="flame" className="w-3 h-3" /> {tx(lang, cur.th, cur.en)}
            </span>
          </div>
          <p className="font-mono text-xs text-gray-500 lg:text-right">
            {next
              ? tx(lang, `อีก ${(next.min - points).toLocaleString()} แต้มสู่ระดับ ${next.th}`, `${(next.min - points).toLocaleString()} pts to ${next.en}`)
              : tx(lang, 'คุณอยู่ระดับสูงสุด', 'You’ve reached the top tier')}
          </p>
        </div>

        {/* ladder track */}
        <div className="relative mt-8 pt-2">
          <div className="absolute left-0 right-0 top-[18px] h-1 bg-[#1f1f1f] rounded-full" />
          <div className="absolute left-0 top-[18px] h-1 bg-gradient-to-r from-crimson to-red-500 rounded-full transition-all duration-700"
            style={{ width: `${(curIdx / (TIERS.length - 1)) * 100 + (tierPct / (TIERS.length - 1)) * 100}%` }} />
          <div className="relative grid grid-cols-4 gap-2">
            {TIERS.map((t, i) => {
              const reached = points >= t.min;
              const isCur = t.key === cur.key;
              return (
                <div key={t.key} className="flex flex-col items-center text-center">
                  <span className={`w-9 h-9 rounded-full flex items-center justify-center border-2 z-10 transition
                    ${isCur ? 'bg-crimson border-crimson text-white shadow-[0_0_14px_rgba(230,25,46,0.5)]'
                      : reached ? 'bg-[#1a1a1a] border-crimson/50 text-crimson' : 'bg-[#131313] border-[#2a2a2a] text-gray-600'}`}>
                    {reached ? <Icon name="flame" className="w-4 h-4" /> : <Icon name="shield" className="w-4 h-4" />}
                  </span>
                  <p className={`font-heading text-[11px] sm:text-xs font-bold uppercase mt-2 ${isCur ? 'text-white' : reached ? 'text-gray-300' : 'text-gray-600'}`}>
                    {tx(lang, t.th, t.en)}
                  </p>
                  <Micro className="block mt-0.5 text-gray-600">{t.min.toLocaleString()}</Micro>
                  <Micro className="block mt-1 text-gray-700 leading-tight hidden sm:block">{tx(lang, t.perk_th, t.perk_en)}</Micro>
                </div>
              );
            })}
          </div>
        </div>
      </Panel>

      {/* Rewards + ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* rewards grid */}
        <div className="lg:col-span-2 space-y-4">
          <Micro className="text-crimson/80">{tx(lang, 'แลกรางวัล', 'Redeem rewards')}</Micro>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {REWARDS.map(r => {
              const can = points >= r.cost;
              const used = redeemed.includes(r.id);
              return (
                <Panel key={r.id} className="overflow-hidden flex flex-col">
                  <div className="relative h-28 overflow-hidden">
                    <img src={r.image} alt="" className="w-full h-full object-cover" style={{ filter: used ? 'grayscale(1)' : 'none' }} />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#131313] via-[#131313]/40 to-transparent" />
                    <span className="absolute top-2.5 right-2.5 bg-black/70 backdrop-blur border border-crimson/30 text-crimson font-mono text-[10px] tracking-widest px-2 py-1 rounded-full">
                      {r.cost.toLocaleString()} PTS
                    </span>
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <p className="font-heading text-sm font-bold text-white uppercase leading-tight">{tx(lang, r.th, r.en)}</p>
                    <button disabled={!can || used} onClick={() => redeem(r)}
                      className={`mt-4 w-full font-mono text-[10px] tracking-widest uppercase py-2.5 rounded-lg transition flex items-center justify-center gap-1.5
                        ${used ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 cursor-default'
                          : can ? 'bg-crimson hover:bg-red-600 text-white cursor-pointer'
                            : 'bg-[#1a1a1a] border border-[#2a2a2a] text-gray-600 cursor-not-allowed'}`}>
                      {used ? <><Icon name="check" className="w-3.5 h-3.5" /> {tx(lang, 'แลกแล้ว', 'Redeemed')}</>
                        : can ? <><Icon name="gift" className="w-3.5 h-3.5" /> {tx(lang, 'แลกเลย', 'Redeem')}</>
                          : tx(lang, `ขาดอีก ${(r.cost - points).toLocaleString()}`, `Need ${(r.cost - points).toLocaleString()} more`)}
                    </button>
                  </div>
                </Panel>
              );
            })}
          </div>
        </div>

        {/* ledger */}
        <div className="space-y-4">
          <Micro className="text-crimson/80">{tx(lang, 'ประวัติแต้ม', 'Points history')}</Micro>
          <Panel className="p-2">
            {POINTS_LEDGER.map((l, i) => (
              <div key={i} className={`flex items-center justify-between gap-3 p-3.5 ${i < POINTS_LEDGER.length - 1 ? 'border-b border-[#1f1f1f]' : ''}`}>
                <div className="min-w-0">
                  <p className="text-sm text-gray-200 truncate">{tx(lang, l.th, l.en)}</p>
                  <Micro className="block mt-0.5 text-gray-600">{l.date}</Micro>
                </div>
                <span className={`font-heading text-sm font-black shrink-0 ${l.delta > 0 ? 'text-emerald-400' : 'text-crimson'}`}>
                  {l.delta > 0 ? '+' : ''}{l.delta.toLocaleString()}
                </span>
              </div>
            ))}
          </Panel>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { InkPass });

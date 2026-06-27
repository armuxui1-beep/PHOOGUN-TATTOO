// ============================================================
// Admin CMS — Pixel Settings, Analytics, Promote Albums
// ============================================================
const { useState, useEffect } = React;
function AdminSettings({ lang, config, setConfig, images, reviews, albums, categories, toast }) {
  const [localPixel, setLocalPixel] = useState({ fb: config.fbPixel || '', tt: config.ttPixel || '' });
  const [localSocial, setLocalSocial] = useState(config.social || {});
  const [localMap, setLocalMap] = useState(config.mapUrl || '');
  const [tab, setTab] = useState('analytics');

  const savePixels = () => {
    setConfig(p => ({ ...p, fbPixel: localPixel.fb, ttPixel: localPixel.tt }));
    injectPixels(localPixel.fb, localPixel.tt);
    toast('บันทึก Pixel แล้ว', `FB: ${localPixel.fb || 'ว่าง'} · TT: ${localPixel.tt || 'ว่าง'}`, 'success');
  };

  const saveSocial = () => {
    setConfig(p => ({ ...p, social: localSocial, mapUrl: localMap }));
    toast('บันทึกข้อมูลติดต่อแล้ว', 'อัปเดตโซเชียลและแผนที่เรียบร้อย', 'success');
  };

  const togglePromote = id => {
    // toggle in albums via parent
    const a = albums.find(x => x.id === id);
    if (a) toast(a.promoted ? 'ยกเลิกโปรโมทแล้ว' : 'โปรโมทอัลบั้มแล้ว', a.name, a.promoted ? 'info' : 'success');
  };

  // Analytics derived stats
  const totalImgs = images.length;
  const featured = images.filter(i => i.featured).length;
  const topCat = (() => {
    const counts = {};
    images.forEach(i => { counts[i.categoryId] = (counts[i.categoryId] || 0) + 1; });
    const max = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
    if (!max) return '—';
    const c = categories.find(x => x.id === max[0]);
    return c ? tx(lang, c.nameTh, c.nameEn) : '—';
  })();
  const topImg = [...images].sort((a, b) => (b.likes || 0) - (a.likes || 0))[0];
  const totalLikes = images.reduce((s, i) => s + (i.likes || 0), 0);
  const apprvRev = reviews.filter(r => r.status === 'approved').length;
  const pendRev = reviews.filter(r => r.status === 'pending').length;

  const TABS = [['analytics','bar','สถิติ','Analytics'],['promote','promote','โปรโมท','Promote'],['pixel','settings','Pixel','Pixel'],['social','link','โซเชียล','Social & Map']];

  return (
    <div className="space-y-6">
      <div className="flex gap-2 flex-wrap">
        {TABS.map(([k, ic, th, en]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-mono text-[10px] tracking-widest uppercase transition cursor-pointer ${tab === k ? 'bg-crimson text-white' : 'bg-[#1a1a1a] border border-[#2a2a2a] text-gray-400 hover:text-white'}`}>
            <Icon name={ic} className="w-3.5 h-3.5" />{tx(lang, th, en)}
          </button>
        ))}
      </div>

      {/* ANALYTICS */}
      {tab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[
              { label: tx(lang,'รูปทั้งหมด','Total Images'), val: totalImgs, tone: 'text-white' },
              { label: tx(lang,'Featured','Featured'), val: featured, tone: 'text-crimson' },
              { label: tx(lang,'ยอดไลค์รวม','Total Likes'), val: totalLikes.toLocaleString(), tone: 'text-red-400' },
              { label: tx(lang,'รีวิวรอดำเนินการ','Pending Reviews'), val: pendRev, tone: 'text-amber-400' },
            ].map(s => (
              <Panel key={s.label} className="p-5 text-center">
                <div className={`font-heading text-4xl font-black ${s.tone}`}>{s.val}</div>
                <Micro className="text-gray-500 block mt-2">{s.label}</Micro>
              </Panel>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Panel className="p-6">
              <Micro className="text-crimson/80 block mb-4">{tx(lang,'ผลงานยอดนิยม','Top Performing Work')}</Micro>
              {topImg ? (
                <div className="flex gap-4 items-center">
                  <img src={topImg.imageUrl} alt="" className="w-16 h-16 object-cover rounded-xl border border-[#222] shrink-0" />
                  <div>
                    <p className="font-heading text-sm font-bold text-white uppercase">{topImg.title}</p>
                    <p className="text-gray-500 text-xs mt-0.5">{topImg.artist}</p>
                    <div className="flex items-center gap-1.5 mt-2 text-crimson">
                      <Icon name="heart" className="w-3.5 h-3.5 fill-crimson" />
                      <span className="font-mono text-xs text-white">{topImg.likes}</span>
                      <Micro className="text-gray-500">{tx(lang,'ไลค์','likes')}</Micro>
                    </div>
                  </div>
                </div>
              ) : <p className="text-gray-600 text-sm">—</p>}
            </Panel>
            <Panel className="p-6">
              <Micro className="text-crimson/80 block mb-4">{tx(lang,'ภาพรวมรีวิว','Review Summary')}</Micro>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">{tx(lang,'รีวิวที่อนุมัติ','Approved reviews')}</span>
                  <Badge tone="green">{apprvRev}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">{tx(lang,'รีวิวรอตรวจ','Pending reviews')}</span>
                  <Badge tone="amber">{pendRev}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">{tx(lang,'หมวดหมู่ยอดนิยม','Top category')}</span>
                  <Badge>{topCat}</Badge>
                </div>
              </div>
            </Panel>
          </div>
        </div>
      )}

      {/* PROMOTE ALBUMS */}
      {tab === 'promote' && (
        <div>
          <p className="text-gray-400 text-sm mb-6 leading-relaxed">{tx(lang, 'เลือกอัลบั้มที่ต้องการโปรโมท จะปรากฏใน Featured Strip บนหน้าแกลเลอรี', 'Featured albums appear in the gallery promoted strip at the top of the gallery section.')}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {albums.map(a => (
              <div key={a.id} className={`relative rounded-2xl overflow-hidden border-2 transition ${a.promoted ? 'border-amber-500/60' : 'border-[#222]'}`}>
                <div className="h-36 bg-[#111] overflow-hidden">
                  {a.cover && <img src={a.cover} alt="" className="w-full h-full object-cover opacity-70" />}
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
                {a.promoted && (
                  <div className="absolute top-3 right-3">
                    <Badge tone="amber"><Icon name="promote" className="w-2.5 h-2.5" /> Featured</Badge>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-4 flex items-end justify-between">
                  <div>
                    <p className="font-heading text-sm font-bold text-white uppercase">{a.name}</p>
                    <Micro className="text-gray-500">{images.filter(i=>i.albumId===a.id).length} {tx(lang,'ภาพ','images')}</Micro>
                  </div>
                  <button onClick={() => {
                    const upd = albums.map(x => x.id === a.id ? { ...x, promoted: !x.promoted } : x);
                    // we don't have setAlbums here — signal via toast, parent handles in AdminGallery
                    // Use window event to propagate
                    window._phg_togglePromote && window._phg_togglePromote(a.id);
                    toast(a.promoted ? tx(lang,'ยกเลิกโปรโมทแล้ว','Unfeatured') : tx(lang,'โปรโมทแล้ว','Promoted!'), a.name, a.promoted ? 'info' : 'success');
                  }}
                    className={`px-3 py-1.5 rounded-lg font-mono text-[9px] tracking-widest uppercase transition cursor-pointer ${a.promoted ? 'bg-amber-500/20 border border-amber-500/40 text-amber-400 hover:bg-amber-500/30' : 'bg-crimson/10 border border-crimson/30 text-crimson hover:bg-crimson/20'}`}>
                    {a.promoted ? tx(lang,'ยกเลิก','Unfeature') : tx(lang,'โปรโมท','Feature')}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* PIXEL SETTINGS */}
      {tab === 'pixel' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Panel className="p-6 space-y-5">
            <Micro className="text-crimson/80">Facebook Pixel</Micro>
            <Input label="Facebook Pixel ID" value={localPixel.fb} onChange={v => setLocalPixel(p=>({...p,fb:v}))} placeholder="123456789012345" mono />
            <div className="bg-[#0d0d0d] border border-[#1f1f1f] rounded-xl p-4">
              <Micro className="text-gray-500 block mb-2">{tx(lang,'ตัวอย่าง Code','Preview Code')}</Micro>
              <code className="text-[10px] text-gray-500 font-mono break-all">{localPixel.fb ? `fbq('init','${localPixel.fb}'); fbq('track','PageView');` : tx(lang,'ใส่ Pixel ID เพื่อดู code','Enter Pixel ID to preview code')}</code>
            </div>
          </Panel>
          <Panel className="p-6 space-y-5">
            <Micro className="text-crimson/80">TikTok Pixel</Micro>
            <Input label="TikTok Pixel ID" value={localPixel.tt} onChange={v => setLocalPixel(p=>({...p,tt:v}))} placeholder="ABCDE123456" mono />
            <div className="bg-[#0d0d0d] border border-[#1f1f1f] rounded-xl p-4">
              <Micro className="text-gray-500 block mb-2">{tx(lang,'ตัวอย่าง Code','Preview Code')}</Micro>
              <code className="text-[10px] text-gray-500 font-mono break-all">{localPixel.tt ? `ttq.load('${localPixel.tt}'); ttq.page();` : tx(lang,'ใส่ Pixel ID เพื่อดู code','Enter Pixel ID to preview code')}</code>
            </div>
          </Panel>
          <div className="lg:col-span-2">
            <Btn onClick={savePixels} variant="primary" size="lg"><Icon name="check" className="w-4 h-4" />{tx(lang,'บันทึกและเปิดใช้งาน Pixel','Save & Activate Pixels')}</Btn>
          </div>
        </div>
      )}

      {/* SOCIAL & MAP */}
      {tab === 'social' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Panel className="p-6 space-y-4">
            <Micro className="text-crimson/80">{tx(lang,'ลิงก์โซเชียลมีเดีย','Social Media Links')}</Micro>
            {[['facebook','Facebook Page URL'],['instagram','Instagram URL'],['tiktok','TikTok Profile URL'],['lineoa','LINE OA URL'],['twitter','X / Twitter URL'],['phone',tx(lang,'เบอร์โทร','Phone Number')]].map(([k,lbl]) => (
              <Input key={k} label={lbl} value={localSocial[k]||''} onChange={v => setLocalSocial(p=>({...p,[k]:v}))} placeholder={k==='phone'?'0812345678':'https://...'} />
            ))}
          </Panel>
          <Panel className="p-6 space-y-4">
            <Micro className="text-crimson/80">Google Maps Embed</Micro>
            <Textarea label={tx(lang,'วาง Google Maps Embed URL ตรงนี้','Paste Google Maps Embed URL here')} value={localMap} onChange={setLocalMap} placeholder="https://www.google.com/maps/embed?pb=..." rows={4} />
            <p className="text-gray-600 text-xs leading-relaxed">{tx(lang,'ไปที่ Google Maps → แชร์ → ฝังแผนที่ → คัดลอก URL ใน src="..."','Go to Google Maps → Share → Embed a map → Copy the URL inside src="..."')}</p>
            {localMap && (
              <div className="w-full h-48 rounded-xl overflow-hidden border border-[#222]">
                <iframe src={localMap} width="100%" height="100%" style={{ border: 0 }} loading="lazy" title="Preview" />
              </div>
            )}
            <Btn onClick={saveSocial} variant="primary" className="w-full justify-center"><Icon name="check" className="w-4 h-4" />{tx(lang,'บันทึก','Save Settings')}</Btn>
          </Panel>
        </div>
      )}
    </div>
  );
}

function injectPixels(fbId, ttId) {
  // Remove old pixel scripts
  ['__fb_pixel','__tt_pixel'].forEach(id => { const el = document.getElementById(id); if (el) el.remove(); });
  if (fbId) {
    const s = document.createElement('script');
    s.id = '__fb_pixel';
    s.textContent = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${fbId}');fbq('track','PageView');`;
    document.head.appendChild(s);
  }
  if (ttId) {
    const s = document.createElement('script');
    s.id = '__tt_pixel';
    s.textContent = `!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var i="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=i,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};var o=document.createElement("script");o.type="text/javascript",o.async=!0,o.src=i+"?sdkid="+e+"&lib="+t;var a=document.getElementsByTagName("script")[0];a.parentNode.insertBefore(o,a)};ttq.load('${ttId}');ttq.page();}(window,document,'ttq');`;
    document.head.appendChild(s);
  }
}

Object.assign(window, { AdminSettings });

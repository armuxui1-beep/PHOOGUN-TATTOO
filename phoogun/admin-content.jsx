// ============================================================
// Admin CMS — Content, Categories, Artists, Reviews (Card → Modal UX)
// ============================================================
const { useState } = React;

// Local Modal (same pattern as admin-gallery)
function Modal({ open, onClose, title, icon, children, footer }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-lg bg-[#0d0d0d] border border-[#252525] rounded-2xl shadow-2xl overflow-hidden"
        style={{ maxHeight:'90vh', overflowY:'auto' }} onClick={e=>e.stopPropagation()}>
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-crimson to-transparent" />
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#1a1a1a]">
          <div className="flex items-center gap-2.5">
            {icon && <Icon name={icon} className="w-4 h-4 text-crimson" />}
            <h3 className="font-heading text-sm font-black text-white uppercase tracking-wide">{title}</h3>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg border border-[#2a2a2a] text-gray-500 hover:text-white flex items-center justify-center cursor-pointer transition">
            <Icon name="x" className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="p-5 space-y-4">{children}</div>
        {footer && <div className="px-5 pb-5 flex gap-3 flex-wrap">{footer}</div>}
      </div>
    </div>
  );
}

function SectionHeader({ icon, title, sub, action }) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-crimson/10 border border-crimson/30 flex items-center justify-center shrink-0">
          <Icon name={icon} className="w-5 h-5 text-crimson" />
        </div>
        <div>
          <h3 className="font-heading text-lg font-black text-white uppercase tracking-tight">{title}</h3>
          {sub && <p className="font-mono text-[10px] text-gray-500 mt-0.5">{sub}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

function AddCard({ onClick, label, wide = false }) {
  return (
    <button onClick={onClick}
      className={`flex flex-col items-center justify-center gap-2 bg-[#0d0d0d] border-2 border-dashed border-[#2a2a2a] hover:border-crimson/50 rounded-xl cursor-pointer transition group ${wide ? 'py-6 w-full' : 'aspect-square min-h-[100px]'}`}>
      <div className="w-8 h-8 rounded-full bg-[#1a1a1a] group-hover:bg-crimson/10 border border-[#2a2a2a] group-hover:border-crimson/30 flex items-center justify-center transition">
        <Icon name="plus" className="w-4 h-4 text-gray-500 group-hover:text-crimson transition" />
      </div>
      <Micro className="text-gray-600 group-hover:text-crimson transition">{label}</Micro>
    </button>
  );
}

function AdminContent({ lang, categories, setCategories, artists, setArtists, reviews, setReviews, config, setConfig, toast }) {
  const [tab, setTab] = useState('content');
  const TABS = [
    ['content','edit', tx(lang,'เนื้อหาเว็บ','Page Content')],
    ['categories','tag', tx(lang,'หมวดหมู่','Categories')],
    ['artists','eye', tx(lang,'ช่างสัก','Artists')],
    ['reviews','star', tx(lang,'รีวิว','Reviews')],
  ];
  return (
    <div className="space-y-6">
      <div className="flex gap-2 flex-wrap">
        {TABS.map(([k,ic,label]) => (
          <button key={k} onClick={()=>setTab(k)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-mono text-[10px] tracking-widest uppercase transition cursor-pointer ${tab===k?'bg-crimson text-white':'bg-[#1a1a1a] border border-[#2a2a2a] text-gray-400 hover:text-white'}`}>
            <Icon name={ic} className="w-3.5 h-3.5"/>{label}
          </button>
        ))}
      </div>
      {tab==='content' && <ContentCards lang={lang} config={config} setConfig={setConfig} toast={toast} />}
      {tab==='categories' && <CategoriesCards lang={lang} categories={categories} setCategories={setCategories} toast={toast} />}
      {tab==='artists' && <ArtistsCards lang={lang} artists={artists} setArtists={setArtists} toast={toast} />}
      {tab==='reviews' && <ReviewCards lang={lang} reviews={reviews} setReviews={setReviews} toast={toast} />}
    </div>
  );
}

// ── Page Content Cards ────────────────────────────────────
function ContentCards({ lang, config, setConfig, toast }) {
  const [modal, setModal] = useState(null);
  const [local, setLocal] = useState({...config});
  const lf = (k,v) => setLocal(p=>({...p,[k]:v}));
  const lfs = (k,i,v) => setLocal(p=>{const s=[...( p.stats||[])];s[i]={...s[i],[k]:v};return {...p,stats:s};});

  const stats = local.stats || [
    {val:'500+',th:'ผลงานสักสำเร็จ',en:'Tattoos Completed'},
    {val:'8+',th:'ปีประสบการณ์',en:'Years Experience'},
    {val:'4',th:'ช่างสักมืออาชีพ',en:'Master Artists'},
    {val:'100%',th:'มาตรฐานโรงพยาบาล',en:'Hospital Grade'},
  ];

  const saveHero = () => { setConfig(local); toast(tx(lang,'บันทึก Hero แล้ว','Hero saved'),'','success'); setModal(null); };
  const saveAbout = () => { setConfig(local); toast(tx(lang,'บันทึก About แล้ว','About saved'),'','success'); setModal(null); };
  const saveStats = () => { setConfig({...config,...local,stats:local.stats||stats}); toast(tx(lang,'บันทึกสถิติแล้ว','Stats saved'),'','success'); setModal(null); };

  const sections = [
    { key:'hero', icon:'promote', label:tx(lang,'Hero Section','Hero Section'), preview: tx(lang,config.heroTitle,config.heroTitleEn), sub:tx(lang,'หัวข้อ/subtitle/คำอธิบาย','Title/subtitle/description') },
    { key:'about', icon:'image', label:tx(lang,'About Section','About Section'), preview: tx(lang,config.aboutTitle,config.aboutTitleEn), sub:tx(lang,'หัวข้อ/เนื้อหา/รูปสตูดิโอ','Title/text/studio image') },
    { key:'stats', icon:'bar', label:tx(lang,'สถิติ 4 บล็อก','4 Stat Blocks'), preview: stats.map(s=>s.val).join(' · '), sub:tx(lang,'ตัวเลขและป้ายกำกับ','Numbers & labels') },
  ];

  return (
    <>
      <SectionHeader icon="edit" title={tx(lang,'แก้ไขเนื้อหาหน้าเว็บ','Edit Page Content')} sub={tx(lang,'คลิกการ์ดเพื่อแก้ไข','Click a card to edit')} />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {sections.map(s => (
          <button key={s.key} onClick={()=>{ setLocal({...config}); setModal(s.key); }}
            className="text-left bg-[#111] border border-[#222] hover:border-crimson/50 rounded-2xl p-5 transition cursor-pointer group">
            <div className="w-9 h-9 rounded-xl bg-crimson/10 border border-crimson/30 flex items-center justify-center mb-4 group-hover:bg-crimson/20 transition">
              <Icon name={s.icon} className="w-5 h-5 text-crimson" />
            </div>
            <p className="font-heading text-sm font-bold text-white uppercase">{s.label}</p>
            <Micro className="text-gray-600 block mt-1">{s.sub}</Micro>
            <p className="text-gray-400 text-xs mt-3 truncate">{s.preview}</p>
          </button>
        ))}
      </div>

      {/* Hero Modal */}
      <Modal open={modal==='hero'} onClose={()=>setModal(null)} icon="promote" title="Hero Section"
        footer={<><Btn onClick={saveHero} variant="primary" size="sm"><Icon name="check" className="w-3.5 h-3.5"/>{tx(lang,'บันทึก','Save')}</Btn><Btn onClick={()=>setModal(null)} variant="ghost" size="sm">{tx(lang,'ยกเลิก','Cancel')}</Btn></>}>
        <Input label={tx(lang,'หัวข้อหลัก TH','Main Title TH')} value={local.heroTitle} onChange={v=>lf('heroTitle',v)} />
        <Input label={tx(lang,'หัวข้อหลัก EN','Main Title EN')} value={local.heroTitleEn} onChange={v=>lf('heroTitleEn',v)} />
        <Input label={tx(lang,'หัวข้อรอง TH','Subtitle TH')} value={local.heroSub} onChange={v=>lf('heroSub',v)} />
        <Input label={tx(lang,'หัวข้อรอง EN','Subtitle EN')} value={local.heroSubEn} onChange={v=>lf('heroSubEn',v)} />
        <Textarea label={tx(lang,'คำอธิบาย TH','Description TH')} value={local.heroDesc} onChange={v=>lf('heroDesc',v)} rows={3} />
        <Textarea label={tx(lang,'คำอธิบาย EN','Description EN')} value={local.heroDescEn} onChange={v=>lf('heroDescEn',v)} rows={3} />
      </Modal>

      {/* About Modal */}
      <Modal open={modal==='about'} onClose={()=>setModal(null)} icon="image" title="About Section"
        footer={<><Btn onClick={saveAbout} variant="primary" size="sm"><Icon name="check" className="w-3.5 h-3.5"/>{tx(lang,'บันทึก','Save')}</Btn><Btn onClick={()=>setModal(null)} variant="ghost" size="sm">{tx(lang,'ยกเลิก','Cancel')}</Btn></>}>
        <Input label={tx(lang,'หัวข้อ TH','Title TH')} value={local.aboutTitle} onChange={v=>lf('aboutTitle',v)} />
        <Input label={tx(lang,'หัวข้อ EN','Title EN')} value={local.aboutTitleEn} onChange={v=>lf('aboutTitleEn',v)} />
        <Textarea label={tx(lang,'เนื้อหา TH','Text TH')} value={local.aboutText} onChange={v=>lf('aboutText',v)} rows={3} />
        <Textarea label={tx(lang,'เนื้อหา EN','Text EN')} value={local.aboutTextEn} onChange={v=>lf('aboutTextEn',v)} rows={3} />
        <Input label={tx(lang,'URL รูปสตูดิโอ','Studio Image URL')} value={local.aboutImage||''} onChange={v=>lf('aboutImage',v)} placeholder="https://..." />
      </Modal>

      {/* Stats Modal */}
      <Modal open={modal==='stats'} onClose={()=>setModal(null)} icon="bar" title={tx(lang,'สถิติ 4 บล็อก','4 Stat Blocks')}
        footer={<><Btn onClick={saveStats} variant="primary" size="sm"><Icon name="check" className="w-3.5 h-3.5"/>{tx(lang,'บันทึก','Save')}</Btn><Btn onClick={()=>setModal(null)} variant="ghost" size="sm">{tx(lang,'ยกเลิก','Cancel')}</Btn></>}>
        {stats.map((s,i) => (
          <div key={i} className="bg-black/40 border border-[#1f1f1f] rounded-xl p-4 space-y-2">
            <Micro className="text-gray-500 block">{tx(lang,'บล็อก','Block')} {i+1}</Micro>
            <div className="grid grid-cols-3 gap-2">
              <Input label={tx(lang,'ค่า','Value')} value={s.val} onChange={v=>lfs('val',i,v)} />
              <Input label="TH" value={s.th} onChange={v=>lfs('th',i,v)} />
              <Input label="EN" value={s.en} onChange={v=>lfs('en',i,v)} />
            </div>
          </div>
        ))}
      </Modal>
    </>
  );
}

// ── Category Chips ────────────────────────────────────────
function CategoriesCards({ lang, categories, setCategories, toast }) {
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ nameTh:'', nameEn:'' });
  const isEdit = modal && modal !== 'add';

  const open = c => { setForm(c==='add'?{nameTh:'',nameEn:''}:{nameTh:c.nameTh,nameEn:c.nameEn}); setModal(c); };
  const close = () => setModal(null);
  const save = () => {
    if (!form.nameTh) return;
    if (isEdit) { setCategories(p=>p.map(c=>c.id===modal.id?{...c,...form}:c)); toast(tx(lang,'แก้ไขแล้ว','Updated'), form.nameTh,'success'); }
    else { setCategories(p=>[...p,{...form,id:`c${Date.now()}`,slug:form.nameEn.toLowerCase().replace(/\s+/g,'-')}]); toast(tx(lang,'เพิ่มแล้ว','Added'), form.nameTh,'success'); }
    close();
  };
  const del = () => { setCategories(p=>p.filter(c=>c.id!==modal.id)); toast(tx(lang,'ลบแล้ว','Deleted'),'','info'); close(); };

  return (
    <>
      <SectionHeader icon="tag" title={tx(lang,'จัดการหมวดหมู่','Manage Categories')}
        sub={`${categories.length} ${tx(lang,'หมวดหมู่','categories')}`}
        action={<Btn onClick={()=>open('add')} variant="primary" size="sm"><Icon name="plus" className="w-3.5 h-3.5"/>{tx(lang,'เพิ่ม','Add')}</Btn>} />
      <div className="flex flex-wrap gap-2">
        <button onClick={()=>open('add')}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border-2 border-dashed border-[#2a2a2a] hover:border-crimson/50 text-gray-600 hover:text-crimson font-mono text-[10px] tracking-widest uppercase transition cursor-pointer">
          <Icon name="plus" className="w-3 h-3" />{tx(lang,'เพิ่มหมวด','Add')}
        </button>
        {categories.map(c => (
          <button key={c.id} onClick={()=>open(c)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-full border border-[#2a2a2a] bg-[#111] hover:border-crimson/50 hover:bg-crimson/5 transition cursor-pointer group">
            <Icon name="tag" className="w-3 h-3 text-gray-500 group-hover:text-crimson transition" />
            <span className="font-mono text-[10px] tracking-widest uppercase text-gray-300 group-hover:text-white">{tx(lang,c.nameTh,c.nameEn)}</span>
          </button>
        ))}
      </div>
      <Modal open={!!modal} onClose={close} icon="tag"
        title={isEdit ? tx(lang,'แก้ไขหมวดหมู่','Edit Category') : tx(lang,'เพิ่มหมวดหมู่','Add Category')}
        footer={<><Btn onClick={save} variant="primary" size="sm"><Icon name="check" className="w-3.5 h-3.5"/>{isEdit?tx(lang,'บันทึก','Save'):tx(lang,'เพิ่ม','Add')}</Btn>{isEdit&&<Btn onClick={del} variant="danger" size="sm"><Icon name="trash" className="w-3.5 h-3.5"/>{tx(lang,'ลบ','Delete')}</Btn>}<Btn onClick={close} variant="ghost" size="sm">{tx(lang,'ยกเลิก','Cancel')}</Btn></>}>
        <Input label={tx(lang,'ชื่อภาษาไทย','Thai Name')} value={form.nameTh} onChange={v=>setForm(p=>({...p,nameTh:v}))} />
        <Input label={tx(lang,'ชื่อภาษาอังกฤษ','English Name')} value={form.nameEn} onChange={v=>setForm(p=>({...p,nameEn:v}))} />
      </Modal>
    </>
  );
}

// ── Artist Cards ──────────────────────────────────────────
const BLANK_ART = { nameTh:'', nameEn:'', specialty:'', experience:'', bio_th:'', imageUrl:'', available:'' };

function ArtistsCards({ lang, artists, setArtists, toast }) {
  const [modal, setModal] = useState(null);
  const isEdit = modal && modal !== 'add';
  const [form, setForm] = useState(BLANK_ART);
  const f = (k,v) => setForm(p=>({...p,[k]:v}));

  const open = a => { setForm(a==='add'?BLANK_ART:{...a}); setModal(a); };
  const close = () => setModal(null);
  const save = () => {
    if (!form.nameTh) return;
    if (isEdit) { setArtists(p=>p.map(a=>a.id===modal.id?{...a,...form}:a)); toast(tx(lang,'แก้ไขแล้ว','Updated'), form.nameTh,'success'); }
    else { setArtists(p=>[...p,{...form,id:`art${Date.now()}`}]); toast(tx(lang,'เพิ่มแล้ว','Added'), form.nameTh,'success'); }
    close();
  };
  const del = () => { setArtists(p=>p.filter(a=>a.id!==modal.id)); toast(tx(lang,'ลบแล้ว','Deleted'),'','info'); close(); };

  return (
    <>
      <SectionHeader icon="eye" title={tx(lang,'จัดการช่างสัก','Manage Artists')}
        sub={`${artists.length} ${tx(lang,'ช่างสัก','artists')}`}
        action={<Btn onClick={()=>open('add')} variant="primary" size="sm"><Icon name="plus" className="w-3.5 h-3.5"/>{tx(lang,'เพิ่มช่าง','Add Artist')}</Btn>} />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        <AddCard onClick={()=>open('add')} label={tx(lang,'เพิ่มช่างสัก','Add Artist')} />
        {artists.map(a => (
          <button key={a.id} onClick={()=>open(a)}
            className="bg-[#111] border border-[#222] hover:border-crimson/50 rounded-2xl overflow-hidden cursor-pointer transition group text-left">
            <div className="relative h-36 overflow-hidden">
              {a.imageUrl ? <img src={a.imageUrl} referrerPolicy="no-referrer" alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center"><Icon name="eye" className="w-8 h-8 text-gray-600" /></div>}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-2 left-2"><Badge tone="crimson">{a.available||'—'}</Badge></div>
            </div>
            <div className="p-3">
              <p className="font-heading text-xs font-bold text-white uppercase truncate">{tx(lang,a.nameTh,a.nameEn)}</p>
              <Micro className="text-crimson block mt-0.5 truncate">{a.specialty}</Micro>
              <Micro className="text-gray-600 block mt-0.5">{a.experience}</Micro>
            </div>
          </button>
        ))}
      </div>

      <Modal open={!!modal} onClose={close} icon="eye"
        title={isEdit ? tx(lang,'แก้ไขช่างสัก','Edit Artist') : tx(lang,'เพิ่มช่างสัก','Add Artist')}
        footer={<><Btn onClick={save} variant="primary" size="sm"><Icon name="check" className="w-3.5 h-3.5"/>{isEdit?tx(lang,'บันทึก','Save'):tx(lang,'เพิ่ม','Add')}</Btn>{isEdit&&<Btn onClick={del} variant="danger" size="sm"><Icon name="trash" className="w-3.5 h-3.5"/>{tx(lang,'ลบ','Delete')}</Btn>}<Btn onClick={close} variant="ghost" size="sm">{tx(lang,'ยกเลิก','Cancel')}</Btn></>}>
        {form.imageUrl && <img src={form.imageUrl} referrerPolicy="no-referrer" alt="" className="w-20 h-20 object-cover rounded-2xl border border-[#222] mx-auto" />}
        <div className="grid grid-cols-2 gap-3">
          <Input label={tx(lang,'ชื่อ TH','Name TH')} value={form.nameTh} onChange={v=>f('nameTh',v)} />
          <Input label={tx(lang,'ชื่อ EN','Name EN')} value={form.nameEn} onChange={v=>f('nameEn',v)} />
        </div>
        <Input label={tx(lang,'ความเชี่ยวชาญ','Specialty')} value={form.specialty} onChange={v=>f('specialty',v)} />
        <div className="grid grid-cols-2 gap-3">
          <Input label={tx(lang,'ประสบการณ์','Experience')} value={form.experience} onChange={v=>f('experience',v)} placeholder="5 ปี" />
          <Input label={tx(lang,'วันทำการ','Available')} value={form.available} onChange={v=>f('available',v)} placeholder="จ-ศ" />
        </div>
        <Textarea label={tx(lang,'ประวัติย่อ','Bio TH')} value={form.bio_th} onChange={v=>f('bio_th',v)} rows={2} />
        <Input label="Image URL" value={form.imageUrl} onChange={v=>f('imageUrl',v)} placeholder="https://..." />
      </Modal>
    </>
  );
}

// ── Review Cards ──────────────────────────────────────────
function ReviewCards({ lang, reviews, setReviews, toast }) {
  const [modal, setModal] = useState(null);
  const approve = id => { setReviews(p=>p.map(r=>r.id===id?{...r,status:'approved'}:r)); toast(tx(lang,'อนุมัติแล้ว','Approved'),'','success'); setModal(null); };
  const reject = id => { setReviews(p=>p.map(r=>r.id===id?{...r,status:'rejected'}:r)); toast(tx(lang,'ปฏิเสธแล้ว','Rejected'),'','info'); setModal(null); };
  const del = id => { setReviews(p=>p.filter(r=>r.id!==id)); toast(tx(lang,'ลบแล้ว','Deleted'),'','info'); setModal(null); };

  const counts = { pending:reviews.filter(r=>r.status==='pending').length, approved:reviews.filter(r=>r.status==='approved').length };

  return (
    <>
      <SectionHeader icon="star" title={tx(lang,'จัดการรีวิว','Manage Reviews')}
        sub={`${counts.pending} ${tx(lang,'รอตรวจ','pending')} · ${counts.approved} ${tx(lang,'อนุมัติ','approved')}`} />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {reviews.map(r => (
          <button key={r.id} onClick={()=>setModal(r)}
            className={`text-left bg-[#111] border rounded-2xl p-5 cursor-pointer transition group ${r.status==='pending'?'border-amber-500/30 hover:border-amber-500/60':r.status==='approved'?'border-emerald-500/20 hover:border-emerald-500/40':'border-[#222] hover:border-[#333]'}`}>
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <StarRow n={r.rating} size="w-3 h-3" />
                <Badge tone={r.status==='approved'?'green':r.status==='pending'?'amber':'gray'}>{r.status}</Badge>
              </div>
              <Micro className="text-gray-600">{r.createdAt}</Micro>
            </div>
            <p className="font-heading text-sm font-bold text-white">{r.author}</p>
            {r.artist && <Micro className="text-crimson block mt-0.5">{r.artist}</Micro>}
            <p className="text-gray-500 text-xs mt-2 leading-relaxed line-clamp-2">"{r.message}"</p>
          </button>
        ))}
      </div>

      <Modal open={!!modal} onClose={()=>setModal(null)} icon="star"
        title={tx(lang,'รายละเอียดรีวิว','Review Detail')}
        footer={modal && <>
          {modal.status!=='approved' && <Btn onClick={()=>approve(modal.id)} variant="primary" size="sm"><Icon name="check" className="w-3.5 h-3.5"/>{tx(lang,'อนุมัติ','Approve')}</Btn>}
          {modal.status!=='rejected' && <Btn onClick={()=>reject(modal.id)} variant="outline" size="sm">{tx(lang,'ปฏิเสธ','Reject')}</Btn>}
          <Btn onClick={()=>del(modal.id)} variant="danger" size="sm"><Icon name="trash" className="w-3.5 h-3.5"/>{tx(lang,'ลบ','Delete')}</Btn>
          <Btn onClick={()=>setModal(null)} variant="ghost" size="sm">{tx(lang,'ปิด','Close')}</Btn>
        </>}>
        {modal && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <StarRow n={modal.rating} size="w-4 h-4" />
              <Badge tone={modal.status==='approved'?'green':modal.status==='pending'?'amber':'gray'}>{modal.status}</Badge>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div><Micro className="text-gray-500 block">{tx(lang,'ผู้รีวิว','Author')}</Micro><p className="text-white text-sm mt-1">{modal.author}</p></div>
              <div><Micro className="text-gray-500 block">{tx(lang,'ช่างสัก','Artist')}</Micro><p className="text-crimson text-sm mt-1">{modal.artist||'—'}</p></div>
              <div><Micro className="text-gray-500 block">{tx(lang,'วันที่','Date')}</Micro><p className="text-white text-sm mt-1">{modal.createdAt}</p></div>
            </div>
            <div><Micro className="text-gray-500 block mb-2">{tx(lang,'ข้อความ','Message')}</Micro>
              <p className="text-gray-300 text-sm leading-relaxed bg-black/40 border border-[#1f1f1f] rounded-xl p-4">"{modal.message}"</p>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

Object.assign(window, { AdminContent });

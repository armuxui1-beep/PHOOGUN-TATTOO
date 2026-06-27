// ============================================================
// Admin CMS — Gallery & Albums (Card Grid → Modal UX)
// ============================================================
const { useState } = React;

// Shared modal
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

function AddCard({ onClick, label }) {
  return (
    <button onClick={onClick}
      className="flex flex-col items-center justify-center gap-2 bg-[#0d0d0d] border-2 border-dashed border-[#2a2a2a] hover:border-crimson/50 rounded-xl aspect-square cursor-pointer transition group min-h-[120px]">
      <div className="w-8 h-8 rounded-full bg-[#1a1a1a] group-hover:bg-crimson/10 border border-[#2a2a2a] group-hover:border-crimson/30 flex items-center justify-center transition">
        <Icon name="plus" className="w-4 h-4 text-gray-500 group-hover:text-crimson transition" />
      </div>
      <Micro className="text-gray-600 group-hover:text-crimson transition">{label}</Micro>
    </button>
  );
}

function AdminGallery({ lang, images, setImages, albums, setAlbums, categories, toast }) {
  const [tab, setTab] = useState('images');
  const TABS = [
    ['images','image',tx(lang,'รูปภาพ','Images')],
    ['albums','folder',tx(lang,'อัลบั้ม','Albums')],
  ];
  return (
    <div className="space-y-6">
      <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
        {TABS.map(([k,ic,label]) => (
          <button key={k} onClick={()=>setTab(k)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-mono text-[10px] tracking-widest uppercase transition cursor-pointer ${tab===k?'bg-crimson text-white':'bg-[#1a1a1a] border border-[#2a2a2a] text-gray-400 hover:text-white'}`}>
            <Icon name={ic} className="w-3.5 h-3.5"/>{label}
          </button>
        ))}
      </div>
      {tab==='images' && <ImagesGrid lang={lang} images={images} setImages={setImages} albums={albums} categories={categories} toast={toast} />}
      {tab==='albums' && <AlbumsGrid lang={lang} albums={albums} setAlbums={setAlbums} images={images} toast={toast} />}
    </div>
  );
}

// ── Image Cards Grid ──────────────────────────────────────
const BLANK_IMG = { title:'', artist:'', categoryId:'', albumId:'', imageUrl:'', tags:'', featured:false, likes:0 };

function ImagesGrid({ lang, images, setImages, albums, categories, toast }) {
  const [modal, setModal] = useState(null); // null | 'add' | image object
  const isEdit = modal && modal !== 'add';
  const [form, setForm] = useState(BLANK_IMG);
  const f = (k,v) => setForm(p=>({...p,[k]:v}));
  const tagsArr = t => (t||'').split(',').map(x=>x.trim()).filter(Boolean);

  const open = (img) => {
    if (img === 'add') { setForm(BLANK_IMG); }
    else { setForm({...img, tags:(img.tags||[]).join(', ')}); }
    setModal(img);
  };
  const close = () => setModal(null);

  const save = () => {
    if (!form.title || !form.imageUrl) return toast(tx(lang,'กรอกชื่อและ URL','Fill title & URL'),'','warning');
    if (isEdit) {
      setImages(p=>p.map(i=>i.id===modal.id?{...i,...form,tags:tagsArr(form.tags)}:i));
      toast(tx(lang,'แก้ไขแล้ว','Updated'), form.title, 'success');
    } else {
      setImages(p=>[{...form,id:`img${Date.now()}`,tags:tagsArr(form.tags)},...p]);
      toast(tx(lang,'เพิ่มแล้ว','Added'), form.title, 'success');
    }
    close();
  };

  const del = () => {
    setImages(p=>p.filter(i=>i.id!==modal.id));
    toast(tx(lang,'ลบแล้ว','Deleted'),'','info');
    close();
  };

  return (
    <>
      <SectionHeader icon="image" title={tx(lang,'จัดการรูปภาพ','Manage Images')}
        sub={`${images.length} ${tx(lang,'รูปทั้งหมด','total images')}`}
        action={<Btn onClick={()=>open('add')} variant="primary" size="sm"><Icon name="plus" className="w-3.5 h-3.5"/>{tx(lang,'เพิ่มรูป','Add Image')}</Btn>} />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        <AddCard onClick={()=>open('add')} label={tx(lang,'เพิ่มรูปใหม่','New Image')} />
        {images.map(img => (
          <button key={img.id} onClick={()=>open(img)}
            className="relative rounded-xl overflow-hidden cursor-pointer border border-[#222] hover:border-crimson/50 transition group text-left aspect-square">
            <img src={img.imageUrl} alt={img.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onError={e=>{e.target.style.background='#1a1a1a';}} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition" />
            <div className="absolute bottom-0 left-0 right-0 p-2.5 translate-y-1 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all">
              <p className="font-heading text-xs font-bold text-white uppercase truncate leading-tight">{img.title}</p>
              <Micro className="text-gray-400 block mt-0.5 truncate">{img.artist}</Micro>
            </div>
            {img.featured && <div className="absolute top-2 left-2"><span className="bg-crimson text-white font-mono text-[8px] px-1.5 py-0.5 rounded tracking-widest uppercase">★</span></div>}
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition">
              <span className="bg-black/70 border border-[#333] text-gray-300 font-mono text-[8px] px-1.5 py-0.5 rounded">♡ {img.likes}</span>
            </div>
          </button>
        ))}
      </div>

      <Modal open={!!modal} onClose={close} icon="image"
        title={isEdit ? tx(lang,'แก้ไขรูปภาพ','Edit Image') : tx(lang,'เพิ่มรูปภาพ','Add Image')}
        footer={<>
          <Btn onClick={save} variant="primary" size="sm"><Icon name="check" className="w-3.5 h-3.5"/>{isEdit ? tx(lang,'บันทึก','Save') : tx(lang,'เพิ่ม','Add')}</Btn>
          {isEdit && <Btn onClick={del} variant="danger" size="sm"><Icon name="trash" className="w-3.5 h-3.5"/>{tx(lang,'ลบ','Delete')}</Btn>}
          <Btn onClick={close} variant="ghost" size="sm">{tx(lang,'ยกเลิก','Cancel')}</Btn>
        </>}>
        {form.imageUrl && <img src={form.imageUrl} alt="" className="w-full h-32 object-cover rounded-xl border border-[#222]" onError={e=>e.target.style.display='none'}/>}
        <Input label="URL รูปภาพ" value={form.imageUrl} onChange={v=>f('imageUrl',v)} placeholder="https://..." />
        <div className="grid grid-cols-2 gap-3">
          <Input label={tx(lang,'ชื่อผลงาน','Title')} value={form.title} onChange={v=>f('title',v)} />
          <Input label={tx(lang,'ช่างสัก','Artist')} value={form.artist} onChange={v=>f('artist',v)} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Micro className="text-gray-500">{tx(lang,'หมวดหมู่','Category')}</Micro>
            <select value={form.categoryId} onChange={e=>f('categoryId',e.target.value)} className="w-full bg-black/60 border border-[#2a2a2a] text-gray-300 text-xs rounded-xl px-3 py-2.5 outline-none cursor-pointer">
              <option value="">{tx(lang,'เลือก...','Choose...')}</option>
              {categories.map(c=><option key={c.id} value={c.id}>{tx(lang,c.nameTh,c.nameEn)}</option>)}
            </select>
          </div>
          <div className="space-y-1.5">
            <Micro className="text-gray-500">{tx(lang,'อัลบั้ม','Album')}</Micro>
            <select value={form.albumId} onChange={e=>f('albumId',e.target.value)} className="w-full bg-black/60 border border-[#2a2a2a] text-gray-300 text-xs rounded-xl px-3 py-2.5 outline-none cursor-pointer">
              <option value="">{tx(lang,'เลือก...','Choose...')}</option>
              {albums.map(a=><option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
        </div>
        <Input label={tx(lang,'แท็ก (คั่น ,)','Tags (comma)')} value={form.tags} onChange={v=>f('tags',v)} placeholder="dragon, sleeve, blackwork" />
        <div className="flex items-center gap-6">
          <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-300">
            <input type="checkbox" checked={form.featured} onChange={e=>f('featured',e.target.checked)} className="accent-crimson" />
            {tx(lang,'Featured','Featured')}
          </label>
          <div className="flex items-center gap-2">
            <Micro className="text-gray-500">Likes:</Micro>
            <input type="number" value={form.likes} onChange={e=>f('likes',+e.target.value)} className="w-20 bg-black/60 border border-[#2a2a2a] text-sm text-gray-300 rounded-lg px-2 py-1.5 outline-none" />
          </div>
        </div>
      </Modal>
    </>
  );
}

// ── Album Cards Grid ──────────────────────────────────────
const BLANK_ALB = { name:'', descTh:'', promoted:false, cover:'' };

function AlbumsGrid({ lang, albums, setAlbums, images, toast }) {
  const [modal, setModal] = useState(null);
  const isEdit = modal && modal !== 'add';
  const [form, setForm] = useState(BLANK_ALB);
  const f = (k,v) => setForm(p=>({...p,[k]:v}));

  const open = (a) => { setForm(a === 'add' ? BLANK_ALB : {...a}); setModal(a); };
  const close = () => setModal(null);
  const save = () => {
    if (!form.name) return;
    if (isEdit) { setAlbums(p=>p.map(a=>a.id===modal.id?{...a,...form}:a)); toast(tx(lang,'แก้ไขแล้ว','Updated'), form.name, 'success'); }
    else { setAlbums(p=>[...p,{...form,id:`a${Date.now()}`}]); toast(tx(lang,'เพิ่มแล้ว','Added'), form.name, 'success'); }
    close();
  };
  const del = () => { setAlbums(p=>p.filter(a=>a.id!==modal.id)); toast(tx(lang,'ลบแล้ว','Deleted'),'','info'); close(); };

  return (
    <>
      <SectionHeader icon="folder" title={tx(lang,'จัดการอัลบั้ม','Manage Albums')}
        sub={`${albums.length} ${tx(lang,'อัลบั้ม','albums')}`}
        action={<Btn onClick={()=>open('add')} variant="primary" size="sm"><Icon name="plus" className="w-3.5 h-3.5"/>{tx(lang,'สร้างอัลบั้ม','New Album')}</Btn>} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <AddCard onClick={()=>open('add')} label={tx(lang,'อัลบั้มใหม่','New Album')} />
        {albums.map(a => {
          const count = images.filter(i=>i.albumId===a.id).length;
          return (
            <button key={a.id} onClick={()=>open(a)}
              className="relative rounded-xl overflow-hidden cursor-pointer border border-[#222] hover:border-crimson/50 transition group text-left h-36">
              {a.cover ? <img src={a.cover} alt={a.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" /> : <div className="w-full h-full bg-[#1a1a1a] flex items-center justify-center"><Icon name="folder" className="w-8 h-8 text-gray-600" /></div>}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <div className="flex items-center gap-2 mb-1">
                  {a.promoted && <Badge tone="amber"><Icon name="promote" className="w-2.5 h-2.5"/>Promoted</Badge>}
                  <Micro className="text-gray-400">{count} {tx(lang,'รูป','imgs')}</Micro>
                </div>
                <p className="font-heading text-sm font-bold text-white uppercase truncate">{a.name}</p>
              </div>
            </button>
          );
        })}
      </div>

      <Modal open={!!modal} onClose={close} icon="folder"
        title={isEdit ? tx(lang,'แก้ไขอัลบั้ม','Edit Album') : tx(lang,'สร้างอัลบั้ม','New Album')}
        footer={<>
          <Btn onClick={save} variant="primary" size="sm"><Icon name="check" className="w-3.5 h-3.5"/>{isEdit ? tx(lang,'บันทึก','Save') : tx(lang,'สร้าง','Create')}</Btn>
          {isEdit && <Btn onClick={del} variant="danger" size="sm"><Icon name="trash" className="w-3.5 h-3.5"/>{tx(lang,'ลบ','Delete')}</Btn>}
          <Btn onClick={close} variant="ghost" size="sm">{tx(lang,'ยกเลิก','Cancel')}</Btn>
        </>}>
        {form.cover && <img src={form.cover} alt="" className="w-full h-24 object-cover rounded-xl border border-[#222]" onError={e=>e.target.style.display='none'}/>}
        <Input label={tx(lang,'ชื่ออัลบั้ม','Album Name')} value={form.name} onChange={v=>f('name',v)} />
        <Textarea label={tx(lang,'คำอธิบาย','Description')} value={form.descTh} onChange={v=>f('descTh',v)} rows={2} />
        <Input label={tx(lang,'URL รูปปก','Cover Image URL')} value={form.cover} onChange={v=>f('cover',v)} placeholder="https://..." />
        <label className="flex items-center gap-2 cursor-pointer text-sm text-gray-300">
          <input type="checkbox" checked={form.promoted} onChange={e=>f('promoted',e.target.checked)} className="accent-crimson" />
          {tx(lang,'โปรโมทใน Featured Strip','Show in Featured Strip')}
        </label>
      </Modal>
    </>
  );
}

Object.assign(window, { AdminGallery });

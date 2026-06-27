// phoogun-client.jsx — Client-facing View
const {useState, useMemo, useEffect} = React;

const inputSt = {width:'100%',background:'#0f0f0f',border:'1px solid #252525',borderRadius:8,padding:'10px 14px',fontSize:13,color:'#fff',outline:'none',fontFamily:'Prompt,sans-serif'};
const btnRed = {background:'#e6192e',color:'#fff',border:'none',borderRadius:8,padding:'12px 22px',fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:'Space Grotesk,sans-serif',letterSpacing:'0.08em',textTransform:'uppercase'};
const cardSt = {background:'#0f0f0f',border:'1px solid #1a1a1a',borderRadius:12,overflow:'hidden'};

// ─── GALLERY TAB ───────────────────────────────────────────────────────────
const GalleryTab = ({gallery, lang, onQuickView}) => {
  const cats = ['ทั้งหมด','นีโอ-อิเรซูมิ','ไซเบอร์-แบล็คเวิร์ค','ดาร์ก มินิมอล','โอเรียนทัล','อักขระและฟอนต์'];
  const [cat,setCat] = useState('ทั้งหมด');
  const [q,setQ] = useState('');
  const filtered = useMemo(()=>gallery.filter(it=>(cat==='ทั้งหมด'||it.category===cat)&&(!q||[it.name,it.artist,it.category,it.description].some(f=>f.toLowerCase().includes(q.toLowerCase())))),[gallery,cat,q]);

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:18,flexWrap:'wrap',gap:12}}>
        <div style={{fontSize:22,fontWeight:900,color:'#fff',fontFamily:'Space Grotesk,sans-serif',textTransform:'uppercase',display:'flex',alignItems:'center',gap:10}}>
          <span style={{width:10,height:10,background:'#e6192e',borderRadius:2,display:'inline-block',flexShrink:0}}></span>
          {lang==='TH'?'แกลเลอรีผลงาน':'MASTER PORTFOLIO'}
        </div>
        <div style={{position:'relative'}}>
          <span style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',color:'#444',pointerEvents:'none',display:'flex'}}>
            <window.SearchIcon size={14}/>
          </span>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder={lang==='TH'?'ค้นหาลาย ศิลปิน...':'Search tattoos, artists...'} style={{...inputSt,paddingLeft:36,width:220,borderRadius:20,fontSize:12}}/>
        </div>
      </div>
      <div style={{display:'flex',gap:8,marginBottom:20,flexWrap:'wrap'}}>
        {cats.map(c=>(
          <button key={c} onClick={()=>setCat(c)} style={{padding:'6px 14px',borderRadius:20,border:`1px solid ${cat===c?'#e6192e':'#222'}`,background:cat===c?'rgba(230,25,46,0.1)':'transparent',color:cat===c?'#e6192e':'#666',fontSize:10,fontWeight:700,cursor:'pointer',fontFamily:'Space Grotesk,sans-serif',letterSpacing:'0.06em',textTransform:'uppercase'}}>
            {c}
          </button>
        ))}
      </div>
      {!filtered.length
        ? <div style={{textAlign:'center',padding:'80px 0',color:'#444',fontSize:14}}>{lang==='TH'?'ไม่พบผลงานที่ตรงกัน':'No results found.'}</div>
        : (
          <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(270px,1fr))',gap:20}}>
            {filtered.map(item=>{
              const cs=item.name.split('').reduce((a,c)=>a+c.charCodeAt(0),0);
              const likes=(cs%140)+60+(item.id==='gal-001'?300:item.id==='gal-003'?250:0);
              return (
                <div key={item.id} onClick={()=>onQuickView(item)} style={{...cardSt,cursor:'pointer',transition:'transform 0.2s,box-shadow 0.2s'}}
                  onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-5px)';e.currentTarget.style.boxShadow='0 12px 32px rgba(0,0,0,0.5)';}}
                  onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='';}}>
                  <div style={{position:'relative',aspectRatio:'4/5',background:'#070707',overflow:'hidden'}}>
                    <span style={{position:'absolute',top:10,left:10,background:'rgba(0,0,0,0.85)',border:'1px solid rgba(230,25,46,0.25)',borderRadius:4,padding:'3px 8px',fontSize:9,color:'#e6192e',fontFamily:'JetBrains Mono,monospace',zIndex:1,textTransform:'uppercase'}}>{item.category}</span>
                    <img src={item.imageUrl} alt={item.name} style={{width:'100%',height:'100%',objectFit:'cover',filter:'grayscale(100%)',transition:'filter 0.5s,transform 0.5s'}}
                      onMouseEnter={e=>{e.target.style.filter='grayscale(30%)';e.target.style.transform='scale(1.06)';}}
                      onMouseLeave={e=>{e.target.style.filter='grayscale(100%)';e.target.style.transform='';}} referrerPolicy="no-referrer"/>
                    <div style={{position:'absolute',inset:0,background:'linear-gradient(to top,rgba(0,0,0,0.85),transparent 60%)',pointerEvents:'none'}}></div>
                  </div>
                  <div style={{padding:16}}>
                    <div style={{fontSize:10,color:'#e6192e',fontFamily:'JetBrains Mono,monospace'}}>Designer: {item.artist}</div>
                    <div style={{fontSize:14,fontWeight:700,color:'#fff',marginTop:4,fontFamily:'Space Grotesk,sans-serif',textTransform:'uppercase'}}>{item.name}</div>
                    <div style={{fontSize:12,color:'#555',marginTop:6,lineHeight:1.5,display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{item.description}</div>
                    <div style={{display:'flex',gap:14,marginTop:10,fontSize:11,color:'#444',fontFamily:'JetBrains Mono,monospace'}}>
                      <span style={{display:'flex',alignItems:'center',gap:4}}><window.HeartIcon size={12} style={{color:'#e6192e'}}/>{likes}</span>
                      <span style={{display:'flex',alignItems:'center',gap:4}}><window.FlameIcon size={12} style={{color:'#f59e0b'}}/>{likes*4+cs%30}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      }
    </div>
  );
};

// ─── ARTISTS TAB ──────────────────────────────────────────────────────────
const ArtistsTab = ({artists, lang, onBookArtist}) => (
  <div>
    <div style={{textAlign:'center',marginBottom:36}}>
      <div style={{fontSize:10,color:'#e6192e',fontFamily:'JetBrains Mono,monospace',textTransform:'uppercase',letterSpacing:'0.18em'}}>THE INK MASTERS</div>
      <div style={{fontSize:28,fontWeight:900,color:'#fff',fontFamily:'Space Grotesk,sans-serif',textTransform:'uppercase',marginTop:10}}>{lang==='TH'?'ช่างสักฝีมือ':'TATTOO ARTISTS'}</div>
    </div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(220px,1fr))',gap:20}}>
      {artists.map(art=>(
        <div key={art.id} style={{...cardSt,transition:'box-shadow 0.2s'}}
          onMouseEnter={e=>e.currentTarget.style.boxShadow='0 0 0 1px rgba(230,25,46,0.3)'}
          onMouseLeave={e=>e.currentTarget.style.boxShadow=''}>
          <div style={{aspectRatio:'4/5',overflow:'hidden',position:'relative',background:'#070707'}}>
            <img src={art.imageUrl} alt={art.nameEn} style={{width:'100%',height:'100%',objectFit:'cover',filter:'grayscale(100%)',transition:'filter 0.4s'}}
              onMouseEnter={e=>e.target.style.filter='grayscale(20%)'}
              onMouseLeave={e=>e.target.style.filter='grayscale(100%)'} referrerPolicy="no-referrer"/>
            <div style={{position:'absolute',inset:0,background:'linear-gradient(to top,rgba(0,0,0,0.8),transparent 60%)',pointerEvents:'none'}}></div>
          </div>
          <div style={{padding:16}}>
            <div style={{fontSize:10,color:'#e6192e',fontFamily:'JetBrains Mono,monospace',textTransform:'uppercase',letterSpacing:'0.1em'}}>{art.specialty}</div>
            <div style={{fontSize:15,fontWeight:700,color:'#fff',fontFamily:'Space Grotesk,sans-serif',textTransform:'uppercase',marginTop:4}}>ช่าง {lang==='TH'?art.nameTh:art.nameEn}</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:6,marginTop:10,padding:10,background:'rgba(0,0,0,0.5)',borderRadius:8,border:'1px solid #161616'}}>
              <div><div style={{fontSize:9,color:'#444',fontFamily:'JetBrains Mono,monospace'}}>EXP</div><div style={{fontSize:12,color:'#fff',fontWeight:700}}>{art.experience}</div></div>
              <div><div style={{fontSize:9,color:'#444',fontFamily:'JetBrains Mono,monospace'}}>AVAIL</div><div style={{fontSize:12,color:'#10b981',fontWeight:700}}>{art.availability}</div></div>
            </div>
            <button onClick={()=>onBookArtist(art.nameTh)} style={{...btnRed,width:'100%',marginTop:12,padding:'10px',fontSize:11,display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
              <window.ScissorsIcon size={12}/>{lang==='TH'?'จองคิวช่างท่านนี้':'BOOK SESSION'}
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ─── BOOKING TAB ──────────────────────────────────────────────────────────
const BookingTab = ({artists, lang, bookPreset, onSuccess, addToast}) => {
  const defForm = {name:'',phone:'',email:'',date:'',time:'12:00',artist:artists[0]?.nameTh||'กิม',style:'ดาร์ก มินิมอล',size:'10x10 cm',note:''};
  const [form,setForm] = useState(defForm);
  const [busy,setBusy] = useState(false);
  const [done,setDone] = useState(null);
  const [err,setErr] = useState('');
  useEffect(()=>{ if(bookPreset) setForm(p=>({...p,...bookPreset})); },[bookPreset]);

  const F = (label,child,req=false) => (
    <div>
      <label style={{fontSize:10,color:'#666',fontFamily:'JetBrains Mono,monospace',textTransform:'uppercase',letterSpacing:'0.1em',display:'block',marginBottom:6}}>
        {label}{req&&<span style={{color:'#e6192e'}}> *</span>}
      </label>
      {child}
    </div>
  );
  const sel = {...inputSt,appearance:'none',cursor:'pointer',paddingRight:32,backgroundImage:`url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23555' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,backgroundRepeat:'no-repeat',backgroundPosition:'right 10px center',backgroundSize:16};
  const styles = ['ดาร์ก มินิมอล','ไซเบอร์-แบล็คเวิร์ค','นีโอ-อิเรซูมิ','โอเรียนทัล','อักขระและฟอนต์'];
  const sizes = ['5x5 cm','8x8 cm','10x10 cm','A5 Size','A4 Size','Half-Sleeve','Full-Sleeve'];
  const times = ['10:00','11:00','12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00'];

  const submit = async (e) => {
    e.preventDefault();
    if(!form.name||!form.phone||!form.date){setErr(lang==='TH'?'กรุณากรอกชื่อ เบอร์โทร และวันที่':'Please fill name, phone & date.');return;}
    setBusy(true);setErr('');
    await new Promise(r=>setTimeout(r,700));
    const id=`APT-${9290+Math.floor(Math.random()*500)}`;
    onSuccess({id,...form,status:'Pending',createdAt:new Date().toISOString()});
    setDone(id);setBusy(false);
  };

  if(done) return (
    <div style={{maxWidth:520,margin:'60px auto',textAlign:'center'}}>
      <div style={{width:64,height:64,background:'rgba(16,185,129,0.08)',border:'1px solid rgba(16,185,129,0.25)',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 20px'}}>
        <window.CheckIcon size={28} style={{color:'#10b981'}}/>
      </div>
      <div style={{fontSize:22,fontWeight:900,color:'#fff',fontFamily:'Space Grotesk,sans-serif',textTransform:'uppercase'}}>{lang==='TH'?'จองคิวสำเร็จ!':'Booking Confirmed!'}</div>
      <div style={{fontFamily:'JetBrains Mono,monospace',fontSize:20,fontWeight:900,color:'#fff',background:'#111',border:'1px solid #333',borderRadius:8,padding:'12px 28px',display:'inline-block',marginTop:16}}>{done}</div>
      <br/><button onClick={()=>setDone(null)} style={{...btnRed,marginTop:20,fontSize:11}}>{lang==='TH'?'จองอีกครั้ง':'BOOK AGAIN'}</button>
    </div>
  );

  return (
    <div style={{maxWidth:660,margin:'0 auto'}}>
      <div style={{marginBottom:28,textAlign:'center'}}>
        <div style={{fontSize:10,color:'#e6192e',fontFamily:'JetBrains Mono,monospace',textTransform:'uppercase',letterSpacing:'0.18em'}}>INCEPTION GATE</div>
        <div style={{fontSize:26,fontWeight:900,color:'#fff',fontFamily:'Space Grotesk,sans-serif',textTransform:'uppercase',marginTop:8}}>{lang==='TH'?'ระบบจองคิวสัก':'BOOK YOUR SESSION'}</div>
      </div>
      {err&&<div style={{background:'rgba(239,68,68,0.08)',border:'1px solid rgba(239,68,68,0.25)',color:'#f87171',padding:'10px 16px',borderRadius:8,fontSize:12,marginBottom:16}}>{err}</div>}
      <form onSubmit={submit} style={{background:'#0f0f0f',border:'1px solid #1a1a1a',borderRadius:16,padding:28,display:'flex',flexDirection:'column',gap:14}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14}}>
          {F(lang==='TH'?'ชื่อ-นามสกุล':'Full Name',<input required value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder={lang==='TH'?'เช่น สมชาย ใจดี':'e.g. Alex Dark'} style={inputSt}/>,true)}
          {F(lang==='TH'?'เบอร์โทร':'Phone',<input required value={form.phone} onChange={e=>setForm(p=>({...p,phone:e.target.value}))} placeholder="089-XXX-XXXX" style={inputSt}/>,true)}
          {F('Email',<input type="email" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} placeholder="you@email.com" style={inputSt}/>)}
          {F(lang==='TH'?'วันที่':'Date',<input required type="date" value={form.date} onChange={e=>setForm(p=>({...p,date:e.target.value}))} style={{...inputSt,colorScheme:'dark'}}/>,true)}
          {F(lang==='TH'?'เวลา':'Time',<select value={form.time} onChange={e=>setForm(p=>({...p,time:e.target.value}))} style={sel}>{times.map(t=><option key={t} value={t}>{t}</option>)}</select>)}
          {F(lang==='TH'?'ช่างสัก':'Artist',<select value={form.artist} onChange={e=>setForm(p=>({...p,artist:e.target.value}))} style={sel}>{artists.map(a=><option key={a.id} value={a.nameTh}>{lang==='TH'?`ช่าง ${a.nameTh}`:a.nameEn}</option>)}</select>)}
          {F(lang==='TH'?'สไตล์':'Style',<select value={form.style} onChange={e=>setForm(p=>({...p,style:e.target.value}))} style={sel}>{styles.map(s=><option key={s} value={s}>{s}</option>)}</select>)}
          {F(lang==='TH'?'ขนาด':'Size',<select value={form.size} onChange={e=>setForm(p=>({...p,size:e.target.value}))} style={sel}>{sizes.map(s=><option key={s} value={s}>{s}</option>)}</select>)}
        </div>
        {F(lang==='TH'?'หมายเหตุ (แนวคิด / ตำแหน่ง / สี)':'Notes (concept, placement, colors)',
          <textarea value={form.note} onChange={e=>setForm(p=>({...p,note:e.target.value}))} rows={3} placeholder={lang==='TH'?'บอกรายละเอียดที่ต้องการ...':'Describe your vision...'} style={{...inputSt,resize:'vertical'}}/>
        )}
        <button type="submit" disabled={busy} style={{...btnRed,marginTop:4,padding:'14px',display:'flex',alignItems:'center',justifyContent:'center',gap:8,opacity:busy?0.6:1}}>
          <window.CalIcon size={16}/>{busy?(lang==='TH'?'กำลังส่ง...':'Sending...'):(lang==='TH'?'ยืนยันการจองคิว':'CONFIRM BOOKING')}
        </button>
      </form>
    </div>
  );
};

// ─── ABOUT TAB ────────────────────────────────────────────────────────────
const AboutTab = ({lang}) => (
  <div style={{maxWidth:780,margin:'0 auto'}}>
    <div style={{textAlign:'center',marginBottom:36}}>
      <div style={{fontSize:10,color:'#e6192e',fontFamily:'JetBrains Mono,monospace',textTransform:'uppercase',letterSpacing:'0.18em'}}>STUDIO STORY</div>
      <div style={{fontSize:26,fontWeight:900,color:'#fff',fontFamily:'Space Grotesk,sans-serif',textTransform:'uppercase',marginTop:10}}>
        {lang==='TH'?'เกี่ยวกับ PHOOGUN TATTOO':'ABOUT PHOOGUN TATTOO'}
      </div>
      <p style={{color:'#777',marginTop:14,lineHeight:1.8,fontSize:14,maxWidth:620,margin:'14px auto 0'}}>
        {lang==='TH'?'PHOOGUN TATTOO ผสมผสานศิลปะไซเบอร์แบล็คเวิร์ค ฟอนต์กอธิค และนีโออิเรซูมิ สตูดิโอสักระดับพรีเมียมที่มอบผลงานเหนือกาลเวลาด้วยวัสดุเกรดการแพทย์':'PHOOGUN TATTOO blends cyber-blackwork, gothic typography & Neo-Irezumi. Ultra-premium studio delivering timeless relics with medical-grade precision.'}
      </p>
    </div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:14,marginBottom:24}}>
      {[{n:'01',th:'ความปลอดภัยระดับโรงพยาบาล',en:'Hospital-Grade Safety',dth:'เข็มบรรจุใหม่รายบุคคล หมึกนำเข้าคุณภาพสูงสุด',den:'Single-use sealed needles, premium imported inks.'},
        {n:'02',th:'ออกแบบเฉพาะบุคคล',en:'Custom Design Draft',dth:'ดราฟต์ทดสอบบนร่างกายจริง จนกว่าคุณจะพอใจ',den:'Live stencil testing on your body until perfection.'},
        {n:'03',th:'ดูแลหลังการสัก 2 ปี',en:'2-Year Aftercare',dth:'ครีมบำรุงฟรี ติดตามผลต่อเนื่องสองปี',den:'Complimentary ointment & 2-year healing support.'},
      ].map(item=>(
        <div key={item.n} style={{background:'#0f0f0f',border:'1px solid #1a1a1a',borderRadius:12,padding:20}}>
          <div style={{fontSize:10,color:'#e6192e',fontWeight:900,fontFamily:'JetBrains Mono,monospace',marginBottom:8}}>{item.n} /</div>
          <div style={{fontSize:14,fontWeight:700,color:'#fff',fontFamily:'Space Grotesk,sans-serif',textTransform:'uppercase',marginBottom:8}}>{lang==='TH'?item.th:item.en}</div>
          <div style={{fontSize:12,color:'#666',lineHeight:1.6}}>{lang==='TH'?item.dth:item.den}</div>
        </div>
      ))}
    </div>
    <div style={{background:'#0f0f0f',border:'1px solid #1a1a1a',borderRadius:12,padding:20,display:'flex',alignItems:'center',gap:16}}>
      <window.MapPinIcon size={20} style={{color:'#e6192e',flexShrink:0}}/>
      <div>
        <div style={{fontSize:13,fontWeight:700,color:'#fff',fontFamily:'Space Grotesk,sans-serif'}}>{lang==='TH'?'ที่ตั้งสตูดิโอ':'Studio Location'}</div>
        <div style={{fontSize:12,color:'#666',marginTop:4}}>{lang==='TH'?'PHOOGUN Horizon Tower ชั้น 4, ซอยทองหล่อ 13, สุขุมวิท 55, กรุงเทพฯ':'PHOOGUN Horizon Tower, 4F, Thonglor Soi 13, Sukhumvit 55, Bangkok'}</div>
        <div style={{fontSize:10,color:'#444',marginTop:3,fontFamily:'JetBrains Mono,monospace'}}>{lang==='TH'?'เปิด 12:00–21:00 น. (หยุดทุกวันพฤหัส)':'Open 12:00–21:00 (Closed Thursdays)'}</div>
      </div>
    </div>
  </div>
);

// ─── REVIEWS TAB ──────────────────────────────────────────────────────────
const ReviewsTab = ({reviews=[], lang, onNewReview, addToast}) => {
  const [form,setForm] = useState({author:'',rating:5,artist:'กิม',message:''});
  const [sent,setSent] = useState(false);
  const approved = reviews.filter(r=>r.status==='Approved');

  const submit = (e) => {
    e.preventDefault();
    if(!form.author||!form.message){addToast('กรุณากรอกข้อมูลให้ครบ','Please fill all required fields.','warning');return;}
    onNewReview({id:`REV-${Date.now()}`,status:'Pending',createdAt:new Date().toISOString(),...form});
    setSent(true);
  };
  return (
    <div>
      <div style={{fontSize:22,fontWeight:900,color:'#fff',fontFamily:'Space Grotesk,sans-serif',textTransform:'uppercase',display:'flex',alignItems:'center',gap:10,marginBottom:24}}>
        <span style={{width:10,height:10,background:'#e6192e',borderRadius:2,display:'inline-block'}}></span>
        {lang==='TH'?'รีวิวจากลูกค้า':'CLIENT REVIEWS'}
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:16,marginBottom:32}}>
        {approved.map(r=>(
          <div key={r.id} style={{background:'#0f0f0f',border:'1px solid #1a1a1a',borderRadius:12,padding:20}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
              <div style={{fontWeight:700,color:'#fff',fontSize:14}}>{r.author}</div>
              <div style={{color:'#f59e0b',letterSpacing:2,fontSize:13}}>{'★'.repeat(r.rating)}</div>
            </div>
            <div style={{fontSize:10,color:'#e6192e',marginTop:4,fontFamily:'JetBrains Mono,monospace'}}>ช่าง{r.artist}</div>
            <div style={{fontSize:12,color:'#777',marginTop:10,lineHeight:1.7}}>{r.message}</div>
          </div>
        ))}
        {!approved.length&&<div style={{color:'#444',fontSize:13,padding:'40px 0'}}>{lang==='TH'?'ยังไม่มีรีวิว':'No reviews yet.'}</div>}
      </div>
      {sent ? (
        <div style={{textAlign:'center',padding:32,background:'rgba(16,185,129,0.04)',border:'1px solid rgba(16,185,129,0.15)',borderRadius:12}}>
          <window.CheckIcon size={32} style={{color:'#10b981',display:'block',margin:'0 auto 12px'}}/>
          <div style={{fontSize:15,fontWeight:700,color:'#fff'}}>{lang==='TH'?'ส่งรีวิวสำเร็จ!':'Review Submitted!'}</div>
          <div style={{fontSize:12,color:'#777',marginTop:6}}>{lang==='TH'?'จะแสดงหลังทีมงานตรวจสอบ':'Will appear after moderation.'}</div>
        </div>
      ) : (
        <div style={{background:'#0f0f0f',border:'1px solid #1a1a1a',borderRadius:12,padding:24}}>
          <div style={{fontSize:14,fontWeight:700,color:'#fff',fontFamily:'Space Grotesk,sans-serif',textTransform:'uppercase',marginBottom:16}}>{lang==='TH'?'แชร์ประสบการณ์ของคุณ':'SHARE YOUR EXPERIENCE'}</div>
          <form onSubmit={submit} style={{display:'flex',flexDirection:'column',gap:12}}>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
              <input required value={form.author} onChange={e=>setForm(p=>({...p,author:e.target.value}))} placeholder={lang==='TH'?'ชื่อของคุณ':'Your name'} style={inputSt}/>
              <select value={form.artist} onChange={e=>setForm(p=>({...p,artist:e.target.value}))} style={{...inputSt,appearance:'none',cursor:'pointer'}}>
                {['กิม','พิมพ์ดาว','กวิน','เจตน์'].map(a=><option key={a} value={a}>{`ช่าง${a}`}</option>)}
              </select>
            </div>
            <div style={{display:'flex',gap:4,padding:'6px 10px',background:'#070707',border:'1px solid #1a1a1a',borderRadius:8,width:'fit-content'}}>
              {[1,2,3,4,5].map(n=>(
                <button key={n} type="button" onClick={()=>setForm(p=>({...p,rating:n}))} style={{background:'none',border:'none',cursor:'pointer',fontSize:22,color:n<=form.rating?'#f59e0b':'#333',padding:'0 2px'}}>★</button>
              ))}
            </div>
            <textarea required value={form.message} onChange={e=>setForm(p=>({...p,message:e.target.value}))} rows={3} placeholder={lang==='TH'?'เขียนรีวิวของคุณ...':'Write your review...'} style={{...inputSt,resize:'vertical'}}/>
            <button type="submit" style={{...btnRed,alignSelf:'flex-start',padding:'10px 24px',fontSize:11}}>{lang==='TH'?'ส่งรีวิว':'SUBMIT REVIEW'}</button>
          </form>
        </div>
      )}
    </div>
  );
};

// ─── PRICE CALCULATOR (NEW) ───────────────────────────────────────────────
const PriceCalcTab = ({lang, onBook}) => {
  const cfg = window.PHOOGUN.PRICE_CONFIG;
  const [sel,setSel] = useState({style:'minimal',size:'md',placement:'arm',color:'black'});
  const result = useMemo(()=>{
    const sz=cfg.sizes.find(s=>s.id===sel.size);
    const st=cfg.styles.find(s=>s.id===sel.style);
    const pl=cfg.placements.find(p=>p.id===sel.placement);
    const co=cfg.colors.find(c=>c.id===sel.color);
    if(!sz||!st||!pl||!co)return null;
    const m=st.mult*pl.mult*co.mult;
    return {min:Math.round(sz.base[0]*m/500)*500,max:Math.round(sz.base[1]*m/500)*500,sessions:sz.sessions,artist:st.artist};
  },[sel]);

  const Opt = ({opt,field}) => {
    const active=sel[field]===opt.id;
    return (
      <button onClick={()=>setSel(p=>({...p,[field]:opt.id}))} style={{padding:'8px 12px',borderRadius:8,border:`1px solid ${active?'#e6192e':'#222'}`,background:active?'rgba(230,25,46,0.08)':'transparent',color:active?'#e6192e':'#777',fontSize:11,cursor:'pointer',fontFamily:'Space Grotesk,sans-serif',fontWeight:700,textAlign:'left',transition:'all 0.15s',lineHeight:1.3}}>
        <div>{lang==='TH'?opt.labelTh:opt.label}</div>
        {opt.desc&&<div style={{fontSize:9,opacity:0.6,marginTop:1,fontWeight:400}}>{opt.desc}</div>}
      </button>
    );
  };

  return (
    <div style={{maxWidth:860,margin:'0 auto'}}>
      <div style={{textAlign:'center',marginBottom:28}}>
        <div style={{fontSize:10,color:'#e6192e',fontFamily:'JetBrains Mono,monospace',textTransform:'uppercase',letterSpacing:'0.18em'}}>PRICE ORACLE ✦ NEW</div>
        <div style={{fontSize:26,fontWeight:900,color:'#fff',fontFamily:'Space Grotesk,sans-serif',textTransform:'uppercase',marginTop:8}}>{lang==='TH'?'คำนวณราคาลายสัก':'TATTOO PRICE ESTIMATOR'}</div>
        <p style={{color:'#555',marginTop:8,fontSize:12}}>{lang==='TH'?'เลือกสไตล์ ขนาด ตำแหน่ง และโหมดสี เพื่อประมาณราคา':'Select style, size, placement & color mode to estimate cost.'}</p>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'1fr 320px',gap:20,alignItems:'start'}}>
        <div style={{background:'#0f0f0f',border:'1px solid #1a1a1a',borderRadius:16,padding:24,display:'flex',flexDirection:'column',gap:20}}>
          {[
            {label:lang==='TH'?'1 — สไตล์การสัก':'1 — TATTOO STYLE',opts:cfg.styles,field:'style'},
            {label:lang==='TH'?'2 — ขนาดโดยประมาณ':'2 — SIZE',opts:cfg.sizes,field:'size'},
            {label:lang==='TH'?'3 — ตำแหน่งบนร่างกาย':'3 — PLACEMENT',opts:cfg.placements,field:'placement'},
            {label:lang==='TH'?'4 — โหมดสี':'4 — COLOR MODE',opts:cfg.colors,field:'color'},
          ].map(row=>(
            <div key={row.field}>
              <div style={{fontSize:10,color:'#444',fontFamily:'JetBrains Mono,monospace',textTransform:'uppercase',letterSpacing:'0.12em',marginBottom:10}}>{row.label}</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                {row.opts.map(opt=><Opt key={opt.id} opt={opt} field={row.field}/>)}
              </div>
            </div>
          ))}
        </div>
        <div style={{position:'sticky',top:80}}>
          <div style={{background:'#080808',border:'1px solid #222',borderRadius:16,padding:24}}>
            <div style={{fontSize:10,color:'#444',fontFamily:'JetBrains Mono,monospace',textTransform:'uppercase',letterSpacing:'0.15em'}}>{lang==='TH'?'ราคาประมาณ':'ESTIMATED PRICE'}</div>
            {result&&(
              <>
                <div style={{fontSize:38,fontWeight:900,color:'#fff',fontFamily:'JetBrains Mono,monospace',marginTop:10,lineHeight:1}}>฿{result.min.toLocaleString()}</div>
                <div style={{fontSize:14,color:'#555',marginTop:4}}>— ฿{result.max.toLocaleString()}</div>
                <div style={{borderTop:'1px solid #1a1a1a',marginTop:18,paddingTop:16,display:'flex',flexDirection:'column',gap:10}}>
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:12}}>
                    <span style={{color:'#555'}}>{lang==='TH'?'เซสชัน':'Sessions'}</span>
                    <span style={{color:'#fff',fontFamily:'JetBrains Mono,monospace',fontWeight:700}}>{result.sessions} {lang==='TH'?'ครั้ง':'sessions'}</span>
                  </div>
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:12}}>
                    <span style={{color:'#555'}}>{lang==='TH'?'ช่างที่แนะนำ':'Recommended'}</span>
                    <span style={{color:'#e6192e',fontFamily:'JetBrains Mono,monospace',fontWeight:700}}>ช่าง{result.artist}</span>
                  </div>
                  <div style={{fontSize:10,color:'#333',lineHeight:1.5,marginTop:4}}>{lang==='TH'?'ราคาเป็นการประมาณเท่านั้น':'Estimate only — artist confirms final price.'}</div>
                </div>
                <button onClick={()=>onBook({artist:result.artist,style:cfg.styles.find(s=>s.id===sel.style)?.labelTh||''})} style={{...btnRed,width:'100%',marginTop:16,display:'flex',alignItems:'center',justifyContent:'center',gap:6,padding:'12px'}}>
                  <window.CalIcon size={13}/>{lang==='TH'?'จองในราคานี้':'BOOK AT THIS PRICE'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── FLASH DESIGNS (NEW) ──────────────────────────────────────────────────
const FlashTab = ({flash=[], lang, onBook}) => (
  <div>
    <div style={{marginBottom:28}}>
      <div style={{fontSize:10,color:'#e6192e',fontFamily:'JetBrains Mono,monospace',textTransform:'uppercase',letterSpacing:'0.18em'}}>READY TO INK ✦ NEW</div>
      <div style={{fontSize:24,fontWeight:900,color:'#fff',fontFamily:'Space Grotesk,sans-serif',textTransform:'uppercase',marginTop:8}}>{lang==='TH'?'ลายแฟลชพร้อมสัก':'FLASH DESIGNS'}</div>
      <p style={{color:'#555',marginTop:6,fontSize:12,maxWidth:520}}>{lang==='TH'?'ลายสักออกแบบล่วงหน้า ราคาตายตัว — จองได้เลย ไม่ต้องออกแบบใหม่':'Pre-designed at fixed prices. Book immediately — no custom design needed.'}</p>
    </div>
    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:20}}>
      {flash.map(f=>(
        <div key={f.id} style={{...cardSt,position:'relative',transition:'transform 0.2s,box-shadow 0.2s'}}
          onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow='0 12px 32px rgba(0,0,0,0.6)';}}
          onMouseLeave={e=>{e.currentTarget.style.transform='';e.currentTarget.style.boxShadow='';}}>
          {!f.available&&<div style={{position:'absolute',top:10,right:10,background:'rgba(0,0,0,0.9)',border:'1px solid #333',borderRadius:4,padding:'3px 8px',fontSize:9,color:'#555',fontFamily:'JetBrains Mono,monospace',zIndex:2,textTransform:'uppercase'}}>Fully Booked</div>}
          <div style={{aspectRatio:'4/3',overflow:'hidden',background:'#070707'}}>
            <img src={f.imageUrl} alt={f.name} style={{width:'100%',height:'100%',objectFit:'cover',filter:'grayscale(100%)',transition:'filter 0.4s,transform 0.4s',opacity:f.available?1:0.35}}
              onMouseEnter={e=>{if(f.available){e.target.style.filter='grayscale(20%)';e.target.style.transform='scale(1.05)';}}}
              onMouseLeave={e=>{e.target.style.filter='grayscale(100%)';e.target.style.transform='';}} referrerPolicy="no-referrer"/>
          </div>
          <div style={{padding:16}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',gap:8}}>
              <div>
                <span style={{fontSize:9,background:'rgba(230,25,46,0.08)',border:'1px solid rgba(230,25,46,0.15)',borderRadius:4,padding:'2px 6px',color:'#e6192e',fontFamily:'JetBrains Mono,monospace'}}>{f.category}</span>
                <div style={{fontSize:14,fontWeight:700,color:'#fff',fontFamily:'Space Grotesk,sans-serif',textTransform:'uppercase',marginTop:6}}>{f.name}</div>
                <div style={{fontSize:11,color:'#555',marginTop:2}}>ช่าง{f.artist} · {f.size}</div>
              </div>
              <div style={{textAlign:'right',flexShrink:0}}>
                <div style={{fontSize:18,fontWeight:900,color:'#fff',fontFamily:'JetBrains Mono,monospace'}}>฿{f.price.toLocaleString()}</div>
                <div style={{fontSize:9,color:'#444',textTransform:'uppercase',letterSpacing:'0.05em'}}>fixed</div>
              </div>
            </div>
            <button onClick={()=>f.available&&onBook({artist:f.artist,style:f.category,note:`Flash: ${f.name} (${f.size})`,size:f.size})} disabled={!f.available}
              style={{...btnRed,width:'100%',marginTop:12,padding:'10px',fontSize:11,opacity:f.available?1:0.35,cursor:f.available?'pointer':'not-allowed',display:'flex',alignItems:'center',justifyContent:'center',gap:6}}>
              <window.ScissorsIcon size={12}/>{lang==='TH'?(f.available?'จองลายนี้':'เต็มแล้ว'):(f.available?'BOOK THIS FLASH':'FULLY BOOKED')}
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ─── MAIN CLIENT VIEW ─────────────────────────────────────────────────────
const ClientView = ({brandName='PHOOGUN TATTOO',brandLogoUrl='',gallery=[],artists=[],reviews=[],flash=[],onLoginClick,onNewBooking,onNewReview,addToast}) => {
  const [lang,setLang] = useState(()=>localStorage.getItem('phoogun_lang')||'TH');
  const [tab,setTab] = useState('gallery');
  const [bookPreset,setBookPreset] = useState(null);
  const [quickView,setQuickView] = useState(null);
  useEffect(()=>localStorage.setItem('phoogun_lang',lang),[lang]);
  const goBook = (preset=null)=>{setBookPreset(preset);setTab('booking');};

  const navTabs = [
    {id:'gallery',th:'ผลงาน',en:'PORTFOLIO'},{id:'artists',th:'ช่างสัก',en:'ARTISTS'},
    {id:'booking',th:'จองคิว',en:'BOOKING'},{id:'prices',th:'ราคา ✦',en:'PRICING ✦'},
    {id:'flash',th:'แฟลช ✦',en:'FLASH ✦'},{id:'reviews',th:'รีวิว',en:'REVIEWS'},
    {id:'about',th:'เกี่ยวกับ',en:'ABOUT'},
  ];

  return (
    <div style={{background:'#0a0a0a',color:'#e5e7eb',minHeight:'100vh',fontFamily:'Prompt,sans-serif'}}>
      <nav style={{position:'sticky',top:0,background:'rgba(10,10,10,0.97)',backdropFilter:'blur(12px)',zIndex:40,borderBottom:'1px solid #161616'}}>
        <div style={{maxWidth:1200,margin:'0 auto',padding:'0 20px',height:60,display:'flex',alignItems:'center',justifyContent:'space-between',gap:12}}>
          <a href="#" onClick={e=>{e.preventDefault();setTab('gallery');}} style={{display:'flex',alignItems:'center',gap:10,textDecoration:'none',flexShrink:0}}>
            {brandLogoUrl
              ?<img src={brandLogoUrl} alt={brandName} style={{width:30,height:30,borderRadius:6,objectFit:'cover'}} referrerPolicy="no-referrer"/>
              :<span style={{width:30,height:30,background:'#e6192e',borderRadius:'6px 2px',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'Space Grotesk,sans-serif',fontSize:14,fontWeight:900,color:'#fff',boxShadow:'0 0 10px rgba(230,25,46,0.35)'}}>{brandName.charAt(0)}</span>
            }
            <span style={{fontFamily:'Space Grotesk,sans-serif',fontWeight:900,fontSize:15,color:'#fff',letterSpacing:'0.2em',textTransform:'uppercase'}}>{brandName}</span>
          </a>
          <div style={{display:'flex',gap:2,flex:1,justifyContent:'center',overflowX:'auto',scrollbarWidth:'none'}}>
            {navTabs.map(t=>(
              <button key={t.id} onClick={()=>setTab(t.id)} style={{padding:'6px 10px 8px',background:'transparent',border:'none',cursor:'pointer',fontSize:10,fontFamily:'Space Grotesk,sans-serif',fontWeight:700,letterSpacing:'0.08em',textTransform:'uppercase',whiteSpace:'nowrap',color:tab===t.id?'#e6192e':'#555',borderBottom:`2px solid ${tab===t.id?'#e6192e':'transparent'}`,transition:'color 0.2s'}}>
                {lang==='TH'?t.th:t.en}
              </button>
            ))}
          </div>
          <div style={{display:'flex',alignItems:'center',gap:8,flexShrink:0}}>
            <div style={{background:'#111',borderRadius:4,display:'flex',overflow:'hidden',border:'1px solid #222'}}>
              {['TH','EN'].map(l=>(
                <button key={l} onClick={()=>setLang(l)} style={{padding:'4px 9px',background:lang===l?'#e6192e':'transparent',border:'none',cursor:'pointer',fontSize:9,fontWeight:900,color:lang===l?'#fff':'#555',fontFamily:'JetBrains Mono,monospace'}}>{l}</button>
              ))}
            </div>
            <button onClick={onLoginClick} style={{background:'transparent',border:'1px solid #222',color:'#666',borderRadius:16,padding:'6px 14px',cursor:'pointer',fontSize:10,fontFamily:'Space Grotesk,sans-serif',fontWeight:700,letterSpacing:'0.06em',display:'flex',alignItems:'center',gap:5}}
              onMouseEnter={e=>{e.currentTarget.style.borderColor='#e6192e';e.currentTarget.style.color='#fff';}}
              onMouseLeave={e=>{e.currentTarget.style.borderColor='#222';e.currentTarget.style.color='#666';}}>
              <window.ShieldIcon size={11} style={{color:'#e6192e'}}/>INK_OS
            </button>
          </div>
        </div>
      </nav>

      {tab==='gallery'&&(
        <section style={{position:'relative',overflow:'hidden',background:'#000',padding:'72px 20px',borderBottom:'1px solid #161616'}}>
          <div style={{position:'absolute',inset:0,backgroundImage:'url(images/workspace.png)',backgroundSize:'cover',backgroundPosition:'center 35%',opacity:0.15,filter:'grayscale(100%) contrast(1.2)'}}></div>
          <div style={{position:'absolute',inset:0,background:'linear-gradient(to top,#0a0a0a 0%,rgba(10,10,10,0.55) 60%,rgba(0,0,0,0.85) 100%)',pointerEvents:'none'}}></div>
          <div style={{position:'relative',maxWidth:1200,margin:'0 auto',textAlign:'center',zIndex:1}}>
            <div style={{display:'inline-flex',alignItems:'center',gap:8,padding:'4px 14px',background:'rgba(230,25,46,0.07)',border:'1px solid rgba(230,25,46,0.2)',borderRadius:20,fontSize:9,color:'#e6192e',fontFamily:'JetBrains Mono,monospace',textTransform:'uppercase',letterSpacing:'0.15em',marginBottom:20}}>
              <span style={{width:5,height:5,borderRadius:'50%',background:'#e6192e',display:'inline-block'}}></span>
              Premium Dark Arts Guild · Bangkok Studio
            </div>
            <h1 style={{fontFamily:'Space Grotesk,sans-serif',fontWeight:900,fontSize:'clamp(30px,5.5vw,70px)',color:'#fff',textTransform:'uppercase',lineHeight:1.05,margin:'0 0 16px'}}>
              {lang==='TH'?'มิติศิลปะบนเรือนร่าง':'BODY ART DIMENSION'}<br/>
              <span style={{fontStyle:'italic',fontWeight:300,color:'#e6192e'}}>{lang==='TH'?'สู่อนาคตที่หรูหราดุดัน':'A CYBERPUNK GOTHIC SAGA'}</span>
            </h1>
            <p style={{color:'#666',maxWidth:620,margin:'0 auto 28px',fontSize:'clamp(12px,1.4vw,15px)',lineHeight:1.8}}>{lang==='TH'?'PHOOGUN TATTOO ผสานศิลปะไซเบอร์แบล็คเวิร์ค ฟอนต์กอธิค และนีโออิเรซูมิ สตูดิโอสักระดับพรีเมียม':'PHOOGUN TATTOO blends cyber-blackwork, gothic typography & Neo-Irezumi. Ultra-premium studio.'}</p>
            <div style={{display:'flex',gap:12,justifyContent:'center',flexWrap:'wrap'}}>
              <button onClick={()=>setTab('booking')} style={{...btnRed,display:'flex',alignItems:'center',gap:8,boxShadow:'0 0 22px rgba(230,25,46,0.25)'}}><window.CalIcon size={15}/>{lang==='TH'?'จองคิวออนไลน์':'BOOK NOW'}</button>
              <button onClick={()=>setTab('flash')} style={{background:'transparent',border:'1px solid #2a2a2a',color:'#aaa',borderRadius:8,padding:'12px 22px',fontSize:12,fontWeight:700,cursor:'pointer',fontFamily:'Space Grotesk,sans-serif',letterSpacing:'0.08em',textTransform:'uppercase',display:'flex',alignItems:'center',gap:8}}>{lang==='TH'?'ดูลายแฟลช':'FLASH DESIGNS'}<window.ArrowRightIcon size={14}/></button>
            </div>
          </div>
        </section>
      )}

      <div style={{background:'#060606',borderBottom:'1px solid #161616',overflow:'hidden',padding:'10px 0',userSelect:'none'}}>
        <div style={{display:'flex',animation:'marquee 35s linear infinite',whiteSpace:'nowrap'}}>
          {[...Array(2)].flatMap((_,ri)=>['• PREMIUM TATTOO ARTISTS','• NEO-IREZUMI SPECIALISTS','• BLACKWORK DESIGN','• HOSPITAL GRADE STERILE','• APPOINTMENT SYSTEM','• PHOOGUN DARK ARTS','• CYBER-BLACKWORK STUDIO','• FLASH DESIGNS AVAILABLE'].map((t,i)=>(
            <span key={`${ri}-${i}`} style={{fontSize:9,fontFamily:'JetBrains Mono,monospace',fontWeight:700,letterSpacing:'0.25em',color:i%2===0?'#333':'#e6192e',paddingRight:40,textTransform:'uppercase'}}>{t}</span>
          )))}
        </div>
      </div>

      <main style={{maxWidth:1200,margin:'0 auto',padding:'40px 20px'}}>
        {tab==='gallery'&&<GalleryTab gallery={gallery} lang={lang} onQuickView={setQuickView}/>}
        {tab==='artists'&&<ArtistsTab artists={artists} lang={lang} onBookArtist={a=>goBook({artist:a})}/>}
        {tab==='booking'&&<BookingTab artists={artists} lang={lang} bookPreset={bookPreset} onSuccess={b=>{onNewBooking(b);setBookPreset(null);}} addToast={addToast}/>}
        {tab==='about'&&<AboutTab lang={lang}/>}
        {tab==='reviews'&&<ReviewsTab reviews={reviews} lang={lang} onNewReview={onNewReview} addToast={addToast}/>}
        {tab==='prices'&&<PriceCalcTab lang={lang} onBook={goBook}/>}
        {tab==='flash'&&<FlashTab flash={flash} lang={lang} onBook={goBook}/>}
      </main>

      {quickView&&(
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.94)',zIndex:100,display:'flex',alignItems:'center',justifyContent:'center',padding:20}} onClick={()=>setQuickView(null)}>
          <div style={{background:'#111',border:'1px solid #222',borderRadius:18,maxWidth:680,width:'100%',maxHeight:'90vh',display:'flex',flexDirection:'column',overflow:'hidden'}} onClick={e=>e.stopPropagation()}>
            <div style={{position:'relative',maxHeight:380,overflow:'hidden',background:'#070707',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <img src={quickView.imageUrl} alt={quickView.name} style={{width:'100%',maxHeight:380,objectFit:'contain'}} referrerPolicy="no-referrer"/>
              <button onClick={()=>setQuickView(null)} style={{position:'absolute',top:12,right:12,background:'rgba(0,0,0,0.75)',border:'1px solid #333',borderRadius:'50%',width:34,height:34,cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff'}}><window.XIcon size={15}/></button>
            </div>
            <div style={{padding:22}}>
              <div style={{fontSize:10,color:'#e6192e',fontFamily:'JetBrains Mono,monospace',marginBottom:4}}>ช่าง{quickView.artist} · {quickView.category}</div>
              <div style={{fontSize:19,fontWeight:900,color:'#fff',fontFamily:'Space Grotesk,sans-serif',textTransform:'uppercase'}}>{quickView.name}</div>
              <p style={{color:'#666',marginTop:8,fontSize:12,lineHeight:1.7}}>{quickView.description}</p>
              <button onClick={()=>{goBook({style:quickView.category});setQuickView(null);}} style={{...btnRed,marginTop:14,display:'flex',alignItems:'center',gap:6,fontSize:11}}><window.CalIcon size={13}/>{lang==='TH'?'จองสไตล์นี้':'BOOK THIS STYLE'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

Object.assign(window, {ClientView});

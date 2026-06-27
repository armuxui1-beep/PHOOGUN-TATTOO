// ============================================================
// About, Reviews, Contact, Map, Footer sections
// ============================================================
const { useState } = React;
function AboutSection({ lang, config, artists }) {
  const stats = config.stats || [
    { val: '500+', th: 'ผลงานสักสำเร็จ', en: 'Tattoos Completed' },
    { val: '8+', th: 'ปีประสบการณ์', en: 'Years Experience' },
    { val: '4', th: 'ช่างสักมืออาชีพ', en: 'Master Artists' },
    { val: '100%', th: 'มาตรฐานโรงพยาบาล', en: 'Hospital Grade' },
  ];
  const studioImg = config.aboutImage || 'ink-passport/images/studio-workspace.png';

  return (
    <section id="about" className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#0a0a0a] border-t border-[#1a1a1a]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center mb-12 sm:mb-20">
          <div>
            <Micro className="text-crimson/80 block mb-3">{tx(lang, 'เกี่ยวกับเรา', 'About Us')}</Micro>
            <h2 className="font-heading text-4xl font-black text-white uppercase leading-tight mb-6">
              <span className="w-3 h-3 bg-crimson rounded-sm inline-block mr-3" />
              {tx(lang, config.aboutTitle, config.aboutTitleEn)}
            </h2>
            <p className="text-gray-400 text-base leading-relaxed mb-8">{tx(lang, config.aboutText, config.aboutTextEn)}</p>
            <div className="grid grid-cols-2 gap-3">
              {stats.map((s, i) => (
                <div key={i} className="bg-[#111] border border-[#222] rounded-xl sm:rounded-2xl p-4 sm:p-5">
                  <div className="font-heading text-2xl sm:text-3xl font-black text-crimson">{s.val}</div>
                  <Micro className="text-gray-500 block mt-1">{tx(lang, s.th, s.en)}</Micro>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-crimson to-transparent rounded" />
            <img src={studioImg} alt="Studio" className="w-full rounded-2xl border border-[#222] object-cover" style={{ maxHeight: 420 }} onError={e => { e.target.src = 'ink-passport/images/studio-workspace.png'; }} />
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-[#0a0a0a]/60 to-transparent pointer-events-none" />
          </div>
        </div>

        {/* Artists */}
        <div>
          <Micro className="text-crimson/80 block mb-3">{tx(lang, 'ทีมช่างสัก', 'Our Artists')}</Micro>
          <h3 className="font-heading text-2xl font-black text-white uppercase mb-8 flex items-center gap-2">
            <span className="w-2 h-2 bg-crimson rounded-sm" />{tx(lang, 'ช่างสักฝีมือ', 'Master Artists')}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {artists.map(a => (
              <div key={a.id} className="bg-[#111] border border-[#222] rounded-2xl overflow-hidden hover:border-crimson/40 transition group">
                <div className="relative h-56 overflow-hidden">
                  <img src={a.imageUrl} alt={a.nameEn} referrerPolicy="no-referrer" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-3 left-3">
                    <Badge tone="crimson">{a.available}</Badge>
                  </div>
                </div>
                <div className="p-4">
                  <h4 className="font-heading font-bold text-white uppercase">{tx(lang, a.nameTh, a.nameEn)}</h4>
                  <p className="font-mono text-[10px] text-crimson tracking-widest mt-0.5">{a.specialty}</p>
                  <p className="text-gray-500 text-xs mt-2 leading-relaxed">{a.bio_th}</p>
                  <Micro className="text-gray-600 block mt-2">{a.experience}</Micro>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ReviewsSection({ lang, reviews, artists, onSubmitReview }) {
  const [form, setForm] = useState({ author: '', rating: 5, message: '', artist: '' });
  const [submitted, setSubmitted] = useState(false);
  const f = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const submit = e => {
    e.preventDefault();
    if (!form.author.trim() || !form.message.trim()) return;
    if (onSubmitReview) {
      onSubmitReview({ ...form, id: `r${Date.now()}`, status: 'pending', createdAt: new Date().toISOString().split('T')[0] });
    }
    setSubmitted(true);
    setForm({ author: '', rating: 5, message: '', artist: '' });
    setTimeout(() => setSubmitted(false), 4000);
  };

  const approved = reviews.filter(r => r.status === 'approved');
  const avg = approved.length ? (approved.reduce((s, r) => s + r.rating, 0) / approved.length).toFixed(1) : '5.0';

  return (
    <section id="reviews" className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#080808] border-t border-[#1a1a1a]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Micro className="text-crimson/80 block mb-3">{tx(lang, 'รีวิวจากลูกค้า', 'Client Reviews')}</Micro>
          <h2 className="font-heading text-4xl font-black text-white uppercase flex items-center justify-center gap-3">
            <span className="w-3 h-3 bg-crimson rounded-sm" />{tx(lang, 'เสียงจากลูกค้า', 'Testimonials')}
          </h2>
          <div className="flex items-center justify-center gap-3 mt-4">
            <StarRow n={5} size="w-5 h-5" />
            <span className="font-heading text-2xl font-black text-white">{avg}</span>
            <Micro className="text-gray-500">{tx(lang, `จาก ${approved.length} รีวิว`, `from ${approved.length} reviews`)}</Micro>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {approved.map(r => (
            <div key={r.id} className="bg-[#111] border border-[#222] rounded-2xl p-6 hover:border-[#333] transition">
              <div className="flex items-start justify-between gap-3 mb-4">
                <div>
                  <p className="font-heading text-sm font-bold text-white">{r.author}</p>
                  {r.artist && <Micro className="text-gray-500 block mt-0.5">{tx(lang, 'ช่าง', 'Artist')}: {r.artist}</Micro>}
                </div>
                <StarRow n={r.rating} />
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">"{r.message}"</p>
              <Micro className="text-gray-700 block mt-4">{r.createdAt}</Micro>
            </div>
          ))}
        </div>

        {/* Public review submission form */}
        <div className="mt-16 max-w-2xl mx-auto">
          <div className="text-center mb-6">
            <Micro className="text-crimson/80 block mb-2">{tx(lang, 'แชร์ประสบการณ์', 'Share Your Experience')}</Micro>
            <h3 className="font-heading text-xl font-black text-white uppercase">{tx(lang, 'เขียนรีวิว', 'Write a Review')}</h3>
          </div>
          {submitted ? (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-8 text-center">
              <Icon name="check" className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
              <p className="font-heading font-bold text-white uppercase">{tx(lang, 'ขอบคุณสำหรับรีวิว!', 'Thank you for your review!')}</p>
              <p className="text-gray-400 text-sm mt-2">{tx(lang, 'รีวิวของคุณรอการอนุมัติจากทีมงาน', 'Your review is pending approval')}</p>
            </div>
          ) : (
            <form onSubmit={submit} className="bg-[#111] border border-[#222] rounded-2xl p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Micro className="text-gray-500 block">{tx(lang, 'ชื่อของคุณ *', 'Your Name *')}</Micro>
                  <input value={form.author} onChange={e => f('author', e.target.value)} required
                    className="w-full bg-black/60 border border-[#2a2a2a] focus:border-crimson/50 outline-none rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 transition"
                    placeholder={tx(lang, 'ชื่อ-นามสกุล', 'Full Name')} />
                </div>
                <div className="space-y-1.5">
                  <Micro className="text-gray-500 block">{tx(lang, 'ช่างที่ใช้บริการ', 'Artist')}</Micro>
                  <select value={form.artist} onChange={e => f('artist', e.target.value)}
                    className="w-full bg-black/60 border border-[#2a2a2a] text-gray-300 text-sm rounded-xl px-4 py-3 outline-none cursor-pointer focus:border-crimson/50 transition">
                    <option value="">{tx(lang, 'เลือกช่างสัก', 'Select artist')}</option>
                    {(artists || []).map(a => <option key={a.id} value={a.nameTh}>{tx(lang, a.nameTh, a.nameEn)}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Micro className="text-gray-500 block">{tx(lang, 'คะแนน', 'Rating')}</Micro>
                <div className="flex gap-2">
                  {[1,2,3,4,5].map(n => (
                    <button key={n} type="button" onClick={() => f('rating', n)}
                      className={`w-10 h-10 rounded-xl border transition cursor-pointer font-heading font-bold text-sm ${form.rating >= n ? 'bg-crimson border-crimson text-white' : 'border-[#2a2a2a] text-gray-500 hover:text-white'}`}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <Micro className="text-gray-500 block">{tx(lang, 'รีวิวของคุณ *', 'Your Review *')}</Micro>
                <textarea value={form.message} onChange={e => f('message', e.target.value)} required rows={3}
                  className="w-full bg-black/60 border border-[#2a2a2a] focus:border-crimson/50 outline-none rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-600 transition resize-none"
                  placeholder={tx(lang, 'บอกเล่าประสบการณ์การสักกับเรา...', 'Tell us about your tattoo experience...')} />
              </div>
              <Btn type="submit" variant="primary" className="w-full justify-center">
                <Icon name="star" className="w-4 h-4" />{tx(lang, 'ส่งรีวิว', 'Submit Review')}
              </Btn>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}

function ContactSection({ lang, config }) {
  const s = config.social || {};
  const socials = [
    { key: 'facebook', icon: 'fb', label: 'Facebook', color: 'hover:text-blue-400' },
    { key: 'instagram', icon: 'ig', label: 'Instagram', color: 'hover:text-pink-400' },
    { key: 'tiktok', icon: 'tt', label: 'TikTok', color: 'hover:text-white' },
    { key: 'lineoa', icon: 'line', label: 'LINE OA', color: 'hover:text-green-400' },
    { key: 'twitter', icon: 'tw', label: 'X / Twitter', color: 'hover:text-sky-400' },
    { key: 'phone', icon: 'phone', label: tx(lang, 'โทรศัพท์', 'Phone'), color: 'hover:text-crimson' },
  ];

  return (
    <section id="contact" className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-[#0a0a0a] border-t border-[#1a1a1a]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Micro className="text-crimson/80 block mb-3">{tx(lang, 'ติดต่อเรา', 'Get in Touch')}</Micro>
          <h2 className="font-heading text-4xl font-black text-white uppercase flex items-center justify-center gap-3">
            <span className="w-3 h-3 bg-crimson rounded-sm" />{tx(lang, 'ช่องทางติดต่อ', 'Contact Us')}
          </h2>
          <p className="text-gray-500 text-sm mt-3 font-mono">{tx(lang, 'เปิดให้บริการ 12:00–21:00 น. (หยุดพฤหัสบดี)', 'Open 12:00–21:00 (Closed Thursday)')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Social icons */}
          <div className="space-y-6">
            <p className="font-heading text-sm font-bold text-white uppercase">{tx(lang, 'โซเชียลมีเดีย', 'Social Media')}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {socials.map(({ key, icon, label, color }) => (
                <a key={key} href={s[key] || '#'}
                  className={`flex items-center gap-3 bg-[#111] border border-[#222] rounded-2xl p-4 text-gray-400 ${color} hover:border-[#333] transition group cursor-pointer`}>
                  <Icon name={icon} className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  <div>
                    <p className="font-heading text-xs font-bold uppercase">{label}</p>
                    <Micro className="text-gray-600">{s[key] ? s[key].replace(/https?:\/\/(www\.)?/, '').split('/')[0] : tx(lang, 'ตั้งค่าใน Admin', 'Set in Admin')}</Micro>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Map */}
          <div className="space-y-4">
            <p className="font-heading text-sm font-bold text-white uppercase">{tx(lang, 'ที่ตั้งสตูดิโอ', 'Studio Location')}</p>
            <div className="w-full h-56 sm:h-72 rounded-2xl overflow-hidden border border-[#222] bg-[#111] flex items-center justify-center">
              {config.mapUrl ? (
                <iframe src={config.mapUrl} width="100%" height="100%" style={{ border: 0 }}
                  allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Studio Map" />
              ) : (
                <div className="text-center text-gray-600 p-8">
                  <Icon name="map" className="w-10 h-10 mx-auto mb-3 opacity-30" />
                  <p className="font-mono text-xs">{tx(lang, 'ตั้งค่า Google Maps URL ใน Admin', 'Set Google Maps URL in Admin')}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Footer({ lang }) {
  return (
    <footer className="bg-[#050505] border-t border-[#1a1a1a] py-8 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="w-7 h-7 rounded-tr-md rounded-bl-md bg-crimson flex items-center justify-center font-heading text-sm font-bold text-white">P</span>
          <span className="font-heading text-sm font-bold text-white tracking-widest uppercase">Phoogun Tattoo</span>
        </div>
        <Micro className="text-gray-700">© 2026 Phoogun Tattoo · Premium Dark Arts · Bangkok</Micro>
        <Micro className="text-gray-700">{tx(lang, 'ศิลปะบนเรือนร่าง', 'Body Art Dimension')}</Micro>
      </div>
    </footer>
  );
}

Object.assign(window, { AboutSection, ReviewsSection, ContactSection, Footer });

// ============================================================
// Gallery Section + Image Modal
// ============================================================
const { useState, useMemo } = React;
function GallerySection({ lang, images, categories, albums }) {
  const [selCat, setSelCat] = useState('all');
  const [selAlbum, setSelAlbum] = useState('all');
  const [query, setQuery] = useState('');
  const [modalImg, setModalImg] = useState(null);
  const [sort, setSort] = useState('popular');

  // Featured promoted albums strip
  const promoted = albums.filter(a => a.promoted);

  const filtered = useMemo(() => {
    let list = images.filter(img => img.imageUrl);
    if (selCat !== 'all') list = list.filter(i => i.categoryId === selCat);
    if (selAlbum !== 'all') list = list.filter(i => i.albumId === selAlbum);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(i => i.title.toLowerCase().includes(q) || i.artist.toLowerCase().includes(q) || (i.tags || []).some(t => t.includes(q)));
    }
    return sort === 'popular' ? [...list].sort((a, b) => (b.likes || 0) - (a.likes || 0)) : list;
  }, [images, selCat, selAlbum, query, sort]);

  const getCatName = id => {
    const c = categories.find(c => c.id === id);
    return c ? tx(lang, c.nameTh, c.nameEn) : '';
  };

  return (
    <section id="gallery" className="bg-[#080808] py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">

        {/* Promoted albums strip */}
        {promoted.length > 0 && (
          <div>
            <Micro className="text-crimson/80 block mb-3">{tx(lang, 'อัลบั้มแนะนำ', 'Featured Albums')}</Micro>
            <div className="flex gap-4 overflow-x-auto pb-2">
              {promoted.map(a => (
                <button key={a.id} onClick={() => setSelAlbum(a.id === selAlbum ? 'all' : a.id)}
                  className={`shrink-0 relative w-48 h-28 rounded-2xl overflow-hidden border-2 transition cursor-pointer ${selAlbum === a.id ? 'border-crimson' : 'border-[#222] hover:border-[#444]'}`}>
                  <img src={a.cover} alt={a.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Icon name="promote" className="w-3 h-3 text-amber-400" />
                      <Micro className="text-amber-400">Featured</Micro>
                    </div>
                    <p className="font-heading text-xs font-bold text-white uppercase">{a.name}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Header + search + sort */}
        <div className="flex flex-col sm:flex-row sm:items-end gap-4 sm:gap-6 justify-between">
          <div>
            <Micro className="text-crimson/80">{tx(lang, 'พอร์ตโฟลิโอ', 'Portfolio')}</Micro>
            <h2 className="font-heading text-3xl sm:text-4xl font-black text-white uppercase mt-1 flex items-center gap-3">
              <span className="w-3 h-3 bg-crimson rounded-sm" />
              {tx(lang, 'ผลงานสักทั้งหมด', 'Master Gallery')}
            </h2>
          </div>
          <div className="flex gap-3 flex-wrap w-full lg:w-auto">
            <input value={query} onChange={e => setQuery(e.target.value)}
              placeholder={tx(lang, 'ค้นหาผลงาน...', 'Search works...')}
              className="bg-[#111] border border-[#222] focus:border-crimson/40 outline-none rounded-full px-4 py-2 text-sm text-white placeholder:text-gray-600 transition flex-1 min-w-0 lg:w-52" />
            <select value={sort} onChange={e => setSort(e.target.value)}
              className="bg-[#111] border border-[#222] text-gray-300 text-xs font-mono uppercase tracking-widest rounded-full px-4 py-2 outline-none cursor-pointer shrink-0">
              <option value="popular">{tx(lang, 'ยอดนิยม', 'Popular')}</option>
              <option value="newest">{tx(lang, 'ล่าสุด', 'Newest')}</option>
            </select>
          </div>
        </div>

        {/* Category filter pills — scrollable on mobile */}
        <div className="-mx-4 sm:mx-0 px-4 sm:px-0 overflow-x-auto">
          <div className="flex gap-2 pb-1 min-w-max sm:min-w-0 sm:flex-wrap">
            <button onClick={() => setSelCat('all')}
              className={`font-mono text-[10px] tracking-widest uppercase px-3.5 py-1.5 rounded-full border transition cursor-pointer whitespace-nowrap ${selCat==='all'?'bg-crimson border-crimson text-white':'border-[#2a2a2a] text-gray-400 hover:text-white hover:border-[#444]'}`}>
              {tx(lang,'ทั้งหมด','All')}
            </button>
            {categories.map(c => (
              <button key={c.id} onClick={() => setSelCat(c.id===selCat?'all':c.id)}
                className={`font-mono text-[10px] tracking-widest uppercase px-3.5 py-1.5 rounded-full border transition cursor-pointer whitespace-nowrap ${selCat===c.id?'bg-crimson border-crimson text-white':'border-[#2a2a2a] text-gray-400 hover:text-white hover:border-[#444]'}`}>
                {tx(lang,c.nameTh,c.nameEn)}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery grid — 1 col mobile, 2 col sm, 3 col md, 4 col lg */}
        <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 gap-3 space-y-3">
          {filtered.map(img => (
            <div key={img.id} onClick={() => setModalImg(img)}
              className="break-inside-avoid relative group rounded-xl overflow-hidden cursor-pointer border border-[#222] hover:border-crimson/40 transition-all duration-300">
              <img src={img.imageUrl} alt={img.title} className="w-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-300">
                <p className="font-heading text-xs font-bold text-white uppercase leading-tight">{img.title}</p>
                <div className="flex items-center justify-between mt-1.5">
                  <Micro className="text-gray-400">{img.artist}</Micro>
                  <span className="flex items-center gap-1 text-crimson">
                    <Icon name="heart" className="w-3 h-3" /><Micro className="text-crimson">{img.likes}</Micro>
                  </span>
                </div>
              </div>
              {img.featured && (
                <div className="absolute top-2 left-2">
                  <span className="bg-crimson text-white font-mono text-[8px] tracking-widest uppercase px-2 py-0.5 rounded">Featured</span>
                </div>
              )}
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-4 text-center py-20 text-gray-600">
              <Icon name="image" className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="font-mono text-xs">{tx(lang, 'ไม่พบผลงาน', 'No results found')}</p>
            </div>
          )}
        </div>

        <p className="font-mono text-[10px] text-gray-600 text-center">{filtered.length} {tx(lang, 'ผลงาน', 'works')}</p>
      </div>

      {/* Image Modal */}
      {modalImg && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:p-4 bg-black/90 backdrop-blur-sm" onClick={() => setModalImg(null)}>
          <div className="relative w-full sm:max-w-4xl bg-[#0e0e0e] border border-[#222] sm:rounded-2xl rounded-t-2xl overflow-hidden shadow-2xl max-h-[95vh] sm:max-h-none flex flex-col" onClick={e => e.stopPropagation()}>
            {/* close */}
            <button onClick={() => setModalImg(null)}
              className="absolute top-3 right-3 z-10 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/70 border border-[#333] text-white flex items-center justify-center hover:border-crimson transition cursor-pointer">
              <Icon name="x" className="w-4 h-4" />
            </button>
            <div className="flex flex-col lg:flex-row overflow-y-auto">
              <div className="lg:w-3/5 bg-black">
                <img src={modalImg.imageUrl} alt={modalImg.title} className="w-full max-h-[40vh] sm:max-h-[55vh] lg:max-h-[80vh] object-contain" />
              </div>
              <div className="lg:w-2/5 p-4 sm:p-6 flex flex-col gap-3 sm:gap-4">
                <div>
                  <Micro className="text-crimson/80 block mb-1">{getCatName(modalImg.categoryId)}</Micro>
                  <h3 className="font-heading text-xl font-black text-white uppercase">{modalImg.title}</h3>
                  <p className="font-mono text-xs text-gray-400 mt-1">{tx(lang, 'โดยช่าง', 'by')} {modalImg.artist}</p>
                </div>
                <div className="flex items-center gap-2 text-crimson">
                  <Icon name="heart" className="w-4 h-4 fill-crimson" />
                  <span className="font-mono text-sm text-white">{modalImg.likes}</span>
                  <Micro className="text-gray-500">{tx(lang, 'ไลค์', 'likes')}</Micro>
                </div>
                <div>
                  <Micro className="text-gray-500 block mb-2">{tx(lang, 'แท็ก', 'Tags')}</Micro>
                  <div className="flex flex-wrap gap-2">
                    {(modalImg.tags || []).map(t => (
                      <Badge key={t}>#{t}</Badge>
                    ))}
                  </div>
                </div>
                <div className="mt-auto pt-3 sm:pt-4 border-t border-[#1f1f1f]">
                  <Btn onClick={() => { setModalImg(null); document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' }); }} variant="primary" className="w-full justify-center">
                    <Icon name="phone" className="w-4 h-4" />
                    {tx(lang, 'จองลายนี้', 'Book this style')}
                  </Btn>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

Object.assign(window, { GallerySection });

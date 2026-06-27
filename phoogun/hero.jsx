// ============================================================
// Hero Carousel Section
// ============================================================
const { useState, useEffect, useRef, useCallback } = React;
function HeroSection({ lang, config, heroSlides: slidesProp, onBookClick, onGalleryClick }) {
  const slides = (slidesProp && slidesProp.length > 0) ? slidesProp : window.PHG_DATA.HERO_SLIDES;
  const [cur, setCur] = useState(0);
  const [fading, setFading] = useState(false);
  const timerRef = useRef(null);

  const goTo = useCallback((idx) => {
    setFading(true);
    setTimeout(() => {
      setCur((idx + slides.length) % slides.length);
      setFading(false);
    }, 350);
  }, [slides.length]);

  useEffect(() => {
    timerRef.current = setInterval(() => goTo(cur + 1), 5000);
    return () => clearInterval(timerRef.current);
  }, [cur, goTo]);

  const slide = slides[cur];

  return (
    <section id="hero" className="relative w-full" style={{ height: 'min(92vh, 860px)' }}>
      {/* Background image with fade */}
      <div className="absolute inset-0 overflow-hidden">
        <img key={slide.image} src={slide.image} alt=""
          className="w-full h-full object-cover transition-opacity duration-700"
          style={{ opacity: fading ? 0 : 1 }} />
        <div className="absolute inset-0 bg-gradient-to-t from-[#080808] via-[#080808]/70 to-black/50" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080808]/60 via-transparent to-transparent" />
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-20 pointer-events-none"
          style={{ backgroundImage: 'linear-gradient(to right,#222 1px,transparent 1px),linear-gradient(to bottom,#222 1px,transparent 1px)', backgroundSize: '64px 64px' }} />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end pb-14 sm:pb-20 lg:pb-24 px-5 sm:px-10 lg:px-20 max-w-7xl mx-auto">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-crimson/10 border border-crimson/30 rounded-full w-fit mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-crimson animate-pulse" />
          <Micro className="text-crimson">Premium Dark Arts Guild · Bangkok</Micro>
        </div>

        {/* Title */}
        <h1 className="font-heading font-black uppercase leading-[1.0] text-4xl sm:text-6xl lg:text-8xl text-white mb-4" style={{ textShadow: '0 4px 40px rgba(0,0,0,0.8)' }}>
          <span style={{ transition: 'opacity .7s', opacity: fading ? 0 : 1 }}>
            {tx(lang, config.heroTitle, config.heroTitleEn)}
          </span>
          <br />
          <em className="not-italic text-transparent bg-clip-text" style={{ backgroundImage: 'linear-gradient(90deg,#e6192e,#ff6b6b,#e6192e)', transition: 'opacity .7s', opacity: fading ? 0 : 1 }}>
            {tx(lang, config.heroSub, config.heroSubEn)}
          </em>
        </h1>

        <p className="text-gray-300 text-xs sm:text-base lg:text-lg max-w-2xl leading-relaxed mb-6 sm:mb-8 line-clamp-3 sm:line-clamp-none" style={{ transition: 'opacity .7s', opacity: fading ? 0 : 1 }}>
          {tx(lang, config.heroDesc, config.heroDescEn)}
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap gap-2 sm:gap-4">
          <Btn onClick={onBookClick} variant="primary" size="md" className="sm:!px-7 sm:!py-3.5 sm:!text-sm">
            <Icon name="phone" className="w-4 h-4" />
            {tx(lang, 'จองคิวสักเลย', 'Book Now')}
          </Btn>
          <Btn onClick={onGalleryClick} variant="outline" size="md" className="sm:!px-7 sm:!py-3.5 sm:!text-sm">
            <Icon name="image" className="w-4 h-4" />
            {tx(lang, 'ดูผลงาน', 'View Portfolio')}
          </Btn>
        </div>
      </div>

      {/* Prev/Next arrows — hidden on mobile (swipe area too small) */}
      <button onClick={() => goTo(cur - 1)}
        className="flex absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-black/50 hover:bg-black/80 border border-[#333] text-white items-center justify-center transition cursor-pointer z-10">
        <Icon name="arrow_l" className="w-5 h-5" />
      </button>
      <button onClick={() => goTo(cur + 1)}
        className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 border border-[#333] text-white items-center justify-center transition cursor-pointer z-10">
        <Icon name="arrow_r" className="w-5 h-5" />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button key={i} onClick={() => goTo(i)}
            className={`rounded-full transition-all cursor-pointer ${i === cur ? 'w-6 h-2 bg-crimson' : 'w-2 h-2 bg-white/30 hover:bg-white/60'}`} />
        ))}
      </div>

      {/* Slide label */}
      <div className="absolute bottom-6 right-6 z-10">
        <Micro className="text-gray-500">{slide.label}</Micro>
      </div>
    </section>
  );
}

Object.assign(window, { HeroSection });

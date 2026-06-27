// ============================================================
// PHOOGUN TATTOO — Google Sheets API connector
// ชื่อไฟล์: phoogun/sheets-api.jsx
// ============================================================

const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbweh4Jewfok29bh5-JtU9DkyY33WFxVK6XGtniWUXhIVCsiAJL_4dJIkTP6BXegOcJS0Q/exec';

// ── Generic fetch ───────────────────────────────────────────
async function sheetsGet(sheet, params = {}) {
  const url = new URL(SHEETS_URL);
  url.searchParams.set('sheet', sheet);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString());
  const json = await res.json();
  if (!json.ok) throw new Error(json.error || 'API error');
  return json.data;
}

async function sheetsPost(body) {
  const res = await fetch(SHEETS_URL, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
  return await res.json();
}

// ── Data transformers: Sheets row → App shape ──────────────
function transformConfig(raw) {
  // raw = { heroTitle: '...', socialFacebook: '...', ... }
  const r = raw || {};
  return {
    heroTitle:   r.heroTitle   || 'มิติศิลปะบนเรือนร่าง',
    heroTitleEn: r.heroTitleEn || 'Body Art Dimension',
    heroSub:     r.heroSub     || 'สู่อนาคตที่หรูหราดุดัน',
    heroSubEn:   r.heroSubEn   || 'A Cyberpunk Gothic Saga',
    heroDesc:    r.heroDesc    || '',
    heroDescEn:  r.heroDescEn  || '',
    aboutTitle:  r.aboutTitle  || 'เกี่ยวกับ Phoogun Tattoo',
    aboutTitleEn:r.aboutTitleEn|| 'About Phoogun Tattoo',
    aboutText:   r.aboutText   || '',
    aboutTextEn: r.aboutTextEn || '',
    aboutImage:  r.aboutImage  || '',
    mapUrl:      r.mapUrl      || '',
    fbPixel:     r.fbPixel     || '',
    ttPixel:     r.ttPixel     || '',
    adminPasscode: r.adminPasscode || '1337',
    studioHoursTh: r.studioHoursTh || 'เปิด 12:00–21:00 น. (หยุดพฤหัสบดี)',
    studioHoursEn: r.studioHoursEn || 'Open 12:00–21:00 (Closed Thursday)',
    stats: [
      { val: r.stat1Val || '500+', th: r.stat1Th || 'ผลงานสักสำเร็จ',  en: r.stat1En || 'Tattoos Completed' },
      { val: r.stat2Val || '8+',   th: r.stat2Th || 'ปีประสบการณ์',    en: r.stat2En || 'Years Experience' },
      { val: r.stat3Val || '4',    th: r.stat3Th || 'ช่างสักมืออาชีพ', en: r.stat3En || 'Master Artists' },
      { val: r.stat4Val || '100%', th: r.stat4Th || 'มาตรฐานโรงพยาบาล',en: r.stat4En || 'Hospital Grade' },
    ],
    social: {
      facebook:  r.socialFacebook  || '',
      instagram: r.socialInstagram || '',
      tiktok:    r.socialTiktok    || '',
      lineoa:    r.socialLineoa    || '',
      twitter:   r.socialTwitter   || '',
      phone:     r.socialPhone     || '',
    },
  };
}

function transformImages(rows) {
  return (rows || [])
    .filter(r => r.active !== 'FALSE')
    .map(r => ({
      id:         r.id,
      albumId:    r.albumId,
      categoryId: r.categoryId,
      title:      r.title,
      artist:     r.artistName || r.artist || '',
      tags:       r.tags ? r.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
      imageUrl:   r.imageUrl,
      featured:   r.featured === 'TRUE' || r.featured === true,
      likes:      parseInt(r.likes) || 0,
      description:r.description || '',
      placement:  r.placement || '',
      placementEn:r.placementEn || '',
      size:       r.size || '',
      price:      r.price || '',
      duration:   r.duration || '',
      sessions:   r.sessions || '',
    }));
}

function transformCategories(rows) {
  return (rows || [])
    .filter(r => r.active !== 'FALSE')
    .sort((a, b) => parseInt(a.sortOrder || 99) - parseInt(b.sortOrder || 99))
    .map(r => ({
      id:     r.id,
      nameTh: r.nameTh,
      nameEn: r.nameEn,
      slug:   r.slug,
      descTh: r.descTh || '',
      color:  r.color  || '',
    }));
}

function transformAlbums(rows) {
  return (rows || [])
    .filter(r => r.active !== 'FALSE')
    .sort((a, b) => parseInt(a.sortOrder || 99) - parseInt(b.sortOrder || 99))
    .map(r => ({
      id:       r.id,
      name:     r.name,
      descTh:   r.descTh || '',
      descEn:   r.descEn || '',
      promoted: r.promoted === 'TRUE' || r.promoted === true,
      cover:    r.coverUrl || r.cover || '',
    }));
}

function transformArtists(rows) {
  return (rows || [])
    .filter(r => r.active !== 'FALSE')
    .sort((a, b) => parseInt(a.sortOrder || 99) - parseInt(b.sortOrder || 99))
    .map(r => ({
      id:         r.id,
      nameTh:     r.nameTh,
      nameEn:     r.nameEn,
      specialty:  r.specialtyEn || r.specialty || '',
      specialtyTh:r.specialtyTh || '',
      experience: r.experience || '',
      bio_th:     r.bio_th || '',
      bio_en:     r.bio_en || '',
      imageUrl:   r.imageUrl || '',
      available:  r.availableTh || r.available || '',
      availableEn:r.availableEn || '',
      instagram:  r.instagram || '',
    }));
}

function transformReviews(rows) {
  return (rows || []).map(r => ({
    id:        r.id,
    author:    r.author,
    rating:    parseInt(r.rating) || 5,
    message:   r.message,
    artist:    r.artist,
    service:   r.service || '',
    status:    r.status || 'pending',
    createdAt: r.createdAt || '',
    adminReply:r.adminReply || '',
    featured:  r.featured === 'TRUE',
  }));
}

function transformHeroSlides(rows) {
  return (rows || [])
    .filter(r => r.active !== 'FALSE')
    .sort((a, b) => parseInt(a.sortOrder || 99) - parseInt(b.sortOrder || 99))
    .map(r => ({ image: r.imageUrl, label: r.label }));
}

// ── Main: load all data from Sheets in parallel ─────────────
async function loadAllFromSheets() {
  const [config, images, categories, albums, artists, reviews, heroSlides] = await Promise.all([
    sheetsGet('config'),
    sheetsGet('images'),
    sheetsGet('categories'),
    sheetsGet('albums'),
    sheetsGet('artists'),
    sheetsGet('reviews'),
    sheetsGet('hero_slides'),
  ]);
  return {
    config:     transformConfig(config),
    images:     transformImages(images),
    categories: transformCategories(categories),
    albums:     transformAlbums(albums),
    artists:    transformArtists(artists),
    reviews:    transformReviews(reviews),
    heroSlides: transformHeroSlides(heroSlides),
  };
}

// ── Write helpers ───────────────────────────────────────────
async function saveToSheets(action, sheet, row, id) {
  return sheetsPost({ action, sheet, row, id });
}

async function updateConfig(updates) {
  return sheetsPost({ action: 'setConfig', updates });
}

async function submitBooking(row) {
  return sheetsPost({ action: 'submitBooking', row });
}

async function submitReview(row) {
  return sheetsPost({ action: 'submitReview', row });
}

Object.assign(window, {
  SHEETS_URL, sheetsGet, sheetsPost,
  loadAllFromSheets, saveToSheets, updateConfig,
  submitBooking, submitReview,
});

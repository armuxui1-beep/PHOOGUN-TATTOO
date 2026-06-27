/**
 * ██████╗ ██╗  ██╗ ██████╗  ██████╗  ██████╗ ██╗   ██╗███╗   ██╗
 * ██╔══██╗██║  ██║██╔═══██╗██╔═══██╗██╔════╝ ██║   ██║████╗  ██║
 * ██████╔╝███████║██║   ██║██║   ██║██║  ███╗██║   ██║██╔██╗ ██║
 * ██╔═══╝ ██╔══██║██║   ██║██║   ██║██║   ██║██║   ██║██║╚██╗██║
 * ██║     ██║  ██║╚██████╔╝╚██████╔╝╚██████╔╝╚██████╔╝██║ ╚████║
 * ╚═╝     ╚═╝  ╚═╝ ╚═════╝  ╚═════╝  ╚═════╝  ╚═════╝ ╚═╝  ╚═══╝
 *
 * PHOOGUN TATTOO — Google Sheets Database Setup Script v3.0
 * รันครั้งเดียว → สร้างทุกอย่างพร้อมใช้งานทันที
 *
 * ═══════════════════════════════════════════════════════════════
 * วิธีใช้:
 *   1. เปิด sheets.new → Extensions → Apps Script → New project
 *   2. ลบโค้ดเดิมทั้งหมด → วางโค้ดนี้ → Ctrl+S (Save)
 *   3. dropdown เลือก "setupAll" → กด ▶ Run
 *   4. อนุมัติ Permission → Allow → รอ ~30 วินาที
 *   5. Popup ✅ ขึ้น → Deploy → New deployment
 *      Type: Web app | Execute as: Me | Access: Anyone
 *      → Deploy → Copy URL → ส่งให้ developer
 * ═══════════════════════════════════════════════════════════════
 */

// ══════════════════════════════════════════════════════════════
// ░░ SECTION 1 : CONFIG (ทุก setting ที่ควบคุมหน้าเว็บ) ░░
// ══════════════════════════════════════════════════════════════
var CONFIG = [
  // [group, key, value, คำอธิบาย]

  // ── HERO ─────────────────────────────────────────────────────
  ['HERO','heroTitle',        'มิติศิลปะบนเรือนร่าง',                          'หัวข้อหลัก Hero — ไทย'],
  ['HERO','heroTitleEn',      'Body Art Dimension',                              'หัวข้อหลัก Hero — EN'],
  ['HERO','heroSub',          'สู่อนาคตที่หรูหราดุดัน',                         'หัวข้อรอง Hero — ไทย'],
  ['HERO','heroSubEn',        'A Cyberpunk Gothic Saga',                         'หัวข้อรอง Hero — EN'],
  ['HERO','heroDesc',         'PHOOGUN TATTOO ผสานลายสักแบบไซเบอร์แบล็คเวิร์ค ฟอนต์อักขระกอธิค และนีโออิเรซูมิ สู่ผลงานระดับพรีเมียมด้วยเครื่องมือมาตรฐานโรงพยาบาล', 'คำอธิบาย Hero — ไทย'],
  ['HERO','heroDescEn',       'PHOOGUN TATTOO blends cyber-blackwork, gothic typography, and Neo-Irezumi into timeless relics crafted with medical-grade precision.', 'คำอธิบาย Hero — EN'],
  ['HERO','heroBtnBookTh',    'จองคิวสักเลย',                                    'ปุ่ม CTA ซ้าย — ไทย'],
  ['HERO','heroBtnBookEn',    'Book Now',                                         'ปุ่ม CTA ซ้าย — EN'],
  ['HERO','heroBtnGalleryTh', 'ดูผลงาน',                                          'ปุ่ม CTA ขวา — ไทย'],
  ['HERO','heroBtnGalleryEn', 'View Portfolio',                                   'ปุ่ม CTA ขวา — EN'],

  // ── ABOUT ────────────────────────────────────────────────────
  ['ABOUT','aboutTitle',      'เกี่ยวกับ Phoogun Tattoo',                        'หัวข้อ About — ไทย'],
  ['ABOUT','aboutTitleEn',    'About Phoogun Tattoo',                             'หัวข้อ About — EN'],
  ['ABOUT','aboutText',       'สตูดิโอสักระดับพรีเมียมในกรุงเทพฯ ที่ผสานศิลปะดาร์กสไตล์กับเทคนิคระดับสูง ใช้อุปกรณ์สะอาดปลอดเชื้อมาตรฐานการแพทย์ทุกครั้ง', 'เนื้อหา About — ไทย'],
  ['ABOUT','aboutTextEn',     'Premium Bangkok tattoo studio blending dark art with master technique, using hospital-grade sterile equipment on every client.', 'เนื้อหา About — EN'],
  ['ABOUT','aboutImage',      '',                                                  'URL รูปภาพสตูดิโอ (เว้นว่าง = ใช้รูปเดิม)'],

  // ── STATS (ตัวเลขในกล่อง 4 ช่อง) ───────────────────────────
  ['STATS','stat1Val',        '500+',                     'สถิติ 1 — ตัวเลข'],
  ['STATS','stat1Th',         'ผลงานสักสำเร็จ',          'สถิติ 1 — ป้ายกำกับ ไทย'],
  ['STATS','stat1En',         'Tattoos Completed',        'สถิติ 1 — ป้ายกำกับ EN'],
  ['STATS','stat2Val',        '8+',                       'สถิติ 2 — ตัวเลข'],
  ['STATS','stat2Th',         'ปีประสบการณ์',             'สถิติ 2 — ป้ายกำกับ ไทย'],
  ['STATS','stat2En',         'Years Experience',         'สถิติ 2 — ป้ายกำกับ EN'],
  ['STATS','stat3Val',        '4',                        'สถิติ 3 — ตัวเลข'],
  ['STATS','stat3Th',         'ช่างสักมืออาชีพ',          'สถิติ 3 — ป้ายกำกับ ไทย'],
  ['STATS','stat3En',         'Master Artists',           'สถิติ 3 — ป้ายกำกับ EN'],
  ['STATS','stat4Val',        '100%',                     'สถิติ 4 — ตัวเลข'],
  ['STATS','stat4Th',         'มาตรฐานโรงพยาบาล',        'สถิติ 4 — ป้ายกำกับ ไทย'],
  ['STATS','stat4En',         'Hospital Grade',           'สถิติ 4 — ป้ายกำกับ EN'],

  // ── STUDIO INFO ──────────────────────────────────────────────
  ['STUDIO','studioName',     'Phoogun Tattoo',           'ชื่อสตูดิโอ (EN)'],
  ['STUDIO','studioNameTh',   'ภูกัน แทตทู',             'ชื่อสตูดิโอ (ไทย)'],
  ['STUDIO','studioTagline',  'Premium Dark Arts Guild · Bangkok', 'Tagline แถบ Nav'],
  ['STUDIO','studioAddress',  '',                         'ที่อยู่เต็ม (สำหรับหน้า Contact)'],
  ['STUDIO','studioHoursTh',  'เปิด 12:00–21:00 น. (หยุดพฤหัสบดี)', 'เวลาเปิด-ปิด — ไทย'],
  ['STUDIO','studioHoursEn',  'Open 12:00–21:00 (Closed Thursday)', 'เวลาเปิด-ปิด — EN'],

  // ── MARQUEE TEXT ─────────────────────────────────────────────
  ['MARQUEE','marqueeText',   'PHOOGUN TATTOO BANGKOK • CYBER-BLACKWORK • NEO-IREZUMI • HOSPITAL GRADE STERILE • OPEN DAILY 12:00–21:00 • DARK ARTS GUILD', 'ข้อความ marquee แถบเลื่อน (คั่นด้วย •)'],

  // ── GALLERY SECTION ──────────────────────────────────────────
  ['GALLERY','galleryTitleTh','ผลงานสักทั้งหมด',          'หัวข้อ Gallery — ไทย'],
  ['GALLERY','galleryTitleEn','Master Gallery',            'หัวข้อ Gallery — EN'],
  ['GALLERY','galleryKickerTh','พอร์ตโฟลิโอ',             'Kicker ข้างบนหัวข้อ — ไทย'],
  ['GALLERY','galleryKickerEn','Portfolio',                'Kicker ข้างบนหัวข้อ — EN'],

  // ── REVIEWS SECTION ──────────────────────────────────────────
  ['REVIEWS','reviewsTitleTh','เสียงจากลูกค้า',            'หัวข้อ Reviews — ไทย'],
  ['REVIEWS','reviewsTitleEn','Testimonials',              'หัวข้อ Reviews — EN'],
  ['REVIEWS','reviewsFormTitleTh','แชร์ประสบการณ์ของคุณ', 'หัวข้อฟอร์มรีวิว — ไทย'],
  ['REVIEWS','reviewsFormTitleEn','Share Your Experience','หัวข้อฟอร์มรีวิว — EN'],

  // ── CONTACT SECTION ──────────────────────────────────────────
  ['CONTACT','contactTitleTh','ช่องทางติดต่อ',             'หัวข้อ Contact — ไทย'],
  ['CONTACT','contactTitleEn','Contact Us',                'หัวข้อ Contact — EN'],
  ['CONTACT','mapUrl',        '',                          'Google Maps Embed URL (ไปที่ Google Maps → Share → Embed a map → copy URL ใน src="...")'],
  ['CONTACT','mapTitleTh',    'ที่ตั้งสตูดิโอ',            'หัวข้อแผนที่ — ไทย'],
  ['CONTACT','mapTitleEn',    'Studio Location',           'หัวข้อแผนที่ — EN'],

  // ── SOCIAL MEDIA ─────────────────────────────────────────────
  ['SOCIAL','socialFacebook', '',                          'Facebook Page URL เช่น https://facebook.com/phogun.tattoo'],
  ['SOCIAL','socialInstagram','',                          'Instagram URL เช่น https://instagram.com/phoogun.tattoo'],
  ['SOCIAL','socialTiktok',   '',                          'TikTok URL เช่น https://tiktok.com/@phoogun'],
  ['SOCIAL','socialLineoa',   '',                          'LINE OA URL เช่น https://line.me/ti/p/@phoogun'],
  ['SOCIAL','socialTwitter',  '',                          'X/Twitter URL'],
  ['SOCIAL','socialPhone',    '',                          'เบอร์โทร เช่น 0812345678 หรือ +66812345678'],
  ['SOCIAL','socialEmail',    '',                          'อีเมลสตูดิโอ'],

  // ── TRACKING PIXELS ──────────────────────────────────────────
  ['PIXEL','fbPixel',         '',                          '⚡ Facebook Pixel ID — ตัวเลข 15 หลัก เช่น 123456789012345'],
  ['PIXEL','ttPixel',         '',                          '⚡ TikTok Pixel ID — เช่น ABCDE123456'],
  ['PIXEL','gtmId',           '',                          'Google Tag Manager ID — เช่น GTM-XXXXXXX'],
  ['PIXEL','gaId',            '',                          'Google Analytics 4 ID — เช่น G-XXXXXXXXXX'],

  // ── SEO ──────────────────────────────────────────────────────
  ['SEO','metaTitle',         'Phoogun Tattoo Bangkok — Premium Dark Arts',       'Meta Title หน้าเว็บ (ไม่เกิน 60 ตัวอักษร)'],
  ['SEO','metaDesc',          'Premium tattoo studio in Bangkok. Cyber-blackwork, Neo-Irezumi, Dark Minimal. Hospital grade sterile equipment.', 'Meta Description (ไม่เกิน 160 ตัวอักษร)'],
  ['SEO','metaKeywords',      'tattoo bangkok, รอยสัก, cyber blackwork, neo irezumi, phoogun tattoo, dark minimal', 'Keywords คั่นด้วย comma'],
  ['SEO','ogImage',           '',                          'Open Graph Image URL — รูปที่แสดงเมื่อแชร์บน Facebook/LINE'],
  ['SEO','canonicalUrl',      '',                          'URL จริงของเว็บ เช่น https://phoogun.com'],

  // ── ADMIN ────────────────────────────────────────────────────
  ['ADMIN','adminPasscode',   '1337',                      '🔐 รหัสผ่านเข้า Admin — เปลี่ยนก่อนใช้งานจริง!'],
  ['ADMIN','adminEmail',      '',                          'อีเมล Admin สำหรับรับแจ้งเตือน'],
  ['ADMIN','notifyNewReview', 'TRUE',                      'แจ้งเตือนอีเมลเมื่อมีรีวิวใหม่ (TRUE/FALSE)'],
  ['ADMIN','notifyNewBooking','TRUE',                      'แจ้งเตือนอีเมลเมื่อมีการจองใหม่ (TRUE/FALSE)'],
  ['ADMIN','maintenanceMode', 'FALSE',                     'ปิดปรับปรุงชั่วคราว — แสดงหน้า maintenance (TRUE/FALSE)'],
  ['ADMIN','bookingEnabled',  'TRUE',                      'เปิด/ปิดระบบจองคิว (TRUE/FALSE)'],
  ['ADMIN','reviewEnabled',   'TRUE',                      'เปิด/ปิดฟอร์มรีวิว (TRUE/FALSE)'],
  ['ADMIN','autoApproveReview','FALSE',                    'อนุมัติรีวิวอัตโนมัติ ไม่ต้องรอแอดมิน (TRUE/FALSE)'],
];

// ══════════════════════════════════════════════════════════════
// ░░ SECTION 2 : HERO_SLIDES ░░
// ══════════════════════════════════════════════════════════════
var HERO_SLIDES = [
  // [id, imageUrl, label, sortOrder, active]
  ['hs01','https://lh3.googleusercontent.com/aida-public/AB6AXuDgiXQmSzMHmSfD27q--n-wm5VLZU3qx_V6SIe3vY_WUkPh0cGeFJX7Kge41DWxdICukv3B568whg4WinNalEIkod1d3UaG7nlIjKO3Jhx4JASOefyuHpswIoR5xJwcv7QfXgEa2LUzBnQo_BnNtFE2bemaYRHLtnlkal-upg2ve0E-g09aTiDNfDnQfsi6d6YpDV2XVuZjLwf4XgT7hqAO1iIogYX072i2qF2AIbk90_2pLkkteaq9JkIHEPWYv_5f6KcakBC8svI','Neo Cyber Dragon','1','TRUE'],
  ['hs02','https://lh3.googleusercontent.com/aida-public/AB6AXuDgiXQmSzMHmSfD27q--n-wm5VLZU3qx_V6SIe3vY_WUkPh0cGeFJX7Kge41DWxdICukv3B568whg4WinNalEIkod1d3UaG7nlIjKO3Jhx4JASOefyuHpswIoR5xJwcv7QfXgEa2LUzBnQo_BnNtFE2bemaYRHLtnlkal-upg2ve0E-g09aTiDNfDnQfsi6d6YpDV2XVuZjLwf4XgT7hqAO1iIogYX072i2qF2AIbk90_2pLkkteaq9JkIHEPWYv_5f6KcakBC8svI','Crimson Forest Tiger','2','TRUE'],
  ['hs03','https://lh3.googleusercontent.com/aida-public/AB6AXuDmVvp5a-O6o8eagOrQDzNhvQSJVYymrO2cBsoAGgGrxJhxq85_UdK6eOBFu-hQ8Ynw68tH0_paYXY1Vw0nomKlJFtcVxxNQQ8gbTPdggf23_GUpP_dYj2YpU2dLp3W77PEWFYn2LZsQTE6ZsQ1t3wgWKGPZGPbN9_TXFA6ebhw61i5-r3B2bVFJ5bhy8pYaCnpVlNBV-FA2MaykDVPotfRGNYS1eBfO9PqSXQ7ytr_o6hPvoBekOLYOtYeDbXNABEiIlYXutNXHFA','Obsidian Rose','3','TRUE'],
  ['hs04','https://lh3.googleusercontent.com/aida-public/AB6AXuDmVvp5a-O6o8eagOrQDzNhvQSJVYymrO2cBsoAGgGrxJhxq85_UdK6eOBFu-hQ8Ynw68tH0_paYXY1Vw0nomKlJFtcVxxNQQ8gbTPdggf23_GUpP_dYj2YpU2dLp3W77PEWFYn2LZsQTE6ZsQ1t3wgWKGPZGPbN9_TXFA6ebhw61i5-r3B2bVFJ5bhy8pYaCnpVlNBV-FA2MaykDVPotfRGNYS1eBfO9PqSXQ7ytr_o6hPvoBekOLYOtYeDbXNABEiIlYXutNXHFA','Biomechanical Skull','4','TRUE'],
  ['hs05','https://lh3.googleusercontent.com/aida-public/AB6AXuDlxFPGLwnO9FSns5hFtIgbS-QBbkTdyIg57JiB48y-HkZgS_Cq0xeMglSA65l2hW84IE01rTV129znVTEUBAhwsdrlYSum0CI0FWcdcjZYnMBuR-wMJh7v-Z3xFFIULb15om3kuxlDSa-dN7fTGuS0bdg6_O9SAahGYUmM5judb6ty4AhP9nHvyW9D7kOI4OPR2MGVfUaZcDtk75DLApJLG1RDc6kKlKqXFehavEJjXdmGCn3nmAmDulOjv_bHpwaJHORC9VGVXxk','Circuit Geometrics','5','TRUE'],
  ['hs06','https://lh3.googleusercontent.com/aida-public/AB6AXuBa02lFMChvOI6gTbMjtosvVFh3oF_mIyC9e3ElkozEnNkMyT00GxFHRmusrtU8XtrEaf7K8kvQRoQHkFTkr8Xt3lWch3hu-SoWQNciuYyN0MVGPKxu6WXzlIYkpxzfaeucEzfJlEvOfUF6Jt4pW6lT2oRcyCHE8MIxZKz7klsJ152S4XlHbM7x8EfrKW4_Hd1mTLfDzHYrI89nCRoDTzX8Wz_R23R34XpnNPzMc_xbyYAI9fKug2AwkbKBV7_o2P7IaU7sBBr9Scw','Sacred Dotwork','6','TRUE'],
];

// ══════════════════════════════════════════════════════════════
// ░░ SECTION 3 : CATEGORIES (16 สไตล์การสัก) ░░
// ══════════════════════════════════════════════════════════════
var CATEGORIES = [
  // [id, nameTh, nameEn, slug, descTh, sortOrder, active, color]
  ['c01','ไซเบอร์-แบล็คเวิร์ค','Cyber-Blackwork','cyber-blackwork','ลายสักไซเบอร์สไตล์ ใช้หมึกดำล้วนเน้นรายละเอียด วงจรและกลไก','1','TRUE','#e6192e'],
  ['c02','นีโอ-อิเรซูมิ','Neo-Irezumi','neo-irezumi','ศิลปะญี่ปุ่นสมัยใหม่ มังกร คาร์ป เกล็ด ผสมกับ modern style','2','TRUE','#ff6b35'],
  ['c03','จีโอเมตริก','Geometric','geometric','เส้นตรงและรูปทรงเรขาคณิตแม่นยำ ลวดลายนามธรรม','3','TRUE','#4ecdc4'],
  ['c04','ไฟน์ไลน์','Fine Line','fine-line','เส้นบางเบาระดับไมครอน รายละเอียดสูงมาก','4','TRUE','#a8dadc'],
  ['c05','โอเรียนทัล','Oriental','oriental','ลายตะวันออก จีน ญี่ปุ่น ดอกไม้ สัตว์มงคล','5','TRUE','#f7dc6f'],
  ['c06','ดาร์ก มินิมอล','Dark Minimal','dark-minimal','ดำเรียบหรู ลายน้อยแต่มีความหมายลึก','6','TRUE','#aab7b8'],
  ['c07','อักขระ & สคริปต์','Script & Lettering','script','ตัวอักษร ข้อความ คำคม ทั้งไทยและต่างประเทศ','7','TRUE','#d7bde2'],
  ['c08','วอเตอร์คัลเลอร์','Watercolor','watercolor','สีน้ำลงบนผิวหนัง ไหลเป็นธรรมชาติ สีสันสดใส','8','TRUE','#85c1e9'],
  ['c09','ดอทเวิร์ค','Dotwork','dotwork','ใช้จุดเล็กๆ ร้อยเรียงเป็นลวดลาย เน้นแสงเงา','9','TRUE','#f0b27a'],
  ['c10','ไบโอเมคานิคัล','Biomechanical','biomechanical','ผสมร่างกายมนุษย์กับกลไกเครื่องจักร','10','TRUE','#82e0aa'],
  ['c11','แทรชโพลก้า','Trash Polka','trash-polka','ดำ-แดง คอนทราสต์สูง ผสมภาพ collage สุดโกลาหล','11','TRUE','#ec7063'],
  ['c12','ทราดิชันนัล','Traditional','traditional','อเมริกันทราดิชันนัล เส้นหนา สีแน่น สัตว์และดอกไม้','12','TRUE','#f39c12'],
  ['c13','รีอลลิสม์','Realism','realism','ภาพจริงลงผิวหนัง ภาพถ่าย พอร์เทรต ความสมจริงสูง','13','TRUE','#95a5a6'],
  ['c14','ไทยสักยันต์','Sacred Yantra','yantra','ยันต์ไทยโบราณ สักยันต์ มนต์คาถา ความเชื่อ','14','TRUE','#d4ac0d'],
  ['c15','พอร์เทรต','Portrait','portrait','ภาพหน้าคน สัตว์เลี้ยง บุคคลสำคัญ ความละเอียดสูง','15','TRUE','#a9cce3'],
  ['c16','แอนิเมะ & ป็อปอาร์ต','Anime & Pop Art','anime','ตัวละครการ์ตูน อนิเมะ pop culture icons','16','TRUE','#f1948a'],
];

// ══════════════════════════════════════════════════════════════
// ░░ SECTION 4 : ALBUMS ░░
// ══════════════════════════════════════════════════════════════
var ALBUMS = [
  // [id, name, descTh, descEn, promoted, coverUrl, sortOrder, active, createdAt]
  ['a01','Signature Blackwork','ผลงาน Blackwork ที่เป็นเอกลักษณ์ของสตูดิโอ','Studio signature Blackwork collection','TRUE','https://lh3.googleusercontent.com/aida-public/AB6AXuDgiXQmSzMHmSfD27q--n-wm5VLZU3qx_V6SIe3vY_WUkPh0cGeFJX7Kge41DWxdICukv3B568whg4WinNalEIkod1d3UaG7nlIjKO3Jhx4JASOefyuHpswIoR5xJwcv7QfXgEa2LUzBnQo_BnNtFE2bemaYRHLtnlkal-upg2ve0E-g09aTiDNfDnQfsi6d6YpDV2XVuZjLwf4XgT7hqAO1iIogYX072i2qF2AIbk90_2pLkkteaq9JkIHEPWYv_5f6KcakBC8svI','1','TRUE','2026-06-01'],
  ['a02','Oriental Masters','ลายโอเรียนทัลและนีโออิเรซูมิระดับมาสเตอร์','Master-level Oriental and Neo-Irezumi works','TRUE','https://lh3.googleusercontent.com/aida-public/AB6AXuDgiXQmSzMHmSfD27q--n-wm5VLZU3qx_V6SIe3vY_WUkPh0cGeFJX7Kge41DWxdICukv3B568whg4WinNalEIkod1d3UaG7nlIjKO3Jhx4JASOefyuHpswIoR5xJwcv7QfXgEa2LUzBnQo_BnNtFE2bemaYRHLtnlkal-upg2ve0E-g09aTiDNfDnQfsi6d6YpDV2XVuZjLwf4XgT7hqAO1iIogYX072i2qF2AIbk90_2pLkkteaq9JkIHEPWYv_5f6KcakBC8svI','2','TRUE','2026-06-01'],
  ['a03','Dark & Minimal','ลายสักดาร์กมินิมอลและไฟน์ไลน์','Dark minimal and fine line works','FALSE','','3','TRUE','2026-06-01'],
  ['a04','Geometric & Cyber','ลายจีโอเมตริกและไซเบอร์','Geometric and cyber style works','FALSE','','4','TRUE','2026-06-01'],
  ['a05','Studio Showcase','ผลงานเด่นประจำสตูดิโอ','Featured studio works','FALSE','','5','TRUE','2026-06-01'],
];

// ══════════════════════════════════════════════════════════════
// ░░ SECTION 5 : ARTISTS (4 ช่างสัก) ░░
// ══════════════════════════════════════════════════════════════
var ARTISTS = [
  // [id, nameTh, nameEn, specialtyTh, specialtyEn, experience, bio_th, bio_en, imageUrl, availableTh, availableEn, instagram, booking_url, sortOrder, active]
  ['art01','กิม','Kimm',
   'ไซเบอร์-แบล็คเวิร์ค / จีโอเมตริก','Cyber-Blackwork / Geometric',
   '8 ปี',
   'ผู้เชี่ยวชาญลาย Cyber-Blackwork และ Geometric ที่ผสมผสานเทคโนโลยีกับศิลปะ สร้างผลงานที่เหมือนวงจรอิเล็กทรอนิกส์บนผิวหนัง',
   'Master of Cyber-Blackwork and Geometric styles blending technology with art, creating circuit-like works on skin.',
   'https://lh3.googleusercontent.com/aida-public/AB6AXuAygxjP4n5S3j3K8wCXwKgQ1Wqx5Oeoly0u9_-37018ci3SzUZeGbZZNsZwK0XXxTshgTGvOVPvnFDevirOKu87RcfYgzkN9rgZaqyehiHonC5f3-1eTiANKF5WFl1Qi_g9AI9mDzIMrHqM_XQSUCY5GJ8mQbc3HJOF2IHNQcZqdackfMrKEvXUp4HORZ52EAQb1V4Wd2nlw-j7B_r_ukuJfx_nwpmfeORip0zEfaGwWQrz0zTxTLvh-GZB_jPusQIIZiqfrIzOs78',
   'จันทร์-ศุกร์','Mon–Fri','','','1','TRUE'],

  ['art02','พิมพ์ดาว','Pimdao',
   'นีโอ-อิเรซูมิ & หมึกแดงพิเศษ','Neo-Irezumi & Signature Red Ink',
   '6 ปี',
   'ช่างสักเชี่ยวชาญลายมังกรและ Neo-Irezumi ผสมหมึกแดงพิเศษที่พัฒนาสูตรเฉพาะ ผลงานโดดเด่นระดับประเทศ',
   'Dragon and Neo-Irezumi specialist with a signature red ink formula. Award-winning works recognized nationwide.',
   'https://lh3.googleusercontent.com/aida-public/AB6AXuCIU2q6Q7_OPUqH_Ncw0cJc8jRD9DS7etsxWjTbZJBMs2UQSms4FMQQVfgnI9lH8QjK-scwofSxgJunM4REa0tfOKziCDWWhAvQiKJpN-nVFVK7o2D_4uzPTbgtvLs2NLUN1BBZsABXsTlHikiq6ylF5CxWsjiKWlQ1QX-7R-zfd8Z7gZsRz1V4wUfF7EV049PbEt_GvA5soKv6pF-OV2ikmTf_syyhXmk_2x5FS9EbQePbte9gxvwzPrsMKJ6y3We4oG3z7z03Zqw',
   'ทุกวัน','Everyday','','','2','TRUE'],

  ['art03','กวิน','Kawin',
   'ดาร์ก มินิมอล & สคริปต์','Dark Minimal & Script Lettering',
   '5 ปี',
   'ศิลปินด้าน Fine Line และ Script Lettering ความแม่นยำระดับไมครอน สร้างข้อความและลวดลายที่เรียบแต่ทรงพลัง',
   'Fine Line and Script Lettering artist with micron-level precision. Simple yet powerful designs.',
   'https://lh3.googleusercontent.com/aida-public/AB6AXuBF8MnRnyPu8OkIjlQ3fwbvqs6Wx0sy7p4xVLwIm8IO3lQYsdLEqVcTX1FmrN_taDXpikld8kGyQ22ojLDp-S8Gh2hMcIKSGA_t89RzwIEJ0lbrgbyKwvIn50g_zxhV6WeUutWEHooe27RTCi2Q_HvFG19B8osIi-knKJ6yyCEUs_HjeSimb6v4jWOlS6acMI6sifYr1GC_tIdcRHHU2wMLfRtdzEagdXaY1YDQxECo2VeY4kfQUunFp2rua6FWrdOzldoCpEK0J8A',
   'พุธ-อาทิตย์','Wed–Sun','','','3','TRUE'],

  ['art04','เจตน์','Jay',
   'โอเรียนทัล & ไฟน์ไลน์','Oriental & Fine Line',
   '7 ปี',
   'ผู้เชี่ยวชาญลาย Oriental Traditional และ Fine Line ที่มีชื่อเสียงระดับนานาชาติ ผลงานจัดแสดงทั้งในไทยและต่างประเทศ',
   'Internationally recognized Oriental Traditional and Fine Line specialist. Works exhibited in Thailand and abroad.',
   'https://lh3.googleusercontent.com/aida-public/AB6AXuBkfqYqHFleT42qaAdx_Gp2BLkpOiNGu49Wzzxpwp3_VU_G-3zeB2ipVe0dDkxDxkh1801TXCtQgOxxj708I-Sldw-K3IEclMaxYzZZn3JztAZuX2cAmFgFFX9VC-Ie2UygDv5zIaWxvFszdmxDRsuTiXBh1ehA1SDMETyrjLYm4ln8sTDZyeWXAzxYVaZKxOhvkoRoqhYjiM9tSYJdbLZPUXidH7jbtmbKSljkukWkK5LFBbuTt9F9pdV6mycygUPzogfB_OUIiRk',
   'ศุกร์-อาทิตย์','Fri–Sun','','','4','TRUE'],
];

// ══════════════════════════════════════════════════════════════
// ░░ SECTION 6 : IMAGES (11 ผลงาน พร้อมทุก field) ░░
// ══════════════════════════════════════════════════════════════
var IMAGES = [
  // [id, albumId, categoryId, title, titleEn, artistId, artistName, tags,
  //  imageUrl, featured, likes, sortOrder, active, createdAt,
  //  description, descriptionEn, placement, placementEn,
  //  size, duration, sessions, price, priceNote]

  ['img01','a01','c01',
   'Neo Cyber Dragon Backpiece','Neo Cyber Dragon Backpiece',
   'art02','พิมพ์ดาว',
   'dragon,backpiece,cyber,neo-irezumi,fullback',
   'https://lh3.googleusercontent.com/aida-public/AB6AXuDgiXQmSzMHmSfD27q--n-wm5VLZU3qx_V6SIe3vY_WUkPh0cGeFJX7Kge41DWxdICukv3B568whg4WinNalEIkod1d3UaG7nlIjKO3Jhx4JASOefyuHpswIoR5xJwcv7QfXgEa2LUzBnQo_BnNtFE2bemaYRHLtnlkal-upg2ve0E-g09aTiDNfDnQfsi6d6YpDV2XVuZjLwf4XgT7hqAO1iIogYX072i2qF2AIbk90_2pLkkteaq9JkIHEPWYv_5f6KcakBC8svI',
   'TRUE','184','1','TRUE','2026-06-09',
   'มังกรไซเบอร์เต็มหลัง ผสม Neo-Irezumi กับ Blackwork เส้นสายละเอียดกว่า 400 ชั่วโมงออกแบบ',
   'Full-back cyber dragon blending Neo-Irezumi with Blackwork. Over 400 hours of design work.',
   'กลางหลัง (เต็มหลัง)','Center Back (Full Back)','Full Back','15 ชั่วโมง','3','35,000','ราคาไม่รวม touch-up'],

  ['img02','a04','c03',
   'Circuit Geometrics Sleeve','Circuit Geometrics Sleeve',
   'art01','กิม',
   'sleeve,circuit,geometric,cyber,halfback',
   'https://lh3.googleusercontent.com/aida-public/AB6AXuDlxFPGLwnO9FSns5hFtIgbS-QBbkTdyIg57JiB48y-HkZgS_Cq0xeMglSA65l2hW84IE01rTV129znVTEUBAhwsdrlYSum0CI0FWcdcjZYnMBuR-wMJh7v-Z3xFFIULb15om3kuxlDSa-dN7fTGuS0bdg6_O9SAahGYUmM5judb6ty4AhP9nHvyW9D7kOI4OPR2MGVfUaZcDtk75DLApJLG1RDc6kKlKqXFehavEJjXdmGCn3nmAmDulOjv_bHpwaJHORC9VGVXxk',
   'TRUE','156','2','TRUE','2026-03-02',
   'วงจรอิเล็กทรอนิกส์จีโอเมตริก แขนครึ่งท่อน เส้นแม่นยำทุกเส้น',
   'Geometric circuit board half-sleeve with pinpoint precision lines.',
   'แขนครึ่งท่อน','Half Sleeve','Half Sleeve','8 ชั่วโมง','2','18,000',''],

  ['img03','a03','c06',
   'Obsidian Rose Fine Line','Obsidian Rose Fine Line',
   'art03','กวิน',
   'rose,fineline,wrist,dark-minimal,obsidian',
   'https://lh3.googleusercontent.com/aida-public/AB6AXuCnRxnajIfCa_AovEvC6m8MAqd8seDcPTRty7tWO2nlYBxfzFBHGVYg1l403CUISfp9g6HemAFaVJOeMs0S8_y4LZKVoKSX3HVkGIUg0pvoa96FtFwI0i5O7TXo4JSJK__F4FolpeX6dWaQNcQIXbgTHNrDgg7mtvaelLavUZC8adMpCFwV9Bro65SzccDQbeZzEGzLEeiYI-vwe6w7_-bTBChRuo1TNz2kmoD86vPELIsfunGUBpuZBc93HfwfR2SauG7gJfTENDM',
   'FALSE','142','3','TRUE','2025-11-18',
   'กุหลาบออบซิเดียน ไฟน์ไลน์ที่ข้อมือ เรียบง่ายแต่ดุดัน',
   'Obsidian rose fine line at the wrist. Minimal yet powerful.',
   'ข้อมือ','Wrist','Medium (~10cm)','3 ชั่วโมง','1','8,500',''],

  ['img04','a05','c05',
   'Studio Workspace','Studio Workspace',
   'art01','กิม',
   'studio,workspace,interior',
   'https://lh3.googleusercontent.com/aida-public/AB6AXuBa02lFMChvOI6gTbMjtosvVFh3oF_mIyC9e3ElkozEnNkMyT00GxFHRmusrtU8XtrEaf7K8kvQRoQHkFTkr8Xt3lWch3hu-SoWQNciuYyN0MVGPKxu6WXzlIYkpxzfaeucEzfJlEvOfUF6Jt4pW6lT2oRcyCHE8MIxZKz7klsJ152S4XlHbM7x8EfrKW4_Hd1mTLfDzHYrI89nCRoDTzX8Wz_R23R34XpnNPzMc_xbyYAI9fKug2AwkbKBV7_o2P7IaU7sBBr9Scw',
   'FALSE','98','4','TRUE','2026-01-01',
   'ภายในสตูดิโอ Phoogun — พื้นที่ทำงานมาตรฐานการแพทย์','Interior of Phoogun Studio — medical-grade workspace.',
   'สตูดิโอ','Studio','—','—','—','—',''],

  ['img05','a02','c05',
   'Crimson Forest Tiger','Crimson Forest Tiger',
   'art04','เจตน์',
   'tiger,oriental,red,neo-irezumi,thigh',
   'https://lh3.googleusercontent.com/aida-public/AB6AXuDgiXQmSzMHmSfD27q--n-wm5VLZU3qx_V6SIe3vY_WUkPh0cGeFJX7Kge41DWxdICukv3B568whg4WinNalEIkod1d3UaG7nlIjKO3Jhx4JASOefyuHpswIoR5xJwcv7QfXgEa2LUzBnQo_BnNtFE2bemaYRHLtnlkal-upg2ve0E-g09aTiDNfDnQfsi6d6YpDV2XVuZjLwf4XgT7hqAO1iIogYX072i2qF2AIbk90_2pLkkteaq9JkIHEPWYv_5f6KcakBC8svI',
   'TRUE','217','5','TRUE','2026-04-15',
   'เสือในป่าลึก Neo-Irezumi ผสมหมึกแดงพิเศษ ต้นขา','Forest tiger Neo-Irezumi with signature red ink. Thigh piece.',
   'ต้นขา','Thigh','XL (~30cm)','12 ชั่วโมง','3','28,000',''],

  ['img06','a01','c10',
   'Biomechanical Skull Sleeve','Biomechanical Skull Sleeve',
   'art01','กิม',
   'skull,biomechanical,sleeve,fullsleeve,cyber',
   'https://lh3.googleusercontent.com/aida-public/AB6AXuDmVvp5a-O6o8eagOrQDzNhvQSJVYymrO2cBsoAGgGrxJhxq85_UdK6eOBFu-hQ8Ynw68tH0_paYXY1Vw0nomKlJFtcVxxNQQ8gbTPdggf23_GUpP_dYj2YpU2dLp3W77PEWFYn2LZsQTE6ZsQ1t3wgWKGPZGPbN9_TXFA6ebhw61i5-r3B2bVFJ5bhy8pYaCnpVlNBV-FA2MaykDVPotfRGNYS1eBfO9PqSXQ7ytr_o6hPvoBekOLYOtYeDbXNABEiIlYXutNXHFA',
   'TRUE','198','6','TRUE','2026-02-20',
   'กะโหลก Biomechanical เต็มแขน รายละเอียดสูง ใช้เวลารวม 4 sessions','Full sleeve biomechanical skull — high detail, 4 sessions total.',
   'แขนเต็ม','Full Sleeve','Full Sleeve','20 ชั่วโมง','4','45,000',''],

  ['img07','a04','c03',
   'Linear Flow Geometry','Linear Flow Geometry',
   'art01','กิม',
   'geometric,linear,calf,abstract',
   'https://lh3.googleusercontent.com/aida-public/AB6AXuDlxFPGLwnO9FSns5hFtIgbS-QBbkTdyIg57JiB48y-HkZgS_Cq0xeMglSA65l2hW84IE01rTV129znVTEUBAhwsdrlYSum0CI0FWcdcjZYnMBuR-wMJh7v-Z3xFFIULb15om3kuxlDSa-dN7fTGuS0bdg6_O9SAahGYUmM5judb6ty4AhP9nHvyW9D7kOI4OPR2MGVfUaZcDtk75DLApJLG1RDc6kKlKqXFehavEJjXdmGCn3nmAmDulOjv_bHpwaJHORC9VGVXxk',
   'FALSE','113','7','TRUE','2026-03-15',
   'เส้นไหลจีโอเมตริก น่อง นามธรรมแต่มีจังหวะ','Flowing geometric lines on the calf. Abstract yet rhythmic.',
   'น่อง','Calf','Large (~20cm)','5 ชั่วโมง','1','12,000',''],

  ['img08','a01','c11',
   'Crimson Chest Chaos','Crimson Chest Chaos',
   'art04','เจตน์',
   'chest,red,trash-polka,crimson',
   'https://lh3.googleusercontent.com/aida-public/AB6AXuBveLvY8WUdwu5KE677bxyMv4-xTO35bJFYmamqkomB9KgJRouEndeaYrfSL7Mb9WzuG2_piT5SDcLz7mxIrcFEf9yTRQXiz-RkkQKETl7Se16c7_Nc5gxEbdVugcPCL5CE_yetxHFZ8IUAO-oBCf8fZrUHME6q30Mo0cri8S-TmOo-d-yTs-o7pXdhiumrlpnnrb0v0gBN0f_Q2gbnPEIdW6kSOmw5gf9vPjaQwdh1_R_3J7PWWFABF8fe2uP_36awPmtqzXGJQqo',
   'FALSE','175','8','TRUE','2026-01-10',
   'Trash Polka หน้าอก ดำ-แดงคอนทราสต์สูง สุดโกลาหล','Trash Polka chest piece. High contrast black and red chaos.',
   'หน้าอก','Chest','Full Chest','10 ชั่วโมง','2','22,000',''],

  ['img09','a02','c09',
   'Sacred Back Dotwork','Sacred Back Dotwork',
   'art02','พิมพ์ดาว',
   'dotwork,back,sacred,yantra,thai',
   'https://lh3.googleusercontent.com/aida-public/AB6AXuBa02lFMChvOI6gTbMjtosvVFh3oF_mIyC9e3ElkozEnNkMyT00GxFHRmusrtU8XtrEaf7K8kvQRoQHkFTkr8Xt3lWch3hu-SoWQNciuYyN0MVGPKxu6WXzlIYkpxzfaeucEzfJlEvOfUF6Jt4pW6lT2oRcyCHE8MIxZKz7klsJ152S4XlHbM7x8EfrKW4_Hd1mTLfDzHYrI89nCRoDTzX8Wz_R23R34XpnNPzMc_xbyYAI9fKug2AwkbKBV7_o2P7IaU7sBBr9Scw',
   'FALSE','132','9','TRUE','2026-05-01',
   'Dotwork ศักดิ์สิทธิ์ลายไทยผสมยันต์ หลังบน ลึกและมีเลเยอร์','Sacred Thai dotwork with yantra elements. Upper back, layered depth.',
   'หลังบน','Upper Back','Full Back','18 ชั่วโมง','4','38,000',''],

  ['img10','a01','c01',
   'Obsidian Wings Portrait','Obsidian Wings Portrait',
   'art01','กิม',
   'wings,portrait,raven,blackwork,chest',
   'https://lh3.googleusercontent.com/aida-public/AB6AXuAObOILhCxXIsTdQvYLmmUFU0pXwAWbpbmz57p94D-GIPiOja7R2mRZyL54INKOgjn9I5IJU9f3STn_zVh5n9GyOSlvUY6EhPDBRtUhKYZnNdq4omTX0_kBs58iIqjoDVY7fRBdbQcEmwn3HAzzEa5GQIkzFUL5Ccze4cjMH0QBIG6CNmE9Ax42casv2aT4K6Ipzb1t5JRJtv2JiUmZ_v7FeVoUXCjqy-gATSVGJJ98JQ4baesxguFZCV5bTY67ijYHN9AM6r6hjqI',
   'TRUE','167','10','TRUE','2026-04-22',
   'ปีกอีกา Blackwork เต็มอก สมมาตรสมบูรณ์แบบ','Raven wings Blackwork full chest. Perfect symmetry.',
   'หน้าอก','Chest','Full Chest','8 ชั่วโมง','1','20,000',''],

  ['img11','a03','c07',
   'Gothic Knuckles Script','Gothic Knuckles Script',
   'art03','กวิน',
   'script,knuckles,gothic,lettering',
   'https://lh3.googleusercontent.com/aida-public/AB6AXuCnRxnajIfCa_AovEvC6m8MAqd8seDcPTRty7tWO2nlYBxfzFBHGVYg1l403CUISfp9g6HemAFaVJOeMs0S8_y4LZKVoKSX3HVkGIUg0pvoa96FtFwI0i5O7TXo4JSJK__F4FolpeX6dWaQNcQIXbgTHNrDgg7mtvaelLavUZC8adMpCFwV9Bro65SzccDQbeZzEGzLEeiYI-vwe6w7_-bTBChRuo1TNz2kmoD86vPELIsfunGUBpuZBc93HfwfR2SauG7gJfTENDM',
   'FALSE','144','11','TRUE','2025-12-05',
   'อักขระ Gothic บนนิ้วมือ Script Lettering ความแม่นยำสูง','Gothic script lettering across the knuckles. High precision.',
   'นิ้วมือ','Knuckles','Small (~3cm/finger)','2 ชั่วโมง','1','5,000',''],
];

// ══════════════════════════════════════════════════════════════
// ░░ SECTION 7 : REVIEWS ░░
// ══════════════════════════════════════════════════════════════
var REVIEWS = [
  // [id, author, phone_last4, rating, message, artist, service, status,
  //  createdAt, adminReply, featured, ip, source]
  ['r01','อนันดา สิริโชติ','****','5','งานสักดาร์กมินิมอลกับช่างกวินสวยมาก บรรยากาศดีมากครับ','กวิน','Script & Lettering','approved','2026-06-07','','TRUE','','walk-in'],
  ['r02','มุกรินทร์ แก้วมณี','****','5','ช่างพิมพ์ดาวสักมังกรได้อลังการมาก คุ้มค่ามากๆ ค่ะ จะกลับมาอีกแน่นอน','พิมพ์ดาว','Neo-Irezumi','approved','2026-06-08','ขอบคุณมากนะคะ ยินดีต้อนรับกลับมาเสมอค่ะ 🙏','FALSE','','google'],
  ['r03','ธนพัทธ์ เดชะ','****','4','งานแขนไซเบอร์กับช่างกิมเท่สุด รายละเอียดเยอะมากครับ','กิม','Cyber-Blackwork','approved','2026-06-09','','FALSE','','facebook'],
  ['r04','สมหญิง แสงทอง','****','5','มาสักครั้งแรก ประทับใจมาก สะอาด ปลอดภัย ช่างพูดคุยดีและอธิบายละเอียด','เจตน์','Oriental','approved','2026-06-10','','TRUE','','line'],
  ['r05','แพรวพรรณ นวลจันทร์','****','5','ดูแกลเลอรีแล้วประทับใจมาก จะมาจองในเร็วๆ นี้ค่ะ','กวิน','','pending','2026-06-12','','FALSE','','website'],
  ['r06','วีระชัย มงคลแก้ว','****','5','สักมังกรครั้งแรก ตื่นเต้นมากแต่ช่างพิมพ์ดาวทำให้รู้สึกผ่อนคลาย ผลงานสวยเกินคาด','พิมพ์ดาว','Neo-Irezumi','pending','2026-06-15','','FALSE','','website'],
];

// ══════════════════════════════════════════════════════════════
// ░░ SECTION 8 : BOOKINGS (template — รอรับจากเว็บ) ░░
// ══════════════════════════════════════════════════════════════
var BOOKINGS_HEADERS = [
  'id','timestamp','name','phone','email',
  'artistId','artistName','categoryId','categoryName',
  'style','placement','size','budget','message','referenceUrl',
  'status','appointmentDate','appointmentTime',
  'depositPaid','depositAmount','totalAmount',
  'adminNotes','notifiedAt','completedAt','createdAt'
];

// ── ตัวอย่าง booking 1 รายการเพื่อให้เห็นโครงสร้าง ──────────
var BOOKINGS_SAMPLE = [
  ['BK-001','2026-06-27 10:30:00','ตัวอย่าง ทดสอบ','0812345678','test@email.com',
   'art02','พิมพ์ดาว','c01','Cyber-Blackwork',
   'Neo-Irezumi + Red ink','หลัง (กลาง)','Full Back','30000-50000','อยากได้มังกรเต็มหลัง ผสมสีแดง','',
   'pending','','',
   'FALSE','','',
   'ทดสอบระบบ','','','2026-06-27']
];

// ══════════════════════════════════════════════════════════════
// ░░ MAIN : setupAll — รันครั้งเดียวจบ ░░
// ══════════════════════════════════════════════════════════════
function setupAll() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.rename('🖤 PHOOGUN TATTOO — Database');

  var log = [];

  log.push(buildConfigSheet(ss));
  log.push(buildSheet(ss, '🎬 hero_slides',  ['id','imageUrl','label','sortOrder','active'], HERO_SLIDES,    '#2d1a00'));
  log.push(buildSheet(ss, '🏷️ categories',   ['id','nameTh','nameEn','slug','descTh','sortOrder','active','color'], CATEGORIES, '#0d2200'));
  log.push(buildSheet(ss, '📁 albums',        ['id','name','descTh','descEn','promoted','coverUrl','sortOrder','active','createdAt'], ALBUMS, '#001a2d'));
  log.push(buildSheet(ss, '🎨 artists',       ['id','nameTh','nameEn','specialtyTh','specialtyEn','experience','bio_th','bio_en','imageUrl','availableTh','availableEn','instagram','bookingUrl','sortOrder','active'], ARTISTS, '#1a002d'));
  log.push(buildSheet(ss, '🖼️ images',        ['id','albumId','categoryId','title','titleEn','artistId','artistName','tags','imageUrl','featured','likes','sortOrder','active','createdAt','description','descriptionEn','placement','placementEn','size','duration','sessions','price','priceNote'], IMAGES, '#2d0000'));
  log.push(buildSheet(ss, '⭐ reviews',       ['id','author','phone_last4','rating','message','artist','service','status','createdAt','adminReply','featured','ip','source'], REVIEWS, '#2d2200'));
  log.push(buildBookingsSheet(ss));

  // ลบ Sheet เปล่าที่ Google สร้างให้อัตโนมัติ
  ['Sheet1','แผ่น1'].forEach(function(n) {
    var s = ss.getSheetByName(n);
    if (s && ss.getSheets().length > 1) try { ss.deleteSheet(s); } catch(e) {}
  });

  // สรุป
  var summary = '✅ สร้างฐานข้อมูล PHOOGUN TATTOO สำเร็จ!\n\n';
  summary += log.join('\n') + '\n\n';
  summary += '═════════════════════════════\n';
  summary += '⚠️ สำคัญ: เปลี่ยน adminPasscode ใน Sheet config!\n\n';
  summary += '👉 ขั้นต่อไป — Deploy API:\n';
  summary += '1. กด Deploy → New deployment\n';
  summary += '2. Type: Web app\n';
  summary += '3. Execute as: Me\n';
  summary += '4. Who has access: Anyone\n';
  summary += '5. Deploy → Copy URL\n';
  summary += '6. ส่ง URL ให้ developer เชื่อมเว็บ';

  Logger.log(summary);
  SpreadsheetApp.getUi().alert(summary);
}

// ══════════════════════════════════════════════════════════════
// ░░ HELPER BUILDERS ░░
// ══════════════════════════════════════════════════════════════
function buildConfigSheet(ss) {
  var name = '⚙️ config';
  var s = ss.getSheetByName(name);
  if (s) s.clear(); else s = ss.insertSheet(name, 0);

  // Headers
  var hdr = s.getRange(1,1,1,4);
  hdr.setValues([['GROUP','KEY','VALUE','DESCRIPTION']]);
  hdr.setFontWeight('bold').setBackground('#0a0a0a').setFontColor('#e6192e').setFontSize(10);

  // Data
  s.getRange(2,1,CONFIG.length,4).setValues(CONFIG);

  // Color rows by group
  var groupBg = {
    HERO:'#1a1a2e', ABOUT:'#1a2e1a', STATS:'#2e2a1a',
    STUDIO:'#2e1a2e', MARQUEE:'#1a2e2e', GALLERY:'#1a1a3a',
    REVIEWS:'#2e1a1a', CONTACT:'#1a2a2a', SOCIAL:'#1a1a3e',
    PIXEL:'#3a1a00', SEO:'#1a2a1a', ADMIN:'#3a0000'
  };
  for (var i = 0; i < CONFIG.length; i++) {
    var bg = groupBg[CONFIG[i][0]] || '#111111';
    s.getRange(i+2,1,1,4).setBackground(bg).setFontColor('#cccccc');
    s.getRange(i+2,3,1,1).setFontColor('#ffffff').setFontWeight('bold'); // value bold white
  }

  s.setColumnWidth(1,90); s.setColumnWidth(2,200);
  s.setColumnWidth(3,440); s.setColumnWidth(4,380);
  s.setFrozenRows(1);
  s.getRange(1,1,1,4).setHorizontalAlignment('center');

  return '⚙️  config          — ' + CONFIG.length + ' settings';
}

function buildSheet(ss, name, headers, data, headerBg) {
  var s = ss.getSheetByName(name);
  if (s) s.clear(); else s = ss.insertSheet(name);

  var hdr = s.getRange(1,1,1,headers.length);
  hdr.setValues([headers]);
  hdr.setFontWeight('bold').setBackground(headerBg || '#0a0a0a').setFontColor('#ffffff').setFontSize(10);
  s.setFrozenRows(1);

  if (data.length > 0) {
    s.getRange(2,1,data.length,headers.length).setValues(data);
    // Alternating rows
    for (var i = 0; i < data.length; i++) {
      var bg = i % 2 === 0 ? '#111111' : '#0d0d0d';
      s.getRange(i+2,1,1,headers.length).setBackground(bg).setFontColor('#cccccc');
    }
  }

  // Auto-resize all columns (capped at 400px)
  for (var c = 1; c <= headers.length; c++) {
    s.autoResizeColumn(c);
    if (s.getColumnWidth(c) > 400) s.setColumnWidth(c, 400);
  }

  var shortName = name.replace(/[🎬🏷️📁🎨🖼️⭐⚙️ ]/g,'').trim();
  return padRight(name, 22) + '— ' + data.length + ' rows';
}

function buildBookingsSheet(ss) {
  var name = '📋 bookings';
  var s = ss.getSheetByName(name);
  if (s) s.clear(); else s = ss.insertSheet(name);

  var hdr = s.getRange(1,1,1,BOOKINGS_HEADERS.length);
  hdr.setValues([BOOKINGS_HEADERS]);
  hdr.setFontWeight('bold').setBackground('#003300').setFontColor('#4ade80').setFontSize(10);
  s.setFrozenRows(1);

  // Sample row
  s.getRange(2,1,1,BOOKINGS_SAMPLE[0].length).setValues(BOOKINGS_SAMPLE);
  s.getRange(2,1,1,BOOKINGS_HEADERS.length).setBackground('#0a1a0a').setFontColor('#aaaaaa');

  // Status dropdown validation
  var statusRule = SpreadsheetApp.newDataValidation()
    .requireValueInList(['pending','confirmed','completed','cancelled','no-show'], true).build();
  s.getRange(2,16,1000,1).setDataValidation(statusRule);

  for (var c = 1; c <= BOOKINGS_HEADERS.length; c++) {
    s.autoResizeColumn(c);
    if (s.getColumnWidth(c) > 300) s.setColumnWidth(c, 300);
  }
  s.setColumnWidth(10,200); s.setColumnWidth(13,220); s.setColumnWidth(14,350);

  return '📋 bookings        — ready (1 sample row)';
}

function padRight(str, len) {
  while (str.length < len) str += ' ';
  return str;
}

// ══════════════════════════════════════════════════════════════
// ░░ WEB APP API — doGet / doPost ░░
// ══════════════════════════════════════════════════════════════

/**
 * GET ?sheet=config
 * GET ?sheet=images
 * GET ?sheet=reviews&filter=approved
 * GET ?sheet=bookings&id=BK-001
 */
function doGet(e) {
  var p    = e.parameter;
  var name = findSheet(p.sheet || '');
  if (!name) return out({error: 'sheet not found: ' + p.sheet});

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var s  = ss.getSheetByName(name);
  var rows = s.getDataRange().getValues();

  // Config → return as flat key:value object
  if ((p.sheet || '').toLowerCase() === 'config') {
    var cfg = {};
    for (var i = 1; i < rows.length; i++) {
      if (rows[i][1]) cfg[rows[i][1]] = String(rows[i][2]);
    }
    return out({ok:true, data:cfg});
  }

  var headers = rows[0];
  var data = rows.slice(1).map(function(row) {
    var obj = {};
    headers.forEach(function(h,i){ obj[h] = String(row[i]||''); });
    return obj;
  });

  // Filter by field=value
  if (p.filter && p.filterValue) {
    data = data.filter(function(r){ return r[p.filter] === p.filterValue; });
  }
  // status shorthand
  if (p.filter === 'approved') {
    data = data.filter(function(r){ return r['status'] === 'approved'; });
  }
  // active only
  if (!p.includeInactive) {
    data = data.filter(function(r){ return r['active'] !== 'FALSE'; });
  }
  // by id
  if (p.id) {
    var found = data.filter(function(r){ return r['id'] === p.id; });
    return out({ok:true, data: found[0]||null});
  }

  return out({ok:true, data:data, count:data.length});
}

/**
 * POST body JSON:
 *   {action:'add',    sheet:'images', row:{...}}
 *   {action:'update', sheet:'images', id:'img01', row:{...}}
 *   {action:'delete', sheet:'images', id:'img01'}
 *   {action:'setConfig', updates:{key:value,...}}
 *   {action:'submitBooking', row:{...}}   ← จากฟอร์มหน้าเว็บ
 *   {action:'submitReview',  row:{...}}   ← จากฟอร์มรีวิว
 */
function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var ss   = SpreadsheetApp.getActiveSpreadsheet();

    // ── setConfig (batch update) ──────────────────────────────
    if (body.action === 'setConfig') {
      var cfg = ss.getSheetByName('⚙️ config');
      var rows = cfg.getDataRange().getValues();
      Object.keys(body.updates).forEach(function(key) {
        for (var i=1; i<rows.length; i++) {
          if (rows[i][1] === key) { cfg.getRange(i+1,3).setValue(body.updates[key]); return; }
        }
      });
      return out({ok:true, message:'Config updated'});
    }

    // ── submitBooking (from website form) ─────────────────────
    if (body.action === 'submitBooking') {
      var bk = ss.getSheetByName('📋 bookings');
      var row = body.row || {};
      var id  = 'BK-' + Utilities.formatDate(new Date(), 'Asia/Bangkok', 'yyyyMMddHHmmss');
      var newRow = BOOKINGS_HEADERS.map(function(h) {
        if (h==='id') return id;
        if (h==='timestamp') return Utilities.formatDate(new Date(),'Asia/Bangkok','yyyy-MM-dd HH:mm:ss');
        if (h==='status') return 'pending';
        if (h==='createdAt') return Utilities.formatDate(new Date(),'Asia/Bangkok','yyyy-MM-dd');
        return row[h] || '';
      });
      bk.appendRow(newRow);
      bk.getRange(bk.getLastRow(),1,1,BOOKINGS_HEADERS.length)
        .setBackground('#0a1a0a').setFontColor('#cccccc');

      // แจ้งเตือนอีเมล admin
      notifyAdmin('📋 จองคิวใหม่', 'ชื่อ: '+row.name+'\nโทร: '+row.phone+'\nช่าง: '+row.artistName+'\nบริการ: '+row.style);
      return out({ok:true, id:id, message:'Booking submitted'});
    }

    // ── submitReview (from website form) ──────────────────────
    if (body.action === 'submitReview') {
      var rv = ss.getSheetByName('⭐ reviews');
      var row = body.row || {};
      var autoApprove = getConfig(ss, 'autoApproveReview') === 'TRUE';
      var id = 'r' + (Date.now().toString().slice(-6));
      var newRow = [
        id, row.author||'', row.phone_last4||'****', row.rating||5,
        row.message||'', row.artist||'', row.service||'',
        autoApprove ? 'approved' : 'pending',
        Utilities.formatDate(new Date(),'Asia/Bangkok','yyyy-MM-dd'),
        '','FALSE','','website'
      ];
      rv.appendRow(newRow);
      notifyAdmin('⭐ รีวิวใหม่', 'จาก: '+row.author+'\nคะแนน: '+row.rating+'/5\n'+row.message);
      return out({ok:true, id:id, message:'Review submitted'});
    }

    // ── add / update / delete (generic) ──────────────────────
    var sheetName = findSheet(body.sheet || '');
    if (!sheetName) return out({error:'sheet not found: '+body.sheet});
    var s = ss.getSheetByName(sheetName);
    var headers = s.getRange(1,1,1,s.getLastColumn()).getValues()[0];

    if (body.action === 'add') {
      var newRow = headers.map(function(h){ return body.row[h]!==undefined ? body.row[h] : ''; });
      s.appendRow(newRow);
      var lr = s.getLastRow();
      s.getRange(lr,1,1,headers.length).setBackground(lr%2===0?'#111111':'#0d0d0d').setFontColor('#cccccc');
      return out({ok:true, message:'Row added', id:body.row.id||''});
    }

    if (body.action === 'update') {
      var all = s.getDataRange().getValues();
      var idIdx = headers.indexOf('id');
      for (var i=1; i<all.length; i++) {
        if (String(all[i][idIdx]) === String(body.id)) {
          var updated = headers.map(function(h,j){ return body.row[h]!==undefined ? body.row[h] : all[i][j]; });
          s.getRange(i+1,1,1,headers.length).setValues([updated]);
          return out({ok:true, message:'Updated', id:body.id});
        }
      }
      return out({error:'Row not found: '+body.id});
    }

    if (body.action === 'delete') {
      var all = s.getDataRange().getValues();
      var idIdx = headers.indexOf('id');
      for (var i=1; i<all.length; i++) {
        if (String(all[i][idIdx]) === String(body.id)) {
          s.deleteRow(i+1);
          return out({ok:true, message:'Deleted', id:body.id});
        }
      }
      return out({error:'Row not found: '+body.id});
    }

    return out({error:'Unknown action: '+body.action});

  } catch(err) {
    return out({error:err.message, stack:err.stack});
  }
}

// ══════════════════════════════════════════════════════════════
// ░░ UTILITIES ░░
// ══════════════════════════════════════════════════════════════
function out(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

function findSheet(name) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  // exact match first
  if (ss.getSheetByName(name)) return name;
  // find sheet containing the name (handles emoji prefix)
  var sheets = ss.getSheets();
  for (var i=0; i<sheets.length; i++) {
    if (sheets[i].getName().toLowerCase().indexOf(name.toLowerCase()) !== -1) return sheets[i].getName();
  }
  return null;
}

function getConfig(ss, key) {
  var s = ss.getSheetByName('⚙️ config');
  if (!s) return '';
  var data = s.getDataRange().getValues();
  for (var i=1; i<data.length; i++) {
    if (data[i][1] === key) return String(data[i][2]);
  }
  return '';
}

function notifyAdmin(subject, body) {
  try {
    var ss  = SpreadsheetApp.getActiveSpreadsheet();
    var email = getConfig(ss, 'adminEmail');
    var notify = getConfig(ss, 'notifyNewBooking');
    if (email && notify === 'TRUE') {
      MailApp.sendEmail(email, '[PHOOGUN] '+subject, body+'\n\n---\nPhoogun Tattoo Database');
    }
  } catch(e) { Logger.log('Email notification failed: '+e.message); }
}

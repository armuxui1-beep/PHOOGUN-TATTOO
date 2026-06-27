// ============================================================
// PHOOGUN TATTOO — Google Apps Script  v2 (FULL DATA)
// รันครั้งเดียว → สร้าง 8 Sheets ครบทุก field ทุก detail
//
// วิธีใช้:
//   1. sheet.new → Extensions → Apps Script → วางโค้ดนี้ → Save
//   2. เลือก Function: setupAll → ▶️ Run → Allow permission
//   3. รอ ~20 วินาที → popup ✅
//   4. Deploy → New deployment → Web app
//      Execute as: Me | Who has access: Anyone → Deploy
//      Copy URL → ส่งให้ developer
// ============================================================

// ─────────────────────────────────────────────────────────────
// 1. CONFIG — ทุก setting ที่ควบคุมหน้าเว็บ
// ─────────────────────────────────────────────────────────────
const CONFIG_DATA = [
  // group, key, value, description
  ['HERO', 'heroTitle',       'มิติศิลปะบนเรือนร่าง',           'หัวข้อหลัก Hero (ภาษาไทย)'],
  ['HERO', 'heroTitleEn',    'Body Art Dimension',               'หัวข้อหลัก Hero (English)'],
  ['HERO', 'heroSub',        'สู่อนาคตที่หรูหราดุดัน',         'หัวข้อรอง Hero (ภาษาไทย)'],
  ['HERO', 'heroSubEn',      'A Cyberpunk Gothic Saga',          'หัวข้อรอง Hero (English)'],
  ['HERO', 'heroDesc',       'PHOOGUN TATTOO ผสานลายสักแบบไซเบอร์แบล็คเวิร์ค ฟอนต์อักขระกอธิค และนีโออิเรซูมิ สู่ผลงานระดับพรีเมียมด้วยเครื่องมือมาตรฐานโรงพยาบาล', 'คำอธิบาย Hero (ไทย)'],
  ['HERO', 'heroDescEn',     'PHOOGUN TATTOO blends cyber-blackwork, gothic typography, and Neo-Irezumi into timeless relics crafted with medical-grade precision.', 'คำอธิบาย Hero (EN)'],
  ['ABOUT', 'aboutTitle',    'เกี่ยวกับ Phoogun Tattoo',        'หัวข้อ About (ไทย)'],
  ['ABOUT', 'aboutTitleEn',  'About Phoogun Tattoo',             'หัวข้อ About (EN)'],
  ['ABOUT', 'aboutText',     'สตูดิโอสักระดับพรีเมียมในกรุงเทพฯ ที่ผสานศิลปะดาร์กสไตล์กับเทคนิคระดับสูง ใช้อุปกรณ์สะอาดปลอดเชื้อมาตรฐานการแพทย์ทุกครั้ง', 'เนื้อหา About (ไทย)'],
  ['ABOUT', 'aboutTextEn',   'Premium Bangkok tattoo studio blending dark art with master technique, using hospital-grade sterile equipment on every client.', 'เนื้อหา About (EN)'],
  ['ABOUT', 'aboutImage',    '',                                  'URL รูปสตูดิโอ (เว้นว่าง = ใช้รูปเดิม)'],
  ['STATS', 'stat1Val',      '500+',                             'สถิติ 1 — ตัวเลข'],
  ['STATS', 'stat1Th',       'ผลงานสักสำเร็จ',                  'สถิติ 1 — ป้ายกำกับ (ไทย)'],
  ['STATS', 'stat1En',       'Tattoos Completed',                'สถิติ 1 — ป้ายกำกับ (EN)'],
  ['STATS', 'stat2Val',      '8+',                               'สถิติ 2 — ตัวเลข'],
  ['STATS', 'stat2Th',       'ปีประสบการณ์',                    'สถิติ 2 — ป้ายกำกับ (ไทย)'],
  ['STATS', 'stat2En',       'Years Experience',                 'สถิติ 2 — ป้ายกำกับ (EN)'],
  ['STATS', 'stat3Val',      '4',                                'สถิติ 3 — ตัวเลข'],
  ['STATS', 'stat3Th',       'ช่างสักมืออาชีพ',                 'สถิติ 3 — ป้ายกำกับ (ไทย)'],
  ['STATS', 'stat3En',       'Master Artists',                   'สถิติ 3 — ป้ายกำกับ (EN)'],
  ['STATS', 'stat4Val',      '100%',                             'สถิติ 4 — ตัวเลข'],
  ['STATS', 'stat4Th',       'มาตรฐานโรงพยาบาล',               'สถิติ 4 — ป้ายกำกับ (ไทย)'],
  ['STATS', 'stat4En',       'Hospital Grade',                   'สถิติ 4 — ป้ายกำกับ (EN)'],
  ['STUDIO','studioName',    'Phoogun Tattoo',                   'ชื่อสตูดิโอ'],
  ['STUDIO','studioNameTh',  'ภูกัน แทตทู',                     'ชื่อสตูดิโอ (ภาษาไทย)'],
  ['STUDIO','studioAddress', 'กรุงเทพฯ ประเทศไทย',             'ที่อยู่สตูดิโอ'],
  ['STUDIO','studioHours',   'เปิด 12:00–21:00 น. (หยุดพฤหัส)','เวลาเปิด-ปิด (ไทย)'],
  ['STUDIO','studioHoursEn', 'Open 12:00–21:00 (Closed Thursday)','เวลาเปิด-ปิด (EN)'],
  ['STUDIO','studioPhone',   '',                                  'เบอร์โทรสตูดิโอ'],
  ['STUDIO','studioEmail',   '',                                  'อีเมลสตูดิโอ'],
  ['MAP',   'mapUrl',        '',                                  'Google Maps Embed URL (ใส่ค่าจาก Google Maps → Share → Embed)'],
  ['SOCIAL','socialFacebook','',                                  'URL Facebook Page'],
  ['SOCIAL','socialInstagram','',                                 'URL Instagram'],
  ['SOCIAL','socialTiktok',  '',                                  'URL TikTok Profile'],
  ['SOCIAL','socialLineoa',  '',                                  'URL LINE OA'],
  ['SOCIAL','socialTwitter', '',                                  'URL X/Twitter'],
  ['SOCIAL','socialPhone',   '',                                  'เบอร์โทรแสดงบนเว็บ'],
  ['PIXEL', 'fbPixel',       '',                                  'Facebook Pixel ID (ตัวเลข 15 หลัก)'],
  ['PIXEL', 'ttPixel',       '',                                  'TikTok Pixel ID'],
  ['PIXEL', 'gtmId',         '',                                  'Google Tag Manager ID (GTM-XXXXXXX)'],
  ['ADMIN', 'adminPasscode', '1337',                              '⚠️ รหัสผ่าน Admin — เปลี่ยนก่อนใช้งานจริง!'],
  ['ADMIN', 'adminEmail',    '',                                  'อีเมล Admin (สำหรับรับแจ้งเตือน)'],
  ['ADMIN', 'notifyReview',  'TRUE',                             'แจ้งเตือนอีเมลเมื่อมีรีวิวใหม่ (TRUE/FALSE)'],
  ['ADMIN', 'notifyBooking', 'TRUE',                             'แจ้งเตือนอีเมลเมื่อมีการจองใหม่ (TRUE/FALSE)'],
  ['SEO',   'metaTitle',     'Phoogun Tattoo Bangkok — Premium Dark Arts',  'Meta Title หน้าเว็บ'],
  ['SEO',   'metaDesc',      'Premium tattoo studio in Bangkok. Cyber-blackwork, Neo-Irezumi, Dark Minimal. Hospital grade sterile.', 'Meta Description'],
  ['SEO',   'metaKeywords',  'tattoo bangkok, รอยสัก, cyber blackwork, neo irezumi, phoogun tattoo', 'Meta Keywords'],
  ['SEO',   'ogImage',       '',                                  'Open Graph Image URL (รูปเมื่อแชร์บน social)'],
];

// ─────────────────────────────────────────────────────────────
// 2. HERO_SLIDES — สไลด์ carousel ที่เคย hardcode
// ─────────────────────────────────────────────────────────────
const HERO_SLIDES_DATA = [
  // id, imageUrl, label, sortOrder, active
  ['hs01', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDgiXQmSzMHmSfD27q--n-wm5VLZU3qx_V6SIe3vY_WUkPh0cGeFJX7Kge41DWxdICukv3B568whg4WinNalEIkod1d3UaG7nlIjKO3Jhx4JASOefyuHpswIoR5xJwcv7QfXgEa2LUzBnQo_BnNtFE2bemaYRHLtnlkal-upg2ve0E-g09aTiDNfDnQfsi6d6YpDV2XVuZjLwf4XgT7hqAO1iIogYX072i2qF2AIbk90_2pLkkteaq9JkIHEPWYv_5f6KcakBC8svI', 'Neo Cyber Dragon', '1', 'TRUE'],
  ['hs02', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDgiXQmSzMHmSfD27q--n-wm5VLZU3qx_V6SIe3vY_WUkPh0cGeFJX7Kge41DWxdICukv3B568whg4WinNalEIkod1d3UaG7nlIjKO3Jhx4JASOefyuHpswIoR5xJwcv7QfXgEa2LUzBnQo_BnNtFE2bemaYRHLtnlkal-upg2ve0E-g09aTiDNfDnQfsi6d6YpDV2XVuZjLwf4XgT7hqAO1iIogYX072i2qF2AIbk90_2pLkkteaq9JkIHEPWYv_5f6KcakBC8svI', 'Crimson Forest Tiger', '2', 'TRUE'],
  ['hs03', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmVvp5a-O6o8eagOrQDzNhvQSJVYymrO2cBsoAGgGrxJhxq85_UdK6eOBFu-hQ8Ynw68tH0_paYXY1Vw0nomKlJFtcVxxNQQ8gbTPdggf23_GUpP_dYj2YpU2dLp3W77PEWFYn2LZsQTE6ZsQ1t3wgWKGPZGPbN9_TXFA6ebhw61i5-r3B2bVFJ5bhy8pYaCnpVlNBV-FA2MaykDVPotfRGNYS1eBfO9PqSXQ7ytr_o6hPvoBekOLYOtYeDbXNABEiIlYXutNXHFA', 'Obsidian Rose', '3', 'TRUE'],
  ['hs04', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmVvp5a-O6o8eagOrQDzNhvQSJVYymrO2cBsoAGgGrxJhxq85_UdK6eOBFu-hQ8Ynw68tH0_paYXY1Vw0nomKlJFtcVxxNQQ8gbTPdggf23_GUpP_dYj2YpU2dLp3W77PEWFYn2LZsQTE6ZsQ1t3wgWKGPZGPbN9_TXFA6ebhw61i5-r3B2bVFJ5bhy8pYaCnpVlNBV-FA2MaykDVPotfRGNYS1eBfO9PqSXQ7ytr_o6hPvoBekOLYOtYeDbXNABEiIlYXutNXHFA', 'Biomechanical Skull', '4', 'TRUE'],
  ['hs05', 'https://lh3.googleusercontent.com/aida-public/AB6AXuDgiXQmSzMHmSfD27q--n-wm5VLZU3qx_V6SIe3vY_WUkPh0cGeFJX7Kge41DWxdICukv3B568whg4WinNalEIkod1d3UaG7nlIjKO3Jhx4JASOefyuHpswIoR5xJwcv7QfXgEa2LUzBnQo_BnNtFE2bemaYRHLtnlkal-upg2ve0E-g09aTiDNfDnQfsi6d6YpDV2XVuZjLwf4XgT7hqAO1iIogYX072i2qF2AIbk90_2pLkkteaq9JkIHEPWYv_5f6KcakBC8svI', 'Circuit Geometrics', '5', 'TRUE'],
  ['hs06', 'https://lh3.googleusercontent.com/aida-public/AB6AXuBa02lFMChvOI6gTbMjtosvVFh3oF_mIyC9e3ElkozEnNkMyT00GxFHRmusrtU8XtrEaf7K8kvQRoQHkFTkr8Xt3lWch3hu-SoWQNciuYyN0MVGPKxu6WXzlIYkpxzfaeucEzfJlEvOfUF6Jt4pW6lT2oRcyCHE8MIxZKz7klsJ152S4XlHbM7x8EfrKW4_Hd1mTLfDzHYrI89nCRoDTzX8Wz_R23R34XpnNPzMc_xbyYAI9fKug2AwkbKBV7_o2P7IaU7sBBr9Scw', 'Sacred Dotwork', '6', 'TRUE'],
];

// ─────────────────────────────────────────────────────────────
// 3. CATEGORIES
// ─────────────────────────────────────────────────────────────
const CATEGORIES_DATA = [
  // id, nameTh, nameEn, slug, sortOrder, active
  ['c01','ไซเบอร์-แบล็คเวิร์ค','Cyber-Blackwork','cyber-blackwork','1','TRUE'],
  ['c02','นีโอ-อิเรซูมิ','Neo-Irezumi','neo-irezumi','2','TRUE'],
  ['c03','จีโอเมตริก','Geometric','geometric','3','TRUE'],
  ['c04','ไฟน์ไลน์','Fine Line','fine-line','4','TRUE'],
  ['c05','โอเรียนทัล','Oriental','oriental','5','TRUE'],
  ['c06','ดาร์ก มินิมอล','Dark Minimal','dark-minimal','6','TRUE'],
  ['c07','อักขระ & สคริปต์','Script & Lettering','script','7','TRUE'],
  ['c08','วอเตอร์คัลเลอร์','Watercolor','watercolor','8','TRUE'],
  ['c09','ดอทเวิร์ค','Dotwork','dotwork','9','TRUE'],
  ['c10','ไบโอเมคานิคัล','Biomechanical','biomechanical','10','TRUE'],
  ['c11','แทรชโพลก้า','Trash Polka','trash-polka','11','TRUE'],
  ['c12','ทราดิชันนัล','Traditional','traditional','12','TRUE'],
  ['c13','รีอลลิสม์','Realism','realism','13','TRUE'],
  ['c14','ไทยสักยันต์','Sacred Yantra','yantra','14','TRUE'],
  ['c15','พอร์เทรต','Portrait','portrait','15','TRUE'],
  ['c16','แอนิเมะ & ป็อปอาร์ต','Anime & Pop Art','anime','16','TRUE'],
];

// ─────────────────────────────────────────────────────────────
// 4. ALBUMS
// ─────────────────────────────────────────────────────────────
const ALBUMS_DATA = [
  // id, name, descTh, descEn, promoted, cover, sortOrder, active, createdAt
  ['a01','Signature Blackwork','ผลงาน Blackwork ที่เป็นเอกลักษณ์ของสตูดิโอ','Studio signature Blackwork works','TRUE','https://lh3.googleusercontent.com/aida-public/AB6AXuDgiXQmSzMHmSfD27q--n-wm5VLZU3qx_V6SIe3vY_WUkPh0cGeFJX7Kge41DWxdICukv3B568whg4WinNalEIkod1d3UaG7nlIjKO3Jhx4JASOefyuHpswIoR5xJwcv7QfXgEa2LUzBnQo_BnNtFE2bemaYRHLtnlkal-upg2ve0E-g09aTiDNfDnQfsi6d6YpDV2XVuZjLwf4XgT7hqAO1iIogYX072i2qF2AIbk90_2pLkkteaq9JkIHEPWYv_5f6KcakBC8svI','1','TRUE','2026-06-01'],
  ['a02','Oriental Masters','ลายโอเรียนทัลและนีโออิเรซูมิระดับมาสเตอร์','Master-level Oriental and Neo-Irezumi works','TRUE','https://lh3.googleusercontent.com/aida-public/AB6AXuDgiXQmSzMHmSfD27q--n-wm5VLZU3qx_V6SIe3vY_WUkPh0cGeFJX7Kge41DWxdICukv3B568whg4WinNalEIkod1d3UaG7nlIjKO3Jhx4JASOefyuHpswIoR5xJwcv7QfXgEa2LUzBnQo_BnNtFE2bemaYRHLtnlkal-upg2ve0E-g09aTiDNfDnQfsi6d6YpDV2XVuZjLwf4XgT7hqAO1iIogYX072i2qF2AIbk90_2pLkkteaq9JkIHEPWYv_5f6KcakBC8svI','2','TRUE','2026-06-01'],
  ['a03','Dark & Minimal','ลายสักดาร์กมินิมอลและไฟน์ไลน์','Dark minimal and fine line works','FALSE','','3','TRUE','2026-06-01'],
  ['a04','Geometric & Cyber','ลายจีโอเมตริกและไซเบอร์','Geometric and cyber style works','FALSE','','4','TRUE','2026-06-01'],
  ['a05','Studio Showcase','ผลงานเด่นประจำสตูดิโอ','Featured studio works','FALSE','','5','TRUE','2026-06-01'],
];

// ─────────────────────────────────────────────────────────────
// 5. ARTISTS — ทุก field รวม bio EN, instagram, sort
// ─────────────────────────────────────────────────────────────
const ARTISTS_DATA = [
  // id,nameTh,nameEn,specialty,specialtyTh,experience,bio_th,bio_en,imageUrl,available,availableTh,instagram,sortOrder,active
  ['art01','กิม','Kimm','Cyber-Blackwork / Geometric','ไซเบอร์-แบล็คเวิร์ค / จีโอเมตริก','8 ปี','ผู้เชี่ยวชาญลาย Cyber-Blackwork และ Geometric ที่ผสมผสานเทคโนโลยีกับศิลปะ','Master of Cyber-Blackwork and Geometric styles blending technology with art','https://lh3.googleusercontent.com/aida-public/AB6AXuAygxjP4n5S3j3K8wCXwKgQ1Wqx5Oeoly0u9_-37018ci3SzUZeGbZZNsZwK0XXxTshgTGvOVPvnFDevirOKu87RcfYgzkN9rgZaqyehiHonC5f3-1eTiANKF5WFl1Qi_g9AI9mDzIMrHqM_XQSUCY5GJ8mQbc3HJOF2IHNQcZqdackfMrKEvXUp4HORZ52EAQb1V4Wd2nlw-j7B_r_ukuJfx_nwpmfeORip0zEfaGwWQrz0zTxTLvh-GZB_jPusQIIZiqfrIzOs78','จ-ศ','Mon–Fri','','1','TRUE'],
  ['art02','พิมพ์ดาว','Pimdao','Neo-Irezumi & Red Ink','นีโอ-อิเรซูมิ & หมึกแดง','6 ปี','ช่างสักเชี่ยวชาญลายมังกรและ Neo-Irezumi ผสมหมึกแดงพิเศษ','Dragon and Neo-Irezumi specialist with signature red ink technique','https://lh3.googleusercontent.com/aida-public/AB6AXuCIU2q6Q7_OPUqH_Ncw0cJc8jRD9DS7etsxWjTbZJBMs2UQSms4FMQQVfgnI9lH8QjK-scwofSxgJunM4REa0tfOKziCDWWhAvQiKJpN-nVFVK7o2D_4uzPTbgtvLs2NLUN1BBZsABXsTlHikiq6ylF5CxWsjiKWlQ1QX-7R-zfd8Z7gZsRz1V4wUfF7EV049PbEt_GvA5soKv6pF-OV2ikmTf_syyhXmk_2x5FS9EbQePbte9gxvwzPrsMKJ6y3We4oG3z7z03Zqw','ทุกวัน','Everyday','','2','TRUE'],
  ['art03','กวิน','Kawin','Dark Minimal & Script','ดาร์ก มินิมอล & อักขระ','5 ปี','ศิลปินด้าน Fine Line และ Script Lettering ความแม่นยำระดับไมครอน','Fine Line and Script Lettering artist with micron-level precision','https://lh3.googleusercontent.com/aida-public/AB6AXuBF8MnRnyPu8OkIjlQ3fwbvqs6Wx0sy7p4xVLwIm8IO3lQYsdLEqVcTX1FmrN_taDXpikld8kGyQ22ojLDp-S8Gh2hMcIKSGA_t89RzwIEJ0lbrgbyKwvIn50g_zxhV6WeUutWEHooe27RTCi2Q_HvFG19B8osIi-knKJ6yyCEUs_HjeSimb6v4jWOlS6acMI6sifYr1GC_tIdcRHHU2wMLfRtdzEagdXaY1YDQxECo2VeY4kfQUunFp2rua6FWrdOzldoCpEK0J8A','พ-อา','Wed–Sun','','3','TRUE'],
  ['art04','เจตน์','Jay','Oriental & Fine Line','โอเรียนทัล & ไฟน์ไลน์','7 ปี','ผู้เชี่ยวชาญลาย Oriental Traditional และ Fine Line ที่มีชื่อเสียงระดับนานาชาติ','Internationally recognized Oriental Traditional and Fine Line specialist','https://lh3.googleusercontent.com/aida-public/AB6AXuBkfqYqHFleT42qaAdx_Gp2BLkpOiNGu49Wzzxpwp3_VU_G-3zeB2ipVe0dDkxDxkh1801TXCtQgOxxj708I-Sldw-K3IEclMaxYzZZn3JztAZuX2cAmFgFFX9VC-Ie2UygDv5zIaWxvFszdmxDRsuTiXBh1ehA1SDMETyrjLYm4ln8sTDZyeWXAzxYVaZKxOhvkoRoqhYjiM9tSYJdbLZPUXidH7jbtmbKSljkukWkK5LFBbuTt9F9pdV6mycygUPzogfB_OUIiRk','ศ-อา','Fri–Sun','','4','TRUE'],
];

// ─────────────────────────────────────────────────────────────
// 6. IMAGES — ทุก field รวม description, placement, size, price
// ─────────────────────────────────────────────────────────────
const IMAGES_DATA = [
  // id,albumId,categoryId,title,titleEn,artist,tags,imageUrl,featured,likes,sortOrder,active,createdAt,description,placement,placementEn,size,duration,price
  ['img01','a01','c01','Neo Cyber Dragon Backpiece','Neo Cyber Dragon Backpiece','พิมพ์ดาว','dragon,backpiece,cyber','https://lh3.googleusercontent.com/aida-public/AB6AXuDgiXQmSzMHmSfD27q--n-wm5VLZU3qx_V6SIe3vY_WUkPh0cGeFJX7Kge41DWxdICukv3B568whg4WinNalEIkod1d3UaG7nlIjKO3Jhx4JASOefyuHpswIoR5xJwcv7QfXgEa2LUzBnQo_BnNtFE2bemaYRHLtnlkal-upg2ve0E-g09aTiDNfDnQfsi6d6YpDV2XVuZjLwf4XgT7hqAO1iIogYX072i2qF2AIbk90_2pLkkteaq9JkIHEPWYv_5f6KcakBC8svI','TRUE','184','1','TRUE','2026-06-09','ลายมังกรไซเบอร์เต็มหลัง ผสม Neo-Irezumi กับ Blackwork','กลางหลัง','Center Back','Full Back','15 ชั่วโมง (3 sessions)','35000'],
  ['img02','a04','c03','Circuit Geometrics Sleeve','Circuit Geometrics Sleeve','กิม','sleeve,circuit,geo','https://lh3.googleusercontent.com/aida-public/AB6AXuDlxFPGLwnO9FSns5hFtIgbS-QBbkTdyIg57JiB48y-HkZgS_Cq0xeMglSA65l2hW84IE01rTV129znVTEUBAhwsdrlYSum0CI0FWcdcjZYnMBuR-wMJh7v-Z3xFFIULb15om3kuxlDSa-dN7fTGuS0bdg6_O9SAahGYUmM5judb6ty4AhP9nHvyW9D7kOI4OPR2MGVfUaZcDtk75DLApJLG1RDc6kKlKqXFehavEJjXdmGCn3nmAmDulOjv_bHpwaJHORC9VGVXxk','TRUE','156','2','TRUE','2026-03-02','วงจรอิเล็กทรอนิกส์จีโอเมตริก ครึ่งแขน','แขนครึ่งท่อน','Half Sleeve','Half Sleeve','8 ชั่วโมง (2 sessions)','18000'],
  ['img03','a03','c06','Obsidian Rose Fine Line','Obsidian Rose Fine Line','กวิน','rose,fineline,wrist','https://lh3.googleusercontent.com/aida-public/AB6AXuCnRxnajIfCa_AovEvC6m8MAqd8seDcPTRty7tWO2nlYBxfzFBHGVYg1l403CUISfp9g6HemAFaVJOeMs0S8_y4LZKVoKSX3HVkGIUg0pvoa96FtFwI0i5O7TXo4JSJK__F4FolpeX6dWaQNcQIXbgTHNrDgg7mtvaelLavUZC8adMpCFwV9Bro65SzccDQbeZzEGzLEeiYI-vwe6w7_-bTBChRuo1TNz2kmoD86vPELIsfunGUBpuZBc93HfwfR2SauG7gJfTENDM','FALSE','142','3','TRUE','2025-11-18','กุหลาบออบซิเดียนไฟน์ไลน์','ข้อมือ','Wrist','Medium (10cm)','3 ชั่วโมง','8500'],
  ['img04','a05','c05','Studio Workspace','Studio Workspace','กิม','studio,workspace','https://lh3.googleusercontent.com/aida-public/AB6AXuBa02lFMChvOI6gTbMjtosvVFh3oF_mIyC9e3ElkozEnNkMyT00GxFHRmusrtU8XtrEaf7K8kvQRoQHkFTkr8Xt3lWch3hu-SoWQNciuYyN0MVGPKxu6WXzlIYkpxzfaeucEzfJlEvOfUF6Jt4pW6lT2oRcyCHE8MIxZKz7klsJ152S4XlHbM7x8EfrKW4_Hd1mTLfDzHYrI89nCRoDTzX8Wz_R23R34XpnNPzMc_xbyYAI9fKug2AwkbKBV7_o2P7IaU7sBBr9Scw','FALSE','98','4','TRUE','2026-01-01','ภายในสตูดิโอ Phoogun','สตูดิโอ','Studio','—','—','—'],
  ['img05','a02','c05','Crimson Forest Tiger','Crimson Forest Tiger','เจตน์','tiger,oriental,red','https://lh3.googleusercontent.com/aida-public/AB6AXuDgiXQmSzMHmSfD27q--n-wm5VLZU3qx_V6SIe3vY_WUkPh0cGeFJX7Kge41DWxdICukv3B568whg4WinNalEIkod1d3UaG7nlIjKO3Jhx4JASOefyuHpswIoR5xJwcv7QfXgEa2LUzBnQo_BnNtFE2bemaYRHLtnlkal-upg2ve0E-g09aTiDNfDnQfsi6d6YpDV2XVuZjLwf4XgT7hqAO1iIogYX072i2qF2AIbk90_2pLkkteaq9JkIHEPWYv_5f6KcakBC8svI','TRUE','217','5','TRUE','2026-04-15','เสือในป่าลึก Neo-Irezumi + หมึกแดงพิเศษ','ต้นขา','Thigh','XL (30cm)','12 ชั่วโมง (3 sessions)','28000'],
  ['img06','a01','c10','Biomechanical Skull Sleeve','Biomechanical Skull Sleeve','กิม','skull,biomech,sleeve','https://lh3.googleusercontent.com/aida-public/AB6AXuDmVvp5a-O6o8eagOrQDzNhvQSJVYymrO2cBsoAGgGrxJhxq85_UdK6eOBFu-hQ8Ynw68tH0_paYXY1Vw0nomKlJFtcVxxNQQ8gbTPdggf23_GUpP_dYj2YpU2dLp3W77PEWFYn2LZsQTE6ZsQ1t3wgWKGPZGPbN9_TXFA6ebhw61i5-r3B2bVFJ5bhy8pYaCnpVlNBV-FA2MaykDVPotfRGNYS1eBfO9PqSXQ7ytr_o6hPvoBekOLYOtYeDbXNABEiIlYXutNXHFA','TRUE','198','6','TRUE','2026-02-20','กะโหลก Biomechanical เต็มแขน รายละเอียดสูง','แขนเต็ม','Full Sleeve','Full Sleeve','20 ชั่วโมง (4 sessions)','45000'],
  ['img07','a04','c03','Linear Flow Geometry','Linear Flow Geometry','กิม','geometric,linear,calf','https://lh3.googleusercontent.com/aida-public/AB6AXuDlxFPGLwnO9FSns5hFtIgbS-QBbkTdyIg57JiB48y-HkZgS_Cq0xeMglSA65l2hW84IE01rTV129znVTEUBAhwsdrlYSum0CI0FWcdcjZYnMBuR-wMJh7v-Z3xFFIULb15om3kuxlDSa-dN7fTGuS0bdg6_O9SAahGYUmM5judb6ty4AhP9nHvyW9D7kOI4OPR2MGVfUaZcDtk75DLApJLG1RDc6kKlKqXFehavEJjXdmGCn3nmAmDulOjv_bHpwaJHORC9VGVXxk','FALSE','113','7','TRUE','2026-03-15','เส้นไหลจีโอเมตริก','น่อง','Calf','Large (20cm)','5 ชั่วโมง','12000'],
  ['img08','a01','c11','Crimson Chest Chaos','Crimson Chest Chaos','เจตน์','chest,red,polka','https://lh3.googleusercontent.com/aida-public/AB6AXuBveLvY8WUdwu5KE677bxyMv4-xTO35bJFYmamqkomB9KgJRouEndeaYrfSL7Mb9WzuG2_piT5SDcLz7mxIrcFEf9yTRQXiz-RkkQKETl7Se16c7_Nc5gxEbdVugcPCL5CE_yetxHFZ8IUAO-oBCf8fZrUHME6q30Mo0cri8S-TmOo-d-yTs-o7pXdhiumrlpnnrb0v0gBN0f_Q2gbnPEIdW6kSOmw5gf9vPjaQwdh1_R_3J7PWWFABF8fe2uP_36awPmtqzXGJQqo','FALSE','175','8','TRUE','2026-01-10','Trash Polka หน้าอก ใช้หมึกแดงและดำ','หน้าอก','Chest','Full Chest','10 ชั่วโมง (2 sessions)','22000'],
  ['img09','a02','c09','Sacred Back Dotwork','Sacred Back Dotwork','พิมพ์ดาว','dotwork,back,sacred','https://lh3.googleusercontent.com/aida-public/AB6AXuBa02lFMChvOI6gTbMjtosvVFh3oF_mIyC9e3ElkozEnNkMyT00GxFHRmusrtU8XtrEaf7K8kvQRoQHkFTkr8Xt3lWch3hu-SoWQNciuYyN0MVGPKxu6WXzlIYkpxzfaeucEzfJlEvOfUF6Jt4pW6lT2oRcyCHE8MIxZKz7klsJ152S4XlHbM7x8EfrKW4_Hd1mTLfDzHYrI89nCRoDTzX8Wz_R23R34XpnNPzMc_xbyYAI9fKug2AwkbKBV7_o2P7IaU7sBBr9Scw','FALSE','132','9','TRUE','2026-05-01','Dotwork ศักดิ์สิทธิ์ลายไทยผสมยันต์','หลังบน','Upper Back','Full Back','18 ชั่วโมง (4 sessions)','38000'],
  ['img10','a01','c01','Obsidian Wings Portrait','Obsidian Wings Portrait','กิม','wings,portrait,raven','https://lh3.googleusercontent.com/aida-public/AB6AXuAObOILhCxXIsTdQvYLmmUFU0pXwAWbpbmz57p94D-GIPiOja7R2mRZyL54INKOgjn9I5IJU9f3STn_zVh5n9GyOSlvUY6EhPDBRtUhKYZnNdq4omTX0_kBs58iIqjoDVY7fRBdbQcEmwn3HAzzEa5GQIkzFUL5Ccze4cjMH0QBIG6CNmE9Ax42casv2aT4K6Ipzb1t5JRJtv2JiUmZ_v7FeVoUXCjqy-gATSVGJJ98JQ4baesxguFZCV5bTY67ijYHN9AM6r6hjqI','TRUE','167','10','TRUE','2026-04-22','ปีกอีกา Blackwork เต็มอก','หน้าอก','Chest','Full Chest','8 ชั่วโมง','20000'],
  ['img11','a03','c07','Gothic Knuckles Script','Gothic Knuckles Script','กวิน','script,knuckles,gothic','https://lh3.googleusercontent.com/aida-public/AB6AXuCnRxnajIfCa_AovEvC6m8MAqd8seDcPTRty7tWO2nlYBxfzFBHGVYg1l403CUISfp9g6HemAFaVJOeMs0S8_y4LZKVoKSX3HVkGIUg0pvoa96FtFwI0i5O7TXo4JSJK__F4FolpeX6dWaQNcQIXbgTHNrDgg7mtvaelLavUZC8adMpCFwV9Bro65SzccDQbeZzEGzLEeiYI-vwe6w7_-bTBChRuo1TNz2kmoD86vPELIsfunGUBpuZBc93HfwfR2SauG7gJfTENDM','FALSE','144','11','TRUE','2025-12-05','อักขระ Gothic บนนิ้วมือ Script Lettering','นิ้วมือ','Knuckles','Small','2 ชั่วโมง','5000'],
];

// ─────────────────────────────────────────────────────────────
// 7. REVIEWS
// ─────────────────────────────────────────────────────────────
const REVIEWS_DATA = [
  // id,author,rating,message,artist,status,createdAt,adminReply,featured,ip
  ['r01','อนันดา สิริโชติ','5','งานสักดาร์กมินิมอลกับช่างกวินสวยมาก บรรยากาศดีมากครับ','กวิน','approved','2026-06-07','','TRUE',''],
  ['r02','มุกรินทร์ แก้วมณี','5','ช่างพิมพ์ดาวสักมังกรได้อลังการมาก คุ้มค่ามากๆ ค่ะ','พิมพ์ดาว','approved','2026-06-08','ขอบคุณมากนะคะ ยินดีต้อนรับกลับมาเสมอ','FALSE',''],
  ['r03','ธนพัทธ์ เดชะ','4','งานแขนไซเบอร์กับช่างกิมเท่สุด รายละเอียดเยอะมากครับ','กิม','approved','2026-06-09','','FALSE',''],
  ['r04','สมหญิง แสงทอง','5','มาสักครั้งแรก ประทับใจมาก สะอาด ปลอดภัย ช่างพูดคุยดี','เจตน์','approved','2026-06-10','','TRUE',''],
  ['r05','แพรวพรรณ นวลจันทร์','5','ดูแกลเลอรีแล้วประทับใจมาก จะมาจองในเร็วๆ นี้ค่ะ','กวิน','pending','2026-06-12','','FALSE',''],
];

// ─────────────────────────────────────────────────────────────
// 8. BOOKINGS — จากฟอร์มจองคิวบนเว็บ (เริ่มต้นว่าง)
// ─────────────────────────────────────────────────────────────
const BOOKINGS_HEADERS = [
  'id','name','phone','email','artist','style','placement',
  'size','budget','message','status','createdAt',
  'appointmentDate','appointmentTime','adminNotes','notified'
];

// ─────────────────────────────────────────────────────────────
// MAIN SETUP FUNCTION
// ─────────────────────────────────────────────────────────────
function setupAll() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  ss.rename('Phoogun Tattoo — Database');
  Logger.log('🚀 กำลังสร้างข้อมูลทั้งหมด...');

  createConfigSheet(ss);
  createHeroSlidesSheet(ss);
  createDataSheet(ss, 'categories', ['id','nameTh','nameEn','slug','sortOrder','active'], CATEGORIES_DATA, '#1a472a');
  createDataSheet(ss, 'albums',     ['id','name','descTh','descEn','promoted','cover','sortOrder','active','createdAt'], ALBUMS_DATA, '#1a2e4a');
  createDataSheet(ss, 'artists',    ['id','nameTh','nameEn','specialty','specialtyTh','experience','bio_th','bio_en','imageUrl','available','availableTh','instagram','sortOrder','active'], ARTISTS_DATA, '#2d1b4a');
  createDataSheet(ss, 'images',     ['id','albumId','categoryId','title','titleEn','artist','tags','imageUrl','featured','likes','sortOrder','active','createdAt','description','placement','placementEn','size','duration','price'], IMAGES_DATA, '#4a1a1a');
  createDataSheet(ss, 'reviews',    ['id','author','rating','message','artist','status','createdAt','adminReply','featured','ip'], REVIEWS_DATA, '#4a3d00');
  createBookingsSheet(ss);

  // ลบ Sheet1 เดิมที่ว่าง
  try {
    const defaultSheet = ss.getSheetByName('Sheet1');
    if (defaultSheet) ss.deleteSheet(defaultSheet);
  } catch(e) {}

  Logger.log('✅ เสร็จแล้ว! 8 Sheets พร้อมใช้งาน');

  SpreadsheetApp.getUi().alert(
    '✅ สร้างข้อมูลสำเร็จ!\n\n' +
    '📊 8 Sheets:\n' +
    '  1. config — การตั้งค่าทั้งหมด (48 รายการ)\n' +
    '  2. hero_slides — สไลด์ carousel (6 รายการ)\n' +
    '  3. categories — หมวดหมู่สัก (16 รายการ)\n' +
    '  4. albums — อัลบั้ม (5 รายการ)\n' +
    '  5. artists — ช่างสัก (4 รายการ)\n' +
    '  6. images — รูปผลงาน (11 รายการ)\n' +
    '  7. reviews — รีวิว (5 รายการ)\n' +
    '  8. bookings — การจองคิว (ว่าง รอรับข้อมูลจากเว็บ)\n\n' +
    '⚠️ อย่าลืมเปลี่ยน adminPasscode ใน Sheet config!\n\n' +
    '👉 ขั้นต่อไป:\n' +
    'Deploy → New deployment → Web app\n' +
    'Execute as: Me | Access: Anyone → Deploy\n' +
    'Copy URL ส่งให้ developer'
  );
}

// ─────────────────────────────────────────────────────────────
// Sheet Creators
// ─────────────────────────────────────────────────────────────
function createConfigSheet(ss) {
  let s = ss.getSheetByName('config');
  if (s) s.clear(); else s = ss.insertSheet('config', 0);

  const headers = ['group', 'key', 'value', 'description'];
  s.getRange(1,1,1,4).setValues([headers]).setFontWeight('bold')
    .setBackground('#0a0a0a').setFontColor('#e6192e');

  s.getRange(2,1,CONFIG_DATA.length,4).setValues(CONFIG_DATA);

  // สี group ต่างๆ
  const groupColors = {HERO:'#1a2030',ABOUT:'#1a2030',STATS:'#1a3020',STUDIO:'#2a1a30',MAP:'#1a2a20',SOCIAL:'#1a1a30',PIXEL:'#2a1a1a',ADMIN:'#3a0a0a',SEO:'#1a2a2a'};
  CONFIG_DATA.forEach((row, i) => {
    const color = groupColors[row[0]] || '#111';
    s.getRange(i+2, 1, 1, 4).setBackground(color).setFontColor('#cccccc');
  });
  s.getRange(2,3,CONFIG_DATA.length,1).setFontColor('#ffffff').setFontWeight('bold');

  s.setColumnWidth(1, 100);
  s.setColumnWidth(2, 180);
  s.setColumnWidth(3, 420);
  s.setColumnWidth(4, 350);
  s.setFrozenRows(1);
  Logger.log('✅ config (' + CONFIG_DATA.length + ' settings)');
}

function createHeroSlidesSheet(ss) {
  let s = ss.getSheetByName('hero_slides');
  if (s) s.clear(); else s = ss.insertSheet('hero_slides', 1);

  const headers = ['id','imageUrl','label','sortOrder','active'];
  s.getRange(1,1,1,5).setValues([headers]).setFontWeight('bold')
    .setBackground('#1a1500').setFontColor('#f5c518');

  s.getRange(2,1,HERO_SLIDES_DATA.length,5).setValues(HERO_SLIDES_DATA);
  s.setColumnWidth(2, 500);
  s.setFrozenRows(1);
  Logger.log('✅ hero_slides (' + HERO_SLIDES_DATA.length + ' slides)');
}

function createDataSheet(ss, name, headers, data, headerBg) {
  let s = ss.getSheetByName(name);
  if (s) s.clear(); else s = ss.insertSheet(name);

  s.getRange(1,1,1,headers.length).setValues([headers]).setFontWeight('bold')
    .setBackground(headerBg || '#0a0a0a').setFontColor('#ffffff');

  if (data.length > 0) {
    s.getRange(2,1,data.length,headers.length).setValues(data);
  }

  // Alternating row colors
  for (let i = 0; i < data.length; i++) {
    s.getRange(i+2, 1, 1, headers.length)
      .setBackground(i % 2 === 0 ? '#111111' : '#0d0d0d')
      .setFontColor('#cccccc');
  }

  headers.forEach((_, i) => s.autoResizeColumn(i+1));
  s.setFrozenRows(1);
  Logger.log('✅ ' + name + ' (' + data.length + ' rows)');
}

function createBookingsSheet(ss) {
  let s = ss.getSheetByName('bookings');
  if (s) s.clear(); else s = ss.insertSheet('bookings');

  s.getRange(1,1,1,BOOKINGS_HEADERS.length).setValues([BOOKINGS_HEADERS])
    .setFontWeight('bold').setBackground('#0a1a0a').setFontColor('#4ade80');

  s.setColumnWidths(1, BOOKINGS_HEADERS.length, 150);
  s.setColumnWidth(10, 300); // message
  s.setColumnWidth(15, 250); // adminNotes
  s.setFrozenRows(1);
  Logger.log('✅ bookings (ready for data)');
}

// ─────────────────────────────────────────────────────────────
// WEB APP API — GET / POST
// ─────────────────────────────────────────────────────────────
function doGet(e) {
  const sheet = (e.parameter.sheet || '').toLowerCase();
  const action = e.parameter.action || 'getAll';
  const id = e.parameter.id || '';

  if (!sheet) return jsonOut({ error: 'sheet parameter required' });

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const s = ss.getSheetByName(sheet);
  if (!s) return jsonOut({ error: 'Sheet not found: ' + sheet });

  // GET config → return as {key: value} object
  if (sheet === 'config') {
    const rows = s.getDataRange().getValues();
    const config = {};
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][1]) config[rows[i][1]] = rows[i][2];
    }
    return jsonOut({ ok: true, data: config });
  }

  // GET all rows → array of objects
  const rows = s.getDataRange().getValues();
  if (rows.length < 2) return jsonOut({ ok: true, data: [] });

  const headers = rows[0];
  let data = rows.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => { obj[h] = String(row[i] || ''); });
    return obj;
  });

  // Filter by id if provided
  if (id) {
    data = data.filter(r => r.id === id);
    return jsonOut({ ok: true, data: data[0] || null });
  }

  return jsonOut({ ok: true, data, count: data.length });
}

function doPost(e) {
  try {
    const body = JSON.parse(e.postData.contents);
    const { action, sheet: sheetName, row, id, key, value } = body;

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const s = ss.getSheetByName(sheetName);
    if (!s) return jsonOut({ error: 'Sheet not found: ' + sheetName });

    // UPDATE single config key
    if (action === 'setConfig') {
      const data = s.getDataRange().getValues();
      const updates = typeof key === 'object' ? key : { [key]: value };
      Object.entries(updates).forEach(([k, v]) => {
        for (let i = 1; i < data.length; i++) {
          if (data[i][1] === k) {
            s.getRange(i+1, 3).setValue(v);
            return;
          }
        }
      });
      return jsonOut({ ok: true, message: 'Config updated' });
    }

    const headers = s.getRange(1,1,1,s.getLastColumn()).getValues()[0];

    // ADD new row
    if (action === 'add') {
      const newRow = headers.map(h => row[h] !== undefined ? row[h] : '');
      s.appendRow(newRow);
      // Color new row
      const lastRow = s.getLastRow();
      s.getRange(lastRow, 1, 1, headers.length)
        .setBackground(lastRow % 2 === 0 ? '#111111' : '#0d0d0d')
        .setFontColor('#cccccc');
      return jsonOut({ ok: true, message: 'Added', id: row.id });
    }

    // UPDATE existing row by id
    if (action === 'update') {
      const data = s.getDataRange().getValues();
      const idIdx = headers.indexOf('id');
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][idIdx]) === String(id)) {
          const updated = headers.map((h, j) => row[h] !== undefined ? row[h] : data[i][j]);
          s.getRange(i+1, 1, 1, headers.length).setValues([updated]);
          return jsonOut({ ok: true, message: 'Updated', id });
        }
      }
      return jsonOut({ error: 'Row not found: ' + id });
    }

    // DELETE row by id
    if (action === 'delete') {
      const data = s.getDataRange().getValues();
      const idIdx = headers.indexOf('id');
      for (let i = 1; i < data.length; i++) {
        if (String(data[i][idIdx]) === String(id)) {
          s.deleteRow(i+1);
          return jsonOut({ ok: true, message: 'Deleted', id });
        }
      }
      return jsonOut({ error: 'Row not found: ' + id });
    }

    return jsonOut({ error: 'Unknown action: ' + action });

  } catch(err) {
    return jsonOut({ error: err.message });
  }
}

// ─────────────────────────────────────────────────────────────
// Helper
// ─────────────────────────────────────────────────────────────
function jsonOut(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}

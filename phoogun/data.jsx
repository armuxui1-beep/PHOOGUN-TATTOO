// ============================================================
// PHOOGUN TATTOO — Data Layer
// ============================================================

const LOCAL = {
  dragon: 'ink-passport/images/cyber-dragon.png',
  rose: 'ink-passport/images/obsidian-rose.png',
  geo: 'ink-passport/images/geometric-biomech.png',
  studio: 'ink-passport/images/studio-workspace.png',
};

const REMOTE = {
  tiger: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDgiXQmSzMHmSfD27q--n-wm5VLZU3qx_V6SIe3vY_WUkPh0cGeFJX7Kge41DWxdICukv3B568whg4WinNalEIkod1d3UaG7nlIjKO3Jhx4JASOefyuHpswIoR5xJwcv7QfXgEa2LUzBnQo_BnNtFE2bemaYRHLtnlkal-upg2ve0E-g09aTiDNfDnQfsi6d6YpDV2XVuZjLwf4XgT7hqAO1iIogYX072i2qF2AIbk90_2pLkkteaq9JkIHEPWYv_5f6KcakBC8svI',
  skull: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmVvp5a-O6o8eagOrQDzNhvQSJVYymrO2cBsoAGgGrxJhxq85_UdK6eOBFu-hQ8Ynw68tH0_paYXY1Vw0nomKlJFtcVxxNQQ8gbTPdggf23_GUpP_dYj2YpU2dLp3W77PEWFYn2LZsQTE6ZsQ1t3wgWKGPZGPbN9_TXFA6ebhw61i5-r3B2bVFJ5bhy8pYaCnpVlNBV-FA2MaykDVPotfRGNYS1eBfO9PqSXQ7ytr_o6hPvoBekOLYOtYeDbXNABEiIlYXutNXHFA',
  knuckles: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnRxnajIfCa_AovEvC6m8MAqd8seDcPTRty7tWO2nlYBxfzFBHGVYg1l403CUISfp9g6HemAFaVJOeMs0S8_y4LZKVoKSX3HVkGIUg0pvoa96FtFwI0i5O7TXo4JSJK__F4FolpeX6dWaQNcQIXbgTHNrDgg7mtvaelLavUZC8adMpCFwV9Bro65SzccDQbeZzEGzLEeiYI-vwe6w7_-bTBChRuo1TNz2kmoD86vPELIsfunGUBpuZBc93HfwfR2SauG7gJfTENDM',
  wings: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAObOILhCxXIsTdQvYLmmUFU0pXwAWbpbmz57p94D-GIPiOja7R2mRZyL54INKOgjn9I5IJU9f3STn_zVh5n9GyOSlvUY6EhPDBRtUhKYZnNdq4omTX0_kBs58iIqjoDVY7fRBdbQcEmwn3HAzzEa5GQIkzFUL5Ccze4cjMH0QBIG6CNmE9Ax42casv2aT4K6Ipzb1t5JRJtv2JiUmZ_v7FeVoUXCjqy-gATSVGJJ98JQ4baesxguFZCV5bTY67ijYHN9AM6r6hjqI',
  back: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBa02lFMChvOI6gTbMjtosvVFh3oF_mIyC9e3ElkozEnNkMyT00GxFHRmusrtU8XtrEaf7K8kvQRoQHkFTkr8Xt3lWch3hu-SoWQNciuYyN0MVGPKxu6WXzlIYkpxzfaeucEzfJlEvOfUF6Jt4pW6lT2oRcyCHE8MIxZKz7klsJ152S4XlHbM7x8EfrKW4_Hd1mTLfDzHYrI89nCRoDTzX8Wz_R23R34XpnNPzMc_xbyYAI9fKug2AwkbKBV7_o2P7IaU7sBBr9Scw',
  chest: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBveLvY8WUdwu5KE677bxyMv4-xTO35bJFYmamqkomB9KgJRouEndeaYrfSL7Mb9WzuG2_piT5SDcLz7mxIrcFEf9yTRQXiz-RkkQKETl7Se16c7_Nc5gxEbdVugcPCL5CE_yetxHFZ8IUAO-oBCf8fZrUHME6q30Mo0cri8S-TmOo-d-yTs-o7pXdhiumrlpnnrb0v0gBN0f_Q2gbnPEIdW6kSOmw5gf9vPjaQwdh1_R_3J7PWWFABF8fe2uP_36awPmtqzXGJQqo',
  geo2: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDlxFPGLwnO9FSns5hFtIgbS-QBbkTdyIg57JiB48y-HkZgS_Cq0xeMglSA65l2hW84IE01rTV129znVTEUBAhwsdrlYSum0CI0FWcdcjZYnMBuR-wMJh7v-Z3xFFIULb15om3kuxlDSa-dN7fTGuS0bdg6_O9SAahGYUmM5judb6ty4AhP9nHvyW9D7kOI4OPR2MGVfUaZcDtk75DLApJLG1RDc6kKlKqXFehavEJjXdmGCn3nmAmDulOjv_bHpwaJHORC9VGVXxk',
};

const DEFAULT_CATEGORIES = [
  { id: 'c01', nameTh: 'ไซเบอร์-แบล็คเวิร์ค', nameEn: 'Cyber-Blackwork', slug: 'cyber-blackwork' },
  { id: 'c02', nameTh: 'นีโอ-อิเรซูมิ', nameEn: 'Neo-Irezumi', slug: 'neo-irezumi' },
  { id: 'c03', nameTh: 'จีโอเมตริก', nameEn: 'Geometric', slug: 'geometric' },
  { id: 'c04', nameTh: 'ไฟน์ไลน์', nameEn: 'Fine Line', slug: 'fine-line' },
  { id: 'c05', nameTh: 'โอเรียนทัล', nameEn: 'Oriental', slug: 'oriental' },
  { id: 'c06', nameTh: 'ดาร์ก มินิมอล', nameEn: 'Dark Minimal', slug: 'dark-minimal' },
  { id: 'c07', nameTh: 'อักขระ & สคริปต์', nameEn: 'Script & Lettering', slug: 'script' },
  { id: 'c08', nameTh: 'วอเตอร์คัลเลอร์', nameEn: 'Watercolor', slug: 'watercolor' },
  { id: 'c09', nameTh: 'ดอทเวิร์ค', nameEn: 'Dotwork', slug: 'dotwork' },
  { id: 'c10', nameTh: 'ไบโอเมคานิคัล', nameEn: 'Biomechanical', slug: 'biomechanical' },
  { id: 'c11', nameTh: 'แทรชโพลก้า', nameEn: 'Trash Polka', slug: 'trash-polka' },
  { id: 'c12', nameTh: 'ทราดิชันนัล', nameEn: 'Traditional', slug: 'traditional' },
  { id: 'c13', nameTh: 'รีอลลิสม์', nameEn: 'Realism', slug: 'realism' },
  { id: 'c14', nameTh: 'ไทยสักยันต์', nameEn: 'Sacred Yantra', slug: 'yantra' },
  { id: 'c15', nameTh: 'พอร์เทรต', nameEn: 'Portrait', slug: 'portrait' },
  { id: 'c16', nameTh: 'แอนิเมะ & ป็อปอาร์ต', nameEn: 'Anime & Pop Art', slug: 'anime' },
];

const DEFAULT_ALBUMS = [
  { id: 'a01', name: 'Signature Blackwork', descTh: 'ผลงาน Blackwork ที่เป็นเอกลักษณ์ของสตูดิโอ', promoted: true, cover: LOCAL.dragon },
  { id: 'a02', name: 'Oriental Masters', descTh: 'ลายโอเรียนทัลและนีโออิเรซูมิระดับมาสเตอร์', promoted: true, cover: REMOTE.tiger },
  { id: 'a03', name: 'Dark & Minimal', descTh: 'ลายสักดาร์กมินิมอลและไฟน์ไลน์', promoted: false, cover: LOCAL.rose },
  { id: 'a04', name: 'Geometric & Cyber', descTh: 'ลายจีโอเมตริกและไซเบอร์', promoted: false, cover: LOCAL.geo },
  { id: 'a05', name: 'Studio Showcase', descTh: 'ผลงานเด่นประจำสตูดิโอ', promoted: false, cover: LOCAL.studio },
];

const DEFAULT_ARTISTS = [
  { id: 'art01', nameTh: 'กิม', nameEn: 'Kimm', specialty: 'Cyber-Blackwork / Geometric', experience: '8 ปี', bio_th: 'ผู้เชี่ยวชาญลาย Cyber-Blackwork และ Geometric ที่ผสมผสานเทคโนโลยีกับศิลปะ', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAygxjP4n5S3j3K8wCXwKgQ1Wqx5Oeoly0u9_-37018ci3SzUZeGbZZNsZwK0XXxTshgTGvOVPvnFDevirOKu87RcfYgzkN9rgZaqyehiHonC5f3-1eTiANKF5WFl1Qi_g9AI9mDzIMrHqM_XQSUCY5GJ8mQbc3HJOF2IHNQcZqdackfMrKEvXUp4HORZ52EAQb1V4Wd2nlw-j7B_r_ukuJfx_nwpmfeORip0zEfaGwWQrz0zTxTLvh-GZB_jPusQIIZiqfrIzOs78', available: 'จ-ศ' },
  { id: 'art02', nameTh: 'พิมพ์ดาว', nameEn: 'Pimdao', specialty: 'Neo-Irezumi & Red Ink', experience: '6 ปี', bio_th: 'ช่างสักเชี่ยวชาญลายมังกรและ Neo-Irezumi ผสมหมึกแดงพิเศษ', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCIU2q6Q7_OPUqH_Ncw0cJc8jRD9DS7etsxWjTbZJBMs2UQSms4FMQQVfgnI9lH8QjK-scwofSxgJunM4REa0tfOKziCDWWhAvQiKJpN-nVFVK7o2D_4uzPTbgtvLs2NLUN1BBZsABXsTlHikiq6ylF5CxWsjiKWlQ1QX-7R-zfd8Z7gZsRz1V4wUfF7EV049PbEt_GvA5soKv6pF-OV2ikmTf_syyhXmk_2x5FS9EbQePbte9gxvwzPrsMKJ6y3We4oG3z7z03Zqw', available: 'ทุกวัน' },
  { id: 'art03', nameTh: 'กวิน', nameEn: 'Kawin', specialty: 'Dark Minimal & Script', experience: '5 ปี', bio_th: 'ศิลปินด้าน Fine Line และ Script Lettering ความแม่นยำระดับไมครอน', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBF8MnRnyPu8OkIjlQ3fwbvqs6Wx0sy7p4xVLwIm8IO3lQYsdLEqVcTX1FmrN_taDXpikld8kGyQ22ojLDp-S8Gh2hMcIKSGA_t89RzwIEJ0lbrgbyKwvIn50g_zxhV6WeUutWEHooe27RTCi2Q_HvFG19B8osIi-knKJ6yyCEUs_HjeSimb6v4jWOlS6acMI6sifYr1GC_tIdcRHHU2wMLfRtdzEagdXaY1YDQxECo2VeY4kfQUunFp2rua6FWrdOzldoCpEK0J8A', available: 'พ-อา' },
  { id: 'art04', nameTh: 'เจตน์', nameEn: 'Jay', specialty: 'Oriental & Fine Line', experience: '7 ปี', bio_th: 'ผู้เชี่ยวชาญลาย Oriental Traditional และ Fine Line ที่มีชื่อเสียงระดับนานาชาติ', imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkfqYqHFleT42qaAdx_Gp2BLkpOiNGu49Wzzxpwp3_VU_G-3zeB2ipVe0dDkxDxkh1801TXCtQgOxxj708I-Sldw-K3IEclMaxYzZZn3JztAZuX2cAmFgFFX9VC-Ie2UygDv5zIaWxvFszdmxDRsuTiXBh1ehA1SDMETyrjLYm4ln8sTDZyeWXAzxYVaZKxOhvkoRoqhYjiM9tSYJdbLZPUXidH7jbtmbKSljkukWkK5LFBbuTt9F9pdV6mycygUPzogfB_OUIiRk', available: 'ศ-อ' },
];

const DEFAULT_IMAGES = [
  { id: 'img01', albumId: 'a01', categoryId: 'c01', title: 'Neo Cyber Dragon Backpiece', artist: 'พิมพ์ดาว', tags: ['dragon','backpiece','cyber'], imageUrl: LOCAL.dragon, featured: true, likes: 184 },
  { id: 'img02', albumId: 'a04', categoryId: 'c03', title: 'Circuit Geometrics Sleeve', artist: 'กิม', tags: ['sleeve','circuit','geo'], imageUrl: LOCAL.geo, featured: true, likes: 156 },
  { id: 'img03', albumId: 'a03', categoryId: 'c06', title: 'Obsidian Rose Fine Line', artist: 'กวิน', tags: ['rose','fineline','wrist'], imageUrl: LOCAL.rose, featured: false, likes: 142 },
  { id: 'img04', albumId: 'a05', categoryId: 'c05', title: 'Studio Workspace', artist: 'กิม', tags: ['studio','workspace'], imageUrl: LOCAL.studio, featured: false, likes: 98 },
  { id: 'img05', albumId: 'a02', categoryId: 'c05', title: 'Crimson Forest Tiger', artist: 'เจตน์', tags: ['tiger','oriental','red'], imageUrl: REMOTE.tiger, featured: true, likes: 217 },
  { id: 'img06', albumId: 'a01', categoryId: 'c10', title: 'Biomechanical Skull Sleeve', artist: 'กิม', tags: ['skull','biomech','sleeve'], imageUrl: REMOTE.skull, featured: true, likes: 198 },
  { id: 'img07', albumId: 'a04', categoryId: 'c03', title: 'Linear Flow Geometry', artist: 'กิม', tags: ['geometric','linear','calf'], imageUrl: REMOTE.geo2, featured: false, likes: 113 },
  { id: 'img08', albumId: 'a01', categoryId: 'c11', title: 'Crimson Chest Chaos', artist: 'เจตน์', tags: ['chest','red','polka'], imageUrl: REMOTE.chest, featured: false, likes: 175 },
  { id: 'img09', albumId: 'a02', categoryId: 'c09', title: 'Sacred Back Dotwork', artist: 'พิมพ์ดาว', tags: ['dotwork','back','sacred'], imageUrl: REMOTE.back, featured: false, likes: 132 },
  { id: 'img10', albumId: 'a01', categoryId: 'c01', title: 'Obsidian Wings Portrait', artist: 'กิม', tags: ['wings','portrait','raven'], imageUrl: REMOTE.wings, featured: true, likes: 167 },
  { id: 'img11', albumId: 'a03', categoryId: 'c07', title: 'Gothic Knuckles Script', artist: 'กวิน', tags: ['script','knuckles','gothic'], imageUrl: REMOTE.knuckles, featured: false, likes: 144 },
];

const DEFAULT_REVIEWS = [
  { id: 'r01', author: 'อนันดา สิริโชติ', rating: 5, message: 'งานสักดาร์กมินิมอลกับช่างกวินสวยมาก บรรยากาศดีมากครับ', artist: 'กวิน', status: 'approved', createdAt: '2026-06-07' },
  { id: 'r02', author: 'มุกรินทร์ แก้วมณี', rating: 5, message: 'ช่างพิมพ์ดาวสักมังกรได้อลังการมาก คุ้มค่ามากๆ ค่ะ', artist: 'พิมพ์ดาว', status: 'approved', createdAt: '2026-06-08' },
  { id: 'r03', author: 'ธนพัทธ์ เดชะ', rating: 4, message: 'งานแขนไซเบอร์กับช่างกิมเท่สุด รายละเอียดเยอะมากครับ', artist: 'กิม', status: 'approved', createdAt: '2026-06-09' },
  { id: 'r04', author: 'สมหญิง แสงทอง', rating: 5, message: 'มาสักครั้งแรก ประทับใจมาก สะอาด ปลอดภัย ช่างพูดคุยดี', artist: 'เจตน์', status: 'approved', createdAt: '2026-06-10' },
  { id: 'r05', author: 'แพรวพรรณ นวลจันทร์', rating: 5, message: 'ดูแกลเลอรีแล้วประทับใจมาก จะมาจองในเร็วๆ นี้ค่ะ', artist: 'กวิน', status: 'pending', createdAt: '2026-06-12' },
];

const DEFAULT_CONFIG = {
  heroTitle: 'มิติศิลปะบนเรือนร่าง',
  heroTitleEn: 'Body Art Dimension',
  heroSub: 'สู่อนาคตที่หรูหราดุดัน',
  heroSubEn: 'A Cyberpunk Gothic Saga',
  heroDesc: 'PHOOGUN TATTOO ผสานลายสักแบบไซเบอร์แบล็คเวิร์ค ฟอนต์อักขระกอธิค และนีโออิเรซูมิ สู่ผลงานระดับพรีเมียมด้วยเครื่องมือมาตรฐานโรงพยาบาล',
  heroDescEn: 'PHOOGUN TATTOO blends cyber-blackwork, gothic typography, and Neo-Irezumi into timeless relics crafted with medical-grade precision.',
  aboutTitle: 'เกี่ยวกับ Phoogun Tattoo',
  aboutTitleEn: 'About Phoogun Tattoo',
  aboutText: 'สตูดิโอสักระดับพรีเมียมในกรุงเทพฯ ที่ผสานศิลปะดาร์กสไตล์กับเทคนิคระดับสูง ใช้อุปกรณ์สะอาดปลอดเชื้อมาตรฐานการแพทย์ทุกครั้ง',
  aboutTextEn: 'Premium Bangkok tattoo studio blending dark art with master technique, using hospital-grade sterile equipment on every client.',
  aboutImage: '',
  stats: [
    { val: '500+', th: 'ผลงานสักสำเร็จ', en: 'Tattoos Completed' },
    { val: '8+', th: 'ปีประสบการณ์', en: 'Years Experience' },
    { val: '4', th: 'ช่างสักมืออาชีพ', en: 'Master Artists' },
    { val: '100%', th: 'มาตรฐานโรงพยาบาล', en: 'Hospital Grade' },
  ],
  mapUrl: '',
  fbPixel: '',
  ttPixel: '',
  social: { facebook: '', instagram: '', tiktok: '', lineoa: '', twitter: '', phone: '' },
};

// Hero carousel slides
const HERO_SLIDES = [
  { image: LOCAL.dragon, label: 'Neo Cyber Dragon' },
  { image: REMOTE.tiger, label: 'Crimson Forest Tiger' },
  { image: LOCAL.rose, label: 'Obsidian Rose' },
  { image: REMOTE.skull, label: 'Biomechanical Skull' },
  { image: LOCAL.geo, label: 'Circuit Geometrics' },
  { image: REMOTE.back, label: 'Sacred Dotwork' },
];

window.PHG_DATA = {
  DEFAULT_CATEGORIES, DEFAULT_ALBUMS, DEFAULT_ARTISTS,
  DEFAULT_IMAGES, DEFAULT_REVIEWS, DEFAULT_CONFIG, HERO_SLIDES,
};

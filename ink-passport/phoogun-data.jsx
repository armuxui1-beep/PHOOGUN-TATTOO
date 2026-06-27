// ============================================================
// PHOOGUN TATTOO — INK PASSPORT  ·  Data layer
// Bilingual TH/EN. Ties into the existing Kage/Phoogun mock data.
// ============================================================

const IMG = {
  cyberDragon: 'ink-passport/images/cyber-dragon.png',
  obsidianRose: 'ink-passport/images/obsidian-rose.png',
  geometric: 'ink-passport/images/geometric-biomech.png',
  studio: 'ink-passport/images/studio-workspace.png',
};

// The signed-in member persona (carried over from the studio's appointment book)
const MEMBER = {
  id: 'PHG-0291',
  nameTh: 'ณัฐพงษ์ พรทวี',
  nameEn: 'Nattapong Porntawee',
  handle: 'RAVEN',
  since: '2024',
  avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBGeDB4-pLVKo0LpLj2Ufb-P_RvDn_waHuaiI5_cp0Z0_mHbSYwLQ8pi4fnSqQFKx6TXfgyWJFahhXzoSreV13aDBcdHWiXG_wDvky1X6JX8uL5ZE4D1sXeuQkeSM2cizyX6qdvQTagxhipexaVbmBey-Zhablprfaf8tUJc12YrkEikVsYlzBx1tm1aQoNtQj5fdbHjhJg2lDZEsmM_YRc7O5aaESWawMK0COmPhLS8_yuRpf5Ag7wOcVSyiJvGLL1Weki-rpnVjI',
  points: 3480,
  visits: 7,
};

// Loyalty tiers — "Ink Pass" ladder
const TIERS = [
  { key: 'initiate', th: 'ผู้เริ่มต้น',  en: 'Initiate', min: 0,    perk_th: 'สะสมแต้ม 1x', perk_en: '1x points' },
  { key: 'disciple', th: 'ศิษย์',        en: 'Disciple', min: 1000, perk_th: 'ส่วนลดวันเกิด',  perk_en: 'Birthday credit' },
  { key: 'sage',     th: 'จอมขมังเวทย์',  en: 'Sage',     min: 3000, perk_th: 'จองคิวก่อนใคร', perk_en: 'Priority booking' },
  { key: 'obsidian', th: 'ออบซิเดียน',    en: 'Obsidian', min: 6000, perk_th: 'ทัชอัพฟรีตลอดชีพ', perk_en: 'Free touch-ups' },
];

// Healing journey for the member's most recent piece
const HEALING = {
  pieceTh: 'นีโอ ไซเบอร์ ดราก้อน — ฟูลแบ็ค',
  pieceEn: 'Neo Cyber Dragon — Backpiece',
  image: IMG.cyberDragon,
  artistTh: 'พิมพ์ดาว',
  artistEn: 'Pimdao',
  placement_th: 'กลางหลัง',
  placement_en: 'Center back',
  inkedOn: '2026-06-09',
  dayOf: 6,
  totalDays: 30,
  stages: [
    {
      key: 's1', range: 'D1–3', dayFrom: 1, dayTo: 3,
      th: 'แผลสด', en: 'Fresh Wound',
      desc_th: 'ผิวบวมแดงและมีน้ำเหลืองซึม เป็นเรื่องปกติ',
      desc_en: 'Swelling, redness and weeping is normal.',
      dos: [
        { th: 'ล้างเบาๆ วันละ 2–3 ครั้งด้วยสบู่อ่อน', en: 'Wash gently 2–3x/day with mild soap' },
        { th: 'ซับให้แห้งด้วยกระดาษสะอาด', en: 'Pat dry with clean paper towel' },
        { th: 'ทาขี้ผึ้งบางๆ', en: 'Apply a thin layer of balm' },
      ],
      donts: [
        { th: 'ห้ามแกะหรือเกาผิวหนัง', en: 'No picking or scratching' },
        { th: 'ห้ามแช่น้ำหรือว่ายน้ำ', en: 'No soaking or swimming' },
      ],
    },
    {
      key: 's2', range: 'D4–14', dayFrom: 4, dayTo: 14,
      th: 'ลอกและคัน', en: 'Peeling & Itch',
      desc_th: 'ผิวเริ่มลอกเป็นขุยและคัน อย่าแกะเด็ดขาด',
      desc_en: 'Flaking and itching begins — never pick at it.',
      dos: [
        { th: 'ทาโลชั่นบางๆ เมื่อรู้สึกแห้ง', en: 'Light moisturizer when dry' },
        { th: 'สวมเสื้อผ้าหลวมสบาย', en: 'Wear loose clothing' },
        { th: 'ดื่มน้ำให้เพียงพอ', en: 'Stay hydrated' },
      ],
      donts: [
        { th: 'ห้ามโดนแดดจัด', en: 'Avoid direct sun' },
        { th: 'ห้ามออกกำลังหนักจนเหงื่อท่วม', en: 'No heavy, sweaty workouts' },
        { th: 'ห้ามเกาเวลาคัน', en: "Don't scratch the itch" },
      ],
    },
    {
      key: 's3', range: 'D15–30', dayFrom: 15, dayTo: 30,
      th: 'ฟื้นตัวและสีนิ่ง', en: 'Settling',
      desc_th: 'สีเริ่มนิ่งและผิวด้านนอกหายดี',
      desc_en: 'Color settles as the outer skin finishes healing.',
      dos: [
        { th: 'บำรุงผิวต่อเนื่อง', en: 'Keep moisturizing' },
        { th: 'ทากันแดด SPF50 ทุกครั้งที่ออกแดด', en: 'SPF50 whenever in the sun' },
      ],
      donts: [
        { th: 'หลีกเลี่ยงการขัดผิวบริเวณรอยสัก', en: 'No exfoliating the tattoo' },
      ],
    },
  ],
  // today's care checklist
  todayTasks: [
    { id: 't1', th: 'ล้างรอยสักตอนเช้า', en: 'Morning wash', done: true },
    { id: 't2', th: 'ทาโลชั่นบำรุง', en: 'Apply moisturizer', done: true },
    { id: 't3', th: 'ไม่เกา ไม่แกะ', en: 'No scratching', done: true },
    { id: 't4', th: 'สวมเสื้อผ้าหลวม', en: 'Loose clothing', done: false },
    { id: 't5', th: 'ล้างรอยสักตอนเย็น', en: 'Evening wash', done: false },
  ],
  // photo log — past days filled, today open for upload
  log: [
    { day: 1, th: 'วันแรก', en: 'Day 1', img: IMG.cyberDragon, filled: true },
    { day: 3, th: 'วันที่ 3', en: 'Day 3', img: IMG.geometric, filled: true },
    { day: 6, th: 'วันนี้', en: 'Today', img: null, filled: false },
  ],
};

// Bookings — upcoming + history (drawn from studio appointment styles)
const BOOKINGS = {
  upcoming: [
    {
      id: 'APT-9341', dateTh: '28 มิ.ย. 2026', dateEn: 'Jun 28, 2026', time: '14:00',
      artistTh: 'พิมพ์ดาว', artistEn: 'Pimdao',
      styleTh: 'นีโอ-อิเรซูมิ', styleEn: 'Neo-Irezumi',
      sessionTh: 'เซสชัน 2 / 3 — ลงสีมังกร', sessionEn: 'Session 2 of 3 — dragon color',
      status: 'Confirmed', image: IMG.cyberDragon,
    },
    {
      id: 'APT-9388', dateTh: '15 ก.ค. 2026', dateEn: 'Jul 15, 2026', time: '16:30',
      artistTh: 'กวิน', artistEn: 'Kawin',
      styleTh: 'ดาร์ก มินิมอล', styleEn: 'Dark Minimal',
      sessionTh: 'ปรึกษาแบบ — ตัวอักษรข้อมือ', sessionEn: 'Design consult — wrist script',
      status: 'Pending', image: IMG.obsidianRose,
    },
  ],
  history: [
    {
      id: 'APT-9283', dateTh: '9 มิ.ย. 2026', dateEn: 'Jun 9, 2026',
      artistTh: 'พิมพ์ดาว', artistEn: 'Pimdao',
      styleTh: 'นีโอ-อิเรซูมิ', styleEn: 'Neo-Irezumi',
      sessionTh: 'เซสชัน 1 — วางลายดราก้อน', sessionEn: 'Session 1 — dragon linework',
      points: 1500, image: IMG.cyberDragon,
    },
    {
      id: 'APT-8911', dateTh: '2 มี.ค. 2026', dateEn: 'Mar 2, 2026',
      artistTh: 'กิม', artistEn: 'Kimm',
      styleTh: 'ไซเบอร์-แบล็คเวิร์ค', styleEn: 'Cyber-Blackwork',
      sessionTh: 'แขนครึ่งท่อน — ลายวงจร', sessionEn: 'Half-sleeve — circuitry',
      points: 1200, image: IMG.geometric,
    },
    {
      id: 'APT-8420', dateTh: '18 พ.ย. 2025', dateEn: 'Nov 18, 2025',
      artistTh: 'กวิน', artistEn: 'Kawin',
      styleTh: 'ดาร์ก มินิมอล', styleEn: 'Dark Minimal',
      sessionTh: 'กุหลาบออบซิเดียนที่ข้อมือ', sessionEn: 'Obsidian rose, wrist',
      points: 780, image: IMG.obsidianRose,
    },
  ],
};

// Ink Pass rewards catalogue
const REWARDS = [
  { id: 'r1', th: 'เครดิตหมึก ฿500', en: '฿500 ink credit', cost: 800, image: IMG.studio },
  { id: 'r2', th: 'เซสชันทัชอัพฟรี', en: 'Free touch-up session', cost: 1200, image: IMG.obsidianRose },
  { id: 'r3', th: 'สิทธิ์จองคิวก่อนใคร', en: 'Priority booking pass', cost: 600, image: IMG.geometric },
  { id: 'r4', th: 'แฟลชดีไซน์พิเศษ', en: 'Exclusive flash design', cost: 2000, image: IMG.cyberDragon },
  { id: 'r5', th: 'ชุดดูแลรอยสัก', en: 'Aftercare care-kit', cost: 400, image: IMG.studio },
];

// Points ledger
const POINTS_LEDGER = [
  { th: 'เซสชัน 1 — นีโอดราก้อน', en: 'Session 1 — Neo Dragon', date: '2026-06-09', delta: 1500 },
  { th: 'รีวิว 5 ดาว', en: '5-star review bonus', date: '2026-06-10', delta: 120 },
  { th: 'แลก — ชุดดูแลรอยสัก', en: 'Redeemed — care kit', date: '2026-05-20', delta: -400 },
  { th: 'แขนครึ่งท่อน ไซเบอร์', en: 'Cyber half-sleeve', date: '2026-03-02', delta: 1200 },
  { th: 'แนะนำเพื่อน', en: 'Referral bonus', date: '2026-02-14', delta: 300 },
];

window.PHG = { IMG, MEMBER, TIERS, HEALING, BOOKINGS, REWARDS, POINTS_LEDGER };

import { GalleryItem, Appointment, InventoryItem, FinancialTransaction, SystemTicket, Artist, ClientReview } from '../types';

import tattooStudioWorkspace from '../assets/images/tattoo_studio_workspace_1780996150510.png';
import cyberDragonTattooSketch from '../assets/images/cyber_dragon_tattoo_sketch_1780996167439.png';
import obsidianRoseTattooSketch from '../assets/images/obsidian_rose_tattoo_sketch_1780996183760.png';
import geometricBiomechanicalSketch from '../assets/images/geometric_biomechanical_sketch_1780996200778.png';

export const ARTISTS: Artist[] = [
  {
    id: 'art-001',
    nameTh: 'กิม',
    nameEn: 'Kimm',
    specialty: 'Cyber-Blackwork / Geometric',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAygxjP4n5S3j3K8wCXwKgQ1Wqx5Oeoly0u9_-37018ci3SzUZeGbZZNsZwK0XXxTshgTGvOVPvnFDevirOKu87RcfYgzkN9rgZaqyehiHonC5f3-1eTiANKF5WFl1Qi_g9AI9mDzIMrHqM_XQSUCY5GJ8mQbc3HJOF2IHNQcZqdackfMrKEvXUp4HORZ52EAQb1V4Wd2nlw-j7B_r_ukuJfx_nwpmfeORip0zEfaGwWQrz0zTxTLvh-GZB_jPusQIIZiqfrIzOs78',
    experience: '8 Years',
    availability: 'Mon - Fri'
  },
  {
    id: 'art-002',
    nameTh: 'พิมพ์ดาว',
    nameEn: 'Pimdao',
    specialty: 'Neo-Irezumi & Custom Red Ink',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCIU2q6Q7_OPUqH_Ncw0cJc8jRD9DS7etsxWjTbZJBMs2UQSms4FMQQVfgnI9lH8QjK-scwofSxgJunM4REa0tfOKziCDWWhAvQiKJpN-nVFVK7o2D_4uzPTbgtvLs2NLUN1BBZsABXsTlHikiq6ylF5CxWsjiKWlQ1QX-7R-zfd8Z7gZsRz1V4wUfF7EV049PbEt_GvA5soKv6pF-OV2ikmTf_syyhXmk_2x5FS9EbQePbte9gxvwzPrsMKJ6y3We4oG3z7z03Zqw',
    experience: '6 Years',
    availability: 'Daily'
  },
  {
    id: 'art-003',
    nameTh: 'กวิน',
    nameEn: 'Kawin',
    specialty: 'Dark Minimal & Script Lettering',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBF8MnRnyPu8OkIjlQ3fwbvqs6Wx0sy7p4xVLwIm8IO3lQYsdLEqVcTX1FmrN_taDXpikld8kGyQ22ojLDp-S8Gh2hMcIKSGA_t89RzwIEJ0lbrgbyKwvIn50g_zxhV6WeUutWEHooe27RTCi2Q_HvFG19B8osIi-knKJ6yyCEUs_HjeSimb6v4jWOlS6acMI6sifYr1GC_tIdcRHHU2wMLfRtdzEagdXaY1YDQxECo2VeY4kfQUunFp2rua6FWrdOzldoCpEK0J8A',
    experience: '5 Years',
    availability: 'Wed - Sun'
  },
  {
    id: 'art-004',
    nameTh: 'เจตน์',
    nameEn: 'Jay',
    specialty: 'Oriental Traditional & Fine Line',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBkfqYqHFleT42qaAdx_Gp2BLkpOiNGu49Wzzxpwp3_VU_G-3zeB2ipVe0dDkxDxkh1801TXCtQgOxxj708I-Sldw-K3IEclMaxYzZZn3JztAZuX2cAmFgFFX9VC-Ie2UygDv5zIaWxvFszdmxDRsuTiXBh1ehA1SDMETyrjLYm4ln8sTDZyeWXAzxYVaZKxOhvkoRoqhYjiM9tSYJdbLZPUXidH7jbtmbKSljkukWkK5LFBbuTt9F9pdV6mycygUPzogfB_OUIiRk',
    experience: '7 Years',
    availability: 'Fri - Tue'
  }
];

export const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'gal-001',
    category: 'นีโอ-อิเรซูมิ',
    name: 'Neo Cyber Dragon backpiece',
    artist: 'พิมพ์ดาว',
    imageUrl: cyberDragonTattooSketch,
    description: 'Traditional Japanese dragon infused with future biomechanical details'
  },
  {
    id: 'gal-002',
    category: 'ไซเบอร์-แบล็คเวิร์ค',
    name: 'Circuit Geometrics sleeve',
    artist: 'กิม',
    imageUrl: geometricBiomechanicalSketch,
    description: 'Striking forearm patterns and circuit-inspired lines with dark shades'
  },
  {
    id: 'gal-003',
    category: 'ดาร์ก มินิมอล',
    name: 'Delicate Obsidian Rose',
    artist: 'กวิน',
    imageUrl: obsidianRoseTattooSketch,
    description: 'Delicate fine line rose drawn on wrist with high contrast details'
  },
  {
    id: 'gal-004',
    category: 'โอเรียนทัล',
    name: 'Crimson Forest Tiger',
    artist: 'เจตน์',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDgiXQmSzMHmSfD27q--n-wm5VLZU3qx_V6SIe3vY_WUkPh0cGeFJX7Kge41DWxdICukv3B568whg4WinNalEIkod1d3UaG7nlIjKO3Jhx4JASOefyuHpswIoR5xJwcv7QfXgEa2LUzBnQo_BnNtFE2bemaYRHLtnlkal-upg2ve0E-g09aTiDNfDnQfsi6d6YpDV2XVuZjLwf4XgT7hqAO1iIogYX072i2qF2AIbk90_2pLkkteaq9JkIHEPWYv_5f6KcakBC8svI',
    description: 'Stark oriental tiger with blood red paint splatter elements'
  },
  {
    id: 'gal-005',
    category: 'อักขระและฟอนต์',
    name: 'Gothic Knuckles Typo',
    artist: 'กวิน',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCnRxnajIfCa_AovEvC6m8MAqd8seDcPTRty7tWO2nlYBxfzFBHGVYg1l403CUISfp9g6HemAFaVJOeMs0S8_y4LZKVoKSX3HVkGIUg0pvoa96FtFwI0i5O7TXo4JSJK__F4FolpeX6dWaQNcQIXbgTHNrDgg7mtvaelLavUZC8adMpCFwV9Bro65SzccDQbeZzEGzLEeiYI-vwe6w7_-bTBChRuo1TNz2kmoD86vPELIsfunGUBpuZBc93HfwfR2SauG7gJfTENDM',
    description: 'Chiseled black letter scripture on hands'
  },
  {
    id: 'gal-006',
    category: 'ไซเบอร์-แบล็คเวิร์ค',
    name: 'Biomechanical Skull Sleeve',
    artist: 'กิม',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmVvp5a-O6o8eagOrQDzNhvQSJVYymrO2cBsoAGgGrxJhxq85_UdK6eOBFu-hQ8Ynw68tH0_paYXY1Vw0nomKlJFtcVxxNQQ8gbTPdggf23_GUpP_dYj2YpU2dLp3W77PEWFYn2LZsQTE6ZsQ1t3wgWKGPZGPbN9_TXFA6ebhw61i5-r3B2bVFJ5bhy8pYaCnpVlNBV-FA2MaykDVPotfRGNYS1eBfO9PqSXQ7ytr_o6hPvoBekOLYOtYeDbXNABEiIlYXutNXHFA',
    description: '3D biomechanical elements framing skull structure'
  },
  {
    id: 'gal-007',
    category: 'ดาร์ก มินิมอล',
    name: 'Linear Flow Geometry',
    artist: 'กิม',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDlxFPGLwnO9FSns5hFtIgbS-QBbkTdyIg57JiB48y-HkZgS_Cq0xeMglSA65l2hW84IE01rTV129znVTEUBAhwsdrlYSum0CI0FWcdcjZYnMBuR-wMJh7v-Z3xFFIULb15om3kuxlDSa-dN7fTGuS0bdg6_O9SAahGYUmM5judb6ty4AhP9nHvyW9D7kOI4OPR2MGVfUaZcDtk75DLApJLG1RDc6kKlKqXFehavEJjXdmGCn3nmAmDulOjv_bHpwaJHORC9VGVXxk',
    description: 'Clean line geometry on calf area'
  },
  {
    id: 'gal-008',
    category: 'ไซเบอร์-แบล็คเวิร์ค',
    name: 'Crimson Chest Chaos',
    artist: 'เจตน์',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBveLvY8WUdwu5KE677bxyMv4-xTO35bJFYmamqkomB9KgJRouEndeaYrfSL7Mb9WzuG2_piT5SDcLz7mxIrcFEf9yTRQXiz-RkkQKETl7Se16c7_Nc5gxEbdVugcPCL5CE_yetxHFZ8IUAO-oBCf8fZrUHME6q30Mo0cri8S-TmOo-d-yTs-o7pXdhiumrlpnnrb0v0gBN0f_Q2gbnPEIdW6kSOmw5gf9vPjaQwdh1_R_3J7PWWFABF8fe2uP_36awPmtqzXGJQqo',
    description: 'Stark red ink thrash-polka composition on the chest'
  },
  {
    id: 'gal-009',
    category: 'โอเรียนทัล',
    name: 'Sacred Back Dotwork',
    artist: 'พิมพ์ดาว',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBa02lFMChvOI6gTbMjtosvVFh3oF_mIyC9e3ElkozEnNkMyT00GxFHRmusrtU8XtrEaf7K8kvQRoQHkFTkr8Xt3lWch3hu-SoWQNciuYyN0MVGPKxu6WXzlIYkpxzfaeucEzfJlEvOfUF6Jt4pW6lT2oRcyCHE8MIxZKz7klsJ152S4XlHbM7x8EfrKW4_Hd1mTLfDzHYrI89nCRoDTzX8Wz_R23R34XpnNPzMc_xbyYAI9fKug2AwkbKBV7_o2P7IaU7sBBr9Scw',
    description: 'Stunning full back sacred geometry and soft dotwork'
  },
  {
    id: 'gal-010',
    category: 'ไซเบอร์-แบล็คเวิร์ค',
    name: 'Obsidian Wings Portrait',
    artist: 'กิม',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAObOILhCxXIsTdQvYLmmUFU0pXwAWbpbmz57p94D-GIPiOja7R2mRZyL54INKOgjn9I5IJU9f3STn_zVh5n9GyOSlvUY6EhPDBRtUhKYZnNdq4omTX0_kBs58iIqjoDVY7fRBdbQcEmwn3HAzzEa5GQIkzFUL5Ccze4cjMH0QBIG6CNmE9Ax42casv2aT4K6Ipzb1t5JRJtv2JiUmZ_v7FeVoUXCjqy-gATSVGJJ98JQ4baesxguFZCV5bTY67ijYHN9AM6r6hjqI',
    description: 'Dense black ink drawing of a detailed raven'
  },
  {
    id: 'gal-011',
    category: 'ไซเบอร์-แบล็คเวิร์ค',
    name: 'Futuristic Armor Crest',
    artist: 'พิมพ์ดาว',
    imageUrl: tattooStudioWorkspace,
    description: 'Cinematic professional space engraving and studio branding workspace'
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'APT-9281',
    name: 'วิชัย รักดี',
    phone: '081-234-5678',
    email: 'wichai.r@gmail.com',
    date: '2026-06-12',
    time: '13:00',
    artist: 'กวิน',
    style: 'ดาร์ก มินิมอล',
    size: '10x10 cm',
    note: 'อยากได้รูปดอกกุหลาบ ลายเส้นบางๆ คอนทราสต์ตัดกันจัดเจน',
    status: 'Confirmed',
    createdAt: '2026-06-09T08:00:00.000Z'
  },
  {
    id: 'APT-9282',
    name: 'สมหญิง แสงทอง',
    phone: '089-876-5432',
    email: 'somying.s@hotmail.com',
    date: '2026-06-14',
    time: '11:00',
    artist: 'พิมพ์ดาว',
    style: 'นีโอ-อิเรซูมิ',
    size: 'A4 Size',
    note: 'ลายมังกรคาบลูกแก้วที่หลัง ค่อยๆ แบ่งทำสัก 3 รอบ',
    status: 'Confirmed',
    createdAt: '2026-06-09T08:15:00.000Z'
  },
  {
    id: 'APT-9283',
    name: 'ณัฐพงษ์ พรทวี',
    phone: '082-333-4455',
    email: 'nattapong.p@gmail.com',
    date: '2026-06-15',
    time: '15:30',
    artist: 'กิม',
    style: 'ไซเบอร์-แบล็คเวิร์ค',
    size: 'Half-Sleeve',
    note: 'ลายสไตล์วงจรไฟฟ้าไซเบอร์ มีทรายสเกลแบบดอทผสมแถวข้อศอก',
    status: 'Pending',
    createdAt: '2026-06-09T08:45:00.000Z'
  }
];

export const INITIAL_INVENTORY: InventoryItem[] = [
  {
    code: 'NDL-1203RL',
    name: 'Kwadron Needles 1203RL',
    category: 'Needles',
    currentStock: 2,
    minStock: 5,
    unit: 'Boxes',
    status: 'LOW'
  },
  {
    code: 'INK-DYN-08',
    name: 'Dynamic Black Ink (8oz)',
    category: 'Inks',
    currentStock: 12,
    minStock: 4,
    unit: 'Bottles',
    status: 'OK'
  },
  {
    code: 'EQP-GLV-M',
    name: 'Nitril Black Gloves (Size M)',
    category: 'Consumables',
    currentStock: 1,
    minStock: 10,
    unit: 'Boxes',
    status: 'LOW'
  },
  {
    code: 'CLN-GRN-01',
    name: 'Green Soap Cleaning Concentrated',
    category: 'Cleaning',
    currentStock: 1,
    minStock: 2,
    unit: 'Gallons',
    status: 'LOW'
  },
  {
    code: 'NDL-1205RS',
    name: 'Kwadron Needles 1205RS',
    category: 'Needles',
    currentStock: 8,
    minStock: 5,
    unit: 'Boxes',
    status: 'OK'
  },
  {
    code: 'INK-RED-04',
    name: 'Eternal Crimson Red Ink (4oz)',
    category: 'Inks',
    currentStock: 6,
    minStock: 2,
    unit: 'Bottles',
    status: 'OK'
  }
];

export const INITIAL_TRANSACTIONS: FinancialTransaction[] = [
  {
    trxId: 'TRX-9923',
    date: '2026-06-08',
    time: '14:30',
    title: 'มัดจำรอยสัก (คุณวิชัย - ลายกุหลาบ)',
    category: 'รายได้ / Deposit',
    type: 'income',
    amount: 5000,
    status: 'Success',
    artist: 'กวิน'
  },
  {
    trxId: 'TRX-9924',
    date: '2026-06-08',
    time: '10:15',
    title: 'สั่งซื้อเข็มและหมึกเพิ่มประจำเดือน',
    category: 'ค่าวัสดุและหมึกสัก / Materials',
    type: 'expense',
    amount: 12400,
    status: 'Success'
  },
  {
    trxId: 'TRX-9925',
    date: '2026-06-09',
    time: '08:12',
    title: 'ค่าไฟฟ้าสตูดิโอ ประจำงวดเดือนพฤษภาคม',
    category: 'ค่าใช้จ่ายสาธารณูปโภค / Utilities',
    type: 'expense',
    amount: 4500,
    status: 'Success'
  },
  {
    trxId: 'TRX-9926',
    date: '2026-06-09',
    time: '18:15',
    title: 'ชำระเงินเต็มจำนวน (คุณสมหญิง - นีโออิเรซูมิ)',
    category: 'รายได้จากบริการสัก / Service Income',
    type: 'income',
    amount: 15000,
    status: 'Pending',
    artist: 'พิมพ์ดาว'
  }
];

export const INITIAL_TICKETS: SystemTicket[] = [
  {
    id: 'TKT-8924',
    category: 'ปัญหาเทคนิค / Google Sheets Sync',
    title: 'Map ไม่โหลดในหน้าลูกค้าสาขาหลัก',
    details: 'ไอเฟรมแผนที่ Google Maps แสดงแอนิเมชั่นหมุนไม่โหลดเมื่อเข้าพอร์ตโฟลิโอผ่าน Safari',
    status: 'Checking',
    createdAt: '2026-06-09T05:22:00.000Z'
  },
  {
    id: 'TKT-8801',
    category: 'ตั้งค่าระบบ / Backoffice Permission',
    title: 'เพิ่มสิทธิ์การเข้าถึงให้ช่างสักคนใหม่',
    details: 'ต้องการปลดล็อคแท็บจัดการแกลเลอรีให้ช่างสัก เจตน์ เพื่ออัปเดตรูปรอยสัก',
    status: 'Resolved',
    createdAt: '2026-06-05T09:15:00.000Z'
  }
];

export const INITIAL_REVIEWS: ClientReview[] = [
  {
    id: 'REV-001',
    author: 'อนันดา สิริโชติ',
    rating: 5,
    message: 'งานสักดาร์กมินิมอลกับช่างกวินสวยเนี๊ยบและเบามือมากๆ ครับ แนะนำร้านนี้เลย บรรยากาศเงียบสงบลึกลับดีมาก',
    status: 'Approved',
    createdAt: '2026-06-07T12:30:00.000Z',
    artist: 'กวิน'
  },
  {
    id: 'REV-002',
    author: 'มุกรินทร์ แก้วมณี',
    rating: 5,
    message: 'ช่างพิมพ์ดาวสักมังกรแบล็คเวิร์คได้อลังการมากค่ะ คุ้มค่าการรอคอยและการจอง แนะนำให้ลงมัดจำล็อกคิวล่วงหน้าเลย',
    status: 'Approved',
    createdAt: '2026-06-08T15:45:00.000Z',
    artist: 'พิมพ์ดาว'
  },
  {
    id: 'REV-003',
    author: 'ธนพัทธ์ เดชะ',
    rating: 4,
    message: 'งานสักแขนไซเบอร์แบล็คเวิร์คกับช่างกิมเท่สุดๆ มีรายละเอียดวงจรเรียบร้อย เจ็บแต่คุ้มใจมากครับ',
    status: 'Approved',
    createdAt: '2026-06-09T02:10:00.000Z',
    artist: 'กิม'
  },
  {
    id: 'REV-004',
    author: 'แพรวพรรณ นวลจันทร์',
    rating: 5,
    message: 'ยังไม่เคยไปสัก แต่ดูแกลเลอรีแอดมินอัปเดตงานบ่อยมาก อยากลองจัดคิวสักรูปดอกกุหลาบสีดำค่ะ',
    status: 'Pending',
    createdAt: '2026-06-09T08:00:00.000Z',
    artist: 'กวิน'
  }
];


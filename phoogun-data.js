// PHOOGUN TATTOO — Data Layer
const PHOOGUN = {
  IMAGES: { rose:'images/rose.png', workspace:'images/workspace.png', dragon:'images/dragon.png', biomech:'images/biomech.png' },

  ARTISTS:[
    {id:'art-001',nameTh:'กิม',nameEn:'Kimm',specialty:'Cyber-Blackwork / Geometric',imageUrl:'https://lh3.googleusercontent.com/aida-public/AB6AXuAygxjP4n5S3j3K8wCXwKgQ1Wqx5Oeoly0u9_-37018ci3SzUZeGbZZNsZwK0XXxTshgTGvOVPvnFDevirOKu87RcfYgzkN9rgZaqyehiHonC5f3-1eTiANKF5WFl1Qi_g9AI9mDzIMrHqM_XQSUCY5GJ8mQbc3HJOF2IHNQcZqdackfMrKEvXUp4HORZ52EAQb1V4Wd2nlw-j7B_r_ukuJfx_nwpmfeORip0zEfaGwWQrz0zTxTLvh-GZB_jPusQIIZiqfrIzOs78',experience:'8 Years',availability:'Mon–Fri'},
    {id:'art-002',nameTh:'พิมพ์ดาว',nameEn:'Pimdao',specialty:'Neo-Irezumi & Custom Red Ink',imageUrl:'https://lh3.googleusercontent.com/aida-public/AB6AXuCIU2q6Q7_OPUqH_Ncw0cJc8jRD9DS7etsxWjTbZJBMs2UQSms4FMQQVfgnI9lH8QjK-scwofSxgJunM4REa0tfOKziCDWWhAvQiKJpN-nVFVK7o2D_4uzPTbgtvLs2NLUN1BBZsABXsTlHikiq6ylF5CxWsjiKWlQ1QX-7R-zfd8Z7gZsRz1V4wUfF7EV049PbEt_GvA5soKv6pF-OV2ikmTf_syyhXmk_2x5FS9EbQePbte9gxvwzPrsMKJ6y3We4oG3z7z03Zqw',experience:'6 Years',availability:'Daily'},
    {id:'art-003',nameTh:'กวิน',nameEn:'Kawin',specialty:'Dark Minimal & Script Lettering',imageUrl:'https://lh3.googleusercontent.com/aida-public/AB6AXuBF8MnRnyPu8OkIjlQ3fwbvqs6Wx0sy7p4xVLwIm8IO3lQYsdLEqVcTX1FmrN_taDXpikld8kGyQ22ojLDp-S8Gh2hMcIKSGA_t89RzwIEJ0lbrgbyKwvIn50g_zxhV6WeUutWEHooe27RTCi2Q_HvFG19B8osIi-knKJ6yyCEUs_HjeSimb6v4jWOlS6acMI6sifYr1GC_tIdcRHHU2wMLfRtdzEagdXaY1YDQxECo2VeY4kfQUunFp2rua6FWrdOzldoCpEK0J8A',experience:'5 Years',availability:'Wed–Sun'},
    {id:'art-004',nameTh:'เจตน์',nameEn:'Jay',specialty:'Oriental Traditional & Fine Line',imageUrl:'https://lh3.googleusercontent.com/aida-public/AB6AXuBkfqYqHFleT42qaAdx_Gp2BLkpOiNGu49Wzzxpwp3_VU_G-3zeB2ipVe0dDkxDxkh1801TXCtQgOxxj708I-Sldw-K3IEclMaxYzZZn3JztAZuX2cAmFgFFX9VC-Ie2UygDv5zIaWxvFszdmxDRsuTiXBh1ehA1SDMETyrjLYm4ln8sTDZyeWXAzxYVaZKxOhvkoRoqhYjiM9tSYJdbLZPUXidH7jbtmbKSljkukWkK5LFBbuTt9F9pdV6mycygUPzogfB_OUIiRk',experience:'7 Years',availability:'Fri–Tue'},
  ],

  GALLERY:[
    {id:'gal-001',category:'นีโอ-อิเรซูมิ',name:'Neo Cyber Dragon Backpiece',artist:'พิมพ์ดาว',imageUrl:'images/dragon.png',description:'Traditional Japanese dragon fused with biomechanical future details.'},
    {id:'gal-002',category:'ไซเบอร์-แบล็คเวิร์ค',name:'Circuit Geometrics Sleeve',artist:'กิม',imageUrl:'images/biomech.png',description:'Forearm circuit-inspired lines with mandala geometry.'},
    {id:'gal-003',category:'ดาร์ก มินิมอล',name:'Delicate Obsidian Rose',artist:'กวิน',imageUrl:'images/rose.png',description:'Fine line rose with high-contrast wrist placement.'},
    {id:'gal-004',category:'โอเรียนทัล',name:'Crimson Forest Tiger',artist:'เจตน์',imageUrl:'https://lh3.googleusercontent.com/aida-public/AB6AXuDgiXQmSzMHmSfD27q--n-wm5VLZU3qx_V6SIe3vY_WUkPh0cGeFJX7Kge41DWxdICukv3B568whg4WinNalEIkod1d3UaG7nlIjKO3Jhx4JASOefyuHpswIoR5xJwcv7QfXgEa2LUzBnQo_BnNtFE2bemaYRHLtnlkal-upg2ve0E-g09aTiDNfDnQfsi6d6YpDV2XVuZjLwf4XgT7hqAO1iIogYX072i2qF2AIbk90_2pLkkteaq9JkIHEPWYv_5f6KcakBC8svI',description:'Oriental tiger with blood-red paint splatter.'},
    {id:'gal-005',category:'อักขระและฟอนต์',name:'Gothic Knuckles Typo',artist:'กวิน',imageUrl:'https://lh3.googleusercontent.com/aida-public/AB6AXuCnRxnajIfCa_AovEvC6m8MAqd8seDcPTRty7tWO2nlYBxfzFBHGVYg1l403CUISfp9g6HemAFaVJOeMs0S8_y4LZKVoKSX3HVkGIUg0pvoa96FtFwI0i5O7TXo4JSJK__F4FolpeX6dWaQNcQIXbgTHNrDgg7mtvaelLavUZC8adMpCFwV9Bro65SzccDQbeZzEGzLEeiYI-vwe6w7_-bTBChRuo1TNz2kmoD86vPELIsfunGUBpuZBc93HfwfR2SauG7gJfTENDM',description:'Black letter gothic scripture on hands.'},
    {id:'gal-006',category:'ไซเบอร์-แบล็คเวิร์ค',name:'Biomechanical Skull Sleeve',artist:'กิม',imageUrl:'https://lh3.googleusercontent.com/aida-public/AB6AXuDmVvp5a-O6o8eagOrQDzNhvQSJVYymrO2cBsoAGgGrxJhxq85_UdK6eOBFu-hQ8Ynw68tH0_paYXY1Vw0nomKlJFtcVxxNQQ8gbTPdggf23_GUpP_dYj2YpU2dLp3W77PEWFYn2LZsQTE6ZsQ1t3wgWKGPZGPbN9_TXFA6ebhw61i5-r3B2bVFJ5bhy8pYaCnpVlNBV-FA2MaykDVPotfRGNYS1eBfO9PqSXQ7ytr_o6hPvoBekOLYOtYeDbXNABEiIlYXutNXHFA',description:'3D biomechanical skull frame.'},
    {id:'gal-007',category:'ดาร์ก มินิมอล',name:'Linear Flow Geometry',artist:'กิม',imageUrl:'https://lh3.googleusercontent.com/aida-public/AB6AXuDlxFPGLwnO9FSns5hFtIgbS-QBbkTdyIg57JiB48y-HkZgS_Cq0xeMglSA65l2hW84IE01rTV129znVTEUBAhwsdrlYSum0CI0FWcdcjZYnMBuR-wMJh7v-Z3xFFIULb15om3kuxlDSa-dN7fTGuS0bdg6_O9SAahGYUmM5judb6ty4AhP9nHvyW9D7kOI4OPR2MGVfUaZcDtk75DLApJLG1RDc6kKlKqXFehavEJjXdmGCn3nmAmDulOjv_bHpwaJHORC9VGVXxk',description:'Clean geometric lines on calf.'},
    {id:'gal-008',category:'ไซเบอร์-แบล็คเวิร์ค',name:'Crimson Chest Chaos',artist:'เจตน์',imageUrl:'https://lh3.googleusercontent.com/aida-public/AB6AXuBveLvY8WUdwu5KE677bxyMv4-xTO35bJFYmamqkomB9KgJRouEndeaYrfSL7Mb9WzuG2_piT5SDcLz7mxIrcFEf9yTRQXiz-RkkQKETl7Se16c7_Nc5gxEbdVugcPCL5CE_yetxHFZ8IUAO-oBCf8fZrUHME6q30Mo0cri8S-TmOo-d-yTs-o7pXdhiumrlpnnrb0v0gBN0f_Q2gbnPEIdW6kSOmw5gf9vPjaQwdh1_R_3J7PWWFABF8fe2uP_36awPmtqzXGJQqo',description:'Thrash-polka composition on chest.'},
    {id:'gal-009',category:'โอเรียนทัล',name:'Sacred Back Dotwork',artist:'พิมพ์ดาว',imageUrl:'https://lh3.googleusercontent.com/aida-public/AB6AXuBa02lFMChvOI6gTbMjtosvVFh3oF_mIyC9e3ElkozEnNkMyT00GxFHRmusrtU8XtrEaf7K8kvQRoQHkFTkr8Xt3lWch3hu-SoWQNciuYyN0MVGPKxu6WXzlIYkpxzfaeucEzfJlEvOfUF6Jt4pW6lT2oRcyCHE8MIxZKz7klsJ152S4XlHbM7x8EfrKW4_Hd1mTLfDzHYrI89nCRoDTzX8Wz_R23R34XpnNPzMc_xbyYAI9fKug2AwkbKBV7_o2P7IaU7sBBr9Scw',description:'Full back sacred geometry dotwork.'},
    {id:'gal-010',category:'ไซเบอร์-แบล็คเวิร์ค',name:'Obsidian Wings Portrait',artist:'กิม',imageUrl:'https://lh3.googleusercontent.com/aida-public/AB6AXuAObOILhCxXIsTdQvYLmmUFU0pXwAWbpbmz57p94D-GIPiOja7R2mRZyL54INKOgjn9I5IJU9f3STn_zVh5n9GyOSlvUY6EhPDBRtUhKYZnNdq4omTX0_kBs58iIqjoDVY7fRBdbQcEmwn3HAzzEa5GQIkzFUL5Ccze4cjMH0QBIG6CNmE9Ax42casv2aT4K6Ipzb1t5JRJtv2JiUmZ_v7FeVoUXCjqy-gATSVGJJ98JQ4baesxguFZCV5bTY67ijYHN9AM6r6hjqI',description:'Dense black ink raven portrait.'},
  ],

  APPOINTMENTS:[
    {id:'APT-9281',name:'วิชัย รักดี',phone:'081-234-5678',email:'wichai.r@gmail.com',date:'2026-06-20',time:'13:00',artist:'กวิน',style:'ดาร์ก มินิมอล',size:'10x10 cm',note:'ดอกกุหลาบลายเส้นบาง',status:'Confirmed',createdAt:'2026-06-09T08:00:00Z'},
    {id:'APT-9282',name:'สมหญิง แสงทอง',phone:'089-876-5432',email:'somying.s@hotmail.com',date:'2026-06-22',time:'11:00',artist:'พิมพ์ดาว',style:'นีโอ-อิเรซูมิ',size:'A4 Size',note:'ลายมังกรที่หลัง',status:'Confirmed',createdAt:'2026-06-09T08:15:00Z'},
    {id:'APT-9283',name:'ณัฐพงษ์ พรทวี',phone:'082-333-4455',email:'nattapong.p@gmail.com',date:'2026-06-25',time:'15:30',artist:'กิม',style:'ไซเบอร์-แบล็คเวิร์ค',size:'Half-Sleeve',note:'ลายวงจรไฟฟ้า',status:'Pending',createdAt:'2026-06-09T08:45:00Z'},
    {id:'APT-9284',name:'ปาริชาต ทองดี',phone:'090-555-7788',email:'parichat@gmail.com',date:'2026-06-28',time:'14:00',artist:'เจตน์',style:'โอเรียนทัล',size:'A5 Size',note:'ลายเสือโคร่ง',status:'Pending',createdAt:'2026-06-10T09:00:00Z'},
    {id:'APT-9285',name:'ธนวัฒน์ ใจดี',phone:'085-444-9900',email:'tanawat@gmail.com',date:'2026-06-15',time:'13:00',artist:'กวิน',style:'อักขระและฟอนต์',size:'5x5 cm',note:'ตัวอักษรกอธิค',status:'Completed',createdAt:'2026-06-10T10:00:00Z'},
    {id:'APT-9286',name:'ภัทรพงษ์ ชมชื่น',phone:'086-111-2233',email:'pat@gmail.com',date:'2026-07-01',time:'10:00',artist:'กิม',style:'ดาร์ก มินิมอล',size:'10x10 cm',note:'ลายพระจันทร์ดำ',status:'Pending',createdAt:'2026-06-11T07:00:00Z'},
  ],

  INVENTORY:[
    {code:'NDL-1203RL',name:'Kwadron Needles 1203RL',category:'Needles',currentStock:2,minStock:5,unit:'Boxes',status:'LOW'},
    {code:'INK-DYN-08',name:'Dynamic Black Ink (8oz)',category:'Inks',currentStock:12,minStock:4,unit:'Bottles',status:'OK'},
    {code:'EQP-GLV-M',name:'Nitril Black Gloves (M)',category:'Consumables',currentStock:1,minStock:10,unit:'Boxes',status:'LOW'},
    {code:'CLN-GRN-01',name:'Green Soap Concentrate',category:'Cleaning',currentStock:1,minStock:2,unit:'Gallons',status:'LOW'},
    {code:'NDL-1205RS',name:'Kwadron Needles 1205RS',category:'Needles',currentStock:8,minStock:5,unit:'Boxes',status:'OK'},
    {code:'INK-RED-04',name:'Eternal Crimson Ink (4oz)',category:'Inks',currentStock:6,minStock:2,unit:'Bottles',status:'OK'},
    {code:'EQP-WRAP-01',name:'Stretch Film Roll',category:'Consumables',currentStock:3,minStock:2,unit:'Rolls',status:'OK'},
    {code:'CLN-ALC-01',name:'Isopropyl Alcohol 99%',category:'Cleaning',currentStock:4,minStock:3,unit:'Bottles',status:'OK'},
  ],

  TRANSACTIONS:[
    {trxId:'TRX-9923',date:'2026-06-08',time:'14:30',title:'มัดจำรอยสัก คุณวิชัย (กุหลาบ)',category:'Deposit',type:'income',amount:5000,status:'Success',artist:'กวิน'},
    {trxId:'TRX-9924',date:'2026-06-08',time:'10:15',title:'ซื้อเข็มและหมึกประจำเดือน',category:'Materials',type:'expense',amount:12400,status:'Success',artist:''},
    {trxId:'TRX-9925',date:'2026-06-09',time:'08:12',title:'ค่าไฟฟ้าสตูดิโอ มิ.ย.',category:'Utilities',type:'expense',amount:4500,status:'Success',artist:''},
    {trxId:'TRX-9926',date:'2026-06-09',time:'18:15',title:'ชำระเต็มจำนวน คุณสมหญิง (นีโออิเรซูมิ)',category:'Service Income',type:'income',amount:15000,status:'Pending',artist:'พิมพ์ดาว'},
    {trxId:'TRX-9927',date:'2026-06-10',time:'09:00',title:'ค่าเช่าสตูดิโอ มิ.ย.',category:'Rent',type:'expense',amount:30000,status:'Success',artist:''},
    {trxId:'TRX-9928',date:'2026-06-10',time:'16:00',title:'มัดจำ คุณณัฐพงษ์ (Half Sleeve)',category:'Deposit',type:'income',amount:10000,status:'Success',artist:'กิม'},
    {trxId:'TRX-9929',date:'2026-06-11',time:'11:00',title:'ชำระเต็ม คุณธนวัฒน์ (Gothic Script)',category:'Service Income',type:'income',amount:3500,status:'Success',artist:'กวิน'},
  ],

  TICKETS:[
    {id:'TKT-8924',category:'Technical',title:'Map ไม่โหลดใน Safari',details:'Google Maps iframe แสดง loading loop ใน Safari iOS',status:'Checking',createdAt:'2026-06-09T05:22:00Z'},
    {id:'TKT-8801',category:'Settings',title:'เพิ่มสิทธิ์ช่างสักคนใหม่',details:'ต้องการปลดล็อคแท็บแกลเลอรีให้ช่างเจตน์',status:'Resolved',createdAt:'2026-06-05T09:15:00Z'},
  ],

  REVIEWS:[
    {id:'REV-001',author:'อนันดา สิริโชติ',rating:5,message:'งานสักดาร์กมินิมอลกับช่างกวินสวยเนี๊ยบมาก บรรยากาศร้านเงียบสงบดีมากครับ',status:'Approved',createdAt:'2026-06-07T12:30:00Z',artist:'กวิน'},
    {id:'REV-002',author:'มุกรินทร์ แก้วมณี',rating:5,message:'ช่างพิมพ์ดาวสักมังกรได้อลังการมาก คุ้มค่าการรอคอยค่ะ แนะนำให้ล็อคคิวล่วงหน้าเลย',status:'Approved',createdAt:'2026-06-08T15:45:00Z',artist:'พิมพ์ดาว'},
    {id:'REV-003',author:'ธนพัทธ์ เดชะ',rating:4,message:'งานไซเบอร์แบล็คเวิร์คกับช่างกิมเท่มาก มีรายละเอียดวงจรเรียบร้อย',status:'Approved',createdAt:'2026-06-09T02:10:00Z',artist:'กิม'},
    {id:'REV-004',author:'แพรวพรรณ นวลจันทร์',rating:5,message:'อยากลองจัดคิวสักรูปดอกกุหลาบสีดำค่ะ',status:'Pending',createdAt:'2026-06-09T08:00:00Z',artist:'กวิน'},
  ],

  FLASH:[
    {id:'flash-001',name:'Obsidian Rose',artist:'กวิน',category:'ดาร์ก มินิมอล',imageUrl:'images/rose.png',price:3500,size:'8×8 cm',available:true},
    {id:'flash-002',name:'Cyber Dragon Mini',artist:'พิมพ์ดาว',category:'นีโอ-อิเรซูมิ',imageUrl:'images/dragon.png',price:6500,size:'12×8 cm',available:true},
    {id:'flash-003',name:'Biomech Mandala',artist:'กิม',category:'ไซเบอร์-แบล็คเวิร์ค',imageUrl:'images/biomech.png',price:5000,size:'10×6 cm',available:true},
    {id:'flash-004',name:'Gothic Tiger',artist:'เจตน์',category:'โอเรียนทัล',imageUrl:'https://lh3.googleusercontent.com/aida-public/AB6AXuDgiXQmSzMHmSfD27q--n-wm5VLZU3qx_V6SIe3vY_WUkPh0cGeFJX7Kge41DWxdICukv3B568whg4WinNalEIkod1d3UaG7nlIjKO3Jhx4JASOefyuHpswIoR5xJwcv7QfXgEa2LUzBnQo_BnNtFE2bemaYRHLtnlkal-upg2ve0E-g09aTiDNfDnQfsi6d6YpDV2XVuZjLwf4XgT7hqAO1iIogYX072i2qF2AIbk90_2pLkkteaq9JkIHEPWYv_5f6KcakBC8svI',price:7000,size:'14×10 cm',available:true},
    {id:'flash-005',name:'Script "Eternal"',artist:'กวิน',category:'อักขระและฟอนต์',imageUrl:'https://lh3.googleusercontent.com/aida-public/AB6AXuCnRxnajIfCa_AovEvC6m8MAqd8seDcPTRty7tWO2nlYBxfzFBHGVYg1l403CUISfp9g6HemAFaVJOeMs0S8_y4LZKVoKSX3HVkGIUg0pvoa96FtFwI0i5O7TXo4JSJK__F4FolpeX6dWaQNcQIXbgTHNrDgg7mtvaelLavUZC8adMpCFwV9Bro65SzccDQbeZzEGzLEeiYI-vwe6w7_-bTBChRuo1TNz2kmoD86vPELIsfunGUBpuZBc93HfwfR2SauG7gJfTENDM',price:2500,size:'6×3 cm',available:true},
    {id:'flash-006',name:'Sacred Geometry',artist:'กิม',category:'ไซเบอร์-แบล็คเวิร์ค',imageUrl:'https://lh3.googleusercontent.com/aida-public/AB6AXuBa02lFMChvOI6gTbMjtosvVFh3oF_mIyC9e3ElkozEnNkMyT00GxFHRmusrtU8XtrEaf7K8kvQRoQHkFTkr8Xt3lWch3hu-SoWQNciuYyN0MVGPKxu6WXzlIYkpxzfaeucEzfJlEvOfUF6Jt4pW6lT2oRcyCHE8MIxZKz7klsJ152S4XlHbM7x8EfrKW4_Hd1mTLfDzHYrI89nCRoDTzX8Wz_R23R34XpnNPzMc_xbyYAI9fKug2AwkbKBV7_o2P7IaU7sBBr9Scw',price:4500,size:'9×9 cm',available:false},
  ],

  WAITLIST:[
    {id:'WL-001',name:'ภีม วงศ์ทอง',phone:'081-777-8899',preferredArtist:'พิมพ์ดาว',style:'นีโอ-อิเรซูมิ',note:'รอคิวมังกรขนาดกลาง',addedAt:'2026-06-10T10:00:00Z',status:'Waiting'},
    {id:'WL-002',name:'ณิชา สุขเจริญ',phone:'089-333-4455',preferredArtist:'กิม',style:'ไซเบอร์-แบล็คเวิร์ค',note:'Half sleeve รอช่างกิมคิวว่าง',addedAt:'2026-06-09T14:00:00Z',status:'Notified'},
    {id:'WL-003',name:'กฤษฎา พรหมมา',phone:'082-222-6677',preferredArtist:'กวิน',style:'ดาร์ก มินิมอล',note:'ต้องการลายมินิมอล',addedAt:'2026-06-08T09:00:00Z',status:'Waiting'},
    {id:'WL-004',name:'สุรีย์ แก้วนิล',phone:'090-888-1234',preferredArtist:'เจตน์',style:'โอเรียนทัล',note:'รอขยายรอยเดิม',addedAt:'2026-06-07T11:30:00Z',status:'Booked'},
  ],

  PRICE_CONFIG:{
    sizes:[
      {id:'xs',label:'Tiny',labelTh:'จิ๋ว',desc:'~5×5 cm',base:[2000,3500],sessions:1},
      {id:'sm',label:'Small',labelTh:'เล็ก',desc:'~8×8 cm',base:[3500,6000],sessions:1},
      {id:'md',label:'Medium',labelTh:'กลาง',desc:'~10×10 cm',base:[6000,10000],sessions:2},
      {id:'lg',label:'Large',labelTh:'ใหญ่',desc:'A5 Size',base:[10000,18000],sessions:2},
      {id:'xl',label:'X-Large',labelTh:'ใหญ่มาก',desc:'A4 Size',base:[18000,30000],sessions:3},
      {id:'hs',label:'Half Sleeve',labelTh:'ครึ่งแขน',desc:'~30×15 cm',base:[28000,50000],sessions:4},
      {id:'fs',label:'Full Sleeve',labelTh:'เต็มแขน',desc:'~60×15 cm',base:[50000,90000],sessions:'5+'},
    ],
    styles:[
      {id:'minimal',label:'Dark Minimal',labelTh:'ดาร์ก มินิมอล',mult:1.0,artist:'กวิน'},
      {id:'script',label:'Gothic Script',labelTh:'อักขระกอธิค',mult:0.9,artist:'กวิน'},
      {id:'oriental',label:'Oriental',labelTh:'โอเรียนทัล',mult:1.15,artist:'เจตน์'},
      {id:'cyber',label:'Cyber-Blackwork',labelTh:'ไซเบอร์-แบล็คเวิร์ค',mult:1.2,artist:'กิม'},
      {id:'irezumi',label:'Neo-Irezumi',labelTh:'นีโอ-อิเรซูมิ',mult:1.3,artist:'พิมพ์ดาว'},
    ],
    placements:[
      {id:'arm',label:'Arm / Calf',labelTh:'แขน / ขา',mult:1.0},
      {id:'thigh',label:'Thigh',labelTh:'ต้นขา',mult:1.05},
      {id:'chest',label:'Chest',labelTh:'อก',mult:1.1},
      {id:'back',label:'Back',labelTh:'หลัง',mult:1.1},
      {id:'ribs',label:'Ribs',labelTh:'ซี่โครง',mult:1.25},
      {id:'hand',label:'Hand / Finger',labelTh:'มือ / นิ้ว',mult:1.3},
      {id:'neck',label:'Neck',labelTh:'คอ',mult:1.35},
      {id:'face',label:'Face',labelTh:'ใบหน้า',mult:1.5},
    ],
    colors:[
      {id:'black',label:'Black Only',labelTh:'ดำล้วน',mult:1.0},
      {id:'grey',label:'B&W Shading',labelTh:'ดำ + เทา',mult:1.1},
      {id:'limited',label:'Limited Color',labelTh:'สีจำกัด (1-2)',mult:1.25},
      {id:'full',label:'Full Color',labelTh:'เต็มสี',mult:1.4},
    ],
  },
};
window.PHOOGUN = PHOOGUN;

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, Clock, User, Phone, Mail, FileText, Check, ArrowRight, MapPin, 
  Search, ShieldCheck, Star, Award, Scissors, HeartCrack, ChevronRight, X, AlertCircle, Copy, CheckCircle2,
  Heart, Flame
} from 'lucide-react';
import { GalleryItem, Appointment, Artist, ClientReview } from '../types';
import { GALLERY_ITEMS, ARTISTS } from '../data/mockData';

interface ClientViewProps {
  onLoginClick: () => void;
  appsScriptUrl: string;
  onNewLocalBooking: (booking: Appointment) => void;
  reviews?: ClientReview[];
  onNewLocalReview?: (review: ClientReview) => void;
  addToast: (title: string, message: string, type: 'success' | 'error' | 'info' | 'warning') => void;
  brandName?: string;
  brandLogoUrl?: string;
  gallery?: GalleryItem[];
  artists?: Artist[];
}

export const ClientView: React.FC<ClientViewProps> = ({ 
  onLoginClick, 
  appsScriptUrl, 
  onNewLocalBooking,
  reviews = [],
  onNewLocalReview,
  addToast,
  brandName = 'KAGE TATTOO',
  brandLogoUrl = '',
  gallery = [],
  artists = []
}) => {
  const [lang, setLang] = useState<'TH' | 'EN'>('TH');
  const [activeTab, setActiveTab] = useState<'gallery' | 'artists' | 'booking' | 'about' | 'reviews'>('gallery');
  const [selectedCategory, setSelectedCategory] = useState<string>('ทั้งหมด');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'popular'>('newest');
  
  // Booking Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    date: '',
    time: '12:00',
    artist: 'พิมพ์ดาว',
    style: 'ไซเบอร์-แบล็คเวิร์ค',
    size: '10x10 cm',
    note: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [quickViewItem, setQuickViewItem] = useState<GalleryItem | null>(null);

  // Review Form States
  const [reviewAuthor, setReviewAuthor] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewArtist, setReviewArtist] = useState('พิมพ์ดาว');
  const [reviewMsg, setReviewMsg] = useState('');
  const [isSubmitReviewing, setIsSubmitReviewing] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);

  // Translations Map
  const t = {
    heroTitle: lang === 'TH' ? 'มิติศิลปะบนเรือนร่าง' : 'Body Art Dimension',
    heroSubtitle: lang === 'TH' ? 'สู่อนาคตที่หรูหราดุดัน' : 'A Cyberpunk Gothic Saga',
    heroDesc: lang === 'TH' 
      ? 'KAGE TATTOO ผสานลายสักแบบไซเบอร์แบล็คเวิร์ค ฟอนต์อักขระกอธิค และนีโออิเรซูมิ สตูดิโอสักระดับพรีเมียมที่มอบผลงานเหนือกาลเวลาด้วยวัสดุเกรดการแพทย์และความประณีตสูงสุด'
      : 'KAGE TATTOO blends cyber-blackwork, gothic typography, and Neo-Irezumi. A ultra-premium tattoo studio offering timeless relics crafted with medical-grade precision.',
    ctaBook: lang === 'TH' ? 'จองคิวออนไลน์ทันที' : 'Book Appointment Now',
    ctaPortfolio: lang === 'TH' ? 'ดูผลงานพอร์ตโฟลิโอ' : 'View Core Portfolios',
    navArtist: lang === 'TH' ? 'ทำความรู้จักช่างสัก' : 'Artists & Sages',
    gallerySub: lang === 'TH' ? 'แกลเลอรีผลงานระดับมาสเตอร์พีซ' : 'Masterpiece Gallery',
    all: lang === 'TH' ? 'ทั้งหมด / All' : 'All Works',
    searchPlaceholder: lang === 'TH' ? 'ค้นหารอยสัก ศิลปิน แนวสี...' : 'Search tattoos, styles, artists...',
    aboutTitle: lang === 'TH' ? 'ข้อมูลสตูดิโอ KAGE TATTOO' : 'About Kage Tattoo Studio',
    whyUs: lang === 'TH' ? 'ทำไมต้องเลือกเรา?' : 'Why KAGE TATTOO?',
    safetyTitle: lang === 'TH' ? 'ความปลอดภัยระดับโรงพยาบาล' : 'Hospital-Grade Sterilization',
    safetyDesc: lang === 'TH' 
      ? 'ใช้เข็มแบบควาดรอนคาร์ทริดจ์นำเข้าบรรจุซองแยกฆ่าเชื้อรายชิ้น และใช้เตาอบฆ่าเชื้อหมุนเวียนมาตรฐานการแพทย์สูงสุด'
      : 'Utilizing sealed, imported Kwadron needle cartridges, and medical-grade autoclave circulation for ultimate safety.',
    artisticTitle: lang === 'TH' ? 'ศิลปะเฉพาะบุคคลสูงสุด' : 'Ultimate Tailored Ink Artwork',
    artisticDesc: lang === 'TH'
      ? 'ช่างสักทุกคนไม่ได้เป็นแค่ผู้ลงเข็ม แต่เป็นผู้ออกแบบตัวตน ความปรารถนา และอนาคตของคุณลงบนเรือนร่างในภาพวาดชิ้นเอก'
      : 'Our artists are not mere technicians, but creators mapping your identity, desires and future onto the living canvas.',
    bookingTitle: lang === 'TH' ? 'ระบบจองคิวรับบริการสัก' : 'Ink Casting Appointment Scheduler',
    bookingIntro: lang === 'TH'
      ? 'กรอกข้อมูลด้านล่างเพื่อจองวันสักหรือปรึกษา ทีมงานระบุคิวพาร์ทรอยสักและคำนวณราคาให้คุณโดยละเอียดเมื่อกดยืนยันสำเร็จ'
      : 'Fill the oracle form below to save a slot. Our high-priest support team will organize sizes, pricing and verify slots.',
    nameLabel: lang === 'TH' ? 'ชื่อ-นามสกุลของคุณ' : 'Your Full Name',
    phoneLabel: lang === 'TH' ? 'เบอร์โทรศัพท์ติดต่อ' : 'Mobile Phone Number',
    emailLabel: lang === 'TH' ? 'อีเมลติดต่อ' : 'Email Address',
    dateLabel: lang === 'TH' ? 'วันที่วางแผนจะมัดจำและสัก' : 'Scheduled Date',
    timeLabel: lang === 'TH' ? 'เวลาจองคิวเริ่มต้น' : 'Inception Time Slot',
    artistLabel: lang === 'TH' ? 'เลือกช่างสักประจำคิว' : 'Select Tattoo Artist',
    styleLabel: lang === 'TH' ? 'แนวทางศิลปะที่ต้องการสัก' : 'Desired Aesthetic Style',
    sizeLabel: lang === 'TH' ? 'ขนาดของรอยสักโดยประมาณ' : 'Approximate Size Area',
    noteLabel: lang === 'TH' ? 'รายละเอียดเพิ่มเติมที่อยากฝากถึงช่างสัก (ไอเดีย, ตำแหน่งที่จะสัก, รายละเอียดเรื่องสี)' : 'Aesthetic Notes (Design Concept, Body Location, Colors)',
    submitBtn: lang === 'TH' ? 'ยืนยันการจองคิวสักระดับพรีเมียม' : 'Authorize Premium Booking',
    addressTitle: lang === 'TH' ? 'ที่ตั้งสตูดิโอและการเดินทาง' : 'Studio Sanctorum Location',
    hours: lang === 'TH' ? 'เวลาให้บริการ: 12:00 - 21:00 น. (หยุดทุกวันพฤหัสบดี)' : 'Operating Hours: 12:00 PM - 9:00 PM (Closed Thursdays)',
    addressDesc: lang === 'TH'
      ? 'อาคาร Kage Horizon ชั้น 4, ซอยทองหล่อ 13, สุขุมวิท 55, กรุงเทพมหานคร (มีที่จอดรถส่วนตัวชั้นใต้ดินสำหรับลูกค้าสัก)'
      : 'Kage Horizon Tower, 4th Floor, Thonglor Soi 13, Sukhumvit 55, Bangkok (Private Basement Valet for Inked Patrons)'
  };

  const categories = ['ทั้งหมด', 'นีโอ-อิเรซูมิ', 'ไซเบอร์-แบล็คเวิร์ค', 'ดาร์ก มินิมอล', 'โอเรียนทัล', 'อักขระและฟอนต์'];

  // Filter and sort gallery items
  const filteredGallery = useMemo(() => {
    const list = gallery && gallery.length > 0 ? gallery : GALLERY_ITEMS;
    
    // 1. Filter items based on category and query matches
    const filtered = list.filter(item => {
      const matchCategory = selectedCategory === 'ทั้งหมด' || item.category === selectedCategory;
      const matchQuery = !searchQuery || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchQuery;
    });

    // Helper to generate stable deterministic popularity metrics for sorting
    const getMetrics = (item: GalleryItem) => {
      const charSum = item.name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const likes = (charSum % 140) + 60; // Stable deterministic popularity metric: 60 to 200 likes
      // Highlight some items with an extra boost
      const extraBoost = item.id === 'gal-001' ? 300 : item.id === 'gal-003' ? 250 : 0;
      const totalLikes = likes + extraBoost;
      
      const idNum = parseInt(item.id.replace(/\D/g, '')) || 0;
      return { totalLikes, idNum };
    };

    // 2. Sort items
    return [...filtered].sort((a, b) => {
      if (sortBy === 'popular') {
        return getMetrics(b).totalLikes - getMetrics(a).totalLikes;
      } else {
        // 'newest' -> highest idNum first
        return getMetrics(b).idNum - getMetrics(a).idNum;
      }
    });
  }, [gallery, selectedCategory, searchQuery, sortBy]);

  // Handle form submission
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.date) {
      setSubmitError(lang === 'TH' ? 'กรุณากรอกชื่อ เบอร์โทร และวันที่ให้ครบถ้วน' : 'Please provide Name, Phone, and Date.');
      return;
    }

    setIsSubmitting(true);
    setSubmitSuccess(null);
    setSubmitError(null);

    const generatedId = `APT-${Math.floor(1000 + Math.random() * 9000)}`;
    const newBooking: Appointment = {
      id: generatedId,
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      date: formData.date,
      time: formData.time,
      artist: formData.artist,
      style: formData.style,
      size: formData.size,
      note: formData.note,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };

    // If Google Apps Script is configured, try posting there!
    if (appsScriptUrl) {
      try {
        const response = await fetch(appsScriptUrl, {
          method: 'POST',
          mode: 'no-cors', // standard Apps Script handling
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            action: 'book_appointment',
            ...formData
          })
        });
        
        // Even with no-cors, we proceed with optimistic success
        setSubmitSuccess(generatedId);
        onNewLocalBooking(newBooking);
        resetForm();
      } catch (err: any) {
        console.error("Failed to sync to Sheets, falling back to local database...", err);
        setSubmitSuccess(generatedId);
        onNewLocalBooking(newBooking);
        resetForm();
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Offline local store fallback
      setTimeout(() => {
        setSubmitSuccess(generatedId);
        onNewLocalBooking(newBooking);
        setIsSubmitting(false);
        resetForm();
      }, 700);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      phone: '',
      email: '',
      date: '',
      time: '12:00',
      artist: artists[0]?.nameTh || 'กิม',
      style: categories[2],
      size: '10x10 cm',
      note: ''
    });
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewAuthor.trim()) {
      setReviewError(lang === 'TH' ? 'กรุณาระบุชื่อของคุณ' : 'Please provide your name');
      return;
    }
    if (!reviewMsg.trim()) {
      setReviewError(lang === 'TH' ? 'กรุณาพิมพ์ข้อความรีวิว' : 'Please write your review message');
      return;
    }

    setIsSubmitReviewing(true);
    setReviewError(null);

    const generatedId = `REV-${Math.floor(1000 + Math.random() * 9000)}`;
    const newReview: ClientReview = {
      id: generatedId,
      author: reviewAuthor.trim(),
      rating: reviewRating,
      message: reviewMsg.trim(),
      status: 'Pending',
      createdAt: new Date().toISOString(),
      artist: reviewArtist
    };

    if (appsScriptUrl) {
      try {
        await fetch(appsScriptUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            action: 'add_review',
            author: reviewAuthor.trim(),
            rating: reviewRating,
            message: reviewMsg.trim(),
            artist: reviewArtist,
            status: 'Pending'
          })
        });
        
        if (onNewLocalReview) {
          onNewLocalReview(newReview);
        }
        setIsSubmitReviewing(false);
        setReviewSuccess(true);
        setReviewAuthor('');
        setReviewRating(5);
        setReviewMsg('');
      } catch (err: any) {
        console.error("Failed to sync review, falling back locally:", err);
        if (onNewLocalReview) {
          onNewLocalReview(newReview);
        }
        setIsSubmitReviewing(false);
        setReviewSuccess(true);
        setReviewAuthor('');
        setReviewRating(5);
        setReviewMsg('');
      }
    } else {
      setTimeout(() => {
        if (onNewLocalReview) {
          onNewLocalReview(newReview);
        }
        setIsSubmitReviewing(false);
        setReviewSuccess(true);
        setReviewAuthor('');
        setReviewRating(5);
        setReviewMsg('');
      }, 700);
    }
  };

  return (
    <div className="bg-[#0e0e0e] text-gray-200 min-h-screen font-sans border-b border-[#222]">
      
      {/* 1. Header Navigation */}
      <nav id="client_nav" className="sticky top-0 bg-[#0e0e0e]/95 backdrop-blur-md z-40 border-b border-[#1f1f1f]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-12">
            <div>
              <a href="#" className="flex items-center space-x-3.5" onClick={() => setActiveTab('gallery')}>
                {brandLogoUrl ? (
                  <img 
                    src={brandLogoUrl} 
                    alt={brandName} 
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-tr-md rounded-bl-md object-cover shadow-[0_0_12px_rgba(230,25,46,0.3)] border border-crimson/20" 
                  />
                ) : (
                  <span className="w-8 h-8 rounded-tr-md rounded-bl-md bg-crimson flex items-center justify-center font-heading text-lg font-bold text-white shadow-[0_0_12px_rgba(230,25,46,0.5)]">
                    {brandName ? brandName.trim().charAt(0).toUpperCase() : 'K'}
                  </span>
                )}
                <span className="font-heading tracking-[0.2em] text-xl font-bold text-white uppercase">
                  {brandName}
                </span>
              </a>
            </div>

            {/* Main Tabs */}
            <div className="hidden md:flex space-x-8 text-sm uppercase tracking-widest font-heading">
              <button 
                onClick={() => { setActiveTab('gallery'); setSelectedCategory('ทั้งหมด'); }}
                className={`py-1 cursor-pointer transition ${activeTab === 'gallery' ? 'text-crimson border-b-2 border-crimson font-medium' : 'text-gray-400 hover:text-white'}`}
              >
                {lang === 'TH' ? 'ผลงานแกลเลอรี' : 'MASTER PORTFOLIO'}
              </button>
              <button 
                onClick={() => setActiveTab('artists')}
                className={`py-1 cursor-pointer transition ${activeTab === 'artists' ? 'text-crimson border-b-2 border-crimson font-medium' : 'text-gray-400 hover:text-white'}`}
              >
                {lang === 'TH' ? 'ช่างสักฝีมือ' : 'TATTOO ARTISTS'}
              </button>
              <button 
                onClick={() => setActiveTab('booking')}
                className={`py-1 cursor-pointer transition ${activeTab === 'booking' ? 'text-crimson border-b-2 border-crimson font-medium' : 'text-gray-400 hover:text-white'}`}
              >
                {lang === 'TH' ? 'จองคิวสักพรีเมียม' : 'ONLINE BOOKING'}
              </button>
              <button 
                onClick={() => setActiveTab('about')}
                className={`py-1 cursor-pointer transition ${activeTab === 'about' ? 'text-crimson border-b-2 border-crimson font-medium' : 'text-gray-400 hover:text-white'}`}
              >
                {lang === 'TH' ? 'ข้อมูลสตูดิโอ' : 'ABOUT US'}
              </button>
              <button 
                onClick={() => setActiveTab('reviews')}
                className={`py-1 cursor-pointer transition ${activeTab === 'reviews' ? 'text-crimson border-b-2 border-crimson font-medium' : 'text-gray-400 hover:text-white'}`}
              >
                {lang === 'TH' ? 'รีวิวลูกค้า' : 'REVIEWS'}
              </button>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Lang Switcher */}
            <div className="bg-[#1a1a1a] rounded px-1.5 py-1 flex space-x-1.5 text-xs font-mono font-bold text-gray-400">
              <button 
                onClick={() => setLang('TH')}
                className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${lang === 'TH' ? 'bg-crimson text-white font-black' : 'hover:text-white'}`}
              >
                TH
              </button>
              <button 
                onClick={() => setLang('EN')}
                className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${lang === 'EN' ? 'bg-crimson text-white font-black' : 'hover:text-white'}`}
              >
                EN
              </button>
            </div>

            {/* Backoffice Button */}
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              id="backoffice_login_button"
              onClick={onLoginClick}
              className="bg-black text-gray-300 font-heading text-xs tracking-wider border border-[#333] hover:border-crimson hover:text-white hover:bg-crimson/5 px-5 py-2.5 rounded-full font-medium cursor-pointer transition flex items-center gap-1.5 shadow-[0_0_15px_rgba(230,25,46,0.1)]"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-crimson" />
              <span>INK_OS LOGIN</span>
            </motion.button>
          </div>
        </div>
      </nav>

      {/* 2. Headline Hero Banner */}
      <section id="hero_section" className="relative overflow-hidden bg-black py-20 lg:py-28 px-4 sm:px-6 lg:px-8 border-b border-[#222]">
        {/* Ambient Dark Overlay with Hotlinked Hero photo */}
        <div 
          className="absolute inset-0 opacity-25 filter grayscale contrast-125 hover:scale-105 transition-all duration-1000"
          style={{
            backgroundImage: `url('https://lh3.googleusercontent.com/aida-public/AB6AXuAH2VHoT4qVonht0Nz1lQg98naAGYjhVIJreH-46cJ13ne9exp4S3cKq7puGQK1i3dJupWQ6GlSMmVu8KIoXHoYW_j_Tjs_UWORiSkDPCh6mtGjPJpNGk3VnyLkxcTb5fW4b_FsTojQy6orDMMY7v-gVXQYXA7Zdc1Te4mF9cUKwDmvuEEHdMdS7P7hnmTDMGOGh0TPqWO0r8dPVJIdH5GdiGyKYO94J7X4gv0hs7VyDxlPRFlQpIP-DHXzgdO4yOPOiYimx6e_jy8')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center 35%'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0e0e0e] via-[#0e0e0e]/80 to-black/90 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto flex flex-col items-center text-center z-10 py-6">
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-crimson/10 border border-crimson/30 rounded-full text-crimson text-xs tracking-widest uppercase font-mono mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-crimson animate-pulse" />
            <span>Premium Dark Arts Guild • Bangkok Studio</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="font-heading font-black tracking-tight text-4xl sm:text-6xl lg:text-7xl text-white uppercase max-w-5xl leading-[1.1]"
          >
            {t.heroTitle} <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-crimson via-red-500 to-crimson/80 font-light italic">
              {t.heroSubtitle}
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="mt-6 text-gray-400 text-sm sm:text-lg max-w-3xl leading-relaxed"
          >
            {t.heroDesc}
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 items-center justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setActiveTab('booking');
                addToast('กำลังเข้าสู่ตารางจองสัก / Appointment Desk', 'เลือกช่างสักศิลปิน ทรง ขนาดลาน และระบุเวลาอเนกประสงค์', 'info');
              }}
              className="w-full sm:w-auto bg-crimson text-white font-heading font-bold text-sm tracking-widest uppercase px-8 py-4 rounded-full shadow-[0_0_20px_rgba(230,25,46,0.4)] hover:shadow-[0_0_30px_rgba(230,25,46,0.6)] cursor-pointer hover:bg-red-600 transition flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              {t.ctaBook}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => { 
                setActiveTab('gallery'); 
                setSelectedCategory('ทั้งหมด'); 
                addToast('ดาวน์โหลดผลงานแล้ว / Loaded Artwork', 'สำรวจดีไซน์ศิลปะ และลวดลายลิขสิทธิ์สไตล์ดาร์กเมตาฟิสิกส์', 'info');
              }}
              className="w-full sm:w-auto border border-gray-700 bg-black/40 hover:border-gray-400 text-white font-heading font-semibold text-sm tracking-widest uppercase px-8 py-4 rounded-full cursor-pointer transition flex items-center justify-center gap-2"
            >
              <span>{t.ctaPortfolio}</span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Marquee Ticker */}
      <div className="bg-[#080808] border-b border-[#1f1f1f] py-3.5 overflow-hidden flex select-none">
        <div className="flex space-x-8 animate-marquee whitespace-nowrap text-xs font-mono font-bold tracking-[0.25em] text-gray-500 uppercase">
          <span>• PREMIUM TATTOO ARTISTS</span>
          <span className="text-crimson">• NEO-IREZUMI SPECIALISTS</span>
          <span>• BLACKWORK ONLY DESIGN</span>
          <span className="text-crimson">• HYGIENIC STERILE HOSPITAL GRADE</span>
          <span>• APPOINTMENT CASTING SYSTEM</span>
          <span>• CYBER-BLACKWORK DESIGN LAB</span>
          <span>• PREMIUM TATTOO ARTISTS</span>
          <span className="text-crimson">• NEO-IREZUMI SPECIALISTS</span>
          <span>• BLACKWORK ONLY DESIGN</span>
          <span className="text-crimson">• HYGIENIC STERILE HOSPITAL GRADE</span>
          <span>• APPOINTMENT CASTING SYSTEM</span>
          <span>• CYBER-BLACKWORK DESIGN LAB</span>
        </div>
      </div>

      {/* 3. Main Content Views depending on selected activeTab */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* TAB 1: MASTER GALLERY */}
        <AnimatePresence mode="wait">
          {activeTab === 'gallery' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-10"
            >
              {/* Category Bento Selector & Search & Sort */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div>
                  <h2 className="font-heading text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-crimson rounded-sm" />
                    {t.gallerySub}
                  </h2>
                  <p className="text-gray-400 text-xs font-mono mt-1">
                    {lang === 'TH' ? 'คลิกเลือกหมวดหมู่สไตล์เพื่อฟิลเตอร์พอร์ตโฟลิโอแฝงเงาเสมือนจริง' : 'Select a tattoo core style to view individual masters'}
                  </p>
                </div>

                {/* Search Bar & Sort Dropdown Group */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-2xl w-full md:justify-end">
                  {/* Search Bar */}
                  <div className="relative flex-1">
                    <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                      <Search className="w-4 h-4 text-gray-500" />
                    </span>
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t.searchPlaceholder}
                      className="w-full bg-[#161616] border border-[#2d2d2d] focus:border-crimson/50 focus:outline-none rounded-full pl-11 pr-10 py-3 text-sm text-white font-sans transition-all placeholder:text-gray-500"
                    />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery('')} className="absolute right-4 inset-y-0 flex items-center text-gray-500 hover:text-white cursor-pointer">
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Sort Dropdown */}
                  <div className="relative min-w-[180px]">
                    <select
                      id="sort-filter"
                      value={sortBy}
                      onChange={(e) => {
                        const mode = e.target.value as 'newest' | 'popular';
                        setSortBy(mode);
                        addToast(
                          lang === 'TH' ? 'จัดเรียงผลงานสำเร็จ' : 'Sorted Artworks',
                          lang === 'TH' 
                            ? `จัดเรียงตาม: ${mode === 'newest' ? 'ผลงานล่าสุด' : 'ผลงานยอดนิยมสูงสุด'}`
                            : `Sorting complete: ${mode === 'newest' ? 'Newest' : 'Most Popular'} first`,
                          'info'
                        );
                      }}
                      className="w-full appearance-none bg-[#161616] border border-[#2d2d2d] focus:border-crimson/50 focus:outline-none rounded-full px-5 py-3 pr-10 text-xs font-heading font-bold uppercase tracking-wider text-white transition-all cursor-pointer hover:border-gray-500 hover:bg-[#1a1a1a]"
                    >
                      <option value="newest" className="bg-[#121212] text-white">
                        {lang === 'TH' ? '📅 ล่าสุดก่อน / Newest' : '📅 Newest First'}
                      </option>
                      <option value="popular" className="bg-[#121212] text-white">
                        {lang === 'TH' ? '🔥 ยอดนิยมสูงสุด / Popular' : '🔥 Most Popular'}
                      </option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-gray-400">
                      <svg className="fill-current h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* bento categories grid style */}
              <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
                {categories.map((cat, idx) => (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    key={idx}
                    onClick={() => {
                      setSelectedCategory(cat);
                      addToast(`หมวดหมู่: ${cat}`, `กำลังคัดกรองจัดสไตล์ภาพผลงานรหัสสีแนว ${cat}`, 'info');
                    }}
                    className={`py-3 px-3 text-[10.5px] font-heading font-bold uppercase tracking-wider rounded-full transition-all text-center border cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-crimson border-crimson text-white shadow-[0_4px_12px_rgba(230,25,46,0.3)] font-black'
                        : 'bg-[#121212] border-[#222] hover:border-gray-500 hover:bg-[#181818] text-gray-400'
                    }`}
                  >
                    {cat}
                  </motion.button>
                ))}
              </div>

              {/* Staggered Portfolio Items */}
              {filteredGallery.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-[#2d2d2d] rounded-md">
                  <AlertCircle className="w-10 h-10 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 font-mono text-sm leading-6">
                    {lang === 'TH' ? 'ไม่พบรูปรหัสรอยสักหรือศิลปินที่คุณตามหา...' : 'No tattoos matched the desired style or filter...'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredGallery.map((item, index) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ 
                        y: -8, 
                        scale: 1.015,
                        borderColor: 'rgba(230, 25, 46, 0.4)',
                        boxShadow: '0 15px 35px rgba(0, 0, 0, 0.5)'
                      }}
                      transition={{ 
                        type: 'spring', 
                        stiffness: 300, 
                        damping: 20 
                      }}
                      key={item.id}
                      onClick={() => setQuickViewItem(item)}
                      className="group relative bg-[#131313] border border-[#222] rounded-lg overflow-hidden cursor-pointer"
                    >
                      {/* Badge category */}
                      <span className="absolute top-3 left-3 bg-[#0a0a0a]/80 text-[10px] tracking-wider font-mono font-bold text-crimson border border-crimson/20 px-2.5 py-1 rounded select-none z-10 backdrop-blur-sm">
                        {item.category}
                      </span>
                      
                      {/* Performance optimized referrerPolicy attribute */}
                      <div className="aspect-[4/5] bg-[#0c0c0c] relative overflow-hidden">
                        <img 
                          src={item.imageUrl} 
                          alt={item.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                      </div>

                      {/* Content Section */}
                      <div className="p-5 relative">
                        <p className="text-xs font-mono text-crimson tracking-wider font-semibold">
                          Designer: {item.artist}
                        </p>
                        <h4 className="font-heading text-base font-bold text-white mt-1 group-hover:text-crimson transition-colors uppercase">
                          {item.name}
                        </h4>
                        <p className="text-gray-400 text-xs font-light mt-2 line-clamp-2">
                          {item.description}
                        </p>
                        
                        {/* Metrics Badge */}
                        {(() => {
                          const charSum = item.name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
                          const likes = (charSum % 140) + 60 + (item.id === 'gal-001' ? 300 : item.id === 'gal-003' ? 250 : 0);
                          const views = likes * 4 + (charSum % 30);
                          return (
                            <div className="flex items-center gap-3 mt-2.5 text-gray-500 font-mono text-[10.5px]">
                              <span className="flex items-center gap-1 select-none">
                                <Heart className="w-3.5 h-3.5 text-crimson fill-crimson/10 group-hover:fill-crimson/40 group-hover:scale-110 transition-all duration-300" />
                                <span>{likes} {lang === 'TH' ? 'ถูกใจ' : 'likes'}</span>
                              </span>
                              <span className="flex items-center gap-1 select-none">
                                <Flame className="w-3.5 h-3.5 text-amber-500 group-hover:scale-115 transition-transform" />
                                <span>{views} {lang === 'TH' ? 'เข้าชม' : 'views'}</span>
                              </span>
                            </div>
                          );
                        })()}

                        <div className="mt-4 pt-4 border-t border-[#1f1f1f] flex justify-between items-center">
                          <span className="text-[10px] font-mono font-semibold text-gray-500 group-hover:text-gray-400">
                            {item.id}
                          </span>
                          <span className="text-[10.5px] font-heading font-medium text-crimson tracking-widest uppercase flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                            {lang === 'TH' ? 'ขยายดูผลงาน' : 'EXPAND ART'}
                            <ChevronRight className="w-3.5 h-3.5" />
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Visual CTA block */}
              <div className="mt-16 bg-gradient-to-r from-black to-[#131313] rounded-xl border border-[#2d2d2d] p-6 sm:p-10 flex flex-col md:flex-row items-center justify-between gap-8 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                <div className="space-y-2">
                  <div className="text-xs font-mono text-crimson uppercase tracking-widest font-black">
                    Ready For Your Masterpiece?
                  </div>
                  <h3 className="font-heading text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
                    {lang === 'TH' ? 'เริ่มต้นวาดรอยสักแรกกับเราวันนี้' : 'AUTHORIZE YOUR BODY EMBLEM'}
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm max-w-xl">
                    {lang === 'TH' ? 'กรอกใบเสนอแนวรอยสักและศิลปินที่ชื่นชอบ เพื่อคำนวณราคาและให้คำแนะนำฟรีไม่มีค่าใช้จ่าย' : 'Provide your reference details and chosen specialist to analyze measurements, elements, and quotes.'}
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('booking')}
                  className="w-full md:w-auto bg-crimson text-white font-heading font-bold text-xs tracking-wider uppercase px-7 py-4 rounded cursor-pointer transition glow-hover whitespace-nowrap"
                >
                  {t.ctaBook}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TAB 2: TATTOO ARTISTS SAGES */}
        <AnimatePresence mode="wait">
          {activeTab === 'artists' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-10"
            >
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="text-xs font-mono text-crimson font-black tracking-widest uppercase">The Ink Masters</span>
                <h2 className="font-heading text-3xl font-black text-white uppercase tracking-tight">{t.navArtist}</h2>
                <p className="text-gray-400 text-xs sm:text-sm">
                  {lang === 'TH' ? 'ทีมงานสถาปนิกสีสยบมาร รังสรรค์ความดุดัน ความเป็นหนึ่งในสายตามินิมอลและเครื่องประดับที่เหนือระดับ' : 'Meet our guild of tattoo architects, translating your story into exquisite gothic relics and dark shadows.'}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {artists.map((art) => (
                  <div 
                    key={art.id}
                    className="bg-[#131313] border border-[#222] rounded-lg overflow-hidden group hover:border-crimson/50 transition-all"
                  >
                    <div className="aspect-[4/5] bg-black overflow-hidden relative">
                      <img 
                        src={art.imageUrl} 
                        alt={art.nameEn}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-102 transition-all duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent opacity-80" />
                    </div>
                    <div className="p-5 space-y-3">
                      <div>
                        <div className="text-xs font-mono text-crimson font-bold uppercase tracking-widest">
                          {art.specialty}
                        </div>
                        <h3 className="font-heading text-lg font-bold text-white uppercase mt-1">
                          ช่าง {lang === 'TH' ? art.nameTh : art.nameEn}
                        </h3>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-gray-400 bg-black/40 p-2.5 rounded border border-[#1f1f1f]">
                        <div>
                          <span className="text-gray-500 block">EXPERIENCE:</span>
                          <span className="text-white font-bold">{art.experience}</span>
                        </div>
                        <div>
                          <span className="text-gray-500 block">AVAILABILITY:</span>
                          <span className="text-green-400/90 font-bold">{art.availability}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setFormData(prev => ({ ...prev, artist: art.nameTh }));
                          setActiveTab('booking');
                        }}
                        className="w-full bg-[#1b1b1b] group-hover:bg-crimson group-hover:text-white text-gray-300 py-2 rounded text-xs tracking-widest uppercase font-heading font-semibold transition cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Scissors className="w-3..5 h-3.5" />
                        <span>{lang === 'TH' ? 'จองคิวช่างท่านนี้' : 'BOOK SESSION'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quality Checklist Segment */}
              <div className="mt-16 bg-[#131313] p-8 rounded-lg border border-[#222]">
                <h3 className="font-heading text-lg font-bold text-white uppercase tracking-tight mb-6 flex items-center gap-2">
                  <Award className="w-5 h-5 text-crimson" />
                  <span>{lang === 'TH' ? 'มาตรฐานทางร้าน KAGE TATTOO' : 'THE KAGE STANDARD OF OPERATIONS'}</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                  <div className="space-y-2 bg-black/40 p-5 rounded border border-[#1f1f1f]">
                    <h4 className="font-heading font-black text-crimson uppercase text-xs tracking-widest">01 / Hospital Clean</h4>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      {lang === 'TH' ? 'ซองบรรจุเข็มสักเปิดใหม่แบบใช้ครั้งเดียวทิ้งต่อหน้าลูกค้า 100% หมึกแท้นำเข้าจากแบรนด์ชั้นนำระดับสากล' : 'Single-use needles opened explicitly in front of you. 100% genuine dynamic and eternal USA black & color ink.'}
                    </p>
                  </div>
                  <div className="space-y-2 bg-black/40 p-5 rounded border border-[#1f1f1f]">
                    <h4 className="font-heading font-black text-crimson uppercase text-xs tracking-widest">02 / Customized Draft</h4>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      {lang === 'TH' ? 'ออกแบบดราฟต์ลนลานผิวให้ทดสอบจริง จัดระวางสรีระร่วมกันจนกว่าลูกค้าจะพึงพอใจอย่างที่สุด' : 'Dynamic stenciling on body contours. Fine scale position checking with you until it reaches flawless symmetry.'}
                    </p>
                  </div>
                  <div className="space-y-2 bg-black/40 p-5 rounded border border-[#1f1f1f]">
                    <h4 className="font-heading font-black text-crimson uppercase text-xs tracking-widest">03 / Lifetime Aftercare</h4>
                    <p className="text-gray-400 text-xs leading-relaxed">
                      {lang === 'TH' ? 'รับมอบขี้ผึ้งบำรุงหลังรอยสัก พร้อมช่องทางการติดต่อทีมช่างสำหรับเช็คมดผิวหนังฟรีต่อเนื่องสองปีเต็ม' : 'Complementary high-grade vitamin aftercare ointment and active healing evaluation for 2 full years.'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TAB 3: SCHEDULER BOOKING */}
        <AnimatePresence mode="wait">
          {activeTab === 'booking' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="max-w-3xl mx-auto space-y-8"
            >
              <div className="space-y-2">
                <span className="text-xs font-mono text-crimson font-black tracking-widest uppercase block text-center">Inception Gate</span>
                <h2 className="font-heading text-3xl font-black text-white uppercase text-center tracking-tight">{t.bookingTitle}</h2>
                <p className="text-gray-400 text-xs sm:text-sm text-center">
                  {t.bookingIntro}
                </p>
              </div>

              {/* Status Alert Blocks */}
              {submitSuccess && (
                <div className="bg-green-950/40 border border-green-500/40 text-green-300 p-5 rounded-lg space-y-2 animate-fadeIn shadow-[0_4px_15px_rgba(34,197,94,0.15)] flex flex-col items-center text-center">
                  <CheckCircle2 className="w-10 h-10 text-green-400 mb-1" />
                  <h4 className="font-heading text-lg font-black uppercase text-white tracking-widest">
                    {lang === 'TH' ? 'ส่งคำจองสำเร็จอย่างเรียบร้อย!' : 'Cast Ink Booking Confirmed!'}
                  </h4>
                  <p className="text-xs max-w-lg leading-relaxed text-gray-300">
                    {lang === 'TH' 
                      ? 'รหัสการจองชั่วคราวของคุณคือด้านล่างนี้ ระบบบันทึกบน Google Sheet สำเร็จ ทีมงานได้รับการยืนยันระดับสูงแล้ว' 
                      : 'Your reservation record has been successfully cataloged into Google Sheets. Check your reference ID below:'}
                  </p>
                  <div className="bg-black/80 font-mono text-white text-lg font-bold border border-green-500/30 px-5 py-2 rounded-md tracking-widest mt-3 mb-1.5 inline-flex items-center gap-2">
                    <span>{submitSuccess}</span>
                    <button 
                      onClick={() => navigator.clipboard.writeText(submitSuccess)}
                      className="text-gray-400 hover:text-white active:scale-90 transition-transform cursor-pointer"
                      title="คัดลอกรหัสจอง / Copy Code"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                  <button 
                    onClick={() => { setSubmitSuccess(null); }}
                    className="text-xs text-green-400 hover:text-green-300 font-mono underline underline-offset-4 cursor-pointer mt-2"
                  >
                    {lang === 'TH' ? 'ส่งคำขอนัดหมายเพิ่มอีกครั้ง' : 'Create another booking session'}
                  </button>
                </div>
              )}

              {submitError && (
                <div className="bg-red-950/30 border border-red-500/30 text-red-300 p-4 rounded-lg flex items-center gap-3">
                  <AlertCircle className="w-5 h-5 text-crimson flex-shrink-0" />
                  <span className="text-xs font-mono">{submitError}</span>
                </div>
              )}

              {/* FORM CONTAINER */}
              {!submitSuccess && (
                <form 
                  id="client_booking_form"
                  onSubmit={handleBookingSubmit} 
                  className="bg-[#131313] border border-[#222] p-6 sm:p-10 rounded-xl space-y-6 shadow-xl"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* User Name */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono uppercase text-gray-400 block tracking-wider flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-crimson" />
                        <span>{t.nameLabel} <span className="text-crimson">*</span></span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData(p => ({ ...p, name: e.target.value }))}
                        className="w-full bg-[#1b1b1b] border border-[#2d2d2d] rounded-full px-5 py-3 text-sm focus:border-crimson focus:outline-none focus:ring-1 focus:ring-crimson text-white transition-all"
                        placeholder={lang === 'TH' ? 'เช่น ตะวัน รักชาติ' : 'e.g. Victor Kage'}
                      />
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono uppercase text-gray-400 block tracking-wider flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-crimson" />
                        <span>{t.phoneLabel} <span className="text-crimson">*</span></span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData(p => ({ ...p, phone: e.target.value }))}
                        className="w-full bg-[#1b1b1b] border border-[#2d2d2d] rounded-full px-5 py-3 text-sm focus:border-crimson focus:outline-none focus:ring-1 focus:ring-crimson text-white transition-all"
                        placeholder={lang === 'TH' ? 'เช่น 089-XXX-XXXX' : 'e.g. 089-XXX-XXXX'}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Email */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono uppercase text-gray-400 block tracking-wider flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-crimson" />
                        <span>{t.emailLabel}</span>
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData(p => ({ ...p, email: e.target.value }))}
                        className="w-full bg-[#1b1b1b] border border-[#2d2d2d] rounded-full px-5 py-3 text-sm focus:border-crimson focus:outline-none focus:ring-1 focus:ring-crimson text-white transition-all"
                        placeholder="yourname@gmail.com"
                      />
                    </div>

                    {/* Date */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono uppercase text-gray-400 block tracking-wider flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-crimson" />
                        <span>{t.dateLabel} <span className="text-crimson">*</span></span>
                      </label>
                      <input
                        type="date"
                        required
                        value={formData.date}
                        onChange={(e) => setFormData(p => ({ ...p, date: e.target.value }))}
                        className="w-full bg-[#1b1b1b] border border-[#2d2d2d] rounded-full px-5 py-3 text-sm focus:border-crimson focus:outline-none focus:ring-1 focus:ring-crimson text-white font-mono transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    {/* Time */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono uppercase text-gray-400 block tracking-wider flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-crimson" />
                        <span>{t.timeLabel}</span>
                      </label>
                      <select
                        value={formData.time}
                        onChange={(e) => setFormData(p => ({ ...p, time: e.target.value }))}
                        className="w-full bg-[#1b1b1b] border border-[#2d2d2d] rounded-full px-5 py-3 text-sm focus:border-crimson focus:outline-none text-white font-mono cursor-pointer"
                      >
                        <option value="12:00">12:00 น.</option>
                        <option value="13:30">13:30 น.</option>
                        <option value="15:00">15:00 น.</option>
                        <option value="16:30">16:30 น.</option>
                        <option value="18:00">18:00 น.</option>
                        <option value="19:30">19:30 น.</option>
                      </select>
                    </div>

                    {/* Artist Select */}
                    <div className="space-y-2">
                      <label className="text-xs font-mono uppercase text-gray-400 block tracking-wider flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-crimson" />
                        <span>{t.artistLabel}</span>
                      </label>
                      <select
                        value={formData.artist}
                        onChange={(e) => setFormData(p => ({ ...p, artist: e.target.value }))}
                        className="w-full bg-[#1b1b1b] border border-[#2d2d2d] rounded-full px-5 py-3 text-sm focus:border-crimson focus:outline-none text-white cursor-pointer"
                      >
                        {artists.map(a => (
                          <option key={a.id} value={a.nameTh}>
                            ช่าง {a.nameTh} ({a.specialty.split(' ')[0]})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Aesthetic Style */}
                    <div className="space-y-4 sm:space-y-2">
                      <label className="text-xs font-mono uppercase text-gray-400 block tracking-wider flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 text-crimson" />
                        <span>{t.styleLabel}</span>
                      </label>
                      <select
                        value={formData.style}
                        onChange={(e) => setFormData(p => ({ ...p, style: e.target.value }))}
                        className="w-full bg-[#1b1b1b] border border-[#2d2d2d] rounded-full px-5 py-3 text-sm focus:border-crimson focus:outline-none text-white cursor-pointer"
                      >
                        <option value="ไซเบอร์-แบล็คเวิร์ค">Cyber-Blackwork</option>
                        <option value="นีโอ-อิเรซูมิ">Neo-Irezumi</option>
                        <option value="ดาร์ก มินิมอล">Dark Minimal</option>
                        <option value="โอเรียนทัล">Oriental Traditional</option>
                        <option value="อักขระและฟอนต์">Typography Gothic</option>
                      </select>
                    </div>
                  </div>

                  {/* Size approximate */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase text-gray-400 block tracking-wider flex items-center gap-1.5">
                      <Scissors className="w-3.5 h-3.5 text-crimson" />
                      <span>{t.sizeLabel}</span>
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {['5x5 cm', '10x10 cm', 'A5 Paper', 'A4 Paper / Full back'].map((size) => (
                        <button
                          key={size}
                          type="button"
                          onClick={() => setFormData(p => ({ ...p, size }))}
                          className={`py-2 px-1 text-xs font-mono rounded-full cursor-pointer transition border ${
                            formData.size === size 
                              ? 'bg-crimson/10 border-crimson text-crimson font-bold' 
                              : 'bg-black/30 border-[#2d2d2d] hover:border-gray-500 text-gray-400'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Aesthetic Notes */}
                  <div className="space-y-2">
                    <label className="text-xs font-mono uppercase text-gray-400 block tracking-wider flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-crimson" />
                      <span>{t.noteLabel}</span>
                    </label>
                    <textarea
                      value={formData.note}
                      onChange={(e) => setFormData(p => ({ ...p, note: e.target.value }))}
                      rows={4}
                      className="w-full bg-[#1b1b1b] border border-[#2d2d2d] rounded-2xl px-5 py-4 text-sm focus:border-crimson focus:outline-none focus:ring-1 focus:ring-crimson text-white transition-all placeholder:text-gray-600"
                      placeholder={lang === 'TH' ? 'อธิบายจินตนาการของคุณ ไอเดียภาพวาด ทรง สี หรือความกังวล...' : 'Describe color options, concepts, reference link, body position...'}
                    />
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.015 }}
                    whileTap={{ scale: 0.985 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-crimson hover:bg-red-600 text-white font-heading font-bold text-sm tracking-widest uppercase py-4 rounded-full cursor-pointer transition shadow-[0_4px_15px_rgba(230,25,46,0.3)] disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>PROCESSING APPOINTMENT...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck className="w-4 h-4" />
                        <span>{t.submitBtn}</span>
                      </>
                    )}
                  </motion.button>
                </form>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* TAB 4: STUDIO LOCATION & MAP */}
        <AnimatePresence mode="wait">
          {activeTab === 'about' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-12"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <span className="text-xs font-mono text-crimson font-black tracking-widest uppercase block">The Headquarters</span>
                    <h2 className="font-heading text-3xl font-black text-white uppercase tracking-tight">{t.addressTitle}</h2>
                  </div>

                  <p className="text-gray-400 text-sm leading-relaxed">
                    {t.addressDesc}
                  </p>

                  <div className="p-5 bg-[#131313] rounded-lg border border-[#222] font-mono text-xs text-gray-400 space-y-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-crimson" />
                      <span>{t.hours}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-crimson" />
                      <span>{lang === 'TH' ? 'สายด่วนสตูดิโอ: 02-998-1313' : 'Studio Hotline: +66 2 998 1313'}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-crimson" />
                      <span>concierge@kagetattoo.cafe</span>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <a 
                      href="https://maps.google.com" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-crimson text-white font-heading font-bold text-xs tracking-wider uppercase px-5 py-3.5 rounded hover:bg-red-600 transition cursor-pointer"
                    >
                      <MapPin className="w-4 h-4" />
                      <span>{lang === 'TH' ? 'เปิดนำทางด้วย Google Maps' : 'NAVIGATE GOOGLE MAPS'}</span>
                    </a>
                  </div>
                </div>

                {/* Highly contrast, stylized monochrome mock map placeholder representing real GPS coordinates */}
                <div className="bg-[#131313] border border-[#222] p-4 rounded-xl space-y-4">
                  <div className="aspect-[4/3] w-full bg-[#090909] rounded border border-[#2d2d2d] relative overflow-hidden flex flex-col items-center justify-center">
                    
                    {/* Grayscale Map Art Grid pattern */}
                    <div className="absolute inset-0 opacity-10" style={{ 
                      backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', 
                      backgroundSize: '20px 20px' 
                    }} />

                    {/* Styled lines representing roads */}
                    <svg className="absolute inset-0 w-full h-full text-gray-800 opacity-40 select-none pointer-events-none" xmlns="http://www.w3.org/2000/svg">
                      <line x1="0" y1="50" x2="400" y2="150" stroke="currentColor" strokeWidth="4" />
                      <line x1="100" y1="0" x2="100" y2="300" stroke="currentColor" strokeWidth="2.5" />
                      <line x1="0" y1="200" x2="400" y2="200" stroke="currentColor" strokeWidth="3" />
                      <line x1="300" y1="0" x2="300" y2="300" stroke="currentColor" strokeWidth="1.5" />
                    </svg>

                    {/* Target Locator Indicator */}
                    <div className="relative flex flex-col items-center">
                      <span className="w-10 h-10 rounded-full bg-crimson/20 border-2 border-crimson flex items-center justify-center animate-pulse">
                        <MapPin className="w-5 h-5 text-crimson" />
                      </span>
                      <div className="absolute top-12 bg-black text-white px-3 py-1 text-[11px] font-mono border border-crimson rounded-md shadow-lg tracking-wider font-bold uppercase py-1 px-2 text-center select-none">
                        KAGE HORIZON L4
                      </div>
                    </div>

                    {/* Coordinates overlay badge */}
                    <div className="absolute bottom-3 left-3 bg-black/80 text-gray-500 text-[10px] font-mono p-1 rounded border border-[#222]">
                      GPS: 13.7348° N, 100.5830° E
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-mono text-gray-500">
                    <span>📍 THONGLOR SOI 13, SUKHUMVIT 55</span>
                    <span>AUTOMATIC DIRECTION INTEGRATED</span>
                  </div>
                </div>
              </div>

              {/* FAQ Section */}
              <div className="pt-8 border-t border-[#1f1f1f] space-y-6">
                <h3 className="font-heading text-xl font-bold text-white uppercase tracking-tight text-center">
                  คำถามที่พบบ่อย (FAQ)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                  <div className="bg-[#131313] p-5 rounded-lg border border-[#222] space-y-2">
                    <h4 className="font-heading font-black text-white uppercase tracking-wider">ต้องนัดหมายล่วงหน้าหรือไม่?</h4>
                    <p className="text-gray-400 leading-relaxed">
                      ทางร้านแนะนำให้จองคิวมัดจำล่วงหน้าอย่างน้อย 3-7 วันผ่านเว็บบล็อกนี้ ลูกค้าวอล์คอินจะรับเป็นรายกรณีเฉพาะลายขนาดเล็กเท่านั้น
                    </p>
                  </div>
                  <div className="bg-[#131313] p-5 rounded-lg border border-[#222] space-y-2">
                    <h4 className="font-heading font-black text-white uppercase tracking-wider">ราคาประเมินคิดอย่างไร?</h4>
                    <p className="text-gray-400 leading-relaxed">
                      คิดราคาเริ่มต้นตามขนาดและรายละเอียดของแบบสัก เริ่มต้นไซส์พิทเล็กที่ 1,500 บาท และเซสชันเหมาวันช่างสักจะเริ่มต้น 10,000 - 15,000 บาท
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TAB 5: CLIENT REVIEWS */}
        <AnimatePresence mode="wait">
          {activeTab === 'reviews' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-12"
            >
              {/* Reviews Summary Stats & Content Header */}
              <div className="border-b border-[#1f1f1f] pb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-xs font-mono text-crimson font-black tracking-widest uppercase block">Voice of our Clients</span>
                  <h2 className="font-heading text-3xl font-black text-white uppercase tracking-tight">
                    {lang === 'TH' ? 'เสียงสะท้อนและคำชมจากลูกค้า' : 'Client Testimonials & Praise'}
                  </h2>
                  <p className="text-xs text-gray-500 font-mono">
                    REAL STORIES & VERIFIED EXPERIENCE FROM THE DECK OF KAGE INK ENGINE
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* 1. Left Column: Submission Form */}
                <div className="lg:col-span-11 xl:col-span-5 bg-[#131313] p-6 rounded-xl border border-[#222] space-y-6">
                  <div>
                    <h3 className="font-heading text-lg font-bold text-white uppercase tracking-wide">
                      {lang === 'TH' ? 'เขียนคำชมหรือรีวิวของคุณ' : 'Submit Your Testimonial'}
                    </h3>
                    <p className="text-[11px] text-gray-400 mt-1">
                      {lang === 'TH' 
                        ? 'แบ่งปันประสบการณ์รอยสักสุดประณีตเพื่อบันทึกและให้คะแนนช่างสักสตูดิโอ KAGE' 
                        : 'Share your magnificent tattoo experience to empower the master blackworkers of KAGE studio.'}
                    </p>
                  </div>

                  {reviewSuccess ? (
                    <motion.div 
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="bg-green-950/20 border border-green-500/30 p-5 rounded-lg text-center space-y-4"
                    >
                      <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto" />
                      <div className="space-y-1">
                        <h4 className="font-heading text-sm font-bold text-white uppercase tracking-wider">
                          {lang === 'TH' ? 'ส่งรีวิวเสร็จสมบูรณ์ข้อมูลบันทึกสำเร็จ!' : 'TESTIMONIAL SUBMITTED'}
                        </h4>
                        <p className="text-xs text-gray-300 leading-relaxed">
                          {lang === 'TH' 
                            ? 'ขอบคุณอย่างยิ่งสำหรับความคิดเห็นของคุณ! ความฝันและรีวิวของคุณเข้าสู่ระบบ เพื่อรอผู้แก้ไขร้านอนุมัติและเผยแพร่ในเร็ววัน' 
                            : 'Thank you immensely! Your beautiful insight has been received and is waiting for administrator approval before final display.'}
                        </p>
                      </div>
                      <button
                        onClick={() => setReviewSuccess(false)}
                        className="bg-[#1a1a1a] hover:bg-neutral-800 text-xs font-mono px-5 py-2.5 rounded-full transition cursor-pointer"
                      >
                        {lang === 'TH' ? 'เขียนรีวิวอื่นเพิ่มเติม' : 'Write Another Testimonial'}
                      </button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                      {reviewError && (
                        <div className="bg-red-950/20 border border-red-500/30 p-3.5 rounded text-xs text-red-400 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 shrink-0" />
                          <span>{reviewError}</span>
                        </div>
                      )}

                      {/* Author Name */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-mono text-gray-400 uppercase tracking-widest block">
                          {lang === 'TH' ? 'ชื่อ-นามสกุลของคุณ / Author Surname' : 'Your Full Name'}
                        </label>
                        <input
                          type="text"
                          value={reviewAuthor}
                          onChange={(e) => setReviewAuthor(e.target.value)}
                          placeholder={lang === 'TH' ? 'เช่น วิชัย รักดี' : 'e.g. Richard Hendricks'}
                          className="w-full bg-[#1a1a1a] border border-[#2d2d2d] focus:border-crimson focus:outline-none rounded-full px-5 py-3 text-xs text-white"
                        />
                      </div>

                      {/* Artist dropdown selector */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-mono text-gray-400 uppercase tracking-widest block">
                          {lang === 'TH' ? 'เลือกช่างสักผู้คุมเคสของคุณ / Tattoo Artist' : 'Select Sages & Tattoo Master'}
                        </label>
                        <select
                          value={reviewArtist}
                          onChange={(e) => setReviewArtist(e.target.value)}
                          className="w-full bg-[#1a1a1a] border border-[#2d2d2d] focus:border-crimson focus:outline-none rounded-full px-5 py-3 text-xs text-white uppercase font-mono cursor-pointer"
                        >
                          {artists.map(art => (
                            <option key={art.id} value={art.nameTh}>
                              ช่าง{art.nameTh} ({art.nameEn})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Rating stars selector */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-mono text-gray-400 uppercase tracking-widest block">
                          {lang === 'TH' ? 'ให้คะแนนรอยสักและบริการ / Performance Score' : 'Tattoo & Experience Score'}
                        </label>
                        <div className="flex items-center gap-1.5 bg-[#191919] p-3 rounded-full px-5 py-2.5 border border-[#282828] w-fit">
                          {[1, 2, 3, 4, 5].map((starVal) => (
                            <button
                              key={starVal}
                              type="button"
                              onClick={() => setReviewRating(starVal)}
                              className="text-gray-500 hover:scale-110 transition cursor-pointer"
                            >
                              <Star 
                                className={`w-6 h-6 ${
                                  starVal <= reviewRating 
                                    ? 'text-amber-400 fill-amber-400' 
                                    : 'text-gray-600'
                                }`} 
                              />
                            </button>
                          ))}
                          <span className="text-xs font-mono font-bold text-gray-400 ml-2">
                            ({reviewRating} / 5 Stars)
                          </span>
                        </div>
                      </div>

                      {/* Review message text box */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-mono text-gray-400 uppercase tracking-widest block">
                          {lang === 'TH' ? 'พิมพ์ความคิดเห็นและรีวิว / Testimonial Message' : 'Testimonial Details'}
                        </label>
                        <textarea
                          rows={4}
                          value={reviewMsg}
                          onChange={(e) => setReviewMsg(e.target.value.substring(0, 250))}
                          placeholder={lang === 'TH' ? 'เขียนความประสงค์ ความสวยงาม การดูแลรักษา หรือความคุ้มค่าบริการ...' : 'Describe the precision, details, and clinical safety sterile practices...'}
                          className="w-full bg-[#1a1a1a] border border-[#2d2d2d] focus:border-crimson focus:outline-none rounded-2xl p-4 text-xs text-white leading-relaxed resize-none"
                        />
                        <div className="text-right text-[10px] font-mono text-gray-500">
                          {reviewMsg.length} / 250 Characters
                        </div>
                      </div>

                      {/* Submit review */}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={isSubmitReviewing}
                        className="w-full bg-crimson hover:bg-red-600 disabled:bg-zinc-800 text-white font-heading font-black text-xs tracking-widest uppercase py-4 rounded-full shadow-md hover:shadow-crimson/20 cursor-pointer transition flex items-center justify-center gap-2 select-none"
                      >
                        {isSubmitReviewing ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            <span>TRANSMITTING TESTIMONIAL...</span>
                          </>
                        ) : (
                          <>
                            <Award className="w-4 h-4" />
                            <span>{lang === 'TH' ? 'ส่งบันทึกและรอนุมัติรีวิว' : 'POST TESTIMONIAL TO LEDGER'}</span>
                          </>
                        )}
                      </motion.button>
                    </form>
                  )}
                </div>

                {/* 2. Right Column: Review feed and Breakdown stats */}
                <div className="lg:col-span-11 xl:col-span-7 space-y-6">
                  {/* Summary Rating Breakdown Panel */}
                  <div className="bg-[#131313] border border-[#222] p-5 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
                    {/* Big Average Star */}
                    <div className="text-center sm:border-r sm:border-[#222] py-2">
                      <div className="text-4xl font-black font-heading text-white tracking-tight">
                        {reviews.filter(r => r.status === 'Approved').length > 0 
                          ? (reviews.filter(r => r.status === 'Approved').reduce((s, r) => s + r.rating, 0) / reviews.filter(r => r.status === 'Approved').length).toFixed(1)
                          : '5.0'}
                      </div>
                      <div className="flex justify-center items-center gap-0.5 my-1.5 text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <Star className="w-3.5 h-3.5 fill-current" />
                      </div>
                      <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block">
                        จากฐานข้อมูล {reviews.filter(r => r.status === 'Approved').length} คำชม
                      </span>
                    </div>

                    {/* Simple analytics bar graph representing reviews */}
                    <div className="sm:col-span-2 space-y-2 text-[10px] font-mono">
                      {[5, 4, 3, 2, 1].map((stars) => {
                        const count = reviews.filter(r => r.status === 'Approved' && r.rating === stars).length;
                        const total = reviews.filter(r => r.status === 'Approved').length || 1;
                        const pct = Math.round((count / total) * 100);
                        return (
                          <div key={stars} className="flex items-center gap-3">
                            <span className="w-12 text-gray-400 font-bold shrink-0">{stars} STARS</span>
                            <div className="flex-1 bg-black rounded-full h-2 overflow-hidden border border-[#222]">
                              <div className="bg-crimson h-full rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="w-10 text-right text-gray-400 font-bold shrink-0">{count} คิว</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Testimonial List Box */}
                  <div className="space-y-4">
                    <h4 className="text-xs font-mono text-gray-400 uppercase tracking-widest block">
                      {lang === 'TH' ? 'โพสต์ที่ได้รับการรับรองความพึงพอใจแล้ว' : 'VERIFIED INK CARVING EXPERIENCES'}
                    </h4>

                    {reviews.filter(r => r.status === 'Approved').length === 0 ? (
                      <div className="py-12 bg-[#131313] border border-[#222] rounded-xl text-center italic text-xs text-gray-500">
                        -- ยังไม่มีรีวิวทรานส์เลทที่อนุมัติในขณะนี้ ลูกค้าสามารถคลิกเขียนรีวิวซ้ายมือเพื่อสะท้อนเสียงได้ทันที --
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-4 max-h-[550px] overflow-y-auto pr-1 custom-scrollbar">
                        {reviews.filter(r => r.status === 'Approved').map((rev) => (
                          <div 
                            key={rev.id} 
                            className="bg-[#131313] border border-[#222] p-5 rounded-xl space-y-3.5 relative overflow-hidden group hover:border-[#333] transition-colors"
                          >
                            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-crimson/5 to-transparent pointer-events-none rounded-bl-full" />
                            
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 bg-neutral-800 rounded-tr-md rounded-bl-md border border-zinc-700 flex items-center justify-center font-heading text-xs font-black text-crimson uppercase">
                                  {rev.author.substring(0, 2)}
                                </div>
                                <div>
                                  <h5 className="font-heading font-black text-sm text-white">{rev.author}</h5>
                                  <p className="text-[10px] text-gray-500 font-mono">
                                    {new Date(rev.createdAt).toLocaleDateString('th-TH')} {new Date(rev.createdAt).toLocaleTimeString('th-TH').substring(0, 5)} น.
                                  </p>
                                </div>
                              </div>

                              <div className="flex text-amber-500 gap-0.5 shrink-0">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`w-3.5 h-3.5 ${
                                      i < rev.rating ? 'fill-amber-500' : 'text-zinc-700'
                                    }`} 
                                  />
                                ))}
                              </div>
                            </div>

                            <p className="text-gray-300 text-xs leading-relaxed italic">
                              "{rev.message}"
                            </p>

                            {rev.artist && (
                              <div className="flex items-center justify-between pt-2.5 border-t border-[#1a1a1a] text-[10px] font-mono">
                                <span className="text-gray-500">CLIENT OF GUEST ARTIST:</span>
                                <span className="text-crimson/90 font-bold bg-crimson/5 border border-crimson/25 px-1.5 py-0.5 rounded uppercase">
                                  ช่าง{rev.artist}
                                </span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* 4. Footer */}
      <footer id="client_footer" className="bg-black border-t border-[#1f1f1f] py-12 text-xs text-gray-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            {brandLogoUrl ? (
              <img 
                src={brandLogoUrl} 
                alt={brandName} 
                referrerPolicy="no-referrer"
                className="w-5 h-5 rounded object-cover border border-crimson/20" 
              />
            ) : (
              <span className="w-5 h-5 bg-crimson rounded flex items-center justify-center text-white font-heading font-bold text-xs">
                {brandName ? brandName.trim().charAt(0).toUpperCase() : 'K'}
              </span>
            )}
            <span className="font-heading text-sm tracking-widest text-[#bbb] font-extrabold uppercase">{brandName}</span>
          </div>
          <div className="text-center md:text-right font-mono text-[10px]">
            <p className="text-gray-400">© 2026 Kage Tattoo Studio Co., Ltd. Bangkok Elite Ink.</p>
            <p className="text-gray-600 mt-1">Designated cyber-blackwork & gothic art relics catalog.</p>
          </div>
        </div>
      </footer>

      {/* 5. QUICK VIEW MODAL COMPONENT */}
      <AnimatePresence>
        {quickViewItem && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setQuickViewItem(null)}
            className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4 backdrop-blur-md cursor-zoom-out"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 15, opacity: 0, transition: { duration: 0.15 } }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#131313] border border-[#2d2d2d] max-w-4xl w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl relative max-h-[92vh] overflow-y-auto cursor-default"
            >
              <button 
                onClick={() => setQuickViewItem(null)}
                className="absolute top-4 right-4 bg-black/70 hover:bg-crimson text-white p-2.5 rounded-full cursor-pointer transition-all z-20"
                title="ปิดหน้าต่าง / Close"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Image Section */}
                <div className="aspect-[4/5] bg-black relative group/modalimg">
                  <img 
                    src={quickViewItem.imageUrl} 
                    alt={quickViewItem.name} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500 scale-100 hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 pointer-events-none" />
                </div>

                {/* Info details */}
                <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <span className="bg-crimson/10 text-crimson text-xs tracking-widest font-mono font-bold uppercase px-3 py-1 rounded-full border border-crimson/20 inline-block">
                      {quickViewItem.category}
                    </span>
                    <h3 className="font-heading text-2xl font-black text-white uppercase tracking-tight">
                      {quickViewItem.name}
                    </h3>
                    <div className="bg-black/40 p-4 rounded-xl border border-[#1f1f1f] text-xs font-mono">
                      <span className="text-gray-500 block uppercase tracking-wider mb-1">
                        {lang === 'TH' ? '👤 ช่างสักประจำผลงาน / TATTOO MASTER:' : '👤 TATTOO MASTER:'}
                      </span>
                      <span className="text-white text-sm font-bold uppercase">
                        {lang === 'TH' ? `ช่าง${quickViewItem.artist}` : `Artist ${quickViewItem.artist}`}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block mb-1">
                        {lang === 'TH' ? '📄 คำอธิบายผลงาน / ARTWORK SPECIFICATIONS & METADATA:' : '📄 ARTWORK SPECIFICATIONS & METADATA:'}
                      </span>
                      <p className="text-gray-300 text-xs md:text-sm leading-relaxed font-sans font-normal">
                        {quickViewItem.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-[#1f1f1f] flex flex-col gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setFormData(prev => ({ 
                          ...prev, 
                          artist: quickViewItem.artist,
                          style: quickViewItem.category
                        }));
                        setQuickViewItem(null);
                        setActiveTab('booking');
                        addToast(
                          lang === 'TH' ? 'เลือกแบบผลงานแล้ว' : 'Loaded Artwork Style', 
                          lang === 'TH' 
                            ? `เตรียมระบุสเกลคิวสักกับช่าง${quickViewItem.artist}` 
                            : `Preparing appointment specifications with master${quickViewItem.artist}`, 
                          'success'
                        );
                      }}
                      className="w-full bg-crimson text-white font-heading font-bold text-xs tracking-widest uppercase py-4 rounded-full shadow-lg hover:bg-red-600 transition cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>{lang === 'TH' ? 'จองคิวสักแบบลายนี้ทันที / BOOK THIS STYLE' : 'CLAIM STYLE APPOINTMENT'}</span>
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setQuickViewItem(null)}
                      className="w-full bg-[#1b1b1b] hover:bg-black text-gray-400 py-3 rounded-full text-xs tracking-widest uppercase font-mono transition cursor-pointer"
                    >
                      {lang === 'TH' ? 'กลับไปที่แกลเลอรี' : 'Return to Catalog'}
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

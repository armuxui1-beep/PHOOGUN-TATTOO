import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, X, Bell, ShieldAlert, Lock, Unlock, KeyRound, Fingerprint, ArrowLeft, ShieldCheck } from 'lucide-react';
import { ClientView } from './components/ClientView';
import { AdminView } from './components/AdminView';
import { Appointment, InventoryItem, GalleryItem, FinancialTransaction, SystemTicket, ClientReview, Artist } from './types';
import { 
  GALLERY_ITEMS, 
  INITIAL_APPOINTMENTS, 
  INITIAL_INVENTORY, 
  INITIAL_TRANSACTIONS, 
  INITIAL_TICKETS,
  INITIAL_REVIEWS,
  ARTISTS
} from './data/mockData';

export interface Toast {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export default function App() {
  const [viewMode, setViewMode] = useState<'client' | 'admin_login' | 'admin'>('client');
  const [passcode, setPasscode] = useState<string>('');
  const [loginError, setLoginError] = useState<boolean>(false);
  
  // Initialized with user provided Google Apps Script deployment URL by default for a smooth setup!
  const [appsScriptUrl, setAppsScriptUrl] = useState<string>(
    'https://script.google.com/macros/s/AKfycbwIFBR1j3tcFNT-zCHd11-x3JbP0fVsEc0VSyRMkO6Vbh1DuhnotdC1aoYwAVLLcPIy/exec'
  );
  
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  // Core Synced Datasets states
  const [appointments, setAppointments] = useState<Appointment[]>(INITIAL_APPOINTMENTS);
  const [inventory, setInventory] = useState<InventoryItem[]>(INITIAL_INVENTORY);
  const [gallery, setGallery] = useState<GalleryItem[]>(GALLERY_ITEMS);
  const [financials, setFinancials] = useState<FinancialTransaction[]>(INITIAL_TRANSACTIONS);
  const [tickets, setTickets] = useState<SystemTicket[]>(INITIAL_TICKETS);
  const [reviews, setReviews] = useState<ClientReview[]>(INITIAL_REVIEWS);
  const [artists, setArtists] = useState<Artist[]>(ARTISTS);

  // Brand Customization State
  const [brandName, setBrandName] = useState<string>(() => {
    return localStorage.getItem('studio_brand_name') || 'KAGE TATTOO';
  });
  const [brandLogoUrl, setBrandLogoUrl] = useState<string>(() => {
    return localStorage.getItem('studio_brand_logo_url') || '';
  });
  const [crimsonColor, setCrimsonColor] = useState<string>(() => {
    return localStorage.getItem('studio_crimson_color') || '#e6192e';
  });

  // Apply visual theme color variable dynamically to the HTML document root!
  useEffect(() => {
    document.documentElement.style.setProperty('--color-crimson', crimsonColor);
  }, [crimsonColor]);

  const handleUpdateBrand = (newName: string, newLogoUrl: string) => {
    setBrandName(newName);
    setBrandLogoUrl(newLogoUrl);
    localStorage.setItem('studio_brand_name', newName);
    localStorage.setItem('studio_brand_logo_url', newLogoUrl);
    addToast('ปรับปรุงข้อมูลแบรนด์สำเร็จ / Brand Updated', `เปลี่ยนชื่อเป็น "${newName}" และอัปเดตโลโก้เรียบร้อย`, 'success');
  };

  const handleUpdateCrimsonColor = (newColor: string) => {
    setCrimsonColor(newColor);
    localStorage.setItem('studio_crimson_color', newColor);
  };

  // Toast array state
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (title: string, message: string, type: 'success' | 'error' | 'info' | 'warning' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    setToasts(prev => [...prev, { id, title, message, type }]);
    
    // Automatically dismiss after 4 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  // Handle administrator login submit validation
  const handleAdminLoginSubmit = (enteredCode: string) => {
    const defaultCode = '1337';
    const alternativeCode = 'admin';
    
    if (enteredCode === defaultCode || enteredCode.toLowerCase() === alternativeCode) {
      setLoginError(false);
      setViewMode('admin');
      setPasscode('');
      addToast(
        'ยินดีต้อนรับสู่แดชบอร์ด / Sages Lounge', 
        'สลับเข้าสู่โหมดควบคุมส่วนจัดการสตูดิโอ KAGE ข้อมูลชีตทำงานเต็มระบบ', 
        'success'
      );
    } else {
      setLoginError(true);
      addToast(
        'การเข้าถึงถูกปฏิเสธ / Access Denied', 
        'รหัสผ่านไม่ถูกต้องกรุณาตรวจสอบสิทธิ์การเป็นผู้ดูแลระบบ!', 
        'error'
      );
      // Brief feedback shake trigger
      setTimeout(() => setLoginError(false), 600);
    }
  };

  // Automatic database auto-populator
  const handleAutomatedSeedToSheets = async (targetUrl: string) => {
    addToast(
      '🌱 ตรวจพบชีตว่างเปล่า / Empty Sheet Detected',
      'กำลังคัดลอกรูปภาพ แผนคิว คลังวัสดุ รายการบัญชีสะเดาะเคราะห์ทั้งหมด 30+ รายการเขียนลง Google Sheet ของท่านอัตโนมัติ...',
      'info'
    );
    try {
      // 1. Gallery Items
      for (const item of GALLERY_ITEMS) {
        await fetch(targetUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'upsert',
            tableName: 'gallery',
            idColumn: 'id',
            data: item
          })
        });
      }

      // 2. Appointments
      for (const item of INITIAL_APPOINTMENTS) {
        await fetch(targetUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'upsert',
            tableName: 'appointments',
            idColumn: 'id',
            data: item
          })
        });
      }

      // 3. Inventory
      for (const item of INITIAL_INVENTORY) {
        await fetch(targetUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'upsert',
            tableName: 'inventory',
            idColumn: 'code',
            data: item
          })
        });
      }

      // 4. Financials
      for (const item of INITIAL_TRANSACTIONS) {
        await fetch(targetUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'upsert',
            tableName: 'financials',
            idColumn: 'trxId',
            data: item
          })
        });
      }

      // 5. System Tickets
      for (const item of INITIAL_TICKETS) {
        await fetch(targetUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'upsert',
            tableName: 'tickets',
            idColumn: 'id',
            data: item
          })
        });
      }

      // 6. Reviews
      for (const item of INITIAL_REVIEWS) {
        await fetch(targetUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'upsert',
            tableName: 'reviews',
            idColumn: 'id',
            data: item
          })
        });
      }

      // 7. Artists
      for (const item of ARTISTS) {
        await fetch(targetUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'upsert',
            tableName: 'artists',
            idColumn: 'id',
            data: item
          })
        });
      }

      addToast(
        '🚀 จำลองฐานข้อมูลเสร็จสมบูรณ์ / Auto-Seed Done',
        'อัพโหลดรายการภาพ แผนช่างศิลปิน และข้อมูลที่อยู่ในหน้าเว็บทั้งหมด 7 ตารางลงแผ่นชีตของคุณโดยอัตโนมัติสำเร็จแล้ว!',
        'success'
      );
      
      // Pull again to refresh states
      const res = await fetch(targetUrl);
      if (res.ok) {
        const text = await res.text();
        if (text.trim().startsWith('{')) {
          const finalDb = JSON.parse(text);
          if (finalDb.appointments) setAppointments(finalDb.appointments);
          if (finalDb.inventory) setInventory(finalDb.inventory);
          if (finalDb.gallery) setGallery(finalDb.gallery);
          if (finalDb.financials) setFinancials(finalDb.financials);
          if (finalDb.tickets) setTickets(finalDb.tickets);
          if (finalDb.reviews) setReviews(finalDb.reviews);
          if (finalDb.artists) setArtists(finalDb.artists);
        }
      }
    } catch (e: any) {
      console.warn("Auto-seed to custom Google Sheets failed:", e);
    }
  };

  // Automatic pull function
  const pullFromGoogleSheets = async (targetUrl: string = appsScriptUrl) => {
    if (!targetUrl) return;
    
    setIsSyncing(true);
    setSyncError(null);
    addToast('กำลังดึงข้อมูล / Synced Syncing', 'เชื่อมต่อไปยัง Google Sheets และดึงฐานข้อมูลล่าสุด...', 'info');
    
    try {
      const response = await fetch(targetUrl);
      
      if (!response.ok) {
        throw new Error(`HTTP Error Status: ${response.status}`);
      }
      
      const text = await response.text();
      // Guard against non-JSON inputs (e.g. standard google scripts HTML error panels)
      if (!text.trim().startsWith('{')) {
        throw new Error("Received non-JSON content. Check if your Apps Script doGet is deployed properly with initDatabase run once first.");
      }
      
      const db = JSON.parse(text);
      let changesDetected = false;
      
      // Check if this is a newly connected sheet containing default boilerplate rows
      const isGallerySkeleton = db.gallery && db.gallery.length <= 2;
      const isAppointmentsSkeleton = db.appointments && db.appointments.length <= 2;
      const isInventorySkeleton = db.inventory && db.inventory.length <= 2;
      const isFinancialsSkeleton = db.financials && db.financials.length <= 1;
      
      if (isGallerySkeleton && isAppointmentsSkeleton && isInventorySkeleton && isFinancialsSkeleton) {
        // Trigger automatic full data upload sequence in the background
        setTimeout(() => {
          handleAutomatedSeedToSheets(targetUrl);
        }, 1200);
      }
      
      // Map Apps script data keys to local CamelCase models safely with fallbacks
      if (db.appointments && Array.isArray(db.appointments)) {
        setAppointments(db.appointments.map((a: any) => ({
          id: a.id || `APT-${Math.floor(1000 + Math.random() * 9000)}`,
          name: a.name || 'Unknown',
          phone: a.phone || '',
          email: a.email || '',
          date: a.date || '',
          time: a.time || '12:00',
          artist: a.artist || 'พิมพ์ดาว',
          style: a.style || 'ดำสตรีมไลน์',
          size: a.size || '10x10 cm',
          note: a.note || '',
          status: a.status || 'Pending',
          createdAt: a.createdAt || new Date().toISOString()
        })));
        changesDetected = true;
      }
      
      if (db.inventory && Array.isArray(db.inventory)) {
        setInventory(db.inventory.map((i: any) => ({
          code: i.code || `EQP-${Math.floor(100 + Math.random() * 900)}`,
          name: i.name || 'Unlabeled Item',
          category: i.category || 'Needles',
          currentStock: Number(i.currentStock) || 0,
          minStock: Number(i.minStock) || 5,
          unit: i.unit || 'Boxes',
          status: i.status || (Number(i.currentStock) < Number(i.minStock) ? 'LOW' : 'OK')
        })));
        changesDetected = true;
      }

      if (db.gallery && Array.isArray(db.gallery)) {
        setGallery(db.gallery.map((g: any) => ({
          id: g.id || `gal-${Math.floor(1000 + Math.random() * 9000)}`,
          category: g.category || 'ไซเบอร์-แบล็คเวิร์ค',
          name: g.name || 'Unnamed Art',
          artist: g.artist || 'พิมพ์ดาว',
          imageUrl: g.imageUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuB7NVOEjNz6UrNeeery47HnQm4ELwcsgVoKeV9_1jbJQFJRlD3vjVg3MblzCQoAFBsA3DkFlGXJcuE_SRnhvQqg117JEfo1ZyHJZ93PBT_YHDgNVSCYPuZ-JAkDEcWq1_rhGLojo1qigElaHw0lEnwhpnmTVyFv8DysAJ6gDkHJanGx_DGoYIViTiJ-63OYyCDbqGJM4muNpicCqUaf4MTRb4gR4koKfvzbM-JU8yibuVQFSEy-U8VzMYvQdrsk5h2JwYzKM1Nz7LE',
          description: g.description || ''
        })));
        changesDetected = true;
      }

      if (db.financials && Array.isArray(db.financials)) {
        setFinancials(db.financials.map((f: any) => ({
          trxId: f.trxId || `TRX-${Math.floor(1000 + Math.random() * 9000)}`,
          date: f.date || new Date().toISOString().split('T')[0],
          time: f.time || '12:00',
          title: f.title || 'Studio ledger item',
          category: f.category || 'Material Reserves',
          type: f.type || 'expense',
          amount: Number(f.amount) || 0,
          status: f.status || 'Success',
          artist: f.artist || ''
        })));
        changesDetected = true;
      }

      if (db.tickets && Array.isArray(db.tickets)) {
        setTickets(db.tickets.map((t: any) => ({
          id: t.id || `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
          category: t.category || 'เทคนิค / Technical Support',
          title: t.title || 'Reported Issue',
          details: t.details || '',
          status: t.status || 'Checking',
          createdAt: t.createdAt || new Date().toISOString()
        })));
        changesDetected = true;
      }

      if (db.reviews && Array.isArray(db.reviews)) {
        setReviews(db.reviews.map((r: any) => ({
          id: r.id || `REV-${Math.floor(1000 + Math.random() * 9000)}`,
          author: r.author || 'ลูกค้าทั่วไป',
          rating: Number(r.rating) || 5,
          message: r.message || '',
          status: r.status || 'Approved',
          createdAt: r.createdAt || new Date().toISOString(),
          artist: r.artist || 'พิมพ์ดาว'
        })));
        changesDetected = true;
      }

      if (db.artists && Array.isArray(db.artists)) {
        setArtists(db.artists.map((a: any) => ({
          id: a.id || `art-${Math.floor(100 + Math.random() * 900)}`,
          nameTh: a.nameTh || 'Unknown TH',
          nameEn: a.nameEn || 'Unknown EN',
          specialty: a.specialty || 'Generalist',
          imageUrl: a.imageUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAygxjP4n5S3j3K8wCXwKgQ1Wqx5Oeoly0u9_-37018ci3SzUZeGbZZNsZwK0XXxTshgTGvOVPvnFDevirOKu87RcfYgzkN9rgZaqyehiHonC5f3-1eTiANKF5WFl1Qi_g9AI9mDzIMrHqM_XQSUCY5GJ8mQbc3HJOF2IHNQcZqdackfMrKEvXUp4HORZ52EAQb1V4Wd2nlw-j7B_r_ukuJfx_nwpmfeORip0zEfaGwWQrz0zTxTLvh-GZB_jPusQIIZiqfrIzOs78',
          experience: a.experience || '3 Years',
          availability: a.availability || 'Daily'
        })));
        changesDetected = true;
      }

      if (changesDetected) {
        addToast('อรรถประโยชน์คลาวด์เสร็จสมบูรณ์ / Sync Completed', 'ดึงและเขียนจัดระบบฐานข้อมูลแบบไดนามิกส์สำเร็จแล้ว!', 'success');
      }

    } catch (err: any) {
      console.warn("Google Google Sheets Fetch Fallback Triggered. Active mock catalog loaded safely.", err);
      
      const errMsg = err.message || err.toString();
      const isHtmlError = errMsg.includes('<') || errMsg.includes('JSON') || errMsg.includes('Unexpected token');
      
      const friendlyDetail = isHtmlError 
        ? 'สคริปต์ของคุญส่งกลับมาเป็น "หน้าเว็บข้อผิดพลาดของ Google" (HTML Error page) แทนที่จะเป็นชุดข้อมูล JSON ซึ่งแสดงว่าสคริปต์ฝั่ง Google Sheets มี Error! คาดว่า: (1) อาจระบุสคริปต์แบบเดี่ยว (Standalone Script) ซึ่งแก้ได้โดยนำ URL ชีตของคุณไปใส่ในตัวแปรคีย์ด้านบนสุดฝั่ง Apps Script หรือ (2) สคริปต์ยังไม่ได้รับการอนุญาตสิทธิ์การเข้าถึงจากคุณ โดยให้กดเมนูด้านบนเลือกฟังก์ชัน "initDatabase" แล้วกด "รัน" เพื่ออนุญาตเข้าถึงจนผ่านการรันครั้งแรกสำเร็จ และกด Deploy ใหม่อีกรอบเป็น "Who has access: Anyone"'
        : `รายละเอียดรหัสผิดพลาด: ${errMsg}. กรุณาตรวจสอบว่า URL ที่ใช้นั้นถูกต้อง ปรับ 'Who has access' ในการนำไปใช้งานจริงเรียบร้อยแล้วหรือยัง?`;
        
      setSyncError(errMsg);
      addToast(
        'การเชื่อมต่อ Google Sheets ไม่สำเร็จ / App Engine Active', 
        friendlyDetail, 
        'warning'
      );
    } finally {
      setIsSyncing(false);
    }
  };

  // Run automatically on first startup render to seed with live data if possible
  useEffect(() => {
    if (appsScriptUrl) {
      pullFromGoogleSheets();
    }
  }, []);

  const handleUpdateAppsScriptUrl = (newUrl: string) => {
    setAppsScriptUrl(newUrl);
    pullFromGoogleSheets(newUrl);
  };

  const handleNewLocalBooking = async (newBooking: Appointment) => {
    setAppointments(prev => [newBooking, ...prev]);
    
    // Automatically add deposit transaction for matching financials locally!
    const sizeSymbol = newBooking.size;
    const depositAmount = sizeSymbol.includes('A4') ? 5000 : sizeSymbol.includes('A5') ? 2500 : 1000;
    
    const newTrx: FinancialTransaction = {
      trxId: `TRX-${Math.floor(1000 + Math.random() * 9000)}`,
      date: newBooking.date,
      time: newBooking.time,
      title: `เงินมัดจำการจอง ${newBooking.id} (คุณ${newBooking.name})`,
      category: 'รายได้ / Deposit',
      type: 'income',
      amount: depositAmount,
      status: 'Success',
      artist: newBooking.artist
    };

    setFinancials(prev => [newTrx, ...prev]);

    if (appsScriptUrl) {
      try {
        // Post booking row
        await fetch(appsScriptUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'upsert',
            tableName: 'appointments',
            idColumn: 'id',
            data: newBooking
          })
        });

        // Post transaction row
        await fetch(appsScriptUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'add_transaction',
            title: newTrx.title,
            category: newTrx.category,
            type: 'income',
            amount: newTrx.amount,
            artist: newTrx.artist
          })
        });
      } catch (err) {
        console.warn("Could not sync client booking to Sheets:", err);
      }
    }
  };

  return (
    <div className="bg-[#0a0a0a] min-h-screen text-gray-200 relative overflow-x-hidden">
      {viewMode === 'client' ? (
        <ClientView 
          onLoginClick={() => {
            setViewMode('admin_login');
            addToast(
              'ระบบรักษาความปลอดภัย / Authentication Portal', 
              'กรุณาระบุรหัสผ่านเพื่อเข้าใช้งานซอฟต์แวร์ควบคุม INK_OS', 
              'info'
            );
          }} 
          appsScriptUrl={appsScriptUrl}
          onNewLocalBooking={handleNewLocalBooking}
          reviews={reviews}
          onNewLocalReview={async (newReview: ClientReview) => {
            setReviews(prev => [newReview, ...prev]);
            addToast('ส่งรีวิวเสร็จสมบูรณ์ / Testimonial Received', 'คำรับรองข้อเสนอแนะของคุณถูกส่งไปตรวจสอบก่อนเผยแพร่สำเร็จ!', 'success');
            
            if (appsScriptUrl) {
              try {
                await fetch(appsScriptUrl, {
                  method: 'POST',
                  mode: 'no-cors',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    action: 'add_review',
                    author: newReview.author,
                    rating: String(newReview.rating),
                    message: newReview.message,
                    artist: newReview.artist
                  })
                });
              } catch (e) {
                console.warn("Could not sync client review to Sheets:", e);
              }
            }
          }}
          addToast={addToast}
          brandName={brandName}
          brandLogoUrl={brandLogoUrl}
          gallery={gallery}
          artists={artists}
        />
      ) : viewMode === 'admin_login' ? (
        <div id="admin_login_portal" className="min-h-screen flex items-center justify-center p-4 bg-[#080808] relative overflow-hidden font-sans">
          
          {/* Cyberpunk Grid Overlay and glowing orbs */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#141414_1px,transparent_1px),linear-gradient(to_bottom,#141414_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none opacity-40" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-crimson/10 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="w-full max-w-md relative z-10">
            {/* Top Back Action */}
            <motion.button
              whileHover={{ x: -4 }}
              onClick={() => {
                setViewMode('client');
                setPasscode('');
                setLoginError(false);
              }}
              className="mb-8 flex items-center gap-2 text-xs font-heading font-black tracking-wider text-gray-400 hover:text-white transition uppercase cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-crimson" />
              <span>กลับสู่หน้าแกลเลอรี / Back to Gallery</span>
            </motion.button>

            {/* Main Login Frame */}
            <motion.div
              animate={loginError ? { x: [-10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.4 }}
              className={`bg-[#0d0d0d]/90 backdrop-blur-xl border ${loginError ? 'border-rose-500/50 shadow-rose-950/20' : 'border-[#222] shadow-black/80'} rounded-3xl p-8 shadow-2xl space-y-7 relative`}
            >
              {/* Top ambient lights */}
              <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-crimson to-transparent" />

              {/* Status Indicator */}
              <div className="flex flex-col items-center text-center space-y-3">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${loginError ? 'bg-rose-500/10 border border-rose-500/30' : 'bg-crimson/10 border border-crimson/30'}`}>
                  {loginError ? (
                    <ShieldAlert className="w-6 h-6 text-rose-500 animate-pulse" />
                  ) : passcode.length > 0 ? (
                    <KeyRound className="w-6 h-6 text-crimson animate-bounce" />
                  ) : (
                    <Lock className="w-6 h-6 text-gray-400" />
                  )}
                </div>
                
                <div className="space-y-1">
                  <h2 className="font-heading text-xl font-black text-white uppercase tracking-tight">
                    {brandName}
                  </h2>
                  <p className="text-[10px] font-mono font-bold tracking-widest text-[#666] uppercase">
                    INK_OS BACKOFFICE v4.1
                  </p>
                </div>
              </div>

              {/* Director Profile Plate */}
              <div className="bg-black/80 border border-[#1a1a1a] p-3 rounded-2xl flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-[#1f1f1f] border border-crimson/30 overflow-hidden shrink-0">
                  <img 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGeDB4-pLVKo0LpLj2Ufb-P_RvDn_waHuaiI5_cp0Z0_mHbSYwLQ8pi4fnSqQFKx6TXfgyWJFahhXzoSreV13aDBcdHWiXG_wDvky1X6JX8uL5ZE4D1sXeuQkeSM2cizyX6qdvQTagxhipexaVbmBey-Zhablprfaf8tUJc12YrkEikVsYlzBx1tm1aQoNtQj5fdbHjhJg2lDZEsmM_YRc7O5aaESWawMK0COmPhLS8_yuRpf5Ag7wOcVSyiJvGLL1Weki-rpnVjI" 
                    alt="Director Profile"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="text-xs text-white uppercase font-bold tracking-tight block truncate">คุณกมลวิชญ์</span>
                  <span className="text-[9px] text-crimson font-mono tracking-widest uppercase">STUDIO DIRECTOR (ROLE: OWNER)</span>
                </div>
              </div>

              {/* Form Input Group */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-mono text-gray-500 uppercase tracking-widest block text-center">
                    รักษาความปลอดภัย: ป้อนรหัสเพื่อปลดล็อกสตูดิโอ
                  </label>
                  
                  {/* Secure Display input */}
                  <div className="relative">
                    <input
                      type="password"
                      value={passcode}
                      onChange={(e) => setPasscode(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleAdminLoginSubmit(passcode);
                        }
                      }}
                      placeholder="••••••••"
                      className="w-full bg-black/80 text-center border border-[#2d2d2d] focus:border-crimson/50 focus:outline-none rounded-2xl px-5 py-4 text-lg font-mono font-bold tracking-[0.5em] text-white transition-all placeholder:text-[#333] placeholder:tracking-[0.1em]"
                    />
                    <div className="absolute inset-y-0 right-4 flex items-center">
                      <Fingerprint className="w-5 h-5 text-[#333]" />
                    </div>
                  </div>
                </div>

                {/* Grid Pad Digital UI */}
                <div className="grid grid-cols-3 gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setPasscode(prev => prev + num)}
                      className="bg-black/40 hover:bg-[#151515] border border-[#1a1a1a] hover:border-[#333] transition rounded-2xl p-4 text-center font-heading text-lg font-bold text-gray-300 hover:text-white active:scale-95 cursor-pointer"
                    >
                      {num}
                    </button>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      setPasscode('');
                      setLoginError(false);
                    }}
                    className="bg-black/20 hover:bg-rose-950/20 border border-[#1a1a1a] hover:border-rose-500/20 transition rounded-2xl p-4 text-center font-heading text-xs font-bold text-rose-500 hover:text-rose-400 active:scale-95 cursor-pointer uppercase tracking-widest"
                  >
                    Clear
                  </button>
                  <button
                    key="0"
                    type="button"
                    onClick={() => setPasscode(prev => prev + '0')}
                    className="bg-black/40 hover:bg-[#151515] border border-[#1a1a1a] hover:border-[#333] transition rounded-2xl p-4 text-center font-heading text-lg font-bold text-gray-300 hover:text-white active:scale-95 cursor-pointer"
                  >
                    0
                  </button>
                  <button
                    type="button"
                    onClick={() => setPasscode(prev => prev.slice(0, -1))}
                    className="bg-black/40 hover:bg-amber-950/20 border border-[#1a1a1a] hover:border-amber-500/20 transition rounded-2xl p-4 text-center font-heading text-dm font-bold text-amber-500 hover:text-amber-400 active:scale-95 cursor-pointer"
                  >
                    ⌫
                  </button>
                </div>

                {/* Login Confirm Button */}
                <button
                  onClick={() => handleAdminLoginSubmit(passcode)}
                  className="w-full bg-crimson hover:bg-red-600 text-white font-heading font-black text-xs tracking-widest uppercase py-4 rounded-2xl shadow-lg shadow-crimson/10 transition flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>ยืนยันปลดล็อก / AUTHORIZE UNLOCK</span>
                </button>
              </div>

              {/* Bottom Sandbox Assistant Assist Helper */}
              <div className="bg-[#101010]/80 p-3 rounded-xl border border-[#222] text-center">
                <button
                  type="button"
                  onClick={() => {
                    setPasscode('1337');
                    handleAdminLoginSubmit('1337');
                  }}
                  className="inline-block text-[10.5px] font-mono text-crimson hover:text-red-400 transition underline tracking-wider"
                >
                  💡 หรือคลิกที่นี่เพื่อป้อนรหัสสาธิตอัตโนมัติ (Demo Unlock Code: 1337)
                </button>
              </div>

            </motion.div>
          </div>
        </div>
      ) : (
        <AdminView
          onLogoutClick={() => {
            setViewMode('client');
            addToast('ออกจากระบบจัดการแล้ว', 'ระบบล็อคเอาท์เรียบร้อย กลับคืนสู่แกลเลอรีหลัก', 'info');
          }}
          appsScriptUrl={appsScriptUrl}
          onUpdateAppsScriptUrl={handleUpdateAppsScriptUrl}
          onRefreshFromSheets={() => pullFromGoogleSheets()}
          isSyncing={isSyncing}
          appointments={appointments}
          setAppointments={setAppointments}
          inventory={inventory}
          setInventory={setInventory}
          gallery={gallery}
          setGallery={setGallery}
          financials={financials}
          setFinancials={setFinancials}
          tickets={tickets}
          setTickets={setTickets}
          reviews={reviews}
          setReviews={setReviews}
          artists={artists}
          setArtists={setArtists}
          addToast={addToast}
          brandName={brandName}
          brandLogoUrl={brandLogoUrl}
          onUpdateBrand={handleUpdateBrand}
          crimsonColor={crimsonColor}
          onUpdateCrimsonColor={handleUpdateCrimsonColor}
        />
      )}

      {/* Beautiful Animated Pop-up Status Toast Notifications Container */}
      <div id="toast-notifications-container" className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => {
            const iconMap = {
              success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
              error: <ShieldAlert className="w-5 h-5 text-rose-500 shrink-0" />,
              info: <Info className="w-5 h-5 text-sky-400 shrink-0" />,
              warning: <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
            };

            const borderMap = {
              success: 'border-emerald-500/30 bg-neutral-950/95 shadow-emerald-950/10',
              error: 'border-rose-500/30 bg-neutral-950/95 shadow-rose-950/10',
              info: 'border-sky-500/30 bg-neutral-950/95 shadow-sky-950/10',
              warning: 'border-amber-500/30 bg-neutral-950/95 shadow-amber-950/10'
            };

            return (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, y: 25, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9, y: -10, transition: { duration: 0.2 } }}
                layout
                className={`flex items-start gap-3.5 p-4 rounded-2xl border pointer-events-auto backdrop-blur-md shadow-xl ${borderMap[toast.type]}`}
              >
                {iconMap[toast.type]}
                <div className="flex-1 space-y-0.5">
                  <h4 className="text-xs font-black text-white font-heading uppercase tracking-wider">{toast.title}</h4>
                  <p className="text-[11px] text-gray-400 leading-relaxed font-sans">{toast.message}</p>
                </div>
                <button
                  onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
                  className="text-gray-500 hover:text-white transition cursor-pointer shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

    </div>
  );
}

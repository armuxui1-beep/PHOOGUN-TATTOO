import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Briefcase, Calendar, Package, TrendingUp, AlertTriangle, Shield, Check, X, 
  Search, Plus, HelpCircle, HardDrive, RefreshCw, Key, Database, Link, ArrowLeft, 
  DollarSign, Terminal, Settings, Copy, CheckCircle2, Award, FileText, Activity, Trash, User,
  Printer, Star, AlertCircle, ArrowUpDown, ArrowUp, ArrowDown
} from 'lucide-react';
import { Appointment, InventoryItem, GalleryItem, FinancialTransaction, SystemTicket, Artist, ClientReview } from '../types';
import { APPS_SCRIPT_GUIDE, APPS_SCRIPT_CODE } from '../utils/appsScriptCode';
import { 
  ARTISTS, GALLERY_ITEMS, INITIAL_APPOINTMENTS, INITIAL_INVENTORY, 
  INITIAL_TRANSACTIONS, INITIAL_TICKETS, INITIAL_REVIEWS 
} from '../data/mockData';
import { AnalyticsView } from './AnalyticsView';

interface AdminViewProps {
  onLogoutClick: () => void;
  appsScriptUrl: string;
  onUpdateAppsScriptUrl: (url: string) => void;
  onRefreshFromSheets: () => Promise<void>;
  isSyncing: boolean;

  // Real-time synced states
  appointments: Appointment[];
  setAppointments: React.Dispatch<React.SetStateAction<Appointment[]>>;
  inventory: InventoryItem[];
  setInventory: React.Dispatch<React.SetStateAction<InventoryItem[]>>;
  gallery: GalleryItem[];
  setGallery: React.Dispatch<React.SetStateAction<GalleryItem[]>>;
  financials: FinancialTransaction[];
  setFinancials: React.Dispatch<React.SetStateAction<FinancialTransaction[]>>;
  tickets: SystemTicket[];
  setTickets: React.Dispatch<React.SetStateAction<SystemTicket[]>>;
  reviews: ClientReview[];
  setReviews: React.Dispatch<React.SetStateAction<ClientReview[]>>;
  artists: Artist[];
  setArtists: React.Dispatch<React.SetStateAction<Artist[]>>;
  addToast: (title: string, message: string, type?: 'success' | 'error' | 'info' | 'warning') => void;

  // Brand brand Customization
  brandName?: string;
  brandLogoUrl?: string;
  onUpdateBrand?: (name: string, logoUrl: string) => void;
  crimsonColor?: string;
  onUpdateCrimsonColor?: (color: string) => void;
}

export const AdminView: React.FC<AdminViewProps> = ({
  onLogoutClick,
  appsScriptUrl,
  onUpdateAppsScriptUrl,
  onRefreshFromSheets,
  isSyncing,
  appointments,
  setAppointments,
  inventory,
  setInventory,
  gallery,
  setGallery,
  financials,
  setFinancials,
  tickets,
  setTickets,
  reviews,
  setReviews,
  artists,
  setArtists,
  addToast,
  brandName = 'KAGE TATTOO',
  brandLogoUrl = '',
  onUpdateBrand,
  crimsonColor = '#e6192e',
  onUpdateCrimsonColor
}) => {
  const [activeTab, setActiveTab] = useState<'dash' | 'appointments' | 'gallery' | 'warehouse' | 'financials' | 'support' | 'sheets' | 'reviews' | 'analytics' | 'brand' | 'artists'>('dash');
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedInstructions, setCopiedInstructions] = useState(false);

  // Brand Customization local input states
  const [inputBrandName, setInputBrandName] = useState(brandName);
  const [inputBrandLogoUrl, setInputBrandLogoUrl] = useState(brandLogoUrl);
  const [inputCrimsonColor, setInputCrimsonColor] = useState(crimsonColor);

  // New item creation states
  const [newGallery, setNewGallery] = useState({
    name: '',
    artist: 'พิมพ์ดาว',
    category: 'ไซเบอร์-แบล็คเวิร์ค',
    imageUrl: '',
    description: ''
  });
  const [newInventory, setNewInventory] = useState({
    code: '',
    name: '',
    category: 'Needles',
    currentStock: '10',
    minStock: '5',
    unit: 'Boxes'
  });
  const [newExpense, setNewExpense] = useState({
    title: '',
    category: 'ค่าวัสดุและหมึกสัก / Materials',
    amount: '',
    artist: ''
  });
  const [newTicket, setNewTicket] = useState({
    category: 'ปัญหาเทคนิค / Google Sheets Sync',
    title: '',
    details: ''
  });

  const [newArtist, setNewArtist] = useState({
    nameTh: '',
    nameEn: '',
    specialty: 'Black & Grey Master',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAygxjP4n5S3j3K8wCXwKgQ1Wqx5Oeoly0u9_-37018ci3SzUZeGbZZNsZwK0XXxTshgTGvOVPvnFDevirOKu87RcfYgzkN9rgZaqyehiHonC5f3-1eTiANKF5WFl1Qi_g9AI9mDzIMrHqM_XQSUCY5GJ8mQbc3HJOF2IHNQcZqdackfMrKEvXUp4HORZ52EAQb1V4Wd2nlw-j7B_r_ukuJfx_nwpmfeORip0zEfaGwWQrz0zTxTLvh-GZB_jPusQIIZiqfrIzOs78',
    experience: '5 Years',
    availability: 'Daily'
  });
  const [editingArtistId, setEditingArtistId] = useState<string | null>(null);
  const [editingArtistData, setEditingArtistData] = useState<Artist | null>(null);

  // Filters
  const [searchAppointment, setSearchAppointment] = useState('');
  const [searchInventory, setSearchInventory] = useState('');
  const [searchAdminGallery, setSearchAdminGallery] = useState('');
  const [stockSortOrder, setStockSortOrder] = useState<'asc' | 'desc' | 'none'>('none');
  const [dateSortOrder, setDateSortOrder] = useState<'asc' | 'desc' | 'none'>('none');

  // Version-Controlled API Bridge Sandbox state variables
  const [schemaTableName, setSchemaTableName] = useState('customer_subscriptions');
  const [schemaVersion, setSchemaVersion] = useState('1');
  const [schemaFields, setSchemaFields] = useState<Array<{ name: string; type: string }>>([
    { name: 'id', type: 'STRING' },
    { name: 'customer_name', type: 'STRING' },
    { name: 'tier', type: 'STRING' },
    { name: 'is_active', type: 'BOOLEAN' },
    { name: 'joined_date', type: 'DATETIME' }
  ]);
  const [newFieldName, setNewFieldName] = useState('');
  const [newFieldType, setNewFieldType] = useState('STRING');
  
  const [isSyncingSchema, setIsSyncingSchema] = useState(false);
  const [schemaSyncStatus, setSchemaSyncStatus] = useState<{
    status: 'success' | 'error' | 'idle';
    message: string;
    details?: any;
  }>({ status: 'idle', message: '' });

  // Database Schema Align & Sub-tab navigation
  const [sheetsSubTab, setSheetsSubTab] = useState<'config' | 'schema' | 'sandbox'>('config');
  const [isBulkSyncing, setIsBulkSyncing] = useState(false);
  const [bulkSyncResult, setBulkSyncResult] = useState<{
    status: 'idle' | 'running' | 'success' | 'error';
    logs: string[];
  }>({ status: 'idle', logs: [] });

  const [isSeedingMockData, setIsSeedingMockData] = useState(false);
  const [seedProgress, setSeedProgress] = useState<{
    status: 'idle' | 'running' | 'success' | 'error';
    logs: string[];
  }>({ status: 'idle', logs: [] });

  const handleSeedFullMockData = async () => {
    if (!appsScriptUrl) {
      addToast(
        'โปรดระบุ Google Apps Script URL / Missing App URL',
        'จำเป็นต้องระบุ URL ของ Web App ก่อนเซ็ตอัปรันข้อมูลขึ้นคลาวด์ชีต',
        'warning'
      );
      return;
    }

    if (!confirm('ยืนยันซิงค์และบันทึกข้อมูลทั้งหมดจากทั้ง 7 ตารางบนหน้าจอปัจจุบัน ไปเป็นข้อมูลเริ่มต้นใน Google Sheets ของคุณใช่หรือไม่?\n\n* ข้อมูลทั้งหมดรวมถึงสแตทล่าสุด ช่างสัก แกลเลอรี คิวงาน และคลังสินค้าจะได้รับการนำส่งรวดเดียวอย่างสมบูรณ์แบบ!')) {
      return;
    }

    setIsSeedingMockData(true);
    setSeedProgress({ status: 'running', logs: ['ดึงข้อมูลและเตรียมอัปโหลดฐานข้อมูลทั้ง 7 ตารางแอปพลิเคชัน...'] });

    const updatedLogs: string[] = [];
    const appendLog = (msg: string) => {
      updatedLogs.push(`[${new Date().toLocaleTimeString()}] ${msg}`);
      setSeedProgress({ status: 'running', logs: [...updatedLogs] });
    };

    try {
      appendLog('📡 เริ่มต้นเวทมนตร์อัปเดตข้อมูลขึ้น Cloud Spreadsheet (7-Table Screen State Synced)...');

      // 1. Gallery Items
      appendLog(`🖼️ [1/7] กำลังส่งข้อมูลแกลเลอรีรอยสักบนหน้าจอจำนวน ${gallery.length} ลายสัก...`);
      for (const item of gallery) {
        await fetch(appsScriptUrl, {
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
      appendLog(`✅ อัปโหลดแกลเลอรีทั้งหมด ${gallery.length} รายการเสร็จสิ้น!`);

      // 2. Appointments
      appendLog(`📅 [2/7] กำลังส่งคิวนัดหมายและตารางงานสักบนหน้าจอจำนวน ${appointments.length} คิว...`);
      for (const item of appointments) {
        await fetch(appsScriptUrl, {
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
      appendLog(`✅ อัปโหลดคิวจองงานสักทั้งหมด ${appointments.length} รายการเสร็จสิ้น!`);

      // 3. Inventory
      appendLog(`📦 [3/7] กำลังส่งรายการบัญชีพัสดุ-วัสดุคลังบนหน้าจอจำนวน ${inventory.length} รายการ...`);
      for (const item of inventory) {
        await fetch(appsScriptUrl, {
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
      appendLog(`✅ อัปโหลดคลังหมึกเข็มและอุปกรณ์ทั้งหมด ${inventory.length} ชุดเสร็จสิ้น!`);

      // 4. Financials
      appendLog(`💰 [4/7] กำลังจัดเก็บรายการบัญชีการเงินสตูดิโอบนหน้าจอจำนวน ${financials.length} แถว...`);
      for (const item of financials) {
        await fetch(appsScriptUrl, {
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
      appendLog(`✅ อัปโหลดรายการงบบัญชีทั้งหมด ${financials.length} รายการเสร็จสิ้น!`);

      // 5. System Tickets
      appendLog(`🎫 [5/7] กำลังส่งรายงานเคสและปัญหาในที่ทางตรวจสอบบนหน้าจอจำนวน ${tickets.length} รหัส...`);
      for (const item of tickets) {
        await fetch(appsScriptUrl, {
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
      appendLog(`✅ อัปโหลดบัตรรายงานซัพพอร์ตระบบทั้งหมด ${tickets.length} บัตรเสร็จสิ้น!`);

      // 6. Reviews
      appendLog(`★ [6/7] กำลังส่งความชื่นชมและคะแนนรีวิวบนหน้าจอจำนวน ${reviews.length} ความเห็น...`);
      for (const item of reviews) {
        await fetch(appsScriptUrl, {
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
      appendLog(`✅ อัปโหลดความคิดเห็นและการประเมินทั้งหมด ${reviews.length} รีวิวเสร็จสิ้น!`);

      // 7. Artists
      appendLog(`👥 [7/7] กำลังส่งประวัติและรายชื่อช่างสักประจำเป็นของสตูดิโอบนหน้าจอจำนวน ${artists.length} ท่าน...`);
      for (const item of artists) {
        await fetch(appsScriptUrl, {
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
      appendLog(`✅ อัปโหลดรายชื่อศิลปินช่างสักสตูดิโอ ${artists.length} ท่านเสร็จสิ้น!`);

      appendLog('🏆 [ปาฏิหาริย์สำเร็จ] การซิงค์ข้อมูลพร้อมกันทั้ง 7 ตารางลงใน Google Sheet บรรลุผลยอดเยี่ยมแล้ว!');
      setIsSeedingMockData(false);
      setSeedProgress({ status: 'success', logs: [...updatedLogs] });

      addToast(
        'ซิงค์ 7 ตารางสำเร็จสมบูรณ์!',
        'ประมวลฐานข้อมูลแบบไลฟ์สไตล์ทั้งหมดพุชลงแผ่นงาน Google Sheets เป็นต้นฉบับสำเร็จ!',
        'success'
      );

      // Refresh to grab the populated sheet to local memory
      await onRefreshFromSheets();

    } catch (e: any) {
      appendLog(`❌ ขัดข้องในการซิงค์รวม: ${e.message || e}`);
      setIsSeedingMockData(false);
      setSeedProgress({ status: 'error', logs: [...updatedLogs] });
      addToast(
        'ซิงค์ล้มเหลว / Seeding Error',
        e.message || 'Error executing sequential screen state writes',
        'error'
      );
    }
  };

  const systemSchemas = [
    {
      name: 'Appointment Model (ตารางนัดหมาย)',
      tableName: 'appointments',
      description: 'รวบรวมประวัติการนัดคิว ใบเสร็จ เงินล่วงหน้า และช่างผู้รับผิดชอบ',
      fields: [
        { name: 'id', type: 'STRING' },
        { name: 'name', type: 'STRING' },
        { name: 'phone', type: 'STRING' },
        { name: 'email', type: 'STRING' },
        { name: 'date', type: 'STRING' },
        { name: 'time', type: 'STRING' },
        { name: 'artist', type: 'STRING' },
        { name: 'style', type: 'STRING' },
        { name: 'size', type: 'STRING' },
        { name: 'note', type: 'STRING' },
        { name: 'status', type: 'STRING' },
        { name: 'createdAt', type: 'STRING' }
      ]
    },
    {
      name: 'Inventory Model (คลังและวัสดุ)',
      tableName: 'inventory',
      description: 'ข้อมูลวัสดุสิ้นเปลือง เข็ม สี แอลกอฮอล์สำหรับร้านสักพร้อมเกณฑ์ขั้นต่ำ',
      fields: [
        { name: 'code', type: 'STRING' },
        { name: 'name', type: 'STRING' },
        { name: 'category', type: 'STRING' },
        { name: 'currentStock', type: 'NUMBER' },
        { name: 'minStock', type: 'NUMBER' },
        { name: 'unit', type: 'STRING' },
        { name: 'status', type: 'STRING' }
      ]
    },
    {
      name: 'Gallery Item Model (ผลงานช่างพอร์ต)',
      tableName: 'gallery',
      description: 'แคตตาล็อกรูปภาพแสดงผลงานศิลปะรอยสักของช่างศิลปินในแต่ละหมวด',
      fields: [
        { name: 'id', type: 'STRING' },
        { name: 'category', type: 'STRING' },
        { name: 'name', type: 'STRING' },
        { name: 'artist', type: 'STRING' },
        { name: 'imageUrl', type: 'STRING' },
        { name: 'description', type: 'STRING' }
      ]
    },
    {
      name: 'Financial Transaction Model (บัญชีรายรับ-จ่าย)',
      tableName: 'financials',
      description: 'บันทึกการเงิน รายรับเงินสัก และรายจ่ายการซื้อของในสตูดิโอรายวัน',
      fields: [
        { name: 'trxId', type: 'STRING' },
        { name: 'date', type: 'STRING' },
        { name: 'time', type: 'STRING' },
        { name: 'title', type: 'STRING' },
        { name: 'category', type: 'STRING' },
        { name: 'type', type: 'STRING' },
        { name: 'amount', type: 'NUMBER' },
        { name: 'status', type: 'STRING' },
        { name: 'artist', type: 'STRING' }
      ]
    },
    {
      name: 'System Ticket Model (การแจ้งปัญหา/ซัพพอร์ต)',
      tableName: 'tickets',
      description: 'ระบบหลังบ้านรับเรื่องแจ้งปัญหาจากลูกค้า และการตรวจสอบคุณภาพ',
      fields: [
        { name: 'id', type: 'STRING' },
        { name: 'category', type: 'STRING' },
        { name: 'title', type: 'STRING' },
        { name: 'details', type: 'STRING' },
        { name: 'status', type: 'STRING' },
        { name: 'createdAt', type: 'STRING' }
      ]
    },
    {
      name: 'Client Review Model (การประเมินและรีวิว)',
      tableName: 'reviews',
      description: 'ฟีดแบคคะแนน 1-5 ดาวจากลูกค้าที่ใช้บริการสตูดิโอกับช่างเป้าหมาย',
      fields: [
        { name: 'id', type: 'STRING' },
        { name: 'author', type: 'STRING' },
        { name: 'rating', type: 'NUMBER' },
        { name: 'message', type: 'STRING' },
        { name: 'status', type: 'STRING' },
        { name: 'createdAt', type: 'STRING' },
        { name: 'artist', type: 'STRING' }
      ]
    },
    {
      name: 'Artist Model (รายชื่อและการทำงานช่างสัก)',
      tableName: 'artists',
      description: 'รายชื่อศิลปินช่างสักประจำร้านสัญณาณ ประวัติ คะแนน ความเชี่ยวชาญ และความพร้อมทำงาน',
      fields: [
        { name: 'id', type: 'STRING' },
        { name: 'nameTh', type: 'STRING' },
        { name: 'nameEn', type: 'STRING' },
        { name: 'specialty', type: 'STRING' },
        { name: 'imageUrl', type: 'STRING' },
        { name: 'experience', type: 'STRING' },
        { name: 'availability', type: 'STRING' }
      ]
    }
  ];

  const handlePushAllSchemas = async () => {
    setIsBulkSyncing(true);
    setBulkSyncResult({ status: 'running', logs: ['เริ่มต้นการเช็คโครงสร้างโมเดลตัวตน (Initializing Model Synchronization)...'] });

    const updatedLogs: string[] = [];
    
    const appendLog = (msg: string) => {
      updatedLogs.push(`[${new Date().toLocaleTimeString()}] ${msg}`);
      setBulkSyncResult({ status: 'running', logs: [...updatedLogs] });
    };

    appendLog('📡 ร้องขอทำการเชื่อมโยง Schema ทั้งหมด 7 ชุด จากโมเดล TypeScript...');

    if (!appsScriptUrl) {
      appendLog('⚠️ ตรวจพบลูปออฟไลน์ (Offline Sandbox): กำลังรันการทำงานจำลองโลคอล...');
      for (const schema of systemSchemas) {
        appendLog(`ประมวลโครงสร้างฟอร์แมต ตาราง "${schema.tableName}" ด้วยจำนวน ${schema.fields.length} ช่อง...`);
        await new Promise(resolve => setTimeout(resolve, 300));
        appendLog(`🎉 ซิงค์สำเร็จ! ตาราง "${schema.tableName}" บันทึกคำจำกัดความสกีมาลงในแท็บเทียม "schema_metadata" เรียบร้อย!`);
      }
      appendLog('🏆 การจำลองปรับสกีมาแบบไร้รอยต่อเสร็จสิ้น! บันทึกข้อมูลคอลัมน์ทั้งหมดเรียบร้อยบน Sandbox');
      setIsBulkSyncing(false);
      setBulkSyncResult({ status: 'success', logs: [...updatedLogs] });
      addToast(
        'จัดสกีมาจำลองสำเร็จ!',
        'โครงสร้างตารางหลักทั้ง 7 ตัว บันทึกสกีมาร่วมกันในชีต Meta สำเร็จ!',
        'success'
      );
      return;
    }

    try {
      appendLog('🔗 พยายามติดต่อ Web App API Endpoint ของ Google Sheets...');
      for (let i = 0; i < systemSchemas.length; i++) {
        const schema = systemSchemas[i];
        appendLog(`[${i + 1}/${systemSchemas.length}] กำลังส่งโครงสร้างสำหรับ "${schema.tableName}"...`);
        
        const payload = {
          action: 'sync_schema',
          tableName: schema.tableName,
          version: 1,
          fields: schema.fields
        };

        const response = await fetch(appsScriptUrl, {
          method: 'POST',
          mode: 'cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload)
        });
        const result = await response.json();

        if (result.status === 'success') {
          appendLog(`✅ ตาราง "${schema.tableName}" ได้รับการสร้าง/ซิงค์อัตโนมัติสำเร็จ! (ตอนนี้ในชีตมีคอลัมน์กางออก ${result.totalColumns || schema.fields.length} คอลัมน์)`);
        } else {
          appendLog(`❌ ปฎิเสธคำร้องสำหรับตาราง "${schema.tableName}": ${result.message}`);
          throw new Error(result.message || `ล้มเหลวขณะประมวลแท็บ ${schema.tableName}`);
        }
        
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      appendLog('🚀 [สำเร็จลุล่วง] นำส่งโมเดลทั้งหมดขึ้นเป็นหัวคอลัมน์จริงบนชีตอย่างสอดประสานกัน!');
      setIsBulkSyncing(false);
      setBulkSyncResult({ status: 'success', logs: [...updatedLogs] });
      addToast(
        'ซิงค์สกีมาทั้งระบบสำเร็จ!',
        'โมเดล TypeScript ทั้งหมดได้รับการติดตั้งแผ่วเบาบนแผ่นชีตเรียบร้อย!',
        'success'
      );
    } catch (e: any) {
      appendLog(`💥 ความล้มเหลวลื่นไหลสะดุด: ${e.message || e}`);
      setIsBulkSyncing(false);
      setBulkSyncResult({ status: 'error', logs: [...updatedLogs] });
      addToast(
        'ปรับรูปสกีมาไม่สำเร็จ',
        e.message || 'Error executing bulk schema updates',
        'error'
      );
    }
  };

  // Host configuration preset loading
  const handleLoadSchemaPreset = (preset: string) => {
    if (preset === 'marketing_subscribers') {
      setSchemaTableName('marketing_subscribers');
      setSchemaVersion('1');
      setSchemaFields([
        { name: 'subscriber_id', type: 'STRING' },
        { name: 'email', type: 'STRING' },
        { name: 'source', type: 'STRING' },
        { name: 'opt_in', type: 'BOOLEAN' }
      ]);
    } else if (preset === 'artist_roster') {
      setSchemaTableName('artist_roster');
      setSchemaVersion('1');
      setSchemaFields([
        { name: 'id', type: 'STRING' },
        { name: 'name', type: 'STRING' },
        { name: 'expertise', type: 'STRING' },
        { name: 'commission_rate', type: 'NUMBER' }
      ]);
    } else {
      setSchemaTableName('customer_subscriptions');
      setSchemaVersion('1');
      setSchemaFields([
        { name: 'id', type: 'STRING' },
        { name: 'customer_name', type: 'STRING' },
        { name: 'tier', type: 'STRING' },
        { name: 'is_active', type: 'BOOLEAN' },
        { name: 'joined_date', type: 'DATETIME' }
      ]);
    }
  };

  const handleSyncSchemaToSheets = async () => {
    setIsSyncingSchema(true);
    setSchemaSyncStatus({ status: 'idle', message: 'กำลังเชื่อมต่อและจำลองการสร้างตาราง...' });

    const payload = {
      action: 'sync_schema',
      tableName: schemaTableName,
      version: Number(schemaVersion) || 1,
      fields: schemaFields
    };

    if (!appsScriptUrl) {
      // Offline Simulation
      setTimeout(() => {
        setIsSyncingSchema(false);
        setSchemaSyncStatus({
          status: 'success',
          message: 'วิเคราะห์โครงสร้างและซิงค์ความละเอียดของตารางจำลองเรียบร้อย!',
          details: {
            tableName: schemaTableName,
            version: schemaVersion,
            totalFields: schemaFields.length,
            note: 'เนื่องจากสคริปต์อยู่ในโหมดออฟไลน์ การประมวลผลนี้ถูกบันทึกจำลองลงในระบบ metadata ความละเอียดแล้ว หากเปิดใช้งาน Web App URL และรัน จะเปิดชีตในหน้าเพจเป้าหมายของ Google Sheets ดั้งเดิมอัตโนมัติคอลัมน์ล่างซ้ายทันที!'
          }
        });
        addToast(
          'ซิงค์เทมเพลตสกีมาสำเร็จ!',
          `ประมวลผลเพิ่มฟิลด์ลงในแท็บ ${schemaTableName} เรียบร้อยแล้ว`,
          'success'
        );
      }, 1200);
      return;
    }

    try {
      const response = await fetch(appsScriptUrl, {
        method: 'POST',
        mode: 'cors',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();
      
      setIsSyncingSchema(false);
      if (result.status === 'success') {
        setSchemaSyncStatus({
          status: 'success',
          message: 'อัปเกรดฐานข้อมูล / สร้างตารางพร้อม Schema ออโต้อัปเดตสำเร็จในชีตจริง!',
          details: result
        });
        addToast(
          'เชื่อมต่อ & จัดสกีมาสำเร็จ!',
          `ตรรกะ Migration สู่ตารางใหม่ ${schemaTableName} ดำเนินการสมบูรณ์แบบบนชีต`,
          'success'
        );
      } else {
        setSchemaSyncStatus({
          status: 'error',
          message: result.message || 'เกิดข้อผิดพลาดในการตอบรับคำสั่งของ Google Apps Script'
        });
        addToast('อัปสกีมาไม่สำเร็จ', result.message || 'Error syncing schema', 'error');
      }
    } catch (e: any) {
      setIsSyncingSchema(false);
      setSchemaSyncStatus({
        status: 'error',
        message: `ข้อสัญญาณสื่อสารล้มเหลว: ${e.message || e}`
      });
      addToast('ข้อส่งสัญญาณผิดพลาด', `กรุณาเช็กความถูกต้องและสิทธิ์ CORS: ${e.message || e}`, 'error');
    }
  };

  // Daily appointment summary printing states
  const [printDate, setPrintDate] = useState<string>(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  });
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);

  // Manual Syring Trigger States
  const [lastSyncTime, setLastSyncTime] = useState<string>(() => {
    return new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  });
  const [localSyncing, setLocalSyncing] = useState(false);
  const [syncCompletedFeedback, setSyncCompletedFeedback] = useState(false);

  const handleManualSync = async () => {
    if (localSyncing || isSyncing) return;
    setLocalSyncing(true);
    setSyncCompletedFeedback(false);

    try {
      if (onRefreshFromSheets) {
        await onRefreshFromSheets();
      } else {
        await new Promise(resolve => setTimeout(resolve, 1200));
      }
      
      const timeStr = new Date().toLocaleTimeString('th-TH', { 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      });
      setLastSyncTime(timeStr);
      setSyncCompletedFeedback(true);
      
      // Keep feedback active for 3 seconds
      setTimeout(() => {
        setSyncCompletedFeedback(false);
      }, 3000);
    } catch (e) {
      console.warn("Manual sync error:", e);
    } finally {
      setLocalSyncing(false);
    }
  };

  // Handle Copy Apps Script Code
  const handleCopyCode = () => {
    navigator.clipboard.writeText(APPS_SCRIPT_CODE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleCopyInstructions = () => {
    navigator.clipboard.writeText(APPS_SCRIPT_GUIDE);
    setCopiedInstructions(true);
    setTimeout(() => setCopiedInstructions(false), 2000);
  };

  // Bulk CSV Import States
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [bulkInputText, setBulkInputText] = useState('');
  const [bulkFileName, setBulkFileName] = useState('');
  const [bulkItemsPreview, setBulkItemsPreview] = useState<InventoryItem[]>([]);
  const [bulkParseError, setBulkParseError] = useState<string | null>(null);
  const [bulkImportProcessing, setBulkImportProcessing] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && (file.name.endsWith('.csv') || file.type === 'text/csv')) {
      setBulkFileName(file.name);
      const reader = new FileReader();
      reader.onload = (event) => {
        const csvText = event.target?.result as string;
        setBulkInputText(csvText);
        processCSVContent(csvText);
      };
      reader.readAsText(file);
    } else {
      setBulkParseError('โปรดเลือกไฟล์เฉพาะรูปแบบ .csv เท่านั้น / Only .csv files are supported');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBulkFileName(file.name);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const csvText = event.target?.result as string;
      setBulkInputText(csvText);
      processCSVContent(csvText);
    };
    reader.readAsText(file);
  };

  const processCSVContent = (text: string) => {
    try {
      setBulkParseError(null);
      const rows = parseCSVContentHelper(text);
      if (rows.length === 0) {
        setBulkItemsPreview([]);
        setBulkParseError('ไม่พบข้อมูลวัสดุอุปกรณ์ที่ถูกต้องในไฟล์ CSV / No valid materials found in the CSV');
        return;
      }
      setBulkItemsPreview(rows);
    } catch (err: any) {
      setBulkParseError(`ล้มเหลวในการแยกวิเคราะห์ CSV: ${err.message || err}`);
    }
  };

  const parseCSVContentHelper = (text: string): InventoryItem[] => {
    const lines = text.split(/\r?\n/);
    if (lines.length === 0) return [];

    let headerLineIndex = -1;
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim()) {
        headerLineIndex = i;
        break;
      }
    }
    if (headerLineIndex === -1) return [];

    const headerParts = lines[headerLineIndex].split(',').map(h => h.trim().replace(/^["']|["']$/g, ''));
    
    const fieldMapping: { [index: number]: keyof InventoryItem } = {};
    
    headerParts.forEach((header, index) => {
      const cleanHeader = header.toLowerCase().replace(/\s+/g, '');
      if (cleanHeader === 'code' || cleanHeader === 'รหัสสินค้า' || cleanHeader === 'รหัส') {
        fieldMapping[index] = 'code';
      } else if (cleanHeader === 'name' || cleanHeader === 'ชื่อผลิตภัณฑ์' || cleanHeader === 'ชื่อสินค้า' || cleanHeader === 'ชื่อ') {
        fieldMapping[index] = 'name';
      } else if (cleanHeader === 'category' || cleanHeader === 'ประเภทคลัง' || cleanHeader === 'ประเภท' || cleanHeader === 'หมวดหมู่') {
        fieldMapping[index] = 'category';
      } else if (cleanHeader === 'currentstock' || cleanHeader === 'จำนวน' || cleanHeader === 'จำนวนสต็อก' || cleanHeader === 'สต็อก') {
        fieldMapping[index] = 'currentStock';
      } else if (cleanHeader === 'minstock' || cleanHeader === 'เกณฑ์เตือน' || cleanHeader === 'ขั้นต่ำ') {
        fieldMapping[index] = 'minStock';
      } else if (cleanHeader === 'unit' || cleanHeader === 'หน่วยนับ' || cleanHeader === 'หน่วย') {
        fieldMapping[index] = 'unit';
      }
    });

    const hasCode = Object.values(fieldMapping).includes('code');
    const hasName = Object.values(fieldMapping).includes('name');
    if (!hasCode || !hasName) {
      fieldMapping[0] = 'code';
      fieldMapping[1] = 'name';
      fieldMapping[2] = 'category';
      fieldMapping[3] = 'currentStock';
      fieldMapping[4] = 'minStock';
      fieldMapping[5] = 'unit';
    }

    const results: InventoryItem[] = [];

    for (let i = headerLineIndex + 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const values: string[] = [];
      let inQuotes = false;
      let currentField = '';
      for (let c = 0; c < line.length; c++) {
        const char = line[c];
        if (char === '"') {
          inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
          values.push(currentField.trim().replace(/^["']|["']$/g, ''));
          currentField = '';
        } else {
          currentField += char;
        }
      }
      values.push(currentField.trim().replace(/^["']|["']$/g, ''));

      const item: Partial<InventoryItem> = {
        category: 'Needles',
        currentStock: 0,
        minStock: 5,
        unit: 'Boxes',
        status: 'OK'
      };

      Object.entries(fieldMapping).forEach(([indexStr, field]) => {
        const index = parseInt(indexStr);
        const val = values[index] ? values[index].trim() : '';
        if (field === 'code') {
          item.code = val;
        } else if (field === 'name') {
          item.name = val;
        } else if (field === 'category') {
          item.category = (val || 'Needles') as InventoryItem['category'];
        } else if (field === 'currentStock') {
          item.currentStock = Number(val) || 0;
        } else if (field === 'minStock') {
          item.minStock = Number(val) || 0;
        } else if (field === 'unit') {
          item.unit = val || 'Boxes';
        }
      });

      if (item.code && item.name) {
        item.status = (item.currentStock || 0) < (item.minStock || 0) ? 'LOW' : 'OK';
        results.push(item as InventoryItem);
      }
    }

    return results;
  };

  const handleImportConfirm = async () => {
    if (bulkItemsPreview.length === 0) return;
    setBulkImportProcessing(true);

    const importedList = [...bulkItemsPreview];

    setInventory(prev => {
      const existingMap = new Map(prev.map(item => [item.code, item]));
      importedList.forEach(item => {
        existingMap.set(item.code, item);
      });
      return Array.from(existingMap.values());
    });

    if (appsScriptUrl) {
      try {
        for (const item of importedList) {
          await fetch(appsScriptUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'add_inventory',
              code: item.code,
              name: item.name,
              category: item.category,
              currentStock: String(item.currentStock),
              minStock: String(item.minStock),
              unit: item.unit
            })
          });
        }
      } catch (err) {
        console.warn("Bulk upload apps script error:", err);
      }
    }

    setBulkImportProcessing(false);
    setIsBulkImportOpen(false);
    setBulkInputText('');
    setBulkFileName('');
    setBulkItemsPreview([]);
    setBulkParseError(null);
  };

  // Custom confirmation modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    actionLabel: string;
    onConfirm: () => void;
    type: 'danger' | 'warning' | 'info';
  } | null>(null);

  // Intercept appointment status changes for confirmation
  const confirmStatusChange = (aptId: string, newStatus: Appointment['status']) => {
    if (newStatus === 'Cancelled') {
      const apt = appointments.find(a => a.id === aptId);
      const name = apt ? apt.name : aptId;
      setConfirmModal({
        isOpen: true,
        title: 'ยืนยันยกเลิกเวลานัดหมาย / Cancel Appointment',
        message: `คุณยืนยันที่จะเปลี่ยนสถานะเวลานัดหมายของคุณ "${name}" (รหัสคิว: ${aptId}) เป็น "ยกเลิกนัดหมาย / Cancelled" หรือไม่? การยกเลิกจะมีผลต่อระบบคิวในปฏิทินงานด้วย`,
        actionLabel: 'ยืนยันยกเลิกนัด / CANCEL APPOINTMENT',
        type: 'warning',
        onConfirm: () => {
          handleStatusChange(aptId, 'Cancelled');
          setConfirmModal(null);
        }
      });
    } else {
      handleStatusChange(aptId, newStatus);
    }
  };

  // Handle deleting from gallery with confirmation
  const handleDeleteGalleryItem = (id: string, name: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'ยืนยันลบรูปจากแกลเลอรี / Gallery Removal',
      message: `คุณกำลังจะลบรูปผลงานศิลปะชิ้นเอก "${name}" แบบถาวรจากสตูดิโอหน้าบล็อกแกลเลอรี สิ่งนี้จะไม่สามารถกู้กลับคืนได้`,
      actionLabel: 'ยืนยันลบข้อมูล / DELETE ARTWORK',
      type: 'danger',
      onConfirm: async () => {
        setGallery(prev => prev.filter(g => g.id !== id));
        if (appsScriptUrl) {
          try {
            await fetch(appsScriptUrl, {
              method: 'POST',
              mode: 'no-cors',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                action: 'delete_row',
                tableName: 'gallery',
                idColumn: 'id',
                id: id
              })
            });
          } catch (err) {
            console.warn("Could not sync gallery item deletion to sheets:", err);
          }
        }
        setConfirmModal(null);
      }
    });
  };

  // Handle deleting from inventory with confirmation
  const handleDeleteInventoryItem = (code: string, name: string) => {
    setConfirmModal({
      isOpen: true,
      title: 'ยืนยันลบวัสดุอุปกรณ์ / Inventory Removal',
      message: `คุณกำลังจะลบรายการวัสดุอุปกรณ์ "${name}" (รหัสสินค้า: ${code}) ออกจากสต็อกคลังอุปกรณ์สตูดิโอถาวร ประวัติสต็อกเดิมจะหายไป`,
      actionLabel: 'ยืนยันลบวัสดุ / DELETE PRODUCT',
      type: 'danger',
      onConfirm: async () => {
        setInventory(prev => prev.filter(i => i.code !== code));
        if (appsScriptUrl) {
          try {
            await fetch(appsScriptUrl, {
              method: 'POST',
              mode: 'no-cors',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                action: 'delete_row',
                tableName: 'inventory',
                idColumn: 'code',
                id: code
              })
            });
          } catch (err) {
            console.warn("Could not sync inventory item deletion to sheets:", err);
          }
        }
        setConfirmModal(null);
      }
    });
  };

  // State manipulation endpoints
  const handleStatusChange = async (aptId: string, newStatus: Appointment['status']) => {
    // 1. Update state locally
    setAppointments(prev => prev.map(apt => apt.id === aptId ? { ...apt, status: newStatus } : apt));

    const targetApt = appointments.find(a => a.id === aptId);
    if (appsScriptUrl && targetApt) {
      try {
        await fetch(appsScriptUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'upsert',
            tableName: 'appointments',
            idColumn: 'id',
            data: {
              ...targetApt,
              status: newStatus
            }
          })
        });
      } catch (err) {
        console.warn("Could not sync appointment status change to sheets:", err);
      }
    }

    // 2. Add automatic transaction if the appointment is completed!
    if (newStatus === 'Completed') {
      const apt = appointments.find(a => a.id === aptId);
      if (apt) {
        const estAmount = apt.size.includes('A4') ? 12000 : apt.size.includes('A5') ? 6000 : 2500;
        const newTrx: FinancialTransaction = {
          trxId: `TRX-${Math.floor(1000 + Math.random() * 9000)}`,
          date: new Date().toISOString().split('T')[0],
          time: new Date().toTimeString().split(' ')[0].substring(0, 5),
          title: `ชำระเงินค่านัดสักรหัส ${aptId} (คุณ${apt.name})`,
          category: 'รายได้จากบริการสัก / Service Income',
          type: 'income',
          amount: estAmount,
          status: 'Success',
          artist: apt.artist
        };
        setFinancials(prev => [newTrx, ...prev]);

        // Sync to Sheets
        if (appsScriptUrl) {
          try {
            await fetch(appsScriptUrl, {
              method: 'POST',
              mode: 'no-cors',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                action: 'add_transaction',
                title: newTrx.title,
                category: newTrx.category,
                type: 'income',
                amount: estAmount,
                artist: apt.artist
              })
            });
          } catch (e) {
            console.warn("Could not sync transaction to sheets:", e);
          }
        }
      }
    }
  };

  // Add Item to gallery
  const handleAddGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGallery.name || !newGallery.imageUrl) return;

    const newItem: GalleryItem = {
      id: `gal-${Math.floor(100 + Math.random() * 900)}`,
      name: newGallery.name,
      artist: newGallery.artist,
      category: newGallery.category,
      imageUrl: newGallery.imageUrl,
      description: newGallery.description || 'Custom generated premium body art.'
    };

    setGallery(prev => [newItem, ...prev]);
    setNewGallery({ name: '', artist: 'พิมพ์ดาว', category: 'ไซเบอร์-แบล็คเวิร์ค', imageUrl: '', description: '' });

    // Web hook syncer
    if (appsScriptUrl) {
      try {
        await fetch(appsScriptUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'add_gallery_item', // handles appending
            ...newGallery
          })
        });
      } catch (err) {
        console.warn("Gallery syncer fail:", err);
      }
    }
  };

  // Add Item to inventory
  const handleAddInventoryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newInventory.code || !newInventory.name) return;

    const current = Number(newInventory.currentStock) || 0;
    const min = Number(newInventory.minStock) || 0;
    const newItem: InventoryItem = {
      code: newInventory.code,
      name: newInventory.name,
      category: newInventory.category,
      currentStock: current,
      minStock: min,
      unit: newInventory.unit,
      status: current < min ? 'LOW' : 'OK'
    };

    setInventory(prev => [newItem, ...prev]);

    // Send payload to backend
    if (appsScriptUrl) {
      try {
        await fetch(appsScriptUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'add_inventory',
            ...newInventory
          })
        });
      } catch (err) {
        console.warn("Stock syner error:", err);
      }
    }

    setNewInventory({ code: '', name: '', category: 'Needles', currentStock: '10', minStock: '5', unit: 'Boxes' });
  };

  // Increment item stock
  const handleStockDelta = async (code: string, delta: number) => {
    setInventory(prev => prev.map(item => {
      if (item.code === code) {
        const nextStock = Math.max(0, item.currentStock + delta);
        return {
          ...item,
          currentStock: nextStock,
          status: nextStock < item.minStock ? 'LOW' : 'OK'
        };
      }
      return item;
    }));

    if (appsScriptUrl) {
      try {
        await fetch(appsScriptUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'update_stock',
            code,
            delta
          })
        });
      } catch (e) {
        console.warn(e);
      }
    }
  };

  // Submit expense transaction
  const handleAddExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newExpense.title || !newExpense.amount) return;

    const amount = Number(newExpense.amount) || 0;
    const newTrx: FinancialTransaction = {
      trxId: `TRX-${Math.floor(1000 + Math.random() * 9000)}`,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().split(' ')[0].substring(0, 5),
      title: newExpense.title,
      category: newExpense.category,
      type: 'expense',
      amount,
      status: 'Success',
      artist: newExpense.artist || undefined
    };

    setFinancials(prev => [newTrx, ...prev]);

    if (appsScriptUrl) {
      try {
        await fetch(appsScriptUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'add_transaction',
            title: newExpense.title,
            category: newExpense.category,
            type: 'expense',
            amount,
            artist: newExpense.artist
          })
        });
      } catch (e) {
        console.warn(e);
      }
    }

    setNewExpense({ title: '', category: 'ค่าวัสดุและหมึกสัก / Materials', amount: '', artist: '' });
  };

  // Submit system ticket
  const handleAddTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicket.title) return;

    const newTkt: SystemTicket = {
      id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      category: newTicket.category,
      title: newTicket.title,
      details: newTicket.details || 'Checking system parameters.',
      status: 'Checking',
      createdAt: new Date().toISOString()
    };

    setTickets(prev => [newTkt, ...prev]);

    if (appsScriptUrl) {
      try {
        await fetch(appsScriptUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'add_ticket',
            ...newTicket
          })
        });
      } catch (e) {
        console.warn(e);
      }
    }

    setNewTicket({ category: 'ปัญหาเทคนิค / Google Sheets Sync', title: '', details: '' });
  };

  // Solve ticket
  const handleSolveTicket = async (id: string) => {
    setTickets(prev => prev.map(t => t.id === id ? { ...t, status: 'Resolved' } : t));

    if (appsScriptUrl) {
      try {
        const targetTicket = tickets.find(t => t.id === id);
        if (targetTicket) {
          await fetch(appsScriptUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              action: 'upsert',
              tableName: 'tickets',
              idColumn: 'id',
              data: {
                ...targetTicket,
                status: 'Resolved'
              }
            })
          });
        }
      } catch (err) {
        console.warn("Could not sync ticket status update to sheets:", err);
      }
    }
  };

  // Derived Metric calculations
  const lowStockCount = inventory.filter(i => i.status === 'LOW').length;
  const pendingApts = appointments.filter(a => a.status === 'Pending').length;

  const totalIncome = financials
    .filter(f => f.type === 'income')
    .reduce((sum, item) => sum + item.amount, 0);

  const totalExpense = financials
    .filter(f => f.type === 'expense')
    .reduce((sum, item) => sum + item.amount, 0);

  const netProfit = totalIncome - totalExpense;

  // Filter lists
  const filteredAppointments = appointments.filter(apt => {
    return !searchAppointment || 
      apt.name.toLowerCase().includes(searchAppointment.toLowerCase()) ||
      apt.id.toLowerCase().includes(searchAppointment.toLowerCase()) ||
      apt.phone.includes(searchAppointment) ||
      apt.artist.toLowerCase().includes(searchAppointment.toLowerCase());
  });

  const baseFilteredInventory = inventory.filter(item => {
    return !searchInventory ||
      item.name.toLowerCase().includes(searchInventory.toLowerCase()) ||
      item.code.toLowerCase().includes(searchInventory.toLowerCase()) ||
      item.category.toLowerCase().includes(searchInventory.toLowerCase());
  });

  const filteredInventory = stockSortOrder === 'none'
    ? baseFilteredInventory
    : [...baseFilteredInventory].sort((a, b) => {
        return stockSortOrder === 'asc'
          ? a.currentStock - b.currentStock
          : b.currentStock - a.currentStock;
      });

  const sortedFinancials = dateSortOrder === 'none'
    ? financials
    : [...financials].sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time || '00:00'}`).getTime();
        const dateB = new Date(`${b.date}T${b.time || '00:00'}`).getTime();
        return dateSortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      });

  const filteredAdminGallery = gallery.filter(item => {
    return !searchAdminGallery ||
      item.name.toLowerCase().includes(searchAdminGallery.toLowerCase()) ||
      item.artist.toLowerCase().includes(searchAdminGallery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchAdminGallery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchAdminGallery.toLowerCase()) ||
      (item.description && item.description.toLowerCase().includes(searchAdminGallery.toLowerCase()));
  });

  return (
    <div className="bg-[#0b0b0b] min-h-screen text-gray-300 font-sans flex flex-col md:flex-row border-b border-[#2d2d2d]">
      
      {/* LEFT SIDEBAR INDEX_OS FRAME */}
      <aside className="w-full md:w-64 bg-[#111111] border-r border-[#222] p-6 flex flex-col justify-between space-y-8 flex-shrink-0">
        <div className="space-y-6">
          
          {/* Logo Frame Header */}
          <div className="flex items-center space-x-3.5 pb-6 border-b border-[#222]">
            <span className="w-8 h-8 rounded-tr bg-crimson font-heading text-lg font-bold text-white flex items-center justify-center">
              🎛️
            </span>
            <div>
              <span className="font-heading tracking-widest text-sm font-black text-white block uppercase">
                INK_OS v4.1
              </span>
              <span className="text-[9.5px] font-mono text-gray-400 block tracking-wider">
                CORE BACKOFFICE ENGINE
              </span>
            </div>
          </div>

          {/* Connected User Badge */}
          <div className="bg-black/60 border border-[#222] p-3 rounded flex items-center space-x-3">
            <div className="w-10 h-10 rounded bg-[#1f1f1f] border border-crimson/30 overflow-hidden">
              <img 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBGeDB4-pLVKo0LpLj2Ufb-P_RvDn_waHuaiI5_cp0Z0_mHbSYwLQ8pi4fnSqQFKx6TXfgyWJFahhXzoSreV13aDBcdHWiXG_wDvky1X6JX8uL5ZE4D1sXeuQkeSM2cizyX6qdvQTagxhipexaVbmBey-Zhablprfaf8tUJc12YrkEikVsYlzBx1tm1aQoNtQj5fdbHjhJg2lDZEsmM_YRc7O5aaESWawMK0COmPhLS8_yuRpf5Ag7wOcVSyiJvGLL1Weki-rpnVjI" 
                alt="Studio Dir"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <span className="text-xs text-white uppercase font-bold tracking-tight block">คุณกมลวิชญ์</span>
              <span className="text-[10px] text-crimson font-mono tracking-widest uppercase">Studio Director</span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-4 text-xs font-heading font-medium tracking-wider uppercase">
            
            {/* Group 1: Overview */}
            <div className="space-y-1">
              <span className="text-[9.5px] text-gray-500 font-mono tracking-widest font-black uppercase px-1 block mb-1">
                📊 วิเคราะห์ & สรุปผล / Analytics
              </span>
              <button
                onClick={() => setActiveTab('dash')}
                className={`w-full text-left py-2 px-3 rounded-lg transition cursor-pointer flex items-center justify-between ${
                  activeTab === 'dash' ? 'bg-crimson text-white font-extrabold shadow-sm' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Terminal className="w-4 h-4" />
                  <span>ควบคุมหลัก / DASHBOARD</span>
                </span>
                {pendingApts > 0 && (
                  <span className="bg-white text-crimson font-mono font-bold text-[10px] px-1.5 py-0.5 rounded-full">
                    {pendingApts}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('analytics')}
                className={`w-full text-left py-2 px-3 rounded-lg transition cursor-pointer flex items-center gap-2.5 ${
                  activeTab === 'analytics' ? 'bg-crimson text-white font-extrabold shadow-sm' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                <span>รายงานภาพรวม / STATS</span>
              </button>
            </div>

            {/* Group 2: Studio Management */}
            <div className="space-y-1">
              <span className="text-[9.5px] text-gray-500 font-mono tracking-widest font-black uppercase px-1 block mb-1">
                🎨 ลูกค้า & ผลงาน / studio hub
              </span>
              <button
                onClick={() => setActiveTab('appointments')}
                className={`w-full text-left py-2 px-3 rounded-lg transition cursor-pointer flex items-center justify-between ${
                  activeTab === 'appointments' ? 'bg-crimson text-white font-extrabold shadow-sm' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Calendar className="w-4 h-4" />
                  <span>คิวนัดหมายสัก / APPOINTMENTS</span>
                </span>
              </button>

              <button
                onClick={() => setActiveTab('gallery')}
                className={`w-full text-left py-2 px-3 rounded-lg transition cursor-pointer flex items-center justify-between ${
                  activeTab === 'gallery' ? 'bg-crimson text-white font-extrabold' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Award className="w-4 h-4" />
                  <span>แกลเลอรีลายสัก / GALLERY</span>
                </span>
              </button>

              <button
                onClick={() => setActiveTab('reviews')}
                className={`w-full text-left py-2 px-3 rounded-lg transition cursor-pointer flex items-center justify-between ${
                  activeTab === 'reviews' ? 'bg-crimson text-white font-extrabold' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Award className="w-4 h-4" />
                  <span>กล่องรีวิวลูกค้า / REVIEWS</span>
                </span>
                {reviews.filter(r => r.status === 'Pending').length > 0 && (
                  <span className="bg-crimson text-white font-mono font-bold text-[9px] px-1.5 py-0.5 rounded-full ml-auto">
                    {reviews.filter(r => r.status === 'Pending').length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('artists')}
                className={`w-full text-left py-2 px-3 rounded-lg transition cursor-pointer flex items-center justify-between ${
                  activeTab === 'artists' ? 'bg-crimson text-white font-extrabold font-black shadow-sm' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <User className="w-4 h-4 text-emerald-400" />
                  <span>รายชื่อช่างสัก / ARTISTS</span>
                </span>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono font-bold text-[9px] px-1.5 py-0.5 rounded ml-auto">
                  {artists.length}
                </span>
              </button>
            </div>

            {/* Group 3: Supply Chain */}
            <div className="space-y-1">
              <span className="text-[9.5px] text-gray-500 font-mono tracking-widest font-black uppercase px-1 block mb-1">
                📦 คลังเข็มสัก & การเงิน / supply
              </span>
              <button
                onClick={() => setActiveTab('warehouse')}
                className={`w-full text-left py-2 px-3 rounded-lg transition cursor-pointer flex items-center justify-between ${
                  activeTab === 'warehouse' ? 'bg-crimson text-white font-extrabold' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  <Package className="w-4 h-4" />
                  <span>บัญชีวัสดุพัสดุ / STOCKS</span>
                </span>
                {lowStockCount > 0 && (
                  <span className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 font-mono font-bold text-[9px] px-1.5 py-0.5 rounded">
                    LOW
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('financials')}
                className={`w-full text-left py-2 px-3 rounded-lg transition cursor-pointer flex items-center gap-2.5 ${
                  activeTab === 'financials' ? 'bg-crimson text-white font-extrabold' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <DollarSign className="w-4 h-4" />
                <span>งบรายรับรายจ่าย / LEDGERS</span>
              </button>
            </div>

            {/* Group 4: Core System */}
            <div className="space-y-1">
              <span className="text-[9.5px] text-gray-500 font-mono tracking-widest font-black uppercase px-1 block mb-1">
                ⚙️ จัดการฐานข้อมูล / configuration
              </span>
              <button
                onClick={() => setActiveTab('brand')}
                className={`w-full text-left py-2 px-3 rounded-lg transition cursor-pointer flex items-center gap-2.5 ${
                  activeTab === 'brand' ? 'bg-crimson text-white font-extrabold shadow-sm' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Settings className="w-4 h-4 text-rose-400" />
                <span>แก้ไขเฉดสี & แบรนด์ / BRANDING</span>
              </button>

              <button
                onClick={() => setActiveTab('support')}
                className={`w-full text-left py-2 px-3 rounded-lg transition cursor-pointer flex items-center gap-2.5 ${
                  activeTab === 'support' ? 'bg-crimson text-white font-extrabold' : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Activity className="w-4 h-4" />
                <span>ตรวจสอบบัตรแจ้ง / TICKETS</span>
              </button>

              <button
                onClick={() => setActiveTab('sheets')}
                className={`w-full text-left py-2 px-3 rounded-lg transition cursor-pointer flex items-center gap-2.5 ${
                  activeTab === 'sheets' ? 'bg-amber-600 text-white font-extrabold' : 'text-amber-400/90 hover:text-white hover:bg-white/5 border border-amber-500/10'
                }`}
              >
                <Database className="w-4 h-4 text-amber-500" />
                <span>เชื่อมต่อ GOOGLE SHEET</span>
              </button>
            </div>
          </nav>
        </div>

        {/* Action Bottom Sidebar */}
        <div className="space-y-4 pt-6 border-t border-[#222]">
          <div className="text-[9.5px] font-mono text-gray-500 uppercase tracking-widest text-center">
            {appsScriptUrl ? '📊 SPREADSHEET LIVE ACTIVE' : '⚠️ local sandbox active'}
          </div>
          
          <button
            onClick={onLogoutClick}
            className="w-full border border-[#333] hover:border-crimson text-gray-400 hover:text-white py-2.5 rounded text-xs font-heading font-semibold tracking-wider uppercase cursor-pointer transition flex items-center justify-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>กลับหน้าแรกลูกค้า</span>
          </button>
        </div>
      </aside>

      {/* RIGHT MAIN WORKSPACE GRID */}
      <main className="flex-1 p-6 md:p-10 space-y-8 overflow-y-auto max-h-screen custom-scrollbar">
        
        {/* Top Breadcrumb Bar */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-6 border-b border-[#222] gap-4">
          <div>
            <h1 className="text-2xl font-heading font-black tracking-tight text-white uppercase flex items-center gap-3">
              <span>INK_OS METRICS COMMAND CENTER</span>
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-1">
              <p className="text-xs text-gray-500 font-mono">
                SYSTEM CONTROL PANEL FOR INTERNAL TATTOO STAFF & SPREADSHEET SYNC SYSTEM
              </p>
              <span className="text-zinc-700 font-mono text-xs hidden sm:inline">•</span>
              <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded border text-[9.5px] font-mono leading-none select-none ${
                appsScriptUrl 
                  ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/10' 
                  : 'bg-amber-500/5 text-amber-500 border-amber-500/10'
              }`}>
                <span className="relative flex h-1.5 w-1.5">
                  {appsScriptUrl && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  )}
                  <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${appsScriptUrl ? 'bg-emerald-400' : 'bg-amber-500'}`}></span>
                </span>
                <span>{appsScriptUrl ? 'GOOGLE SHEETS CONNECTED (REAL-TIME AUTO-SAVE)' : 'OFFLINE SANDBOX MODE'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2.5">
            {/* Subtle Badge Indicating Last Sync Timestamp */}
            <span className="text-[10px] font-mono bg-[#121212] text-gray-400 px-3 py-2 rounded-lg border border-[#222] flex items-center gap-2 select-none whitespace-nowrap shadow-sm">
              <span className={`w-1.5 h-1.5 rounded-full ${syncCompletedFeedback ? 'bg-emerald-500 animate-ping' : 'bg-crimson animate-pulse'}`} />
              <span className="text-gray-500">LAST SYNC:</span>
              <span className="text-white font-bold">{lastSyncTime}</span>
            </span>

            {/* Sync Now manual trigger button */}
            <button
              onClick={handleManualSync}
              disabled={localSyncing || isSyncing}
              className={`text-xs font-mono font-black px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-2 cursor-pointer select-none border whitespace-nowrap ${
                syncCompletedFeedback 
                  ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.1)]'
                  : localSyncing || isSyncing
                    ? 'bg-[#161616] border-[#222] text-amber-500 pointer-events-none'
                    : 'bg-crimson hover:bg-red-600 border-crimson/50 hover:border-red-500 text-white shadow-md hover:shadow-crimson/10'
              }`}
            >
              {syncCompletedFeedback ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>SYNC OK</span>
                </>
              ) : localSyncing || isSyncing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-500" />
                  <span>SYNCING...</span>
                </>
              ) : (
                <>
                  <RefreshCw className="w-3.5 h-3.5 text-white/80" />
                  <span>SYNC NOW</span>
                </>
              )}
            </button>

            <span className="hidden sm:inline-flex text-[10px] font-mono bg-black text-gray-400 px-3 py-2 rounded-lg border border-[#222] items-center gap-1.5 select-none whitespace-nowrap">
              <span className="text-green-500 animate-pulse">●</span>
              <span>PING: <span className="text-white">12ms</span></span>
            </span>
          </div>
        </header>

        {/* TAB content routing */}

        {/* 1. DASHBOARD */}
        {activeTab === 'dash' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Stat Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div onClick={() => setActiveTab('appointments')} className="bg-[#131313] border border-[#222] p-5 rounded-lg space-y-1.5 hover:border-crimson/30 transition cursor-pointer">
                <span className="text-[10px] font-mono text-gray-500 uppercase block">Pending Appointments</span>
                <div className="flex justify-between items-baseline">
                  <span className="text-3xl font-heading font-black text-white">{pendingApts}</span>
                  <span className="text-xs font-mono font-bold px-1.5 py-0.5 bg-yellow-500/10 text-yellow-500 rounded">คิวรอตรวจ</span>
                </div>
              </div>

              <div onClick={() => setActiveTab('warehouse')} className="bg-[#131313] border border-[#222] p-5 rounded-lg space-y-1.5 hover:border-yellow-500/30 transition cursor-pointer">
                <span className="text-[10px] font-mono text-gray-500 uppercase block">Warehouse Reserves</span>
                <div className="flex justify-between items-baseline">
                  <span className="text-3xl font-heading font-black text-white">{lowStockCount}</span>
                  <span className="text-xs font-mono font-bold px-1.5 py-0.5 bg-red-500/10 text-crimson rounded">LOW WARNING</span>
                </div>
              </div>

              <div onClick={() => setActiveTab('financials')} className="bg-[#131313] border border-[#222] p-5 rounded-lg space-y-1.5 hover:border-green-500/30 transition cursor-pointer">
                <span className="text-[10px] font-mono text-gray-500 uppercase block">Ledger Total Income</span>
                <div className="flex justify-between items-baseline">
                  <span className="text-2xl font-heading font-mono font-black text-white">฿{totalIncome.toLocaleString()}</span>
                  <span className="text-[10.5px] font-mono font-black text-green-500">฿{netProfit.toLocaleString()} NET</span>
                </div>
              </div>

              <div onClick={() => setActiveTab('support')} className="bg-[#131313] border border-[#222] p-5 rounded-lg space-y-1.5 hover:border-amber-500/30 transition cursor-pointer">
                <span className="text-[10px] font-mono text-gray-500 uppercase block">System Tickets</span>
                <div className="flex justify-between items-baseline">
                  <span className="text-3xl font-heading font-black text-white">
                    {tickets.filter(t => t.status === 'Checking').length}
                  </span>
                  <span className="text-xs font-mono font-bold px-1.5 py-0.5 bg-amber-500/10 text-amber-500 rounded">ACTIVE TICKETS</span>
                </div>
              </div>
            </div>

            {/* Quick appointment summary list */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Quick Actions over appointments */}
              <div className="lg:col-span-2 bg-[#131313] border border-[#222] p-6 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-base font-bold text-white uppercase flex items-center gap-2">
                    <Calendar className="w-4.5 h-4.5 text-crimson" />
                    <span>รายการนัดหมายจองคิวล่าสุด / LATEST APPOINTMENTS</span>
                  </h3>
                  <button 
                    onClick={() => setActiveTab('appointments')}
                    className="text-xs font-heading font-bold text-crimson hover:text-white uppercase inline-block"
                  >
                    ดูคิวทั้งหมด / View All
                  </button>
                </div>

                <div className="space-y-3">
                  {appointments.slice(0, 6).map((apt) => (
                    <div key={apt.id} className="bg-black/40 border border-[#222] hover:border-[#333] rounded p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2.5">
                          <span className="text-xs font-mono font-black bg-black text-[#8ae2ff] px-2 py-0.5 border border-[#303e45] rounded">
                            {apt.id}
                          </span>
                          <span className="font-heading font-bold text-white text-sm">คุณ{apt.name}</span>
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                            apt.status === 'Confirmed' ? 'bg-green-500/10 text-green-400' :
                            apt.status === 'Completed' ? 'bg-blue-500/10 text-blue-400' :
                            apt.status === 'Cancelled' ? 'bg-red-500/10 text-red-400' :
                            'bg-yellow-500/10 text-yellow-500' // Pending
                          }`}>
                            {apt.status}
                          </span>
                        </div>
                        <div className="text-xs text-gray-400 font-mono flex flex-wrap gap-x-4 gap-y-1">
                          <span>📅 {apt.date} ({apt.time} น.)</span>
                          <span className="text-crimson">🎨 ช่าง {apt.artist}</span>
                          <span>📐 {apt.style} / {apt.size}</span>
                        </div>
                        {apt.note && (
                          <p className="text-xs text-gray-500 font-light italic">"{apt.note}"</p>
                        )}
                      </div>

                      {/* Micro actions buttons based on current state */}
                      <div className="flex gap-2 text-[10.5px] font-mono font-bold uppercase self-start sm:self-center">
                        {apt.status === 'Pending' && (
                          <button
                            onClick={() => handleStatusChange(apt.id, 'Confirmed')}
                            className="bg-green-950 text-green-300 hover:bg-green-600 hover:text-white px-2.5 py-1.5 rounded transition cursor-pointer"
                          >
                            ยืนยัน / Confirm
                          </button>
                        )}
                        {apt.status === 'Confirmed' && (
                          <button
                            onClick={() => handleStatusChange(apt.id, 'Completed')}
                            className="bg-blue-950 text-blue-300 hover:bg-blue-600 hover:text-white px-2.5 py-1.5 rounded transition cursor-pointer"
                          >
                            จัดเสร็จสักเรียบร้อย
                          </button>
                        )}
                        {apt.status !== 'Completed' && apt.status !== 'Cancelled' && (
                          <button
                            onClick={() => confirmStatusChange(apt.id, 'Cancelled')}
                            className="bg-red-950 text-red-400 hover:bg-crimson hover:text-white px-2.5 py-1.5 rounded transition cursor-pointer"
                          >
                            ยกเลิกคิว
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Column: Mini inventory notification warning */}
              <div className="bg-[#131313] border border-[#222] p-6 rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-heading text-base font-bold text-white uppercase flex items-center gap-2">
                    <Package className="w-4.5 h-4.5 text-yellow-500" />
                    <span>วัสดุสักใกล้หมด / INVENTORY ALERT</span>
                  </h3>
                  <button 
                    onClick={() => setActiveTab('warehouse')}
                    className="text-xs font-mono font-bold uppercase text-yellow-500 underline inline-block"
                  >
                    ดูคลังสินค้า
                  </button>
                </div>

                <div className="space-y-3">
                  {inventory.filter(i => i.status === 'LOW').map((item) => (
                    <div key={item.code} className="bg-black/30 border border-[#222] p-3.5 rounded flex items-center justify-between">
                      <div className="space-y-0.5">
                        <span className="text-[10.5px] font-mono text-gray-500 block">{item.code}</span>
                        <h4 className="font-heading text-sm font-bold text-white uppercase">{item.name}</h4>
                        <span className="text-[10px] font-mono text-gray-400 block">หมวดหมู่: {item.category}</span>
                      </div>
                      <div className="text-right space-y-1.5">
                        <span className="text-xs font-mono font-black text-crimson bg-red-500/15 px-2 py-0.5 rounded border border-red-500/20 block">
                          เหลือ {item.currentStock} {item.unit}
                        </span>
                        <div className="flex gap-1 justify-end">
                          <button
                            onClick={() => handleStockDelta(item.code, 5)}
                            className="text-[9.5px] bg-green-950/50 hover:bg-green-950 text-green-400 px-1.5 py-0.5 border border-green-500/20 rounded font-mono font-black cursor-pointer"
                          >
                            +5 REFILL
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {lowStockCount === 0 && (
                    <div className="text-center py-6 text-xs font-mono text-gray-500">
                      ✅ วัสดุทุกรายการมีจำนวนเพียงพอในการรังสรรค์รอยสัก
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 2. FULL APPOINTMENTS MANAGER */}
        {activeTab === 'appointments' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="font-heading text-lg font-bold text-white uppercase">ระบบรายงานคิวงานสักโรงสลักหมึก</h2>
                <p className="text-xs text-gray-500 font-mono mt-0.5">MANAGE APPOINTMENTS, VERIFY SLOTS AND CHOOSE CONFIRMATION</p>
              </div>

              {/* Actions & Search appointments bar */}
              <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                <button
                  onClick={() => setIsPrintModalOpen(true)}
                  className="bg-crimson/10 hover:bg-crimson text-crimson hover:text-white border border-crimson/20 hover:border-crimson px-3.5 py-2 rounded text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>พิมพ์ใบสรุปคิวงานประจำวัน / Print Daily Summary</span>
                </button>
                <div className="relative max-w-xs w-full flex-1 sm:flex-initial">
                  <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <Search className="w-4 h-4 text-gray-500" />
                  </span>
                  <input
                    type="text"
                    value={searchAppointment}
                    onChange={(e) => setSearchAppointment(e.target.value)}
                    placeholder="ค้นชื่อ นัดหมาย ช่างสัก..."
                    className="w-full bg-[#131313] border border-[#2d2d2d] focus:border-crimson/50 focus:outline-none rounded pl-10 pr-3 py-2 text-xs text-white"
                  />
                </div>
              </div>
            </div>

            {/* Table or list list */}
            <div className="bg-[#131313] border border-[#222] rounded-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs font-sans">
                  <thead>
                    <tr className="bg-black/50 border-b border-[#222] text-gray-400 font-mono uppercase text-[10px] tracking-wider">
                      <th className="p-4">CODE / ID</th>
                      <th className="p-4">ข้อมูลลูกค้า / CLIENT</th>
                      <th className="p-4">วันที่นัดหมายคิว</th>
                      <th className="p-4">ช่างสักคนดูแล</th>
                      <th className="p-4">สไตล์ & ขนาด</th>
                      <th className="p-4">สถานะคิว</th>
                      <th className="p-4 text-right">การจัดการสถานะ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1e1e1e]">
                    {filteredAppointments.map((apt) => (
                      <tr key={apt.id} className="hover:bg-black/20">
                        <td className="p-4 font-mono font-bold text-crimson">{apt.id}</td>
                        <td className="p-4 space-y-0.5">
                          <div className="font-heading font-extrabold text-white text-sm">คุณ{apt.name}</div>
                          <div className="text-xs text-gray-500 font-mono flex gap-2">
                            <span>📞 {apt.phone}</span>
                            {apt.email && <span>✉️ {apt.email}</span>}
                          </div>
                        </td>
                        <td className="p-4 font-mono">
                          <span className="text-white block">{apt.date}</span>
                          <span className="text-gray-500">{apt.time} น.</span>
                        </td>
                        <td className="p-4">
                          <span className="bg-[#1b1b1b] px-2.5 py-1 rounded text-white font-semibold">ช่าง{apt.artist}</span>
                        </td>
                        <td className="p-4 text-gray-400 font-mono">
                          <span className="block text-white font-medium">{apt.style}</span>
                          <span>{apt.size}</span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                            apt.status === 'Confirmed' ? 'bg-green-500/10 text-green-400' :
                            apt.status === 'Completed' ? 'bg-blue-500/10 text-blue-400' :
                            apt.status === 'Cancelled' ? 'bg-red-500/10 text-red-400' :
                            'bg-yellow-500/10 text-yellow-500' // Pending
                          }`}>
                            {apt.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="inline-flex items-center gap-1 bg-black/40 p-1 rounded-md border border-[#2d2d2d] max-w-full overflow-x-auto">
                            <button
                              onClick={() => handleStatusChange(apt.id, 'Pending')}
                              title="สลับเป็นรอยืนยัน / Switch to Pending"
                              className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
                                apt.status === 'Pending'
                                  ? 'bg-yellow-500 text-black shadow-md font-extrabold'
                                  : 'text-yellow-500/60 hover:bg-yellow-500/10 hover:text-yellow-500'
                              }`}
                            >
                              Pending
                            </button>
                            <button
                              onClick={() => handleStatusChange(apt.id, 'Confirmed')}
                              title="สลับเป็นยืนยันแล้ว / Switch to Confirmed"
                              className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
                                apt.status === 'Confirmed'
                                  ? 'bg-green-500 text-black shadow-md font-extrabold'
                                  : 'text-green-500/60 hover:bg-green-500/10 hover:text-green-400'
                              }`}
                            >
                              Confirm
                            </button>
                            <button
                              onClick={() => handleStatusChange(apt.id, 'Completed')}
                              title="สลับเป็นเสร็จสิ้นแล้ว / Switch to Completed"
                              className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
                                apt.status === 'Completed'
                                  ? 'bg-blue-500 text-black shadow-md font-extrabold'
                                  : 'text-blue-500/60 hover:bg-blue-500/10 hover:text-blue-400'
                              }`}
                            >
                              Done
                            </button>
                            <span className="w-px h-3.5 bg-[#2d2d2d] mx-0.5 shrink-0"></span>
                            <button
                              onClick={() => confirmStatusChange(apt.id, apt.status === 'Cancelled' ? 'Pending' : 'Cancelled')}
                              title={apt.status === 'Cancelled' ? "กู้คืนสถานะเป็นรอยืนยัน / Revert status" : "ยกเลิกคิว / Cancel"}
                              className={`px-2.5 py-1 rounded text-[10px] font-mono font-bold transition-all cursor-pointer whitespace-nowrap ${
                                apt.status === 'Cancelled'
                                  ? 'bg-red-600 text-white shadow-md font-extrabold'
                                  : 'text-red-500/60 hover:bg-red-500/10 hover:text-red-400'
                              }`}
                            >
                              {apt.status === 'Cancelled' ? 'Cancelled' : 'Cancel'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 3. GALLERY MANAGEMENT */}
        {activeTab === 'gallery' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Split page: upload and view */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Add New design form */}
              <div className="bg-[#131313] border border-[#222] p-6 rounded-lg space-y-4 h-fit">
                <h3 className="font-heading text-base font-bold text-white uppercase flex items-center gap-2">
                  <Plus className="w-4.5 h-4.5 text-crimson" />
                  <span>เพิ่มรอยสักเข้าคลังรูปผลงาน / ADD WORK</span>
                </h3>

                <form onSubmit={handleAddGalleryItem} className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="text-gray-400 font-mono text-[10px]">ชื่อดีไซน์รูปรอยสัก / DESIGN NAME</label>
                    <input
                      type="text"
                      required
                      value={newGallery.name}
                      onChange={(e) => setNewGallery(p => ({ ...p, name: e.target.value }))}
                      className="w-full bg-black border border-[#2d2d2d] focus:border-crimson focus:outline-none p-2.5 rounded text-white"
                      placeholder="เช่น Biomechanical Angel Armor"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-gray-400 font-mono text-[10px]">ช่างสักผู้บันทึกเป็นเจ้าของ / ARTIST OWNER</label>
                    <select
                      value={newGallery.artist}
                      onChange={(e) => setNewGallery(p => ({ ...p, artist: e.target.value }))}
                      className="w-full bg-black border border-[#2d2d2d] focus:border-crimson focus:outline-none p-2.5 rounded text-white"
                    >
                      {ARTISTS.map(a => <option key={a.id} value={a.nameTh}>ช่าง {a.nameTh}</option>)}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-gray-400 font-mono text-[10px]">หมวดหมู่แนวทางลายสัก / CORE CATEGORY</label>
                    <select
                      value={newGallery.category}
                      onChange={(e) => setNewGallery(p => ({ ...p, category: e.target.value }))}
                      className="w-full bg-black border border-[#2d2d2d] focus:border-crimson focus:outline-none p-2.5 rounded text-white"
                    >
                      <option value="ไซเบอร์-แบล็คเวิร์ค">ไซเบอร์-แบล็คเวิร์ค / Cyber-Blackwork</option>
                      <option value="นีโอ-อิเรซูมิ">นีโอ-อิเรซูมิ / Neo-Irezumi</option>
                      <option value="ดาร์ก มินิมอล">ดาร์ก มินิมอล / Dark Minimal</option>
                      <option value="โอเรียนทัล">โอเรียนทัล / Oriental Traditional</option>
                      <option value="อักขระและฟอนต์">อักขระและฟอนต์ / Typography Gothic</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-gray-400 font-mono text-[10px]">ลิงก์รุปภาพรอยสัก (Hotlink URL)</label>
                    <input
                      type="url"
                      required
                      value={newGallery.imageUrl}
                      onChange={(e) => setNewGallery(p => ({ ...p, imageUrl: e.target.value }))}
                      className="w-full bg-black border border-[#2d2d2d] focus:border-crimson focus:outline-none p-2.5 rounded text-white font-mono"
                      placeholder="https://image-url.com/tattoo.jpg"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-gray-400 font-mono text-[10px]">คำอธิบายดีไซน์รายละเอียดรอยสัก</label>
                    <textarea
                      value={newGallery.description}
                      onChange={(e) => setNewGallery(p => ({ ...p, description: e.target.value }))}
                      rows={3}
                      className="w-full bg-black border border-[#2d2d2d] focus:border-crimson focus:outline-none p-2.5 rounded text-white"
                      placeholder="อธิบายสรีระแนวสัก หรือพารามิเตอร์อื่นๆ ของงาน"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-crimson hover:bg-red-600 text-white font-heading font-black tracking-widest text-xs uppercase py-3.5 rounded cursor-pointer transition shadow-md"
                  >
                    อัปโหลดพอร์ตขึ้นระวางระบบ / SUBMIT
                  </button>
                </form>
              </div>

              {/* Grid of upload view items with simulated modifiers */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#222] pb-3">
                  <h3 className="font-heading text-base font-bold text-white uppercase flex items-center gap-2">
                    <HardDrive className="w-4.5 h-4.5 text-crimson" />
                    <span>จัดการพอร์ตภาพในฐานเซสชั่น ({filteredAdminGallery.length} ดีไซน์)</span>
                  </h3>
                  
                  {/* Search Input Box */}
                  <div className="relative max-w-xs w-full">
                    <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                      <Search className="w-3.5 h-3.5 text-gray-500" />
                    </span>
                    <input
                      type="text"
                      value={searchAdminGallery}
                      onChange={(e) => setSearchAdminGallery(e.target.value)}
                      placeholder="ค้นหารอยสัก, ช่างสัก, หมวดหมู่..."
                      className="w-full bg-black border border-[#2d2d2d] focus:border-crimson focus:outline-none p-1.5 pl-9 rounded text-xs text-white"
                    />
                    {searchAdminGallery && (
                      <button 
                        onClick={() => setSearchAdminGallery('')}
                        className="absolute right-2.5 inset-y-0 flex items-center text-gray-500 hover:text-white cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {filteredAdminGallery.length === 0 ? (
                  <div className="text-center py-12 border border-dashed border-[#2d2d2d] rounded bg-[#101010]/30 animate-fadeIn">
                    <AlertCircle className="w-8 h-8 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-500 font-mono text-xs">ไม่พบผลงานดีไซเนอร์ที่ตรงตามคำค้นหา</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {filteredAdminGallery.map(item => (
                    <div key={item.id} className="bg-[#131313] border border-[#222] hover:border-[#333] rounded overflow-hidden flex flex-col justify-between">
                      <div className="flex p-3 gap-3.5">
                        <div className="w-20 h-24 bg-black rounded overflow-hidden flex-shrink-0">
                          <img 
                            src={item.imageUrl} 
                            alt={item.name} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover grayscale"
                          />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[9px] font-mono text-crimson font-medium tracking-widest bg-crimson/10 px-1.5 py-0.5 rounded uppercase">
                            {item.category}
                          </span>
                          <h4 className="font-heading font-bold text-white text-sm uppercase leading-tight line-clamp-1">{item.name}</h4>
                          <p className="text-[10px] text-gray-500 font-mono">ช่างสักผู้ดูแล: {item.artist}</p>
                          <p className="text-[11px] text-gray-400 line-clamp-2 leading-relaxed italic">"{item.description}"</p>
                        </div>
                      </div>

                      {/* Simulated modifiers buttons */}
                      <div className="bg-black/50 p-2 border-t border-[#1e1e1e] flex flex-wrap gap-1 text-[9.5px] font-mono font-bold uppercase text-gray-500">
                        <span className="px-1.5 py-0.5 rounded cursor-help hover:text-white hover:bg-white/5 transition border border-[#222]">
                          🏴‍☠️ GRAY FILTER
                        </span>
                        <span className="px-1.5 py-0.5 rounded cursor-help hover:text-white hover:bg-white/5 transition border border-[#222]">
                          🔆 ULTRA LIGHT
                        </span>
                        <button 
                          onClick={() => handleDeleteGalleryItem(item.id, item.name)}
                          className="px-1.5 py-0.5 rounded bg-red-950/40 text-red-400 hover:bg-crimson hover:text-white cursor-pointer transition border border-red-950 ml-auto flex items-center gap-1"
                          title="ลบผลงาน / Delete"
                        >
                          <Trash className="w-3 h-3" />
                          <span>DELETE</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* 4. WAREHOUSE STOCKS */}
        {activeTab === 'warehouse' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Insert Inventory Item Form */}
              <div className="bg-[#131313] border border-[#222] p-6 rounded-lg space-y-4 h-fit">
                <h3 className="font-heading text-base font-bold text-white uppercase flex items-center gap-2">
                  <Plus className="w-4.5 h-4.5 text-yellow-500" />
                  <span>เพิ่มวัสดุอุปกรณ์ใหม่ / ADD MATERIAL</span>
                </h3>

                <form onSubmit={handleAddInventoryItem} className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="text-gray-400 font-mono text-[10px]">รหัสบาร์โค้ดวัสดุ / COMPONENT CODE</label>
                    <input
                      type="text"
                      required
                      value={newInventory.code}
                      onChange={(e) => setNewInventory(p => ({ ...p, code: e.target.value }))}
                      className="w-full bg-black border border-[#2d2d2d] focus:border-yellow-500 focus:outline-none p-2.5 rounded text-white font-mono"
                      placeholder="เช่น NDL-1015M1"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-gray-400 font-mono text-[10px]">ชื่อวัสดุ / ITEM NAME</label>
                    <input
                      type="text"
                      required
                      value={newInventory.name}
                      onChange={(e) => setNewInventory(p => ({ ...p, name: e.target.value }))}
                      className="w-full bg-black border border-[#2d2d2d] focus:border-yellow-500 focus:outline-none p-2.5 rounded text-white"
                      placeholder="เช่น Kwadron Magnum Needle boxes"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-gray-400 font-mono text-[10px]">ประเภทหมวดหมู่</label>
                      <select
                        value={newInventory.category}
                        onChange={(e) => setNewInventory(p => ({ ...p, category: e.target.value }))}
                        className="w-full bg-black border border-[#2d2d2d] focus:border-yellow-500 focus:outline-none p-2.5 rounded text-white cursor-pointer"
                      >
                        <option value="Needles">Needles / เข็ม</option>
                        <option value="Inks">Inks / หมึกสีสัก</option>
                        <option value="Consumables">Consumables / เวชภัณฑ์</option>
                        <option value="Cleaning">Cleaning / น้ำยาฆ่าเชื้อ</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-gray-400 font-mono text-[10px]">หน่วยนับ / UNIT</label>
                      <input
                        type="text"
                        value={newInventory.unit}
                        onChange={(e) => setNewInventory(p => ({ ...p, unit: e.target.value }))}
                        className="w-full bg-black border border-[#2d2d2d] focus:border-yellow-500 focus:outline-none p-2.5 rounded text-white"
                        placeholder="เช่น Boxes, Bottles"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-gray-400 font-mono text-[10px]">จำนวนสต็อกตั้งต้น</label>
                      <input
                        type="number"
                        min="0"
                        value={newInventory.currentStock}
                        onChange={(e) => setNewInventory(p => ({ ...p, currentStock: e.target.value }))}
                        className="w-full bg-black border border-[#2d2d2d] focus:border-yellow-500 focus:outline-none p-2.5 rounded text-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-gray-400 font-mono text-[10px]">เกณฑ์แจ้งเตือนขั้นต่ำ</label>
                      <input
                        type="number"
                        min="1"
                        value={newInventory.minStock}
                        onChange={(e) => setNewInventory(p => ({ ...p, minStock: e.target.value }))}
                        className="w-full bg-black border border-[#2d2d2d] p-2.5 rounded text-white"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-black font-heading font-black tracking-widest text-xs uppercase py-3.5 rounded cursor-pointer transition shadow-md"
                  >
                    ขึ้นทะเบียนวัสดุในคลัง / CREATE ITEM
                  </button>
                </form>
              </div>

              {/* Warehouse Stock Matrix lists */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-heading text-base font-bold text-white uppercase flex items-center gap-2">
                      <HardDrive className="w-4.5 h-4.5 text-yellow-500" />
                      <span>สต็อกรหัสสินค้าในอุปกรณ์สากล ({inventory.length} รายการ)</span>
                    </h3>
                    {stockSortOrder !== 'none' && (
                      <span className="bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 font-mono text-[9px] px-2.5 py-0.5 rounded flex items-center gap-1 uppercase select-none">
                        <span>STOCK SORT: {stockSortOrder}</span>
                        <button 
                          id="btn-clear-stock-sort"
                          onClick={() => setStockSortOrder('none')} 
                          className="hover:text-white font-bold ml-1 cursor-pointer"
                          title="ล้างตัวจัดเรียง / Clear Sort"
                        >
                          ✕
                        </button>
                      </span>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 max-w-md w-full sm:justify-end">
                    <button
                      type="button"
                      onClick={() => setIsBulkImportOpen(true)}
                      className="bg-[#1a1a1a] hover:bg-yellow-600 hover:text-black border border-[#2d2d2d] hover:border-yellow-600 text-yellow-500 text-[10px] font-mono font-bold px-3 py-2 rounded transition-all cursor-pointer flex items-center gap-1.5"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>BULK CSV IMPORT</span>
                    </button>

                    <div className="relative max-w-[180px] w-full">
                      <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                        <Search className="w-3.5 h-3.5 text-gray-500" />
                      </span>
                      <input
                        type="text"
                        value={searchInventory}
                        onChange={(e) => setSearchInventory(e.target.value)}
                        placeholder="ค้นหาอุปกรณ์ หมวดหมู่..."
                        className="w-full bg-[#131313] border border-[#2d2d2d] p-1.5 focus:border-yellow-500 focus:outline-none rounded pl-9 text-xs text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-[#131313] border border-[#222] rounded-lg overflow-hidden">
                  <table className="w-full text-left border-collapse text-xs font-sans">
                    <thead>
                      <tr className="bg-black/40 border-b border-[#222] text-gray-500 font-mono uppercase text-[10px] tracking-wider">
                        <th className="p-4">รหัสสินค้า / CODE</th>
                        <th className="p-4">ชื่อผลิตภัณฑ์</th>
                        <th className="p-4">ประเภทคลัง</th>
                        <th 
                          id="th-inventory-stock"
                          onClick={() => {
                            setStockSortOrder(current => {
                              if (current === 'none') return 'desc';
                              if (current === 'desc') return 'asc';
                              return 'none';
                            });
                          }}
                          className="p-4 cursor-pointer select-none hover:text-white transition-all group duration-200"
                        >
                          <div className="flex items-center gap-1.5">
                            <span>ระดับจำลองสต็อก</span>
                            <span className="inline-flex transition-transform group-hover:scale-110">
                              {stockSortOrder === 'none' && <ArrowUpDown className="w-3.5 h-3.5 opacity-40 text-gray-500" />}
                              {stockSortOrder === 'asc' && <ArrowUp className="w-3.5 h-3.5 text-yellow-500 font-extrabold" />}
                              {stockSortOrder === 'desc' && <ArrowDown className="w-3.5 h-3.5 text-yellow-500 font-extrabold" />}
                            </span>
                          </div>
                        </th>
                        <th className="p-4">เกณฑ์เตือน</th>
                        <th className="p-4 text-right">ปรับเบิกใช้งานสต็อก</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1e1e1e]">
                      {filteredInventory.map(item => (
                        <tr key={item.code} className="hover:bg-black/20">
                          <td className="p-4 font-mono font-bold text-yellow-600">{item.code}</td>
                          <td className="p-4 font-heading font-bold text-white uppercase">{item.name}</td>
                          <td className="p-4">
                            <span className="bg-black/60 border border-[#222] text-[10px] font-mono font-bold px-2 py-0.5 rounded text-gray-400">
                              {item.category}
                            </span>
                          </td>
                          <td className="p-4">
                            <span className={`font-mono font-black text-xs px-2.5 py-1 rounded inline-block ${
                              item.status === 'LOW' 
                                ? 'bg-red-500/10 text-crimson border border-red-500/20 animate-pulse' 
                                : 'bg-green-500/10 text-green-400 border border-green-500/20'
                            }`}>
                              {item.currentStock} {item.unit}
                            </span>
                          </td>
                          <td className="p-4 font-mono text-gray-500">{item.minStock} {item.unit}</td>
                          <td className="p-4 text-right">
                            <div className="inline-flex gap-1 text-[10px] font-mono font-black">
                              <button
                                onClick={() => handleStockDelta(item.code, -1)}
                                className="bg-[#1b1b1b] border border-[#2d2d2d] hover:border-crimson text-gray-400 hover:text-white px-2 py-1 rounded cursor-pointer transition-colors"
                                title="เบิกออก 1 ชิ้น"
                              >
                                -1 USE
                              </button>
                              <button
                                onClick={() => handleStockDelta(item.code, 5)}
                                className="bg-[#1b1b1b] border border-[#2d2d2d] hover:border-green-500 text-gray-400 hover:text-white px-2 py-1 rounded cursor-pointer transition-colors"
                                title="รับของเข้า 5 ชิ้น"
                              >
                                +5 REFILL
                              </button>
                              <button
                                onClick={() => handleDeleteInventoryItem(item.code, item.name)}
                                className="bg-red-950/20 hover:bg-crimson border border-red-500/35 hover:border-crimson text-red-400 hover:text-white px-2 py-1 rounded cursor-pointer transition-colors flex items-center gap-1"
                                title="ลบวัสดุอุปกรณ์ / Delete"
                              >
                                <Trash className="w-3 h-3" />
                                <span>DEL</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 5. FINANCIALS */}
        {activeTab === 'financials' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Split Page: insert expense and summary ledger */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Add Expense Form */}
              <div className="bg-[#131313] border border-[#222] p-6 rounded-lg space-y-4 h-fit">
                <h3 className="font-heading text-base font-bold text-white uppercase flex items-center gap-2">
                  <Plus className="w-4.5 h-4.5 text-crimson" />
                  <span>บันทึกรายจ่ายใหม่ / NEW EXPENSE</span>
                </h3>

                <form onSubmit={handleAddExpense} className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="text-gray-400 font-mono text-[10px]">หัวข้อรายการจ่าย / TRANSACTION TITLE</label>
                    <input
                      type="text"
                      required
                      value={newExpense.title}
                      onChange={(e) => setNewExpense(p => ({ ...p, title: e.target.value }))}
                      className="w-full bg-black border border-[#2d2d2d] p-2.5 rounded text-white"
                      placeholder="เช่น ค่าน้ำยากลีนกลาสล็อตใหม่"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-gray-400 font-mono text-[10px]">หมวดหมู่รายจ่าย / TYPE</label>
                    <select
                      value={newExpense.category}
                      onChange={(e) => setNewExpense(p => ({ ...p, category: e.target.value }))}
                      className="w-full bg-black border border-[#2d2d2d] p-2.5 rounded text-white"
                    >
                      <option value="ค่าวัสดุและหมึกสัก / Materials">ค่าวัสดุและหมึกสัก / Materials</option>
                      <option value="ค่าสาธารณูปโภคสตูดิโอ / Utilities">ค่าสาธารณูปโภคสตูดิโอ / Utilities</option>
                      <option value="ค่าซ่อมบำรุง / Maintenance">ค่าซ่อมบำรุง / Maintenance</option>
                      <option value="ปันผลช่างสักสัญญาจ้าง / Commission Out">ปันผลช่างสักสัญญาจ้าง / Artist Commission</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-gray-400 font-mono text-[10px]">จำนวนเงิน (บาท)</label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={newExpense.amount}
                        onChange={(e) => setNewExpense(p => ({ ...p, amount: e.target.value }))}
                        className="w-full bg-black border border-[#2d2d2d] p-2.5 rounded text-white font-mono"
                        placeholder="฿"
                      />
                    </div>
                    
                    <div className="space-y-1">
                      <label className="text-gray-400 font-mono text-[10px]">ช่างสักเกี่ยวข้อง</label>
                      <select
                        value={newExpense.artist}
                        onChange={(e) => setNewExpense(p => ({ ...p, artist: e.target.value }))}
                        className="w-full bg-black border border-[#2d2d2d] p-2.5 rounded text-white"
                      >
                        <option value="">ไม่มี / None</option>
                        {ARTISTS.map(a => <option key={a.id} value={a.nameTh}>ช่าง {a.nameTh}</option>)}
                      </select>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-crimson hover:bg-red-600 text-white font-heading font-black tracking-widest text-xs uppercase py-3.5 rounded cursor-pointer transition shadow-md"
                  >
                    ยืนยันการตั้งจ่ายจริง / APPROVE EXPENDITURE
                  </button>
                </form>

                {/* Simulated Artist Commission Payout segment */}
                <div className="pt-6 border-t border-[#1f1f1f] space-y-3">
                  <h4 className="font-heading text-xs font-black text-white uppercase tracking-wider">
                    สัดส่วนปันผลช่างสักงวดปัจจุบัน (Commission Model)
                  </h4>
                  <div className="text-[11px] font-mono text-gray-400 space-y-2">
                    <p className="leading-snug">
                      ร้านปันผลให้ช่างสักในอัตรากึ่งหนึ่ง 50-50 สำหรับงานจองสำเร็จ:
                    </p>
                    <div className="space-y-1.5 bg-black/40 p-3 rounded border border-[#1f1f1f]">
                      <div className="flex justify-between">
                        <span>ช่างพิมพ์ดาว:</span>
                        <span className="text-white font-bold">฿{(totalIncome * 0.25).toLocaleString()} (50%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>ช่างกวิน:</span>
                        <span className="text-white font-bold">฿{(totalIncome * 0.15).toLocaleString()} (50%)</span>
                      </div>
                      <div className="flex justify-between">
                        <span>ช่างเจตน์:</span>
                        <span className="text-white font-bold">฿{(totalIncome * 0.10).toLocaleString()} (50%)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Ledger Lists */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Visual Custom Gothic Graph of Cashflow ratios */}
                <div className="bg-[#131313] border border-[#222] p-5 rounded-lg space-y-4">
                  <h3 className="font-heading text-xs font-black text-white uppercase tracking-widest flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span>แบบวิเคราะห์สัดส่วนกระแสเงินเข้า-ออกสตูดิโอ (RATIO CHART)</span>
                  </h3>
                  
                  <div className="space-y-4">
                    {/* Income block bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-gray-400">รายได้รวมสะสม (Total Income)</span>
                        <span className="text-green-400 font-bold">฿{totalIncome.toLocaleString()} (100%)</span>
                      </div>
                      <div className="h-2.5 w-full bg-black rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full" style={{ width: '100%' }} />
                      </div>
                    </div>

                    {/* Expense block bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-gray-400">รายจ่ายวัสดุและเครื่องมือ (Total Outflows)</span>
                        <span className="text-red-400 font-bold">฿{totalExpense.toLocaleString()} ({Math.min(100, Math.round((totalExpense / (totalIncome || 1)) * 100)) || 0}%)</span>
                      </div>
                      <div className="h-2.5 w-full bg-black rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-red-600 to-crimson rounded-full" style={{ width: `${Math.min(100, Math.round((totalExpense / (totalIncome || 1)) * 100))}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Ledger Listing Table */}
                <div className="bg-[#131313] border border-[#222] rounded-lg overflow-hidden">
                  <div className="p-4 border-b border-[#222] flex flex-wrap gap-2 justify-between items-center bg-black/20">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-heading text-xs font-black text-white uppercase tracking-wider">
                        บัญชีแยกประเภทสมุดเงินสดสตูดิโอสัก
                      </h3>
                      {dateSortOrder !== 'none' && (
                        <span className="bg-green-500/10 text-green-400 border border-green-500/20 font-mono text-[9px] px-2.5 py-0.5 rounded flex items-center gap-1 uppercase select-none">
                          <span>DATE SORT: {dateSortOrder}</span>
                          <button 
                            id="btn-clear-date-sort"
                            onClick={() => setDateSortOrder('none')} 
                            className="hover:text-white font-bold ml-1 cursor-pointer"
                            title="ล้างตัวจัดเรียง / Clear Sort"
                          >
                            ✕
                          </button>
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-gray-400 bg-black/60 px-2.5 py-1 rounded border border-[#222]">
                      {financials.length} TRANSACTIONS
                    </span>
                  </div>

                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-black/30 text-gray-500 font-mono uppercase text-[9px] tracking-widest border-b border-[#222]">
                        <th 
                          id="th-financials-date"
                          onClick={() => {
                            setDateSortOrder(current => {
                              if (current === 'none') return 'desc';
                              if (current === 'desc') return 'asc';
                              return 'none';
                            });
                          }}
                          className="p-3 cursor-pointer select-none hover:text-white transition-all group duration-200"
                        >
                          <div className="flex items-center gap-1.5">
                            <span>รหัสธุรกรรม / DATE</span>
                            <span className="inline-flex transition-transform group-hover:scale-110">
                              {dateSortOrder === 'none' && <ArrowUpDown className="w-3.5 h-3.5 opacity-40 text-gray-500" />}
                              {dateSortOrder === 'asc' && <ArrowUp className="w-3.5 h-3.5 text-green-500 font-extrabold" />}
                              {dateSortOrder === 'desc' && <ArrowDown className="w-3.5 h-3.5 text-green-500 font-extrabold" />}
                            </span>
                          </div>
                        </th>
                        <th className="p-3">หัวข้อหมวดหมู่การเงิน</th>
                        <th className="p-3">ประเภท</th>
                        <th className="p-3">ช่างสักผู้เกี่ยวข้อง</th>
                        <th className="p-3 text-right">จำนวนยอดบาท</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1f1f1f]">
                      {sortedFinancials.map(ledger => (
                        <tr key={ledger.trxId} className="hover:bg-black/10">
                          <td className="p-4 font-mono">
                            <span className="text-yellow-600 block font-bold">{ledger.trxId}</span>
                            <span className="text-gray-500">{ledger.date}</span>
                          </td>
                          <td className="p-4 space-y-0.5">
                            <span className="font-heading font-bold text-white uppercase block">{ledger.title}</span>
                            <span className="text-[10px] text-gray-500 font-mono block">หมวดหมู่: {ledger.category}</span>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] uppercase ${
                              ledger.type === 'income' 
                                ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                                : 'bg-red-500/10 text-crimson border border-red-500/20'
                            }`}>
                              {ledger.type}
                            </span>
                          </td>
                          <td className="p-4 font-mono font-medium text-gray-400">
                            {ledger.artist ? `ช่าง${ledger.artist}` : '-'}
                          </td>
                          <td className={`p-4 text-right font-mono font-black text-sm ${
                            ledger.type === 'income' ? 'text-green-400' : 'text-crimson'
                          }`}>
                            {ledger.type === 'income' ? '+' : '-'}฿{ledger.amount.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* 6. SYSTEM STATUS TICKET MANAGEMENT */}
        {activeTab === 'support' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Insert Ticket Form */}
              <div className="bg-[#131313] border border-[#222] p-6 rounded-lg space-y-4 h-fit">
                <h3 className="font-heading text-base font-bold text-white uppercase flex items-center gap-2">
                  <Plus className="w-4.5 h-4.5 text-amber-500" />
                  <span>ยื่นบัตรแจ้งความขัดข้อง / NEW TICKET</span>
                </h3>

                <form onSubmit={handleAddTicket} className="space-y-4 text-xs">
                  <div className="space-y-1">
                    <label className="text-gray-400 font-mono text-[10px]">หมวดหมู่ปัญหาสตูดิโอ / CORE CATEGORY</label>
                    <select
                      value={newTicket.category}
                      onChange={(e) => setNewTicket(p => ({ ...p, category: e.target.value }))}
                      className="w-full bg-black border border-[#2d2d2d] focus:border-amber-500 focus:outline-none p-2.5 rounded text-white"
                    >
                      <option value="ปัญหาเทคนิค / Google Sheets Sync">ปัญหาเทคนิค / Google Sheets Script Error</option>
                      <option value="ตั้งค่าระบบ / Backoffice Permission">ตั้งค่าระบบ / Backoffice Permissions</option>
                      <option value="อุปกรณ์สตูดิโอชำรุด / Repairs">อุปกรณ์สักในสตูดิโอชำรุด / Machine repairs</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-gray-400 font-mono text-[10px]">หัวข้อความผิดปกติ / ISSUE TITLE</label>
                    <input
                      type="text"
                      required
                      value={newTicket.title}
                      onChange={(e) => setNewTicket(p => ({ ...p, title: e.target.value }))}
                      className="w-full bg-black border border-[#2d2d2d] focus:border-amber-500 focus:outline-none p-2.5 rounded text-white"
                      placeholder="เช่น ปลั๊กพัดลมระเบิด"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-gray-400 font-mono text-[10px]">คำอธิบายปัญหาแบบเป็นรูปธรรม (DETAILS)</label>
                    <textarea
                      value={newTicket.details}
                      onChange={(e) => setNewTicket(p => ({ ...p, details: e.target.value }))}
                      rows={4}
                      className="w-full bg-black border border-[#2d2d2d] focus:border-amber-500 focus:outline-none p-2.5 rounded text-white"
                      placeholder="เช่น แถบเต้าเสียบหลังเคาน์เตอร์เบิกใช้ไฟเกินและไหม้"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-amber-600 hover:bg-amber-700 text-black font-heading font-black tracking-widest text-xs uppercase py-3.5 rounded cursor-pointer transition shadow-md"
                  >
                    ยื่นบัตรและเก็บบน Google Sheet / SUBMIT
                  </button>
                </form>
              </div>

              {/* Tickets and tracking logs lists */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Facebook Conversions API stats logs */}
                <div className="bg-[#131313] border border-[#222] p-5 rounded-lg">
                  <h4 className="font-heading text-xs font-black text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-green-500 animate-pulse" />
                    <span>ข้อมูลระบบการเชื่อมต่อโซเชียลมีเดีย / CONNECTIVITY TELEMETRY</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                    <div className="bg-black/40 p-3.5 rounded border border-[#222] flex justify-between items-center">
                      <span>Facebook Custom Conversions API</span>
                      <span className="text-green-500 font-bold select-none">• ONLINE / ACTIVE</span>
                    </div>
                    <div className="bg-black/40 p-3.5 rounded border border-[#222] flex justify-between items-center">
                      <span>CAPI Webhook Node Handshake</span>
                      <span className="text-[#aef4ff] font-bold">12ms Response</span>
                    </div>
                  </div>
                </div>

                {/* Ticket Listing Column */}
                <div className="space-y-3">
                  {tickets.map(ticket => (
                    <div 
                      key={ticket.id} 
                      className={`p-5 rounded-lg border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 transition ${
                        ticket.status === 'Resolved' 
                          ? 'bg-black/30 border-[#222]' 
                          : 'bg-[#181510] border-amber-500/30'
                      }`}
                    >
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-amber-500 tracking-wider bg-amber-500/5 px-2 py-0.5 rounded border border-amber-500/20 uppercase">
                          {ticket.category}
                        </span>
                        <h4 className="font-heading font-black text-sm text-white uppercase mt-1.5 flex items-center gap-2">
                          <span className="text-gray-500 font-mono text-xs">ID: {ticket.id}</span>
                          <span>•</span>
                          <span>{ticket.title}</span>
                        </h4>
                        <p className="text-xs text-gray-400 leading-relaxed font-light mt-1">"{ticket.details}"</p>
                      </div>

                      {/* Ticket Action Button */}
                      <div className="self-end sm:self-center">
                        {ticket.status === 'Checking' ? (
                          <button
                            onClick={() => handleSolveTicket(ticket.id)}
                            className="bg-amber-600 hover:bg-amber-700 text-black font-heading font-bold text-[10.5px] tracking-wider uppercase px-3 py-1.5 rounded transition cursor-pointer flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>ยืนยันแก้ไขสำเร็จ / RESOLVE</span>
                          </button>
                        ) : (
                          <div className="text-green-500 font-mono font-bold text-xs uppercase flex items-center gap-1 px-3 py-1.5 bg-green-500/10 rounded border border-green-500/10">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>แก้ไขเรียบร้อย / RESOLVED</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>
          </div>
        )}

        {/* TAB 8: CLIENT TESTIMONIALS MANAGEMENT */}
        {activeTab === 'reviews' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Header info */}
            <div className="border-b border-[#222] pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="font-heading text-xl font-black text-white uppercase tracking-tight">
                  ระบบคัดกรองเสียงสะท้อนคำชม / Testimonials Sandbox
                </h2>
                <p className="text-xs text-gray-400 font-mono mt-0.5">
                  VERIFY, DISMISS, AND APPROVE VISITING GUEST REVIEW CORES ON THE PUBLIC LEDGER
                </p>
              </div>

              {/* Reset to initial mock reviews support */}
              <button
                onClick={() => {
                  if (confirm('คุณต้องการรีเซ็ตรีวิวทั้งหมดกลับเป็นค่าเริ่มต้นหรือไม่?')) {
                    const { INITIAL_REVIEWS } = require('../data/mockData');
                    setReviews(INITIAL_REVIEWS);
                  }
                }}
                className="bg-zinc-900 hover:bg-black text-[10px] font-mono font-bold text-gray-400 hover:text-white px-3.5 py-2 rounded border border-[#222] cursor-pointer transition select-none uppercase tracking-wider"
              >
                Reset Default Reviews
              </button>
            </div>

            {/* Quick Summary Widgets */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#131313] border border-[#222] p-4 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-gray-500 uppercase block">Total Reviews</span>
                  <span className="text-2xl font-black font-heading text-white">{reviews.length} โพสต์</span>
                </div>
                <span className="text-xl">💬</span>
              </div>
              <div className="bg-[#131313] border border-[#222] p-4 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-gray-500 uppercase block">Pending Moderation</span>
                  <span className="text-2xl font-black font-heading text-crimson animate-pulse">
                    {reviews.filter(r => r.status === 'Pending').length} คำขอ
                  </span>
                </div>
                <span className="text-xl">⏳</span>
              </div>
              <div className="bg-[#131313] border border-[#222] p-4 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-gray-500 uppercase block">Approved Public</span>
                  <span className="text-2xl font-black font-heading text-green-500">
                    {reviews.filter(r => r.status === 'Approved').length} คำชม
                  </span>
                </div>
                <span className="text-xl">✅</span>
              </div>
            </div>

            {/* Main view rows */}
            <div className="space-y-6">
              
              {/* SECTION A: PENDING APPROVAL LIST */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-crimson animate-ping" />
                  <h3 className="font-heading text-xs font-black text-white uppercase tracking-wider">
                    รีวิวที่รอการตรวจสอบและอนุมัติ / PENDING APPROVAL REQUESTS ({reviews.filter(r => r.status === 'Pending').length})
                  </h3>
                </div>

                {reviews.filter(r => r.status === 'Pending').length === 0 ? (
                  <div className="p-8 bg-[#131313]/40 border border-[#222] rounded-xl text-center text-xs text-gray-500 italic">
                    ไม่มีรีวิวค้างรีเช็คแล้วในขณะนี้ ระบบเรียบร้อยดี! / No pending testimonials to moderate.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {reviews.filter(r => r.status === 'Pending').map((rev) => (
                      <div 
                        key={rev.id}
                        className="bg-[#131313] border border-crimson/30 hover:border-crimson/60 p-5 rounded-xl space-y-4 relative overflow-hidden transition-all shadow-[0_0_15px_rgba(230,25,46,0.02)]"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <span className="bg-crimson/10 text-crimson text-[9.5px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-crimson/25 mb-1.5 inline-block">
                              STATUS: PENDING MODERATION
                            </span>
                            <h4 className="font-heading font-black text-sm text-white uppercase">{rev.author}</h4>
                            <p className="text-[10px] font-mono text-gray-500">
                              ส่งข้อมูลเมื่อ: {new Date(rev.createdAt).toLocaleString('th-TH')}
                            </p>
                          </div>

                          <div className="flex gap-0.5 text-amber-500">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-3.5 h-3.5 fill-current ${
                                  i < rev.rating ? 'text-amber-500' : 'text-zinc-800'
                                }`} 
                              />
                            ))}
                          </div>
                        </div>

                        <div className="bg-black/40 border border-zinc-800 p-3.5 rounded-lg text-xs leading-relaxed text-gray-300 italic">
                          "{rev.message}"
                        </div>

                        {rev.artist && (
                          <div className="text-[10px] font-mono text-gray-500 flex items-center gap-2">
                            <span>ช่างสักเจ้าของลาย:</span>
                            <span className="text-amber-500 font-bold bg-amber-500/5 px-1.5 py-0.5 rounded border border-amber-500/20 uppercase">
                              ช่าง{rev.artist}
                            </span>
                          </div>
                        )}

                        <div className="flex items-center gap-2 pt-2 border-t border-[#1e1e1e]">
                          <button
                            onClick={async () => {
                              const updated = reviews.map(r => r.id === rev.id ? { ...r, status: 'Approved' as const } : r);
                              setReviews(updated);
                              if (appsScriptUrl) {
                                try {
                                  await fetch(appsScriptUrl, {
                                    method: 'POST',
                                    mode: 'no-cors',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({
                                      action: 'upsert',
                                      tableName: 'reviews',
                                      idColumn: 'id',
                                      data: {
                                        ...rev,
                                        status: 'Approved'
                                      }
                                    })
                                  });
                                } catch (err) {
                                  console.warn("Could not sync review status:", err);
                                }
                              }
                            }}
                            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-heading font-bold text-xs py-2.5 px-3 rounded cursor-pointer transition flex items-center justify-center gap-1.5"
                          >
                            <Check className="w-4 h-4" />
                            <span>อนุมัติให้แสดงหน้าหลัก</span>
                          </button>
                          <button
                            onClick={async () => {
                              if (confirm('คุณแน่ใจหรือไม่ว่าต้องการปฏิเสธ/ลบรีวิวนี้?')) {
                                const updated = reviews.filter(r => r.id !== rev.id);
                                setReviews(updated);
                                if (appsScriptUrl) {
                                  try {
                                    await fetch(appsScriptUrl, {
                                      method: 'POST',
                                      mode: 'no-cors',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({
                                        action: 'delete_row',
                                        tableName: 'reviews',
                                        idColumn: 'id',
                                        id: rev.id
                                      })
                                    });
                                  } catch (err) {
                                    console.warn("Could not delete review from sheet:", err);
                                  }
                                }
                              }
                            }}
                            className="bg-zinc-800 hover:bg-crimson text-gray-400 hover:text-white border border-[#2d2d2d] hover:border-crimson py-2.5 px-3 rounded cursor-pointer transition"
                            title="ปฏิเสธคำขอ / Reject"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SECTION B: PUBLICLY DISPLAYED LIST */}
              <div className="space-y-3 pt-6 border-t border-[#1f1f1f]">
                <h3 className="font-heading text-xs font-black text-gray-400 uppercase tracking-wider">
                  รีวิวที่จัดแสดงโชว์อยู่บนหน้าร้าน / ON STAGE PUBLIC PORTAL ({reviews.filter(r => r.status === 'Approved').length})
                </h3>

                {reviews.filter(r => r.status === 'Approved').length === 0 ? (
                  <div className="p-8 bg-[#131313]/40 border border-[#222] rounded-xl text-center text-xs text-gray-500 italic">
                    ไม่มีคำชมที่ได้รับอนุมัติในระบบ / No approved reviews exist.
                  </div>
                ) : (
                  <div className="bg-[#131313] border border-[#222] rounded-xl overflow-hidden animate-fadeIn">
                    <div className="overflow-x-auto border-t border-[#222]">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-black text-[10px] text-[#888] font-mono tracking-wider uppercase border-b border-[#222]">
                            <th className="p-4">ผู้สลักศิลป์ / Author</th>
                            <th className="p-4">ช่างรังสรรค์ / Artist</th>
                            <th className="p-4">คะแนน / Score</th>
                            <th className="p-4">ข้อความคอมเมนต์ / Message</th>
                            <th className="p-4">วันที่บันทึก / Created At</th>
                            <th className="p-4 text-right">การจัดการ / Act</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#1c1c1c]">
                          {reviews.filter(r => r.status === 'Approved').map((rev) => (
                            <tr key={rev.id} className="hover:bg-neutral-900/40 transition-colors">
                              <td className="p-4 font-bold text-white uppercase">{rev.author}</td>
                              <td className="p-4 font-mono text-crimson">ช่าง{rev.artist}</td>
                              <td className="p-4 text-amber-400 font-bold whitespace-nowrap">★ {rev.rating} / 5</td>
                              <td className="p-4 text-gray-300 font-light max-w-sm truncate" title={rev.message}>
                                {rev.message}
                              </td>
                              <td className="p-4 text-gray-500 font-mono">{new Date(rev.createdAt).toLocaleDateString('th-TH')}</td>
                              <td className="p-4 text-right whitespace-nowrap">
                                <button
                                  onClick={async () => {
                                    const updated = reviews.map(r => r.id === rev.id ? { ...r, status: 'Pending' as const } : r);
                                    setReviews(updated);
                                    if (appsScriptUrl) {
                                      try {
                                        await fetch(appsScriptUrl, {
                                          method: 'POST',
                                          mode: 'no-cors',
                                          headers: { 'Content-Type': 'application/json' },
                                          body: JSON.stringify({
                                            action: 'upsert',
                                            tableName: 'reviews',
                                            idColumn: 'id',
                                            data: {
                                              ...rev,
                                              status: 'Pending'
                                            }
                                          })
                                        });
                                      } catch (err) {
                                        console.warn("Could not sync hidden review state:", err);
                                      }
                                    }
                                  }}
                                  className="text-orange-400 hover:text-white hover:underline uppercase font-mono text-[10.5px] cursor-pointer transition mr-4"
                                >
                                  ซ่อนรีวิว
                                </button>
                                <button
                                  onClick={async () => {
                                    if (confirm('คุณต้องการลบรีวิวนี้ทิ้งถาวรหรือไม่?')) {
                                      const updated = reviews.filter(r => r.id !== rev.id);
                                      setReviews(updated);
                                      if (appsScriptUrl) {
                                        try {
                                          await fetch(appsScriptUrl, {
                                            method: 'POST',
                                            mode: 'no-cors',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({
                                              action: 'delete_row',
                                              tableName: 'reviews',
                                              idColumn: 'id',
                                              id: rev.id
                                            })
                                          });
                                        } catch (err) {
                                          console.warn("Could not delete review from sheet:", err);
                                        }
                                      }
                                    }
                                  }}
                                  className="text-red-500 hover:text-red-400 font-mono text-[10.5px] cursor-pointer transition inline-flex items-center gap-1 mr-2"
                                >
                                  <Trash className="w-3.5 h-3.5" />
                                  <span>ลบ</span>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* TAB: ARTISTS MANAGEMENT */}
        {activeTab === 'artists' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="border-b border-[#222] pb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="font-heading text-xl font-black text-white uppercase tracking-tight">
                  ทำเนียบศิลปินและช่างสักสตูดิโอ / Artist & Master Guild
                </h2>
                <p className="text-xs text-gray-400 font-mono mt-0.5 uppercase tracking-wide">
                  MANAGE TATTOO SAGES, EXPERTISE, DAILY AVAILABILITY, AND PERSONAL SHIELD DATA
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  if (confirm('คุณต้องการรีเซ็ตทีมช่างศิลปินกลับเป็นค่าเริ่มต้นใช่หรือไม่?')) {
                    setArtists(ARTISTS);
                    addToast('รีเซ็ตรายชื่อศิลปินช่างสำเร็จ', 'ทีมช่างศิลปินสตูดิโอกลับคืนเป็นต้นแบบโครงร่างสาธิตเรียบร้อย!', 'info');
                  }
                }}
                className="bg-zinc-900 hover:bg-black text-[10px] font-mono font-bold text-gray-400 hover:text-white px-3.5 py-2 rounded border border-[#222] cursor-pointer transition select-none uppercase tracking-wider"
              >
                Reset Default Artists
              </button>
            </div>

            {/* Main Content Layout: Form on Left/Right, List on the other side */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              
              {/* SECTION: ADD OR EDIT FORM */}
              <div className="lg:col-span-4 bg-[#131313] border border-[#222] rounded-xl p-5 space-y-5">
                <div className="border-b border-[#222] pb-3 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse" />
                  <h3 className="font-heading text-sm font-black text-white uppercase tracking-wider">
                    {editingArtistId ? 'แก้ไขข้อมูลช่างสัก / EDIT ARTIST' : 'ลงทะเบียนช่างสักใหม่ / ADD MASTER'}
                  </h3>
                </div>

                <form onSubmit={async (e) => {
                  e.preventDefault();
                  
                  if (editingArtistId && editingArtistData) {
                    // EDIT MODE
                    const updated = artists.map(a => a.id === editingArtistId ? editingArtistData : a);
                    setArtists(updated);
                    addToast('แก้ไขข้อมูลช่างสำเร็จ', `ปรับปรุงสเปคของ ช่าง${editingArtistData.nameTh} เรียบร้อยแล้ว`, 'success');
                    
                    if (appsScriptUrl) {
                      try {
                        await fetch(appsScriptUrl, {
                          method: 'POST',
                          mode: 'no-cors',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            action: 'upsert',
                            tableName: 'artists',
                            idColumn: 'id',
                            data: editingArtistData
                          })
                        });
                      } catch (err) {
                        console.warn("Could not sync artist edit to Google Sheets:", err);
                      }
                    }
                    
                    // Reset
                    setEditingArtistId(null);
                    setEditingArtistData(null);
                  } else {
                    // ADD MODE
                    if (!newArtist.nameTh || !newArtist.nameEn) {
                      addToast('กรุณากรอกชื่อ', 'จำเป็นต้องกรอกระบุชื่อภาษาไทยและอังกฤษให้ครบเพื่อความถูกต้องเสถียร', 'warning');
                      return;
                    }

                    const freshArtist: Artist = {
                      id: `art-${Math.floor(100 + Math.random() * 900)}`,
                      nameTh: newArtist.nameTh,
                      nameEn: newArtist.nameEn,
                      specialty: newArtist.specialty,
                      imageUrl: newArtist.imageUrl || 'https://lh3.googleusercontent.com/aida-public/AB6AXuAygxjP4n5S3j3K8wCXwKgQ1Wqx5Oeoly0u9_-37018ci3SzUZeGbZZNsZwK0XXxTshgTGvOVPvnFDevirOKu87RcfYgzkN9rgZaqyehiHonC5f3-1eTiANKF5WFl1Qi_g9AI9mDzIMrHqM_XQSUCY5GJ8mQbc3HJOF2IHNQcZqdackfMrKEvXUp4HORZ52EAQb1V4Wd2nlw-j7B_r_ukuJfx_nwpmfeORip0zEfaGwWQrz0zTxTLvh-GZB_jPusQIIZiqfrIzOs78',
                      experience: newArtist.experience,
                      availability: newArtist.availability
                    };

                    setArtists(prev => [...prev, freshArtist]);
                    addToast('ลงทะเบียนช่างสักสำเร็จ / Sages Registered', `ช่าง ${freshArtist.nameTh} ได้เข้าประจำกลุ่มสมาคมพร้อมรับลูกค้าใหม่!`, 'success');

                    if (appsScriptUrl) {
                      try {
                        await fetch(appsScriptUrl, {
                          method: 'POST',
                          mode: 'no-cors',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            action: 'upsert',
                            tableName: 'artists',
                            idColumn: 'id',
                            data: freshArtist
                          })
                        });
                      } catch (err) {
                        console.warn("Could not sync newly added artist to sheets:", err);
                      }
                    }

                    // Reset form
                    setNewArtist({
                      nameTh: '',
                      nameEn: '',
                      specialty: 'Black & Grey Master',
                      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAygxjP4n5S3j3K8wCXwKgQ1Wqx5Oeoly0u9_-37018ci3SzUZeGbZZNsZwK0XXxTshgTGvOVPvnFDevirOKu87RcfYgzkN9rgZaqyehiHonC5f3-1eTiANKF5WFl1Qi_g9AI9mDzIMrHqM_XQSUCY5GJ8mQbc3HJOF2IHNQcZqdackfMrKEvXUp4HORZ52EAQb1V4Wd2nlw-j7B_r_ukuJfx_nwpmfeORip0zEfaGwWQrz0zTxTLvh-GZB_jPusQIIZiqfrIzOs78',
                      experience: '5 Years',
                      availability: 'Daily'
                    });
                  }
                }} className="space-y-4">
                  
                  {/* Name TH */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-gray-500 block">ชื่อภาษาไทย / Thai Name</label>
                    <input
                      type="text"
                      required
                      placeholder="เช่น แก้วดารา, พิมพ์ดาว, นิรนาม"
                      value={editingArtistId && editingArtistData ? editingArtistData.nameTh : newArtist.nameTh}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (editingArtistId && editingArtistData) {
                          setEditingArtistData({ ...editingArtistData, nameTh: val });
                        } else {
                          setNewArtist({ ...newArtist, nameTh: val });
                        }
                      }}
                      className="w-full bg-[#1b1b1b] border border-[#2d2d2d] focus:border-crimson focus:outline-none px-3.5 py-2.5 rounded-lg text-xs text-white"
                    />
                  </div>

                  {/* Name EN */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-gray-500 block">ชื่อภาษาอังกฤษ / English Name</label>
                    <input
                      type="text"
                      required
                      placeholder="เช่น KAWDARA, PIMDAW, SHADOW"
                      value={editingArtistId && editingArtistData ? editingArtistData.nameEn : newArtist.nameEn}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (editingArtistId && editingArtistData) {
                          setEditingArtistData({ ...editingArtistData, nameEn: val });
                        } else {
                          setNewArtist({ ...newArtist, nameEn: val });
                        }
                      }}
                      className="w-full bg-[#1b1b1b] border border-[#2d2d2d] focus:border-crimson focus:outline-none px-3.5 py-2.5 rounded-lg text-xs text-white"
                    />
                  </div>

                  {/* Specialty */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-gray-500 block">ความเชี่ยวชาญ / Specialty Line</label>
                    <input
                      type="text"
                      placeholder="เช่น Black & Grey, Cyberpunk Gothic, Portrait"
                      value={editingArtistId && editingArtistData ? editingArtistData.specialty : newArtist.specialty}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (editingArtistId && editingArtistData) {
                          setEditingArtistData({ ...editingArtistData, specialty: val });
                        } else {
                          setNewArtist({ ...newArtist, specialty: val });
                        }
                      }}
                      className="w-full bg-[#1b1b1b] border border-[#2d2d2d] focus:border-crimson focus:outline-none px-3.5 py-2.5 rounded-lg text-xs text-white"
                    />
                  </div>

                  {/* Experience */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-gray-500 block">ประสบการณ์ / Work Experience</label>
                    <input
                      type="text"
                      placeholder="เช่น 5 Years, 8 Years, 12 Years"
                      value={editingArtistId && editingArtistData ? editingArtistData.experience : newArtist.experience}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (editingArtistId && editingArtistData) {
                          setEditingArtistData({ ...editingArtistData, experience: val });
                        } else {
                          setNewArtist({ ...newArtist, experience: val });
                        }
                      }}
                      className="w-full bg-[#1b1b1b] border border-[#2d2d2d] focus:border-crimson focus:outline-none px-3.5 py-2.5 rounded-lg text-xs text-white"
                    />
                  </div>

                  {/* Availability */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-gray-500 block">คิววันทำงาน / Availability Status</label>
                    <select
                      value={editingArtistId && editingArtistData ? editingArtistData.availability : newArtist.availability}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (editingArtistId && editingArtistData) {
                          setEditingArtistData({ ...editingArtistData, availability: val });
                        } else {
                          setNewArtist({ ...newArtist, availability: val });
                        }
                      }}
                      className="w-full bg-[#1b1b1b] border border-[#2d2d2d] focus:border-crimson focus:outline-none px-3.5 py-2.5 rounded-lg text-xs text-white cursor-pointer"
                    >
                      <option value="Daily">Daily (ทุกวัน)</option>
                      <option value="Weekend">Weekends Only (เฉพาะเสาร์อาทิตย์)</option>
                      <option value="Weekdays">Weekdays Only (เฉพาะจันทร์ถึงศุกร์)</option>
                      <option value="Booking Only">On-Booking Only (นัดหมายจองล่วงหน้าเท่านั้น)</option>
                    </select>
                  </div>

                  {/* Image Profile URL */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono uppercase text-gray-500 block">ลิ้งก์รูปไอคอนภาพโปรไฟล์ / Portrait Image URL</label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={editingArtistId && editingArtistData ? editingArtistData.imageUrl : newArtist.imageUrl}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (editingArtistId && editingArtistData) {
                          setEditingArtistData({ ...editingArtistData, imageUrl: val });
                        } else {
                          setNewArtist({ ...newArtist, imageUrl: val });
                        }
                      }}
                      className="w-full bg-[#1b1b1b] border border-[#2d2d2d] focus:border-crimson focus:outline-none px-3.5 py-2.5 rounded-lg text-xs text-white font-mono"
                    />
                  </div>

                  {/* Actions Submit / Cancel */}
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      type="submit"
                      className="flex-1 bg-crimson hover:bg-red-700 text-white font-heading font-black text-xs py-3 px-4 rounded-lg cursor-pointer transition uppercase tracking-wider text-center"
                    >
                      {editingArtistId ? 'อัปเดต / UPDATE MASTER' : 'ลงทะเบียน / REGISTER Master'}
                    </button>
                    {editingArtistId && (
                      <button
                        type="button"
                        onClick={() => {
                          setEditingArtistId(null);
                          setEditingArtistData(null);
                        }}
                        className="bg-zinc-800 hover:bg-zinc-700 text-gray-300 font-heading font-bold text-xs py-3 px-3 rounded-lg cursor-pointer transition uppercase tracking-wider text-center border border-[#333]"
                      >
                        ยกเลิก
                      </button>
                    )}
                  </div>

                </form>
              </div>

              {/* LIST OF ARTISTS (GRID & LIST) */}
              <div className="lg:col-span-8 space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {artists.map((art) => (
                    <div 
                      key={art.id} 
                      className="bg-[#131313] border border-[#222] p-5 rounded-xl block relative group hover:border-[#333] transition-all flex items-start gap-4"
                    >
                      {/* Avatar Image */}
                      <div className="w-20 h-24 rounded-lg bg-[#1a1a1a] border border-[#222] overflow-hidden shrink-0">
                        <img 
                          src={art.imageUrl} 
                          alt={art.nameTh}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover grayscale"
                        />
                      </div>

                      {/* Info Panel */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-mono tracking-widest text-[#999] block uppercase">
                              ID: {art.id}
                            </span>
                            <h4 className="font-heading font-black text-white text-md leading-tight">
                              ช่าง{art.nameTh}
                            </h4>
                            <span className="text-xs text-gray-400 font-mono italic block">
                              {art.nameEn}
                            </span>
                          </div>
                          
                          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono text-[9px] px-2 py-0.5 rounded-full">
                            {art.availability}
                          </span>
                        </div>

                        <div className="text-[11px] space-y-0.5 border-t border-[#1d1d1d] pt-2">
                          <p className="text-gray-300 flex items-center gap-1.5">
                            <span className="text-gray-500 font-mono">Expertise:</span>
                            <span className="font-bold text-white">{art.specialty}</span>
                          </p>
                          <p className="text-gray-300 flex items-center gap-1.5">
                            <span className="text-gray-500 font-mono">Exp:</span>
                            <span className="font-mono text-crimson font-bold">{art.experience}</span>
                          </p>
                        </div>

                        {/* Interactive Buttons */}
                        <div className="border-t border-[#1d1d1d] pt-2.5 flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingArtistId(art.id);
                              setEditingArtistData({ ...art });
                              // scroll to the form panel elegantly
                              document.querySelector('form')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white font-mono text-[10.5px] cursor-pointer transition px-3 py-1.5 rounded border border-white/5"
                          >
                            แก้ไข / EDIT
                          </button>

                          <button
                            type="button"
                            onClick={async () => {
                              if (confirm(`คุณต้องการถอนรายชื่อ ช่าง${art.nameTh} ออกจากระบบถาวรใช่หรือไม่?`)) {
                                const remaining = artists.filter(a => a.id !== art.id);
                                setArtists(remaining);
                                addToast('ลบข้อมูลศิลปินช่างเรียบร้อย', `ถอดถอน ช่าง${art.nameTh} พ้นจากสมาคมเสร็จสมบูรณ์`, 'info');
                                
                                if (appsScriptUrl) {
                                  try {
                                    await fetch(appsScriptUrl, {
                                      method: 'POST',
                                      mode: 'no-cors',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({
                                        action: 'delete',
                                        tableName: 'artists',
                                        idColumn: 'id',
                                        id: art.id
                                      })
                                    });
                                  } catch (err) {
                                    console.warn("Could not delete artist from Sheets:", err);
                                  }
                                }
                              }
                            }}
                            className="text-red-500 hover:text-red-400 font-mono text-[10.5px] cursor-pointer transition flex items-center gap-1 shrink-0"
                          >
                            <Trash className="w-3.5 h-3.5" />
                            <span>ถอนรายชื่อ / DELETE</span>
                          </button>
                        </div>
                      </div>

                    </div>
                  ))}
                </div>

              </div>

            </div>

          </div>
        )}

        {/* BRAND IDENTITY CUSTOMIZATION PANEL */}
        {activeTab === 'brand' && (
          <div className="space-y-8 animate-fadeIn max-w-4xl">
            <div className="bg-[#131313] border border-[#222] p-6 sm:p-8 rounded-xl space-y-6">
              
              <div className="flex items-center space-x-4 border-b border-[#222] pb-6">
                <span className="w-12 h-12 rounded bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center justify-center font-heading text-lg">
                  <Settings className="w-6 h-6 text-crimson" />
                </span>
                <div>
                  <h2 className="font-heading text-lg font-black text-white uppercase tracking-tight">
                    ระบบจัดการข้อมูลแบรนด์สตูดิโอ / Brand Identity & Customization
                  </h2>
                  <p className="text-xs text-gray-400 font-mono mt-0.5 uppercase tracking-wide">
                    Configure your studio brand name and custom logo image across the platform
                  </p>
                </div>
              </div>

              {/* Form Grid & Preview columns */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Inputs Column */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* Brand Presets Helper */}
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-mono text-gray-400 font-bold tracking-wider block">
                      ⚡ เลือกพรีเซ็ตด่วน / QUICK BRAND PRESETS:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { name: 'KAGE TATTOO', logo: '' },
                        { name: 'CHRONO ARTIST', logo: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&q=80&w=250' },
                        { name: 'SACRED INK', logo: '' },
                        { name: 'CYBER TATTOO', logo: 'https://images.unsplash.com/photo-1621574539437-4b7cb63120b8?auto=format&fit=crop&q=80&w=250' },
                        { name: 'GOLDEN DRAGON', logo: '' }
                      ].map((preset) => (
                        <button
                          key={preset.name}
                          type="button"
                          onClick={() => {
                            setInputBrandName(preset.name);
                            setInputBrandLogoUrl(preset.logo);
                            addToast('โหลดข้อมูลพรีเซ็ตชั่วคราว / Preset Preloaded', `กด "บันทึก" ด้านล่างเพื่อยืนยันสไตล์ "${preset.name}"`, 'info');
                          }}
                          className="bg-[#1a1a1a] border border-[#2d2d2d] hover:border-rose-500 text-gray-300 hover:text-white px-2.5 py-1.5 rounded text-[10.5px] cursor-pointer transition flex items-center gap-1 font-mono uppercase font-semibold"
                        >
                          <span>{preset.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Brand Name Input */}
                  <div className="space-y-2">
                    <label className="text-gray-300 font-bold text-xs flex items-center justify-between">
                      <span>ชื่อแบรนด์สตูดิโอ / STUDIO NAME</span>
                      <span className="text-[10px] text-gray-500 font-mono">Visible on navbar, titles and footer</span>
                    </label>
                    <input
                      type="text"
                      value={inputBrandName}
                      onChange={(e) => setInputBrandName(e.target.value)}
                      placeholder="เช่น KAGE TATTOO"
                      className="w-full bg-black border border-[#2d2d2d] focus:border-crimson focus:outline-none p-3 rounded font-sans text-xs text-white placeholder-gray-600 transition-all font-bold tracking-wide"
                    />
                  </div>

                  {/* Brand Logo URL Input */}
                  <div className="space-y-2">
                    <label className="text-gray-300 font-bold text-xs flex items-center justify-between">
                      <span>ลิงก์ภาพภาพโลโก้แบรนด์ / BRAND LOGO IMAGE URL</span>
                      <span className="text-[10px] text-gray-500 font-mono">HTTPS URL to custom SVG or photo</span>
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={inputBrandLogoUrl}
                        onChange={(e) => setInputBrandLogoUrl(e.target.value)}
                        placeholder="https://example.com/logo.png (เว้นว่างไว้เพื่อใช้ไอคอนอักษรย่ออย่างหรู)"
                        className="flex-1 bg-black border border-[#2d2d2d] focus:border-crimson focus:outline-none p-3 rounded font-mono text-xs text-white placeholder-gray-650 transition-all font-bold tracking-wide"
                      />
                    </div>
                    <span className="text-[10px] text-gray-500 block leading-tight mt-2">
                      * หากเว้นว่างไว้ ระบบจะคำนวณนำเอาอักษรตัวแรกของชื่อสตูดิโอ (เช่น "{inputBrandName.trim().charAt(0).toUpperCase() || 'K'}") มาฉายบนเข็มตราประทับสีแดงแบบนีโอกอธิคดั้งเดิมโดยอัตโนมัติ
                    </span>
                  </div>

                  {/* Primary 'Crimson' Theme Color Customizer */}
                  <div className="space-y-3 bg-black/30 border border-[#222] p-4 rounded-xl">
                    <label className="text-gray-300 font-bold text-xs flex items-center justify-between">
                      <span className="flex items-center gap-1.5">🎨 โทนสีหลักของแอป / PRIMARY 'CRIMSON' THEME COLOR</span>
                      <span className="text-[10px] text-gray-500 font-mono">Real-time theme coloring</span>
                    </label>
                    
                    {/* Presets */}
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase font-mono text-gray-400 font-bold tracking-wider block">
                        ✨ พรีเซ็ตด่วน / THEME PRESETS:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { name: 'Classic Crimson', hex: '#e6192e' },
                          { name: 'Dragon Gold', hex: '#d4af37' },
                          { name: 'Gothic Violet', hex: '#7a1fab' },
                          { name: 'Chrono Blue', hex: '#1e40af' },
                          { name: 'Bio Toxic Green', hex: '#15803d' },
                          { name: 'Cyberpunk Pink', hex: '#db2777' },
                        ].map((preset) => (
                          <button
                            key={preset.name}
                            type="button"
                            onClick={() => {
                              setInputCrimsonColor(preset.hex);
                              if (onUpdateCrimsonColor) {
                                onUpdateCrimsonColor(preset.hex);
                              }
                            }}
                            className="bg-[#151515] hover:bg-[#222] border border-[#2d2d2d] rounded-md px-2 py-1 text-[9.5px] text-gray-300 font-mono flex items-center gap-1.5 transition cursor-pointer"
                          >
                            <span 
                              className="w-2.5 h-2.5 rounded-full inline-block border border-black/30 shadow-sm"
                              style={{ backgroundColor: preset.hex }}
                            />
                            <span>{preset.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Integrated Custom Selector & Hex String input */}
                    <div className="flex items-center gap-3">
                      {/* Interactive Color Box overlaying a hidden type="color" */}
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-[#2d2d2d] cursor-pointer bg-neutral-900 flex items-center justify-center shrink-0">
                        <input
                          type="color"
                          id="color-picker-input"
                          value={inputCrimsonColor}
                          onChange={(e) => {
                            const val = e.target.value;
                            setInputCrimsonColor(val);
                            if (onUpdateCrimsonColor) {
                              onUpdateCrimsonColor(val);
                            }
                          }}
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        <div 
                          className="w-7 h-7 rounded-md border border-[#333] shadow"
                          style={{ backgroundColor: inputCrimsonColor }}
                        />
                      </div>
                      
                      {/* Hex input */}
                      <div className="relative flex-1">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 font-mono text-xs">#</span>
                        <input
                          type="text"
                          maxLength={7}
                          value={inputCrimsonColor.startsWith('#') ? inputCrimsonColor.substring(1) : inputCrimsonColor}
                          onChange={(e) => {
                            let val = e.target.value.trim();
                            if (!val.startsWith('#')) {
                              val = '#' + val;
                            }
                            setInputCrimsonColor(val);
                            // Only apply if it's a valid 3 or 6 hex code
                            if (/^#[0-9A-F]{6}$/i.test(val) || /^#[0-9A-F]{3}$/i.test(val)) {
                              if (onUpdateCrimsonColor) {
                                onUpdateCrimsonColor(val);
                              }
                            }
                          }}
                          placeholder="E6192E"
                          className="w-full bg-black border border-[#2d2d2d] focus:border-crimson focus:outline-none pl-7 pr-3 py-2.5 rounded-lg font-mono text-xs text-white placeholder-gray-700 transition-all font-bold tracking-wide"
                        />
                      </div>
                      
                      <div className="text-[10px] text-gray-400 font-mono shrink-0 bg-white/5 border border-white/5 px-2.5 py-2 rounded-lg leading-tight">
                        คลิกสีเพื่อเปิดจานสี / Click color box
                      </div>
                    </div>
                  </div>

                  {/* Save Brand Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      id="save-brand-trigger"
                      onClick={() => {
                        if (!inputBrandName.trim()) {
                          addToast('ข้อมูลไม่ถูกต้อง / Invalid Name', 'โปรดระบุชื่อแบรนด์อย่างน้อย 1 ตัวอักษร', 'error');
                          return;
                        }
                        
                        // Validate selected color hex code
                        const finalColor = inputCrimsonColor.trim().startsWith('#') ? inputCrimsonColor.trim() : '#' + inputCrimsonColor.trim();
                        if (!/^#[0-9A-F]{6}$/i.test(finalColor) && !/^#[0-9A-F]{3}$/i.test(finalColor)) {
                          addToast('รหัสสีไม่ถูกต้อง / Invalid Color Hex', 'โปรดป้อนรหัสสีในรูปแบบฐานสิบหกที่ถูกต้อง เช่น #E6192E', 'error');
                          return;
                        }

                        // Apply both
                        if (onUpdateBrand) {
                          onUpdateBrand(inputBrandName.trim(), inputBrandLogoUrl.trim());
                        }
                        if (onUpdateCrimsonColor) {
                          onUpdateCrimsonColor(finalColor);
                        }
                        addToast(
                          'บันทึกข้อมูลอัตลักษณ์และสีแบรนด์สำเร็จ / Applied & Saved', 
                          `จัดเก็บแบรนด์ "${inputBrandName.trim()}" และโทนสีหลัก "${finalColor}" ลง localStorage เรียบร้อย`, 
                          'success'
                        );
                      }}
                      className="bg-crimson hover:bg-red-650 hover:scale-[1.01] active:scale-[0.99] text-white px-6 py-3.5 rounded-xl font-heading text-xs font-black uppercase tracking-widest cursor-pointer transition-all flex items-center gap-2 border border-white/5"
                    >
                      <Check className="w-4 h-4 text-white" />
                      <span>บันทึกอัตลักษณ์สตูดิโอ & สีหลักของแอป / Save Studio Identity & Visual Theme</span>
                    </button>
                  </div>
                </div>

                {/* Preview Column */}
                <div className="lg:col-span-5 space-y-6">
                  
                  <div className="border border-[#222] bg-black/40 rounded-xl p-5 space-y-5">
                    <h3 className="text-gray-400 font-mono text-[10.5px] font-bold uppercase tracking-wide border-b border-[#1f1f1f] pb-2.5">
                      👁️ ดูตัวอย่างเรียลไทม์ / REAL-TIME INTERACTIVE SNEAK PEEK:
                    </h3>

                    {/* Previews of Header */}
                    <div className="space-y-2">
                      <span className="text-[10px] text-gray-500 font-mono uppercase block">1. แถบหัวเว็บไซต์ (Header Nav View)</span>
                      <div className="bg-[#0e0e0e] border border-[#202020] p-4 rounded-lg flex items-center justify-between">
                        <div className="flex items-center space-x-3.5">
                          {inputBrandLogoUrl ? (
                            <img 
                              src={inputBrandLogoUrl} 
                              alt="Brand Preview"
                              referrerPolicy="no-referrer"
                              className="w-8 h-8 rounded-tr-md rounded-bl-md object-cover shadow-[0_0_10px_rgba(230,25,46,0.3)] border border-crimson/25"
                            />
                          ) : (
                            <span className="w-8 h-8 rounded-tr-md rounded-bl-md bg-crimson flex items-center justify-center font-heading text-base font-extrabold text-white shadow-[0_0_12px_rgba(230,25,46,0.5)]">
                              {inputBrandName ? inputBrandName.trim().charAt(0).toUpperCase() : 'K'}
                            </span>
                          )}
                          <span className="font-heading tracking-[0.16em] text-xs font-black text-white uppercase text-ellipsis overflow-hidden max-w-[150px] whitespace-nowrap">
                            {inputBrandName || 'KAGE TATTOO'}
                          </span>
                        </div>
                        <span className="text-[8px] font-mono text-gray-600 bg-white/5 border border-white/5 px-2 py-0.5 rounded uppercase">Preview</span>
                      </div>
                    </div>

                    {/* Previews of Footer */}
                    <div className="space-y-2">
                      <span className="text-[10px] text-gray-500 font-mono uppercase block">2. แถบส่วนล่างของเว็บ (Footer Logo View)</span>
                      <div className="bg-[#0b0b0b] border border-[#1c1c1c] p-4 rounded-lg flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                          {inputBrandLogoUrl ? (
                            <img 
                              alt="Brand Preview"
                              referrerPolicy="no-referrer"
                              className="w-5 h-5 rounded object-cover border border-crimson/15"
                            />
                          ) : (
                            <span className="w-5 h-5 bg-crimson rounded flex items-center justify-center text-white font-heading font-black text-[10px]">
                              {inputBrandName ? inputBrandName.trim().charAt(0).toUpperCase() : 'K'}
                            </span>
                          )}
                          <span className="font-heading text-[10px] tracking-wider text-gray-400 font-bold uppercase truncate max-w-[140px]">
                            {inputBrandName || 'KAGE TATTOO'}
                          </span>
                        </div>
                        <span className="text-[8px] font-mono text-gray-600 bg-white/5 border border-white/5 px-2 py-0.5 rounded uppercase">Footer</span>
                      </div>
                    </div>

                    {/* Previews of Admin Tab header */}
                    <div className="space-y-2">
                      <span className="text-[10px] text-gray-500 font-mono uppercase block">3. หน้าต่างแอดมินลูปส่วนหัว (Admin Sidebar Head)</span>
                      <div className="bg-[#111] p-4 rounded-lg flex items-center gap-3 border border-[#202020]">
                        <div className="relative">
                          {inputBrandLogoUrl ? (
                            <img 
                              src={inputBrandLogoUrl} 
                              alt="Brand Preview"
                              referrerPolicy="no-referrer"
                              className="w-8 h-8 rounded-full object-cover border-2 border-crimson"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-crimson flex items-center justify-center font-heading text-sm font-bold text-white shadow-md">
                              {inputBrandName ? inputBrandName.trim().charAt(0).toUpperCase() : 'K'}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-heading font-black text-white text-[11px] uppercase truncate max-w-[125px]">
                            {inputBrandName || 'KAGE TATTOO'}
                          </div>
                          <span className="text-[9px] text-crimson font-mono tracking-widest uppercase block">Studio Director</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* 7. GOOGLE SPREADSHEET SETUP CONTROLS */}
        {activeTab === 'sheets' && (
          <div className="space-y-8 animate-fadeIn max-w-4xl">
            <div className="bg-[#131313] border border-[#222] p-6 sm:p-10 rounded-xl space-y-6">
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-[#202020] pb-6">
                <div className="flex items-center space-x-4">
                  <span className="w-12 h-12 rounded bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center font-heading text-xl">
                    📁
                  </span>
                  <div>
                    <h2 className="font-heading text-lg font-black text-white uppercase tracking-tight">
                      แผงเชื่อมต่อ GOOGLE SHEETS CLOUD DATABASE
                    </h2>
                    <p className="text-xs text-gray-500 font-mono mt-0.5 uppercase tracking-wide">
                      STATUS: ONLINE | AUTOMATIC SCHEMA EVOLUTION ENGINE LIVE
                    </p>
                  </div>
                </div>

                {/* Sub-tab Navigation Bar */}
                <div className="flex bg-black/60 border border-[#2d2d2d] p-1.5 rounded-lg text-xs gap-1 self-start sm:self-center">
                  <button
                    type="button"
                    onClick={() => setSheetsSubTab('config')}
                    className={`px-3.5 py-2 rounded-md font-heading font-black tracking-wide uppercase transition cursor-pointer ${
                      sheetsSubTab === 'config'
                        ? 'bg-amber-600 text-black shadow'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    ⚙️ CONFIG
                  </button>
                  <button
                    type="button"
                    onClick={() => setSheetsSubTab('schema')}
                    className={`px-3.5 py-2 rounded-md font-heading font-black tracking-wide uppercase transition cursor-pointer flex items-center gap-1.5 ${
                      sheetsSubTab === 'schema'
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <Database className="w-3.5 h-3.5" />
                    <span>DATABASE SCHEMA</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSheetsSubTab('sandbox')}
                    className={`px-3.5 py-2 rounded-md font-heading font-black tracking-wide uppercase transition cursor-pointer ${
                      sheetsSubTab === 'sandbox'
                        ? 'bg-purple-600 text-white shadow'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    ⚡ SANDBOX
                  </button>
                </div>
              </div>

              {/* Connections config status */}
              <div className="space-y-2">
                <label className="text-xs font-mono uppercase text-[#bbb] block tracking-wider">
                  วางลิงก์ Google Apps Script URL (Web App API Link) ของคุณ:
                </label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="url"
                    value={appsScriptUrl}
                    onChange={(e) => onUpdateAppsScriptUrl(e.target.value)}
                    className="flex-grow bg-black border border-[#2d2d2d] focus:border-amber-500 focus:outline-none rounded px-3.5 py-3 text-sm font-mono text-white transition-all placeholder:text-gray-600"
                    placeholder="https://script.google.com/macros/s/AKfycb.../exec"
                  />
                  <button
                    onClick={onRefreshFromSheets}
                    disabled={isSyncing || !appsScriptUrl}
                    className="bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-black font-heading font-black tracking-widest text-xs uppercase px-6 py-3 rounded cursor-pointer transition flex items-center justify-center gap-1.5"
                  >
                    <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>เชื่อมต่อ / TEST & SYNC</span>
                  </button>
                </div>
                <div className="text-[10.5px] font-mono flex items-center gap-2">
                  <span className="text-gray-500">สถานะปัจจุบัน:</span>
                  {appsScriptUrl ? (
                    <span className="text-green-400 font-bold bg-[#132d18] px-2.5 py-0.5 rounded border border-[#22672a] inline-flex items-center gap-1 select-none">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      เชื่อมโยงดีเดย์สำเร็จ LIVE ACTIVE ON SHEETS READY
                    </span>
                  ) : (
                    <span className="text-yellow-500 font-bold bg-[#2e2612] px-2.5 py-0.5 rounded border border-[#7a642e] inline-flex items-center gap-1 select-none">
                      <span className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
                      โหมดออฟไลน์ใช้งานภายในระบบชั่วคราว (Offline-First Sandbox)
                    </span>
                  )}
                </div>
              </div>

              {/* Seed Full Mock Data to Google Sheets UI Block */}
              {appsScriptUrl && (
                <div className="bg-gradient-to-r from-amber-950/20 to-neutral-900 border border-amber-500/20 p-5 rounded-xl space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="text-sm font-heading font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
                        🌱 อัปโหลดข้อมูลตัวอย่างเวอร์ชันเต็มทั้งหมดลงชีต / Seed All Mock Data
                      </h4>
                      <p className="text-xs text-gray-400 font-sans leading-relaxed">
                        แก้ปัญหาข้อมูลหายหลังเชื่อมโยงชีต! ระบบจะอัปโหลดข้อมูลจำลองทั้งหมดที่มีความสวยงามเข้าไปยัง Google Sheet ของคุณทับลงหัวข้อโดยทันที (เหมาะสำหรับเริ่มต้นเว็บบอร์ดเดบิวต์ เพื่อให้คุณสามารถปรับแต่งหรือลบออกทีหลังได้ง่ายดาย)
                      </p>
                    </div>
                    <button
                      type="button"
                      disabled={isSeedingMockData || isSyncing}
                      onClick={handleSeedFullMockData}
                      className="bg-amber-600 hover:bg-amber-500 text-black font-heading font-black tracking-widest text-[11px] uppercase px-5 py-3 rounded-lg shrink-0 transition-all active:scale-95 disabled:opacity-50 cursor-pointer flex items-center gap-1.5"
                    >
                      {isSeedingMockData ? (
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      ) : (
                        <span>🚀 อัปโหลดคู่มือข้อมูลตั้งต้น</span>
                      )}
                    </button>
                  </div>

                  {/* Progressive Logs for user transparency */}
                  {seedProgress.status !== 'idle' && (
                    <div className="bg-black/80 border border-[#222] p-3.5 rounded-lg font-mono text-[10.5px] text-gray-300 max-h-48 overflow-y-auto space-y-1">
                      <div className="text-[9.5px] uppercase text-gray-500 font-bold border-b border-[#222] pb-1.5 mb-1.5 flex justify-between">
                        <span>ฐานข้อมูลซิงค์สถานะ (Database Seed Process Logs)</span>
                        <span className={seedProgress.status === 'success' ? 'text-green-400' : seedProgress.status === 'error' ? 'text-red-400' : 'text-amber-400'}>
                          {seedProgress.status.toUpperCase()}
                        </span>
                      </div>
                      {seedProgress.logs.map((log, idx) => (
                        <div key={idx} className="leading-tight">
                          {log}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Instructions Guides Section Accordion Code */}
              <div className="pt-8 border-t border-[#1f1f1f] space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-black/60 p-4 border border-[#222] rounded">
                  <div className="space-y-1">
                    <h4 className="font-heading text-sm font-bold uppercase text-white tracking-wider">
                      คัดลอกคู่มือการใช้งาน และโค้ดสำหรับใส่ใน Apps Script
                    </h4>
                    <p className="text-[11px] text-gray-500 font-mono">
                      ใช้ฟังก์ชัน \`initDatabase()\` ในโค้ดเพื่อสร้างตารางข้อมูลและแถวเริ่มต้นโดยไร้รอยต่อ
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopyInstructions}
                      className="bg-[#1b1b1b] border border-[#2d2d2d] text-gray-300 font-mono hover:text-white px-3.5 py-2 rounded text-xs tracking-wider cursor-pointer transition flex items-center gap-1"
                    >
                      {copiedInstructions ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedInstructions ? 'COPIED!' : 'COPY MANUAL'}</span>
                    </button>
                    <button
                      onClick={handleCopyCode}
                      className="bg-[#161d2a] hover:bg-sky-950 border border-sky-900 text-sky-400 hover:text-white font-mono px-3.5 py-2 rounded text-xs cursor-pointer transition flex items-center gap-1"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5 text-sky-400" />}
                      <span>{copiedCode ? 'COPIED CODE!' : 'COPY CODE.GS'}</span>
                    </button>
                  </div>
                </div>

                {/* Markdown instruction guide detail */}
                <div className="bg-[#0e0e0e] border border-[#222] p-5 rounded-lg overflow-x-auto text-xs leading-relaxed space-y-4">
                  <h3 className="font-heading font-black text-white uppercase text-xs tracking-wider border-b border-[#1f1f1f] pb-3">
                    📖 คู่มือการจัดระเบียบบริการทีเดียวให้ราบรื่น:
                  </h3>
                  <div className="space-y-2 font-sans text-gray-400">
                    <p>
                      โค้ดบริการนี้จะทำการสร้างชีตย่อยอัตโนมัติ 5 ตัวสำหรับจัดการคลังสัก ได้แก่: 
                      <strong>gallery</strong>, 
                      <strong>appointments</strong>, 
                      <strong>inventory</strong>, 
                      <strong>financials</strong> และ 
                      <strong>tickets</strong>
                    </p>
                    <p className="text-amber-500/90 bg-amber-950/20 px-3.5 py-2.5 rounded border border-amber-500/10 font-mono text-[11px]">
                      ⚠️ <strong>ข้อชี้แนะ</strong>: หลังจากวางโค้ดใน แอบสคริปต์ ของชีตแล้ว กรุณากดเลือกฟังก์ชัน <strong>initDatabase</strong> ในแถบด้านบนแล้วกดรันหนึ่งรอบก่อนทุกอย่างเสมอ เพื่อเตรียมข้อมูลตัวอย่างและตารางฐานให้ระบบเชื่อมต่อได้อย่างราบรื่นทันที!
                    </p>
                  </div>
                </div>
              </div>

              {/* Dynamic API Bridge & Schema Migrator Sandbox */}
              <div className="pt-10 border-t border-[#1f1f1f] space-y-6">
                <div className="flex items-center space-x-3">
                  <span className="w-10 h-10 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-heading text-lg">
                    ⚡
                  </span>
                  <div>
                    <h3 className="font-heading text-sm font-black text-white uppercase tracking-wider">
                      Dynamic Schema Migrator & Versioned API Bridge
                    </h3>
                    <p className="text-[11.5px] text-gray-500 font-mono mt-0.5">
                      DESIGN OR SYNC NEW GOOGLE SHEET TABLES BY SENDING A JSON SCHEMA CONFIGURATION OBJECT
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column: Form & Preset Controls */}
                  <div className="space-y-6">
                    <div className="bg-[#0b0b0b] border border-[#222] p-5 rounded-lg space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono uppercase text-gray-400 font-bold tracking-wider">
                          เลือกจากเทมเพลตเริ่มต้น (Presets):
                        </span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleLoadSchemaPreset('customer_subscriptions')}
                            className={`px-2.5 py-1 rounded text-[10.5px] font-mono cursor-pointer transition ${
                              schemaTableName === 'customer_subscriptions'
                                ? 'bg-indigo-600 text-white font-bold'
                                : 'bg-[#1a1a1a] text-gray-400 hover:text-white'
                            }`}
                          >
                            Subscriptions
                          </button>
                          <button
                            onClick={() => handleLoadSchemaPreset('marketing_subscribers')}
                            className={`px-2.5 py-1 rounded text-[10.5px] font-mono cursor-pointer transition ${
                              schemaTableName === 'marketing_subscribers'
                                ? 'bg-indigo-600 text-white font-bold'
                                : 'bg-[#1a1a1a] text-gray-400 hover:text-white'
                            }`}
                          >
                            Subscribers
                          </button>
                          <button
                            onClick={() => handleLoadSchemaPreset('artist_roster')}
                            className={`px-2.5 py-1 rounded text-[10.5px] font-mono cursor-pointer transition ${
                              schemaTableName === 'artist_roster'
                                ? 'bg-indigo-600 text-white font-bold'
                                : 'bg-[#1a1a1a] text-gray-400 hover:text-white'
                            }`}
                          >
                            Artist Roster
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-mono text-gray-400 uppercase">ชื่อตารางใหม่ (Table Name):</label>
                          <input
                            type="text"
                            value={schemaTableName}
                            onChange={(e) => setSchemaTableName(e.target.value.toLowerCase().replace(/[^a-z0-1_]/g, ''))}
                            className="w-full bg-black border border-[#2d2d2d] focus:border-indigo-505 focus:outline-none rounded p-2 text-xs font-mono text-white"
                            placeholder="table_name"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-[11px] font-mono text-gray-400 uppercase">เวอร์ชันสกีมา (Schema Version):</label>
                          <input
                            type="number"
                            min="1"
                            value={schemaVersion}
                            onChange={(e) => setSchemaVersion(e.target.value)}
                            className="w-full bg-black border border-[#2d2d2d] focus:border-indigo-505 focus:outline-none rounded p-2 text-xs font-mono text-white"
                          />
                        </div>
                      </div>

                      {/* Display field definitions */}
                      <div className="space-y-2">
                        <label className="text-[11px] font-mono text-gray-400 uppercase block">กำหนดคอลัมน์ฟิลด์ (Active Schema fields):</label>
                        <div className="border border-[#222] rounded bg-black/40 overflow-hidden text-xs">
                          <div className="grid grid-cols-12 bg-[#141414] border-b border-[#222] p-2 text-gray-500 font-mono text-[10.5px] uppercase">
                            <div className="col-span-7">ชื่อฟิลด์คอลัมน์ (Field name)</div>
                            <div className="col-span-4">ชนิดข้อมูล (Type)</div>
                            <div className="col-span-1 text-center">ลบ</div>
                          </div>
                          
                          <div className="divide-y divide-[#1e1e1e] max-h-48 overflow-y-auto">
                            {schemaFields.map((field, index) => (
                              <div key={index} className="grid grid-cols-12 p-2.5 items-center">
                                <div className="col-span-7 font-mono text-white font-semibold text-xs">{field.name}</div>
                                <div className="col-span-4">
                                  <span className={`px-2 py-0.5 rounded text-[9.5px] font-mono tracking-wide ${
                                    field.type === 'STRING' ? 'bg-sky-950 text-sky-400 border border-sky-850' :
                                    field.type === 'NUMBER' ? 'bg-emerald-950 text-emerald-400 border border-emerald-850' :
                                    field.type === 'BOOLEAN' ? 'bg-amber-950 text-amber-400 border border-amber-850' :
                                    'bg-purple-950 text-purple-400 border border-purple-850'
                                  }`}>
                                    {field.type}
                                  </span>
                                </div>
                                <div className="col-span-1 text-center">
                                  <button
                                    onClick={() => setSchemaFields(schemaFields.filter((_, idx) => idx !== index))}
                                    className="text-gray-600 hover:text-crimson cursor-pointer p-0.5 transition"
                                  >
                                    <Trash className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Add new field form inside sandbox */}
                      <div className="bg-[#101010] p-3 rounded border border-[#2d2d2d] space-y-3">
                        <span className="text-[10px] font-mono uppercase text-indigo-400 font-bold block">เพิ่มฟิลด์คอลัมน์ใหม่ (ADD FIELD COLUMN):</span>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newFieldName}
                            onChange={(e) => setNewFieldName(e.target.value.toLowerCase().replace(/[^a-z0-1_]/g, ''))}
                            placeholder="เช่น is_premium, score_rating"
                            className="flex-grow bg-black border border-[#2d2d2d] focus:border-indigo-500 focus:outline-none rounded p-1.5 text-xs font-mono text-white"
                          />
                          <select
                            value={newFieldType}
                            onChange={(e) => setNewFieldType(e.target.value)}
                            className="bg-black border border-[#2d2d2d] text-xs text-white p-1.5 rounded focus:outline-none"
                          >
                            <option value="STRING">STRING</option>
                            <option value="NUMBER">NUMBER</option>
                            <option value="BOOLEAN">BOOLEAN</option>
                            <option value="DATETIME">DATETIME</option>
                          </select>
                          <button
                            onClick={() => {
                              if (!newFieldName.trim()) return;
                              if (schemaFields.some(f => f.name === newFieldName)) return;
                              setSchemaFields([...schemaFields, { name: newFieldName, type: newFieldType }]);
                              setNewFieldName('');
                            }}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white font-mono text-xs font-bold px-3 py-1.5 rounded transition cursor-pointer"
                          >
                            ADD
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>

                  {/* Right Column: Live compiled Payload & metadata sheet representation */}
                  <div className="space-y-6 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div className="bg-[#0b0b0b] border border-[#222] p-4 rounded-lg space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono uppercase text-[#bbbbbb] font-bold">
                            Live Compiled JSON Payload (ส่งเข้าสะพาน API Bridge):
                          </span>
                          <span className="text-[9.5px] font-mono text-indigo-400 bg-indigo-950/20 px-2 py-0.5 rounded uppercase">
                            HTTP POST
                          </span>
                        </div>
                        
                        <div className="bg-black/80 border border-[#1e1e1e] p-3 rounded font-mono text-[11px] text-gray-300 leading-relaxed overflow-x-auto select-all max-h-48">
                          <pre>{JSON.stringify({
                            action: "sync_schema",
                            tableName: schemaTableName,
                            version: Number(schemaVersion) || 1,
                            fields: schemaFields
                          }, null, 2)}</pre>
                        </div>
                      </div>

                      {/* Visual metadata schema definition storage proposal */}
                      <div className="bg-[#0f0e13] border border-indigo-950/40 p-4 rounded-lg space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono text-indigo-300 flex items-center gap-1.5 uppercase font-extrabold">
                            <Database className="w-3.5 h-3.5 text-indigo-400" />
                            ตารางเก็บค่า Metadata บน Google Sheet ("schema_metadata")
                          </span>
                          <span className="text-[10px] font-mono text-purple-400 font-bold uppercase">
                            REPRESENTATION VIEW
                          </span>
                        </div>
                        
                        <p className="text-[11px] text-gray-400 font-sans leading-relaxed">
                          เพื่อจำฟังก์ชันโดยไม่ต้องปรับแต่งโค้ดบ่อย ระบบจะเก็บนิยามโครงสร้างตารางและเลขเวอร์ชันในแท็บระบบ 
                          <strong>schema_metadata</strong> เพื่อจัดการประวัติการขยายคอลัมน์ให้อัตโนมัติ:
                        </p>

                        <div className="border border-[#222] rounded overflow-hidden text-[10.5px] font-mono bg-black/60">
                          <div className="grid grid-cols-12 bg-[#1c1a24] text-indigo-300 font-bold p-1.5 border-b border-[#222]">
                            <div className="col-span-3">tableName</div>
                            <div className="col-span-2">version</div>
                            <div className="col-span-5">schemaJson (Stringified key list)</div>
                            <div className="col-span-2 text-right">lastUpdated</div>
                          </div>
                          <div className="divide-y divide-[#1e1e1e] text-gray-400">
                            <div className="grid grid-cols-12 p-1.5 items-center">
                              <div className="col-span-3 text-white font-bold">{schemaTableName}</div>
                              <div className="col-span-2 text-yellow-400 font-bold">{schemaVersion}</div>
                              <div className="col-span-5 text-gray-500 text-[9.5px] truncate">
                                {JSON.stringify(schemaFields)}
                              </div>
                              <div className="col-span-2 text-right text-[9px] text-gray-500 font-sans">Just now</div>
                            </div>
                            <div className="grid grid-cols-12 p-1.5 items-center bg-[#131313]/10">
                              <div className="col-span-3">gallery</div>
                              <div className="col-span-2">1</div>
                              <div className="col-span-5 text-[9.5px] text-gray-600 truncate">{"[{\"id\":\"string\",\"name\":\"string\"}]"}</div>
                              <div className="col-span-2 text-right text-[9px] text-gray-600 font-sans">09-06-2026</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Submit Schema trigger button & outcomes */}
                    <div className="space-y-3 pt-2">
                      <button
                        onClick={handleSyncSchemaToSheets}
                        disabled={isSyncingSchema || schemaFields.length === 0}
                        className="w-full bg-[#3b3260] hover:bg-[#493e77] active:scale-[0.99] border border-[#5a4d92] text-indigo-100 font-heading font-black tracking-wider text-xs uppercase px-5 py-3 rounded cursor-pointer transition-all flex items-center justify-center gap-2 shadow"
                      >
                        <RefreshCw className={`w-4 h-4 ${isSyncingSchema ? 'animate-spin text-purple-400' : 'text-purple-300'}`} />
                        <span>MIGRATE & CREATE DYNAMIC SHEET / ยิงฟอร์แมตโครงสร้างไปชีต</span>
                      </button>

                      {/* Display schema migration outcomes */}
                      {schemaSyncStatus.status !== 'idle' && (
                        <div className={`p-4 rounded-lg border text-xs font-sans animate-fadeIn ${
                          schemaSyncStatus.status === 'success'
                            ? 'bg-[#122e1b] border-green-500/20 text-green-300'
                            : 'bg-[#2b1010] border-red-500/20 text-red-300'
                        }`}>
                          <div className="flex items-start gap-2.5">
                            {schemaSyncStatus.status === 'success' ? (
                              <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                            )}
                            <div className="space-y-1">
                              <p className="font-bold text-white tracking-wide">{schemaSyncStatus.message}</p>
                              {schemaSyncStatus.details && (
                                <p className="text-[11px] leading-relaxed opacity-90 mt-1 pl-1 font-mono">
                                  <strong>ชีตเป้าหมาย:</strong> {schemaSyncStatus.details.tableName} | <strong>เวอร์ชันสัญญาลักษณ์:</strong> v{schemaSyncStatus.details.version}
                                  <br />
                                  <span className="text-[10px] text-gray-400 mt-1 block font-sans">
                                    {schemaSyncStatus.details.note || 'อัสคริปต์ได้สร้างเมตาความเข้ากันได้ และกางคอลัมน์ฟิลด์ทั้งหมดลงหัวกระดาษของแท็บเป้าหมายเรียบร้อยแล้ว'}
                                  </span>
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 8. ANALYTICS DYNAMIC GRAPH MODULE */}
        {activeTab === 'analytics' && (
          <div className="space-y-6 animate-fadeIn">
            <AnalyticsView appointments={appointments} financials={financials} reviews={reviews} />
          </div>
        )}

        {/* BULK CSV IMPORT MODAL */}
        <AnimatePresence>
          {isBulkImportOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => {
                  if (!bulkImportProcessing) {
                    setIsBulkImportOpen(false);
                    setBulkInputText('');
                    setBulkFileName('');
                    setBulkItemsPreview([]);
                    setBulkParseError(null);
                  }
                }}
                className="absolute inset-0 bg-black/90 backdrop-blur-sm"
              />

              {/* Modal Body */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ type: 'spring', duration: 0.35, bounce: 0.1 }}
                className="relative bg-[#0e0e0e] border border-[#2d2d2d] rounded-xl max-w-2xl w-full text-gray-200 shadow-2xl overflow-hidden flex flex-col z-[101] max-h-[85vh]"
              >
                {/* Header */}
                <div className="p-5 border-b border-[#1f1f1f] bg-[#121212] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-500">
                      <FileText className="w-5 h-5 shrink-0" />
                    </div>
                    <div>
                      <h3 className="font-heading font-black text-xs uppercase tracking-wider text-white">
                        นำเข้าวัสดุเป็นกลุ่ม / Bulk CSV Importer
                      </h3>
                      <span className="text-[9px] font-mono text-gray-500 block uppercase">
                        Structure mimics your Google Sheets columns
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsBulkImportOpen(false);
                      setBulkInputText('');
                      setBulkFileName('');
                      setBulkItemsPreview([]);
                      setBulkParseError(null);
                    }}
                    className="p-1 rounded bg-[#1c1c1c] text-gray-400 hover:text-white cursor-pointer transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-5 overflow-y-auto flex-1 text-xs">
                  
                  {/* Explainer & Sample copy section */}
                  <div className="bg-[#121212] p-4 rounded-lg border border-[#1f1f1f] space-y-2.5">
                    <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-2">
                      <span className="text-[10px] font-mono text-gray-400 font-bold uppercase block">
                        โครงสร้างคอลัมน์มาตรฐาน / EXPECTED COLUMNS:
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const sample = "code,name,category,currentStock,minStock,unit\nNDL-1205M1,Kwadron Magnum needles,Needles,25,10,Boxes\nINK-DYN-08,Dynamic Triple Black Ink,Inks,15,4,Bottles\nMED-GLY-99,Studio sterile Vaseline tubes,Consumables,50,15,Tubes";
                          setBulkInputText(sample);
                          processCSVContent(sample);
                        }}
                        className="bg-yellow-600/10 border border-yellow-600/30 hover:bg-yellow-600 hover:text-black font-mono text-[9px] px-2.5 py-1 rounded text-yellow-500 cursor-pointer transition-all"
                      >
                        ⚡ โหลดตัวอย่าง / LOAD SAMPLE TEMPLATE
                      </button>
                    </div>
                    <code className="block bg-black p-2.5 rounded font-mono text-[10px] text-yellow-500/90 whitespace-pre overflow-x-auto border border-black/40">
                      code, name, category, currentStock, minStock, unit
                    </code>
                    <p className="text-[10px] text-gray-500 leading-relaxed font-sans">
                      * ระบบล้างหัวบาร์โค้ด และรองรับชื่อหัวคอลัมน์ทั้งภาษาไทยและอังกฤษ เพื่อความสะดวกสูงสุดในการคัดลอกจาก Google Sheets โดยตรง
                    </p>
                  </div>

                  {/* Drag and Drop Zone */}
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                      isDragging 
                        ? 'border-yellow-500 bg-yellow-500/5' 
                        : bulkFileName 
                          ? 'border-green-500/50 bg-green-500/5' 
                          : 'border-[#2d2d2d] hover:border-yellow-500/45 bg-black/45'
                    }`}
                  >
                    <input
                      type="file"
                      accept=".csv"
                      onChange={handleFileChange}
                      className="hidden"
                      id="bulk-csv-file-input"
                    />
                    <label htmlFor="bulk-csv-file-input" className="cursor-pointer space-y-2 block w-full">
                      <div className="mx-auto w-10 h-10 rounded-full bg-[#141414] border border-[#222] flex items-center justify-center text-gray-400">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div className="space-y-1">
                        <p className="font-heading font-bold text-xs text-white">
                          {bulkFileName ? `เลือกไฟล์สำเร็จ: ${bulkFileName}` : 'ลากไฟล์ .csv มาวางตรงนี้ หรือคลิกเพื่ออัปโหลด'}
                        </p>
                        <p className="text-[10px] text-gray-500 font-mono">
                          Drag and drop your .csv file here
                        </p>
                      </div>
                    </label>
                  </div>

                  {/* Manual Paste Textarea */}
                  <div className="space-y-1.5 text-xs">
                    <label className="text-gray-400 font-mono text-[10px] uppercase block">
                      หรือคัดลอกเขียนข้อความ CSV ดิบตรงนี้ / Or Paste Raw CSV Text:
                    </label>
                    <textarea
                      rows={5}
                      value={bulkInputText}
                      onChange={(e) => {
                        setBulkInputText(e.target.value);
                        processCSVContent(e.target.value);
                      }}
                      className="w-full bg-black border border-[#2d2d2d] focus:border-yellow-500 focus:outline-none p-3 rounded font-mono text-[10.5px] text-gray-300 placeholder-gray-600"
                      placeholder="code,name,category,currentStock,minStock,unit&#10;ND-9921,Aida sterile Box,Needles,15,5,Boxes"
                    />
                  </div>

                  {/* Parse errors layout */}
                  {bulkParseError && (
                    <div className="bg-red-500/10 border border-red-500/20 p-3.5 rounded text-[11px] text-crimson flex items-start gap-2 animate-fadeIn font-mono">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                      <span>{bulkParseError}</span>
                    </div>
                  )}

                  {/* Parsed Previews layout */}
                  {bulkItemsPreview.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
                          พบสินค้าถูกต้อง ({bulkItemsPreview.length} รายการ) / READY TO IMPORT:
                        </span>
                      </div>
                      <div className="bg-black/60 rounded-lg border border-[#2d2d2d] overflow-hidden max-h-[160px] overflow-y-auto">
                        <table className="w-full text-left border-collapse text-[10.5px] font-mono">
                          <thead>
                            <tr className="bg-[#121212] border-b border-[#1f1f1f] text-gray-400 uppercase text-[9px]">
                              <th className="p-2 border-r border-[#1f1f1f]">CODE</th>
                              <th className="p-2 border-r border-[#1f1f1f]">NAME</th>
                              <th className="p-2 border-r border-[#1f1f1f]">CAT</th>
                              <th className="p-2 text-right">STOCK</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[#181818] text-gray-300">
                            {bulkItemsPreview.map((item, idx) => (
                              <tr key={`${item.code}-${idx}`} className="hover:bg-white/5">
                                <td className="p-2 border-r border-[#181818] font-bold text-yellow-600">{item.code}</td>
                                <td className="p-2 border-r border-[#181818] text-white font-sans max-w-[150px] truncate">{item.name}</td>
                                <td className="p-2 border-r border-[#181818]">{item.category}</td>
                                <td className="p-2 text-right">
                                  <span className={item.currentStock < item.minStock ? 'text-crimson font-bold' : 'text-green-400 font-bold'}>
                                    {item.currentStock}
                                  </span>{' '}
                                  <span className="text-gray-500 text-[9px]">{item.unit}</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Buttons */}
                <div className="p-4 border-t border-[#1f1f1f] bg-[#0c0c0c] flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    disabled={bulkImportProcessing}
                    onClick={() => {
                      setIsBulkImportOpen(false);
                      setBulkInputText('');
                      setBulkFileName('');
                      setBulkItemsPreview([]);
                      setBulkParseError(null);
                    }}
                    className="px-4 py-2.5 bg-[#141414] hover:bg-[#1f1f1f] border border-[#2d2d2d] rounded font-mono text-[10.5px] uppercase tracking-wider transition cursor-pointer text-gray-400 hover:text-white disabled:opacity-40"
                  >
                    ยกเลิก / Cancel
                  </button>
                  <button
                    type="button"
                    disabled={bulkImportProcessing || bulkItemsPreview.length === 0}
                    onClick={handleImportConfirm}
                    className="px-5 py-2.5 bg-yellow-600 hover:bg-yellow-500 rounded font-mono text-[10.5px] font-black uppercase text-black tracking-widest transition cursor-pointer disabled:opacity-30 disabled:pointer-events-none flex items-center gap-1.5 shadow-md"
                  >
                    {bulkImportProcessing ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>IMPORTING...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5 text-black" />
                        <span>นำเข้าข้อมูล / IMPORT {bulkItemsPreview.length > 0 ? `(${bulkItemsPreview.length})` : ''}</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* 0. CUSTOM MODAL CONFIRMATION DIALOG */}
        <AnimatePresence>
          {confirmModal && confirmModal.isOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              {/* Backdrop overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setConfirmModal(null)}
                className="absolute inset-0 bg-black/90 backdrop-blur-sm"
              />

              {/* Modal Body Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                transition={{ type: 'spring', duration: 0.35, bounce: 0.1 }}
                className="relative bg-[#0e0e0e] border border-[#2d2d2d] rounded-xl max-w-md w-full text-gray-200 shadow-2xl overflow-hidden flex flex-col z-[101]"
              >
                {/* Header */}
                <div className="p-5 border-b border-[#1f1f1f] bg-[#121212] flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    confirmModal.type === 'danger' 
                      ? 'bg-red-500/10 border border-red-500/20 text-crimson' 
                      : 'bg-amber-500/10 border border-amber-500/20 text-amber-500'
                  }`}>
                    <AlertTriangle className="w-5 h-5 shrink-0" />
                  </div>
                  <div>
                    <h3 className="font-heading font-black text-xs uppercase tracking-wider text-white">
                      {confirmModal.title}
                    </h3>
                    <span className="text-[9px] font-mono text-gray-500 block uppercase">
                      Requires Authorized Confirmation
                    </span>
                  </div>
                </div>

                {/* Message Details */}
                <div className="p-6 space-y-4">
                  <p className="text-xs text-gray-300 leading-relaxed font-sans">
                    {confirmModal.message}
                  </p>
                  <div className="bg-[#121212] p-3.5 rounded border border-[#1f1f1f] flex items-start gap-2.5 text-[10.5px] text-gray-400 font-mono">
                    <span className="text-crimson font-black">⚡ WARNING:</span>
                    <span>การยืนยันและการข้ามขั้นตอนนี้เป็นลายลักษณ์อักษรของระบบและจะไม่สามารถกู้คืนได้ (Permanent action)</span>
                  </div>
                </div>

                {/* Action Buttons Footer */}
                <div className="p-4 border-t border-[#1f1f1f] bg-[#0c0c0c] flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    onClick={() => setConfirmModal(null)}
                    className="px-4 py-2.5 bg-[#141414] hover:bg-[#1f1f1f] border border-[#2d2d2d] rounded font-mono text-[10.5px] uppercase tracking-wider transition cursor-pointer text-gray-400 hover:text-white"
                  >
                    ยกเลิก / Cancel
                  </button>
                  <button
                    type="button"
                    onClick={confirmModal.onConfirm}
                    className={`px-4 py-2.5 rounded font-mono text-[10.5px] font-black uppercase text-white tracking-widest transition cursor-pointer ${
                      confirmModal.type === 'danger'
                        ? 'bg-crimson hover:bg-red-650'
                        : 'bg-amber-600 hover:bg-amber-500'
                    }`}
                  >
                    {confirmModal.actionLabel}
                  </button>
                </div>

              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </main>

      {/* 1. SCREEN PRINT PREVIEW MODAL */}
      {isPrintModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-[#131313] border border-[#2d2d2d] rounded-lg max-w-4xl w-full text-gray-200 shadow-2xl overflow-hidden flex flex-col my-8">
            {/* Modal Header */}
            <div className="border-b border-[#2d2d2d] p-5 flex items-center justify-between bg-[#191919]">
              <div className="flex items-center gap-3">
                <Printer className="text-crimson w-5 h-5" />
                <div>
                  <h3 className="font-heading font-black uppercase text-sm tracking-wider text-white">
                    เครื่องมือสรุปยอดและพิมพ์แบบรายวัน / Daily Print Hub
                  </h3>
                  <p className="text-[10px] text-gray-400 font-mono">INK CARVING STUDIO APPOINTMENT LEDGER PREVIEWER</p>
                </div>
              </div>
              <button 
                onClick={() => setIsPrintModalOpen(false)}
                className="text-gray-400 hover:text-white bg-[#222] hover:bg-crimson p-1.5 rounded transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 flex-1 max-h-[70vh] overflow-y-auto custom-scrollbar">
              {/* Controls Panel */}
              <div className="bg-black/40 border border-[#222] p-4 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <label className="text-[10px] font-mono text-gray-400 uppercase tracking-widest block">ระบุวันที่นัดหมาย / Target Date Selector</label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      value={printDate}
                      onChange={(e) => setPrintDate(e.target.value)}
                      className="bg-[#1c1c1c] border border-[#333] focus:border-crimson focus:outline-none rounded px-3 py-1.5 text-xs text-white uppercase font-mono tracking-wider w-full md:w-auto"
                    />
                    <button
                      onClick={() => {
                        const today = new Date();
                        const yyyy = today.getFullYear();
                        const mm = String(today.getMonth() + 1).padStart(2, '0');
                        const dd = String(today.getDate()).padStart(2, '0');
                        setPrintDate(`${yyyy}-${mm}-${dd}`);
                      }}
                      className="bg-[#242424] hover:bg-zinc-800 border border-zinc-700 px-3 py-1 text-[11px] rounded font-medium transition cursor-pointer text-gray-300"
                    >
                      วันนี้ / Today
                    </button>
                    <button
                      onClick={() => {
                        const tomorrow = new Date();
                        tomorrow.setDate(tomorrow.getDate() + 1);
                        const yyyy = tomorrow.getFullYear();
                        const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
                        const dd = String(tomorrow.getDate()).padStart(2, '0');
                        setPrintDate(`${yyyy}-${mm}-${dd}`);
                      }}
                      className="bg-[#242424] hover:bg-zinc-800 border border-zinc-700 px-3 py-1 text-[11px] rounded font-medium transition cursor-pointer text-gray-300"
                    >
                      วันพรุ่งนี้ / Tomorrow
                    </button>
                  </div>
                </div>

                <div className="flex text-right items-center md:items-end flex-col space-y-1 justify-center md:border-l md:border-[#222] md:pl-6 min-w-[200px]">
                  <span className="text-[10px] font-mono text-gray-500 uppercase">สถิติคิวประจำวัน</span>
                  <div className="flex gap-3 text-xs font-mono">
                    <span className="text-gray-400">ทั้งหมด: <strong className="text-white text-sm">{appointments.filter(a => a.date === printDate).length}</strong> คิว</span>
                    <span className="text-green-400">ยืนยัน: <strong className="text-green-400 text-sm">{appointments.filter(a => a.date === printDate && a.status === 'Confirmed').length}</strong></span>
                    <span className="text-yellow-500">รอตรวจ: <strong className="text-yellow-500 text-sm">{appointments.filter(a => a.date === printDate && a.status === 'Pending').length}</strong></span>
                  </div>
                </div>
              </div>

              {/* Report Screen Preview Section */}
              <div className="space-y-3">
                <h4 className="text-[11px] font-mono text-gray-400 uppercase tracking-widest block">ตัวอย่างการจัดหน้ากระพิมพ์สำหรับใบสรุปคิวงาน / Print Layout Preview</h4>
                
                {/* Screen layout mockup of the high-contrast printed ledger */}
                <div className="bg-white text-black p-6 rounded-lg shadow-inner max-w-full font-sans border border-gray-300">
                  <div className="border-b border-black pb-4 text-center space-y-1">
                    <div className="text-[10px] uppercase font-bold tracking-widest text-neutral-500">รายงานสรุปสารบบช่างและคิวงาน - โรงสลักหมึก</div>
                    <h1 className="text-2xl font-black uppercase tracking-tight text-black">INK CARVING STUDIO</h1>
                    <p className="text-xs font-mono text-black">แผ่นใบงานคิวงานสักและสถิติกำหนดการช่างสักประจำปีมะโรง ๒๕๗๐</p>
                    <p className="text-[10.5px] font-sans text-gray-600 mt-1">
                      ประจำรอยรักคิวงานสักวันที่: <span className="font-bold underline text-black">{printDate}</span> &nbsp;|&nbsp; 
                      สั่งพิมพ์เมื่อ (Printed At): <span className="text-black font-semibold">{new Date().toLocaleDateString('th-TH')} {new Date().toLocaleTimeString('th-TH')} น.</span>
                    </p>
                  </div>

                  {appointments.filter(a => a.date === printDate).length === 0 ? (
                    <div className="py-12 text-center text-gray-400 italic text-xs">
                      --- ไม่มีคิวงานสักหรือตารางช่างจองไว้ประจำวันที่ {printDate} ในบัญชี ---
                      <p className="text-[10px] text-gray-500 font-sans mt-0.5 not-italic">(No tattoo appointments scheduled for this selected date)</p>
                    </div>
                  ) : (
                    <div className="mt-4 space-y-4">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-[11px] border-collapse">
                          <thead>
                            <tr className="bg-gray-100 border-b border-black text-black">
                              <th className="p-2 border border-black font-bold">เวลา</th>
                              <th className="p-2 border border-black font-bold">ข้อมูลลูกค้า & รหัสจอง</th>
                              <th className="p-2 border border-black font-bold">ช่างสักคุมเคส</th>
                              <th className="p-2 border border-black font-bold">ลายงานสักและขนาด</th>
                              <th className="p-2 border border-black font-bold">โน้ตแนะแนวทาง</th>
                              <th className="p-2 border border-black font-bold text-center">เซ็นปิดงาน</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-black/40">
                            {appointments.filter(a => a.date === printDate).map((apt) => (
                              <tr key={apt.id} className="text-black">
                                <td className="p-2 border border-black font-mono font-bold align-top whitespace-nowrap">{apt.time} น.</td>
                                <td className="p-2 border border-black align-top">
                                  <div className="font-bold">คุณ{apt.name}</div>
                                  <div className="font-mono text-[9px] text-gray-700">ID: {apt.id} | 📞 {apt.phone}</div>
                                </td>
                                <td className="p-2 border border-black align-top font-bold text-gray-900">ช่าง{apt.artist}</td>
                                <td className="p-2 border border-black align-top space-y-0.5">
                                  <div className="font-bold text-black text-[11px]">{apt.style}</div>
                                  <div className="font-mono text-[9.5px] text-gray-600">สัดส่วน: {apt.size}</div>
                                </td>
                                <td className="p-2 border border-black align-top text-[10.5px] text-gray-800">{apt.note || '-'}</td>
                                <td className="p-2 border border-black align-top text-center w-24">
                                  <div className="h-5 border-b border-gray-400 mt-2"></div>
                                  <span className="text-[8px] font-mono font-extrabold text-gray-500 block text-center mt-1">[{apt.status}]</span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Operational Footer Area */}
                      <div className="pt-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center text-[9.5px] text-gray-500 gap-4">
                        <div className="space-y-0.5">
                          <p>• อุปกรณ์ใช้เข็มสัก กระบอกและจุกสีต้องเป็นแบบใช้งานครั้งเดียวหมดทิ้งทันที (Single Use)</p>
                          <p>• ศิลปินสักต้องรักษาระดับอนามัยอย่างเคร่งครัดสูงสุดของเกณฑ์กระทรวงการแพทย์ไทย</p>
                        </div>
                        <div className="text-right border-l border-gray-200 pl-4">
                          <p className="font-bold text-black text-[10px]">ลายมือชื่อเจ้าหน้าที่อนุมัติเช็คและสรุปบันทึก:</p>
                          <div className="h-7 border-b border-gray-400 w-36 mt-1 ml-auto"></div>
                          <span className="text-[8px] tracking-wider block mt-0.5">(SIGNATURE / AUDIT RECORD)</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="border-t border-[#2d2d2d] p-5 flex items-center justify-end gap-3 bg-[#191919]">
              <button
                onClick={() => setIsPrintModalOpen(false)}
                className="bg-[#242424] hover:bg-zinc-800 text-gray-300 hover:text-white px-4 py-2 rounded text-xs transition cursor-pointer font-bold uppercase tracking-wider"
              >
                ปิดหน้าต่าง / Close
              </button>
              <button
                onClick={() => window.print()}
                disabled={appointments.filter(a => a.date === printDate).length === 0}
                className={`px-5 py-2 rounded text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer transition select-none ${
                  appointments.filter(a => a.date === printDate).length === 0 
                    ? 'bg-zinc-800 text-gray-500 cursor-not-allowed border border-zinc-700'
                    : 'bg-crimson hover:bg-red-600 text-white shadow-lg shadow-crimson/10 hover:shadow-crimson/25'
                }`}
              >
                <Printer className="w-4 h-4" />
                <span>สั่งพิมพ์เอกสารรายงาน / PRINT DIRECTLY</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. REAL HIDDEN PRINTABLE LEDGER COMPONENT (ACCESSED ONLY BY @MEDIA PRINT WINDOW PROCESS) */}
      <div id="printable-report-area">
        <div style={{ borderBottom: '2px solid black', paddingBottom: '12px', marginBottom: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '2px', color: '#555' }}>รายงานสรุปสารบัญลิสช่างและคิวงานสัก - โรงสลักหมึก</div>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: '4px 0 0 0', textTransform: 'uppercase' }}>INK CARVING STUDIO</h1>
          <p style={{ fontSize: '12px', fontStyle: 'italic', margin: '2px 0 10px 0' }}>แผ่นตารางคิวงานสักและสถิติกำหนดการช่างสักประจำปีมะโรง ๒๕๗๐</p>
          
          <div style={{ fontSize: '11px', display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
            <span><strong>ตารางคิวประจำวันที่ (Date):</strong> <span style={{ textDecoration: 'underline', fontWeight: 'bold' }}>{printDate}</span></span>
            <span><strong>พิมพ์เมื่อ (Issued):</strong> {new Date().toLocaleDateString('th-TH')} {new Date().toLocaleTimeString('th-TH')} น.</span>
          </div>
          <div style={{ fontSize: '10px', display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '8px', borderTop: '1px dashed #333', paddingTop: '6px' }}>
            <span>คิวสรุปประจำวันทั้งหมด: <strong>{appointments.filter(a => a.date === printDate).length}</strong> คิว</span>
            <span>ยืนยันแล้ว: <strong>{appointments.filter(a => a.date === printDate && a.status === 'Confirmed').length}</strong> คิว</span>
            <span>เสร็จสิ้นคิว: <strong>{appointments.filter(a => a.date === printDate && a.status === 'Completed').length}</strong> คิว</span>
            <span>รอดำเนินงาน: <strong>{appointments.filter(a => a.date === printDate && a.status === 'Pending').length}</strong> คิว</span>
          </div>
        </div>

        {appointments.filter(a => a.date === printDate).length === 0 ? (
          <div style={{ padding: '40px 0', fontStyle: 'italic', textAlign: 'center', fontSize: '14px', color: '#666' }}>
            --- ไม่พบข้อมูลบันทึกรอยสักหรือคิวว่างสำรองสำหรับวันนี้ ---
          </div>
        ) : (
          <div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '11px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f5f5f5' }}>
                  <th style={{ border: '1px solid black', padding: '8px', fontWeight: 'bold', width: '10%' }}>เวลา</th>
                  <th style={{ border: '1px solid black', padding: '8px', fontWeight: 'bold', width: '25%' }}>ข้อมูลลูกค้า & รหัสจอง</th>
                  <th style={{ border: '1px solid black', padding: '8px', fontWeight: 'bold', width: '15%' }}>ผู้สักคุมเคส</th>
                  <th style={{ border: '1px solid black', padding: '8px', fontWeight: 'bold', width: '25%' }}>รายละเอียดลายสักและขนาด</th>
                  <th style={{ border: '1px solid black', padding: '8px', fontWeight: 'bold', width: '15%' }}>สมุดโน้ตแนะนำ</th>
                  <th style={{ border: '1px solid black', padding: '8px', fontWeight: 'bold', width: '10%', textAlign: 'center' }}>เซ็นปิดงาน</th>
                </tr>
              </thead>
              <tbody>
                {appointments.filter(a => a.date === printDate).map((apt) => (
                  <tr key={apt.id}>
                    <td style={{ border: '1px solid black', padding: '8px', fontWeight: 'bold', verticalAlign: 'top' }}>{apt.time} น.</td>
                    <td style={{ border: '1px solid black', padding: '8px', verticalAlign: 'top' }}>
                      <div style={{ fontWeight: 'bold' }}>คุณ{apt.name}</div>
                      <div style={{ fontSize: '9px', color: '#000' }}>ID: {apt.id}</div>
                      <div style={{ fontSize: '9px', color: '#000' }}>📞 {apt.phone}</div>
                    </td>
                    <td style={{ border: '1px solid black', padding: '8px', verticalAlign: 'top', fontWeight: 'bold' }}>ช่าง{apt.artist}</td>
                    <td style={{ border: '1px solid black', padding: '8px', verticalAlign: 'top' }}>
                      <div style={{ fontWeight: 'bold' }}>{apt.style}</div>
                      <div style={{ fontSize: '9px', color: '#555' }}>ขนาด: {apt.size}</div>
                    </td>
                    <td style={{ border: '1px solid black', padding: '8px', verticalAlign: 'top', fontSize: '10px' }}>{apt.note || '-'}</td>
                    <td style={{ border: '1px solid black', padding: '8px', verticalAlign: 'top', textAlign: 'center' }}>
                      <div style={{ borderBottom: '1px solid #777', height: '16px', marginTop: '4px' }}></div>
                      <span style={{ fontSize: '8px', color: '#000', marginTop: '2px', display: 'block', fontWeight: 'bold' }}>[{apt.status}]</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ marginTop: '30px', borderTop: '1px solid black', paddingTop: '15px', display: 'flex', justifyContent: 'space-between', fontSize: '10px' }}>
              <div>
                <p style={{ margin: '0 0 4px 0', fontWeight: 'bold' }}><strong>ข้อปฏิบัติทางเทคนิคสาธารณสุขประจำร้าน:</strong></p>
                <p style={{ margin: '0' }}>1. อุปกรณ์เข็มสัก กระบอกและจุกสี ต้องเป็นแบบใช้งานครั้งเดียวหมดทิ้งทันที (Single Use Only)</p>
                <p style={{ margin: '0' }}>2. ช่างสักต้องยืนยันตัวตน และบันทึกยอดงานเสร็จสิ้นคิวผ่านระบบหลังทำงานสมบูรณ์ครบด้าน</p>
              </div>
              <div style={{ textAlign: 'right', minWidth: '180px' }}>
                <p style={{ margin: '0 0 10px 0', fontWeight: 'bold' }}><strong>ผู้จัดการสตูดิโอผู้มีสิทธิ์อนุมัติ:</strong></p>
                <div style={{ borderBottom: '1px solid black', width: '140px', margin: '20px 0 4px auto' }}></div>
                <span>(ลงลายมือชื่อพนักงานคุมบัญชีร้าน)</span>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
};

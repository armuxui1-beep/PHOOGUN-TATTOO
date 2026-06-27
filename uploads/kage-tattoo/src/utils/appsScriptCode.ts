export const APPS_SCRIPT_GUIDE = `
### 🛠️ คู่มือติดตั้งฐานข้อมูลอัจฉริยะ (Dynamic Database Engine)

เพื่อเปิดใช้งานการซิงค์ข้อมูลจริงกับ Google Sheets ที่ **"พร้อมรับฟังก์ชันใหม่โดยไม่ต้องคัดลอกโค้ดไปวางซ้ำอีก!"** ให้บันทึกโค้ดนี้เพียงครั้งเดียว:

1. **สร้างไฟล์ Google Sheets**:
   - เข้าไปที่ [Google Sheets ของคุณ](https://docs.google.com/spreadsheets/d/1W6vVnFi71jw4EPFflyf-rZDubf0lV4p5saULqCi_ycI/edit?usp=sharing) หรือสร้างชีตใหม่
   - จดจำ **Spreadsheet ID** จาก URL ของชีตคุณ (เช่น \`https://docs.google.com/spreadsheets/d/SpreadsheetID/edit\`)

2. **เปิดหน้าต่าง Apps Script**:
   - ในชีตของคุณ ไปที่เมนู **ส่วนขยาย (Extensions)** -> **Apps Script**
   - ลบโค้ดเริ่มต้นออกทั้งหมด แล้วนำโค้ดฐานข้อมูลอัจฉริยะด้านล่างไปวางแทนที่

3. **รันเตรียมข้อมูลงวดแรก**:
   - เลือกฟังก์ชัน **\`initDatabase\`** บนแถบเมนูด้านบน แล้วกด **เรียกใช้งาน (Run)**
   - อนุญาตสิทธิ์การเข้าถึงให้เรียบร้อย (กด Advance -> ไปที่โครงการ หรือ Go to Untitled Project)
   - ฟังก์ชันนี้จะเตรียมแท็บดีฟอลต์ (แกลเลอรี, นัดหมาย, คลังสินค้า, บันทึกการเงิน, และรีวิว) ให้พร้อมทันที

4. **เผยแพร่แอปเว็บ (Deploy Web App)**:
   - กดปุ่ม **การทำให้ใช้งานได้ (Deploy)** -> **การจัดการการทำให้ใช้งานได้ใหม่ (New deployment)**
   - เลือกดีพลอยเป็น **แอปเว็บ (Web app)**
   - ตั้งค่าบทบาท:
     * **Execute as**: Me (อีเมลของคุณ)
     * **Who has access**: Anyone (ทุกคน - เพื่อให้แอป React เข้าถึงได้)
   - กดปุ่ม **ทำให้ใช้งานได้ (Deploy)** และคัดลอก **URL แอปเว็บ (Web app URL)**
   - นำลิงก์ไปใส่ในแท็บติดตั้งชีตหลังบ้านของระบบเป็นอันเสร็จสมบูรณ์!
`;

export const APPS_SCRIPT_CODE = `/**
 * =========================================================================
 * KAGE TATTOO - DYNAMIC INTEGRATED DATABASE DRIVER (SELF-HEALING SCHEMA)
 * =========================================================================
 * ติดตั้งโค้ดระบบจัดการฐานข้อมูลอัจฉริยะแบบรวมศูนย์ชนิดไดนามิกส์เพียงครั้งเดียว
 * สามารถตรวจหาแท็บคอลัมน์ใหม่ๆ และขยายโครงสร้าง Sheets อัตโนมัติเมื่อฝั่ง React สั่งงานเข้ามา
 */

// ⚙️ ตั้งค่าพิเศษสำหรับ "สคริปต์แบบแยกอิสระ (Standalone Script)"
// หากท่านสร้างสคริปต์นี้จาก Google Drive โดยตรง (ไม่ใช่เมนู "ส่วนขยาย -> Apps Script" ในไฟล์ชีต)
// ให้กรอก URL ของไฟล์ Google Sheets หรือใส่ Spreadsheet ID ไว้ในเครื่องหมายอัญประกาศคู่ด้านล่างนี้ (หากเปิดผ่าน "ส่วนขยาย" ในชีตโดยตรงแล้ว ให้ปล่อยเป็นคำว่างเปล่าแบบเดิมได้เลยครับ)
var SPREADSHEET_ID_OR_URL = "https://docs.google.com/spreadsheets/d/1W6vVnFi71jw4EPFflyf-rZDubf0lV4p5saULqCi_ycI/edit?usp=sharing";

// ฟังก์ชันเปิดเชื่อมต่อชีตรูปแบบยืดหยุ่น ป้องกันกรณีไม่พบชีตที่ใช้งานควบคู่กัน
function getSpreadsheet() {
  var ss = null;
  try {
    ss = SpreadsheetApp.getActiveSpreadsheet();
  } catch (e) {
    // ข้ามกรณีรันระบบแยกต่างหาก
  }
  
  if (!ss && SPREADSHEET_ID_OR_URL) {
    try {
      if (SPREADSHEET_ID_OR_URL.indexOf("docs.google.com") !== -1) {
        var match = SPREADSHEET_ID_OR_URL.match(/\\/d\\/([a-zA-Z0-9-_]+)/);
        if (match) {
          ss = SpreadsheetApp.openById(match[1]);
        }
      } else {
        ss = SpreadsheetApp.openById(SPREADSHEET_ID_OR_URL);
      }
    } catch (e) {
      Logger.log("ไม่สามารถเชื่อมต่อไฟล์ Google Sheets ผ่านคีย์สะพานชีตที่คุณป้อนได้: " + e.toString());
    }
  }
  return ss;
}

// ฟังก์ชันเริ่มต้นสร้างตารางและข้อมูลตั้งต้นในการเริ่มใช้งาน เพื่อให้ข้อมูลพร้อมใช้งานทันทีและเชื่อมโยงได้อย่างราบรื่น
function initDatabase() {
  var ss = getSpreadsheet();
  if (!ss) {
    throw new Error("หาไฟล์ Google Sheets ไม่พบ! โปรดดูวิธีแก้ไข: (1) ตรวจสอบให้แน่ใจว่าคุณสร้าง Apps Script นี้ผ่านเมนูในชีตของคุณ (ส่วนขยาย -> Apps Script) หรือ (2) หากคุณจงใจสร้างสคริปต์แบบสแตนด์อโลน (Standalone) ให้ระบุ URL หรือ ID ของชีตในตัวแปร SPREADSHEET_ID_OR_URL บนสุดของสคริปต์นี้!");
  }
  
  // 1. ตารางแกลเลอรีรูปภาพ
  var gallerySheet = ss.getSheetByName("gallery");
  if (!gallerySheet) {
    gallerySheet = ss.insertSheet("gallery");
    gallerySheet.appendRow(["id", "category", "name", "artist", "imageUrl", "description"]);
    gallerySheet.appendRow([
      "gal-001", "นีโอ-อิเรซูมิ", "Neo Cyber Dragon backpiece", "พิมพ์ดาว", 
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB7NVOEjNz6UrNeeery47HnQm4ELwcsgVoKeV9_1jbJQFJRlD3vjVg3MblzCQoAFBsA3DkFlGXJcuE_SRnhvQqg117JEfo1ZyHJZ93PBT_YHDgNVSCYPuZ-JAkDEcWq1_rhGLojo1qigElaHw0lEnwhpnmTVyFv8DysAJ6gDkHJanGx_DGoYIViTiJ-63OYyCDbqGJM4muNpicCqUaf4MTRb4gR4koKfvzbM-JU8yibuVQFSEy-U8VzMYvQdrsk5h2JwYzKM1Nz7LE", 
      "Traditional Japanese dragon infused with future biomechanical details"
    ]);
    gallerySheet.appendRow([
      "gal-002", "ไซเบอร์-แบล็คเวิร์ค", "Circuit Geometrics sleeve", "กิม", 
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCFq6SSVuK4ZNIV9Zzg-ehHk3FiDMfqopjfAC1o1kn3E9NGlAlLGwAxA0DqQsNQONQ8kzzn5YU6Xhaj0hMII498AE_8iSCwmsBn6I8C8LyEPwG6bwB8fnhfi4DOZMadOY50ooudPakZ2c2Xf6IQ3VCzeaUrGtLo1A9OETp0RbjZw4nRoq3jPYmvO-AxAHee-CG6u1KbdxIc9fHBe0tAC0A5QXaF2dQE2rze1rnJ9rXqJrFHDYEQRKqfuvH14vMXURZJG0fRVd_4vCo", 
      "Striking forearm patterns and circuit-inspired lines with dark shades"
    ]);
  }

  // 2. ตารางจองคิว / นัดหมายสัก
  var aptSheet = ss.getSheetByName("appointments");
  if (!aptSheet) {
    aptSheet = ss.insertSheet("appointments");
    aptSheet.appendRow(["id", "name", "phone", "email", "date", "time", "artist", "style", "size", "note", "status", "createdAt"]);
    aptSheet.appendRow(["APT-9281", "วิชัย รักดี", "081-234-5678", "wichai.r@gmail.com", "2026-06-12", "13:00", "กวิน", "ดาร์ก มินิมอล", "10x10 cm", "อยากได้รูปดอกกุหลาบ คอนทราสต์ชัดเจนลายเส้นบางๆ", "Confirmed", "2026-06-09T08:00:00Z"]);
    aptSheet.appendRow(["APT-9282", "สมหญิง แสงทอง", "089-876-5432", "somying.s@hotmail.com", "2026-06-14", "11:00", "พิมพ์ดาว", "นีโอ-อิเรซูมิ", "A4 Size", "ลายมังกรคาบลูกแก้วที่หลัง ค่อยๆ แบ่งทำสัก 3 รอบ", "Confirmed", "2026-06-09T08:15:00Z"]);
  }

  // 3. ตารางคลังสินค้า
  var invSheet = ss.getSheetByName("inventory");
  if (!invSheet) {
    invSheet = ss.insertSheet("inventory");
    invSheet.appendRow(["code", "name", "category", "currentStock", "minStock", "unit", "status"]);
    invSheet.appendRow(["NDL-1203RL", "Kwadron Needles 1203RL", "Needles", 2, 5, "Boxes", "LOW"]);
    invSheet.appendRow(["INK-DYN-08", "Dynamic Black Ink (8oz)", "Inks", 12, 4, "Bottles", "OK"]);
  }

  // 4. ตารางการเงิน
  var finSheet = ss.getSheetByName("financials");
  if (!finSheet) {
    finSheet = ss.insertSheet("financials");
    finSheet.appendRow(["trxId", "date", "time", "title", "category", "type", "amount", "status", "artist"]);
    finSheet.appendRow(["TRX-9923", "2026-06-08", "14:30", "มัดจำรอยสัก (คุณวิชัย - ลายกุหลาบ)", "รายได้ / Deposit", "income", 5000, "Success", "กวิน"]);
  }

  // 5. ตารางบัตรแจ้งปัญหา / Tickets
  var tickSheet = ss.getSheetByName("tickets");
  if (!tickSheet) {
    tickSheet = ss.insertSheet("tickets");
    tickSheet.appendRow(["id", "category", "title", "details", "status", "createdAt"]);
    tickSheet.appendRow(["TKT-8924", "ปัญหาเทคนิค / Google Sheets Sync", "Map ไม่โหลดในหน้าลูกค้าสาขาหลัก", "ไอเฟรมแผนที่แสดงแอนิเมชั่นหมุนไม่โหลดเมื่อเข้าพอร์ตโฟลิโอผ่าน Safari", "Checking", "2026-06-09T05:22:00.000Z"]);
  }

  // 6. ตารางความพึงพอใจ / รีวิวลูกค้า
  var revSheet = ss.getSheetByName("reviews");
  if (!revSheet) {
    revSheet = ss.insertSheet("reviews");
    revSheet.appendRow(["id", "author", "rating", "message", "status", "createdAt", "artist"]);
    revSheet.appendRow(["REV-001", "อนันดา สิริโชติ", 5, "งานสักดาร์กมินิมอลกับช่างกวินสวยเนี๊ยบและเบามือมากๆ ครับ แนะนำร้านนี้เลย บรรยากาศเงียบสงบลึกลับดีมาก", "Approved", "2026-06-07T12:30:00.000Z", "กวิน"]);
    revSheet.appendRow(["REV-002", "มุกรินทร์ แก้วมณี", 5, "ช่างพิมพ์ดาวสักมังกรแบล็คเวิร์คได้อลังการมากค่ะ คุ้มค่าการรอคอยและการจอง แนะนำให้ลงมัดจำล็อกคิวล่วงหน้าเลย", "Approved", "2026-06-08T15:45:00.000Z", "พิมพ์ดาว"]);
  }

  // 7. ตารางเก็บประวัติเวอร์ชันและรูปแบบ Schema ของ API Bridge
  var metaSheet = ss.getSheetByName("schema_metadata");
  if (!metaSheet) {
    metaSheet = ss.insertSheet("schema_metadata");
    metaSheet.appendRow(["tableName", "version", "schemaJson", "lastUpdated"]);
    metaSheet.appendRow(["gallery", "1", JSON.stringify([{"name":"id","type":"STRING"},{"name":"category","type":"STRING"},{"name":"name","type":"STRING"},{"name":"artist","type":"STRING"},{"name":"imageUrl","type":"STRING"},{"name":"description","type":"STRING"}]), new Date().toISOString()]);
    metaSheet.appendRow(["appointments", "1", JSON.stringify([{"name":"id","type":"STRING"},{"name":"name","type":"STRING"},{"name":"phone","type":"STRING"},{"name":"email","type":"STRING"},{"name":"date","type":"STRING"},{"name":"time","type":"STRING"},{"name":"artist","type":"STRING"},{"name":"style","type":"STRING"},{"name":"size","type":"STRING"},{"name":"note","type":"STRING"},{"name":"status","type":"STRING"},{"name":"createdAt","type":"STRING"}]), new Date().toISOString()]);
  }
}

// 🌐 การดึงฐานข้อมูลแบบไดนามิกส์ทั้งหมด (GET HTTP REQUEST)
// อ่านแท็บใน Spreadsheet ทั้งหมดแบบไร้พรมแดน เพิ่มชีตไหนเพิ่มข้อมูลทันทีแบบออโต้!
function doGet(e) {
  var ss = getSpreadsheet();
  if (!ss) {
    return createCORSOutput({ status: "error", message: "หา Google Sheets ไม่เจอ! กรุณาตรวจสอบการตั้งค่า Spreadsheet ID ของท่าน" });
  }
  
  // ตรวจสอบความถูกต้องและสร้างชีตรวมกันหากยังไม่มี
  initDatabase();
  
  var sheets = ss.getSheets();
  var db = {};
  
  // ลูปหยิบข้อมูลจากทุกแท็บในระบบโดยไม่ต้องประกาศจำเพาะชื่อ
  sheets.forEach(function(sheet) {
    var name = sheet.getName();
    db[name] = getSheetDataAsJson(ss, name);
  });
  
  return ContentService.createTextOutput(JSON.stringify(db))
    .setMimeType(ContentService.MimeType.JSON);
}

// 🌐 การแก้ไข / ส่งข้อมูลมาอัปเดต (POST HTTP REQUEST)
function doPost(e) {
  var ss = getSpreadsheet();
  if (!ss) {
    return createCORSOutput({ status: "error", message: "หา Google Sheets ไม่เจอ! กรุณาตรวจสอบการตั้งค่า Spreadsheet ID ของท่าน" });
  }
  
  try {
    var rawData = e.postData.contents;
    var data = JSON.parse(rawData);
    var action = data.action;
    
    // =========================================================================
    // ⭐️ 1. ENGINE สำคัญ: GENERIC DYNAMIC UPSERT (ดูแลฐานข้อมูลอัจฉริยะแบบไร้รอยต่อ)
    // ถ้าระบบส่ง action === "upsert" หรือ alias อื่นๆ จะตรวจหาคอลัมน์ใหม่ ชั่งน้ำหนักเช็ดตัวตนเพื่อ insert/update อัตโนมัติ
    // =========================================================================
    if (action === "upsert" || action === "upsert_row" || action === "generic_write" || action === "sync_sheet") {
      var targetSheetName = data.tableName || data.sheetName || data.table || data.sheet;
      var payload = data.data || data.payload || data.rowPayload || data.jsonObject; // ข้อมูล key-value ที่ส่งเข้ามา
      var idColumnName = data.idColumn || "id"; // คอลัมน์สำหรับตรวจสอบตัวตนซ้ำ
      
      if (!targetSheetName) {
        return createCORSOutput({ status: "error", message: "Missing target table or sheet name parameter" });
      }
      if (!payload || typeof payload !== "object") {
        return createCORSOutput({ status: "error", message: "Missing or invalid payload data object" });
      }
      
      var sheet = ss.getSheetByName(targetSheetName);
      if (!sheet) {
        sheet = ss.insertSheet(targetSheetName);
      }
      
      // กู้และประมวลผล Header สภาพปัจจุบัน
      var keys = Object.keys(payload);
      var currentColumnsCount = sheet.getLastColumn();
      var headers = currentColumnsCount > 0 ? sheet.getRange(1, 1, 1, currentColumnsCount).getValues()[0] : [];
      
      // หากตารางว่างเปล่า ให้สร้าง Header ของคุณตามโครงสร้างที่ส่งมาทันที
      if (headers.length === 0) {
        headers = keys;
        sheet.appendRow(headers);
      } else {
        // ค้นหาว่ามีฟิลด์ข้อมูลใหม่ที่ระบบ React เพิ่มเข้ามาหรือไม่
        var newHeaders = [];
        keys.forEach(function(key) {
          if (headers.indexOf(key) === -1) {
            newHeaders.push(key);
          }
        });
        
        // หากฝั่ง React ส่งคอลัมน์ใหม่มา ระบบจะต่อท้ายคอลัมน์ในชีตให้อัตโนมัติทันทีเพื่อทำ Schema Evolution (Schema Hot-Heal)
        if (newHeaders.length > 0) {
          var startCol = headers.length + 1;
          var appendRange = sheet.getRange(1, startCol, 1, newHeaders.length);
          appendRange.setValues([newHeaders]);
          headers = headers.concat(newHeaders); // อัปเดตข้อมูลหน่วยความจำ
        }
      }
      
      // ค้นหาตำแหน่งแถวเดิมหากข้อมูลนั้นมี ID ยืนยันว่าเป็นการอัปเดต (Update Row)
      var targetIdVal = payload[idColumnName];
      var updateRowIndex = -1;
      
      if (targetIdVal !== undefined && targetIdVal !== null) {
        var allValues = sheet.getDataRange().getValues();
        var idColIdx = headers.indexOf(idColumnName);
        if (idColIdx !== -1) {
          for (var r = 1; r < allValues.length; r++) {
            if (String(allValues[r][idColIdx]) === String(targetIdVal)) {
              updateRowIndex = r + 1; // อาร์เรย์แบบ 1-indexed รวมหัวแถว
              break;
            }
          }
        }
      }
      
      // เรียงค่านลุ่มในแถวให้ตรงกับตำแหน่ง Header คอลัมน์ที่สมบูรณ์แบบ
      var rowValues = headers.map(function(header) {
        var val = payload[header];
        return val !== undefined ? val : "";
      });
      
      if (updateRowIndex !== -1) {
        // อัปเดตค่าที่คอลัมน์เปลี่ยนไปลงกระดาษจำกัดตำแหน่งเดิม
        var updateRange = sheet.getRange(updateRowIndex, 1, 1, rowValues.length);
        updateRange.setValues([rowValues]);
        return createCORSOutput({ 
          status: "success", 
          operation: "update", 
          id: targetIdVal, 
          sheet: targetSheetName,
          columnsSynced: headers.length
        });
      } else {
        // เพิ่มแถวใหม่ต่อท้าย (Insert)
        sheet.appendRow(rowValues);
        return createCORSOutput({ 
          status: "success", 
          operation: "insert", 
          id: targetIdVal, 
          sheet: targetSheetName,
          columnsSynced: headers.length
        });
      }
    }
    
    // =========================================================================
    // ⭐️ 2. โซนย้อนหลังเพื่อความเสถียร (Legacy Actions Backwards-Compatibility)
    // =========================================================================
    else if (action === "book_appointment") {
      var sheet = ss.getSheetByName("appointments");
      var newId = "APT-" + Math.floor(1000 + Math.random() * 9000);
      sheet.appendRow([
        newId,
        data.name || "",
        data.phone || "",
        data.email || "",
        data.date || "",
        data.time || "",
        data.artist || "",
        data.style || "",
        data.size || "",
        data.note || "",
        "Pending",
        new Date().toISOString()
      ]);
      return createCORSOutput({ status: "success", id: newId });
    }
    
    else if (action === "add_inventory") {
      var sheet = ss.getSheetByName("inventory");
      var status = Number(data.currentStock) < Number(data.minStock) ? "LOW" : "OK";
      sheet.appendRow([
        data.code || "",
        data.name || "",
        data.category || "",
        Number(data.currentStock) || 0,
        Number(data.minStock) || 0,
        data.unit || "",
        status
      ]);
      return createCORSOutput({ status: "success" });
    }
    
    else if (action === "update_stock") {
      var sheet = ss.getSheetByName("inventory");
      var values = sheet.getDataRange().getValues();
      for (var i = 1; i < values.length; i++) {
        if (values[i][0] === data.code) {
          var newStock = values[i][3] + (data.delta || 0);
          var minStock = values[i][4];
          var newStatus = newStock < minStock ? "LOW" : "OK";
          sheet.getRange(i + 1, 4).setValue(newStock); // update currentStock
          sheet.getRange(i + 1, 7).setValue(newStatus); // update status
          break;
        }
      }
      return createCORSOutput({ status: "success" });
    }
    
    else if (action === "add_transaction") {
      var sheet = ss.getSheetByName("financials");
      var newTrxId = "TRX-" + Math.floor(1000 + Math.random() * 9000);
      var now = new Date();
      var dateStr = now.toISOString().split("T")[0];
      var timeStr = now.toTimeString().split(" ")[0].substring(0, 5);
      
      sheet.appendRow([
        newTrxId,
        dateStr,
        timeStr,
        data.title || "",
        data.category || "",
        data.type || "expense",
        Number(data.amount) || 0,
        data.status || "Success",
        data.artist || ""
      ]);
      return createCORSOutput({ status: "success", trxId: newTrxId });
    }

    else if (action === "add_ticket") {
      var sheet = ss.getSheetByName("tickets");
      var newId = "TKT-" + Math.floor(1000 + Math.random() * 9000);
      sheet.appendRow([
        newId,
        data.category || "",
        data.title || "",
        data.details || "",
        "Checking",
        new Date().toISOString()
      ]);
      return createCORSOutput({ status: "success", id: newId });
    }
    
    else if (action === "add_gallery_item") {
      var sheet = ss.getSheetByName("gallery");
      var newId = "gal-" + Math.floor(100 + Math.random() * 900);
      sheet.appendRow([
        newId,
        data.category || "ไซเบอร์-แบล็คเวิร์ค",
        data.name || "",
        data.artist || "พิมพ์ดาว",
        data.imageUrl || "",
        data.description || ""
      ]);
      return createCORSOutput({ status: "success", id: newId });
    }
    
    else if (action === "add_review") {
      var sheet = ss.getSheetByName("reviews");
      var newId = "REV-" + Math.floor(1000 + Math.random() * 9000);
      sheet.appendRow([
        newId,
        data.author || "",
        Number(data.rating) || 5,
        data.message || "",
        data.status || "Pending",
        new Date().toISOString(),
        data.artist || ""
      ]);
      return createCORSOutput({ status: "success", id: newId });
    }
    
    else if (action === "delete_row") {
      var targetSheetName = data.tableName || data.sheetName || data.table || data.sheet;
      var idColumnName = data.idColumn || "id";
      var idVal = data.id || data.idVal || data.value;
      
      if (!targetSheetName || idVal === undefined || idVal === null) {
        return createCORSOutput({ status: "error", message: "Missing tableName or id parameters" });
      }
      
      var sheet = ss.getSheetByName(targetSheetName);
      if (!sheet) {
        return createCORSOutput({ status: "error", message: "Sheet not found" });
      }
      
      var values = sheet.getDataRange().getValues();
      var headers = values[0];
      var idColIdx = headers.indexOf(idColumnName);
      
      if (idColIdx === -1) {
        return createCORSOutput({ status: "error", message: "ID column not found in sheet" });
      }
      
      var deleted = false;
      for (var r = values.length - 1; r >= 1; r--) {
        if (String(values[r][idColIdx]) === String(idVal)) {
          sheet.deleteRow(r + 1);
          deleted = true;
        }
      }
      
      return createCORSOutput({ status: "success", deleted: deleted, id: idVal });
    }
    
    // =========================================================================
    // ⭐️ 3. VERSION-CONTROLLED API BRIDGE & DYNAMIC SCHEMA ENGINE
    // คัดลอกและอัปเดตโครงสร้างตาราง ยึดหลัก Auto-Migration และบันทึกลงชีต metadata อัตโนมัติ
    // =========================================================================
    else if (action === "sync_schema") {
      var targetTableName = data.tableName;
      var schemaFields = data.fields; // อาร์เรย์ของ { name: string, type: string }
      var targetVersion = data.version || 1;
      
      if (!targetTableName || !schemaFields || !Array.isArray(schemaFields)) {
        return createCORSOutput({ status: "error", message: "Missing tableName or fields array" });
      }
      
      // 1. ดำเนินการสร้าง/ยืนยัน ตัวตนแท็บชีต
      var targetSheet = ss.getSheetByName(targetTableName);
      if (!targetSheet) {
        targetSheet = ss.insertSheet(targetTableName);
      }
      
      // 2. สกัดหัวข้อคอลัมน์ที่ร้องขอมาล่าสุด
      var desiredHeaders = schemaFields.map(function(f) { return f.name; });
      
      // 3. ปรับโครงสร้างเพื่อทำการ Auto-Heal คอลัมน์ที่ขาดไปทางปีกขวา
      var currentColumnsCount = targetSheet.getLastColumn();
      if (currentColumnsCount === 0) {
        targetSheet.appendRow(desiredHeaders);
      } else {
        var existingHeaders = targetSheet.getRange(1, 1, 1, currentColumnsCount).getValues()[0];
        var columnsToAdd = [];
        desiredHeaders.forEach(function(h) {
          if (existingHeaders.indexOf(h) === -1) {
            columnsToAdd.push(h);
          }
        });
        
        if (columnsToAdd.length > 0) {
          var startCol = existingHeaders.length + 1;
          targetSheet.getRange(1, startCol, 1, columnsToAdd.length).setValues([columnsToAdd]);
        }
      }
      
      // 4. บันทึกคำจำกัดความ (Schema Definition) ลงใน "schema_metadata"
      var metaSheet = ss.getSheetByName("schema_metadata");
      if (!metaSheet) {
        metaSheet = ss.insertSheet("schema_metadata");
        metaSheet.appendRow(["tableName", "version", "schemaJson", "lastUpdated"]);
      }
      
      var metaRows = metaSheet.getDataRange().getValues();
      var foundMetaRow = -1;
      for (var m = 1; m < metaRows.length; m++) {
        if (metaRows[m][0] === targetTableName) {
          foundMetaRow = m + 1;
          break;
        }
      }
      
      var nowStr = new Date().toISOString();
      var schemaJsonStr = JSON.stringify(schemaFields);
      
      if (foundMetaRow !== -1) {
        metaSheet.getRange(foundMetaRow, 2).setValue(String(targetVersion));
        metaSheet.getRange(foundMetaRow, 3).setValue(schemaJsonStr);
        metaSheet.getRange(foundMetaRow, 4).setValue(nowStr);
      } else {
        metaSheet.appendRow([targetTableName, String(targetVersion), schemaJsonStr, nowStr]);
      }
      
      return createCORSOutput({ 
        status: "success", 
        message: "Schema synced and auto-migrated successfully in Google Sheet!",
        tableName: targetTableName,
        version: targetVersion,
        totalColumns: targetSheet.getLastColumn()
      });
    }
    
    return createCORSOutput({ status: "error", message: "Action not supported" });
  } catch (err) {
    return createCORSOutput({ status: "error", message: err.toString() });
  }
}

// ตัวช่วยอ่านข้อมูลของชีตและแปลงเป็น JSON Array คืนค่าออกมา
function getSheetDataAsJson(ss, sheetName) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) return [];
  
  var range = sheet.getDataRange();
  if (range.getNumRows() <= 1 && range.getNumColumns() <= 1 && range.getCell(1, 1).getValue() === "") {
    return []; // ตารางว่างเปล่า
  }
  
  var values = range.getValues();
  var headers = values[0];
  var result = [];
  
  for (var i = 1; i < values.length; i++) {
    var obj = {};
    for (var j = 0; j < headers.length; j++) {
      var val = values[i][j];
      if (val instanceof Date) {
        // หากพบเขตข้อมูลประเภทเวลา ให้จัดฟอร์แมตให้อย่างละเมียด
        try {
          obj[headers[j]] = val.toISOString();
        } catch(e) {
          obj[headers[j]] = val.toString();
        }
      } else {
        obj[headers[j]] = val;
      }
    }
    result.push(obj);
  }
  return result;
}

// สร้าง CORS Response สำหรับ POST/GET Request
function createCORSOutput(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
`;

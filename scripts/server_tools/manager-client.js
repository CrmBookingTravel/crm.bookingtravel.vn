// =========================================================================
// NODE.JS CLIENT: QUẢN LÝ TẤT CẢ GOOGLE SHEETS
// =========================================================================

// Dán URL Web App bạn nhận được sau khi Triển khai vào đây:
const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbxouSOuoxyFwsVmwEQHVyswcuUFUgG-GBt8bJcDPVtMDqjSEBcQzucuwpXrQOYBvVRR/exec';

/**
 * 1. Liệt kê TẤT CẢ các file Google Sheets có trong tài khoản Google Drive
 */
async function listAllSheets(options = {}) {
  checkUrl();
  const silent = options.silent || false;
  try {
    const res = await fetch(`${WEB_APP_URL}?action=list`, { redirect: 'follow' });
    const result = await res.json();
    if (result.success) {
      if (!silent) {
        console.log(`\n📁 TÌM THẤY TỔNG CỘNG: ${result.total} FILE GOOGLE SHEETS:`);
        console.table(result.sheets.map(s => ({
          'Tên Bảng Tính': s.name,
          'ID File': s.id,
          'Link': s.url
        })));
      }
      return result.sheets;
    } else {
      console.error('❌ Lỗi:', result.error);
    }
  } catch (error) {
    console.error('❌ Lỗi kết nối:', error.message);
  }
}

/**
 * 2. Tạo một file Google Sheet mới trong Google Drive
 * @param {string} sheetName - Tên của bảng tính cần tạo mới
 */
async function createNewSheet(sheetName) {
  checkUrl();
  try {
    const res = await fetch(WEB_APP_URL, {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'create', name: sheetName })
    });
    const result = await res.json();
    if (result.success) {
      console.log(`\n🎉 ĐÃ TẠO BẢNG TÍNH MỚI THÀNH CÔNG:`);
      console.log(`- Tên: ${result.name}`);
      console.log(`- ID: ${result.id}`);
      console.log(`- Đường dẫn: ${result.url}`);
      return result;
    } else {
      console.error('❌ Lỗi:', result.error);
    }
  } catch (error) {
    console.error('❌ Lỗi kết nối:', error.message);
  }
}

/**
 * 3. Đọc dữ liệu từ một bảng tính bất kỳ theo ID
 * @param {string} spreadsheetId - ID của file Google Sheet
 */
async function readSheetData(spreadsheetId) {
  checkUrl();
  try {
    const res = await fetch(`${WEB_APP_URL}?action=read&id=${encodeURIComponent(spreadsheetId)}`, {
      redirect: 'follow'
    });
    const result = await res.json();
    if (result.success) {
      console.log(`\n📊 DỮ LIỆU BẢNG TÍNH "${result.sheetName}" (Tab: ${result.activeTab}):`);
      console.table(result.data);
      return result.data;
    } else {
      console.error('❌ Lỗi:', result.error);
    }
  } catch (error) {
    console.error('❌ Lỗi kết nối:', error.message);
  }
}

/**
 * 4. Thêm dòng mới vào bất kỳ bảng tính nào theo ID
 * @param {string} spreadsheetId - ID của file Google Sheet
 * @param {Array<any>} rowData - Dữ liệu dòng mới cần chèn
 */
async function appendRowToSheet(spreadsheetId, rowData) {
  checkUrl();
  try {
    const res = await fetch(WEB_APP_URL, {
      method: 'POST',
      redirect: 'follow',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action: 'append', id: spreadsheetId, row: rowData })
    });
    const result = await res.json();
    if (result.success) {
      console.log(`✅ ${result.message}`);
      return result;
    } else {
      console.error('❌ Lỗi:', result.error);
    }
  } catch (error) {
    console.error('❌ Lỗi kết nối:', error.message);
  }
}

function checkUrl() {
  if (WEB_APP_URL === 'DIEN_URL_WEB_APP_CUA_BAN_VAO_DAY') {
    console.error('👉 Vui lòng điền WEB_APP_URL vào dòng 6 của file manager-client.js trước khi chạy!');
    process.exit(1);
  }
}

// ==================== CHẠY THỬ NGHIỆM ====================
async function main() {
  console.log('--- 1. Liệt kê tất cả file Google Sheets trong tài khoản ---');
  const sheets = await listAllSheets();

  // Ví dụ: Tạo bảng tính mới
  // await createNewSheet('Quản lý Booking Tour 2026');

  // Ví dụ: Đọc dữ liệu file đầu tiên tìm thấy
  // if (sheets && sheets.length > 0) {
  //   await readSheetData(sheets[0].id);
  // }
}

if (require.main === module) {
  main();
}

module.exports = {
  listAllSheets,
  createNewSheet,
  readSheetData,
  appendRowToSheet
};

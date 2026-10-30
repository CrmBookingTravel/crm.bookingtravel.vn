const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');

// Đường dẫn tới file JSON Service Account bạn tải từ Google Cloud Console
const KEY_FILE_PATH = path.join(__dirname, 'service-account.json');

// Khởi tạo Google Sheets API client
function getSheetsClient() {
  if (!fs.existsSync(KEY_FILE_PATH)) {
    console.error('❌ Chưa tìm thấy file "service-account.json"!');
    console.error('👉 Vui lòng tạo Service Account trên Google Cloud Console, tải file JSON key về và đổi tên thành "service-account.json", lưu vào cùng thư mục với file index.js.');
    process.exit(1);
  }

  const auth = new google.auth.GoogleAuth({
    keyFile: KEY_FILE_PATH,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  return google.sheets({ version: 'v4', auth });
}

/**
 * Đọc dữ liệu từ Google Sheets
 * @param {string} spreadsheetId - ID của file Google Sheet (lấy từ URL)
 * @param {string} range - Vùng dữ liệu cần đọc (ví dụ: 'Trang tính1!A1:E10' hoặc 'Sheet1!A:Z')
 */
async function readSheet(spreadsheetId, range) {
  const sheets = getSheetsClient();
  try {
    const res = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    const rows = res.data.values;
    if (!rows || rows.length === 0) {
      console.log('⚠️ Không tìm thấy dữ liệu trong vùng đã chọn.');
      return [];
    }
    console.log(`✅ Đã đọc thành công ${rows.length} dòng dữ liệu:`);
    console.table(rows);
    return rows;
  } catch (error) {
    console.error('❌ Lỗi khi đọc Google Sheet:', error.message);
    throw error;
  }
}

/**
 * Ghi/Thêm dòng mới vào Google Sheets
 * @param {string} spreadsheetId - ID của file Google Sheet
 * @param {string} range - Vùng cần thêm (ví dụ: 'Sheet1!A1' hoặc 'Trang tính1!A1')
 * @param {Array<Array<any>>} values - Mảng 2 chiều chứa các dòng dữ liệu cần ghi
 */
async function appendSheet(spreadsheetId, range, values) {
  const sheets = getSheetsClient();
  try {
    const res = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values,
      },
    });
    console.log(`✅ Đã thêm thành công ${res.data.updates.updatedRows} dòng vào sheet!`);
    return res.data;
  } catch (error) {
    console.error('❌ Lỗi khi ghi vào Google Sheet:', error.message);
    throw error;
  }
}

// ==================== VÍ DỤ SỬ DỤNG ====================
async function main() {
  // Thay thế ID của file Google Sheet của bạn vào đây
  // URL: https://docs.google.com/spreadsheets/d/<SPREADSHEET_ID>/edit
  const SPREADSHEET_ID = 'DIEN_SPREADSHEET_ID_CUA_BAN_VAO_DAY';

  if (SPREADSHEET_ID === 'DIEN_SPREADSHEET_ID_CUA_BAN_VAO_DAY') {
    console.log('📌 HƯỚNG DẪN:');
    console.log('1. Đặt file "service-account.json" vào thư mục này.');
    console.log('2. Mở file Google Sheet bằng tài khoản "sale.bookingtravel.com.vn@gmail.com".');
    console.log('3. Nhấn nút "Chia sẻ" (Share), dán email của Service Account vào và cấp quyền "Người chỉnh sửa" (Editor).');
    console.log('4. Copy SPREADSHEET_ID từ thanh địa chỉ trình duyệt và điền vào biến SPREADSHEET_ID trong index.js.');
    return;
  }

  // 1. Ví dụ ghi thêm một dòng mới
  console.log('\n--- Thử nghiệm ghi dữ liệu ---');
  await appendSheet(SPREADSHEET_ID, 'Sheet1!A1', [
    ['Nguyễn Văn A', '0901234567', 'Tour Đà Nẵng 3N2Đ', new Date().toLocaleString('vi-VN')],
  ]);

  // 2. Ví dụ đọc dữ liệu
  console.log('\n--- Thử nghiệm đọc dữ liệu ---');
  await readSheet(SPREADSHEET_ID, 'Sheet1!A1:D10');
}

main();

module.exports = {
  readSheet,
  appendSheet,
};

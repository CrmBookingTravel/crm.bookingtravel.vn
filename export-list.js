const fs = require('fs');
const path = require('path');
const { listAllSheets } = require('./manager-client');

async function exportSheets() {
  console.log('🔄 Đang tải toàn bộ danh sách 119+ file Google Sheets từ tài khoản của bạn...');
  const sheets = await listAllSheets();

  if (!sheets || sheets.length === 0) {
    console.log('❌ Không tìm thấy file nào.');
    return;
  }

  // Lưu ra file JSON
  const jsonPath = path.join(__dirname, 'danh_sach_google_sheets.json');
  fs.writeFileSync(jsonPath, JSON.stringify(sheets, null, 2), 'utf-8');

  // Lưu ra file CSV
  const csvPath = path.join(__dirname, 'danh_sach_google_sheets.csv');
  const csvHeader = 'STT,Tên Bảng Tính,ID File,Đường Dẫn URL,Cập Nhật Lần Cuối\n';
  const csvRows = sheets.map((s, idx) => {
    const cleanName = `"${(s.name || '').replace(/"/g, '""')}"`;
    const cleanUrl = `"${(s.url || '').replace(/"/g, '""')}"`;
    const cleanDate = `"${(s.lastUpdated || '').replace(/"/g, '""')}"`;
    return `${idx + 1},${cleanName},${s.id},${cleanUrl},${cleanDate}`;
  }).join('\n');

  fs.writeFileSync(csvPath, '\uFEFF' + csvHeader + csvRows, 'utf-8'); // UTF-8 BOM cho Excel tiếng Việt

  console.log(`\n🎉 ĐÃ XUẤT THÀNH CÔNG:`);
  console.log(`1. File JSON: danh_sach_google_sheets.json`);
  console.log(`2. File CSV (mở bằng Excel): danh_sach_google_sheets.csv`);
}

exportSheets();

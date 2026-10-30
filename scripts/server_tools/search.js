const { listAllSheets } = require('./manager-client');

async function search() {
  const query = process.argv.slice(2).join(' ').trim().toLowerCase();
  if (!query) {
    console.log('👉 Vui lòng nhập từ khóa tìm kiếm. Ví dụ: node search.js Booking');
    return;
  }

  const sheets = await listAllSheets({ silent: true });
  if (!sheets) return;

  const filtered = sheets.filter(s => s.name && s.name.toLowerCase().includes(query));

  console.log(`\n🔍 KẾT QUẢ TÌM KIẾM CHO TỪ KHÓA: "${query}" (Tìm thấy: ${filtered.length} file)`);
  if (filtered.length > 0) {
    console.table(filtered.map(s => ({
      'Tên Bảng Tính': s.name,
      'ID File': s.id,
      'Link': s.url
    })));
  } else {
    console.log('❌ Không tìm thấy file nào khớp với từ khóa.');
  }
}

search();

const { readSheetData, listAllSheets } = require('./manager-client');

async function main() {
  const arg = process.argv.slice(2).join(' ').trim();
  if (!arg) {
    console.log('👉 Cách dùng:');
    console.log('  1. Đọc theo ID: node read.js <ID_FILE>');
    console.log('  2. Đọc theo tên: node read.js "Tên file"');
    return;
  }

  let spreadsheetId = arg;

  // Nếu người dùng nhập tên file thay vì ID, tự động tìm ID
  if (arg.length < 30 || arg.includes(' ')) {
    const sheets = await listAllSheets({ silent: true });
    const match = sheets ? sheets.find(s => s.name && s.name.toLowerCase().includes(arg.toLowerCase())) : null;
    if (match) {
      console.log(`🔍 Tìm thấy file: "${match.name}" (ID: ${match.id})`);
      spreadsheetId = match.id;
    } else {
      console.log(`❌ Không tìm thấy file nào có tên chứa "${arg}"`);
      return;
    }
  }

  await readSheetData(spreadsheetId);
}

main();

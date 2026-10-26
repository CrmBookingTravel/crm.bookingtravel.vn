const fs = require('fs');
const sheets = JSON.parse(fs.readFileSync('danh_sach_google_sheets.json', 'utf8'));

console.log('=== TOÀN BỘ 119 FILE CỦA CÔNG TY ===');
sheets.forEach((s, i) => console.log(`${i + 1}. [${s.id}] ${s.name}`));

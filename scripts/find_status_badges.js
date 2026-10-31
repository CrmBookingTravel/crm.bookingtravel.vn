const fs = require('fs');
const content = fs.readFileSync('CRM_Booking.html', 'utf-8');
const lines = content.split('\n');

for (let i = 11800; i < 12100; i++) {
  const line = lines[i];
  if (line.includes('tourStatus') || line.includes('badge') || line.includes('trạng thái') || line.includes('Trạng Thái') || line.includes('Chờ Duyệt') || line.includes('Đã Cọc') || line.includes('Hoàn Thành')) {
    console.log(`${i + 1}: ${line.trim().slice(0, 100)}`);
  }
}

const fs = require('fs');
const content = fs.readFileSync('CRM_Booking.html', 'utf-8');
const lines = content.split('\n');

for (let i = 2650; i < 2770; i++) {
  if (lines[i].includes('ipt-sale') || lines[i].includes('Nhân Viên') || lines[i].includes('Doanh Thu') || lines[i].includes('ipt-revenue') || lines[i].includes('ipt-cost')) {
    console.log(`${i + 1}: ${lines[i].trim().slice(0, 100)}`);
  }
}

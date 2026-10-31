const fs = require('fs');
const content = fs.readFileSync('CRM_Booking.html', 'utf-8');
const lines = content.split('\n');

lines.forEach((l, i) => {
  if (l.includes('ipt-revenue') || l.includes('ipt-cost')) {
    console.log(`${i + 1}: ${l.slice(0, 100)}`);
  }
});

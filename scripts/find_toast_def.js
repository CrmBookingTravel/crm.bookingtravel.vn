const fs = require('fs');
const content = fs.readFileSync('CRM_Booking.html', 'utf-8');
const lines = content.split('\n');
lines.forEach((l, i) => {
  if (l.includes('function showToast')) {
    console.log(`${i + 1}: ${l.slice(0, 100)}`);
  }
});

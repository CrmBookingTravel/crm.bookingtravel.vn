const fs = require('fs');
const content = fs.readFileSync('CRM_Booking.html', 'utf-8');
const lines = content.split('\n');

// Find where tourStatus or status definitions are
lines.forEach((l, i) => {
  if (l.includes('tourStatus') && (l.includes('const') || l.includes('function') || l.includes('switch') || l.includes('case'))) {
    console.log(`${i + 1}: ${l.slice(0, 100)}`);
  }
});

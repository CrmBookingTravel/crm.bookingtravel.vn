const fs = require('fs');
const content = fs.readFileSync('CRM_Booking.html', 'utf-8');
const lines = content.split('\n');

lines.forEach((l, i) => {
  if (l.includes('editHistory.push') || l.includes('editHistory =') || l.includes('function saveBooking') || l.includes('function handleSaveBooking') || l.includes('function submitBooking')) {
    console.log(`${i + 1}: ${l.slice(0, 100)}`);
  }
});

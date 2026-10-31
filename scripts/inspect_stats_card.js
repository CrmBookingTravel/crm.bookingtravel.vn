const fs = require('fs');
const content = fs.readFileSync('CRM_Booking.html', 'utf8');
const lines = content.split('\n');

for (let i = 11480; i < 11550 && i < lines.length; i++) {
  console.log(`${i + 1}: ${lines[i]}`);
}

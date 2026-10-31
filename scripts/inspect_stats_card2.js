const fs = require('fs');
const content = fs.readFileSync('CRM_Booking.html', 'utf8');
const lines = content.split('\n');

for (let i = 11545; i < 11585 && i < lines.length; i++) {
  console.log(`${i + 1}: ${lines[i]}`);
}

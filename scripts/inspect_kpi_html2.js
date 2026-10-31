const fs = require('fs');
const content = fs.readFileSync('CRM_Booking.html', 'utf8');
const lines = content.split('\n');

for (let i = 1663; i < 1820 && i < lines.length; i++) {
  console.log(`${i + 1}: ${lines[i]}`);
}

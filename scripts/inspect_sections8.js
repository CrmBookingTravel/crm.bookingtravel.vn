const fs = require('fs');
const content = fs.readFileSync('CRM_Booking.html', 'utf8');
const lines = content.split('\n');

for (let i = 16640; i < 16720 && i < lines.length; i++) {
  console.log(`${i + 1}: ${lines[i]}`);
}

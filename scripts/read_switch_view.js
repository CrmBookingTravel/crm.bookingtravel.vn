const fs = require('fs');
const content = fs.readFileSync('CRM_Booking.html', 'utf-8');
const lines = content.split('\n');

for (let i = 11110; i < 11240; i++) {
  console.log(`${i + 1}: ${lines[i]}`);
}

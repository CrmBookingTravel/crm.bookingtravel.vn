const fs = require('fs');
const content = fs.readFileSync('CRM_Booking.html', 'utf8');
const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('updateStats')) {
    console.log(`${i + 1}: ${lines[i].trim().slice(0, 80)}`);
  }
}

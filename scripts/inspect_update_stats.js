const fs = require('fs');
const content = fs.readFileSync('CRM_Booking.html', 'utf8');
const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('function updateStats(')) {
    console.log('Found updateStats at line:', i + 1);
    for (let j = i; j < Math.min(lines.length, i + 50); j++) {
      console.log(`${j + 1}: ${lines[j]}`);
    }
    break;
  }
}

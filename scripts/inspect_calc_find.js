const fs = require('fs');
const content = fs.readFileSync('CRM_Booking.html', 'utf8');
const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('function calculateFormFinancials')) {
    console.log('Found calculateFormFinancials at line:', i + 1);
    for (let j = Math.max(0, i - 5); j < Math.min(lines.length, i + 65); j++) {
      console.log(`${j + 1}: ${lines[j]}`);
    }
    break;
  }
}

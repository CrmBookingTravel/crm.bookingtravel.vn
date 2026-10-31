const fs = require('fs');
const content = fs.readFileSync('CRM_Booking.html', 'utf-8');
const lines = content.split('\n');

for (let i = 900; i < 970; i++) {
  if (lines[i].includes('filter-segmented') || lines[i].includes('data-filter')) {
    console.log(`${i + 1}: ${lines[i].trim().slice(0, 100)}`);
  }
}

const fs = require('fs');
const content = fs.readFileSync('CRM_Booking.html', 'utf-8');
const lines = content.split('\n');

for (let i = 10000; i < 14000; i++) {
  const line = lines[i];
  if (line.includes('function render') || line.includes('function display') || line.includes('tbody') || line.includes('table-body')) {
    console.log(`${i + 1}: ${line.trim().slice(0, 100)}`);
  }
}

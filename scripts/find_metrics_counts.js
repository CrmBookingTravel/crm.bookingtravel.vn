const fs = require('fs');
const content = fs.readFileSync('CRM_Booking.html', 'utf-8');
const lines = content.split('\n');

for (let i = 11300; i < 11470; i++) {
  if (lines[i].includes('count-') || lines[i].includes('cho_ke_toan') || lines[i].includes('da_coc')) {
    console.log(`${i + 1}: ${lines[i].trim().slice(0, 100)}`);
  }
}

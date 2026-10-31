const fs = require('fs');
const content = fs.readFileSync('CRM_Booking.html', 'utf-8');
const lines = content.split('\n');

for (let i = 12300; i < 12450; i++) {
  if (lines[i].includes('mobileCardsHtml +=') || lines[i].includes('maBooking') || lines[i].includes('workflowActionBtn')) {
    console.log(`${i + 1}: ${lines[i].slice(0, 100)}`);
  }
}

const fs = require('fs');
const content = fs.readFileSync('CRM_Booking.html', 'utf-8');
const lines = content.split('\n');

for (let i = 8500; i < 9400; i++) {
  const line = lines[i];
  if (line.includes('id="modal-tao-don"') || line.includes('id="booking-form"') || line.includes('id="ipt-tour-status"')) {
    console.log(`${i + 1}: ${line.trim().slice(0, 100)}`);
  }
}

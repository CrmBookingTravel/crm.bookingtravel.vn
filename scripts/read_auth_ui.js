const fs = require('fs');
const content = fs.readFileSync('CRM_Booking.html', 'utf-8');
const lines = content.split('\n');
console.log(lines.slice(6920, 6970).join('\n'));

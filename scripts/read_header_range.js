const fs = require('fs');
const content = fs.readFileSync('CRM_Booking.html', 'utf-8');
const lines = content.split('\n');
console.log('Line 670 to 700:');
console.log(lines.slice(670, 700).join('\n'));
console.log('\n--- Line 840 to 865: ---');
console.log(lines.slice(840, 865).join('\n'));

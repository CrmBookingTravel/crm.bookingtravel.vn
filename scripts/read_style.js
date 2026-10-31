const fs = require('fs');
const content = fs.readFileSync('CRM_Booking.html', 'utf-8');
const lines = content.split('\n');

let inStyle = false;
let styleLines = [];
for (let i = 0; i < 300; i++) {
  if (lines[i].includes('<style')) inStyle = true;
  if (inStyle) styleLines.push(lines[i]);
  if (lines[i].includes('</style>')) {
    inStyle = false;
    break;
  }
}

console.log('Style lines count:', styleLines.length);
console.log(styleLines.slice(0, 60).join('\n'));

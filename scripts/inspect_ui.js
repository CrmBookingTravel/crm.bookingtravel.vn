const fs = require('fs');
const content = fs.readFileSync('CRM_Booking.html', 'utf-8');
const lines = content.split('\n');
console.log('Total lines:', lines.length);

let inHead = false;
let headLines = [];
let bodyStart = -1;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('<head')) inHead = true;
  if (inHead && i < 200) headLines.push(line);
  if (line.includes('</head>')) inHead = false;
  if (line.includes('<body')) {
    bodyStart = i;
    break;
  }
}

console.log('Body starts at line:', bodyStart + 1);
console.log('--- HEAD SNIPPET (First 50 lines) ---');
console.log(headLines.slice(0, 50).join('\n'));

console.log('--- BODY START (50 lines after body) ---');
console.log(lines.slice(bodyStart, bodyStart + 70).join('\n'));

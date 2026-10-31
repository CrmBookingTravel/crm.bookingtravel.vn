const fs = require('fs');
const content = fs.readFileSync('CRM_Booking.html', 'utf8');
const lines = content.split('\n');

function findLines(pattern) {
  const matches = [];
  lines.forEach((line, idx) => {
    if (pattern.test(line)) {
      matches.push({ line: idx + 1, text: line.trim().slice(0, 100) });
    }
  });
  return matches.slice(0, 15);
}

console.log('giaBan - giaVon matches:', findLines(/giaBan.*-.*giaVon/));
console.log('r - c matches:', findLines(/(const|let)\s+p\s*=\s*r\s*-\s*c/));

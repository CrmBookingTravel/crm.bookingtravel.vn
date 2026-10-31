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
  return matches.slice(0, 10);
}

console.log('openBookingModal:', findLines(/function openBookingModal/));
console.log('editBooking:', findLines(/function editBooking/));
console.log('calculateFormFinancials:', findLines(/function calculateFormFinancials/));
console.log('recalculateTotalFinancials:', findLines(/function recalculateTotalFinancials/));

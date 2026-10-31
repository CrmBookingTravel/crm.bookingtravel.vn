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

console.log('ipt-revenue matches:', findLines(/id=["']ipt-revenue/));
console.log('ipt-sale matches:', findLines(/id=["']ipt-sale/));
console.log('calcBookingTravelKpi:', findLines(/function calcBookingTravelKpi/));
console.log('renderSalesKpiView:', findLines(/function renderSalesKpiView/));
console.log('handleSaveBooking:', findLines(/function handleSaveBooking/));

const fs = require('fs');
const content = fs.readFileSync('CRM_Booking.html', 'utf-8');
const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('function renderBookingsTable') || line.includes('function updateMetrics') ||
      line.includes('id="pagination"') || line.includes('pagination') || line.includes('currentPage') ||
      line.includes('itemsPerPage') || line.includes('totalPages')) {
    console.log(`${i + 1}: ${line.trim().slice(0, 100)}`);
  }
}

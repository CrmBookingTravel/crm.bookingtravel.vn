const fs = require('fs');
const content = fs.readFileSync('CRM_Booking.html', 'utf-8');
console.log('currentPage:', content.includes('currentPage'));
console.log('pageSize:', content.includes('pageSize'));
console.log('itemsPerPage:', content.includes('itemsPerPage'));
console.log('table-pagination:', content.includes('table-pagination'));

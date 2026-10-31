const fs = require('fs');
const content = fs.readFileSync('CRM_Booking.html', 'utf-8');
console.log('Has sidebar-main:', content.includes('sidebar-main'));
console.log('Has id="sidebar":', content.includes('id="sidebar"'));

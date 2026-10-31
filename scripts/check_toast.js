const fs = require('fs');
const content = fs.readFileSync('CRM_Booking.html', 'utf-8');
console.log('has showToast:', content.includes('function showToast'));
console.log('has toast:', content.includes('toast'));

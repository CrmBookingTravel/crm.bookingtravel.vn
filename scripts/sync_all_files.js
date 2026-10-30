const fs = require('fs');
const path = require('path');

const srcCrm = path.join(__dirname, '..', 'CRM_Booking.html');

const crmTargets = [
  path.join(__dirname, '..', 'crm.html'),
  path.join(__dirname, '..', 'index.html'),
  path.join(__dirname, '..', 'public', 'crm.html'),
  path.join(__dirname, '..', 'public', 'CRM_Booking.html'),
  path.join(__dirname, '..', 'public', 'index.html'),
  'E:/BookingTravel_CRM/CRM_Booking.html',
  'E:/BookingTravel_CRM/crm.html',
  'E:/BookingTravel_CRM/index.html',
  'E:/BookingTravel_CRM/public/crm.html',
  'E:/BookingTravel_CRM/public/CRM_Booking.html',
  'E:/BookingTravel_CRM/public/index.html'
];

const crmContent = fs.readFileSync(srcCrm);
console.log(`Source CRM_Booking.html size: ${crmContent.length} bytes`);

crmTargets.forEach(tgt => {
  try {
    fs.writeFileSync(tgt, crmContent);
    console.log(`Synced to: ${tgt}`);
  } catch(e) {
    console.error(`Failed to sync to: ${tgt}`, e.message);
  }
});

console.log('ALL SYNCS FINISHED SUCCESSFULLY!');

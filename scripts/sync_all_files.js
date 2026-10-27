const fs = require('fs');
const path = require('path');

const srcCrm = path.join(__dirname, '..', 'crm.html');
const srcDemo = path.join(__dirname, '..', 'demo_kho_khach_san_nha_trang.html');

const crmTargets = [
  path.join(__dirname, '..', 'index.html'),
  path.join(__dirname, '..', 'public', 'crm.html'),
  path.join(__dirname, '..', 'public', 'CRM_Booking.html'),
  path.join(__dirname, '..', 'public', 'index.html'),
  'E:/xampp_booking/htdocs/CRM_Booking.html',
  'E:/xampp_booking/htdocs/index.html'
];

const demoTargets = [
  path.join(__dirname, '..', 'public', 'demo_kho_khach_san_nha_trang.html'),
  'E:/xampp_booking/htdocs/demo_kho_khach_san_nha_trang.html'
];

const crmContent = fs.readFileSync(srcCrm);
console.log(`Source crm.html size: ${crmContent.length} bytes`);

crmTargets.forEach(tgt => {
  try {
    fs.writeFileSync(tgt, crmContent);
    console.log(`Synced to: ${tgt}`);
  } catch(e) {
    console.error(`Failed to sync to: ${tgt}`, e.message);
  }
});

const demoContent = fs.readFileSync(srcDemo);
console.log(`Source demo size: ${demoContent.length} bytes`);

demoTargets.forEach(tgt => {
  try {
    fs.writeFileSync(tgt, demoContent);
    console.log(`Synced demo to: ${tgt}`);
  } catch(e) {
    console.error(`Failed to sync demo to: ${tgt}`, e.message);
  }
});

console.log('ALL SYNCS FINISHED SUCCESSFULLY!');

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
    const dir = path.dirname(tgt);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(tgt, crmContent);
    console.log(`Synced to: ${tgt}`);
  } catch(e) {
    console.error(`Failed to sync to: ${tgt}`, e.message);
  }
});

// Đồng bộ zalo_crm.html
const srcZalo = path.join(__dirname, '..', 'zalo_crm.html');
if (fs.existsSync(srcZalo)) {
  const zaloContent = fs.readFileSync(srcZalo);
  const zaloTargets = [
    path.join(__dirname, '..', 'public', 'zalo_crm.html'),
    'E:/BookingTravel_CRM/zalo_crm.html',
    'E:/BookingTravel_CRM/public/zalo_crm.html'
  ];
  zaloTargets.forEach(tgt => {
    try {
      const dir = path.dirname(tgt);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      fs.writeFileSync(tgt, zaloContent);
      console.log(`Synced zalo_crm to: ${tgt}`);
    } catch(e) {
      console.error(`Failed to sync zalo_crm to: ${tgt}`, e.message);
    }
  });
}

// Đồng bộ serve.json và vercel.json
const srcServe = path.join(__dirname, '..', 'serve.json');
if (fs.existsSync(srcServe)) {
  try {
    fs.copyFileSync(srcServe, 'E:/BookingTravel_CRM/serve.json');
    console.log('Synced serve.json to E:/BookingTravel_CRM');
  } catch(e) {}
}

const srcVercel = path.join(__dirname, '..', 'vercel.json');
if (fs.existsSync(srcVercel)) {
  try {
    fs.copyFileSync(srcVercel, 'E:/BookingTravel_CRM/vercel.json');
    console.log('Synced vercel.json to E:/BookingTravel_CRM');
  } catch(e) {}
}

console.log('ALL SYNCS FINISHED SUCCESSFULLY!');

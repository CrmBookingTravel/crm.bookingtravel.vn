const fs = require('fs');
const path = require('path');

const crmPath = path.join(__dirname, '..', 'crm.html');
let content = fs.readFileSync(crmPath, 'utf8');

const targetSave = `      saveData();
      renderTable();`;

const replacementSave = `      saveData();
      syncBookingToGoogleSheets(item);
      renderTable();`;

if (!content.includes(targetSave)) {
  console.error('Could not find targetSave');
  process.exit(1);
}

const syncFn = `
    function syncBookingToGoogleSheets(b) {
      try {
        const scriptUrl = localStorage.getItem('bt_google_script_url') || 'https://script.google.com/macros/s/AKfycbxouSOuoxyFwsVmwEQHVyswcuUFUgG-GBt8bJcDPVtMDqjSEBcQzucuwpXrQOYBvVRR/exec';
        if (!scriptUrl) return;

        const payload = {
          maBooking: b.maBooking,
          khachHang: b.khachHang,
          sdt: b.sdt,
          doiTac: b.doiTac,
          hangPhong: b.hangPhong || b.dichVu,
          soLuongPhong: b.soLuongPhong || 1,
          soKhach: b.soKhach || '2 Người lớn',
          soDem: b.soDem || 1,
          checkIn: b.checkIn,
          checkOut: b.checkOut,
          tongThu: b.giaBan,
          giaVon: b.giaVon,
          soTienThuDotNay: b.khachDaCoc,
          nganHang: (b.payments && b.payments[0]) ? b.payments[0].hinhThuc : 'Chuyển khoản (Techcombank)',
          sale: b.saleEmail || 'crm@bookingtravel.vn'
        };

        fetch(scriptUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload)
        }).catch(function(e) { console.warn('Sync Sheets notice:', e); });
      } catch(err) {
        console.warn('Sync Sheets error:', err);
      }
    }
`;

content = content.replace(targetSave, replacementSave);
content = content.replace('function editBooking(id) {', syncFn + '\n    function editBooking(id) {');

fs.writeFileSync(crmPath, content, 'utf8');
console.log('Added Google Sheets Sync successfully!');

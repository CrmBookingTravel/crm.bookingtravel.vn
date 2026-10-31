const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'CRM_Booking.html');
let content = fs.readFileSync(filePath, 'utf8');

const targetDecl = `      let moiTaoCount = 0;
      let choKeToanCount = 0;
      let choBgdCount = 0;
      let daXnCount = 0;
      let daTtCount = 0;
      let hoanThanhCount = 0;
      let daHuyCount = 0;

      bookings.forEach(b => {
        const isMine = b.saleEmail && b.saleEmail.toLowerCase() === myEmail;
        if (!canViewAll && !isMine) return;

        const st = (b.tourStatus || 'moi_tao').toLowerCase();
        if (st === 'moi_tao') moiTaoCount++;
        else if (st === 'cho_kiem_tra' || st === 'cho_duyet' || st === 'cho_coc') choKeToanCount++;
        else if (st === 'cho_xac_nhan_doi_tac' || st === 'ke_toan_duyet') choBgdCount++;
        else if (st === 'da_xac_nhan' || st === 'da_chot' || st === 'dang_di') daXnCount++;
        else if (st === 'da_thanh_toan' || st === 'da_coc') daTtCount++;
        else if (st === 'hoan_thanh' || st === 'hoan_tat') hoanThanhCount++;
        else if (st === 'da_huy' || st === 'da_hoan_tien') daHuyCount++;
      });`;

const replacementDecl = `      let moiTaoCount = 0;
      let choKeToanCount = 0;
      let choBgdCount = 0;
      let daXnCount = 0;
      let daTtCount = 0;
      let hoanThanhCount = 0;
      let daHuyCount = 0;
      let daCocCount = 0;
      let dangDieuHanhCount = 0;
      let hoanTatCount = 0;

      bookings.forEach(b => {
        const isMine = (b.tuVanEmail && b.tuVanEmail.toLowerCase() === myEmail) || (b.saleEmail && b.saleEmail.toLowerCase() === myEmail) || (b.hoTroEmail && b.hoTroEmail.toLowerCase() === myEmail);
        if (!canViewAll && !isMine) return;

        const st = (b.tourStatus || 'moi_tao').toLowerCase();
        if (st === 'moi_tao') moiTaoCount++;
        else if (st === 'cho_kiem_tra' || st === 'cho_duyet' || st === 'cho_coc') choKeToanCount++;
        else if (st === 'cho_xac_nhan_doi_tac' || st === 'ke_toan_duyet') choBgdCount++;
        else if (st === 'da_xac_nhan' || st === 'da_chot') daXnCount++;
        else if (st === 'dang_di') { daXnCount++; dangDieuHanhCount++; }
        else if (st === 'da_thanh_toan') daTtCount++;
        else if (st === 'da_coc') { daTtCount++; daCocCount++; }
        else if (st === 'hoan_thanh') { hoanThanhCount++; hoanTatCount++; }
        else if (st === 'hoan_tat') { hoanThanhCount++; hoanTatCount++; }
        else if (st === 'da_huy' || st === 'da_hoan_tien') daHuyCount++;
      });`;

if (content.includes(targetDecl)) {
  content = content.replace(targetDecl, replacementDecl);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✅ Successfully fixed legacy status badge counts in CRM_Booking.html');
} else {
  console.error('❌ Could not find targetDecl');
}

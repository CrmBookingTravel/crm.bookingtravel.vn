const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'CRM_Booking.html');
let content = fs.readFileSync(filePath, 'utf8');

const targetLoop = `      bookings.forEach(b => {
        const isMine = b.saleEmail && b.saleEmail.toLowerCase() === myEmail;
        if (!canViewAll && !isMine) return; // Nếu không có quyền xem all, chỉ tính đơn của chính mình

        const rev = parseFloat(b.giaBan) || 0;
        const cst = parseFloat(b.giaVon) || 0;
        const paidAR = parseFloat(b.khachDaCoc) || 0;
        const paidAP = parseFloat(b.daTraDoiTac) || 0;

        revenue += rev;
        cost += cst;

        const remainAR = Math.max(0, rev - paidAR);
        const remainAP = Math.max(0, cst - paidAP);

        if (remainAR > 0) { arDebt += remainAR; arCount++; }
        if (remainAP > 0) { apDebt += remainAP; apCount++; }

        if (b.statusHdVao === 'chua_lay') doiHdCount++;
        if (b.coXuatVat && b.statusHdRa === 'chua_xuat') canXuatHdCount++;
        if (isMine) myOrdersCount++;
      });`;

const replacementLoop = `      bookings.forEach(b => {
        const isMine = (b.tuVanEmail && b.tuVanEmail.toLowerCase() === myEmail) || (b.saleEmail && b.saleEmail.toLowerCase() === myEmail) || (b.hoTroEmail && b.hoTroEmail.toLowerCase() === myEmail);
        if (!canViewAll && !isMine) return; // Nếu không có quyền xem all, chỉ tính đơn của chính mình

        const rev = parseFloat(b.giaBan) || 0;
        const cst = parseFloat(b.giaVon) || 0;
        const extra = parseFloat(b.chiPhiPhatSinh) || 0;
        const paidAR = parseFloat(b.khachDaCoc) || 0;
        const paidAP = parseFloat(b.daTraDoiTac) || 0;

        revenue += rev;
        cost += (cst + extra);

        const remainAR = Math.max(0, rev - paidAR);
        const remainAP = Math.max(0, cst - paidAP);

        if (remainAR > 0) { arDebt += remainAR; arCount++; }
        if (remainAP > 0) { apDebt += remainAP; apCount++; }

        if (b.statusHdVao === 'chua_lay') doiHdCount++;
        if (b.coXuatVat && b.statusHdRa === 'chua_xuat') canXuatHdCount++;
        if (isMine) myOrdersCount++;
      });`;

const targetSaleCard = `        if (isSale) {
          const myKpi = calcBookingTravelKpi(profit, 'month', 10000000);
          elChuaHd.innerText = myKpi.staffCommission > 0 ? ('+' + myKpi.staffCommission.toLocaleString('vi-VN') + ' đ') : (myKpi.realCommission.toLocaleString('vi-VN') + ' đ');
          const card4Sub = document.getElementById('stat-card-4-sub');
          if (card4Sub) {
            card4Sub.innerText = myKpi.staffCommission > 0 
              ? \`Vượt 10tr: Thưởng 40% (+\${myKpi.staffCommission.toLocaleString('vi-VN')} đ)\` 
              : \`HH Thật (70%): Đạt \${myKpi.progress}% (Thiếu \${myKpi.remaining.toLocaleString('vi-VN')} đ)\`;
          }
        }`;

const replacementSaleCard = `        if (isSale) {
          let myMonthProfit = 0;
          bookings.forEach(b => {
            if (isBookingInPeriod(b, 'month')) {
              const sp = getStaffProfitForBooking(b, myEmail);
              myMonthProfit += sp.profit;
            }
          });
          const myKpi = calcBookingTravelKpi(myMonthProfit, 'month', 10000000);
          elChuaHd.innerText = myKpi.staffCommission > 0 ? ('+' + myKpi.staffCommission.toLocaleString('vi-VN') + ' đ') : (myKpi.realCommission.toLocaleString('vi-VN') + ' đ');
          const card4Sub = document.getElementById('stat-card-4-sub');
          if (card4Sub) {
            card4Sub.innerText = myKpi.staffCommission > 0 
              ? \`Vượt 10tr: Thưởng 40% (+\${myKpi.staffCommission.toLocaleString('vi-VN')} đ)\` 
              : \`HH Thật (70%): Đạt \${myKpi.progress}% (Thiếu \${myKpi.remaining.toLocaleString('vi-VN')} đ)\`;
          }
        }`;

if (content.includes(targetLoop)) {
  content = content.replace(targetLoop, replacementLoop);
  console.log('✅ Patched updateMetrics booking loop.');
} else {
  console.error('❌ Could not find targetLoop');
}

if (content.includes(targetSaleCard)) {
  content = content.replace(targetSaleCard, replacementSaleCard);
  console.log('✅ Patched updateMetrics isSale card.');
} else {
  console.error('❌ Could not find targetSaleCard');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Done patching updateMetrics.');

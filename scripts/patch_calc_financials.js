const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'CRM_Booking.html');
let content = fs.readFileSync(filePath, 'utf8');

const targetBlock = `    // YÊU CẦU 7: Tính toán P&L Realtime: GIÁ BÁN - GIÁ NHẬN = HOA HỒNG / LỢI NHUẬN GỘP
    function calculateFormFinancials() {
      const revInput = document.getElementById('ipt-revenue');
      const costInput = document.getElementById('ipt-cost');
      const apPaidInput = document.getElementById('ipt-ap-paid');

      const rev = revInput ? parseCurrency(revInput.value) : 0;
      const cost = costInput ? parseCurrency(costInput.value) : 0;
      const apPaid = apPaidInput ? parseCurrency(apPaidInput.value) : 0;

      const profit = rev - cost;
      const margin = rev > 0 ? ((profit / rev) * 100).toFixed(1) : '0.0';

      const badgeRevWord = document.getElementById('badge-revenue-word');
      if (badgeRevWord) badgeRevWord.innerText = numberToVietnameseWords(rev);

      const formulaRev = document.getElementById('formula-revenue');
      const formulaCost = document.getElementById('formula-cost');
      const formulaProfit = document.getElementById('formula-profit');
      const formulaCommission = document.getElementById('formula-commission');
      const marginBadge = document.getElementById('profit-margin-badge');

      if (formulaCommission) {
        const comm = Math.round(profit * 0.1);
        formulaCommission.innerText = '+' + comm.toLocaleString('vi-VN') + ' đ';
      }

      if (formulaRev) formulaRev.innerText = rev.toLocaleString('vi-VN') + ' đ';
      if (formulaCost) formulaCost.innerText = cost.toLocaleString('vi-VN') + ' đ';
      if (formulaProfit) {
        if (profit >= 0) {
          formulaProfit.className = 'text-xs sm:text-sm font-mono font-black text-emerald-400 block mt-0.5';
          formulaProfit.innerText = '+' + profit.toLocaleString('vi-VN') + ' đ';
        } else {
          formulaProfit.className = 'text-xs sm:text-sm font-mono font-black text-rose-400 block mt-0.5';
          formulaProfit.innerText = profit.toLocaleString('vi-VN') + ' đ';
        }
      }
      if (marginBadge) {
        marginBadge.innerText = 'Tỷ suất: ' + margin + '%';
        if (profit >= 0) {
          marginBadge.className = 'px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40';
        } else {
          marginBadge.className = 'px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40';
        }
      }

      // Còn nợ nhà cung cấp
      const supplierRemain = Math.max(0, cost - apPaid);
      const sumSupplierRemain = document.getElementById('sum-supplier-remain-display');
      if (sumSupplierRemain) sumSupplierRemain.innerText = supplierRemain.toLocaleString('vi-VN') + ' đ';

      // Tính tổng tiến độ các đợt thanh toán của khách
      calculateInstallmentTotals(rev);
    }`;

const replacementBlock = `    // ĐIỀN DROPDOWN NHÂN VIÊN TƯ VẤN & HỖ TRỢ
    function populateStaffDropdowns() {
      if (typeof systemUsers === 'undefined') return;
      const saleSelect = document.getElementById('ipt-sale');
      const supportSelect = document.getElementById('ipt-support-sale');
      const currentSaleVal = saleSelect ? saleSelect.value : '';
      const currentSupportVal = supportSelect ? supportSelect.value : '';

      const staffList = systemUsers.filter(u => u.role === 'sale' || u.role === 'admin');

      if (saleSelect) {
        saleSelect.innerHTML = '';
        staffList.forEach(u => {
          const opt = document.createElement('option');
          opt.value = u.email;
          const uLabel = u.name ? \`\${u.name} (\${u.email.split('@')[0]})\` : u.email;
          opt.innerText = uLabel;
          if (currentSaleVal ? (u.email.toLowerCase() === currentSaleVal.toLowerCase()) : (currentUser && u.email.toLowerCase() === currentUser.email.toLowerCase())) {
            opt.selected = true;
          }
          saleSelect.appendChild(opt);
        });
      }

      if (supportSelect) {
        supportSelect.innerHTML = '<option value="">-- Không có NV hỗ trợ (100% Tư vấn) --</option>';
        staffList.forEach(u => {
          const opt = document.createElement('option');
          opt.value = u.email;
          const uLabel = u.name ? \`\${u.name} (\${u.email.split('@')[0]})\` : u.email;
          opt.innerText = uLabel;
          if (currentSupportVal && u.email.toLowerCase() === currentSupportVal.toLowerCase()) {
            opt.selected = true;
          }
          supportSelect.appendChild(opt);
        });
      }
    }

    // TÍNH TOÁN P&L REALTIME THEO LỢI NHUẬN THỰC TẾ & CHỐNG TÍNH TRÙNG:
    // LỢI NHUẬN THỰC TẾ = DOANH THU BÁN RA - GIÁ VỐN ĐỐI TÁC - CHI PHÍ PHÁT SINH
    function calculateFormFinancials() {
      const revInput = document.getElementById('ipt-revenue');
      const costInput = document.getElementById('ipt-cost');
      const extraCostInput = document.getElementById('ipt-extra-cost');
      const apPaidInput = document.getElementById('ipt-ap-paid');

      const rev = revInput ? parseCurrency(revInput.value) : 0;
      const cost = costInput ? parseCurrency(costInput.value) : 0;
      const extraCost = extraCostInput ? parseCurrency(extraCostInput.value) : 0;
      const apPaid = apPaidInput ? parseCurrency(apPaidInput.value) : 0;

      // Lợi nhuận thực tế (Net Profit)
      const profit = Math.max(0, rev - cost - extraCost);
      const rawDiff = rev - cost - extraCost;
      const margin = rev > 0 ? ((profit / rev) * 100).toFixed(1) : '0.0';

      const badgeRevWord = document.getElementById('badge-revenue-word');
      if (badgeRevWord) badgeRevWord.innerText = numberToVietnameseWords(rev);

      const formulaRev = document.getElementById('formula-revenue');
      const formulaCost = document.getElementById('formula-cost');
      const formulaProfit = document.getElementById('formula-profit');
      const formulaCommission = document.getElementById('formula-commission');
      const marginBadge = document.getElementById('profit-margin-badge');

      if (formulaRev) formulaRev.innerText = rev.toLocaleString('vi-VN') + ' đ';
      if (formulaCost) formulaCost.innerText = (cost + extraCost).toLocaleString('vi-VN') + ' đ' + (extraCost > 0 ? \` (Vốn \${cost.toLocaleString('vi-VN')} + Phát sinh \${extraCost.toLocaleString('vi-VN')})\` : '');
      if (formulaProfit) {
        if (rawDiff >= 0) {
          formulaProfit.className = 'text-xs sm:text-sm font-mono font-black text-emerald-400 block mt-0.5';
          formulaProfit.innerText = '+' + profit.toLocaleString('vi-VN') + ' đ';
        } else {
          formulaProfit.className = 'text-xs sm:text-sm font-mono font-black text-rose-400 block mt-0.5';
          formulaProfit.innerText = rawDiff.toLocaleString('vi-VN') + ' đ (Bán lỗ)';
        }
      }
      if (marginBadge) {
        marginBadge.innerText = 'Tỷ suất: ' + margin + '%';
        if (rawDiff >= 0) {
          marginBadge.className = 'px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40';
        } else {
          marginBadge.className = 'px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40';
        }
      }

      // Update realtime preview in Summary Block
      const previewProfit = document.getElementById('calc-profit-preview');
      const previewReal = document.getElementById('calc-profit-real-preview');
      const taxCost = Math.round(profit * 0.30);
      const realProfit = Math.max(0, profit - taxCost);

      if (previewProfit) {
        if (rawDiff >= 0) {
          previewProfit.className = 'text-base sm:text-lg font-mono font-black text-emerald-400 mt-1 truncate';
          previewProfit.innerText = '+' + profit.toLocaleString('vi-VN') + ' đ';
        } else {
          previewProfit.className = 'text-base sm:text-lg font-mono font-black text-rose-400 mt-1 truncate';
          previewProfit.innerText = rawDiff.toLocaleString('vi-VN') + ' đ (Bán Lỗ)';
        }
      }
      if (previewReal) {
        previewReal.innerText = 'Thực nhận (-30%): +' + realProfit.toLocaleString('vi-VN') + ' đ';
      }

      // Tỷ lệ phân bổ KPI chống tính trùng giữa Tư vấn & Hỗ trợ
      const splitRateVal = document.getElementById('ipt-split-rate')?.value || '100_0';
      let tuVanRate = 100;
      let hoTroRate = 0;
      if (splitRateVal === '70_30') { tuVanRate = 70; hoTroRate = 30; }
      else if (splitRateVal === '80_20') { tuVanRate = 80; hoTroRate = 20; }
      else if (splitRateVal === '60_40') { tuVanRate = 60; hoTroRate = 40; }
      else if (splitRateVal === '50_50') { tuVanRate = 50; hoTroRate = 50; }

      const tuVanSelect = document.getElementById('ipt-sale');
      const hoTroSelect = document.getElementById('ipt-support-sale');
      const tuVanName = tuVanSelect && tuVanSelect.selectedIndex >= 0 ? tuVanSelect.options[tuVanSelect.selectedIndex].text.split('(')[0].trim() : 'Tư vấn';
      const hoTroVal = hoTroSelect ? hoTroSelect.value : '';
      const hoTroName = hoTroSelect && hoTroSelect.selectedIndex >= 0 && hoTroVal ? hoTroSelect.options[hoTroSelect.selectedIndex].text.split('(')[0].trim() : '';

      const tuVanProfit = Math.round(profit * (tuVanRate / 100));
      const hoTroProfit = profit - tuVanProfit; // Đảm bảo tổng = chính xác 100% không lệch 1 đồng

      const calcSplitDetail = document.getElementById('calc-split-detail');
      if (calcSplitDetail) {
        if (hoTroName && hoTroRate > 0) {
          calcSplitDetail.innerHTML = \`Tư vấn (\${tuVanName}): <b class="text-emerald-400">\${tuVanRate}% (+\${tuVanProfit.toLocaleString('vi-VN')} đ)</b> • Hỗ trợ (\${hoTroName}): <b class="text-cyan-400">\${hoTroRate}% (+\${hoTroProfit.toLocaleString('vi-VN')} đ)</b>\`;
        } else {
          calcSplitDetail.innerHTML = \`Tư vấn (\${tuVanName}): <b class="text-emerald-400">100% (+\${profit.toLocaleString('vi-VN')} đ)</b>\`;
        }
      }

      // Còn nợ nhà cung cấp
      const supplierRemain = Math.max(0, cost - apPaid);
      const sumSupplierRemain = document.getElementById('sum-supplier-remain-display');
      if (sumSupplierRemain) sumSupplierRemain.innerText = supplierRemain.toLocaleString('vi-VN') + ' đ';

      // Tính tổng tiến độ các đợt thanh toán của khách
      calculateInstallmentTotals(rev);
    }`;

if (content.includes(targetBlock)) {
  content = content.replace(targetBlock, replacementBlock);
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('✅ Successfully patched calculateFormFinancials and populateStaffDropdowns!');
} else {
  console.error('❌ Could not find targetBlock in CRM_Booking.html');
}

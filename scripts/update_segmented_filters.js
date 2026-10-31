const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'CRM_Booking.html');
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Cập nhật các nút filter-segmented
const oldSegmentedHtml = `              <button onclick="setFilter('cho_ke_toan')" data-filter="cho_ke_toan" class="px-3 py-1.5 rounded-md font-medium text-slate-400 hover:text-white transition">
                <span class="text-amber-300 font-bold">🟡 Chờ Kế Toán Duyệt (<span id="count-cho-ke-toan" class="font-mono">0</span>)</span>
              </button>
              <button onclick="setFilter('da_coc')" data-filter="da_coc" class="px-3 py-1.5 rounded-md font-medium text-slate-400 hover:text-white transition">
                <span class="text-orange-400 font-bold">🟠 Đã Cọc / Giữ Chỗ (<span id="count-da-coc" class="font-mono">0</span>)</span>
              </button>
              <button onclick="setFilter('cho_bgd')" data-filter="cho_bgd" class="px-3 py-1.5 rounded-md font-medium text-slate-400 hover:text-white transition">
                <span class="text-sky-300 font-bold">🔵 Chờ BGĐ Duyệt (<span id="count-cho-bgd" class="font-mono">0</span>)</span>
              </button>
              <button onclick="setFilter('dang_dieu_hanh')" data-filter="dang_dieu_hanh" class="px-3 py-1.5 rounded-md font-medium text-slate-400 hover:text-white transition">
                <span class="text-emerald-300 font-bold">🟢 Hoàn Thành (<span id="count-dang-dieu-hanh" class="font-mono">0</span>)</span>
              </button>
              <button onclick="setFilter('hoan_tat')" data-filter="hoan_tat" class="px-3 py-1.5 rounded-md font-medium text-slate-400 hover:text-white transition">
                <span class="text-slate-300 font-bold">⚪ Đã Tất Toán P&L (<span id="count-hoan-tat" class="font-mono">0</span>)</span>
              </button>
              <button onclick="setFilter('da_huy')" data-filter="da_huy" class="px-3 py-1.5 rounded-md font-medium text-slate-400 hover:text-white transition">
                <span class="text-rose-400 font-bold">🔴 Đã Hủy / Hoàn Tiền (<span id="count-da-huy" class="font-mono">0</span>)</span>
              </button>`;

const newSegmentedHtml = `              <button onclick="setFilter('moi_tao')" data-filter="moi_tao" class="px-3 py-1.5 rounded-md font-medium text-slate-400 hover:text-white transition">
                <span class="text-slate-300 font-bold">🆕 Mới Tạo (<span id="count-moi-tao" class="font-mono">0</span>)</span>
              </button>
              <button onclick="setFilter('cho_kiem_tra')" data-filter="cho_kiem_tra" class="px-3 py-1.5 rounded-md font-medium text-slate-400 hover:text-white transition">
                <span class="text-amber-300 font-bold">🔍 Chờ Kiểm Tra (<span id="count-cho-ke-toan" class="font-mono">0</span>)</span>
              </button>
              <button onclick="setFilter('cho_xac_nhan_doi_tac')" data-filter="cho_xac_nhan_doi_tac" class="px-3 py-1.5 rounded-md font-medium text-slate-400 hover:text-white transition">
                <span class="text-purple-300 font-bold">⏳ Chờ XN Đối Tác (<span id="count-cho-bgd" class="font-mono">0</span>)</span>
              </button>
              <button onclick="setFilter('da_xac_nhan')" data-filter="da_xac_nhan" class="px-3 py-1.5 rounded-md font-medium text-slate-400 hover:text-white transition">
                <span class="text-sky-300 font-bold">🏨 Đã Xác Nhận (<span id="count-da-xn" class="font-mono">0</span>)</span>
              </button>
              <button onclick="setFilter('da_thanh_toan')" data-filter="da_thanh_toan" class="px-3 py-1.5 rounded-md font-medium text-slate-400 hover:text-white transition">
                <span class="text-teal-300 font-bold">💳 Đã Thanh Toán (<span id="count-da-tt" class="font-mono">0</span>)</span>
              </button>
              <button onclick="setFilter('hoan_thanh')" data-filter="hoan_thanh" class="px-3 py-1.5 rounded-md font-medium text-slate-400 hover:text-white transition">
                <span class="text-emerald-300 font-bold">✅ Hoàn Thành (<span id="count-hoan-thanh" class="font-mono">0</span>)</span>
              </button>
              <button onclick="setFilter('da_huy')" data-filter="da_huy" class="px-3 py-1.5 rounded-md font-medium text-slate-400 hover:text-white transition">
                <span class="text-rose-400 font-bold">🔴 Đã Hủy / Hoàn Tiền (<span id="count-da-huy" class="font-mono">0</span>)</span>
              </button>`;

if (content.includes(oldSegmentedHtml)) {
  content = content.replace(oldSegmentedHtml, newSegmentedHtml);
  console.log('✅ Đã cập nhật nút lọc segmented tabs theo quy trình 6 bước chuẩn.');
} else {
  console.log('⚠️ oldSegmentedHtml không khớp');
}

// 2. Cập nhật logic lọc trong renderTable()
const oldFilterCheckInRenderTable = `        if (currentFilter === 'my_orders' && !isMine) return false;
        if (currentFilter === 'cho_ke_toan') {
          const st = b.tourStatus || 'cho_duyet';
          if (st !== 'cho_duyet' && st !== 'moi_tao' && st !== 'cho_coc') return false;
        }
        if (currentFilter === 'da_coc' && b.tourStatus !== 'da_coc') return false;
        if (currentFilter === 'cho_bgd' && b.tourStatus !== 'ke_toan_duyet') return false;
        if (currentFilter === 'dang_dieu_hanh' && b.tourStatus !== 'da_chot' && b.tourStatus !== 'da_xac_nhan' && b.tourStatus !== 'dang_di' && b.tourStatus !== 'hoan_tat') return false;
        if (currentFilter === 'hoan_tat' && b.tourStatus !== 'hoan_tat') return false;
        if (currentFilter === 'da_huy' && b.tourStatus !== 'da_huy') return false;`;

const newFilterCheckInRenderTable = `        if (currentFilter === 'my_orders' && !isMine) return false;
        if (currentFilter === 'moi_tao' && (b.tourStatus !== 'moi_tao')) return false;
        if (currentFilter === 'cho_kiem_tra' || currentFilter === 'cho_ke_toan') {
          const st = (b.tourStatus || 'cho_duyet').toLowerCase();
          if (st !== 'cho_kiem_tra' && st !== 'cho_duyet' && st !== 'cho_coc') return false;
        }
        if (currentFilter === 'cho_xac_nhan_doi_tac' || currentFilter === 'cho_bgd') {
          const st = (b.tourStatus || '').toLowerCase();
          if (st !== 'cho_xac_nhan_doi_tac' && st !== 'ke_toan_duyet') return false;
        }
        if (currentFilter === 'da_xac_nhan') {
          const st = (b.tourStatus || '').toLowerCase();
          if (st !== 'da_xac_nhan' && st !== 'da_chot' && st !== 'dang_di') return false;
        }
        if (currentFilter === 'da_thanh_toan' || currentFilter === 'da_coc') {
          const st = (b.tourStatus || '').toLowerCase();
          if (st !== 'da_thanh_toan' && st !== 'da_coc') return false;
        }
        if (currentFilter === 'hoan_thanh' || currentFilter === 'hoan_tat' || currentFilter === 'dang_dieu_hanh') {
          const st = (b.tourStatus || '').toLowerCase();
          if (st !== 'hoan_thanh' && st !== 'hoan_tat') return false;
        }
        if (currentFilter === 'da_huy' || currentFilter === 'da_hoan_tien') {
          const st = (b.tourStatus || '').toLowerCase();
          if (st !== 'da_huy' && st !== 'da_hoan_tien') return false;
        }`;

if (content.includes(oldFilterCheckInRenderTable)) {
  content = content.replace(oldFilterCheckInRenderTable, newFilterCheckInRenderTable);
  console.log('✅ Đã cập nhật logic lọc trong renderTable theo quy trình 6 bước chuẩn.');
} else {
  console.log('⚠️ oldFilterCheckInRenderTable không khớp');
}

// 3. Cập nhật đếm số lượng badges trong updateMetrics()
const oldCountsCalc = `      let choKeToanCount = 0;
      let daCocCount = 0;
      let choBgdCount = 0;
      let dangDieuHanhCount = 0;
      let hoanTatCount = 0;
      let daHuyCount = 0;

      bookings.forEach(b => {
        const isMine = b.saleEmail && b.saleEmail.toLowerCase() === myEmail;
        if (!canViewAll && !isMine) return; // Sales chỉ đếm số lượng trên các đơn thuộc quyền quản lý của mình

        const st = b.tourStatus || 'cho_duyet';
        if (st === 'cho_duyet' || st === 'moi_tao' || st === 'cho_coc') choKeToanCount++;
        else if (st === 'da_coc') daCocCount++;
        else if (st === 'ke_toan_duyet') choBgdCount++;
        else if (st === 'da_chot' || st === 'da_xac_nhan' || st === 'dang_di' || st === 'hoan_tat') dangDieuHanhCount++;
        else if (st === 'da_tat_toan' || st === 'tat_toan_pl') hoanTatCount++;
        else if (st === 'da_huy') daHuyCount++;
      });`;

const newCountsCalc = `      let moiTaoCount = 0;
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
      });

      setBadge('count-moi-tao', moiTaoCount);
      setBadge('count-da-xn', daXnCount);
      setBadge('count-da-tt', daTtCount);
      setBadge('count-hoan-thanh', hoanThanhCount);`;

if (content.includes(oldCountsCalc)) {
  content = content.replace(oldCountsCalc, newCountsCalc);
  console.log('✅ Đã cập nhật bộ đếm badge counters trong updateMetrics thành công.');
} else {
  console.log('⚠️ oldCountsCalc không khớp');
}

fs.writeFileSync(filePath, content, 'utf-8');
console.log('Cập nhật filter hoàn tất!');

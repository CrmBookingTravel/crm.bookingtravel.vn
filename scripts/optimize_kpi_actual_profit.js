const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'CRM_Booking.html');
let content = fs.readFileSync(filePath, 'utf8');

console.log('Original CRM_Booking.html size:', content.length);

// 1. UPDATE MODAL STAFF SECTION (Around line 2732)
// Locate the Sale Phụ Trách block and replace with Consultant + Support + Lead + Split Rate
const targetStaffSection = `            <div>
              <label class="block text-xs font-bold text-slate-200 mb-1.5">Sale Phụ Trách (*)</label>
              <select id="ipt-sale" class="w-full bg-[#07162f] border border-slate-700 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-sky-400">
                <!-- Tự động điền theo hệ thống phân quyền -->
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-200 mb-1.5">Ngày Tạo Đơn (*)</label>
              <input type="datetime-local" id="ipt-created-date" required class="w-full bg-[#07162f] border border-slate-700 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-mono text-emerald-300 focus:outline-none focus:border-emerald-400">
            </div>
          </div>`;

const replacementStaffSection = `            <div>
              <label class="block text-xs font-bold text-slate-200 mb-1.5 flex items-center justify-between">
                <span>Nhân Viên Tư Vấn Chính (*)</span>
                <span class="text-[9px] font-bold text-sky-400 bg-sky-950/80 px-1.5 py-0.5 rounded border border-sky-800">Tư Vấn</span>
              </label>
              <select id="ipt-sale" onchange="calculateFormFinancials()" class="w-full bg-[#07162f] border border-slate-700 rounded-xl px-3.5 py-2 text-xs sm:text-sm text-white focus:outline-none focus:border-sky-400">
                <!-- Tự động điền theo hệ thống phân quyền -->
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-slate-200 mb-1.5">Ngày Tạo Đơn (*)</label>
              <input type="datetime-local" id="ipt-created-date" required class="w-full bg-[#07162f] border border-slate-700 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-mono text-emerald-300 focus:outline-none focus:border-emerald-400">
            </div>
          </div>

          <!-- Dòng 1b: Phân công nhân sự & Cơ chế phân bổ KPI chống tính trùng -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-slate-900/60 rounded-xl border border-slate-800">
            <div>
              <label class="block text-xs font-bold text-cyan-300 mb-1 flex items-center justify-between">
                <span>Nhân Viên Hỗ Trợ (Nếu Có)</span>
                <span class="text-[9px] text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-800/60">Phối Hợp</span>
              </label>
              <select id="ipt-support-sale" onchange="calculateFormFinancials()" class="w-full bg-[#07162f] border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-400">
                <option value="">-- Không có NV hỗ trợ (100% Tư vấn) --</option>
              </select>
            </div>

            <div>
              <label class="block text-xs font-bold text-amber-300 mb-1 flex items-center justify-between">
                <span>Người Chịu Trách Nhiệm Đơn (*)</span>
                <span class="text-[9px] text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800/60">Lead/Owner</span>
              </label>
              <input type="text" id="ipt-lead-staff" placeholder="Người chịu trách nhiệm chính..." class="w-full bg-[#07162f] border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white font-medium focus:outline-none focus:border-amber-400">
            </div>

            <div>
              <label class="block text-xs font-bold text-emerald-300 mb-1 flex items-center justify-between">
                <span>Tỷ Lệ Phân Bổ KPI (Chống Trùng)</span>
                <span class="text-[9px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/60">Tư Vấn / Hỗ Trợ</span>
              </label>
              <select id="ipt-split-rate" onchange="calculateFormFinancials()" class="w-full bg-[#07162f] border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-400">
                <option value="100_0">100% Tư vấn - 0% Hỗ trợ (Mặc định)</option>
                <option value="70_30" selected>70% Tư vấn - 30% Hỗ trợ (Chuẩn công ty)</option>
                <option value="80_20">80% Tư vấn - 20% Hỗ trợ</option>
                <option value="60_40">60% Tư vấn - 40% Hỗ trợ</option>
                <option value="50_50">50% Tư vấn - 50% Hỗ trợ</option>
              </select>
            </div>
          </div>`;

if (content.includes(targetStaffSection)) {
  content = content.replace(targetStaffSection, replacementStaffSection);
  console.log('✅ Updated Modal Staff Section successfully.');
} else {
  console.error('❌ Could not find targetStaffSection');
}

// 2. UPDATE FINANCIALS SUMMARY SECTION IN MODAL (Around line 2927)
const targetFinancialSection = `            <div class="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <!-- Tổng Doanh Thu Bán -->
              <div class="p-3 rounded-lg bg-[#0a1b38] border border-amber-500/40">
                <span class="text-[10px] text-slate-400 block font-semibold uppercase">1. Tổng Doanh Thu (Giá Bán Báo Khách)</span>
                <input type="text" id="ipt-revenue" required placeholder="0" oninput="handleCurrencyInput(this); calculateFormFinancials();" class="w-full bg-transparent text-base sm:text-lg font-mono font-black text-amber-300 focus:outline-none mt-1">
              </div>

              <!-- Tổng Giá Vốn Net -->
              <div class="p-3 rounded-lg bg-[#0a1b38] border border-slate-700">
                <span class="text-[10px] text-slate-400 block font-semibold uppercase">2. Tổng Giá Vốn Net (Trả Đối Tác)</span>
                <input type="text" id="ipt-cost" required placeholder="0" oninput="handleCurrencyInput(this); calculateFormFinancials();" class="w-full bg-transparent text-base sm:text-lg font-mono font-bold text-slate-200 focus:outline-none mt-1">
              </div>

              <!-- Lợi Nhuận / Hoa Hồng Sales -->
              <div class="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/50 flex flex-col justify-between">
                <span class="text-[10px] text-emerald-300 block font-semibold uppercase">3. Hoa Hồng Của Sales (Doanh Thu - Net)</span>
                <div id="calc-profit-preview" class="text-base sm:text-lg font-mono font-black text-emerald-400 mt-1 truncate">+0 đ</div>
                <div id="calc-profit-real-preview" class="text-[10px] font-mono text-cyan-300 font-bold mt-0.5 truncate" title="Hoa hồng thực nhận sau khi trừ 30% chi phí thuế & vận hành">Thực nhận (-30%): +0 đ</div>
              </div>
            </div>`;

const replacementFinancialSection = `            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
              <!-- Tổng Doanh Thu Bán Ra -->
              <div class="p-3 rounded-lg bg-[#0a1b38] border border-amber-500/40">
                <span class="text-[10px] text-slate-400 block font-semibold uppercase">1. Doanh Thu Bán Ra</span>
                <input type="text" id="ipt-revenue" required placeholder="0" oninput="handleCurrencyInput(this); calculateFormFinancials();" class="w-full bg-transparent text-base sm:text-lg font-mono font-black text-amber-300 focus:outline-none mt-1">
              </div>

              <!-- Giá Vốn Đối Tác Net -->
              <div class="p-3 rounded-lg bg-[#0a1b38] border border-slate-700">
                <span class="text-[10px] text-slate-400 block font-semibold uppercase">2. Giá Vốn Đối Tác (Net)</span>
                <input type="text" id="ipt-cost" required placeholder="0" oninput="handleCurrencyInput(this); calculateFormFinancials();" class="w-full bg-transparent text-base sm:text-lg font-mono font-bold text-slate-200 focus:outline-none mt-1">
              </div>

              <!-- Chi Phí Phát Sinh -->
              <div class="p-3 rounded-lg bg-[#0a1b38] border border-rose-500/40">
                <span class="text-[10px] text-rose-300 block font-semibold uppercase">3. Chi Phí Phát Sinh</span>
                <input type="text" id="ipt-extra-cost" placeholder="0" oninput="handleCurrencyInput(this); calculateFormFinancials();" class="w-full bg-transparent text-base sm:text-lg font-mono font-bold text-rose-300 focus:outline-none mt-1" title="Phí chuyển khoản, phụ thu phát sinh ngoài gói, vé ngoài...">
              </div>

              <!-- Lợi Nhuận Thực Tế -->
              <div class="p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/50 flex flex-col justify-between">
                <span class="text-[10px] text-emerald-300 block font-semibold uppercase">4. Lợi Nhuận Thực Tế (Net P&L)</span>
                <div id="calc-profit-preview" class="text-base sm:text-lg font-mono font-black text-emerald-400 mt-1 truncate">+0 đ</div>
                <div id="calc-profit-real-preview" class="text-[10px] font-mono text-cyan-300 font-bold mt-0.5 truncate" title="Hoa hồng thực nhận sau khi trừ 30% chi phí thuế & vận hành">Thực nhận (-30%): +0 đ</div>
              </div>
            </div>

            <!-- Dòng hiển thị phân bổ lợi nhuận chống tính trùng -->
            <div id="calc-split-preview" class="mt-2 p-2.5 rounded-lg bg-slate-900/80 border border-slate-700 text-xs flex flex-wrap items-center justify-between gap-2">
              <span class="text-slate-300 flex items-center gap-1.5">
                <i class="fa-solid fa-scale-balanced text-amber-400"></i>
                <b class="text-amber-300">Phân bổ KPI chống tính trùng:</b>
                <span id="calc-split-detail" class="text-slate-300 font-mono">100% Tư vấn (+0 đ)</span>
              </span>
              <span class="text-[11px] text-emerald-400 font-mono font-semibold">
                Tổng phân bổ = 100% Lợi nhuận thực tế
              </span>
            </div>`;

if (content.includes(targetFinancialSection)) {
  content = content.replace(targetFinancialSection, replacementFinancialSection);
  console.log('✅ Updated Modal Financial Section successfully.');
} else {
  console.error('❌ Could not find targetFinancialSection');
}

// 3. UPDATE EXECUTIVE HEALTH CARDS IN VIEW-KPI-SALES
const targetKpiCards = `        <!-- THANH CHỈ SỐ SỨC KHỎE KPI & NHẮC NHỞ TOÀN ĐỘI (MOTIVATION HEALTH BAR) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Card 1: Chỉ tiêu chu kỳ -->
          <div class="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <p class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider" id="kpi-target-label">Chỉ Tiêu Bắt Buộc (Tháng)</p>
              <h3 class="text-lg font-extrabold text-white mt-1 font-mono num-tabular" id="kpi-target-total">100,000,000 đ</h3>
              <p class="text-[10px] text-slate-500 mt-0.5" id="kpi-target-per-person">Bắt buộc mỗi sales: 10,000,000 đ Hoa hồng thật</p>
            </div>
            <div class="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-lg">
              <i class="fa-solid fa-bullseye"></i>
            </div>
          </div>

          <!-- Card 2: Tổng hoa hồng toàn đội (Chưa trừ 30%) -->
          <div class="p-4 rounded-xl bg-slate-900 border border-emerald-900/40 bg-emerald-950/10 flex items-center justify-between">
            <div>
              <p class="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider" id="kpi-gross-label">Hoa Hồng Toàn Đội (Chưa trừ 30%)</p>
              <h3 class="text-lg font-extrabold text-emerald-400 mt-1 font-mono num-tabular" id="kpi-gross-total">+0 đ</h3>
              <p class="text-[10px] text-slate-400 mt-0.5" id="kpi-gross-sub">Tổng hoa hồng gộp cả đội mang về</p>
            </div>
            <div class="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-lg">
              <i class="fa-solid fa-money-bill-wave"></i>
            </div>
          </div>

          <!-- Card 3: Hoa hồng thật toàn đội (-30% thuế) -->
          <div class="p-4 rounded-xl bg-slate-900 border border-cyan-900/40 bg-cyan-950/10 flex items-center justify-between">
            <div>
              <p class="text-[11px] font-semibold text-cyan-300 uppercase tracking-wider" id="kpi-actual-label">Hoa Hồng Thật (-30% Thuế)</p>
              <h3 class="text-lg font-extrabold text-cyan-400 mt-1 font-mono num-tabular" id="kpi-actual-total">0 đ</h3>
              <p class="text-[10px] text-slate-400 mt-0.5" id="kpi-actual-percent">Tiến độ chỉ tiêu: 0%</p>
            </div>
            <div class="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 text-lg">
              <i class="fa-solid fa-calculator"></i>
            </div>
          </div>

          <!-- Card 4: Tổng tiền thực nhận (Sales) -->
          <div class="p-4 rounded-xl bg-slate-900 border border-amber-900/40 bg-amber-950/10 flex items-center justify-between">
            <div>
              <p class="text-[11px] font-semibold text-amber-300 uppercase tracking-wider" id="kpi-payout-label">Tổng Tiền Thực Nhận (Sales)</p>
              <h3 class="text-lg font-extrabold text-amber-400 mt-1 font-mono num-tabular" id="kpi-payout-total">0 đ</h3>
              <div class="flex items-center gap-2 mt-0.5">
                <p class="text-[10px] text-amber-200/80" id="kpi-payout-sub">Chia 40% phần vượt: <span id="kpi-passed-count">0</span>/<span id="kpi-total-sales-count">10</span> Sales</p>
                <button onclick="openKpiBroadcastModal()" class="text-[10px] font-bold text-rose-300 hover:text-white underline cursor-pointer flex items-center gap-1" title="Nhắc Zalo toàn đội sales">
                  <i class="fa-solid fa-bullhorn text-[9px]"></i> Tiếp Lửa
                </button>
              </div>
            </div>
            <div class="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 text-lg">
              <i class="fa-solid fa-sack-dollar"></i>
            </div>
          </div>
        </div>`;

const replacementKpiCards = `        <!-- THANH CHỈ SỐ SỨC KHỎE KPI & NHẮC NHỞ TOÀN ĐỘI (MOTIVATION HEALTH BAR) -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Card 1: Chỉ tiêu & Tiến độ chu kỳ -->
          <div class="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between shadow-lg">
            <div>
              <p class="text-[11px] font-semibold text-slate-400 uppercase tracking-wider" id="kpi-target-label">Chỉ Tiêu Bắt Buộc (Tháng)</p>
              <h3 class="text-lg font-extrabold text-white mt-1 font-mono num-tabular" id="kpi-target-total">100,000,000 đ</h3>
              <p class="text-[10px] text-slate-500 mt-0.5" id="kpi-target-per-person">Bắt buộc mỗi sales: 10,000,000 đ Lợi nhuận</p>
            </div>
            <div class="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 text-lg">
              <i class="fa-solid fa-bullseye"></i>
            </div>
          </div>

          <!-- Card 2: Tổng Lợi Nhuận Thực Tế (Net P&L) -->
          <div class="p-4 rounded-xl bg-slate-900 border border-emerald-900/40 bg-emerald-950/10 flex items-center justify-between shadow-lg">
            <div>
              <p class="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider" id="kpi-gross-label">Lợi Nhuận Thực Tế Toàn Đội</p>
              <h3 class="text-lg font-extrabold text-emerald-400 mt-1 font-mono num-tabular" id="kpi-gross-total">+0 đ</h3>
              <p class="text-[10px] text-slate-400 mt-0.5" id="kpi-gross-sub">Đã trừ giá vốn & chi phí phát sinh</p>
            </div>
            <div class="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 text-lg">
              <i class="fa-solid fa-money-bill-trend-up"></i>
            </div>
          </div>

          <!-- Card 3: Tỷ Lệ Booking Thành Công & Đơn Hủy -->
          <div class="p-4 rounded-xl bg-slate-900 border border-cyan-900/40 bg-cyan-950/10 flex items-center justify-between shadow-lg">
            <div>
              <p class="text-[11px] font-semibold text-cyan-300 uppercase tracking-wider" id="kpi-actual-label">Tỷ Lệ Booking Thành Công</p>
              <h3 class="text-lg font-extrabold text-cyan-400 mt-1 font-mono num-tabular" id="kpi-actual-total">100%</h3>
              <p class="text-[10px] text-slate-400 mt-0.5" id="kpi-actual-percent">Thành công: 0 • Hủy: 0 (0%)</p>
            </div>
            <div class="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 text-lg">
              <i class="fa-solid fa-chart-pie"></i>
            </div>
          </div>

          <!-- Card 4: Tổng Thưởng Dự Kiến (Vượt Chỉ Tiêu 10tr) -->
          <div class="p-4 rounded-xl bg-slate-900 border border-amber-900/40 bg-amber-950/10 flex items-center justify-between shadow-lg">
            <div>
              <p class="text-[11px] font-semibold text-amber-300 uppercase tracking-wider" id="kpi-payout-label">Tổng Thưởng Dự Kiến (Sales)</p>
              <h3 class="text-lg font-extrabold text-amber-400 mt-1 font-mono num-tabular" id="kpi-payout-total">0 đ</h3>
              <div class="flex items-center gap-2 mt-0.5">
                <p class="text-[10px] text-amber-200/80" id="kpi-payout-sub">Chia 40% phần vượt: <span id="kpi-passed-count">0</span>/<span id="kpi-total-sales-count">10</span> Sales</p>
                <button onclick="openKpiBroadcastModal()" class="text-[10px] font-bold text-rose-300 hover:text-white underline cursor-pointer flex items-center gap-1" title="Nhắc Zalo toàn đội sales">
                  <i class="fa-solid fa-bullhorn text-[9px]"></i> Tiếp Lửa
                </button>
              </div>
            </div>
            <div class="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 text-lg">
              <i class="fa-solid fa-sack-dollar"></i>
            </div>
          </div>
        </div>`;

if (content.includes(targetKpiCards)) {
  content = content.replace(targetKpiCards, replacementKpiCards);
  console.log('✅ Updated Executive Health Cards successfully.');
} else {
  console.error('❌ Could not find targetKpiCards');
}

// 4. ADD populateStaffDropdowns FUNCTION AND CALL IT IN updateUserUI
const targetUpdateUserUI = `      // Populate dropdown sale
      const saleSelect = document.getElementById('ipt-sale');
      if (saleSelect && typeof systemUsers !== 'undefined') {
        saleSelect.innerHTML = '';
        systemUsers.filter(u => u.role === 'sale' || u.role === 'admin').forEach(u => {
          const opt = document.createElement('option');
          opt.value = u.email;
          const uLabel = u.name ? \`\${u.name} (\${u.email.split('@')[0]})\` : u.email;
          opt.innerText = uLabel;
          if (currentUser.email && u.email.toLowerCase() === currentUser.email.toLowerCase()) {
            opt.selected = true;
          }
          saleSelect.appendChild(opt);
        });
      }`;

const replacementUpdateUserUI = `      // Populate dropdown sale & support sale
      populateStaffDropdowns();`;

if (content.includes(targetUpdateUserUI)) {
  content = content.replace(targetUpdateUserUI, replacementUpdateUserUI);
  console.log('✅ Replaced inline saleSelect population with populateStaffDropdowns().');
} else {
  console.error('❌ Could not find targetUpdateUserUI');
}

// 5. UPDATE calculateFormFinancials()
const targetCalcFinancialsStart = `    // YÊU CẦU 7: Tính toán P&L Realtime: GIÁ BÁN - GIÁ NHẬN = HOA HỒNG / LỢI NHUẬN GỘP
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
      if (marginBadge) marginBadge.innerText = margin + '%';

      // Update realtime preview in Summary Block
      const previewProfit = document.getElementById('calc-profit-preview');
      const previewReal = document.getElementById('calc-profit-real-preview');
      if (previewProfit) {
        if (profit >= 0) {
          previewProfit.className = 'text-base sm:text-lg font-mono font-black text-emerald-400 mt-1 truncate';
          previewProfit.innerText = '+' + profit.toLocaleString('vi-VN') + ' đ';
        } else {
          previewProfit.className = 'text-base sm:text-lg font-mono font-black text-rose-400 mt-1 truncate';
          previewProfit.innerText = profit.toLocaleString('vi-VN') + ' đ (Bán Lỗ)';
        }
      }
      if (previewReal) {
        const taxCost = Math.round(Math.max(0, profit) * 0.30);
        const realProfit = Math.max(0, profit - taxCost);
        previewReal.innerText = 'Thực nhận (-30%): +' + realProfit.toLocaleString('vi-VN') + ' đ';
      }
    }`;

const replacementCalcFinancials = `    // ĐIỀN DROPDOWN NHÂN VIÊN TƯ VẤN & HỖ TRỢ
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
      if (marginBadge) marginBadge.innerText = margin + '%';

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
    }`;

if (content.includes(targetCalcFinancialsStart)) {
  content = content.replace(targetCalcFinancialsStart, replacementCalcFinancials);
  console.log('✅ Updated calculateFormFinancials successfully.');
} else {
  console.error('❌ Could not find targetCalcFinancialsStart');
}

// 6. UPDATE handleSaveBooking IN CRM_Booking.html
// Update reading inputs: extraCost, support, lead, splitRate
const targetRevCostVars = `      const rev = parseCurrency(document.getElementById('ipt-revenue').value);
      const cost = parseCurrency(document.getElementById('ipt-cost').value);
      const apPaid = parseCurrency(document.getElementById('ipt-ap-paid').value);`;

const replacementRevCostVars = `      const rev = parseCurrency(document.getElementById('ipt-revenue').value);
      const cost = parseCurrency(document.getElementById('ipt-cost').value);
      const extraCost = parseCurrency(document.getElementById('ipt-extra-cost')?.value || 0);
      const apPaid = parseCurrency(document.getElementById('ipt-ap-paid').value);
      const supportEmailVal = (document.getElementById('ipt-support-sale')?.value || '').trim();
      const leadStaffVal = (document.getElementById('ipt-lead-staff')?.value || '').trim() || document.getElementById('ipt-sale').value;
      const splitRateVal = document.getElementById('ipt-split-rate')?.value || '100_0';
      let rTuVan = 100;
      let rHoTro = 0;
      if (splitRateVal === '70_30') { rTuVan = 70; rHoTro = 30; }
      else if (splitRateVal === '80_20') { rTuVan = 80; rHoTro = 20; }
      else if (splitRateVal === '60_40') { rTuVan = 60; rHoTro = 40; }
      else if (splitRateVal === '50_50') { rTuVan = 50; rHoTro = 50; }
      if (!supportEmailVal) { rTuVan = 100; rHoTro = 0; }
      const actualNetProfit = Math.max(0, rev - cost - extraCost);`;

if (content.includes(targetRevCostVars)) {
  content = content.replace(targetRevCostVars, replacementRevCostVars);
  console.log('✅ Updated rev, cost, extraCost variables in handleSaveBooking.');
} else {
  console.error('❌ Could not find targetRevCostVars');
}

// Update item creation in handleSaveBooking
const targetItemDef = `        doiTac: document.getElementById('ipt-supplier').value.trim(),
        giaVon: cost,
        daTraDoiTac: apPaid,`;

const replacementItemDef = `        doiTac: document.getElementById('ipt-supplier').value.trim(),
        giaVon: cost,
        chiPhiPhatSinh: extraCost,
        loiNhuanThucTe: actualNetProfit,
        tuVanEmail: document.getElementById('ipt-sale').value,
        tuVanName: (document.getElementById('ipt-sale').selectedOptions[0]?.text || '').split('(')[0].trim(),
        hoTroEmail: supportEmailVal,
        hoTroName: supportEmailVal ? ((document.getElementById('ipt-support-sale').selectedOptions[0]?.text || '').split('(')[0].trim()) : '',
        nguoiChiuTrachNhiem: leadStaffVal,
        tyLeTuVan: rTuVan,
        tyLeHoTro: rHoTro,
        daTraDoiTac: apPaid,`;

if (content.includes(targetItemDef)) {
  content = content.replace(targetItemDef, replacementItemDef);
  console.log('✅ Updated item definition with actual profit & staff fields in handleSaveBooking.');
} else {
  console.error('❌ Could not find targetItemDef');
}

// Update audit trail diffs in handleSaveBooking
const targetAuditDiff = `        if (Number(oldBooking.giaVon || 0) !== Number(item.giaVon || 0)) {
          diffs.push('Giá vốn NCC: ' + (Number(oldBooking.giaVon) || 0).toLocaleString('vi-VN') + ' đ ➔ ' + (Number(item.giaVon) || 0).toLocaleString('vi-VN') + ' đ');
        }`;

const replacementAuditDiff = `        if (Number(oldBooking.giaVon || 0) !== Number(item.giaVon || 0)) {
          diffs.push('Giá vốn NCC: ' + (Number(oldBooking.giaVon) || 0).toLocaleString('vi-VN') + ' đ ➔ ' + (Number(item.giaVon) || 0).toLocaleString('vi-VN') + ' đ');
        }
        if (Number(oldBooking.chiPhiPhatSinh || 0) !== Number(item.chiPhiPhatSinh || 0)) {
          diffs.push('Chi phí phát sinh: ' + (Number(oldBooking.chiPhiPhatSinh) || 0).toLocaleString('vi-VN') + ' đ ➔ ' + (Number(item.chiPhiPhatSinh) || 0).toLocaleString('vi-VN') + ' đ');
        }
        if ((oldBooking.hoTroEmail || '') !== item.hoTroEmail) {
          diffs.push('Nhân viên hỗ trợ: "' + (oldBooking.hoTroEmail || 'Không có') + '" ➔ "' + (item.hoTroEmail || 'Không có') + '"');
        }
        if ((oldBooking.nguoiChiuTrachNhiem || '') !== item.nguoiChiuTrachNhiem) {
          diffs.push('Người chịu trách nhiệm: "' + (oldBooking.nguoiChiuTrachNhiem || 'Trống') + '" ➔ "' + (item.nguoiChiuTrachNhiem || 'Trống') + '"');
        }
        if (Number(oldBooking.tyLeTuVan || 100) !== Number(item.tyLeTuVan || 100)) {
          diffs.push('Tỷ lệ phân bổ KPI: ' + (oldBooking.tyLeTuVan || 100) + '/' + (oldBooking.tyLeHoTro || 0) + ' ➔ ' + item.tyLeTuVan + '/' + item.tyLeHoTro);
        }`;

if (content.includes(targetAuditDiff)) {
  content = content.replace(targetAuditDiff, replacementAuditDiff);
  console.log('✅ Updated audit trail diffs with actual profit and staff fields.');
} else {
  console.error('❌ Could not find targetAuditDiff');
}

// 7. UPDATE openModalTaoDon()
const targetOpenCreateModal = `      // Reset các trường
      document.getElementById('ipt-customer-email').value = '';
      document.getElementById('ipt-customer-cccd').value = '';
      document.getElementById('ipt-revenue').value = '';
      document.getElementById('ipt-cost').value = '';
      document.getElementById('ipt-ap-paid').value = '';`;

const replacementOpenCreateModal = `      // Điền danh sách nhân viên tư vấn & hỗ trợ
      populateStaffDropdowns();
      if (document.getElementById('ipt-extra-cost')) document.getElementById('ipt-extra-cost').value = '';
      if (document.getElementById('ipt-support-sale')) document.getElementById('ipt-support-sale').value = '';
      if (document.getElementById('ipt-lead-staff')) document.getElementById('ipt-lead-staff').value = currentUser ? (currentUser.name || currentUser.email) : '';
      if (document.getElementById('ipt-split-rate')) document.getElementById('ipt-split-rate').value = '100_0';

      // Reset các trường
      document.getElementById('ipt-customer-email').value = '';
      document.getElementById('ipt-customer-cccd').value = '';
      document.getElementById('ipt-revenue').value = '';
      document.getElementById('ipt-cost').value = '';
      document.getElementById('ipt-ap-paid').value = '';`;

if (content.includes(targetOpenCreateModal)) {
  content = content.replace(targetOpenCreateModal, replacementOpenCreateModal);
  console.log('✅ Updated openModalTaoDon with new staff and cost inputs.');
} else {
  console.error('❌ Could not find targetOpenCreateModal');
}

// 8. UPDATE editBooking(id)
const targetEditBookingFields = `      // YÊU CẦU 3: Định dạng có dấu chấm
      document.getElementById('ipt-revenue').value = formatCurrency(b.giaBan || 0);
      document.getElementById('ipt-supplier').value = b.doiTac || '';
      document.getElementById('ipt-cost').value = formatCurrency(b.giaVon || 0);
      document.getElementById('ipt-ap-paid').value = formatCurrency(b.daTraDoiTac || 0);`;

const replacementEditBookingFields = `      // Điền danh sách nhân sự
      populateStaffDropdowns();
      if (document.getElementById('ipt-support-sale')) document.getElementById('ipt-support-sale').value = b.hoTroEmail || '';
      if (document.getElementById('ipt-lead-staff')) document.getElementById('ipt-lead-staff').value = b.nguoiChiuTrachNhiem || b.tuVanName || b.saleEmail || '';
      if (document.getElementById('ipt-split-rate')) {
        if (b.tyLeTuVan && b.tyLeHoTro) {
          document.getElementById('ipt-split-rate').value = \`\${b.tyLeTuVan}_\${b.tyLeHoTro}\`;
        } else {
          document.getElementById('ipt-split-rate').value = b.hoTroEmail ? '70_30' : '100_0';
        }
      }

      // YÊU CẦU 3: Định dạng có dấu chấm
      document.getElementById('ipt-revenue').value = formatCurrency(b.giaBan || 0);
      document.getElementById('ipt-supplier').value = b.doiTac || '';
      document.getElementById('ipt-cost').value = formatCurrency(b.giaVon || 0);
      if (document.getElementById('ipt-extra-cost')) document.getElementById('ipt-extra-cost').value = formatCurrency(b.chiPhiPhatSinh || 0);
      document.getElementById('ipt-ap-paid').value = formatCurrency(b.daTraDoiTac || 0);`;

if (content.includes(targetEditBookingFields)) {
  content = content.replace(targetEditBookingFields, replacementEditBookingFields);
  console.log('✅ Updated editBooking with new staff and cost inputs.');
} else {
  console.error('❌ Could not find targetEditBookingFields');
}

// 9. REWRITE KPI ENGINE (calcBookingTravelKpi, getBookingNetProfitAndSplit, renderSalesKpiView)
// Locate from `function calcBookingTravelKpi` to the end of `renderSalesKpiView()`
const kpiEngineStartMarker = `    // HÀM TÍNH HOA HỒNG VÀ TIẾN ĐỘ THEO CHÍNH SÁCH CÔNG TY BOOKING TRAVEL:
    // 1. Chỉ tiêu hoa hồng 1 tháng bắt buộc là 10 triệu (Tuần: 2.500.000 đ, Ngày: 384.615 đ)
    // 2. Trừ 30% chi phí thuế & vận hành từ tổng hoa hồng (lãi gộp) -> Hoa hồng thật (70%)
    // 3. Từ 10 triệu trở đi (phần vượt), công ty chia: Công ty 60%, Nhân viên 40%
    function calcBookingTravelKpi(profit, period = 'month', target = 10000000) {`;

const kpiEngineEndMarker = `        tbody.innerHTML += \`
          <tr class="bg-slate-950/95 border-t-2 border-amber-500/50 font-extrabold text-white shadow-lg sticky bottom-0">
            <td class="py-3.5 px-3.5 text-center text-amber-400 font-black">
              <i class="fa-solid fa-users text-sm"></i>
            </td>
            <td class="py-3.5 px-3.5">
              <div class="font-extrabold text-amber-300 text-xs tracking-wider uppercase flex items-center gap-1.5">
                <span>TỔNG CỘNG TOÀN ĐỘI</span>
                <span class="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-200">\${sortedList.length} Sales</span>
              </div>
              <div class="text-[10px] text-slate-400 font-normal">Hợp nhất kết quả kinh doanh (\${periodLabel})</div>
            </td>
            <td class="py-3.5 px-3.5 text-center font-mono text-cyan-300 text-xs font-bold">\${totalBookings} đơn</td>
            <td class="py-3.5 px-3.5 text-right font-mono text-white text-xs num-tabular font-bold">\${totalRevenue.toLocaleString('vi-VN')} đ</td>
            <td class="py-3.5 px-3.5 text-right font-mono text-emerald-400 text-xs num-tabular font-bold">+\${totalGrossProfit.toLocaleString('vi-VN')} đ</td>
            <td class="py-3.5 px-3.5 text-right font-mono text-cyan-300 text-xs num-tabular font-bold bg-cyan-950/40 border-l border-cyan-800/60" title="Tổng hoa hồng thật toàn đội sau khi trừ 30% chi phí thuế">
              \${totalRealActual.toLocaleString('vi-VN')} đ
            </td>
            <td class="py-3.5 px-3.5 text-right font-mono text-slate-300 text-xs num-tabular font-bold">\${totalTarget.toLocaleString('vi-VN')} đ</td>
            <td class="py-3.5 px-3.5 text-center font-mono text-xs">
              <div class="flex items-center justify-center gap-1.5">
                <span class="font-bold \${teamProg >= 100 ? 'text-emerald-400' : (teamProg >= 50 ? 'text-amber-400' : 'text-rose-400')}">\${teamProg}%</span>
                <div class="w-12 bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-700 hidden sm:block">
                  <div class="\${teamProg >= 100 ? 'bg-emerald-400' : (teamProg >= 50 ? 'bg-amber-400' : 'bg-rose-500')} h-full rounded-full" style="width: \${Math.min(100, teamProg)}%"></div>
                </div>
              </div>
            </td>
            <td class="py-3.5 px-3.5 text-right font-mono font-bold text-xs num-tabular bg-amber-500/20 border-l border-amber-500/40">
              \${totalStaffCommission > 0 
                ? \`<span class="text-amber-300 font-black text-sm">+\${totalStaffCommission.toLocaleString('vi-VN')} đ</span><span class="block text-[9px] text-emerald-400 font-medium">\${passedCount} Sales được chia 40%</span>\` 
                : \`<span class="text-slate-400 font-bold">0 đ</span><span class="block text-[9px] text-slate-500 font-normal">Chưa có sales vượt 10tr</span>\`}
            </td>
            <td class="py-3.5 px-3.5 text-center">
              <span class="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider \${teamProg >= 100 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : (teamProg >= 50 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-rose-500/25 text-rose-300 border border-rose-500/50')}">
                \${teamProg >= 100 ? '🏆 Đạt Chỉ Tiêu' : (teamProg >= 50 ? '🏃‍♂️ Đang Tăng Tốc' : '⚡ Toàn Đội Cố Lên!')}
              </span>
            </td>
            <td class="py-3.5 px-3.5 text-center">
              <button onclick="openKpiBroadcastModal()" class="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-rose-600 hover:bg-rose-500 text-white transition flex items-center gap-1 mx-auto shadow-md cursor-pointer">
                <i class="fa-solid fa-bullhorn text-xs"></i> <span>Tiếp Lửa Cả Đội</span>
              </button>
            </td>
          </tr>
        \`;
      }
    }`;

const startIdx = content.indexOf(kpiEngineStartMarker);
const endIdx = content.indexOf(kpiEngineEndMarker);

if (startIdx !== -1 && endIdx !== -1) {
  const fullTargetBlock = content.substring(startIdx, endIdx + kpiEngineEndMarker.length);
  
  const replacementKpiEngine = `    // =========================================================================
    // HỆ THỐNG KPI BOOKING TRAVEL THEO LỢI NHUẬN THỰC TẾ & CHỐNG TÍNH TRÙNG
    // =========================================================================
    // CHÍNH SÁCH BOOKING TRAVEL:
    // 1. Lợi nhuận thực tế = Doanh thu bán ra - Giá vốn đối tác - Chi phí phát sinh
    // 2. Chỉ tiêu lợi nhuận 1 tháng: 10 triệu (Tuần: 2.500.000 đ | Ngày: 384.615 đ)
    // 3. Trừ 30% chi phí thuế & vận hành từ lợi nhuận thực tế -> Hoa hồng thật (70%)
    // 4. Khi Hoa hồng thật > 10 triệu (phần vượt), chia thưởng: Nhân viên 40%, Công ty 60%
    // 5. CƠ CHẾ CHỐNG TÍNH TRÙNG: Tổng lợi nhuận phân bổ (Tư vấn + Hỗ trợ) luôn chính xác
    //    bằng 100% lợi nhuận thực tế của từng booking, không bao giờ phát sinh trùng lặp.
    
    function calcBookingTravelKpi(profit, period = 'month', target = 10000000) {
      let pTarget = target;
      if (period === 'day') pTarget = Math.round(target / 26);
      else if (period === 'week') pTarget = Math.round(target / 4);

      const rawProfit = Math.max(0, profit || 0);
      const taxCost = Math.round(rawProfit * 0.30); // 30% chi phí thuế & vận hành
      const realCommission = Math.max(0, rawProfit - taxCost); // Hoa hồng thật (70%)
      const progress = pTarget > 0 ? Math.round((realCommission / pTarget) * 100) : 0;
      const surplus = Math.max(0, realCommission - pTarget); // Phần vượt chỉ tiêu bắt buộc
      const staffCommission = Math.round(surplus * 0.40); // Nhân viên hưởng 40% phần vượt
      const companyShare = Math.round(surplus * 0.60); // Công ty hưởng 60% phần vượt
      const remaining = Math.max(0, pTarget - realCommission); // Còn thiếu để đạt mốc

      return {
        profit: rawProfit,
        taxCost,
        realCommission,
        target: pTarget,
        progress,
        surplus,
        staffCommission,
        companyShare,
        remaining,
        isPassed: realCommission >= pTarget
      };
    }

    // HÀM TÍNH LỢI NHUẬN THỰC TẾ & PHÂN BỔ CHỐNG TÍNH TRÙNG CHO 1 BOOKING
    function getBookingNetProfitAndSplit(b) {
      const rev = parseFloat(b.giaBan) || 0;
      const cost = parseFloat(b.giaVon) || 0;
      const extraCost = parseFloat(b.chiPhiPhatSinh) || 0;
      const actualProfit = Math.max(0, rev - cost - extraCost);

      const tuVanEmail = (b.tuVanEmail || b.saleEmail || '').toLowerCase();
      const hoTroEmail = (b.hoTroEmail || '').toLowerCase();

      let rTuVan = 100;
      let rHoTro = 0;
      if (hoTroEmail && hoTroEmail !== tuVanEmail) {
        rTuVan = parseFloat(b.tyLeTuVan);
        if (isNaN(rTuVan) || rTuVan <= 0 || rTuVan > 100) rTuVan = 70;
        rHoTro = 100 - rTuVan;
      }

      // ĐẢM BẢO CHÍNH XÁC 100%: tuVanProfit + hoTroProfit === actualProfit
      const tuVanProfit = Math.round(actualProfit * (rTuVan / 100));
      const hoTroProfit = actualProfit - tuVanProfit;

      // ĐẢM BẢO CHÍNH XÁC 100%: tuVanRev + hoTroRev === rev
      const tuVanRev = Math.round(rev * (rTuVan / 100));
      const hoTroRev = rev - tuVanRev;

      const isSuccess = ['hoan_thanh', 'da_thanh_toan', 'da_xac_nhan', 'hoan_tat'].includes(b.tourStatus);
      const isCancelled = ['da_huy', 'da_hoan_tien'].includes(b.tourStatus);

      return {
        rev,
        cost,
        extraCost,
        actualProfit,
        tuVanEmail,
        hoTroEmail,
        rTuVan,
        rHoTro,
        tuVanProfit,
        hoTroProfit,
        tuVanRev,
        hoTroRev,
        isSuccess,
        isCancelled
      };
    }

    // HÀM LẤY LỢI NHUẬN & DOANH THU ĐƯỢC PHÂN BỔ CỦA 1 NHÂN SỰ
    function getStaffProfitForBooking(b, userEmail) {
      if (!userEmail) return { rev: 0, profit: 0, isConsultant: false, isSupport: false, isSuccess: false, isCancelled: false };
      const email = userEmail.toLowerCase();
      const split = getBookingNetProfitAndSplit(b);
      let rev = 0;
      let profit = 0;
      let isConsultant = false;
      let isSupport = false;

      if (split.tuVanEmail === email) {
        rev += split.tuVanRev;
        profit += split.tuVanProfit;
        isConsultant = true;
      }
      if (split.hoTroEmail === email && split.hoTroEmail !== split.tuVanEmail) {
        rev += split.hoTroRev;
        profit += split.hoTroProfit;
        isSupport = true;
      }

      return { 
        rev, 
        profit, 
        isConsultant, 
        isSupport, 
        isSuccess: split.isSuccess, 
        isCancelled: split.isCancelled,
        totalBookingProfit: split.actualProfit 
      };
    }

    // TỔNG HỢP & HIỂN THỊ TOÀN BỘ KPI (NGÀY • TUẦN • THÁNG • MATRIX)
    function renderSalesKpiView() {
      const salesMap = {};
      const staffList = (typeof systemUsers !== 'undefined' ? systemUsers : []).filter(u => u.role === 'sale' || u.role === 'admin');

      staffList.forEach(u => {
        const email = u.email.toLowerCase();
        salesMap[email] = {
          user: u,
          // Ngày
          dayRevenue: 0, dayProfit: 0, dayTotalCount: 0, daySuccessCount: 0, dayCancelCount: 0,
          // Tuần
          weekRevenue: 0, weekProfit: 0, weekTotalCount: 0, weekSuccessCount: 0, weekCancelCount: 0,
          // Tháng
          monthRevenue: 0, monthProfit: 0, monthTotalCount: 0, monthSuccessCount: 0, monthCancelCount: 0,
          // Toàn thời gian
          totalRevenue: 0, totalProfit: 0, totalCount: 0, totalSuccessCount: 0, totalCancelCount: 0,
          consultantCount: 0,
          supportCount: 0
        };
      });

      // LẶP TOÀN BỘ BOOKINGS VÀ PHÂN BỔ CHỐNG TÍNH TRÙNG
      bookings.forEach(b => {
        const split = getBookingNetProfitAndSplit(b);

        // 1. Phân bổ cho Nhân viên Tư Vấn
        if (salesMap[split.tuVanEmail]) {
          const s = salesMap[split.tuVanEmail];
          s.totalRevenue += split.tuVanRev;
          s.totalProfit += split.tuVanProfit;
          s.totalCount++;
          s.consultantCount++;
          if (split.isSuccess) s.totalSuccessCount++;
          if (split.isCancelled) s.totalCancelCount++;

          if (isBookingInPeriod(b, 'day')) {
            s.dayRevenue += split.tuVanRev;
            s.dayProfit += split.tuVanProfit;
            s.dayTotalCount++;
            if (split.isSuccess) s.daySuccessCount++;
            if (split.isCancelled) s.dayCancelCount++;
          }
          if (isBookingInPeriod(b, 'week')) {
            s.weekRevenue += split.tuVanRev;
            s.weekProfit += split.tuVanProfit;
            s.weekTotalCount++;
            if (split.isSuccess) s.weekSuccessCount++;
            if (split.isCancelled) s.weekCancelCount++;
          }
          if (isBookingInPeriod(b, 'month')) {
            s.monthRevenue += split.tuVanRev;
            s.monthProfit += split.tuVanProfit;
            s.monthTotalCount++;
            if (split.isSuccess) s.monthSuccessCount++;
            if (split.isCancelled) s.monthCancelCount++;
          }
        }

        // 2. Phân bổ cho Nhân viên Hỗ Trợ (Nếu có và khác tư vấn)
        if (split.hoTroEmail && split.hoTroEmail !== split.tuVanEmail && salesMap[split.hoTroEmail]) {
          const s = salesMap[split.hoTroEmail];
          s.totalRevenue += split.hoTroRev;
          s.totalProfit += split.hoTroProfit;
          s.supportCount++;
          // Tính hiệu suất xử lý
          if (split.isSuccess) s.totalSuccessCount++;
          if (split.isCancelled) s.totalCancelCount++;

          if (isBookingInPeriod(b, 'day')) {
            s.dayRevenue += split.hoTroRev;
            s.dayProfit += split.hoTroProfit;
            if (split.isSuccess) s.daySuccessCount++;
            if (split.isCancelled) s.dayCancelCount++;
          }
          if (isBookingInPeriod(b, 'week')) {
            s.weekRevenue += split.hoTroRev;
            s.weekProfit += split.hoTroProfit;
            if (split.isSuccess) s.weekSuccessCount++;
            if (split.isCancelled) s.weekCancelCount++;
          }
          if (isBookingInPeriod(b, 'month')) {
            s.monthRevenue += split.hoTroRev;
            s.monthProfit += split.hoTroProfit;
            if (split.isSuccess) s.monthSuccessCount++;
            if (split.isCancelled) s.monthCancelCount++;
          }
        }
      });

      const allSalesList = Object.values(salesMap);

      // Sắp xếp danh sách sales theo Lợi Nhuận Thực Tế chu kỳ đang chọn
      let sortedList = [...allSalesList];
      if (currentKpiPeriod === 'day') {
        sortedList.sort((a, b) => b.dayProfit - a.dayProfit);
      } else if (currentKpiPeriod === 'week') {
        sortedList.sort((a, b) => b.weekProfit - a.weekProfit);
      } else {
        sortedList.sort((a, b) => b.monthProfit - a.monthProfit);
      }

      // 1. CẬP NHẬT 4 THẺ SỨC KHỎE KPI TOÀN ĐỘI
      let periodLabel = 'Tháng Này';
      if (currentKpiPeriod === 'day') periodLabel = 'Hôm Nay (Ngày)';
      else if (currentKpiPeriod === 'week') periodLabel = 'Tuần Này';
      else if (currentKpiPeriod === 'matrix') periodLabel = 'Tổng Hợp 3 Chu Kỳ';

      let totalTarget = 0;
      let totalRealActual = 0;
      let totalActualNetProfit = 0;
      let totalRevenue = 0;
      let totalBookings = 0;
      let totalSuccessBookings = 0;
      let totalCancelBookings = 0;
      let totalStaffCommission = 0;
      let totalTaxCost = 0;
      let passedCount = 0;
      let needsRemindCount = 0;

      sortedList.forEach(s => {
        const mTarget = s.user.target || 10000000;
        let pProfit = s.monthProfit;
        let pRev = s.monthRevenue;
        let pCount = s.monthTotalCount;
        let pSuccess = s.monthSuccessCount;
        let pCancel = s.monthCancelCount;

        if (currentKpiPeriod === 'day') {
          pProfit = s.dayProfit;
          pRev = s.dayRevenue;
          pCount = s.dayTotalCount;
          pSuccess = s.daySuccessCount;
          pCancel = s.dayCancelCount;
        } else if (currentKpiPeriod === 'week') {
          pProfit = s.weekProfit;
          pRev = s.weekRevenue;
          pCount = s.weekTotalCount;
          pSuccess = s.weekSuccessCount;
          pCancel = s.weekCancelCount;
        }

        const kpi = calcBookingTravelKpi(pProfit, currentKpiPeriod === 'matrix' ? 'month' : currentKpiPeriod, mTarget);
        totalTarget += kpi.target;
        totalRealActual += kpi.realCommission;
        totalActualNetProfit += pProfit;
        totalRevenue += pRev;
        totalBookings += pCount;
        totalSuccessBookings += pSuccess;
        totalCancelBookings += pCancel;
        totalStaffCommission += kpi.staffCommission;
        totalTaxCost += kpi.taxCost;

        if (kpi.isPassed) passedCount++;
        else needsRemindCount++;
      });

      const teamProg = totalTarget > 0 ? Math.round((totalRealActual / totalTarget) * 100) : 0;
      const teamSuccessRate = totalBookings > 0 ? Math.round((totalSuccessBookings / totalBookings) * 100) : 100;
      const teamCancelRate = totalBookings > 0 ? ((totalCancelBookings / totalBookings) * 100).toFixed(1) : '0.0';

      const targetLabelEl = document.getElementById('kpi-target-label');
      const targetTotalEl = document.getElementById('kpi-target-total');
      const targetPerEl = document.getElementById('kpi-target-per-person');
      const grossLabelEl = document.getElementById('kpi-gross-label');
      const grossTotalEl = document.getElementById('kpi-gross-total');
      const grossSubEl = document.getElementById('kpi-gross-sub');
      const actualLabelEl = document.getElementById('kpi-actual-label');
      const actualTotalEl = document.getElementById('kpi-actual-total');
      const actualPercentEl = document.getElementById('kpi-actual-percent');
      const payoutTotalEl = document.getElementById('kpi-payout-total');
      const payoutSubEl = document.getElementById('kpi-payout-sub');
      const passedCountEl = document.getElementById('kpi-passed-count');
      const totalSalesCountEl = document.getElementById('kpi-total-sales-count');
      const tablePeriodTitle = document.getElementById('kpi-table-period-title');

      if (targetLabelEl) targetLabelEl.innerText = \`Chỉ Tiêu Bắt Buộc (\${periodLabel})\`;
      if (targetTotalEl) targetTotalEl.innerText = totalTarget.toLocaleString('vi-VN') + ' đ';
      if (targetPerEl) {
        const avgTarget = Math.round(totalTarget / Math.max(1, sortedList.length));
        targetPerEl.innerText = \`Bắt buộc mỗi sales: \${avgTarget.toLocaleString('vi-VN')} đ Lợi nhuận\`;
      }

      if (grossLabelEl) grossLabelEl.innerText = 'Lợi Nhuận Thực Tế Toàn Đội';
      if (grossTotalEl) grossTotalEl.innerText = '+' + totalActualNetProfit.toLocaleString('vi-VN') + ' đ';
      if (grossSubEl) grossSubEl.innerText = \`Sau trừ vốn & phát sinh • HH Thật (70%): \${totalRealActual.toLocaleString('vi-VN')} đ\`;

      if (actualLabelEl) actualLabelEl.innerText = 'Tỷ Lệ Booking Thành Công';
      if (actualTotalEl) actualTotalEl.innerText = \`\${teamSuccessRate}%\`;
      if (actualPercentEl) {
        actualPercentEl.innerText = \`Thành công: \${totalSuccessBookings} • Hủy: \${totalCancelBookings} (\${teamCancelRate}%)\`;
      }

      if (payoutTotalEl) {
        payoutTotalEl.innerText = totalStaffCommission > 0 ? ('+' + totalStaffCommission.toLocaleString('vi-VN') + ' đ') : '0 đ';
      }
      if (payoutSubEl) {
        payoutSubEl.innerText = \`Chia 40% phần vượt: \${passedCount}/\${sortedList.length} Sales đạt\`;
      }
      if (passedCountEl) passedCountEl.innerText = \`\${passedCount}\`;
      if (totalSalesCountEl) totalSalesCountEl.innerText = \`\${sortedList.length}\`;
      if (tablePeriodTitle) tablePeriodTitle.innerText = periodLabel;

      // 2. RENDER PODIUM TOP 3 LEADERBOARD
      const podiumContainer = document.getElementById('sales-podium');
      if (podiumContainer) {
        podiumContainer.innerHTML = '';
        const medalConfig = [
          { title: "QUÁN QUÂN LỢI NHUẬN", icon: "fa-crown", border: "border-amber-500/50 bg-amber-500/10", text: "text-amber-400", badge: "🥇 TOP 1" },
          { title: "Á QUÂN LỢI NHUẬN", icon: "fa-medal", border: "border-slate-400/50 bg-slate-400/10", text: "text-slate-300", badge: "🥈 TOP 2" },
          { title: "HẠNG BA THI ĐUA", icon: "fa-award", border: "border-amber-700/50 bg-amber-700/10", text: "text-amber-600", badge: "🥉 TOP 3" }
        ];

        for (let i = 0; i < Math.min(3, sortedList.length); i++) {
          const s = sortedList[i];
          const cfg = medalConfig[i];
          const mTarget = s.user.target || 10000000;
          let pRev = s.monthRevenue;
          let pProfit = s.monthProfit;
          let pTotal = s.monthTotalCount;
          let pSuccess = s.monthSuccessCount;
          let pCancel = s.monthCancelCount;

          if (currentKpiPeriod === 'day') {
            pRev = s.dayRevenue;
            pProfit = s.dayProfit;
            pTotal = s.dayTotalCount;
            pSuccess = s.daySuccessCount;
            pCancel = s.dayCancelCount;
          } else if (currentKpiPeriod === 'week') {
            pRev = s.weekRevenue;
            pProfit = s.weekProfit;
            pTotal = s.weekTotalCount;
            pSuccess = s.weekSuccessCount;
            pCancel = s.weekCancelCount;
          }

          const kpi = calcBookingTravelKpi(pProfit, currentKpiPeriod === 'matrix' ? 'month' : currentKpiPeriod, mTarget);
          const sRate = pTotal > 0 ? Math.round((pSuccess / pTotal) * 100) : 100;

          podiumContainer.innerHTML += \`
            <div class="rounded-2xl border \${cfg.border} p-5 relative overflow-hidden shadow-xl">
              <div class="flex items-center justify-between mb-3">
                <span class="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900 border \${cfg.text}">
                  \${cfg.badge}
                </span>
                <i class="fa-solid \${cfg.icon} text-xl \${cfg.text}"></i>
              </div>
              <h4 class="text-base font-extrabold text-white truncate">\${s.user.name || s.user.email.split('@')[0]}</h4>
              <p class="text-xs text-slate-400 font-mono">\${s.user.email} • \${s.user.phone || 'Chưa SĐT'}</p>
              
              <div class="mt-4 pt-3 border-t border-slate-800 space-y-1.5">
                <div class="flex justify-between text-xs">
                  <span class="text-slate-400">Doanh số bán:</span>
                  <span class="font-mono font-bold text-white">\${pRev.toLocaleString('vi-VN')} đ</span>
                </div>
                <div class="flex justify-between text-xs">
                  <span class="text-slate-400">Lợi nhuận thực tế:</span>
                  <span class="font-mono font-bold text-emerald-400">+\${pProfit.toLocaleString('vi-VN')} đ</span>
                </div>
                <div class="flex justify-between text-xs">
                  <span class="text-slate-400">Tỷ lệ chốt / Hủy:</span>
                  <span class="font-mono font-bold text-cyan-300">\${sRate}% (\${pSuccess}/\${pTotal}) • Hủy: \${pCancel}</span>
                </div>
                <div class="flex justify-between text-xs">
                  <span class="text-amber-300 font-bold">Thưởng dự kiến (40%):</span>
                  <span class="font-mono font-bold \${kpi.staffCommission > 0 ? 'text-amber-300 text-sm' : 'text-slate-500'}">
                    \${kpi.staffCommission > 0 ? '+' + kpi.staffCommission.toLocaleString('vi-VN') + ' đ' : '0 đ (Chưa vượt 10tr)'}
                  </span>
                </div>
                <div class="w-full bg-slate-950 h-2 rounded-full overflow-hidden mt-2 border border-slate-800">
                  <div class="\${kpi.progress >= 100 ? 'bg-emerald-400' : (kpi.progress >= 50 ? 'bg-amber-400' : 'bg-rose-500')} h-full rounded-full transition-all duration-500" style="width: \${Math.min(100, kpi.progress)}%"></div>
                </div>
                <div class="text-right text-[10px] \${kpi.progress >= 100 ? 'text-emerald-300' : 'text-amber-300'} font-mono">
                  \${kpi.progress >= 100 ? '🏆 Vượt chỉ tiêu: ' + kpi.progress + '%' : 'Đạt ' + kpi.progress + '% chỉ tiêu bắt buộc'} (\${periodLabel})
                </div>
              </div>
            </div>
          \`;
        }
      }

      // 3. RENDER TABLE (NORMAL HOẶC MATRIX)
      const thead = document.getElementById('sales-kpi-thead');
      const tbody = document.getElementById('sales-kpi-table-body');
      if (!tbody) return;

      tbody.innerHTML = '';

      if (currentKpiPeriod === 'matrix') {
        // CHẾ ĐỘ TỔNG HỢP 3 CHU KỲ (NGÀY - TUẦN - THÁNG)
        if (thead) {
          thead.innerHTML = \`
            <tr>
              <th class="py-3 px-3 text-center">Hạng</th>
              <th class="py-3 px-3.5">Nhân Viên Sales</th>
              <th class="py-3 px-3 text-center text-cyan-300">Tỷ Lệ Chốt</th>
              <th class="py-3 px-3 text-center text-rose-300">Đơn Hủy</th>
              <th class="py-3 px-3 text-right bg-amber-500/5 border-l border-amber-500/10">LN Thực Tế Ngày</th>
              <th class="py-3 px-3 text-center bg-amber-500/5 text-amber-300 font-bold">Tiến Độ Ngày</th>
              <th class="py-3 px-3 text-right bg-blue-500/5 border-l border-blue-500/10">LN Thực Tế Tuần</th>
              <th class="py-3 px-3 text-center bg-blue-500/5 text-blue-300 font-bold">Tiến Độ Tuần</th>
              <th class="py-3 px-3 text-right bg-emerald-500/5 border-l border-emerald-500/10">LN Thực Tế Tháng</th>
              <th class="py-3 px-3 text-center bg-emerald-500/5 text-emerald-300 font-bold">Tiến Độ Tháng</th>
              <th class="py-3 px-3.5 text-right bg-amber-500/10 border-l border-amber-500/20 text-amber-300 font-bold" title="Tổng tiền Sales thực nhận về túi (40% phần vượt chỉ tiêu bắt buộc 10tr)">Thưởng Dự Kiến</th>
              <th class="py-3 px-3.5 text-center">Đánh Giá</th>
              <th class="py-3 px-3 text-center">Tiếp Lửa</th>
            </tr>
          \`;
        }

        let teamDayReal = 0, teamDayTarget = 0;
        let teamWeekReal = 0, teamWeekTarget = 0;
        let teamMonthReal = 0, teamMonthTarget = 0;
        let teamMatrixStaffComm = 0;

        sortedList.forEach((s, idx) => {
          const mTarget = s.user.target || 10000000;
          const kpiDay = calcBookingTravelKpi(s.dayProfit, 'day', mTarget);
          const kpiWeek = calcBookingTravelKpi(s.weekProfit, 'week', mTarget);
          const kpiMonth = calcBookingTravelKpi(s.monthProfit, 'month', mTarget);

          teamDayReal += kpiDay.realCommission;
          teamDayTarget += kpiDay.target;
          teamWeekReal += kpiWeek.realCommission;
          teamWeekTarget += kpiWeek.target;
          teamMonthReal += kpiMonth.realCommission;
          teamMonthTarget += kpiMonth.target;
          teamMatrixStaffComm += kpiMonth.staffCommission;

          let rankBadge = '';
          if (idx === 0) rankBadge = '<span class="font-bold text-amber-400">🥇 #1</span>';
          else if (idx === 1) rankBadge = '<span class="font-bold text-slate-300">🥈 #2</span>';
          else if (idx === 2) rankBadge = '<span class="font-bold text-amber-600">🥉 #3</span>';
          else rankBadge = \`<span class="font-mono text-slate-500 font-bold">#\${idx + 1}</span>\`;

          let remindBadge = '';
          if (kpiMonth.isPassed) {
            remindBadge = '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">🏆 Vượt KPI!</span>';
          } else if (kpiMonth.progress >= 70) {
            remindBadge = '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">🔥 Sắp Về Đích</span>';
          } else if (kpiMonth.progress >= 30) {
            remindBadge = '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">🏃‍♂️ Bám Đuổi</span>';
          } else {
            remindBadge = '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/25 text-rose-300 border border-rose-500/50 animate-pulse">⚡ CỐ LÊN!</span>';
          }

          const sRate = s.monthTotalCount > 0 ? Math.round((s.monthSuccessCount / s.monthTotalCount) * 100) : 100;
          const roleDetail = s.supportCount > 0 ? \` (\${s.consultantCount} tư vấn, \${s.supportCount} hỗ trợ)\` : '';

          tbody.innerHTML += \`
            <tr class="hover:bg-slate-800/30 transition">
              <td class="py-3 px-3 text-center">\${rankBadge}</td>
              <td class="py-3 px-3.5">
                <span class="font-bold text-white block text-xs">\${s.user.name || '<span class="text-rose-400">Chưa điền họ tên</span>'}</span>
                <span class="text-[10px] text-slate-500 font-mono">\${s.user.email} • \${s.user.phone || 'Chưa SĐT'}\${roleDetail}</span>
              </td>
              <td class="py-3 px-3 text-center font-mono font-bold text-cyan-300 text-xs">
                \${sRate}% <span class="text-[9px] text-slate-400 font-normal">(\${s.monthSuccessCount}/\${s.monthTotalCount})</span>
              </td>
              <td class="py-3 px-3 text-center font-mono font-bold text-rose-400 text-xs">
                \${s.monthCancelCount}
              </td>
              <td class="py-3 px-3 text-right font-mono font-bold text-amber-300 text-xs bg-amber-500/5 border-l border-amber-500/10" title="Lợi nhuận thực tế: \${s.dayProfit.toLocaleString('vi-VN')} đ | HH thật (70%): \${kpiDay.realCommission.toLocaleString('vi-VN')} đ">
                +\${s.dayProfit.toLocaleString('vi-VN')} đ
              </td>
              <td class="py-3 px-3 text-center font-mono font-bold text-amber-400 text-xs bg-amber-500/5">
                <div class="flex items-center justify-center gap-1">
                  <span>\${kpiDay.progress}%</span>
                  <div class="w-8 bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800 hidden sm:block">
                    <div class="\${kpiDay.progress >= 100 ? 'bg-emerald-400' : (kpiDay.progress >= 50 ? 'bg-amber-400' : 'bg-rose-500')} h-full rounded-full" style="width: \${Math.min(100, kpiDay.progress)}%"></div>
                  </div>
                </div>
              </td>
              <td class="py-3 px-3 text-right font-mono font-bold text-blue-300 text-xs bg-blue-500/5 border-l border-blue-500/10" title="Lợi nhuận thực tế: \${s.weekProfit.toLocaleString('vi-VN')} đ | HH thật (70%): \${kpiWeek.realCommission.toLocaleString('vi-VN')} đ">
                +\${s.weekProfit.toLocaleString('vi-VN')} đ
              </td>
              <td class="py-3 px-3 text-center font-mono font-bold text-blue-400 text-xs bg-blue-500/5">
                <div class="flex items-center justify-center gap-1">
                  <span>\${kpiWeek.progress}%</span>
                  <div class="w-8 bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800 hidden sm:block">
                    <div class="\${kpiWeek.progress >= 100 ? 'bg-emerald-400' : (kpiWeek.progress >= 50 ? 'bg-blue-400' : 'bg-rose-500')} h-full rounded-full" style="width: \${Math.min(100, kpiWeek.progress)}%"></div>
                  </div>
                </div>
              </td>
              <td class="py-3 px-3 text-right font-mono font-bold text-emerald-300 text-xs bg-emerald-500/5 border-l border-emerald-500/10" title="Lợi nhuận thực tế: \${s.monthProfit.toLocaleString('vi-VN')} đ | HH thật (70%): \${kpiMonth.realCommission.toLocaleString('vi-VN')} đ">
                +\${s.monthProfit.toLocaleString('vi-VN')} đ
              </td>
              <td class="py-3 px-3 text-center font-mono font-bold text-emerald-400 text-xs bg-emerald-500/5">
                <div class="flex items-center justify-center gap-1">
                  <span>\${kpiMonth.progress}%</span>
                  <div class="w-8 bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800 hidden sm:block">
                    <div class="\${kpiMonth.progress >= 100 ? 'bg-emerald-400' : (kpiMonth.progress >= 50 ? 'bg-emerald-400' : 'bg-rose-500')} h-full rounded-full" style="width: \${Math.min(100, kpiMonth.progress)}%"></div>
                  </div>
                </div>
              </td>
              <td class="py-3 px-3.5 text-right font-mono font-bold text-xs bg-amber-500/10 border-l border-amber-500/20 num-tabular">
                \${kpiMonth.staffCommission > 0 
                  ? \`<span class="text-amber-300 font-bold text-sm">+\${kpiMonth.staffCommission.toLocaleString('vi-VN')} đ</span><span class="block text-[9px] text-emerald-400 font-medium">Vượt \${(kpiMonth.surplus).toLocaleString('vi-VN')} đ (40%)</span>\` 
                  : \`<span class="text-slate-500">0 đ</span><span class="block text-[9px] text-rose-400 font-normal">Thiếu \${kpiMonth.remaining.toLocaleString('vi-VN')} đ</span>\`}
              </td>
              <td class="py-3 px-3.5 text-center">\${remindBadge}</td>
              <td class="py-3 px-3 text-center">
                <button onclick="openKpiRemindModal('\${s.user.email}')" class="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-blue-600/20 hover:bg-blue-600 border border-blue-500/40 text-blue-300 hover:text-white transition flex items-center gap-1 mx-auto shadow-sm cursor-pointer">
                  <i class="fa-solid fa-paper-plane text-xs"></i> <span>Nhắc: Cố lên!</span>
                </button>
              </td>
            </tr>
          \`;
        });

        // DÒNG TỔNG CỘNG TOÀN ĐỘI (CHẾ ĐỘ TỔNG HỢP MATRIX)
        const teamDayProg = teamDayTarget > 0 ? Math.round((teamDayReal / teamDayTarget) * 100) : 0;
        const teamWeekProg = teamWeekTarget > 0 ? Math.round((teamWeekReal / teamWeekTarget) * 100) : 0;
        const teamMonthProg = teamMonthTarget > 0 ? Math.round((teamMonthReal / teamMonthTarget) * 100) : 0;

        tbody.innerHTML += \`
          <tr class="bg-slate-950/95 border-t-2 border-amber-500/50 font-extrabold text-white shadow-lg sticky bottom-0">
            <td class="py-3.5 px-3 text-center text-amber-400 font-black">
              <i class="fa-solid fa-users text-sm"></i>
            </td>
            <td class="py-3.5 px-3.5">
              <div class="font-extrabold text-amber-300 text-xs tracking-wider uppercase flex items-center gap-1.5">
                <span>TỔNG CỘNG TOÀN ĐỘI</span>
                <span class="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-200">\${sortedList.length} Sales</span>
              </div>
              <div class="text-[10px] text-slate-400 font-normal">Tổng hợp 3 chu kỳ Ngày - Tuần - Tháng</div>
            </td>
            <td class="py-3.5 px-3 text-center font-mono font-bold text-cyan-300 text-xs">
              \${teamSuccessRate}%
            </td>
            <td class="py-3.5 px-3 text-center font-mono font-bold text-rose-400 text-xs">
              \${totalCancelBookings}
            </td>
            <td class="py-3.5 px-3 text-right font-mono font-bold text-amber-300 text-xs bg-amber-500/10 border-l border-amber-500/20">
              +\${sortedList.reduce((acc, x) => acc + x.dayProfit, 0).toLocaleString('vi-VN')} đ
            </td>
            <td class="py-3.5 px-3 text-center font-mono font-bold text-amber-400 text-xs bg-amber-500/10">
              \${teamDayProg}%
            </td>
            <td class="py-3.5 px-3 text-right font-mono font-bold text-blue-300 text-xs bg-blue-500/10 border-l border-blue-500/20">
              +\${sortedList.reduce((acc, x) => acc + x.weekProfit, 0).toLocaleString('vi-VN')} đ
            </td>
            <td class="py-3.5 px-3 text-center font-mono font-bold text-blue-400 text-xs bg-blue-500/10">
              \${teamWeekProg}%
            </td>
            <td class="py-3.5 px-3 text-right font-mono font-bold text-emerald-300 text-xs bg-emerald-500/10 border-l border-emerald-500/20">
              +\${sortedList.reduce((acc, x) => acc + x.monthProfit, 0).toLocaleString('vi-VN')} đ
            </td>
            <td class="py-3.5 px-3 text-center font-mono font-bold text-emerald-400 text-xs bg-emerald-500/10">
              \${teamMonthProg}%
            </td>
            <td class="py-3.5 px-3.5 text-right font-mono font-bold text-xs num-tabular bg-amber-500/20 border-l border-amber-500/40">
              \${teamMatrixStaffComm > 0 
                ? \`<span class="text-amber-300 font-black text-sm">+\${teamMatrixStaffComm.toLocaleString('vi-VN')} đ</span><span class="block text-[9px] text-emerald-400 font-medium">Toàn đội thực nhận</span>\` 
                : \`<span class="text-slate-400 font-bold">0 đ</span><span class="block text-[9px] text-slate-500 font-normal">Chưa có sales vượt 10tr</span>\`}
            </td>
            <td class="py-3.5 px-3.5 text-center">
              <span class="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider \${teamMonthProg >= 100 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : (teamMonthProg >= 50 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-rose-500/25 text-rose-300 border border-rose-500/50')}">
                \${teamMonthProg >= 100 ? '🏆 Đạt Chỉ Tiêu' : (teamMonthProg >= 50 ? '🏃‍♂️ Đang Tăng Tốc' : '⚡ Toàn Đội Cố Lên!')}
              </span>
            </td>
            <td class="py-3.5 px-3 text-center">
              <button onclick="openKpiBroadcastModal()" class="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-rose-600 hover:bg-rose-500 text-white transition flex items-center gap-1 mx-auto shadow-md cursor-pointer">
                <i class="fa-solid fa-bullhorn text-xs"></i> <span>Tiếp Lửa</span>
              </button>
            </td>
          </tr>
        \`;

      } else {
        // CHẾ ĐỘ CHU KỲ ĐƠN (NGÀY / TUẦN / THÁNG)
        if (thead) {
          thead.innerHTML = \`
            <tr>
              <th class="py-3 px-3 text-center">Hạng</th>
              <th class="py-3 px-3.5">Nhân Viên Sales</th>
              <th class="py-3 px-3 text-center">Số Booking</th>
              <th class="py-3 px-3 text-center text-cyan-300 font-bold">Tỷ Lệ Chốt</th>
              <th class="py-3 px-3 text-center text-rose-300 font-bold">Đơn Hủy</th>
              <th class="py-3 px-3.5 text-right">Doanh Số Bán</th>
              <th class="py-3 px-3.5 text-right text-emerald-400 font-bold">Lợi Nhuận Thực Tế</th>
              <th class="py-3 px-3.5 text-right text-cyan-300 font-bold bg-cyan-950/20 border-l border-cyan-800/40">HH Thật (-30% Thuế)</th>
              <th class="py-3 px-3.5 text-right">Chỉ Tiêu (\${periodLabel})</th>
              <th class="py-3 px-3.5 text-center text-amber-300 font-bold">Tiến Độ KPI</th>
              <th class="py-3 px-3.5 text-right text-amber-300 font-bold bg-amber-500/10 border-l border-amber-500/20" title="Tổng tiền Sales thực nhận về túi (40% phần vượt chỉ tiêu bắt buộc 10tr)">Thưởng Dự Kiến</th>
              <th class="py-3 px-3.5 text-center">Đánh Giá</th>
              <th class="py-3 px-3.5 text-center">Tiếp Lửa</th>
            </tr>
          \`;
        }

        sortedList.forEach((s, idx) => {
          const mTarget = s.user.target || 10000000;
          let pRev = s.monthRevenue;
          let pProfit = s.monthProfit;
          let pCount = s.monthTotalCount;
          let pSuccess = s.monthSuccessCount;
          let pCancel = s.monthCancelCount;

          if (currentKpiPeriod === 'day') {
            pRev = s.dayRevenue;
            pProfit = s.dayProfit;
            pCount = s.dayTotalCount;
            pSuccess = s.daySuccessCount;
            pCancel = s.dayCancelCount;
          } else if (currentKpiPeriod === 'week') {
            pRev = s.weekRevenue;
            pProfit = s.weekProfit;
            pCount = s.weekTotalCount;
            pSuccess = s.weekSuccessCount;
            pCancel = s.weekCancelCount;
          }

          const kpi = calcBookingTravelKpi(pProfit, currentKpiPeriod, mTarget);
          const sRate = pCount > 0 ? Math.round((pSuccess / pCount) * 100) : 100;

          let rankBadge = '';
          if (idx === 0) rankBadge = '<span class="font-bold text-amber-400">🥇 #1</span>';
          else if (idx === 1) rankBadge = '<span class="font-bold text-slate-300">🥈 #2</span>';
          else if (idx === 2) rankBadge = '<span class="font-bold text-amber-600">🥉 #3</span>';
          else rankBadge = \`<span class="font-mono text-slate-500 font-bold">#\${idx + 1}</span>\`;

          let gradeBadge = '';
          if (kpi.isPassed) {
            gradeBadge = '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">🏆 Vượt KPI! 🎉</span>';
          } else if (kpi.progress >= 70) {
            gradeBadge = '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">🔥 Sắp Về Đích</span>';
          } else if (kpi.progress >= 30) {
            gradeBadge = '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">🏃‍♂️ Bám Đuổi</span>';
          } else {
            gradeBadge = '<span class="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/25 text-rose-300 border border-rose-500/50 animate-pulse">⚡ CỐ LÊN!</span>';
          }

          const roleDetail = s.supportCount > 0 ? \` (\${s.consultantCount} tư vấn, \${s.supportCount} hỗ trợ)\` : '';

          tbody.innerHTML += \`
            <tr class="hover:bg-slate-800/30 transition">
              <td class="py-3 px-3 text-center">\${rankBadge}</td>
              <td class="py-3 px-3.5">
                <span class="font-bold text-white block text-xs">\${s.user.name || '<span class="text-rose-400">Chưa điền họ tên</span>'}</span>
                <span class="text-[10px] text-slate-500 font-mono">\${s.user.email} • \${s.user.phone || 'Chưa SĐT'}\${roleDetail}</span>
              </td>
              <td class="py-3 px-3 text-center font-mono font-bold text-white text-xs">\${pCount}</td>
              <td class="py-3 px-3 text-center font-mono font-bold text-cyan-300 text-xs">
                \${sRate}% <span class="text-[9px] text-slate-400 font-normal">(\${pSuccess}/\${pCount})</span>
              </td>
              <td class="py-3 px-3 text-center font-mono font-bold text-rose-400 text-xs">\${pCancel}</td>
              <td class="py-3 px-3.5 text-right font-mono font-bold text-white text-xs num-tabular">\${pRev.toLocaleString('vi-VN')} đ</td>
              <td class="py-3 px-3.5 text-right font-mono font-bold text-emerald-400 text-xs num-tabular">+\${pProfit.toLocaleString('vi-VN')} đ</td>
              <td class="py-3 px-3.5 text-right font-mono font-bold text-cyan-300 text-xs num-tabular bg-cyan-950/20 border-l border-cyan-800/40" title="Lợi nhuận thực tế: \${pProfit.toLocaleString('vi-VN')} đ - 30% Thuế (\${kpi.taxCost.toLocaleString('vi-VN')} đ)">
                \${kpi.realCommission.toLocaleString('vi-VN')} đ
              </td>
              <td class="py-3 px-3.5 text-right font-mono text-slate-300 text-xs num-tabular font-bold">\${kpi.target.toLocaleString('vi-VN')} đ</td>
              <td class="py-3 px-3.5 text-center">
                <div class="flex items-center justify-center gap-1.5">
                  <span class="font-mono font-bold \${kpi.progress >= 100 ? 'text-emerald-400' : (kpi.progress >= 50 ? 'text-amber-400' : 'text-rose-400')} text-xs">\${kpi.progress}%</span>
                  <div class="w-12 bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800 hidden sm:block">
                    <div class="\${kpi.progress >= 100 ? 'bg-emerald-400' : (kpi.progress >= 50 ? 'bg-amber-400' : 'bg-rose-500')} h-full rounded-full" style="width: \${Math.min(100, kpi.progress)}%"></div>
                  </div>
                </div>
              </td>
              <td class="py-3 px-3.5 text-right font-mono font-bold text-xs num-tabular bg-amber-500/10 border-l border-amber-500/20">
                \${kpi.staffCommission > 0 
                  ? \`<span class="text-amber-300 font-bold text-sm">+\${kpi.staffCommission.toLocaleString('vi-VN')} đ</span><span class="block text-[9px] text-emerald-400 font-medium">Vượt \${(kpi.surplus).toLocaleString('vi-VN')} đ (40%)</span>\` 
                  : \`<span class="text-slate-500">0 đ</span><span class="block text-[9px] text-rose-400 font-normal">Thiếu \${kpi.remaining.toLocaleString('vi-VN')} đ</span>\`}
              </td>
              <td class="py-3 px-3.5 text-center">\${gradeBadge}</td>
              <td class="py-3 px-3.5 text-center">
                <button onclick="openKpiRemindModal('\${s.user.email}')" class="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-blue-600/20 hover:bg-blue-600 border border-blue-500/40 text-blue-300 hover:text-white transition flex items-center gap-1 mx-auto shadow-sm cursor-pointer">
                  <i class="fa-solid fa-paper-plane text-xs"></i> <span>Nhắc: Cố lên!</span>
                </button>
              </td>
            </tr>
          \`;
        });

        // DÒNG TỔNG CỘNG TOÀN ĐỘI (CHẾ ĐỘ CHU KỲ ĐƠN: NGÀY / TUẦN / THÁNG)
        tbody.innerHTML += \`
          <tr class="bg-slate-950/95 border-t-2 border-amber-500/50 font-extrabold text-white shadow-lg sticky bottom-0">
            <td class="py-3.5 px-3 text-center text-amber-400 font-black">
              <i class="fa-solid fa-users text-sm"></i>
            </td>
            <td class="py-3.5 px-3.5">
              <div class="font-extrabold text-amber-300 text-xs tracking-wider uppercase flex items-center gap-1.5">
                <span>TỔNG CỘNG TOÀN ĐỘI</span>
                <span class="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-200">\${sortedList.length} Sales</span>
              </div>
              <div class="text-[10px] text-slate-400 font-normal">Hợp nhất kết quả kinh doanh (\${periodLabel})</div>
            </td>
            <td class="py-3.5 px-3 text-center font-mono text-cyan-300 text-xs font-bold">\${totalBookings} đơn</td>
            <td class="py-3.5 px-3 text-center font-mono text-cyan-300 text-xs font-bold">\${teamSuccessRate}%</td>
            <td class="py-3.5 px-3 text-center font-mono text-rose-400 text-xs font-bold">\${totalCancelBookings}</td>
            <td class="py-3.5 px-3.5 text-right font-mono text-white text-xs num-tabular font-bold">\${totalRevenue.toLocaleString('vi-VN')} đ</td>
            <td class="py-3.5 px-3.5 text-right font-mono text-emerald-400 text-xs num-tabular font-bold">+\${totalActualNetProfit.toLocaleString('vi-VN')} đ</td>
            <td class="py-3.5 px-3.5 text-right font-mono text-cyan-300 text-xs num-tabular font-bold bg-cyan-950/40 border-l border-cyan-800/60" title="Tổng hoa hồng thật toàn đội sau khi trừ 30% chi phí thuế">
              \${totalRealActual.toLocaleString('vi-VN')} đ
            </td>
            <td class="py-3.5 px-3.5 text-right font-mono text-slate-300 text-xs num-tabular font-bold">\${totalTarget.toLocaleString('vi-VN')} đ</td>
            <td class="py-3.5 px-3.5 text-center font-mono text-xs">
              <div class="flex items-center justify-center gap-1.5">
                <span class="font-bold \${teamProg >= 100 ? 'text-emerald-400' : (teamProg >= 50 ? 'text-amber-400' : 'text-rose-400')}">\${teamProg}%</span>
                <div class="w-12 bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-700 hidden sm:block">
                  <div class="\${teamProg >= 100 ? 'bg-emerald-400' : (teamProg >= 50 ? 'bg-amber-400' : 'bg-rose-500')} h-full rounded-full" style="width: \${Math.min(100, teamProg)}%"></div>
                </div>
              </div>
            </td>
            <td class="py-3.5 px-3.5 text-right font-mono font-bold text-xs num-tabular bg-amber-500/20 border-l border-amber-500/40">
              \${totalStaffCommission > 0 
                ? \`<span class="text-amber-300 font-black text-sm">+\${totalStaffCommission.toLocaleString('vi-VN')} đ</span><span class="block text-[9px] text-emerald-400 font-medium">\${passedCount} Sales được chia 40%</span>\` 
                : \`<span class="text-slate-400 font-bold">0 đ</span><span class="block text-[9px] text-slate-500 font-normal">Chưa có sales vượt 10tr</span>\`}
            </td>
            <td class="py-3.5 px-3.5 text-center">
              <span class="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider \${teamProg >= 100 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : (teamProg >= 50 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-rose-500/25 text-rose-300 border border-rose-500/50')}">
                \${teamProg >= 100 ? '🏆 Đạt Chỉ Tiêu' : (teamProg >= 50 ? '🏃‍♂️ Đang Tăng Tốc' : '⚡ Toàn Đội Cố Lên!')}
              </span>
            </td>
            <td class="py-3.5 px-3.5 text-center">
              <button onclick="openKpiBroadcastModal()" class="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-rose-600 hover:bg-rose-500 text-white transition flex items-center gap-1 mx-auto shadow-md cursor-pointer">
                <i class="fa-solid fa-bullhorn text-xs"></i> <span>Tiếp Lửa Cả Đội</span>
              </button>
            </td>
          </tr>
        \`;
      }
    }`;

  content = content.replace(fullTargetBlock, replacementKpiEngine);
  console.log('✅ Replaced entire KPI Engine with anti-double-counting actual profit engine successfully.');
} else {
  console.error('❌ Could not locate kpiEngineStartMarker or kpiEngineEndMarker', { startIdx, endIdx });
}

// 10. UPDATE openKpiRemindModal to use getStaffProfitForBooking
const targetRemindLoop = `      let pRev = 0;
      let pProfit = 0;
      bookings.forEach(b => {
        if ((b.saleEmail || '').toLowerCase() === activeRemindUser.email.toLowerCase()) {
          if (isBookingInPeriod(b, period)) {
            const r = parseFloat(b.giaBan) || 0;
            const c = parseFloat(b.giaVon) || 0;
            pRev += r;
            pProfit += (r - c);
          }
        }
      });`;

const replacementRemindLoop = `      let pRev = 0;
      let pProfit = 0;
      bookings.forEach(b => {
        if (isBookingInPeriod(b, period)) {
          const sp = getStaffProfitForBooking(b, activeRemindUser.email);
          pRev += sp.rev;
          pProfit += sp.profit;
        }
      });`;

if (content.includes(targetRemindLoop)) {
  content = content.replace(targetRemindLoop, replacementRemindLoop);
  console.log('✅ Updated openKpiRemindModal loop with getStaffProfitForBooking.');
} else {
  console.error('❌ Could not find targetRemindLoop');
}

// 11. UPDATE openKpiBroadcastModal to use getStaffProfitForBooking
const targetBroadcastLoop = `        let pProfit = 0;
        bookings.forEach(b => {
          if ((b.saleEmail || '').toLowerCase() === u.email.toLowerCase()) {
            if (isBookingInPeriod(b, curPeriod)) {
              pProfit += (parseFloat(b.giaBan) || 0) - (parseFloat(b.giaVon) || 0);
            }
          }
        });`;

const replacementBroadcastLoop = `        let pProfit = 0;
        bookings.forEach(b => {
          if (isBookingInPeriod(b, curPeriod)) {
            const sp = getStaffProfitForBooking(b, u.email);
            pProfit += sp.profit;
          }
        });`;

if (content.includes(targetBroadcastLoop)) {
  content = content.replace(targetBroadcastLoop, replacementBroadcastLoop);
  console.log('✅ Updated openKpiBroadcastModal loop with getStaffProfitForBooking.');
} else {
  console.error('❌ Could not find targetBroadcastLoop');
}

// 12. UPDATE renderBusinessReport to include chiPhiPhatSinh in net profit
const targetBizReportProfit = `        const r = parseFloat(b.giaBan) || 0;
        const c = parseFloat(b.giaVon) || 0;
        const p = r - c;`;

const replacementBizReportProfit = `        const r = parseFloat(b.giaBan) || 0;
        const c = parseFloat(b.giaVon) || 0;
        const extra = parseFloat(b.chiPhiPhatSinh) || 0;
        const p = Math.max(0, r - c - extra);`;

if (content.includes(targetBizReportProfit)) {
  content = content.replace(targetBizReportProfit, replacementBizReportProfit);
  console.log('✅ Updated renderBusinessReport profit formula with chiPhiPhatSinh.');
} else {
  console.error('❌ Could not find targetBizReportProfit');
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('✨ CRM_Booking.html optimization successfully written! New size:', content.length);

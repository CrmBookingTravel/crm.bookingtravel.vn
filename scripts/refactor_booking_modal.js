const fs = require('fs');
const path = require('path');

const crmPath = path.join(__dirname, '..', 'crm.html');
let html = fs.readFileSync(crmPath, 'utf8');

const pModalStart = html.indexOf('id="booking-modal"');
if (pModalStart === -1) {
  console.error('Could not find id="booking-modal" in crm.html');
  process.exit(1);
}

const divContainerStart = html.lastIndexOf('<div', pModalStart);
// Find end of booking modal: </form>\n    </div>\n  </div>
const pFormEnd = html.indexOf('</form>', pModalStart);
const modalEnd = html.indexOf('</div>', html.indexOf('</div>', pFormEnd + 7) + 6) + 6;

console.log('Replacing booking-modal from', divContainerStart, 'to', modalEnd);

const newBookingModalHtml = `<!-- ========================================================================= -->
  <!-- MODAL: ĐIỀU HÀNH & HẠCH TOÁN BOOKING (CHUẨN vTOUR 4.5 - TỐI GIẢN, RỘNG RÃI) -->
  <!-- ========================================================================= -->
  <div id="booking-modal" class="fixed inset-0 z-50 overflow-hidden hidden flex items-center justify-center p-2 sm:p-4 lg:p-6 bg-black/85 backdrop-blur-sm">
    <div class="absolute inset-0 bg-black/75 transition-opacity" onclick="closeModalTaoDon()"></div>
    
    <div id="booking-modal-container" class="relative bg-[#07162f] border border-blue-900/60 rounded-2xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl z-10 overflow-hidden transition-all duration-300">
      
      <!-- Modal Header (Tối Giản, Đen - Xanh - Vàng) -->
      <div class="h-16 px-6 border-b border-slate-800 flex items-center justify-between bg-[#0a1931] shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-blue-600/20 text-sky-400 border border-blue-500/30 flex items-center justify-center text-lg font-bold">
            <i class="fa-solid fa-file-invoice-dollar"></i>
          </div>
          <div>
            <h3 id="modal-title" class="text-base sm:text-lg font-extrabold text-white uppercase tracking-wide flex items-center gap-2">
              <span>ĐIỀU HÀNH & HẠCH TOÁN BOOKING</span>
            </h3>
            <p class="text-xs text-slate-400">Công ty TNHH Booking Travel &bull; Chuẩn vTour 4.5</p>
          </div>
        </div>
        
        <div class="flex items-center gap-2">
          <button type="button" onclick="toggleBookingFullscreen()" id="btn-fullscreen-booking" class="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 text-xs font-semibold transition cursor-pointer">
            <i class="fa-solid fa-expand text-xs"></i>
            <span class="hidden sm:inline" id="btn-fullscreen-text">Phóng To</span>
          </button>
          <button type="button" onclick="closeModalTaoDon()" class="w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center transition cursor-pointer">
            <i class="fa-solid fa-xmark text-base"></i>
          </button>
        </div>
      </div>

      <!-- Modal Body (Form cuộn thoải mái, font to rõ ràng, không hoa mắt) -->
      <form id="booking-form" onsubmit="handleSaveBooking(event)" class="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
        <input type="hidden" id="edit-id" value="">
        <input type="hidden" id="ipt-room-lookup" value="">

        <!-- ========================================================================= -->
        <!-- KHỐI 1: CHỌN KHÁCH SẠN & HẠNG PHÒNG NHA TRANG (3-4-5 SAO) -->
        <!-- ========================================================================= -->
        <div class="p-5 rounded-2xl bg-[#0c1e3d] border border-blue-900/50 shadow-md space-y-4">
          
          <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
            <div class="flex items-center gap-2.5">
              <span class="text-amber-400 text-base"><i class="fa-solid fa-hotel"></i></span>
              <h4 class="text-sm sm:text-base font-bold text-white uppercase tracking-wide">
                CHỌN KHÁCH SẠN & HẠNG PHÒNG NHA TRANG (3⭐ - 4⭐ - 5⭐)
              </h4>
            </div>
            
            <!-- Tab lọc sao nhanh: Tối giản, không rườm rà -->
            <div class="flex items-center gap-1.5 bg-[#07162f] p-1 rounded-xl border border-slate-800 text-xs">
              <button type="button" onclick="filterHotelsByStar('all')" id="btn-star-all" class="px-3 py-1 rounded-lg font-bold bg-amber-500 text-slate-950 transition cursor-pointer">Tất Cả</button>
              <button type="button" onclick="filterHotelsByStar('5')" id="btn-star-5" class="px-3 py-1 rounded-lg font-semibold text-slate-300 hover:text-white transition cursor-pointer">⭐⭐⭐⭐⭐ 5 Sao</button>
              <button type="button" onclick="filterHotelsByStar('4')" id="btn-star-4" class="px-3 py-1 rounded-lg font-semibold text-slate-300 hover:text-white transition cursor-pointer">⭐⭐⭐⭐ 4 Sao</button>
              <button type="button" onclick="filterHotelsByStar('3')" id="btn-star-3" class="px-3 py-1 rounded-lg font-semibold text-slate-300 hover:text-white transition cursor-pointer">⭐⭐⭐ 3 Sao</button>
            </div>
          </div>

          <!-- 2 Dropdowns Lớn, Font Chữ To Rõ, Thoáng Mắt -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-bold text-slate-200 mb-1.5 flex items-center justify-between">
                <span>1. Chọn Khách Sạn / Resort:</span>
                <span id="selected-hotel-star-badge" class="text-xs text-amber-400 font-bold"></span>
              </label>
              <select id="sel-booking-hotel" onchange="handleBookingHotelChange(this.value)" class="w-full bg-[#07162f] border border-slate-700 focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl px-4 py-3 text-sm sm:text-base text-white font-semibold focus:outline-none cursor-pointer">
                <!-- Populated dynamically -->
              </select>
            </div>

            <div>
              <label class="block text-sm font-bold text-slate-200 mb-1.5 flex items-center justify-between">
                <span>2. Chọn Hạng Phòng (Tự Điền Đơn Hàng):</span>
                <span class="text-xs text-emerald-400 font-mono font-bold" id="room-price-preview"></span>
              </label>
              <select id="sel-booking-room" onchange="handleBookingRoomChange(this.value)" class="w-full bg-[#07162f] border border-slate-700 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 rounded-xl px-4 py-3 text-sm sm:text-base text-white font-semibold focus:outline-none cursor-pointer">
                <!-- Populated dynamically -->
              </select>
            </div>
          </div>

          <!-- Dòng thông báo tự điền thanh lịch, nhẹ nhàng, không hoa mắt -->
          <div id="room-autofill-alert" class="hidden p-3 rounded-xl bg-blue-950/40 border border-blue-500/30 text-xs sm:text-sm text-sky-200 flex items-center justify-between gap-2">
            <span id="room-autofill-text"></span>
            <button type="button" onclick="document.getElementById('room-autofill-alert').classList.add('hidden')" class="text-slate-400 hover:text-white cursor-pointer"><i class="fa-solid fa-xmark text-sm"></i></button>
          </div>

        </div>

        <!-- ========================================================================= -->
        <!-- KHỐI 2: THÔNG TIN ĐIỀU HÀNH & KHÁCH HÀNG -->
        <!-- ========================================================================= -->
        <div class="p-5 sm:p-6 rounded-2xl bg-[#0c1e3d] border border-blue-900/50 shadow-md space-y-5">
          <div class="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h4 class="text-sm sm:text-base font-bold text-sky-400 uppercase tracking-wide flex items-center gap-2">
              <i class="fa-solid fa-address-card text-sky-400"></i>
              <span>1. Thông Tin Điều Hành & Hồ Sơ Khách Hàng</span>
            </h4>
          </div>

          <!-- Dòng 1: Mã Đơn, Ngày Tạo, Sale, Phân Loại, Trạng Thái -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-bold text-slate-200 mb-1.5">Mã Booking (*)</label>
              <input type="text" id="ipt-code" required class="w-full bg-[#07162f] border border-slate-700 rounded-xl px-4 py-2.5 text-sm sm:text-base font-mono font-bold text-sky-300 focus:outline-none focus:border-sky-400 uppercase">
            </div>

            <div>
              <label class="block text-sm font-bold text-slate-200 mb-1.5">Ngày Tạo Đơn (*)</label>
              <input type="datetime-local" id="ipt-created-date" required class="w-full bg-[#07162f] border border-slate-700 rounded-xl px-4 py-2.5 text-sm font-mono text-emerald-300 focus:outline-none focus:border-emerald-400">
            </div>

            <div>
              <label class="block text-sm font-bold text-slate-200 mb-1.5">Sale Phụ Trách (*)</label>
              <select id="ipt-sale" class="w-full bg-[#07162f] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-sky-400">
                <!-- Populated dynamically -->
              </select>
            </div>

            <div>
              <label class="block text-sm font-bold text-slate-200 mb-1.5">Nhóm Dịch Vụ (*)</label>
              <select id="ipt-service-type" class="w-full bg-[#07162f] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-sky-400">
                <option value="hotel">🏨 Khách Sạn / Resort Lẻ</option>
                <option value="combo">✈️ Combo Du Lịch (Phòng + Vé/Xe)</option>
                <option value="tour">🚩 Tour Trọn Gói / Ghép Đoàn</option>
                <option value="ticket">🎟️ Vé Vui Chơi (VinWonders/Sun World)</option>
              </select>
            </div>
          </div>

          <!-- Dòng 2: Trạng Thái Điều Hành & Lịch Trình Check-in / Check-out -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-bold text-slate-200 mb-1.5">Trạng Thái Điều Hành (*)</label>
              <select id="ipt-tour-status" class="w-full bg-[#07162f] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-amber-300 font-bold focus:outline-none focus:border-amber-400">
                <option value="moi_tao">🔵 Mới Tạo / Chờ Cọc</option>
                <option value="da_coc">🟡 Khách Đã Đặt Cọc</option>
                <option value="da_xac_nhan">🟢 Đã Chốt Code Phòng Với Nhà Cung Cấp</option>
                <option value="dang_di">🟣 Đang Check-in / Đi Tour</option>
                <option value="hoan_tat">⚪ Đã Check-out & Quyết Toán</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-bold text-slate-200 mb-1.5">Ngày Check-In (*)</label>
              <input type="date" id="ipt-checkin" onchange="document.getElementById('ipt-checkout').min = this.value" required class="w-full bg-[#07162f] border border-slate-700 rounded-xl px-4 py-2.5 text-sm sm:text-base text-white focus:outline-none focus:border-sky-400 font-mono">
            </div>

            <div>
              <label class="block text-sm font-bold text-slate-200 mb-1.5">Ngày Check-Out (*)</label>
              <input type="date" id="ipt-checkout" required class="w-full bg-[#07162f] border border-slate-700 rounded-xl px-4 py-2.5 text-sm sm:text-base text-white focus:outline-none focus:border-sky-400 font-mono">
            </div>
          </div>

          <!-- Dòng 3: Khách Hàng (Họ Tên, SĐT, Email, CCCD) -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-bold text-slate-200 mb-1.5">Họ & Tên Khách Hàng (*)</label>
              <input type="text" id="ipt-customer" required placeholder="VD: Nguyễn Văn Hùng" class="w-full bg-[#07162f] border border-slate-700 rounded-xl px-4 py-2.5 text-sm sm:text-base text-white font-bold focus:outline-none focus:border-sky-400">
            </div>

            <div>
              <label class="block text-sm font-bold text-slate-200 mb-1.5 flex items-center justify-between">
                <span>Số Điện Thoại (*)</span>
                <span id="phone-feedback" class="text-xs font-mono"></span>
              </label>
              <input type="tel" id="ipt-phone" required maxlength="11" oninput="handlePhoneInput(this)" placeholder="VD: 0912345678" class="w-full bg-[#07162f] border border-slate-700 rounded-xl px-4 py-2.5 text-sm sm:text-base text-amber-300 font-mono font-bold focus:outline-none focus:border-amber-400">
            </div>

            <div>
              <label class="block text-sm font-bold text-slate-200 mb-1.5">Email Khách Hàng</label>
              <input type="email" id="ipt-customer-email" placeholder="VD: khachhang@gmail.com" class="w-full bg-[#07162f] border border-slate-700 rounded-xl px-4 py-2.5 text-sm sm:text-base text-white focus:outline-none focus:border-sky-400">
            </div>

            <div>
              <label class="block text-sm font-bold text-slate-200 mb-1.5">Số CCCD / Hộ Chiếu</label>
              <input type="text" id="ipt-customer-cccd" placeholder="VD: 001089012345" class="w-full bg-[#07162f] border border-slate-700 rounded-xl px-4 py-2.5 text-sm sm:text-base text-white font-mono focus:outline-none focus:border-sky-400">
            </div>
          </div>

          <!-- Dòng 4: Tên Dịch Vụ / Lộ Trình Chi Tiết & Ghi Chú (Rộng rãi, Font to) -->
          <div>
            <label class="block text-sm font-bold text-amber-300 mb-1.5">
              Tên Dịch Vụ / Lộ Trình Chi Tiết & Ghi Chú Yêu Cầu (*)
            </label>
            <textarea id="ipt-service" rows="3" required placeholder="Nhập tên khách sạn, hạng phòng, tiện ích, số lượng khách..." class="w-full bg-[#07162f] border border-slate-700 rounded-xl p-4 text-sm sm:text-base text-white font-medium focus:outline-none focus:border-amber-400 leading-relaxed"></textarea>
          </div>

          <!-- Dòng 5: Nhà Cung Cấp -->
          <div>
            <label class="block text-sm font-bold text-slate-200 mb-1.5">
              Nhà Cung Cấp / Khách Sạn / Resort (*)
            </label>
            <input type="text" id="ipt-supplier" required placeholder="VD: Sheraton Nha Trang Hotel & Spa" class="w-full bg-[#07162f] border border-slate-700 rounded-xl px-4 py-2.5 text-sm sm:text-base text-white font-bold focus:outline-none focus:border-sky-400">
          </div>

        </div>

        <!-- ========================================================================= -->
        <!-- KHỐI 3: TÀI CHÍNH BÁN HÀNG & MUA HÀNG (DOANH THU, GIÁ VỐN, LÃI GỘP) -->
        <!-- ========================================================================= -->
        <div class="p-5 sm:p-6 rounded-2xl bg-[#0c1e3d] border border-amber-900/40 shadow-md space-y-5">
          <div class="border-b border-slate-800 pb-3 flex items-center justify-between">
            <h4 class="text-sm sm:text-base font-bold text-amber-400 uppercase tracking-wide flex items-center gap-2">
              <i class="fa-solid fa-coins text-amber-400"></i>
              <span>2. Hạch Toán Doanh Thu, Giá Vốn & Lợi Nhuận Gộp</span>
            </h4>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
            <!-- Cột 1: Thu Khách (Giá Bán) -->
            <div class="p-4 sm:p-5 bg-[#07162f] border border-slate-800 rounded-xl space-y-3.5">
              <div class="flex items-center justify-between border-b border-slate-800 pb-2">
                <span class="text-sm font-bold text-sky-400 uppercase">
                  Bán Hàng (Doanh Thu Khách)
                </span>
                <span class="text-xs text-slate-400 font-bold">GIÁ BÁN THỰC TẾ</span>
              </div>

              <div>
                <label class="block text-sm font-bold text-slate-200 mb-1.5 flex items-center justify-between">
                  <span>Giá Bán Báo Khách (VNĐ) (*)</span>
                  <span class="text-xs text-amber-300 font-mono font-bold" id="badge-revenue-word"></span>
                </label>
                <div class="relative">
                  <input type="text" id="ipt-revenue" required placeholder="0" oninput="handleCurrencyInput(this); calculateFormFinancials();" class="w-full bg-[#0a1931] border border-slate-700 focus:border-amber-400 rounded-xl pl-4 pr-12 py-3 text-base sm:text-lg font-mono font-extrabold text-amber-300 focus:outline-none">
                  <span class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-sm text-slate-400 font-bold">đ</span>
                </div>
              </div>

              <div class="p-3 rounded-lg bg-[#07162f] border border-slate-800 text-xs sm:text-sm text-slate-300 space-y-1.5">
                <div class="flex justify-between items-center">
                  <span class="text-slate-400">Tổng Đã Thu Của Khách:</span>
                  <span id="sum-customer-paid-display" class="font-mono font-bold text-emerald-400 text-sm">0 đ</span>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-slate-400 font-semibold">Khách Còn Thiếu (Nợ Phải Thu AR):</span>
                  <span id="customer-debt-remain-display" class="font-mono font-bold text-rose-400 text-sm">0 đ</span>
                </div>
              </div>
            </div>

            <!-- Cột 2: Trả NCC (Giá Vốn) -->
            <div class="p-4 sm:p-5 bg-[#07162f] border border-slate-800 rounded-xl space-y-3.5">
              <div class="flex items-center justify-between border-b border-slate-800 pb-2">
                <span class="text-sm font-bold text-amber-400 uppercase">
                  Mua Hàng (Giá Vốn Trả NCC)
                </span>
                <span class="text-xs text-slate-400 font-bold">GIÁ NET ĐỐI TÁC</span>
              </div>

              <div>
                <label class="block text-sm font-bold text-slate-200 mb-1.5 flex items-center justify-between">
                  <span>Giá Vốn Trả Nhà Cung Cấp (VNĐ) (*)</span>
                  <span class="text-xs text-slate-400 font-mono font-bold" id="badge-cost-word"></span>
                </label>
                <div class="relative">
                  <input type="text" id="ipt-cost" required placeholder="0" oninput="handleCurrencyInput(this); calculateFormFinancials();" class="w-full bg-[#0a1931] border border-slate-700 focus:border-slate-400 rounded-xl pl-4 pr-12 py-3 text-base sm:text-lg font-mono font-bold text-slate-200 focus:outline-none">
                  <span class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-sm text-slate-400 font-bold">đ</span>
                </div>
              </div>

              <div>
                <label class="block text-sm font-semibold text-slate-300 mb-1.5">Số Tiền Đã Thanh Toán Cho NCC</label>
                <div class="relative">
                  <input type="text" id="ipt-ap-paid" placeholder="0" oninput="handleCurrencyInput(this); calculateFormFinancials();" class="w-full bg-[#0a1931] border border-slate-700 rounded-xl pl-4 pr-12 py-2.5 text-sm sm:text-base font-mono text-emerald-400 focus:outline-none">
                  <span class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-xs text-slate-400 font-bold">đ</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Bảng Tóm Tắt Lợi Nhuận Gộp (Font To Rõ, Nổi Bật) -->
          <div class="p-4 sm:p-5 rounded-xl bg-[#07162f] border border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div class="flex items-center gap-6 flex-wrap">
              <div>
                <span class="text-xs text-slate-400 block uppercase">Doanh Thu:</span>
                <span id="formula-revenue" class="text-base sm:text-lg font-mono font-bold text-white">0 đ</span>
              </div>
              <div class="text-slate-600 text-lg font-bold">-</div>
              <div>
                <span class="text-xs text-slate-400 block uppercase">Giá Vốn:</span>
                <span id="formula-cost" class="text-base sm:text-lg font-mono font-bold text-slate-300">0 đ</span>
              </div>
              <div class="text-slate-600 text-lg font-bold">=</div>
              <div>
                <span class="text-xs text-amber-400 block uppercase font-bold">Lợi Nhuận Gộp (Lãi):</span>
                <span id="formula-profit" class="text-lg sm:text-xl font-mono font-black text-emerald-400">0 đ</span>
              </div>
            </div>

            <div>
              <span class="text-xs text-slate-400 block uppercase mb-1">Tỷ Suất Lợi Nhuận:</span>
              <span id="profit-margin-badge" class="px-3 py-1 rounded-full text-xs sm:text-sm font-mono font-bold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">0.0%</span>
            </div>
          </div>

        </div>

        <!-- ========================================================================= -->
        <!-- KHỐI 4: KẾ HOẠCH & TIẾN ĐỘ THU TIỀN NHIỀU ĐỢT (3 - 4 LẦN) -->
        <!-- ========================================================================= -->
        <div class="p-5 sm:p-6 rounded-2xl bg-[#0c1e3d] border border-blue-900/50 shadow-md space-y-4">
          <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <h4 class="text-sm sm:text-base font-bold text-sky-400 uppercase tracking-wide flex items-center gap-2">
              <i class="fa-solid fa-credit-card"></i>
              <span>3. Kế Hoạch & Tiến Độ Thu Tiền Của Khách (Hỗ Trợ Nhiều Đợt)</span>
            </h4>

            <button type="button" onclick="addPaymentInstallment()" class="px-3.5 py-2 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-xs sm:text-sm font-bold rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow">
              <i class="fa-solid fa-plus"></i>
              <span>Thêm Đợt Thu Tiền</span>
            </button>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr class="text-xs text-slate-400 uppercase tracking-wider border-b border-slate-800 bg-[#07162f]">
                  <th class="py-2.5 px-3">Tên Đợt</th>
                  <th class="py-2.5 px-3 text-right w-40">Số Tiền (VNĐ)</th>
                  <th class="py-2.5 px-3 w-36">Ngày Thu / Hạn</th>
                  <th class="py-2.5 px-3 w-48">Phương Thức</th>
                  <th class="py-2.5 px-3 w-36">Trạng Thái</th>
                  <th class="py-2.5 px-3">Ghi Chú</th>
                  <th class="py-2.5 px-2 text-center w-12">Xóa</th>
                </tr>
              </thead>
              <tbody id="payment-installments-tbody" class="divide-y divide-slate-800">
                <!-- Rendered dynamically by JS -->
              </tbody>
            </table>
          </div>

          <div class="p-3.5 rounded-xl bg-[#07162f] border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
            <div class="flex items-center gap-2">
              <span class="text-slate-400 font-semibold">Tình Trạng Thu:</span>
              <span id="payment-progress-status-badge" class="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">Chưa thu tiền</span>
            </div>
            <div class="flex items-center gap-4 font-mono">
              <span class="text-slate-400">Đã thu: <strong id="total-paid-installments" class="text-emerald-400 text-sm">0 đ</strong></span>
              <span class="text-slate-500">|</span>
              <span class="text-slate-400">Còn lại: <strong id="remaining-installments" class="text-rose-400 text-sm">0 đ</strong></span>
            </div>
          </div>
        </div>

        <!-- ========================================================================= -->
        <!-- KHỐI 5: HÓA ĐƠN GTGT ĐẦU RA (XUẤT CHO KHÁCH HÀNG / DOANH NGHIỆP) -->
        <!-- ========================================================================= -->
        <div class="p-5 sm:p-6 rounded-2xl bg-[#0c1e3d] border border-blue-900/50 shadow-md space-y-4">
          <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div class="flex items-center gap-3">
              <h4 class="text-sm sm:text-base font-bold text-sky-400 uppercase tracking-wide flex items-center gap-2">
                <i class="fa-solid fa-file-invoice-dollar"></i>
                <span>4. Hóa Đơn GTGT Đầu Ra (Xuất Cho Khách Hàng / Doanh Nghiệp)</span>
              </h4>
              <label class="inline-flex items-center gap-2 cursor-pointer select-none">
                <input type="checkbox" id="ipt-co-xuat-vat" onchange="toggleVatOutputSection()" class="sr-only peer">
                <div class="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600"></div>
                <span class="text-xs sm:text-sm font-bold text-slate-300 peer-checked:text-blue-300">Khách Yêu Cầu Xuất HĐ VAT</span>
              </label>
            </div>

            <button type="button" onclick="copyVatInfoForMisa()" class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 cursor-pointer">
              <i class="fa-solid fa-copy"></i>
              <span>Copy Dữ Liệu Gửi MISA</span>
            </button>
          </div>

          <div id="vat-output-details" class="space-y-4">
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label class="block text-sm font-bold text-slate-200 mb-1.5">Số Hóa Đơn Xuất</label>
                <input type="text" id="ipt-so-hd-ra" placeholder="VD: 1C26TBT-000123" class="w-full bg-[#07162f] border border-slate-700 rounded-xl px-4 py-2.5 text-sm sm:text-base text-white focus:outline-none focus:border-sky-400 font-mono">
              </div>

              <div>
                <label class="block text-sm font-bold text-slate-200 mb-1.5">Trạng Thái HĐ Đầu Ra (*)</label>
                <select id="ipt-status-hd-ra" class="w-full bg-[#07162f] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-sky-400">
                  <option value="khong_xuat">Không Xuất Hóa Đơn</option>
                  <option value="chua_xuat">🟡 Chờ Xuất Hóa Đơn</option>
                  <option value="da_xuat">🟢 Đã Xuất Hóa Đơn Thành Công</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-bold text-slate-200 mb-1.5">Mã Số Thuế Công Ty</label>
                <input type="text" id="ipt-vat-taxcode" placeholder="VD: 0317894562" class="w-full bg-[#07162f] border border-slate-700 rounded-xl px-4 py-2.5 text-sm sm:text-base text-amber-300 font-mono font-bold focus:outline-none focus:border-amber-400">
              </div>

              <div>
                <label class="block text-sm font-bold text-slate-200 mb-1.5">Email Nhận Hóa Đơn</label>
                <input type="email" id="ipt-vat-email" placeholder="VD: ketoan@congty.com" class="w-full bg-[#07162f] border border-slate-700 rounded-xl px-4 py-2.5 text-sm sm:text-base text-white focus:outline-none focus:border-sky-400">
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-bold text-slate-200 mb-1.5">Tên Đơn Vị / Công Ty Mua Hàng</label>
                <input type="text" id="ipt-vat-company" placeholder="VD: CÔNG TY TNHH DU LỊCH & THƯƠNG MẠI Á CHÂU" class="w-full bg-[#07162f] border border-slate-700 rounded-xl px-4 py-2.5 text-sm sm:text-base text-white font-semibold focus:outline-none focus:border-sky-400">
              </div>

              <div>
                <label class="block text-sm font-bold text-slate-200 mb-1.5">Địa Chỉ Xuất Hóa Đơn</label>
                <input type="text" id="ipt-vat-address" placeholder="VD: Tòa nhà Bitexco, Q.1, TP. Hồ Chí Minh" class="w-full bg-[#07162f] border border-slate-700 rounded-xl px-4 py-2.5 text-sm sm:text-base text-white focus:outline-none focus:border-sky-400">
              </div>
            </div>

            <div>
              <label class="block text-sm font-bold text-slate-200 mb-1.5">Nội Dung Dịch Vụ Xuất Hóa Đơn</label>
              <input type="text" id="ipt-vat-content" placeholder="VD: Dịch vụ lưu trú khách sạn tại Nha Trang theo HĐ số..." class="w-full bg-[#07162f] border border-slate-700 rounded-xl px-4 py-2.5 text-sm sm:text-base text-white focus:outline-none focus:border-sky-400">
            </div>
          </div>
        </div>

        <!-- ========================================================================= -->
        <!-- KHỐI 6: HÓA ĐƠN ĐẦU VÀO TỪ NHÀ CUNG CẤP -->
        <!-- ========================================================================= -->
        <div class="p-5 sm:p-6 rounded-2xl bg-[#0c1e3d] border border-blue-900/50 shadow-md space-y-4">
          <div class="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <h4 class="text-sm sm:text-base font-bold text-sky-400 uppercase tracking-wide flex items-center gap-2">
              <i class="fa-solid fa-receipt"></i>
              <span>5. Hóa Đơn Đầu Vào (Từ Nhà Cung Cấp / Khách Sạn / Resort)</span>
            </h4>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label class="block text-sm font-bold text-slate-200 mb-1.5">Trạng Thái HĐ Đầu Vào (*)</label>
              <select id="ipt-status-hd-vao" class="w-full bg-[#07162f] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-sky-400">
                <option value="chua_lay">🔔 Cần Đòi HĐ Đầu Vào</option>
                <option value="da_co">✅ Đã Lấy Hóa Đơn Đầu Vào</option>
                <option value="khong_co">⚪ Không Có HĐ (Vé Lẻ / Hộ Kinh Doanh)</option>
              </select>
            </div>

            <div>
              <label class="block text-sm font-bold text-slate-200 mb-1.5">Mã Số Thuế Nhà Cung Cấp</label>
              <input type="text" id="ipt-ncc-mst" placeholder="VD: 4201234567" class="w-full bg-[#07162f] border border-slate-700 rounded-xl px-4 py-2.5 text-sm sm:text-base text-amber-300 font-mono font-bold focus:outline-none focus:border-amber-400">
            </div>

            <div>
              <label class="block text-sm font-bold text-slate-200 mb-1.5">Số Hóa Đơn NCC Đã Gửi</label>
              <input type="text" id="ipt-so-hd-vao" placeholder="VD: 0004562" class="w-full bg-[#07162f] border border-slate-700 rounded-xl px-4 py-2.5 text-sm sm:text-base text-white focus:outline-none focus:border-sky-400 font-mono">
            </div>

            <div>
              <label class="block text-sm font-bold text-slate-200 mb-1.5">Ngày Nhận Hóa Đơn</label>
              <input type="date" id="ipt-ncc-hd-date" class="w-full bg-[#07162f] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-sky-400 font-mono">
            </div>
          </div>
        </div>

        <!-- ========================================================================= -->
        <!-- MODAL FOOTER: LƯU HẠCH TOÁN BOOKING -->
        <!-- ========================================================================= -->
        <div class="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 sticky bottom-0 bg-[#07162f] py-3 z-10">
          <div class="text-xs text-slate-400">
            Kiểm tra thông tin chi tiết trước khi lưu hạch toán.
          </div>
          <div class="flex items-center gap-3">
            <button type="button" onclick="closeModalTaoDon()" class="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-bold transition cursor-pointer">
              Hủy Bỏ
            </button>
            <button type="submit" class="px-7 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-sm font-extrabold shadow-lg shadow-blue-600/30 transition flex items-center gap-2 cursor-pointer">
              <i class="fa-solid fa-floppy-disk text-base"></i>
              <span>LƯU HẠCH TOÁN BOOKING</span>
            </button>
          </div>
        </div>

      </form>
    </div>
  </div>`;

html = html.substring(0, divContainerStart) + newBookingModalHtml + html.substring(modalEnd);
console.log('Successfully refactored booking-modal in crm.html');

fs.writeFileSync(crmPath, html, 'utf8');
console.log('Saved crm.html successfully!');

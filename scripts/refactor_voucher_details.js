const fs = require('fs');
const path = require('path');

const crmPath = path.join(__dirname, '..', 'crm.html');
let content = fs.readFileSync(crmPath, 'utf8');

console.log('Original crm.html length:', content.length);

// 1. REFACTOR VOUCHER MODAL HTML
const oldVoucherStart = content.indexOf('<!-- MODAL 2: PHIẾU XÁC NHẬN DỊCH VỤ');
const oldVoucherEnd = content.indexOf('<!-- ========================================================================= -->\n  <!-- MODAL 3: CHĂM SÓC SINH NHẬT');

if (oldVoucherStart === -1 || oldVoucherEnd === -1) {
  console.error('Could not find Voucher Modal markers!');
  process.exit(1);
}

const newVoucherModalHtml = `<!-- MODAL 2: PHIẾU XÁC NHẬN DỊCH VỤ & ROOMING LIST (CHUẨN LỮ HÀNH 5 SAO) -->
  <!-- ========================================================================= -->
  <div id="voucher-modal" class="fixed inset-0 z-50 overflow-hidden hidden flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-sm">
    <div class="relative bg-slate-900 border border-slate-700/80 rounded-2xl max-w-4xl w-full max-h-[94vh] flex flex-col shadow-2xl overflow-hidden">
      <!-- Header -->
      <div class="px-6 py-4 border-b border-slate-800 bg-[#07162f] flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white text-lg shadow-lg shadow-sky-500/20">
            <i class="fa-solid fa-file-invoice"></i>
          </div>
          <div>
            <h3 class="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
              <span>PHIẾU XÁC NHẬN DỊCH VỤ (BOOKING CONFIRMATION VOUCHER)</span>
              <span class="text-[9px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">Chuẩn Lữ Hành 5 Sao</span>
            </h3>
            <p class="text-[11px] text-slate-300">Đầy đủ Hạng phòng, Số lượng phòng, Số người & Số đêm – Xuất phiếu gửi Khách Hàng & Resort</p>
          </div>
        </div>
        <button onclick="closeVoucherModal()" class="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition">
          <i class="fa-solid fa-xmark text-lg"></i>
        </button>
      </div>

      <!-- Voucher Printable Container -->
      <div class="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#0b192c]/50">
        <div id="voucher-printable-area" class="bg-white text-slate-900 rounded-2xl p-6 sm:p-8 shadow-xl max-w-3xl mx-auto space-y-5 border border-slate-200">
          <!-- Brand Header -->
          <div class="flex items-center justify-between border-b pb-4 border-slate-200">
            <div class="flex items-center gap-3">
              <img src="logo.png" alt="Booking Travel" width="160" height="55" class="h-11 w-auto object-contain">
              <div>
                <h2 class="text-sm sm:text-base font-black text-slate-900 uppercase tracking-tight">CÔNG TY TNHH BOOKING TRAVEL</h2>
                <p class="text-[11px] sm:text-xs text-blue-700 font-bold">"Khách hàng là gia đình" • Hotline: 0846.477.222 & 08.33.00.1000</p>
                <p class="text-[10px] text-slate-500">MST: 0317894562 • Website: bookingtravel.vn • Email: info@bookingtravel.vn</p>
              </div>
            </div>
            <div class="text-right">
              <span class="text-[10px] font-bold text-slate-500 block uppercase">MÃ VOUCHER</span>
              <span id="vc-code" class="text-base sm:text-lg font-mono font-black text-blue-700">BT-2026-001</span>
              <span id="vc-booking-date" class="text-[10px] text-slate-400 block font-mono">Ngày tạo: 26/10/2026</span>
            </div>
          </div>

          <!-- Title -->
          <div class="text-center py-1">
            <h1 class="text-lg sm:text-2xl font-black text-slate-900 uppercase tracking-wide">PHIẾU XÁC NHẬN ĐẶT PHÒNG & DỊCH VỤ</h1>
            <p class="text-xs text-slate-500 font-medium">HOTEL / RESORT BOOKING CONFIRMATION & ROOMING LIST</p>
          </div>

          <!-- BẢNG CHI TIẾT HẠNG PHÒNG, SỐ LƯỢNG, SỐ NGƯỜI & SỐ ĐÊM (THEO YÊU CẦU NGƯỜI DÙNG) -->
          <div class="rounded-xl border-2 border-blue-600/30 overflow-hidden shadow-sm">
            <div class="bg-[#07162f] text-white px-4 py-2.5 flex items-center justify-between">
              <div class="flex items-center gap-2">
                <i class="fa-solid fa-hotel text-amber-400 text-sm"></i>
                <span class="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-white">THÔNG TIN KHÁCH SẠN & DỊCH VỤ LƯU TRÚ</span>
              </div>
              <span class="px-2.5 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-extrabold border border-amber-400/40">TIÊU CHUẨN VIP</span>
            </div>

            <!-- Khách sạn & Mã xác nhận resort -->
            <div class="p-4 bg-slate-50/80 border-b border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span class="text-slate-500 block text-[11px] font-semibold">🏨 Khách Sạn / Resort Tiếp Nhận:</span>
                <strong id="vc-supplier" class="text-slate-900 text-sm sm:text-base font-black block mt-0.5">King Town Grand Hotel</strong>
              </div>
              <div>
                <span class="text-slate-500 block text-[11px] font-semibold">🔑 Mã Xác Nhận Resort (Hotel Conf Code):</span>
                <div class="flex items-center gap-2 mt-0.5">
                  <input type="text" id="vc-resort-code" placeholder="Nhập mã xác nhận resort (VD: KTG-8899)..." class="w-full bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-blue-700 font-mono font-bold focus:outline-none focus:border-blue-500 shadow-sm">
                </div>
              </div>
            </div>

            <!-- LƯỚI 4 YẾU TỐ CỐT LÕI: HẠNG PHÒNG - SỐ PHÒNG - SỐ KHÁCH - SỐ ĐÊM -->
            <div class="p-4 bg-white grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <!-- 1. Hạng Phòng -->
              <div class="col-span-2 bg-blue-50/60 p-3 rounded-xl border border-blue-200/80">
                <span class="text-slate-600 block text-[11px] font-bold flex items-center gap-1.5">
                  <i class="fa-solid fa-bed text-blue-600"></i> Hạng Phòng (Room Category):
                </span>
                <input type="text" id="vc-room-category-input" placeholder="VD: Executive Ocean View" class="mt-1 w-full bg-white border border-blue-300 rounded-lg px-2.5 py-1 text-xs sm:text-sm font-extrabold text-blue-900 focus:outline-none focus:border-blue-500">
              </div>

              <!-- 2. Số Lượng Phòng -->
              <div class="bg-blue-50/60 p-3 rounded-xl border border-blue-200/80 text-center">
                <span class="text-slate-600 block text-[11px] font-bold flex items-center justify-center gap-1">
                  <i class="fa-solid fa-door-open text-blue-600"></i> Số Lượng Phòng:
                </span>
                <div class="mt-1 flex items-center justify-center gap-1">
                  <input type="number" id="vc-room-qty-input" min="1" value="1" class="w-16 bg-white border border-blue-300 rounded-lg px-2 py-1 text-xs sm:text-sm font-black text-center text-blue-900 focus:outline-none focus:border-blue-500">
                  <span class="text-xs font-bold text-slate-700">Phòng</span>
                </div>
              </div>

              <!-- 3. Số Lượng Khách -->
              <div class="bg-amber-50/60 p-3 rounded-xl border border-amber-200/80 text-center">
                <span class="text-slate-600 block text-[11px] font-bold flex items-center justify-center gap-1">
                  <i class="fa-solid fa-users text-amber-600"></i> Số Lượng Khách:
                </span>
                <input type="text" id="vc-guest-qty-input" placeholder="VD: 4 Người lớn" class="mt-1 w-full bg-white border border-amber-300 rounded-lg px-2 py-1 text-xs sm:text-sm font-black text-center text-amber-950 focus:outline-none focus:border-amber-500">
              </div>

              <!-- Check-In -->
              <div class="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span class="text-slate-500 block text-[11px] font-semibold flex items-center gap-1">
                  <i class="fa-solid fa-calendar-check text-emerald-600"></i> Nhận Phòng (Check-In):
                </span>
                <strong id="vc-checkin-date" class="text-xs sm:text-sm font-mono font-bold text-slate-900 block mt-1">14:00 - 29/10/2026</strong>
              </div>

              <!-- Check-Out -->
              <div class="bg-slate-50 p-3 rounded-xl border border-slate-200">
                <span class="text-slate-500 block text-[11px] font-semibold flex items-center gap-1">
                  <i class="fa-solid fa-calendar-xmark text-rose-600"></i> Trả Phòng (Check-Out):
                </span>
                <strong id="vc-checkout-date" class="text-xs sm:text-sm font-mono font-bold text-slate-900 block mt-1">12:00 - 31/10/2026</strong>
              </div>

              <!-- 4. Số Đêm Lưu Trú -->
              <div class="bg-emerald-50/60 p-3 rounded-xl border border-emerald-200/80 text-center">
                <span class="text-slate-600 block text-[11px] font-bold flex items-center justify-center gap-1">
                  <i class="fa-solid fa-moon text-emerald-600"></i> Tổng Số Đêm:
                </span>
                <span id="vc-night-qty" class="inline-block mt-1 px-3 py-0.5 bg-emerald-100 text-emerald-900 text-xs sm:text-sm font-black rounded-lg border border-emerald-300">2 Đêm</span>
              </div>

              <!-- Bữa ăn kèm theo -->
              <div class="bg-purple-50/60 p-3 rounded-xl border border-purple-200/80 text-center">
                <span class="text-slate-600 block text-[11px] font-bold flex items-center justify-center gap-1">
                  <i class="fa-solid fa-utensils text-purple-600"></i> Tiêu Chuẩn Bữa Ăn:
                </span>
                <span id="vc-meal-plan" class="inline-block mt-1 px-2 py-0.5 bg-purple-100 text-purple-900 text-[11px] font-bold rounded-lg border border-purple-200">Ăn sáng buffet hàng ngày</span>
              </div>
            </div>
          </div>

          <!-- THÔNG TIN KHÁCH HÀNG & THANH TOÁN -->
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <span class="text-slate-500 block text-[11px]">Khách Hàng Đại Diện:</span>
              <strong id="vc-customer-name" class="text-slate-900 text-xs sm:text-sm font-bold block mt-0.5">Nguyễn Văn A</strong>
            </div>
            <div>
              <span class="text-slate-500 block text-[11px]">Số Điện Thoại Khách:</span>
              <strong id="vc-customer-phone" class="text-slate-900 font-mono text-xs sm:text-sm font-bold block mt-0.5">0901234567</strong>
            </div>
            <div>
              <span class="text-slate-500 block text-[11px]">Số CCCD / Hộ Chiếu:</span>
              <strong id="vc-customer-cccd" class="text-slate-900 font-mono block mt-0.5">Đang cập nhật</strong>
            </div>
            <div>
              <span class="text-slate-500 block text-[11px]">Email Nhận Xác Nhận:</span>
              <strong id="vc-customer-email" class="text-slate-900 font-mono truncate block mt-0.5">Chưa có email</strong>
            </div>
            <div class="col-span-2">
              <span class="text-slate-500 block text-[11px]">Tình Trạng Thanh Toán Với Đối Tác:</span>
              <span id="vc-status-badge" class="inline-block mt-1 px-2.5 py-1 rounded text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">ĐÃ XÁC NHẬN</span>
            </div>
            <div class="col-span-2">
              <span class="text-slate-500 block text-[11px]">Nhân Viên Điều Hành / Phụ Trách:</span>
              <strong id="vc-staff" class="text-slate-900 font-bold block mt-1">Ban Giám Đốc • Booking Travel</strong>
            </div>
          </div>

          <!-- Danh Sách Khách Đi Cùng (Rooming List) -->
          <div class="space-y-1.5">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <i class="fa-solid fa-users text-blue-600"></i> DANH SÁCH KHÁCH LƯU TRÚ (ROOMING LIST):
              </span>
              <span class="text-[11px] text-slate-500 italic">Có thể thêm sửa trực tiếp tên & CCCD từng khách</span>
            </div>
            <textarea id="vc-rooming-list" rows="3" placeholder="Nhập danh sách khách: 1. Nguyễn Văn A (Đại diện - SĐT: 091...) - 2. Trần Thị B (CCCD: 001...)" class="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-800 font-sans focus:outline-none focus:border-blue-500 shadow-inner"></textarea>
          </div>

          <!-- Ghi Chú Đặc Biệt & Tiêu Chuẩn Phục Vụ Chuẩn "Khách Hàng Là Gia Đình" -->
          <div class="text-[11px] text-slate-700 bg-amber-50/80 border border-amber-200/90 p-3.5 rounded-xl space-y-1 leading-relaxed">
            <strong class="text-amber-900 font-extrabold flex items-center gap-1">
              <i class="fa-solid fa-shield-heart text-amber-600"></i> QUYỀN LỢI & TIÊU CHUẨN DỊCH VỤ BAO GỒM:
            </strong>
            <p>• <strong>Bữa ăn:</strong> Đã bao gồm buffet sáng hàng ngày theo đúng số lượng khách tiêu chuẩn của phòng.</p>
            <p>• <strong>Tiện ích resort:</strong> Miễn phí sử dụng hồ bơi, phòng gym, wifi toàn khu, trà / cà phê / nước suối setup hàng ngày.</p>
            <p>• <strong>Hỗ trợ đặc biệt:</strong> Kính nhờ Quý khách sạn đón tiếp chu đáo, hỗ trợ nhận phòng thuận tiện theo tinh thần <em>"Khách hàng là gia đình"</em>.</p>
          </div>

          <!-- Chân Ký 2 Bên -->
          <div class="flex items-center justify-between pt-4 border-t border-slate-200 text-xs text-slate-500">
            <div>
              <p class="font-extrabold text-slate-900 uppercase">ĐẠI DIỆN ĐẶT PHÒNG</p>
              <p class="text-[11px] font-semibold text-blue-700">CÔNG TY TNHH BOOKING TRAVEL</p>
              <p class="text-[10px] text-slate-400 mt-6">(Ký, đóng dấu xác nhận)</p>
            </div>
            <div class="text-right">
              <p class="font-extrabold text-slate-900 uppercase">XÁC NHẬN KHÁCH SẠN / RESORT</p>
              <p class="text-[11px] font-semibold text-slate-700">BỘ PHẬN ĐẶT PHÒNG & LỄ TÂN</p>
              <p class="text-[10px] text-slate-400 mt-6">(Ký & xác nhận mã phòng)</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="px-6 py-3.5 border-t border-slate-800 bg-[#07162f] flex flex-wrap items-center justify-between gap-3">
        <span class="text-xs text-slate-300 font-medium">Phiếu đầy đủ thông tin gửi cho Khách Hàng và Resort lưu trú</span>
        <div class="flex flex-wrap items-center gap-2">
          <button type="button" onclick="saveVoucherData()" class="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition border border-slate-700 cursor-pointer">
            <i class="fa-solid fa-floppy-disk mr-1"></i> Lưu Thông Tin
          </button>
          <button type="button" onclick="copyVoucherToCustomerZalo()" class="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer">
            <i class="fa-solid fa-paper-plane"></i>
            <span>Copy Zalo Gửi Khách Hàng</span>
          </button>
          <button type="button" onclick="copyVoucherToZalo()" class="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer">
            <i class="fa-solid fa-hotel"></i>
            <span>Copy Zalo Gửi Resort</span>
          </button>
          <button type="button" onclick="printVoucher()" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer">
            <i class="fa-solid fa-print"></i>
            <span>In / Lưu PDF Voucher</span>
          </button>
        </div>
      </div>
    </div>
  </div>\n\n  `;

content = content.substring(0, oldVoucherStart) + newVoucherModalHtml + content.substring(oldVoucherEnd);
console.log('Replaced Voucher Modal HTML successfully! New length:', content.length);

fs.writeFileSync(crmPath, content, 'utf8');
console.log('crm.html saved!');

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'CRM_Booking.html');
let content = fs.readFileSync(filePath, 'utf8');

console.log('Original file length:', content.length);

// 1. ADD CSS STYLES INTO <style>
const cssMarker = '</style>';
const voucherCss = `
    /* =========================================================================
       5-STAR LUXURY CUSTOMER VOUCHER STYLES (EDIT & PREVIEW MODES)
       ========================================================================= */
    #voucher-modal .editable-field,
    #voucher-modal .editable-input {
      transition: all 0.15s ease;
      border-radius: 6px;
      outline: none;
    }
    #voucher-modal.edit-mode .editable-field {
      background-color: rgba(241, 245, 249, 0.75);
      box-shadow: inset 0 0 0 1px #cbd5e1;
      padding-left: 7px;
      padding-right: 7px;
      cursor: text;
    }
    #voucher-modal.edit-mode .editable-field:hover,
    #voucher-modal.edit-mode .editable-input:hover {
      background-color: #f1f5f9;
      box-shadow: inset 0 0 0 1px #94a3b8;
    }
    #voucher-modal.edit-mode .editable-field:focus,
    #voucher-modal.edit-mode .editable-input:focus {
      background-color: #ffffff;
      box-shadow: 0 0 0 2px #0284c7;
    }
    #voucher-modal.edit-mode .editable-input {
      background-color: rgba(241, 245, 249, 0.75);
      box-shadow: inset 0 0 0 1px #cbd5e1;
      padding-left: 8px;
      padding-right: 8px;
    }
    #voucher-modal.preview-mode .editable-field,
    #voucher-modal.preview-mode .editable-input {
      background-color: transparent !important;
      box-shadow: none !important;
      padding-left: 0 !important;
      padding-right: 0 !important;
      border-color: transparent !important;
      pointer-events: none;
    }
    #voucher-modal.preview-mode .edit-only-hint {
      display: none !important;
    }
    #voucher-modal input[type="number"]::-webkit-inner-spin-button,
    #voucher-modal input[type="number"]::-webkit-outer-spin-button {
      opacity: 1;
    }
    #voucher-modal.preview-mode input[type="number"]::-webkit-inner-spin-button,
    #voucher-modal.preview-mode input[type="number"]::-webkit-outer-spin-button {
      -webkit-appearance: none;
      margin: 0;
      display: none;
    }
`;

if (!content.includes('5-STAR LUXURY CUSTOMER VOUCHER STYLES')) {
  const styleIdx = content.indexOf(cssMarker);
  if (styleIdx !== -1) {
    content = content.substring(0, styleIdx) + voucherCss + '\n  ' + content.substring(styleIdx);
    console.log('Added CSS styles successfully.');
  } else {
    console.warn('Could not find </style> tag!');
  }
}

// 2. NEW HTML FOR #voucher-modal
const newModalHtml = `  <!-- ========================================================================= -->
  <!-- MODAL: PHIẾU XÁC NHẬN DỊCH VỤ GỬI KHÁCH HÀNG (CUSTOMER VOUCHER 5 SAO)    -->
  <!-- ========================================================================= -->
  <div id="voucher-modal" class="fixed inset-0 z-50 overflow-hidden hidden flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md edit-mode">
    <!-- Click backdrop outside to close -->
    <div class="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity" onclick="closeVoucherModal()" title="Bấm ra ngoài để đóng"></div>
    <div class="relative bg-slate-900 border border-slate-700/80 rounded-2xl max-w-5xl w-full max-h-[96vh] flex flex-col shadow-2xl overflow-hidden z-10">
      
      <!-- TOP MODAL ACTION BAR -->
      <div class="no-print px-4 sm:px-6 py-3.5 border-b border-slate-800 bg-[#0f172a] flex flex-col md:flex-row items-start md:items-center justify-between gap-3 shrink-0">
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-500 to-blue-600 flex items-center justify-center shadow-md shadow-blue-500/20 shrink-0 text-white">
            <i class="fa-solid fa-file-shield text-base"></i>
          </div>
          <div>
            <div class="flex flex-wrap items-center gap-2">
              <h3 class="font-bold text-white text-sm sm:text-base tracking-tight">
                PHIẾU XÁC NHẬN DỊCH VỤ – GỬI KHÁCH HÀNG (CUSTOMER VOUCHER)
              </h3>
              <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                <i class="fa-solid fa-wand-magic-sparkles text-[10px]"></i>
                Chuẩn Lữ Hành 5 Sao
              </span>
            </div>
            <p class="text-[11.5px] text-slate-400 mt-0.5">
              Đầy đủ Hạng phòng, Số lượng phòng, Người lớn & Trẻ em, Địa chỉ khách sạn – Xuất phiếu gửi Khách Hàng
            </p>
          </div>
        </div>

        <!-- Top Actions -->
        <div class="flex flex-wrap items-center gap-2 self-end md:self-auto">
          <!-- Toggle Edit / Preview -->
          <button
            id="toggleVoucherModeBtn"
            type="button"
            onclick="toggleVoucherEditMode()"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
            title="Chuyển đổi giữa Chế độ chỉnh sửa và Xem bản in sạch"
          >
            <i id="voucherModeIcon" class="fa-solid fa-eye text-sky-400"></i>
            <span id="voucherModeText">Xem bản in sạch</span>
          </button>

          <!-- Print / Export PDF -->
          <button
            type="button"
            onclick="printVoucher()"
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-sky-600 hover:bg-sky-500 text-white shadow-sm shadow-sky-500/30 transition cursor-pointer"
          >
            <i class="fa-solid fa-print"></i>
            <span>In / Xuất PDF</span>
          </button>

          <!-- Close Button -->
          <button
            type="button"
            onclick="closeVoucherModal()"
            class="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-rose-950/60 hover:text-rose-300 hover:border-rose-800/60 text-slate-300 border border-slate-700/80 transition cursor-pointer"
          >
            <i class="fa-solid fa-xmark"></i>
            <span>Đóng</span>
          </button>
        </div>
      </div>

      <!-- SCROLLABLE PAPER VIEW -->
      <div class="flex-1 overflow-y-auto p-3 sm:p-6 bg-[#090f1d] scrollbar-thin">
        <div id="voucher-printable-area" class="max-w-5xl mx-auto bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden transition-all text-slate-900">
          <!-- Top Accent Bar -->
          <div class="h-1.5 w-full bg-gradient-to-r from-[#0f172a] via-[#1492d8] to-amber-500"></div>

          <div class="p-5 sm:p-7 space-y-5">
            <!-- HEADER: LOGO BOOKING TRAVEL + COMPANY INFO + MÃ ĐƠN BOOKING -->
            <div class="grid grid-cols-1 md:grid-cols-12 items-center gap-4 pb-4 border-b border-slate-200">
              <!-- Left (8 Cols): Exact Booking Travel Logo + Clean Company Info -->
              <div class="md:col-span-8 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                
                <!-- Clickable Logo Container (Exact SVG from User Reference Image + File Upload Support) -->
                <div
                  onclick="triggerLogoUpload()"
                  class="group relative w-56 h-24 rounded-xl bg-white border-[1.5px] border-[#0c6395] flex items-center justify-center p-1.5 shrink-0 cursor-pointer shadow-sm hover:border-sky-500 transition"
                  title="Nhấp để tải ảnh Logo từ máy tính (nếu muốn thay đổi)"
                >
                  <input
                    type="file"
                    id="logoUploadInput"
                    accept="image/*"
                    class="hidden"
                    onchange="handleLogoChange(event)"
                  />
                  <!-- Uploaded Image Preview -->
                  <img
                    id="customLogoImg"
                    src=""
                    alt="Booking Travel Logo"
                    class="hidden w-full h-full object-contain"
                  />
                  <!-- Exact Vector Recreation of Booking Travel Logo -->
                  <svg
                    id="defaultLogoSvg"
                    viewBox="0 0 380 155"
                    class="w-full h-full"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <!-- Black Seagull -->
                    <path d="M110 38 C122 41, 131 45, 137 52 C141 46, 152 43, 165 37 C157 44, 148 51, 143 56 C146 57, 150 59, 151 61 C146 61, 142 61, 138 63 C133 65, 128 65, 123 63 C128 60, 131 58, 132 55 C125 49, 117 43, 110 38 Z" fill="#000000"/>
                    <!-- Left Sail -->
                    <path d="M92 26 C79 50, 69 76, 65 103 L86 103" stroke="#000000" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
                    <!-- Right Sail Inner Yellow Triangle -->
                    <path d="M93 38 L121 91 L87 101 Z" fill="#ffee00"/>
                    <!-- Mast & Right Sail Black Outline -->
                    <path d="M86 108 L93 25 L125 95 L93 102" stroke="#000000" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
                    <!-- Boat Hull -->
                    <path d="M57 104 C75 115, 97 115, 116 105 C110 119, 97 127, 84 127 C71 127, 62 119, 55 110" stroke="#000000" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>
                    <!-- Upper Ocean Wave -->
                    <path d="M52 116 C69 136, 94 137, 118 122 C136 110, 156 111, 177 129 C156 120, 139 122, 119 133 C94 146, 68 141, 52 116 Z" fill="#0c6395"/>
                    <!-- Lower Ocean Wave -->
                    <path d="M103 141 C121 134, 138 123, 155 123 C164 123, 171 127, 176 132 C164 128, 152 130, 137 137 C125 142, 113 143, 103 141 Z" fill="#1da1f2"/>
                    <!-- "Booking" -->
                    <text x="133" y="97" fill="#1492d8" font-family="'Plus Jakarta Sans', Inter, sans-serif" font-weight="800" font-style="italic" font-size="31" letter-spacing="-0.5">Booking</text>
                    <!-- "Travel" -->
                    <text x="265" y="97" fill="#115e8c" font-family="'Plus Jakarta Sans', Inter, sans-serif" font-weight="800" font-style="italic" font-size="31" letter-spacing="-0.5">Travel</text>
                    <!-- "KHÁCH HÀNG LÀ GIA ĐÌNH" -->
                    <text x="183" y="125" fill="#000000" font-family="Inter, sans-serif" font-weight="800" font-style="italic" font-size="13.5" letter-spacing="0.4">KHÁCH HÀNG LÀ GIA ĐÌNH</text>
                  </svg>
                  <!-- Hover Hint -->
                  <span class="edit-only-hint no-print absolute bottom-1 right-1.5 px-1.5 py-0.5 rounded bg-slate-900/75 text-[9px] font-medium text-white opacity-0 group-hover:opacity-100 transition">
                    Đổi ảnh logo
                  </span>
                </div>

                <!-- Clean Company Details -->
                <div class="space-y-1">
                  <h2 contenteditable="true" class="editable-field font-extrabold text-slate-900 text-base sm:text-lg tracking-tight uppercase">
                    CÔNG TY TNHH BOOKING TRAVEL
                  </h2>
                  <p class="text-xs sm:text-[13px] font-semibold text-[#0c6395]">
                    <span contenteditable="true" class="editable-field">"Khách hàng là gia đình"</span>
                    <span class="mx-1 text-slate-400">•</span>
                    <span>Hotline: </span>
                    <span id="vc-hotline" contenteditable="true" class="editable-field font-bold text-slate-900">0846477222</span>
                  </p>
                  <p class="text-xs text-slate-600">
                    Email: <span id="vc-company-email" contenteditable="true" class="editable-field font-medium text-slate-800">info@bookingtravel.vn</span>
                  </p>
                </div>
              </div>

              <!-- Right (4 Cols): MÃ ĐƠN BOOKING & Ngày tạo -->
              <div class="md:col-span-4 flex flex-col md:items-end justify-center bg-slate-50 md:bg-transparent p-3 md:p-0 rounded-xl border border-slate-200/80 md:border-0">
                <div class="flex items-center gap-1.5">
                  <span class="text-[11px] font-bold text-slate-500 uppercase tracking-wider">MÃ ĐƠN BOOKING</span>
                </div>
                <div class="flex items-center gap-1.5 mt-0.5">
                  <span id="vc-code" class="font-extrabold text-xl sm:text-2xl text-blue-600 tracking-tight font-mono">DH1793116655774</span>
                  <button
                    type="button"
                    onclick="copyElementText('vc-code', 'Mã Đơn Booking')"
                    class="no-print p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition cursor-pointer"
                    title="Sao chép Mã Đơn Booking"
                  >
                    <i class="fa-solid fa-copy text-sm"></i>
                  </button>
                </div>
                <p class="text-xs text-slate-500 mt-0.5">
                  <span id="vc-booking-date" class="font-semibold text-slate-700">Ngày tạo: 25/10/2026</span>
                </p>
              </div>
            </div>

            <!-- CENTER VOUCHER TITLE -->
            <div class="text-center py-1">
              <h2 class="font-extrabold text-xl sm:text-2xl text-slate-900 tracking-tight uppercase">
                PHIẾU XÁC NHẬN ĐẶT PHÒNG & DỊCH VỤ
              </h2>
              <p class="text-[11px] font-semibold text-slate-400 tracking-widest uppercase mt-0.5">
                HOTEL / RESORT BOOKING CONFIRMATION & ROOMING LIST
              </p>
            </div>

            <!-- SECTION 1: THÔNG TIN KHÁCH SẠN & DỊCH VỤ LƯU TRÚ -->
            <section class="rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <!-- Section Bar -->
              <div class="bg-[#0f172a] px-5 py-2.5 flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <i class="fa-solid fa-hotel text-amber-400 text-sm"></i>
                  <h3 class="font-bold text-white text-xs sm:text-[13px] tracking-wide uppercase">
                    THÔNG TIN KHÁCH SẠN & DỊCH VỤ LƯU TRÚ
                  </h3>
                </div>
                <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold bg-amber-500/15 text-amber-300 border border-amber-400/40 tracking-wide">
                  <i class="fa-solid fa-crown text-[10px]"></i>
                  TIÊU CHUẨN VIP
                </span>
              </div>

              <!-- ROW 1: Khách Sạn + Địa chỉ (7 Cols) | Mã Xác Nhận Resort (5 Cols) -->
              <div class="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-slate-200 bg-white border-b border-slate-200">
                <!-- Left 7 Cols -->
                <div class="lg:col-span-7 p-4 flex flex-col justify-center space-y-1.5">
                  <div class="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                    <i class="fa-solid fa-building text-sky-600"></i>
                    <span>Khách Sạn / Resort:</span>
                  </div>
                  <input
                    type="text"
                    id="vc-hotel-name"
                    value=""
                    placeholder="Nhập tên Khách sạn / Resort..."
                    class="editable-input w-full font-bold text-lg sm:text-xl text-slate-900 py-1"
                  />
                  <!-- Editable Hotel Address -->
                  <div class="flex items-start sm:items-center gap-1.5 text-xs text-slate-600 pt-0.5">
                    <i class="fa-solid fa-location-dot text-rose-500 shrink-0 mt-0.5 sm:mt-0"></i>
                    <span class="font-semibold text-slate-500 shrink-0">Địa chỉ:</span>
                    <input
                      type="text"
                      id="vc-hotel-address"
                      value=""
                      placeholder="Nhập địa chỉ khách sạn / resort..."
                      class="editable-input w-full text-xs font-medium text-slate-700 py-0.5"
                    />
                  </div>
                </div>

                <!-- Right 5 Cols: Mã Xác Nhận Resort -->
                <div class="lg:col-span-5 p-4 bg-amber-50/40 flex flex-col justify-center space-y-1.5">
                  <label class="flex items-center justify-between text-xs font-semibold text-amber-900">
                    <span class="flex items-center gap-1.5">
                      <i class="fa-solid fa-key text-amber-600"></i>
                      <span>Mã Xác Nhận Resort (Hotel Conf Code):</span>
                    </span>
                  </label>
                  <div class="flex items-center gap-2">
                    <input
                      id="vc-resort-code"
                      type="text"
                      value=""
                      placeholder="Nhập mã xác nhận resort (VD: KTG-8899)..."
                      class="editable-input w-full bg-white px-3 py-2 rounded-lg border border-amber-300 text-sm font-bold text-slate-900 placeholder:text-slate-400 placeholder:font-normal font-mono"
                    />
                    <button
                      type="button"
                      onclick="copyInput('vc-resort-code', 'Mã xác nhận Resort')"
                      class="no-print p-2 rounded-lg bg-white hover:bg-amber-100 text-amber-700 border border-amber-200 transition cursor-pointer shrink-0"
                      title="Sao chép mã xác nhận Resort"
                    >
                      <i class="fa-solid fa-copy text-sm"></i>
                    </button>
                  </div>
                  <p class="text-[11px] text-slate-500">
                    Xuất trình mã này tại Quầy Lễ Tân khi làm thủ tục Check-in
                  </p>
                </div>
              </div>

              <!-- ROW 2: Hạng Phòng (3 Cols) | Số Lượng Phòng (2 Cols) | Số Lượng Khách (4 Cols) | Tiêu Chuẩn Bữa Ăn (3 Cols) -->
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 bg-white border-b border-slate-200">
                <!-- Col 1: Hạng Phòng (3/12) -->
                <div class="lg:col-span-3 p-4 flex flex-col justify-between space-y-1.5">
                  <label class="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                    <i class="fa-solid fa-bed text-sky-600"></i>
                    <span>Hạng Phòng (Room Category):</span>
                  </label>
                  <input
                    type="text"
                    id="vc-room-category-input"
                    value=""
                    placeholder="Nhập hạng phòng..."
                    class="editable-input w-full font-bold text-[15px] text-blue-950 py-1"
                  />
                </div>

                <!-- Col 2: Số Lượng Phòng (2/12) -->
                <div class="lg:col-span-2 p-4 flex flex-col justify-between space-y-1.5">
                  <label class="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                    <i class="fa-solid fa-door-open text-sky-600"></i>
                    <span>Số Lượng Phòng:</span>
                  </label>
                  <div class="flex items-center gap-1.5">
                    <input
                      type="number"
                      id="vc-room-qty-input"
                      min="1"
                      value="1"
                      class="editable-input w-14 text-center font-bold text-[15px] text-slate-900 py-1"
                    />
                    <span class="text-sm font-semibold text-slate-700">Phòng</span>
                  </div>
                </div>

                <!-- Col 3: Số Lượng Khách (4/12) -->
                <div class="lg:col-span-4 p-4 flex flex-col justify-between space-y-1.5">
                  <label class="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                    <i class="fa-solid fa-users text-amber-600"></i>
                    <span>Số Lượng Khách (Người lớn & Trẻ em):</span>
                  </label>
                  <div class="flex flex-wrap items-center gap-2">
                    <!-- Người lớn -->
                    <div class="flex items-center gap-1">
                      <input
                        type="number"
                        id="vc-adults-input"
                        min="1"
                        value="2"
                        class="editable-input w-12 text-center font-bold text-[15px] text-slate-900 py-1"
                      />
                      <span class="text-xs sm:text-sm font-semibold text-slate-800">Người lớn</span>
                    </div>
                    <span class="text-slate-300 font-bold">+</span>
                    <!-- Trẻ em -->
                    <div class="flex items-center gap-1">
                      <input
                        type="number"
                        id="vc-children-input"
                        min="0"
                        value="0"
                        class="editable-input w-12 text-center font-bold text-[15px] text-slate-900 py-1"
                      />
                      <span class="text-xs sm:text-sm font-semibold text-slate-800">Trẻ em</span>
                    </div>
                  </div>
                </div>

                <!-- Col 4: Tiêu Chuẩn Bữa Ăn (3/12) -->
                <div class="lg:col-span-3 p-4 flex flex-col justify-between space-y-1.5">
                  <label class="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                    <i class="fa-solid fa-utensils text-purple-600"></i>
                    <span>Tiêu Chuẩn Bữa Ăn:</span>
                  </label>
                  <input
                    type="text"
                    id="vc-meal-plan-input"
                    list="mealPlanOptions"
                    value="Ăn sáng buffet hàng ngày"
                    placeholder="Nhập hoặc chọn bữa ăn..."
                    class="editable-input w-full font-bold text-sm text-purple-900 py-1"
                  />
                  <datalist id="mealPlanOptions">
                    <option value="Ăn sáng buffet hàng ngày"></option>
                    <option value="Không bao gồm ăn sáng (Room Only)"></option>
                    <option value="Ăn 2 bữa (Sáng + Tối)"></option>
                    <option value="Ăn 3 bữa (Full Board)"></option>
                    <option value="Trọn gói (All Inclusive)"></option>
                  </datalist>
                </div>
              </div>

              <!-- ROW 3: Check-In (5 Cols) | Check-Out (5 Cols) | Tổng Số Đêm (2 Cols) -->
              <div class="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-12 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 bg-[#f8fafc]">
                <!-- Check-In (5/12) -->
                <div class="lg:col-span-5 p-4 flex items-center justify-between gap-3">
                  <div class="space-y-1 w-full">
                    <div class="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                      <i class="fa-solid fa-calendar-check text-emerald-600"></i>
                      <span>Nhận Phòng (Check-In):</span>
                    </div>
                    <input
                      type="text"
                      id="vc-checkin-input"
                      value="14:00 - 15/11/2026"
                      class="editable-input w-full font-bold text-base text-slate-900 py-0.5"
                    />
                  </div>
                </div>

                <!-- Check-Out (5/12) -->
                <div class="lg:col-span-5 p-4 flex items-center justify-between gap-3">
                  <div class="space-y-1 w-full">
                    <div class="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                      <i class="fa-solid fa-calendar-xmark text-rose-600"></i>
                      <span>Trả Phòng (Check-Out):</span>
                    </div>
                    <input
                      type="text"
                      id="vc-checkout-input"
                      value="12:00 - 16/11/2026"
                      class="editable-input w-full font-bold text-base text-slate-900 py-0.5"
                    />
                  </div>
                </div>

                <!-- Tổng Số Đêm (2/12) -->
                <div class="lg:col-span-2 p-4 flex flex-col justify-center bg-emerald-50/50">
                  <div class="flex items-center gap-1.5 text-xs font-semibold text-emerald-800">
                    <i class="fa-solid fa-moon text-emerald-600"></i>
                    <span>Tổng Số Đêm:</span>
                  </div>
                  <div class="mt-1">
                    <input
                      type="text"
                      id="vc-night-qty-input"
                      value="1 Đêm"
                      class="editable-input w-full font-extrabold text-base text-emerald-700 py-0.5"
                    />
                  </div>
                </div>
              </div>
            </section>

            <!-- SECTION 2: THÔNG TIN KHÁCH HÀNG & THANH TOÁN -->
            <section class="rounded-xl border border-slate-200 overflow-hidden shadow-sm bg-white">
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 border-b border-slate-200">
                <!-- Khách Hàng Đại Diện (4/12) -->
                <div class="lg:col-span-4 p-4 space-y-1">
                  <label class="text-xs font-semibold text-slate-400 block">Khách Hàng Đại Diện:</label>
                  <input
                    type="text"
                    id="vc-customer-name-input"
                    value=""
                    class="editable-input w-full font-extrabold text-[15px] text-slate-900 uppercase py-0.5"
                  />
                </div>

                <!-- Số Điện Thoại Khách (2/12) -->
                <div class="lg:col-span-2 p-4 space-y-1">
                  <label class="text-xs font-semibold text-slate-400 block">Số Điện Thoại Khách:</label>
                  <input
                    type="text"
                    id="vc-customer-phone-input"
                    value=""
                    class="editable-input w-full font-bold text-[15px] text-slate-900 py-0.5 font-mono"
                  />
                </div>

                <!-- Số CCCD / Hộ Chiếu (3/12) -->
                <div class="lg:col-span-3 p-4 space-y-1">
                  <label class="text-xs font-semibold text-slate-400 block">Số CCCD / Hộ Chiếu:</label>
                  <input
                    type="text"
                    id="vc-customer-cccd-input"
                    value=""
                    placeholder="Nhập số CCCD..."
                    class="editable-input w-full font-bold text-[15px] text-slate-900 py-0.5 font-mono"
                  />
                </div>

                <!-- Email Nhận Xác Nhận (3/12) -->
                <div class="lg:col-span-3 p-4 space-y-1">
                  <label class="text-xs font-semibold text-slate-400 block">Email Nhận Xác Nhận:</label>
                  <input
                    type="email"
                    id="vc-customer-email-input"
                    value=""
                    placeholder="Nhập email..."
                    class="editable-input w-full font-semibold text-sm text-slate-800 py-0.5"
                  />
                </div>
              </div>

              <!-- Bottom Row: Tình Trạng Thanh Toán (7/12) | Nhân Viên Điều Hành (5/12) -->
              <div class="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-slate-200 bg-slate-50/60">
                <!-- Tình Trạng Thanh Toán Với Đối Tác -->
                <div class="md:col-span-7 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span class="text-xs font-semibold text-slate-500">Tình Trạng Thanh Toán Với Đối Tác:</span>
                  <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-700">
                    <i class="fa-solid fa-circle-check text-emerald-600 shrink-0"></i>
                    <input
                      type="text"
                      id="vc-partner-payment-status"
                      value="ĐÃ THANH TOÁN 100% CHO RESORT"
                      class="editable-input bg-transparent font-bold text-xs text-emerald-800 tracking-wide w-64 sm:w-72"
                    />
                  </div>
                </div>

                <!-- Nhân Viên Điều Hành / Phụ Trách -->
                <div class="md:col-span-5 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span class="text-xs font-semibold text-slate-500 shrink-0">Nhân Viên Điều Hành / Phụ Trách:</span>
                  <input
                    type="text"
                    id="vc-staff-input"
                    value="Ban Giám Đốc • Booking Travel"
                    class="editable-input font-bold text-sm text-slate-900 sm:text-right w-full sm:w-48 py-0.5"
                  />
                </div>
              </div>
            </section>

            <!-- SECTION 3: ROOMING LIST -->
            <div class="space-y-1.5">
              <div class="flex items-center justify-between">
                <span class="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                  <i class="fa-solid fa-users text-blue-600"></i> DANH SÁCH KHÁCH LƯU TRÚ (ROOMING LIST):
                </span>
                <span class="text-[11px] text-slate-500 italic">Có thể thêm sửa trực tiếp tên & CCCD từng khách</span>
              </div>
              <textarea
                id="vc-rooming-list"
                rows="3"
                placeholder="Nhập danh sách khách: 1. NGUYỄN VĂN A (Đại diện - SĐT: 091...) - 2. TRẦN THỊ B (CCCD: 001...)"
                class="editable-input w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-xs text-slate-800 font-sans focus:outline-none focus:border-blue-500 shadow-inner"
              ></textarea>
            </div>

            <!-- QUYỀN LỢI & TIÊU CHUẨN DỊCH VỤ -->
            <div class="text-[11px] text-slate-700 bg-amber-50/80 border border-amber-200/90 p-3.5 rounded-xl space-y-1 leading-relaxed">
              <strong class="text-amber-900 font-extrabold flex items-center gap-1">
                <i class="fa-solid fa-shield-heart text-amber-600"></i> QUYỀN LỢI & TIÊU CHUẨN DỊCH VỤ BAO GỒM:
              </strong>
              <p>• <strong>Bữa ăn:</strong> Đã bao gồm buffet sáng hàng ngày theo đúng số lượng khách tiêu chuẩn của phòng.</p>
              <p>• <strong>Tiện ích resort:</strong> Miễn phí sử dụng hồ bơi, phòng gym, wifi toàn khu, trà / cà phê / nước suối setup hàng ngày.</p>
              <p>• <strong>Hỗ trợ đặc biệt:</strong> Kính nhờ Quý khách sạn đón tiếp chu đáo, hỗ trợ nhận phòng thuận tiện theo tinh thần <em>"Khách hàng là gia đình"</em>.</p>
            </div>

            <!-- CHÂN KÝ 2 BÊN -->
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
      </div>

      <!-- BOTTOM ACTION BAR -->
      <div class="no-print px-4 sm:px-6 py-3 border-t border-slate-800 bg-[#0f172a] flex flex-wrap items-center justify-between gap-3 shrink-0">
        <span class="text-xs text-slate-400 font-medium">Phiếu đầy đủ thông tin gửi cho Khách Hàng (Chuẩn Lữ Hành 5 Sao)</span>
        <div class="flex flex-wrap items-center gap-2">
          <button type="button" onclick="closeVoucherModal()" class="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold rounded-xl transition border border-slate-700 cursor-pointer flex items-center gap-1.5" title="Đóng modal">
            <i class="fa-solid fa-xmark"></i>
            <span>Đóng</span>
          </button>
          <button type="button" onclick="saveVoucherData()" class="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition border border-slate-700 cursor-pointer flex items-center gap-1.5">
            <i class="fa-solid fa-floppy-disk text-sky-400"></i>
            <span>Lưu Thông Tin</span>
          </button>
          <button type="button" onclick="copyVoucherToCustomerZalo()" class="px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer">
            <i class="fa-solid fa-paper-plane"></i>
            <span>Copy Zalo Gửi Khách Hàng</span>
          </button>
          <button type="button" onclick="openHotelVoucherModal(currentVoucherBookingId)" class="px-3.5 py-2 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer" title="Mở Phiếu Đặt Phòng gửi Khách Sạn / Resort">
            <i class="fa-solid fa-file-contract"></i>
            <span>Mở Phiếu Gửi KS/Resort</span>
          </button>
          <button type="button" onclick="printVoucher()" class="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition flex items-center gap-1.5 cursor-pointer">
            <i class="fa-solid fa-print"></i>
            <span>In / Lưu PDF Voucher</span>
          </button>
        </div>
      </div>

    </div>
  </div>
`;

// REPLACE #voucher-modal in HTML
const modalStart = content.indexOf('<div id="voucher-modal"');
const hotelModalStart = content.indexOf('<div id="hotel-voucher-modal"');

if (modalStart !== -1 && hotelModalStart !== -1) {
  content = content.substring(0, modalStart) + newModalHtml + '\n\n  ' + content.substring(hotelModalStart);
  console.log('Replaced #voucher-modal HTML successfully.');
} else {
  console.error('Could not find #voucher-modal boundaries!');
  process.exit(1);
}

// 3. UPDATE JAVASCRIPT FUNCTIONS FOR VOUCHER
// Update openVoucherModal
const openStart = content.indexOf('function openVoucherModal(bookingId) {');
const openEnd = content.indexOf('function openHotelConfirmModal(bookingId) {');

if (openStart !== -1 && openEnd !== -1) {
  const newOpenFunc = `function openVoucherModal(bookingId) {
      try {
        currentVoucherBookingId = bookingId;
        const b = bookings.find(x => x.id === bookingId);
        if (!b) {
          if (typeof showToast === 'function') showToast('Không tìm thấy dữ liệu đơn ' + bookingId, 'error');
          return;
        }

        const dIn = b.checkIn ? b.checkIn.split('-').reverse().join('/') : (b.ngayDi || '---');
        const dOut = b.checkOut ? b.checkOut.split('-').reverse().join('/') : (b.ngayVe || '---');

        // TÍNH TOÁN SỐ ĐÊM CHÍNH XÁC
        let nights = 1;
        if (b.checkIn && b.checkOut) {
          const d1 = new Date(b.checkIn);
          const d2 = new Date(b.checkOut);
          const diffTime = d2.getTime() - d1.getTime();
          const diffDays = Math.round(diffTime / (1000 * 3600 * 24));
          if (diffDays > 0) nights = diffDays;
        }
        if (b.soDem) nights = parseInt(b.soDem, 10) || nights;

        // PHÂN TÍCH SỐ LƯỢNG PHÒNG
        let roomQty = b.soLuongPhong || 1;
        if (!b.soLuongPhong && b.dichVu) {
          const m = b.dichVu.match(/(\\d+)\\s*(?:phòng|phong|căn|can|villa|ph)/i);
          if (m) roomQty = parseInt(m[1], 10);
        }

        // PHÂN TÍCH HẠNG PHÒNG
        let roomCategory = b.hangPhong || '';
        if (!roomCategory && b.dichVu) {
          let s = b.dichVu;
          if (b.doiTac && s.toLowerCase().startsWith(b.doiTac.toLowerCase())) {
            s = s.substring(b.doiTac.length).replace(/^[\\s\\-–—:]+/, '');
          }
          s = s.replace(/^\\d+\\s*(?:phòng|phong|căn|can|villa)\\s*[-–—:]*\\s*/i, '');
          s = s.replace(/\\(.*\\)/g, '').trim();
          roomCategory = s || b.dichVu;
        }
        if (!roomCategory) roomCategory = 'Suite City View';

        // PHÂN TÍCH SỐ LƯỢNG KHÁCH: NGƯỜI LỚN & TRẺ EM
        let adults = b.soNguoiLon ? parseInt(b.soNguoiLon, 10) : (roomQty * 2);
        let children = b.soTreEm ? parseInt(b.soTreEm, 10) : (b.childSurcharge?.count ? parseInt(b.childSurcharge.count, 10) : 0);
        if (!b.soNguoiLon && b.soKhach) {
          const mAdult = b.soKhach.match(/(\\d+)\\s*(?:người lớn|nl|nguoi lon|adult)/i);
          if (mAdult) adults = parseInt(mAdult[1], 10);
          const mChild = b.soKhach.match(/(\\d+)\\s*(?:trẻ em|te|tre em|child)/i);
          if (mChild) children = parseInt(mChild[1], 10);
        }

        // ĐIỀN THÔNG TIN VÀO PHIẾU VOUCHER
        const vcCodeEl = document.getElementById('vc-code');
        if (vcCodeEl) vcCodeEl.innerText = b.maBooking || 'DH1793116655774';
        
        const createdDateEl = document.getElementById('vc-booking-date');
        if (createdDateEl) {
          const cDate = b.ngayTao ? b.ngayTao.substring(0, 10).split('-').reverse().join('/') : '25/10/2026';
          createdDateEl.innerText = \`Ngày tạo: \${cDate}\`;
        }

        // Khách sạn & Địa chỉ
        const vcHotelName = document.getElementById('vc-hotel-name');
        if (vcHotelName) vcHotelName.value = b.doiTac || b.khachSan || 'Khách Sạn Rova Nha Trang';

        const vcHotelAddr = document.getElementById('vc-hotel-address');
        if (vcHotelAddr) vcHotelAddr.value = b.diaChiKS || b.hotelAddress || 'Số 07 Nguyễn Thiện Thuật, P. Lộc Thọ, TP. Nha Trang, Khánh Hòa';

        const vcResortCode = document.getElementById('vc-resort-code');
        if (vcResortCode) vcResortCode.value = b.codePhong || b.resortCode || '';

        // Hạng phòng, Số phòng, Số khách, Bữa ăn
        const roomCatInput = document.getElementById('vc-room-category-input');
        if (roomCatInput) roomCatInput.value = roomCategory;

        const roomQtyInput = document.getElementById('vc-room-qty-input');
        if (roomQtyInput) roomQtyInput.value = roomQty;

        const adultsInput = document.getElementById('vc-adults-input');
        if (adultsInput) adultsInput.value = adults;

        const childrenInput = document.getElementById('vc-children-input');
        if (childrenInput) childrenInput.value = children;

        const mealPlanInput = document.getElementById('vc-meal-plan-input');
        if (mealPlanInput) mealPlanInput.value = b.buaAn || 'Ăn sáng buffet hàng ngày';

        // Checkin / Checkout / Nights
        const checkinInput = document.getElementById('vc-checkin-input');
        if (checkinInput) checkinInput.value = \`14:00 - \${dIn}\`;

        const checkoutInput = document.getElementById('vc-checkout-input');
        if (checkoutInput) checkoutInput.value = \`12:00 - \${dOut}\`;

        const nightInput = document.getElementById('vc-night-qty-input');
        if (nightInput) nightInput.value = \`\${nights} Đêm\`;

        // Thông tin khách hàng
        const custNameInput = document.getElementById('vc-customer-name-input');
        if (custNameInput) custNameInput.value = (b.khachHang || 'Khách Hàng').toUpperCase();

        const custPhoneInput = document.getElementById('vc-customer-phone-input');
        if (custPhoneInput) custPhoneInput.value = b.sdt || '';

        const custCccdInput = document.getElementById('vc-customer-cccd-input');
        if (custCccdInput) custCccdInput.value = b.cccd || '';

        const custEmailInput = document.getElementById('vc-customer-email-input');
        if (custEmailInput) custEmailInput.value = b.email || '';

        // Tình trạng thanh toán đối tác
        const partnerStatusInput = document.getElementById('vc-partner-payment-status');
        if (partnerStatusInput) {
          if (parseFloat(b.daTraDoiTac) >= parseFloat(b.giaVon) && parseFloat(b.giaVon) > 0) {
            partnerStatusInput.value = 'ĐÃ THANH TOÁN 100% CHO RESORT';
          } else if (parseFloat(b.daTraDoiTac) > 0) {
            partnerStatusInput.value = 'ĐÃ CỌC GIỮ CHỖ VỚI RESORT';
          } else {
            partnerStatusInput.value = 'ĐÃ XÁC NHẬN ĐẶT PHÒNG';
          }
        }

        // Nhân viên điều hành
        const staffInput = document.getElementById('vc-staff-input');
        if (staffInput) staffInput.value = b.tuVanName || b.saleName || (currentUser ? currentUser.name : 'Ban Giám Đốc • Booking Travel');

        // Rooming List
        const defaultRooming = b.cccd ? 
          \`1. \${(b.khachHang || '').toUpperCase()} (Đại diện đoàn - CCCD: \${b.cccd} - SĐT: \${b.sdt || ''})\` : 
          \`1. \${(b.khachHang || '').toUpperCase()} (Đại diện đoàn - SĐT: \${b.sdt || ''})\`;
        const vcRoomingEl = document.getElementById('vc-rooming-list');
        if (vcRoomingEl) vcRoomingEl.value = b.roomingList || defaultRooming;

        // Reset edit mode to true by default
        isVoucherEditMode = true;
        const modalEl = document.getElementById('voucher-modal');
        if (modalEl) {
          modalEl.classList.remove('hidden', 'preview-mode');
          modalEl.classList.add('edit-mode');
        }
        const modeIcon = document.getElementById('voucherModeIcon');
        const modeText = document.getElementById('voucherModeText');
        if (modeIcon) modeIcon.className = 'fa-solid fa-eye text-sky-400';
        if (modeText) modeText.textContent = 'Xem bản in sạch';
        const inputs = modalEl ? modalEl.querySelectorAll('.editable-input') : [];
        inputs.forEach(inp => inp.removeAttribute('readonly'));
      } catch (err) {
        console.error('Lỗi khi mở Voucher:', err);
        closeVoucherModal();
        if (typeof showToast === 'function') {
          showToast('Không thể mở phiếu xác nhận: ' + err.message, 'error');
        } else {
          alert('⚠️ Có lỗi hiển thị phiếu xác nhận: ' + err.message);
        }
      }
    }

    // =========================================================================
    `;
  content = content.substring(0, openStart) + newOpenFunc + content.substring(openEnd - 80);
  console.log('Replaced openVoucherModal successfully.');
} else {
  console.error('Could not find openVoucherModal boundaries!');
  process.exit(1);
}

// Update closeVoucherModal, saveVoucherData, copyVoucherToCustomerZalo, printVoucher, and add helpers
const closeStart = content.indexOf('function closeVoucherModal() {');
const printEnd = content.indexOf('// =========================================================================\n    // 3. CHĂM SÓC SINH NHẬT & TRI ÂN GIA ĐÌNH KHÁCH HÀNG (BOOKING TRAVEL)');

if (closeStart !== -1 && printEnd !== -1) {
  const newVoucherFuncs = `let isVoucherEditMode = true;

    function toggleVoucherEditMode() {
      isVoucherEditMode = !isVoucherEditMode;
      const modal = document.getElementById('voucher-modal');
      const modeIcon = document.getElementById('voucherModeIcon');
      const modeText = document.getElementById('voucherModeText');
      const inputs = modal ? modal.querySelectorAll('.editable-input') : [];
      const fields = modal ? modal.querySelectorAll('.editable-field') : [];

      if (isVoucherEditMode) {
        if (modal) {
          modal.classList.remove('preview-mode');
          modal.classList.add('edit-mode');
        }
        if (modeIcon) modeIcon.className = 'fa-solid fa-eye text-sky-400';
        if (modeText) modeText.textContent = 'Xem bản in sạch';
        inputs.forEach(inp => inp.removeAttribute('readonly'));
        fields.forEach(f => f.setAttribute('contenteditable', 'true'));
        if (typeof showToast === 'function') showToast('Đã bật Chế độ chỉnh sửa Voucher', 'info');
      } else {
        if (modal) {
          modal.classList.remove('edit-mode');
          modal.classList.add('preview-mode');
        }
        if (modeIcon) modeIcon.className = 'fa-solid fa-pen-to-square text-amber-400';
        if (modeText) modeText.textContent = 'Bật chỉnh sửa';
        inputs.forEach(inp => inp.setAttribute('readonly', 'true'));
        fields.forEach(f => f.setAttribute('contenteditable', 'false'));
        if (typeof showToast === 'function') showToast('Đang hiển thị Bản in sạch gửi Khách hàng', 'success');
      }
    }

    function triggerLogoUpload() {
      if (!isVoucherEditMode) return;
      const input = document.getElementById('logoUploadInput');
      if (input) input.click();
    }

    function handleLogoChange(event) {
      const file = event.target.files && event.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function(e) {
        const img = document.getElementById('customLogoImg');
        const svg = document.getElementById('defaultLogoSvg');
        if (img && svg) {
          img.src = e.target.result;
          img.classList.remove('hidden');
          svg.classList.add('hidden');
        }
        if (typeof showToast === 'function') showToast('Đã cập nhật Logo từ máy tính của bạn', 'success');
      };
      reader.readAsDataURL(file);
    }

    function copyInput(inputId, label) {
      const el = document.getElementById(inputId);
      const val = el ? el.value.trim() : '';
      if (!val) {
        if (typeof showToast === 'function') showToast(\`Chưa có nội dung \${label} để sao chép\`, 'warning');
        return;
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(val).then(() => {
          if (typeof showToast === 'function') showToast(\`Đã sao chép \${label}: \${val}\`, 'success');
        });
      } else {
        const ta = document.createElement('textarea');
        ta.value = val;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        if (typeof showToast === 'function') showToast(\`Đã sao chép \${label}: \${val}\`, 'success');
      }
    }

    function copyElementText(elementId, label) {
      const el = document.getElementById(elementId);
      const val = el ? (el.value !== undefined ? el.value : el.innerText).trim() : '';
      if (!val) return;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(val).then(() => {
          if (typeof showToast === 'function') showToast(\`Đã sao chép \${label}: \${val}\`, 'success');
        });
      } else {
        const ta = document.createElement('textarea');
        ta.value = val;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        if (typeof showToast === 'function') showToast(\`Đã sao chép \${label}: \${val}\`, 'success');
      }
    }

    function closeVoucherModal() {
      const modal = document.getElementById('voucher-modal');
      if (modal) modal.classList.add('hidden');
    }

    function saveVoucherData() {
      if (!currentVoucherBookingId) return;
      const b = bookings.find(x => x.id === currentVoucherBookingId);
      if (!b) return;

      const rCodeInp = document.getElementById('vc-resort-code');
      if (rCodeInp) {
        b.codePhong = rCodeInp.value.trim();
        b.resortCode = rCodeInp.value.trim();
      }

      const hotelNameInp = document.getElementById('vc-hotel-name');
      if (hotelNameInp && hotelNameInp.value.trim()) b.doiTac = hotelNameInp.value.trim();

      const hotelAddrInp = document.getElementById('vc-hotel-address');
      if (hotelAddrInp) b.diaChiKS = hotelAddrInp.value.trim();

      const roomCatInput = document.getElementById('vc-room-category-input');
      if (roomCatInput) b.hangPhong = roomCatInput.value.trim();

      const roomQtyInput = document.getElementById('vc-room-qty-input');
      if (roomQtyInput) b.soLuongPhong = parseInt(roomQtyInput.value, 10) || 1;

      const adultsInput = document.getElementById('vc-adults-input');
      const childrenInput = document.getElementById('vc-children-input');
      if (adultsInput) {
        const adults = parseInt(adultsInput.value, 10) || 0;
        const children = childrenInput ? (parseInt(childrenInput.value, 10) || 0) : 0;
        b.soNguoiLon = adults;
        b.soTreEm = children;
        b.soKhach = \`\${adults} Người lớn\` + (children > 0 ? \` + \${children} Trẻ em\` : '');
      }

      const mealInp = document.getElementById('vc-meal-plan-input');
      if (mealInp) b.buaAn = mealInp.value.trim();

      const cccdInp = document.getElementById('vc-customer-cccd-input');
      if (cccdInp) b.cccd = cccdInp.value.trim();

      const emailInp = document.getElementById('vc-customer-email-input');
      if (emailInp) b.email = emailInp.value.trim();

      const roomingEl = document.getElementById('vc-rooming-list');
      if (roomingEl) b.roomingList = roomingEl.value.trim();

      saveData();
      renderTable();
      if (typeof showToast === 'function') {
        showToast(\`Đã lưu thành công thông tin Voucher cho đơn [\${b.maBooking}]!\`, 'success');
      } else {
        alert('✅ ĐÃ LƯU THÀNH CÔNG VOUCHER & ROOMING LIST CHO BOOKING [' + b.maBooking + ']!');
      }
    }

    // 1. COPY SOẠN TIN NHẮN ZALO GỬI KHÁCH HÀNG (ĐẦY ĐỦ THÔNG TIN SỐ PHÒNG, SỐ NGƯỜI, SỐ ĐÊM, HẠNG PHÒNG)
    function copyVoucherToCustomerZalo() {
      if (!currentVoucherBookingId) return;
      const b = bookings.find(x => x.id === currentVoucherBookingId);
      if (!b) return;

      const dIn = b.checkIn ? b.checkIn.split('-').reverse().join('/') : (b.ngayDi || '---');
      const dOut = b.checkOut ? b.checkOut.split('-').reverse().join('/') : (b.ngayVe || '---');
      
      const resortCode = document.getElementById('vc-resort-code') ? document.getElementById('vc-resort-code').value.trim() : (b.codePhong || b.resortCode || '');
      const hotelName = document.getElementById('vc-hotel-name') ? document.getElementById('vc-hotel-name').value.trim() : (b.doiTac || 'Khách sạn / Resort');
      const hotelAddr = document.getElementById('vc-hotel-address') ? document.getElementById('vc-hotel-address').value.trim() : (b.diaChiKS || '');
      const roomCat = document.getElementById('vc-room-category-input') ? document.getElementById('vc-room-category-input').value.trim() : (b.hangPhong || b.dichVu || 'Hạng phòng cao cấp');
      const roomQty = document.getElementById('vc-room-qty-input') ? document.getElementById('vc-room-qty-input').value.trim() : (b.soLuongPhong || '1');
      
      const adults = document.getElementById('vc-adults-input') ? document.getElementById('vc-adults-input').value.trim() : (b.soNguoiLon || '2');
      const children = document.getElementById('vc-children-input') ? document.getElementById('vc-children-input').value.trim() : (b.soTreEm || '0');
      const guestText = parseInt(children, 10) > 0 ? \`\${adults} Người lớn + \${children} Trẻ em\` : \`\${adults} Người lớn\`;
      
      const nights = document.getElementById('vc-night-qty-input') ? document.getElementById('vc-night-qty-input').value.trim() : '1 Đêm';
      const mealPlan = document.getElementById('vc-meal-plan-input') ? document.getElementById('vc-meal-plan-input').value.trim() : (b.buaAn || 'Ăn sáng buffet hàng ngày');
      const roomingList = document.getElementById('vc-rooming-list') ? document.getElementById('vc-rooming-list').value.trim() : '';

      const text = 
\`🎉 [BOOKING TRAVEL] XÁC NHẬN ĐẶT PHÒNG THÀNH CÔNG 🎉
"Khách hàng là gia đình" • Hotline: 0846.477.222

Kính gửi Quý khách: \${(b.khachHang || '').toUpperCase()}
Booking Travel xin trân trọng gửi Quý khách thông tin Phiếu xác nhận đặt phòng (Voucher) chi tiết:

🏷️ Mã Đặt Chỗ: \${b.maBooking}
🔑 Mã Xác Nhận Khách Sạn: \${resortCode || 'Đã chốt giữ phòng thành công'}
🏨 Khách Sạn / Resort: \${hotelName}
📍 Địa chỉ: \${hotelAddr || 'Trung tâm thành phố'}
🛏️ Hạng Phòng: \${roomCat}
🔢 Số Lượng Phòng: \${roomQty} Phòng
👥 Số Lượng Khách: \${guestText}
🌙 Tổng Số Đêm: \${nights}
📅 Thời Gian Lưu Trú:
   • Check-in (Nhận phòng): Từ 14:00 ngày \${dIn}
   • Check-out (Trả phòng): Trước 12:00 ngày \${dOut}
🍽️ Tiêu Chuẩn Bữa Ăn: \${mealPlan}
✨ Tiện Ích Miễn Phí: Sử dụng hồ bơi, phòng gym, wifi toàn khu, trà/cà phê/nước suối trong phòng mỗi ngày.

👥 Danh Sách Khách Lưu Trú (Rooming List):
\${roomingList || ('1. ' + (b.khachHang || '').toUpperCase())}

❤️ Quý khách chỉ cần đọc Họ Tên đại diện (\${(b.khachHang || '').toUpperCase()}) hoặc Số điện thoại (\${b.sdt || ''}) tại quầy Lễ tân để nhận phòng dễ dàng.
Booking Travel kính chúc Quý khách và gia đình có một kỳ nghỉ thật vui vẻ, hạnh phúc và trọn vẹn!
☎️ Tổng đài hỗ trợ 24/7: 0846.477.222
🌐 Cổng thông tin: https://bookingtravel.vn\`;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          if (typeof showToast === 'function') showToast('Đã sao chép mẫu Zalo gửi Khách hàng thành công!', 'success');
          else alert('📋 ĐÃ SAO CHÉP MẪU TIN NHẮN ĐẦY ĐỦ CHO KHÁCH HÀNG!\\nBạn có thể dán (Ctrl+V) gửi ngay cho khách qua Zalo.');
        }).catch(() => {
          alert('Vui lòng cấp quyền clipboard để sao chép.');
        });
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        if (typeof showToast === 'function') showToast('Đã sao chép mẫu Zalo gửi Khách hàng thành công!', 'success');
        else alert('📋 ĐÃ SAO CHÉP MẪU TIN NHẮN ĐẦY ĐỦ CHO KHÁCH HÀNG!');
      }
    }

    // 2. COPY XÁC NHẬN GỬI BỘ PHẬN ĐẶT PHÒNG KHÁCH SẠN / RESORT
    function copyVoucherToZalo() {
      if (!currentVoucherBookingId) return;
      const b = bookings.find(x => x.id === currentVoucherBookingId);
      if (!b) return;

      const dIn = b.checkIn ? b.checkIn.split('-').reverse().join('/') : (b.ngayDi || '---');
      const dOut = b.checkOut ? b.checkOut.split('-').reverse().join('/') : (b.ngayVe || '---');
      const resortCode = document.getElementById('vc-resort-code') ? document.getElementById('vc-resort-code').value.trim() : (b.codePhong || b.resortCode || '');
      const roomCat = document.getElementById('vc-room-category-input') ? document.getElementById('vc-room-category-input').value.trim() : (b.hangPhong || b.dichVu);
      const roomQty = document.getElementById('vc-room-qty-input') ? document.getElementById('vc-room-qty-input').value.trim() : (b.soLuongPhong || '1');
      const adults = document.getElementById('vc-adults-input') ? document.getElementById('vc-adults-input').value.trim() : (b.soNguoiLon || '2');
      const children = document.getElementById('vc-children-input') ? document.getElementById('vc-children-input').value.trim() : (b.soTreEm || '0');
      const guestText = parseInt(children, 10) > 0 ? \`\${adults} Người lớn + \${children} Trẻ em\` : \`\${adults} Người lớn\`;
      const nights = document.getElementById('vc-night-qty-input') ? document.getElementById('vc-night-qty-input').value.trim() : '1 Đêm';
      const roomingList = document.getElementById('vc-rooming-list') ? document.getElementById('vc-rooming-list').value.trim() : '';

      const text = 
\`📄 [BOOKING TRAVEL] PHIẾU XÁC NHẬN DỊCH VỤ & ROOMING LIST 📄
Kính gửi: Bộ phận Đặt phòng / Lễ tân \${b.doiTac || 'Khách sạn / Resort'}
Booking Travel xin gửi thông tin xác nhận đoàn khách lưu trú:

🏷️ Mã Booking CRM: \${b.maBooking}
🔑 Mã Xác Nhận Resort: \${resortCode || 'Chờ cấp mã'}
👤 Khách hàng đại diện: \${(b.khachHang || '').toUpperCase()} - SĐT: \${b.sdt || ''}\${b.cccd ? ' - CCCD: ' + b.cccd : ''}\${b.email ? ' - Email: ' + b.email : ''}
🏨 Hạng Phòng: \${roomCat}
🔢 Số Lượng Phòng: \${roomQty} Phòng
👥 Số Lượng Khách: \${guestText}
🌙 Tổng Số Đêm: \${nights}
📅 Thời Gian Lưu Trú: \${dIn} đến \${dOut}
   • Check-in: Từ 14:00 ngày \${dIn}
   • Check-out: Trước 12:00 ngày \${dOut}
🍽️ Tiêu chuẩn bữa ăn: Ăn sáng buffet hàng ngày
👥 Danh sách đoàn (Rooming List):
\${roomingList || ('1. ' + (b.khachHang || '').toUpperCase())}

✨ Kính nhờ Quý khách sạn setup phòng sạch đẹp, đón tiếp khách chu đáo theo tinh thần "Khách hàng là gia đình"!
☎️ Hotline Điều hành Booking Travel: 0846.477.222\`;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          if (typeof showToast === 'function') showToast('Đã sao chép mẫu xác nhận gửi Resort!', 'success');
          else alert('📋 ĐÃ SAO CHÉP MẪU TIN NHẮN GỬI RESORT!\\nBạn có thể dán (Ctrl+V) gửi ngay cho bộ phận đặt phòng của khách sạn.');
        });
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        if (typeof showToast === 'function') showToast('Đã sao chép mẫu xác nhận gửi Resort!', 'success');
        else alert('📋 ĐÃ SAO CHÉP MẪU TIN NHẮN GỬI RESORT!');
      }
    }

    // 2.3 BẮN THÔNG BÁO VÀO NHÓM ZALO ĐIỀU HÀNH NỘI BỘ (https://zalo.me/g/mtbelj694)
    function shareBookingToZaloGroup(bookingId) {
      const b = bookings.find(x => x.id === bookingId);
      if (!b) return;

      const dIn = b.checkIn ? b.checkIn.split('-').reverse().join('/') : (b.ngayDi || '---');
      const dOut = b.checkOut ? b.checkOut.split('-').reverse().join('/') : (b.ngayVe || '---');
      
      let nights = 1;
      if (b.checkIn && b.checkOut) {
        const d1 = new Date(b.checkIn);
        const d2 = new Date(b.checkOut);
        const diffDays = Math.round((d2 - d1) / (1000 * 3600 * 24));
        if (diffDays > 0) nights = diffDays;
      }
      if (b.soDem) nights = parseInt(b.soDem, 10) || nights;

      const roomQty = b.soLuongPhong || 1;
      const roomCat = b.hangPhong || b.dichVu || 'Phòng nghỉ dưỡng cao cấp';
      const guestQty = b.soKhach || '2 Người lớn';
      const tongThu = Number(b.giaBan || 0);
      const daThu = Number(b.khachDaCoc || 0);
      const giaVon = Number(b.giaVon || 0);
      const loiNhuan = tongThu - giaVon;
      const sale = b.saleEmail || (currentUser ? currentUser.email : 'Ban Giám Đốc');
      const bank = (b.payments && b.payments[0]) ? b.payments[0].hinhThuc : 'Techcombank';

      const msg = 
\`🚨 [BOOKING TRAVEL] CÓ ĐƠN HÀNG MỚI!

• Mã Booking: \${b.maBooking}
• Khách Hàng: \${b.khachHang}\${b.sdt ? \` (\${b.sdt})\` : ''}
• Đối Tác / Khách Sạn: \${b.doiTac || 'Khách sạn / Resort'}
• Hạng Phòng: \${roomCat}
• Số Lượng: \${roomQty} Phòng | \${guestQty} | \${nights} Đêm
• Lịch Trình: \${dIn} ➔ \${dOut}
• Tổng Doanh Thu: \${tongThu.toLocaleString('vi-VN')} đ
• Đã Thu Đợt Này: \${daThu.toLocaleString('vi-VN')} đ (\${bank})
• Lợi Nhuận Gộp: \${loiNhuan.toLocaleString('vi-VN')} đ
• Nhân Viên Sale: \${sale}

✨ Triết lý: "Khách hàng là gia đình" - Booking Travel
👉 Nhóm Điều Hành: https://zalo.me/g/mtbelj694\`;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(msg).then(() => {
          window.open('https://zalo.me/g/mtbelj694', '_blank');
          alert('✅ ĐÃ SAO CHÉP THÔNG BÁO ĐƠN [' + b.maBooking + ']!\\n\\nĐang mở Nhóm Zalo Điều Hành (https://zalo.me/g/mtbelj694).\\nBạn chỉ cần bấm Dán (Ctrl + V) và Gửi tin nhắn là xong!');
        }).catch(() => {
          window.open('https://zalo.me/g/mtbelj694', '_blank');
        });
      } else {
        window.open('https://zalo.me/g/mtbelj694', '_blank');
      }
    }

    // 3. IN VOUCHER CHUẨN A4 ĐẦY ĐỦ THÔNG TIN
    function printVoucher() {
      const printableArea = document.getElementById('voucher-printable-area').cloneNode(true);

      // Convert inputs to plain typography spans for clean print
      const allInputs = printableArea.querySelectorAll('input, textarea');
      allInputs.forEach(inp => {
        if (inp.type === 'file') {
          inp.remove();
          return;
        }
        const val = inp.value !== undefined ? inp.value : '';
        const span = document.createElement('span');
        span.className = (inp.className || '').replace(/editable-input/g, '') + ' inline-block';
        span.style.background = 'transparent';
        span.style.border = 'none';
        span.style.boxShadow = 'none';
        span.style.padding = '0';
        span.innerText = val;
        inp.parentNode.replaceChild(span, inp);
      });

      // Remove no-print and hint elements
      printableArea.querySelectorAll('.no-print, .edit-only-hint').forEach(el => el.remove());

      const win = window.open('', '_blank', 'width=900,height=950');
      win.document.write(\`
        <!DOCTYPE html>
        <html lang="vi">
          <head>
            <meta charset="UTF-8">
            <title>Phiếu Xác Nhận Dịch Vụ - Booking Travel</title>
            <script src="https://cdn.tailwindcss.com"><\\/script>
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@600;700;800&display=swap" rel="stylesheet">
            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
            <style>
              body { 
                font-family: 'Inter', sans-serif; 
                padding: 16px; 
                background: #ffffff; 
                color: #0f172a; 
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
              @page { 
                size: A4 portrait; 
                margin: 8mm; 
              }
              @media print {
                body { padding: 0 !important; }
                .no-print { display: none !important; }
                #voucher-printable-area { box-shadow: none !important; border: 1px solid #cbd5e1 !important; }
              }
            </style>
          </head>
          <body onload="setTimeout(function(){ window.print(); }, 400)">
            <div class="max-w-4xl mx-auto">
              \${printableArea.outerHTML}
            </div>
          </body>
        </html>
      \`);
      win.document.close();
    }

    `;
  content = content.substring(0, closeStart) + newVoucherFuncs + content.substring(printEnd);
  console.log('Replaced voucher functions successfully.');
} else {
  console.error('Could not find closeVoucherModal / printVoucher boundaries!');
  process.exit(1);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('Updated CRM_Booking.html successfully! New length:', content.length);

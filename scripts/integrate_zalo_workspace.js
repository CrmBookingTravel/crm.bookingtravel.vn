const fs = require('fs');
const path = require('path');

const targetPath = path.join(__dirname, '..', 'CRM_Booking.html');
let html = fs.readFileSync(targetPath, 'utf8');

// 1. Prepare Replacement HTML for Modal 4
const modalHtml = `  <!-- ========================================================================= -->
  <!-- MODAL 4: PHÂN HỆ ZALO CSKH & ĐIỀU HÀNH DỊCH VỤ WORKSPACE -->
  <!-- ========================================================================= -->
  <div id="tool-zalo-modal" class="fixed inset-0 z-50 overflow-hidden hidden flex items-center justify-center p-2 sm:p-3">
    <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" onclick="closeToolZaloModal()"></div>
    <div class="relative bg-slate-100 rounded-2xl max-w-7xl w-full shadow-2xl z-10 flex flex-col max-h-[96vh] overflow-y-auto scrollbar-thin text-slate-800">
      
      <!-- THANH CÔNG CỤ ĐỒNG BỘ CRM & TRẠNG THÁI PHIÊN ZALO -->
      <div class="bg-white rounded-t-2xl shadow-sm border-b p-3 flex flex-wrap justify-between items-center gap-3">
        <div class="flex items-center space-x-3">
          <div class="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-lg shadow">
            <i class="fa-solid fa-headset"></i>
          </div>
          <div>
            <h2 class="font-bold text-base text-slate-800 flex items-center gap-2">
              <span>PHÂN HỆ ZALO CSKH & ĐIỀU HÀNH DỊCH VỤ</span>
              <span class="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full border border-blue-200">Đồng Bộ CRM</span>
            </h2>
            <p class="text-xs text-slate-500">Đồng bộ trực tiếp dữ liệu Booking CRM • Tự động hóa nhắc lịch & Biểu mẫu</p>
          </div>
        </div>

        <!-- Chọn Nhân viên trực & Kết nối Phiên Zalo -->
        <div class="flex items-center flex-wrap gap-2">
          <div class="flex items-center bg-slate-100 px-2.5 py-1.5 rounded-lg border text-xs">
            <i class="fa-solid fa-user-tie text-blue-600 mr-1.5"></i>
            <span class="text-gray-500 mr-1">Nhân sự trực:</span>
            <select id="crmStaffSelect" onchange="CRMZalo.saveState()" class="bg-transparent font-bold text-slate-800 focus:outline-none">
              <option value="Ngô Thị Băng Kiều (084.64.55.222)">Băng Kiều (Quản lý KD)</option>
              <option value="Thắng (NV Kinh Doanh)">Thắng (NV Kinh Doanh)</option>
              <option value="Linh (NV Kinh Doanh)">Linh (NV Kinh Doanh)</option>
              <option value="Bùi Phạm Quỳnh Chi (Giám đốc)">Bùi Phạm Quỳnh Chi (Giám đốc)</option>
            </select>
          </div>

          <button onclick="CRMZalo.openLoginModal()" class="bg-slate-800 hover:bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer">
            <i class="fa-solid fa-qrcode mr-1"></i> Cấu hình Đăng nhập (QR / ID-Pass)
          </button>

          <button onclick="CRMZalo.openDockedZalo()" class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow transition cursor-pointer">
            <i class="fa-solid fa-window-restore mr-1"></i> Mở Cửa Sổ Zalo Web Kép
          </button>

          <button onclick="closeToolZaloModal()" class="bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200 px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 cursor-pointer">
            <i class="fa-solid fa-xmark text-sm"></i> Đóng
          </button>
        </div>
      </div>

      <!-- LƯỚI GIAO DIỆN 3 PHÂN KHU TRONG CRM -->
      <div class="p-3 grid grid-cols-12 gap-3">

        <!-- CỘT 1 (3 CỘT): DANH SÁCH KHÁCH HÀNG TỪ CRM & PHÂN LOẠI GROUP -->
        <div class="col-span-12 lg:col-span-3 bg-white rounded-xl shadow-sm border flex flex-col h-[78vh]">
          <div class="p-3 border-b">
            <div class="flex justify-between items-center mb-2">
              <span class="text-xs font-bold uppercase text-slate-500">Danh sách Khách & Đơn CRM</span>
              <button onclick="CRMZalo.openNewCustomerModal()" class="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-bold hover:bg-blue-100 cursor-pointer">+ Thêm khách</button>
            </div>
            <input id="crmSearchInput" oninput="CRMZalo.renderContacts()" type="text" placeholder="Tìm tên, SĐT, mã booking..." class="w-full px-3 py-1.5 bg-slate-100 rounded-lg text-xs focus:outline-blue-500 border border-slate-200">
            
            <!-- Bộ lọc Nhãn Phân loại -->
            <div class="grid grid-cols-4 gap-1 mt-2 text-[11px] font-bold">
              <button onclick="CRMZalo.setFilter('ALL')" class="py-1 rounded bg-slate-800 text-white">Tất cả</button>
              <button onclick="CRMZalo.setFilter('Khách lẻ')" class="py-1 rounded bg-blue-100 text-blue-700">Khách lẻ</button>
              <button onclick="CRMZalo.setFilter('CTV')" class="py-1 rounded bg-orange-100 text-orange-700">CTV</button>
              <button onclick="CRMZalo.setFilter('Công ty')" class="py-1 rounded bg-purple-100 text-purple-700">Công ty</button>
            </div>
          </div>

          <!-- Danh sách Khách hàng đồng bộ từ CRM -->
          <div id="crmContactList" class="flex-1 overflow-y-auto divide-y text-xs scrollbar-thin"></div>

          <!-- Khu vực Quản lý Group Phòng Ban & Đối Tác -->
          <div class="p-3 bg-slate-50 border-t rounded-b-xl">
            <div class="text-[11px] font-bold text-slate-500 uppercase mb-2 flex justify-between">
              <span><i class="fa-solid fa-sitemap mr-1 text-blue-600"></i>Group Kết nối Phòng ban & Đối tác</span>
            </div>
            <div class="space-y-1.5 text-xs max-h-40 overflow-y-auto scrollbar-thin">
              <div onclick="CRMZalo.selectGroup('GRP_DIEU_HANH', '[NỘI BỘ] Sales - Điều Hành Tour & Xe', 'Phòng ban')" class="p-2 bg-red-50 hover:bg-red-100 border border-red-200 rounded-lg cursor-pointer flex justify-between items-center transition">
                <span class="font-bold text-red-800 truncate"><i class="fa-solid fa-users-gear mr-1"></i>Sales - Điều Hành Tour/Xe</span>
                <span class="text-[10px] bg-red-600 text-white px-1.5 py-0.5 rounded font-bold">Nội bộ</span>
              </div>
              <div onclick="CRMZalo.selectGroup('GRP_KE_TOAN', '[NỘI BỘ] Sales - Kế Toán Đối Soát Cọc', 'Phòng ban')" class="p-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg cursor-pointer flex justify-between items-center transition">
                <span class="font-bold text-amber-800 truncate"><i class="fa-solid fa-file-invoice-dollar mr-1"></i>Sales - Kế Toán Đối Soát</span>
                <span class="text-[10px] bg-amber-600 text-white px-1.5 py-0.5 rounded font-bold">Nội bộ</span>
              </div>
              <div onclick="CRMZalo.selectGroup('GRP_BGD', '[NỘI BỘ] Ban Giám Đốc - Phê Duyệt Giá', 'Phòng ban')" class="p-2 bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg cursor-pointer flex justify-between items-center transition">
                <span class="font-bold text-purple-800 truncate"><i class="fa-solid fa-user-shield mr-1"></i>BGD - Kinh Doanh</span>
                <span class="text-[10px] bg-purple-600 text-white px-1.5 py-0.5 rounded font-bold">Nội bộ</span>
              </div>
              <div onclick="CRMZalo.selectGroup('GRP_XE_SANBAY', '[ĐỐI TÁC] Đội Xe Sân Bay & Giao Xe Máy', 'Đối tác')" class="p-2 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg cursor-pointer flex justify-between items-center transition">
                <span class="font-bold text-emerald-800 truncate"><i class="fa-solid fa-car-side mr-1"></i>Đội Xe Sân Bay & Xe Máy</span>
                <span class="text-[10px] bg-emerald-600 text-white px-1.5 py-0.5 rounded font-bold">Nhà CC</span>
              </div>
            </div>
          </div>
        </div>

        <!-- CỘT 2 (5 CỘT): THÔNG TIN BOOKING CRM & SOẠN BIỂU MẪU TỰ ĐỘNG -->
        <div class="col-span-12 lg:col-span-5 bg-white rounded-xl shadow-sm border flex flex-col h-[78vh]">
          
          <!-- Thông tin Khách hàng & Đơn hàng đang chọn -->
          <div class="p-3 border-b bg-slate-50/70">
            <div class="flex justify-between items-start">
              <div>
                <div class="flex items-center gap-2">
                  <h3 id="activeCustName" class="font-bold text-base text-slate-900">--</h3>
                  <span id="activeCustType" class="px-2 py-0.5 text-[11px] font-bold bg-blue-100 text-blue-700 rounded">--</span>
                  <span id="activeCustStatus" class="px-2 py-0.5 text-[11px] font-bold bg-amber-100 text-amber-700 rounded">--</span>
                </div>
                <p class="text-xs text-slate-500 mt-0.5">
                  SĐT Zalo: <b id="activeCustPhone" class="text-blue-600 font-mono">--</b> • Mã đơn: <b id="activeBookingCode" class="font-mono">--</b> • Sale: <b id="activeSaleName">--</b>
                </p>
              </div>
              <!-- Nút Mở thẳng Zalo cá nhân của khách bằng SĐT -->
              <button onclick="CRMZalo.openDirectZaloChat()" class="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1.5 transition cursor-pointer">
                <i class="fa-solid fa-up-right-from-square"></i> Chat Zalo Khách
              </button>
            </div>

            <!-- Khung chỉnh nhanh dữ liệu Booking để tự động điền vào Biểu mẫu -->
            <div class="grid grid-cols-3 gap-2 mt-2.5 pt-2.5 border-t text-xs">
              <div>
                <label class="text-[10px] text-gray-500 font-semibold uppercase">Khách sạn / Dịch vụ</label>
                <input id="bindHotel" oninput="CRMZalo.updateActiveBooking()" type="text" class="w-full mt-0.5 px-2 py-1 border rounded bg-white font-medium">
              </div>
              <div>
                <label class="text-[10px] text-gray-500 font-semibold uppercase">Ngày Check-in</label>
                <input id="bindCheckin" oninput="CRMZalo.updateActiveBooking()" type="text" class="w-full mt-0.5 px-2 py-1 border rounded bg-white font-medium">
              </div>
              <div>
                <label class="text-[10px] text-gray-500 font-semibold uppercase">Ngày Check-out</label>
                <input id="bindCheckout" oninput="CRMZalo.updateActiveBooking()" type="text" class="w-full mt-0.5 px-2 py-1 border rounded bg-white font-medium">
              </div>
            </div>

            <!-- Đổi nhãn phân loại & Nhãn trạng thái nhanh -->
            <div class="flex gap-2 mt-2 text-xs">
              <select id="changeTypeSelect" onchange="CRMZalo.updateTag('type', this.value)" class="border rounded px-2 py-1 bg-white">
                <option value="Khách lẻ">Phân loại: Khách lẻ</option>
                <option value="CTV">Phân loại: Cộng tác viên (CTV)</option>
                <option value="Công ty">Phân loại: Công ty (B2B)</option>
              </select>
              <select id="changeStatusSelect" onchange="CRMZalo.updateTag('status', this.value)" class="border rounded px-2 py-1 bg-white flex-1">
                <option value="Đang tư vấn">Nhãn nhắc: Đang tư vấn</option>
                <option value="Chờ chuyển cọc">Nhãn nhắc: Chờ chuyển cọc</option>
                <option value="Đã xuất Booking">Nhãn nhắc: Đã xuất Booking</option>
                <option value="Cần đón sân bay / Giao xe">Nhãn nhắc: Cần đón sân bay / Giao xe</option>
                <option value="Đang lưu trú (In-house)">Nhãn nhắc: Đang lưu trú (In-house)</option>
                <option value="Đã Check-out • Chờ chăm sóc">Nhãn nhắc: Đã Check-out • Chờ chăm sóc</option>
              </select>
            </div>
          </div>

          <!-- Các nút Biểu mẫu CSKH Tự động điền thông tin -->
          <div class="p-3 border-b bg-white">
            <div class="text-xs font-bold text-slate-700 mb-2 flex justify-between items-center">
              <span><i class="fa-solid fa-wand-magic-sparkles text-blue-600 mr-1"></i>CHỌN BIỂU MẪU TỰ ĐỘNG ĐIỀN DỮ LIỆU CRM:</span>
              <span class="text-[11px] text-emerald-600 font-semibold" id="copyFeedback"></span>
            </div>
            <div class="grid grid-cols-3 gap-1.5 text-xs">
              <button onclick="CRMZalo.fillTemplate('confirm_booking')" class="p-2 border rounded-lg hover:bg-blue-50 hover:border-blue-400 font-semibold text-left transition cursor-pointer">
                <i class="fa-solid fa-file-circle-check text-green-600 mr-1"></i> 1. Xác nhận Đặt phòng
              </button>
              <button onclick="CRMZalo.fillTemplate('before_checkin')" class="p-2 border rounded-lg hover:bg-blue-50 hover:border-blue-400 font-semibold text-left transition cursor-pointer">
                <i class="fa-solid fa-door-open text-amber-500 mr-1"></i> 2. Hướng dẫn Check-in
              </button>
              <button onclick="CRMZalo.fillTemplate('after_checkout')" class="p-2 border rounded-lg hover:bg-blue-50 hover:border-blue-400 font-semibold text-left transition cursor-pointer">
                <i class="fa-solid fa-heart text-rose-500 mr-1"></i> 3. Chăm sóc Check-out
              </button>
              <button onclick="CRMZalo.fillTemplate('airport_pickup')" class="p-2 border rounded-lg hover:bg-blue-50 hover:border-blue-400 font-semibold text-left transition cursor-pointer">
                <i class="fa-solid fa-plane-arrival text-blue-600 mr-1"></i> 4. Báo Xe Đón Sân Bay
              </button>
              <button onclick="CRMZalo.fillTemplate('motorbike_delivery')" class="p-2 border rounded-lg hover:bg-blue-50 hover:border-blue-400 font-semibold text-left transition cursor-pointer">
                <i class="fa-solid fa-motorcycle text-orange-600 mr-1"></i> 5. Báo Giao Xe Máy
              </button>
              <button onclick="CRMZalo.fillTemplate('tour_reminder')" class="p-2 border rounded-lg hover:bg-blue-50 hover:border-blue-400 font-semibold text-left transition cursor-pointer">
                <i class="fa-solid fa-ship text-teal-600 mr-1"></i> 6. Nhắc Lịch Đi Tour
              </button>
              <button onclick="CRMZalo.fillTemplate('giuc_coc')" class="p-2 border rounded-lg hover:bg-amber-50 hover:border-amber-400 font-semibold text-left transition cursor-pointer">
                <i class="fa-solid fa-fire text-amber-600 mr-1"></i> 7. Giục Cọc Giữ Chỗ
              </button>
              <button onclick="CRMZalo.fillTemplate('gui_qr')" class="p-2 border rounded-lg hover:bg-purple-50 hover:border-purple-400 font-semibold text-left transition cursor-pointer">
                <i class="fa-solid fa-qrcode text-purple-600 mr-1"></i> 8. STK Techcombank
              </button>
              <button onclick="CRMZalo.fillTemplate('tri_an_voucher')" class="p-2 border rounded-lg hover:bg-rose-50 hover:border-rose-400 font-semibold text-left transition cursor-pointer">
                <i class="fa-solid fa-gift text-rose-600 mr-1"></i> 9. Voucher Tri Ân 200k
              </button>
            </div>
          </div>

          <!-- Khung Soạn thảo & Nhật ký Chăm sóc lưu vào CRM -->
          <div class="flex-1 p-3 flex flex-col justify-between bg-slate-100 overflow-hidden">
            <div id="crmChatHistory" class="flex-1 overflow-y-auto space-y-2 mb-2 pr-1 text-xs scrollbar-thin"></div>

            <div class="bg-white p-2.5 rounded-xl border shadow-sm">
              <textarea id="crmMessageEditor" oninput="if(document.getElementById('zalo-msg-preview')) document.getElementById('zalo-msg-preview').value = this.value;" rows="4" placeholder="Nội dung biểu mẫu sẽ tự động điền tại đây..." class="w-full text-xs p-2 border rounded-lg focus:outline-blue-500 resize-none font-sans"></textarea>
              <textarea id="zalo-msg-preview" class="hidden"></textarea>
              <div class="flex justify-between items-center mt-2 gap-2 flex-wrap">
                <div class="flex gap-1.5 flex-wrap">
                  <button onclick="CRMZalo.dispatchToGroup('Sales - Điều Hành')" class="px-2.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg text-xs font-bold transition cursor-pointer">
                    <i class="fa-solid fa-share-nodes mr-1"></i>Bắn lệnh Điều Hành
                  </button>
                  <button onclick="CRMZalo.dispatchToGroup('Sales - Kế Toán')" class="px-2.5 py-1.5 bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 rounded-lg text-xs font-bold transition cursor-pointer">
                    <i class="fa-solid fa-coins mr-1"></i>Báo Kế Toán Check Cọc
                  </button>
                </div>
                <button onclick="CRMZalo.copyAndSendZalo()" class="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold shadow transition cursor-pointer">
                  <i class="fa-solid fa-copy mr-1"></i> Copy & Gửi Qua Zalo
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- CỘT 3 (4 CỘT): BỘ ĐẶT LỊCH NHẮC TỰ ĐỘNG (XE MÁY, SÂN BAY, TOUR, CHECK-IN/OUT) -->
        <div class="col-span-12 lg:col-span-4 bg-white rounded-xl shadow-sm border flex flex-col h-[78vh]">
          <div class="p-3 border-b bg-amber-50/60">
            <h3 class="font-bold text-sm text-slate-800 flex items-center">
              <i class="fa-solid fa-bell text-amber-500 mr-2 animate-bounce"></i>ĐẶT LỊCH NHẮC TỰ ĐỘNG TRÊN CRM
            </h3>
            <p class="text-[11px] text-slate-500">Tự động báo chuông trên trình duyệt khi đến giờ hẹn khách</p>

            <div class="mt-2.5 space-y-2 text-xs">
              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="font-semibold text-gray-600">Hạng mục nhắc:</label>
                  <select id="schedCategory" class="w-full mt-0.5 p-1.5 border rounded-lg bg-white font-semibold">
                    <option value="✈️ Đón/Tiễn Sân Bay">✈️ Đón/Tiễn Sân Bay</option>
                    <option value="🛵 Giao/Nhận Xe Máy">🛵 Giao/Nhận Xe Máy</option>
                    <option value="🏝️ Nhắc Lịch Đi Tour">🏝️ Nhắc Lịch Đi Tour</option>
                    <option value="🏨 Chăm sóc Check-in">🏨 Chăm sóc Check-in</option>
                    <option value="💝 Chăm sóc Check-out">💝 Chăm sóc Check-out</option>
                  </select>
                </div>
                <div>
                  <label class="font-semibold text-gray-600">Thời điểm báo chuông:</label>
                  <input id="schedTime" type="datetime-local" class="w-full mt-0.5 p-1.5 border rounded-lg bg-white font-mono">
                </div>
              </div>

              <div>
                <label class="font-semibold text-gray-600">Chi tiết điều hành (Chuyến bay, Biển số xe, Sảnh KS):</label>
                <input id="schedDetail" type="text" placeholder="VD: Đón VN1344 lúc 14h00 - Giao 1 xe AirBlade sảnh Vinpearl..." class="w-full mt-0.5 p-1.5 border rounded-lg bg-white">
              </div>

              <button onclick="CRMZalo.createReminder()" class="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 rounded-lg shadow-sm transition cursor-pointer">
                <i class="fa-solid fa-clock mr-1"></i> Tạo Lịch Nhắc Cho Khách Hàng Này
              </button>
            </div>
          </div>

          <!-- Danh sách Lịch nhắc đang hoạt động -->
          <div class="p-3 flex-1 flex flex-col overflow-hidden">
            <div class="flex justify-between items-center mb-2">
              <span class="text-xs font-bold uppercase text-slate-500">Lịch nhắc dịch vụ đang chạy</span>
              <span id="schedCountBadge" class="text-xs font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full">0 lịch hẹn</span>
            </div>
            <div id="crmReminderList" class="flex-1 overflow-y-auto space-y-2 pr-1 text-xs scrollbar-thin"></div>
          </div>
        </div>

      </div>

      <!-- MODAL ĐĂNG NHẬP ZALO (QR & ID/PASS LƯU CẤU HÌNH TRONG CRM) -->
      <div id="crmZaloLoginModal" class="fixed inset-0 bg-black/60 z-50 hidden items-center justify-center p-3">
        <div class="bg-white rounded-xl shadow-2xl w-96 overflow-hidden">
          <div class="bg-blue-600 p-3.5 text-white flex justify-between items-center">
            <span class="font-bold text-sm"><i class="fa-solid fa-key mr-1.5"></i>Đăng nhập Zalo trên CRM (QR & ID/Pass)</span>
            <button onclick="CRMZalo.closeLoginModal()" class="cursor-pointer text-white hover:text-slate-200"><i class="fa-solid fa-xmark"></i></button>
          </div>
          <div class="p-4 text-xs space-y-3">
            <div class="p-3 bg-blue-50 border border-blue-200 rounded-lg text-center">
              <i class="fa-solid fa-qrcode text-5xl text-slate-800 mb-2"></i>
              <p class="font-bold text-blue-800">Cách 1: Đăng nhập bằng Mã QR (Khuyên dùng)</p>
              <p class="text-gray-600 mt-1">Nhấn nút bên dưới để mở khung quét QR chính thức của Zalo Web và giữ phiên tự động trên Google Chrome.</p>
              <button onclick="CRMZalo.openDockedZalo(); CRMZalo.closeLoginModal();" class="mt-2 bg-blue-600 text-white px-4 py-1.5 rounded-lg font-bold cursor-pointer hover:bg-blue-700">Mở Khung Quét QR Zalo</button>
            </div>
            <div class="border-t pt-3 space-y-2">
              <p class="font-bold text-slate-700">Cách 2: Lưu thông tin SĐT & Mật khẩu ca trực</p>
              <input id="zaloSavedPhone" type="text" placeholder="Số điện thoại Zalo CSKH..." class="w-full p-2 border rounded-lg">
              <input id="zaloSavedPass" type="password" placeholder="Mật khẩu Zalo / Token..." class="w-full p-2 border rounded-lg">
              <button onclick="CRMZalo.saveCredentials()" class="w-full bg-slate-800 text-white py-2 rounded-lg font-bold cursor-pointer hover:bg-slate-900">Lưu Tài Khoản Vào CRM</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
`;

// 2. Prepare Replacement JS for Tool Zalo
const jsCode = `    // -------------------------------------------------------------------------
    // CÔNG CỤ 4: PHÂN HỆ ZALO CSKH & ĐIỀU HÀNH DỊCH VỤ WORKSPACE
    // -------------------------------------------------------------------------
    const CRMZalo = {
      filterType: 'ALL',
      activeCustomerId: 1,
      zaloPopupWindow: null,
      isInitialized: false,

      // Dữ liệu khách hàng đồng bộ từ CRM
      customers: JSON.parse(localStorage.getItem('bt_crm_zalo_customers')) || [
        {
          id: 1,
          name: 'Anh Minh - Đoàn Gia Đình',
          phone: '0905123456',
          type: 'Khách lẻ',
          status: 'Cần đón sân bay / Giao xe',
          bookingCode: 'BT-2026-889',
          hotel: 'Vinpearl Resort Nha Trang',
          checkin: '01/11/2026 (14:00)',
          checkout: '03/11/2026 (12:00)',
          sale: 'Ngô Thị Băng Kiều (084.64.55.222)',
          logs: ['Đã nhận cọc 50% tiền phòng Vinpearl.', 'Khách dặn đón sân bay Cam Ranh 14h và thuê 1 xe máy.']
        },
        {
          id: 2,
          name: 'Chị Lan - CTV Du Lịch Hà Nội',
          phone: '0912888999',
          type: 'CTV',
          status: 'Đã xuất Booking',
          bookingCode: 'BT-2026-892',
          hotel: 'Duyên Hà Resort Cam Ranh',
          checkin: '02/11/2026 (14:00)',
          checkout: '05/11/2026 (12:00)',
          sale: 'Thắng (NV Kinh Doanh)',
          logs: ['Đã gửi bảng giá đại lý CTV.', 'Đã xuất 3 mã phòng Deluxe Ocean View.']
        },
        {
          id: 3,
          name: 'Công Ty Sự Kiện Á Châu (Đoàn 25 khách)',
          phone: '0988777666',
          type: 'Công ty',
          status: 'Đang lưu trú (In-house)',
          bookingCode: 'BT-2026-901',
          hotel: 'Khách sạn Rigel Nha Trang + Tour 3 Đảo',
          checkin: '31/10/2026 (14:00)',
          checkout: '02/11/2026 (12:00)',
          sale: 'Linh (NV Kinh Doanh)',
          logs: ['Đã bàn giao phòng cho trưởng đoàn.', 'Lịch sáng mai 08h00 đón đoàn đi Tour Đảo.']
        }
      ],

      reminders: JSON.parse(localStorage.getItem('bt_crm_zalo_reminders')) || [
        {
          id: 101,
          custName: 'Anh Minh - Đoàn Gia Đình',
          phone: '0905123456',
          category: '✈️ Đón/Tiễn Sân Bay',
          time: '2026-11-01T13:00',
          detail: 'Đón chuyến VN1344 hạ cánh 14h00 tại Sân bay Cam Ranh về Vinpearl',
          notified: false
        },
        {
          id: 102,
          custName: 'Anh Minh - Đoàn Gia Đình',
          phone: '0905123456',
          category: '🛵 Giao/Nhận Xe Máy',
          time: '2026-11-01T15:30',
          detail: 'Giao 01 xe tay ga AirBlade tại Bến tàu Vinpearl (nhắc khách mang CCCD + GPLX)',
          notified: false
        },
        {
          id: 103,
          custName: 'Công Ty Sự Kiện Á Châu (Đoàn 25 khách)',
          phone: '0988777666',
          category: '🏝️ Nhắc Lịch Đi Tour',
          time: '2026-10-31T20:00',
          detail: 'Nhắc trưởng đoàn 08h00 sáng mai xe đón tại sảnh Rigel đi Tour 3 Đảo VIP',
          notified: false
        }
      ],

      init() {
        this.syncAllFromCRM();
        this.renderContacts();
        if (this.customers.length > 0) {
          const selected = this.customers.find(c => c.id === this.activeCustomerId) || this.customers[0];
          this.selectCustomer(selected.id);
        }
        this.renderReminders();
        if (!this.isInitialized) {
          setInterval(() => this.checkDueReminders(), 15000);
          this.isInitialized = true;
        }
      },

      saveState() {
        localStorage.setItem('bt_crm_zalo_customers', JSON.stringify(this.customers));
        localStorage.setItem('bt_crm_zalo_reminders', JSON.stringify(this.reminders));
      },

      // Tự động quét và đồng bộ các Booking thực tế từ CRM
      syncAllFromCRM() {
        try {
          if (typeof bookings !== 'undefined' && Array.isArray(bookings)) {
            bookings.forEach(b => {
              const code = b.bookingCode || ('BT-' + b.id);
              const exists = this.customers.some(c => c.bookingCode === code || (b.customerPhone && c.phone === b.customerPhone));
              if (!exists && (b.customerName || b.name)) {
                this.customers.push({
                  id: b.id || Date.now() + Math.floor(Math.random() * 1000),
                  name: b.customerName || b.name || 'Khách hàng',
                  phone: b.customerPhone || b.phone || '',
                  type: b.customerType || 'Khách lẻ',
                  status: b.status || 'Đã xuất Booking',
                  bookingCode: code,
                  hotel: b.hotelName || b.hotel || 'Khách sạn Nha Trang',
                  checkin: b.checkIn || '14:00',
                  checkout: b.checkOut || '12:00',
                  sale: b.staffName || (typeof currentUser !== 'undefined' && currentUser ? currentUser.name : 'Ngô Thị Băng Kiều'),
                  logs: ['Tự động nạp từ bảng quản trị Booking CRM']
                });
              }
            });
            this.saveState();
          }
        } catch (e) {
          console.warn('Lỗi đồng bộ CRM vào Zalo:', e);
        }
      },

      // Hàm API đồng bộ một đơn hàng cụ thể
      syncFromCRMOrder(orderObj) {
        const existing = this.customers.find(c => c.bookingCode === orderObj.bookingCode);
        if (existing) {
          this.selectCustomer(existing.id);
        } else {
          const staffEl = document.getElementById('crmStaffSelect');
          const newCust = {
            id: Date.now(),
            name: orderObj.name || 'Khách hàng mới',
            phone: orderObj.phone || '',
            type: orderObj.type || 'Khách lẻ',
            status: orderObj.status || 'Đã xuất Booking',
            bookingCode: orderObj.bookingCode || ('BT-' + Math.floor(1000 + Math.random() * 9000)),
            hotel: orderObj.hotel || 'Khách sạn Nha Trang',
            checkin: orderObj.checkin || '14:00',
            checkout: orderObj.checkout || '12:00',
            sale: staffEl ? staffEl.value : 'Ngô Thị Băng Kiều',
            logs: ['Đồng bộ trực tiếp từ thao tác người dùng']
          };
          this.customers.unshift(newCust);
          this.saveState();
          this.renderContacts();
          this.selectCustomer(newCust.id);
        }
      },

      setFilter(type) {
        this.filterType = type;
        this.renderContacts();
      },

      renderContacts() {
        const searchInput = document.getElementById('crmSearchInput');
        const keyword = (searchInput ? searchInput.value : '').toLowerCase();
        const container = document.getElementById('crmContactList');
        if (!container) return;
        container.innerHTML = '';

        const badgeColor = {
          'Khách lẻ': 'bg-blue-100 text-blue-700',
          'CTV': 'bg-orange-100 text-orange-700',
          'Công ty': 'bg-purple-100 text-purple-700'
        };

        const filtered = this.customers
          .filter(c => (this.filterType === 'ALL' || c.type === this.filterType))
          .filter(c => (c.name || '').toLowerCase().includes(keyword) || (c.phone || '').includes(keyword) || (c.bookingCode || '').toLowerCase().includes(keyword));

        if (filtered.length === 0) {
          container.innerHTML = '<div class="p-4 text-center text-slate-400 italic">Không tìm thấy khách hàng nào</div>';
          return;
        }

        filtered.forEach(c => {
          const activeClass = c.id === this.activeCustomerId ? 'bg-blue-50 border-l-4 border-blue-600' : 'hover:bg-slate-50';
          const div = document.createElement('div');
          div.className = \`p-2.5 cursor-pointer transition \${activeClass}\`;
          div.onclick = () => this.selectCustomer(c.id);
          div.innerHTML = \`
            <div class="flex justify-between items-start">
              <span class="font-bold text-slate-800 truncate pr-2">\${escapeHtml(c.name)}</span>
              <span class="text-[10px] font-mono text-slate-500 shrink-0">\${escapeHtml(c.bookingCode)}</span>
            </div>
            <div class="text-[11px] text-slate-600 truncate mt-0.5"><i class="fa-solid fa-hotel mr-1 text-slate-400"></i>\${escapeHtml(c.hotel || 'Chưa chọn KS')}</div>
            <div class="flex gap-1 mt-1.5 flex-wrap">
              <span class="px-1.5 py-0.5 text-[10px] font-bold rounded \${badgeColor[c.type] || 'bg-gray-100'}">\${escapeHtml(c.type)}</span>
              <span class="px-1.5 py-0.5 text-[10px] font-semibold bg-amber-100 text-amber-800 rounded truncate max-w-[150px]">\${escapeHtml(c.status)}</span>
            </div>
          \`;
          container.appendChild(div);
        });
      },

      selectCustomer(id) {
        this.activeCustomerId = id;
        const c = this.customers.find(item => item.id === id);
        if (!c) return;

        const setTxt = (elId, val) => { const el = document.getElementById(elId); if (el) el.innerText = val || '--'; };
        const setVal = (elId, val) => { const el = document.getElementById(elId); if (el) el.value = val || ''; };

        setTxt('activeCustName', c.name);
        setTxt('activeCustPhone', c.phone);
        setTxt('activeBookingCode', c.bookingCode);
        setTxt('activeSaleName', c.sale);
        setTxt('activeCustType', c.type);
        setTxt('activeCustStatus', c.status);

        setVal('bindHotel', c.hotel);
        setVal('bindCheckin', c.checkin);
        setVal('bindCheckout', c.checkout);
        setVal('changeTypeSelect', c.type);
        setVal('changeStatusSelect', c.status);

        this.renderLogs(c);
        this.renderContacts();
      },

      renderLogs(c) {
        const box = document.getElementById('crmChatHistory');
        if (!box) return;
        box.innerHTML = (c.logs || []).map(log => \`
          <div class="bg-white p-2.5 rounded-lg border shadow-sm">
            <div class="flex justify-between text-[10px] text-slate-400 mb-1">
              <span>Nhật ký CSKH CRM</span>
              <span class="font-mono">\${escapeHtml(c.bookingCode)}</span>
            </div>
            <div class="text-slate-700 whitespace-pre-line leading-relaxed">\${escapeHtml(log)}</div>
          </div>
        \`).join('');
        box.scrollTop = box.scrollHeight;
      },

      updateActiveBooking() {
        const c = this.customers.find(item => item.id === this.activeCustomerId);
        if (!c) return;
        c.hotel = document.getElementById('bindHotel')?.value || c.hotel;
        c.checkin = document.getElementById('bindCheckin')?.value || c.checkin;
        c.checkout = document.getElementById('bindCheckout')?.value || c.checkout;
        this.saveState();
        this.renderContacts();
      },

      updateTag(field, value) {
        const c = this.customers.find(item => item.id === this.activeCustomerId);
        if (!c) return;
        c[field] = value;
        this.saveState();
        this.selectCustomer(c.id);
      },

      // Tự động trộn dữ liệu CRM vào 9 Biểu mẫu CSKH & Sales
      fillTemplate(tplKey) {
        const c = this.customers.find(item => item.id === this.activeCustomerId) || {
          name: 'Quý khách',
          phone: '',
          bookingCode: 'BT-' + Date.now().toString().slice(-4),
          hotel: 'Vinpearl Resort Nha Trang',
          checkin: '14:00',
          checkout: '12:00'
        };
        const staff = document.getElementById('crmStaffSelect')?.value || (typeof currentUser !== 'undefined' && currentUser ? currentUser.name : 'Ngô Thị Băng Kiều');

        const templates = {
          confirm_booking: \`🎉 XÁC NHẬN ĐẶT PHÒNG & DỊCH VỤ THÀNH CÔNG 🎉\\nCÔNG TY TNHH BOOKING TRAVEL xin gửi thông tin xác nhận Booking của Quý khách:\\n• Khách hàng: \${c.name} (\${c.phone})\\n• Mã Booking: \${c.bookingCode}\\n• Khách sạn / Dịch vụ: \${c.hotel}\\n• Nhận phòng (Check-in): \${c.checkin}\\n• Trả phòng (Check-out): \${c.checkout}\\n• Nhân viên hỗ trợ: \${staff}\\nCần đặt thêm xe đón sân bay, thuê xe máy hoặc vé tour đảo, Quý khách nhắn trực tiếp vào Zalo này để bên em sắp xếp chu đáo nhất ạ!\`,

          before_checkin: \`🌸 HƯỚNG DẪN NHẬN PHÒNG (CHECK-IN) 🌸\\nDạ em chào \${c.name}, hôm nay là ngày nhận phòng tại [\${c.hotel}] theo mã Booking [\${c.bookingCode}].\\nEm xin phép nhắc một số thông tin cần chuẩn bị:\\n1. Giờ nhận phòng tiêu chuẩn: \${c.checkin}.\\n2. Giấy tờ mang theo: CCCD/Hộ chiếu bản gốc của người lớn & Giấy khai sinh của bé.\\n3. Khi đến quầy Lễ tân, Quý khách đọc mã Booking [\${c.bookingCode}] để làm thủ tục.\\nNhận phòng xong Anh/Chị nhắn em kiểm tra xem gia đình mình đã hài lòng với phòng nghỉ chưa nhé ạ!\`,

          after_checkout: \`💝 LỜI CẢM ƠN SAU CHUYẾN ĐI (CHECK-OUT) 💝\\nDạ kỳ nghỉ tại [\${c.hotel}] của \${c.name} đã hoàn tất. Thay mặt CÔNG TY TNHH BOOKING TRAVEL, em xin gửi lời cảm ơn chân thành nhất đến Quý khách!\\nHi vọng gia đình mình đã có những trải nghiệm thật vui vẻ. Nếu có điều gì cần góp ý thêm, Anh/Chị nhắn giúp em để công ty hoàn thiện hơn nhé. Hẹn gặp lại Quý khách trong kỳ nghỉ tiếp theo kèm ưu đãi khách hàng thân thiết ạ!\`,

          airport_pickup: \`✈️ THÔNG BÁO XE ĐÓN/TIỄN SÂN BAY CAM RANH ✈️\\nDạ em chào \${c.name}, bên em xin gửi thông tin xe đón sân bay cho đoàn mình (Mã đơn \${c.bookingCode}):\\n• Lộ trình: Sân bay Cam Ranh ➔ \${c.hotel}\\n• Tài xế sẽ liên hệ số điện thoại \${c.phone} của mình ngay khi máy bay hạ cánh.\\nKhi lấy hành lý xong và ra cửa ga đến, Anh/Chị nhắn em hoặc gọi trực tiếp cho tài xế nhé ạ!\`,

          motorbike_delivery: \`🛵 THÔNG BÁO LỊCH GIAO XE MÁY TẬN NƠI 🛵\\nDạ em chào \${c.name}, bên em đã lên lịch giao xe máy cho mình tại sảnh [\${c.hotel}]:\\n• Quý khách vui lòng chuẩn bị sẵn CCCD và Bằng lái xe (GPLX) để nhân viên làm biên bản bàn giao xe.\\n• Xe đã được kiểm tra phanh, lốp và trang bị sẵn 02 mũ bảo hiểm. Khi nhân viên giao xe chạy tới sảnh sẽ gọi vào số \${c.phone} của mình ạ!\`,

          tour_reminder: \`🏝️ NHẮC LỊCH KHỞI HÀNH ĐI TOUR NGÀY MAI 🏝️\\nDạ em chào \${c.name}, em xin phép nhắc lịch đi Tour ngày mai của đoàn mình ạ:\\n• Thời gian xe & HDV đón: 08:00 - 08:15 sáng tại sảnh [\${c.hotel}].\\n• Trang phục & vật dụng: Đồ bơi, khăn tắm, kem chống nắng, mũ rộng vành và thuốc say sóng (nếu cần).\\nBuổi sáng đoàn mình dùng bữa sáng tại khách sạn trước 07:45 để kịp giờ xe đón nhé. Chúc đoàn mình buổi tối vui vẻ ạ!\`,

          giuc_coc: \`🔥 DẠ \${c.name.toUpperCase()} ƠI, EM BÁO GẤP CHO MÌNH Ạ!\\n\\nHạng phòng tại \${c.hotel} vào ngày đi của gia đình mình chỉ còn đúng 2 phòng giá ưu đãi. Khách đoàn bên em cũng đang hỏi giữ chỗ.\\n\\nĐể đảm bảo không bị tăng giá hoặc hết phòng đẹp, \${c.name} cho em xin cọc trước 30% để hệ thống khóa phòng ngay cho mình nha ạ! Em hỗ trợ giữ chỗ trong 30 phút ạ 🙏\`,

          gui_qr: \`🏦 THÔNG TIN TÀI KHOẢN NGÂN HÀNG CHUYỂN CỌC BOOKING TRAVEL 🏦\\nDạ em gửi \${c.name} thông tin thanh toán cọc giữ phòng mã đơn \${c.bookingCode} tại \${c.hotel}:\\n• Ngân hàng: TECHCOMBANK (Ngân hàng TMCP Kỹ Thương Việt Nam)\\n• Chủ tài khoản: CONG TY TNHH BOOKING TRAVEL\\n• Số tài khoản: 554479\\n• Nội dung CK: \${c.bookingCode} \${c.name} \${c.phone}\\nQuý khách quét mã hoặc chuyển khoản xong gửi lại ảnh biên lai chụp màn hình để em xuất phiếu giữ chỗ chính thức gửi mình ngay nhé ạ!\`,

          tri_an_voucher: \`🎁 VOUCHER TRI ÂN KHÁCH HÀNG THÂN THIẾT 200.000 Đ 🎁\\nChào \${c.name}, Booking Travel xin gửi tặng Quý khách mã Voucher tri ân: BT-VIP200\\n• Trị giá: Giảm trực tiếp 200.000 đ cho lần đặt phòng, combo hoặc tour tiếp theo.\\n• Áp dụng: Toàn bộ hệ thống 100+ khách sạn & resort liên kết.\\n• Thời hạn sử dụng: Trong vòng 12 tháng kể từ hôm nay.\\nCảm ơn Quý khách đã luôn đồng hành cùng gia đình Booking Travel! ❤️\`
        };

        const editor = document.getElementById('crmMessageEditor');
        if (editor) {
          editor.value = templates[tplKey] || '';
          editor.focus();
        }
        const preview = document.getElementById('zalo-msg-preview');
        if (preview) preview.value = templates[tplKey] || '';
      },

      copyAndSendZalo() {
        const editor = document.getElementById('crmMessageEditor');
        const text = editor ? editor.value.trim() : '';
        if (!text) {
          alert('Vui lòng chọn một biểu mẫu hoặc nhập nội dung tin nhắn!');
          return;
        }
        const c = this.customers.find(item => item.id === this.activeCustomerId);
        navigator.clipboard.writeText(text);

        if (c) {
          if (!c.logs) c.logs = [];
          c.logs.push(\`[\${new Date().toLocaleTimeString('vi-VN')}] Đã gửi Zalo: \${text.slice(0, 100)}...\`);
          this.saveState();
          this.renderLogs(c);
        }

        const feedback = document.getElementById('copyFeedback');
        if (feedback) {
          feedback.innerText = '✓ Đã copy biểu mẫu vào bộ nhớ tạm!';
          setTimeout(() => feedback.innerText = '', 4000);
        }

        this.openDirectZaloChat();
      },

      openDirectZaloChat() {
        const c = this.customers.find(item => item.id === this.activeCustomerId);
        if (!c || !c.phone) {
          alert('Khách hàng này chưa có số điện thoại Zalo!');
          return;
        }
        const cleanPhone = c.phone.replace(/\\D/g, '');
        window.open(\`https://zalo.me/\${cleanPhone}\`, 'ZaloDirectWindow', 'width=520,height=760,right=20,top=60');
      },

      openDockedZalo() {
        this.zaloPopupWindow = window.open('https://chat.zalo.me', 'ZaloCRMBridge', 'width=550,height=820,left=950,top=40');
      },

      selectGroup(code, groupName, groupType) {
        const c = this.customers.find(item => item.id === this.activeCustomerId);
        const editor = document.getElementById('crmMessageEditor');
        const staffEl = document.getElementById('crmStaffSelect');
        if (editor) {
          editor.value = \`📌 [PHIẾU ĐIỀU PHỐI TỪ CRM ➔ \${groupName}]\\n• Mã Booking: \${c ? c.bookingCode : ''}\\n• Khách hàng: \${c ? c.name : ''} (\${c ? c.phone : ''})\\n• Dịch vụ/Khách sạn: \${c ? c.hotel : ''}\\n• Thời gian: \${c ? c.checkin : ''} - \${c ? c.checkout : ''}\\n• Người tạo lệnh: \${staffEl ? staffEl.value : 'Sales'}\\n• Yêu cầu xử lý: \`;
          editor.focus();
        }
      },

      dispatchToGroup(deptName) {
        const c = this.customers.find(item => item.id === this.activeCustomerId);
        const editor = document.getElementById('crmMessageEditor');
        const text = (editor ? editor.value.trim() : '') || \`Yêu cầu xử lý đơn \${c ? c.bookingCode : ''} - Khách \${c ? c.name : ''}\`;
        navigator.clipboard.writeText(text);
        if (c) {
          if (!c.logs) c.logs = [];
          c.logs.push(\`[\${new Date().toLocaleTimeString('vi-VN')}] [Chuyển Group \${deptName}]: \${text.slice(0, 100)}...\`);
          this.saveState();
          this.renderLogs(c);
        }
        alert(\`Đã copy lệnh điều phối và lưu nhật ký chuyển sang Group [\${deptName}]! Bạn chỉ cần nhấn Ctrl+V vào Group Zalo.\`);
      },

      createReminder() {
        const c = this.customers.find(item => item.id === this.activeCustomerId);
        const category = document.getElementById('schedCategory')?.value || 'Dịch vụ';
        const time = document.getElementById('schedTime')?.value;
        const detail = document.getElementById('schedDetail')?.value.trim();

        if (!time || !detail) {
          alert('Vui lòng chọn thời gian báo chuông và nhập chi tiết điều hành!');
          return;
        }

        this.reminders.unshift({
          id: Date.now(),
          custName: c ? c.name : 'Khách chung',
          phone: c ? c.phone : '',
          category,
          time,
          detail,
          notified: false
        });

        this.saveState();
        this.renderReminders();
        const detailEl = document.getElementById('schedDetail');
        if (detailEl) detailEl.value = '';
        alert('Đã tạo lịch nhắc hẹn giờ thành công!');
      },

      renderReminders() {
        const list = document.getElementById('crmReminderList');
        const countBadge = document.getElementById('schedCountBadge');
        if (countBadge) countBadge.innerText = \`\${this.reminders.length} lịch hẹn\`;
        if (!list) return;

        if (this.reminders.length === 0) {
          list.innerHTML = '<div class="p-4 text-center text-slate-400 italic">Chưa có lịch hẹn nào đang chạy</div>';
          return;
        }

        list.innerHTML = this.reminders.map(r => \`
          <div class="p-2.5 rounded-lg border-l-4 \${r.notified ? 'border-red-600 bg-red-50' : 'border-blue-600 bg-slate-50'} shadow-sm">
            <div class="flex justify-between items-center font-bold text-slate-800">
              <span>\${escapeHtml(r.category)}</span>
              <span class="text-[11px] text-blue-700 font-mono">\${escapeHtml(r.time.replace('T', ' '))}</span>
            </div>
            <div class="text-slate-700 mt-1">Khách: <b>\${escapeHtml(r.custName)}</b> (\${escapeHtml(r.phone)})</div>
            <div class="text-slate-600 mt-0.5 text-[11px]">\${escapeHtml(r.detail)}</div>
            <div class="flex justify-between items-center mt-2 pt-1.5 border-t">
              <button onclick="CRMZalo.triggerRemindMessage(\${r.id})" class="px-2 py-0.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-[11px] font-semibold cursor-pointer">
                Soạn & Gửi nhắc khách
              </button>
              <button onclick="CRMZalo.deleteReminder(\${r.id})" class="text-gray-400 hover:text-red-600 text-[11px] cursor-pointer">
                <i class="fa-solid fa-trash"></i> Xóa
              </button>
            </div>
          </div>
        \`).join('');
      },

      triggerRemindMessage(remId) {
        const r = this.reminders.find(item => item.id === remId);
        if (!r) return;
        const editor = document.getElementById('crmMessageEditor');
        if (editor) {
          editor.value = \`🔔 [THÔNG BÁO NHẮC LỊCH DỊCH VỤ - BOOKING TRAVEL]\\nChào \${r.custName}, bên em xin phép nhắc lịch hẹn dịch vụ [\${r.category}] của mình:\\n• Thời gian: \${r.time.replace('T', ' ')}\\n• Chi tiết: \${r.detail}\\nQuý khách cần hỗ trợ thêm vui lòng nhắn lại Zalo này nhé ạ!\`;
          editor.focus();
        }
      },

      deleteReminder(remId) {
        this.reminders = this.reminders.filter(item => item.id !== remId);
        this.saveState();
        this.renderReminders();
      },

      // Kiểm tra giờ hẹn tự động & Phát âm thanh chuông báo trên trình duyệt Chrome
      checkDueReminders() {
        const now = new Date();
        this.reminders.forEach(r => {
          const target = new Date(r.time);
          if (!r.notified && target <= now) {
            r.notified = true;
            this.playAlertSound();
            this.saveState();
            this.renderReminders();
            alert(\`⏰ ĐẾN GIỜ NHẮC DỊCH VỤ: [\${r.category}]\\nKhách hàng: \${r.custName} (\${r.phone})\\nNội dung: \${r.detail}\`);
          }
        });
      },

      playAlertSound() {
        try {
          const ctx = new (window.AudioContext || window.webkitAudioContext)();
          const osc = ctx.createOscillator();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(880, ctx.currentTime);
          osc.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.4);
        } catch (e) {}
      },

      openNewCustomerModal() {
        const name = prompt('Nhập tên khách hàng / Đoàn khách:');
        if (!name) return;
        const phone = prompt('Nhập số điện thoại Zalo của khách:') || '';
        const hotel = prompt('Nhập tên Khách sạn / Tour:') || 'Khách sạn Nha Trang';
        this.syncFromCRMOrder({
          name,
          phone,
          hotel,
          bookingCode: 'BT-' + Math.floor(1000 + Math.random() * 9000),
          checkin: '14:00 Hôm nay',
          checkout: '12:00 Ngày mai',
          type: 'Khách lẻ'
        });
      },

      openLoginModal() {
        const modal = document.getElementById('crmZaloLoginModal');
        if (modal) {
          modal.classList.remove('hidden');
          modal.classList.add('flex');
        }
      },

      closeLoginModal() {
        const modal = document.getElementById('crmZaloLoginModal');
        if (modal) {
          modal.classList.add('hidden');
          modal.classList.remove('flex');
        }
      },

      saveCredentials() {
        const phone = document.getElementById('zaloSavedPhone')?.value || '';
        localStorage.setItem('bt_zalo_saved_phone', phone);
        alert('Đã lưu cấu hình tài khoản Zalo ca trực vào hệ thống CRM!');
        this.closeLoginModal();
      }
    };

    function openToolZaloModal() {
      const modal = document.getElementById('tool-zalo-modal');
      if (modal) {
        modal.classList.remove('hidden');
        modal.classList.add('flex');
      }
      CRMZalo.init();
      if (!document.getElementById('crmMessageEditor')?.value) {
        CRMZalo.fillTemplate('confirm_booking');
      }
    }

    function closeToolZaloModal() {
      const modal = document.getElementById('tool-zalo-modal');
      if (modal) {
        modal.classList.add('hidden');
        modal.classList.remove('flex');
      }
    }

    function renderZaloTemplate() {
      if (window.CRMZalo) {
        CRMZalo.fillTemplate('confirm_booking');
      }
    }

    function copyZaloMessage() {
      if (window.CRMZalo) {
        CRMZalo.copyAndSendZalo();
      }
    }

    function openDirectZalo() {
      if (window.CRMZalo) {
        CRMZalo.openDirectZaloChat();
      }
    }
`;

// Replace HTML Modal
const startTagHtml = '<!-- MODAL 4: TOOL ZALO SALES & CSKH';
const endTagHtml = '<!-- MODAL 5: TOOL FACEBOOK: TẠO CONTENT FANPAGE & GROUP DU LỊCH -->';
const startIdxHtml = html.indexOf(startTagHtml);
const endIdxHtml = html.indexOf(endTagHtml);

if (startIdxHtml !== -1 && endIdxHtml !== -1) {
  html = html.slice(0, startIdxHtml) + modalHtml + '\n\n  ' + html.slice(endIdxHtml);
  console.log('Replaced Modal 4 HTML successfully!');
} else {
  console.error('Could not find HTML tags for Modal 4');
  process.exit(1);
}

// Replace JS
const startTagJs = '// CÔNG CỤ 4: TOOL ZALO SALES & CSKH CHỐT ĐƠN NHANH';
const endTagJs = '// CÔNG CỤ 5: TOOL FACEBOOK: TẠO CONTENT FANPAGE';
const startIdxJs = html.indexOf(startTagJs);
const endIdxJs = html.indexOf(endTagJs);

if (startIdxJs !== -1 && endIdxJs !== -1) {
  html = html.slice(0, startIdxJs) + jsCode + '\n\n    ' + html.slice(endIdxJs);
  console.log('Replaced Tool Zalo JS successfully!');
} else {
  console.error('Could not find JS tags for Tool Zalo');
  process.exit(1);
}

fs.writeFileSync(targetPath, html, 'utf8');
console.log('Updated CRM_Booking.html successfully! New size:', html.length);

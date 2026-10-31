const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'CRM_Booking.html');
let content = fs.readFileSync(filePath, 'utf-8');

console.log(`Starting Phase 1 fixes. Initial size: ${content.length} bytes`);

// -----------------------------------------------------------------------------
// 1. GỠ BỎ ĐOẠN CODE NGUY HIỂM GÂY XÓA TRẮNG DỮ LIỆU TẠI DÒNG 10931-10938
// -----------------------------------------------------------------------------
const targetOldCodeWipe = `      // Tự động làm sạch dữ liệu: Nếu trình duyệt còn lưu mã cũ dạng DH2611-01 hoặc BK-... -> Nạp dữ liệu chuẩn DH timestamp từ quanly.bookingtravel.vn
      let hasOldCode = false;
      if (Array.isArray(bookings)) {
        hasOldCode = bookings.some(b => b.maBooking && (b.maBooking.includes('-') || b.maBooking.startsWith('BK-')));
      }
      if (hasOldCode || !bookings || bookings.length === 0) {
        bookings = JSON.parse(JSON.stringify(INITIAL_REFINED_DATA));
        saveData();
      }`;

const replaceSafeDataInit = `      // BẢO VỆ TOÀN VẸN DỮ LIỆU: Chỉ khởi tạo dữ liệu mẫu nếu hệ thống chưa từng có đơn nào
      if (!Array.isArray(bookings) || bookings.length === 0) {
        bookings = JSON.parse(JSON.stringify(INITIAL_REFINED_DATA));
        saveData();
      }`;

if (content.includes(targetOldCodeWipe)) {
  content = content.replace(targetOldCodeWipe, replaceSafeDataInit);
  console.log('✅ 1. Gỡ bỏ thành công đoạn code nguy cơ xóa trắng dữ liệu khi mã có dấu "-"');
} else {
  console.log('⚠️ 1. Không tìm thấy đoạn targetOldCodeWipe chính xác');
}

// -----------------------------------------------------------------------------
// 2. TỐI ƯU saveData(): BỌC TRY-CATCH, CHỐNG QUOTA EXCEEDED, NGỪNG GHI ĐÚP VÀO KEY V4
// -----------------------------------------------------------------------------
const targetSaveData = `    function saveData() {
      localStorage.setItem('BOOKING_TRAVEL_UNIFIED_DATA_V7', JSON.stringify(bookings));
      localStorage.setItem('BOOKING_TRAVEL_DATA_V4', JSON.stringify(bookings));
      updateMetrics();
    }`;

const replaceSaveData = `    function saveData() {
      try {
        localStorage.setItem('BOOKING_TRAVEL_UNIFIED_DATA_V7', JSON.stringify(bookings));
        // Xóa key cũ V4 nếu còn tồn tại để giải phóng dung lượng LocalStorage, tránh nhân đôi bộ nhớ
        if (localStorage.getItem('BOOKING_TRAVEL_DATA_V4')) {
          localStorage.removeItem('BOOKING_TRAVEL_DATA_V4');
        }
      } catch (err) {
        console.error('Lỗi lưu LocalStorage:', err);
        if (err.name === 'QuotaExceededError' || err.code === 22) {
          alert('⚠️ CẢNH BÁO BỘ NHỚ TRÌNH DUYỆT (LOCALSTORAGE GẦN ĐẦY):\\n\\nDung lượng lưu trữ của trình duyệt đã vượt quá giới hạn cho phép (~5MB).\\nHãy bấm "Sao Lưu Dữ Liệu" để xuất file JSON về máy tính và xóa bớt các file ảnh/chứng từ nặng.');
        }
      }
      updateMetrics();
    }`;

if (content.includes(targetSaveData)) {
  content = content.replace(targetSaveData, replaceSaveData);
  console.log('✅ 2. Bọc an toàn try-catch cho saveData() và loại bỏ lưu trùng lặp vào key V4');
} else {
  console.log('⚠️ 2. Không tìm thấy đoạn targetSaveData');
}

// -----------------------------------------------------------------------------
// 3. SỬA LỖI PHÂN QUYỀN KẾ TOÁN (acc vs accountant)
// -----------------------------------------------------------------------------
// 3a. Trong renderExpensesView
const targetAccExpenses = `      const isAdmin = currentUser && currentUser.role === 'admin';
      const isAcc = currentUser && currentUser.role === 'accountant';`;

const replaceAccExpenses = `      const isAdmin = currentUser && currentUser.role === 'admin';
      const isAcc = currentUser && (currentUser.role === 'acc' || currentUser.role === 'accountant');`;

if (content.includes(targetAccExpenses)) {
  content = content.replace(targetAccExpenses, replaceAccExpenses);
  console.log('✅ 3a. Sửa phân quyền kế toán trong renderExpensesView');
}

// 3b. Trong switchView
const targetAccSwitch1 = `      const isSale = currentUser && currentUser.role === 'sale';
      const isAdmin = currentUser && currentUser.role === 'admin';
      const isAcc = currentUser && currentUser.role === 'accountant';`;

const replaceAccSwitch1 = `      const isSale = currentUser && currentUser.role === 'sale';
      const isAdmin = currentUser && currentUser.role === 'admin';
      const isAcc = currentUser && (currentUser.role === 'acc' || currentUser.role === 'accountant');`;

if (content.includes(targetAccSwitch1)) {
  content = content.replace(targetAccSwitch1, replaceAccSwitch1);
  console.log('✅ 3b. Sửa phân quyền kế toán trong switchView (phần kiểm tra quyền)');
}

const targetAccSwitch2 = `        const isSale = currentUser && currentUser.role === 'sale';
        const isAcc = currentUser && currentUser.role === 'accountant';
        if (titleEl) titleEl.innerText = isSale ? 'Phòng Kinh Doanh' : (isAcc ? 'Phòng Kế Toán' : 'Ban Giám Đốc');`;

const replaceAccSwitch2 = `        const isSale = currentUser && currentUser.role === 'sale';
        const isAcc = currentUser && (currentUser.role === 'acc' || currentUser.role === 'accountant');
        if (titleEl) titleEl.innerText = isSale ? 'Phòng Kinh Doanh' : (isAcc ? 'Phòng Kế Toán' : 'Ban Giám Đốc');`;

if (content.includes(targetAccSwitch2)) {
  content = content.replace(targetAccSwitch2, replaceAccSwitch2);
  console.log('✅ 3c. Sửa tiêu đề phòng ban kế toán trong switchView');
}

// 3c. Trong openModalHuyDon
const targetAccHuy = `      const isSale = currentUser && currentUser.role === 'sale';
      const isAcc = currentUser && currentUser.role === 'accountant';
      const isAdmin = currentUser && currentUser.role === 'admin';`;

const replaceAccHuy = `      const isSale = currentUser && currentUser.role === 'sale';
      const isAcc = currentUser && (currentUser.role === 'acc' || currentUser.role === 'accountant');
      const isAdmin = currentUser && currentUser.role === 'admin';`;

if (content.includes(targetAccHuy)) {
  content = content.replace(targetAccHuy, replaceAccHuy);
  console.log('✅ 3d. Sửa phân quyền kế toán trong openModalHuyDon');
}

// 3d. Trong openModalDeXuatChi
const targetAccDeXuat = `      const isAcc = currentUser && currentUser.role === 'accountant';
      const isAdmin = currentUser && currentUser.role === 'admin';
      const btnWrapper = document.getElementById('chi-btn-wrapper');`;

const replaceAccDeXuat = `      const isAcc = currentUser && (currentUser.role === 'acc' || currentUser.role === 'accountant');
      const isAdmin = currentUser && currentUser.role === 'admin';
      const btnWrapper = document.getElementById('chi-btn-wrapper');`;

if (content.includes(targetAccDeXuat)) {
  content = content.replace(targetAccDeXuat, replaceAccDeXuat);
  console.log('✅ 3e. Sửa phân quyền kế toán trong openModalDeXuatChi');
}

// -----------------------------------------------------------------------------
// 4. XÓA HÀM TRÙNG LẶP sendBirthdayWishZalo (Xóa 2 lần thừa, giữ 1 lần duy nhất)
// -----------------------------------------------------------------------------
const targetDuplicateBirthdayFns = `    function sendBirthdayWishZalo(phone, name, service) {
      const customer = { name, phone, service };
      quickSendGiftZalo(0);
    }

    // Giữ lại alias cũ để tương thích
    function sendBirthdayWishZalo(phone, name, service) {
      const customer = { name, phone, service };
      quickSendGiftZalo(0);
    }

    // Giữ lại alias cũ để tương thích
    function sendBirthdayWishZalo(phone, name, service) {
      const customer = { name, phone, service };
      quickSendGiftZalo(0);
    }`;

const replaceSingleBirthdayFn = `    function sendBirthdayWishZalo(phone, name, service) {
      const customer = { name, phone, service };
      quickSendGiftZalo(0);
    }`;

if (content.includes(targetDuplicateBirthdayFns)) {
  content = content.replace(targetDuplicateBirthdayFns, replaceSingleBirthdayFn);
  console.log('✅ 4. Đã loại bỏ các hàm trùng lặp sendBirthdayWishZalo');
} else {
  console.log('⚠️ 4. Không tìm thấy targetDuplicateBirthdayFns');
}

// -----------------------------------------------------------------------------
// 5. MỞ NÚT "DANH BẠ KHÁCH HÀNG & CSKH ZALO" TRÊN NAVBAR & PHÂN QUYỀN AN TOÀN
// -----------------------------------------------------------------------------
// 5a. Thêm nút vào Topbar cạnh Tri Ân Khách Hàng
const targetBirthdayBtnNavbar = `        <!-- 2. TRI ÂN KHÁCH HÀNG (SINH NHẬT & CSKH - ĐỒNG BỘ FONT CHUẨN) -->
        <button onclick="openBirthdayModal()" id="nav-birthdays" class="nav-btn flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-200 hover:text-white hover:bg-slate-800/80 transition cursor-pointer">
          <i class="fa-solid fa-cake-candles text-rose-400 text-xs"></i>
          <span class="font-bold">Tri Ân Khách Hàng</span>
          <span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30">Gia Đình</span>
        </button>`;

const replaceAddCustDirBtn = targetBirthdayBtnNavbar + `

        <!-- 2B. DANH BẠ KHÁCH HÀNG & CSKH MARKETING -->
        <button onclick="openCustomerDirectoryModal()" id="nav-customer-directory" class="nav-btn flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-200 hover:text-white hover:bg-slate-800/80 transition cursor-pointer shrink-0">
          <i class="fa-solid fa-address-book text-amber-400 text-xs"></i>
          <span class="font-bold">Danh Bạ Khách</span>
          <span id="badge-total-customers-sidebar" class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">0</span>
        </button>`;

if (content.includes(targetBirthdayBtnNavbar)) {
  content = content.replace(targetBirthdayBtnNavbar, replaceAddCustDirBtn);
  console.log('✅ 5a. Thêm nút "Danh Bạ Khách" vào thanh công cụ Top Navbar');
} else {
  console.log('⚠️ 5a. Không tìm thấy targetBirthdayBtnNavbar');
}

// 5b. Phân quyền trong extractCustomerDirectory (Sales chỉ xem khách của mình, Admin/DR/Tax/Acc xem toàn bộ)
const targetExtractCust = `    function extractCustomerDirectory() {
      const map = new Map();

      bookings.forEach(b => {
        const phone = (b.sdt || '').trim();
        const name = (b.khachHang || '').trim();
        if (!name && !phone) return;`;

const replaceExtractCustSafe = `    function extractCustomerDirectory() {
      const map = new Map();
      const myEmail = currentUser ? (currentUser.email || '').toLowerCase() : '';
      const isAdmin = currentUser && currentUser.role === 'admin';
      const isDr = currentUser && currentUser.role === 'dr';
      const isTax = currentUser && currentUser.role === 'tax';
      const isAcc = currentUser && (currentUser.role === 'acc' || currentUser.role === 'accountant');
      const canViewAllCust = isAdmin || isDr || isTax || isAcc;

      bookings.forEach(b => {
        // Phân quyền bảo mật: Nhân viên sales chỉ nhìn thấy và tiếp thị khách hàng do chính mình phụ trách
        const isMine = b.saleEmail && b.saleEmail.toLowerCase() === myEmail;
        if (!canViewAllCust && !isMine) return;

        const phone = (b.sdt || '').trim();
        const name = (b.khachHang || '').trim();
        if (!name && !phone) return;`;

if (content.includes(targetExtractCust)) {
  content = content.replace(targetExtractCust, replaceExtractCustSafe);
  console.log('✅ 5b. Thêm phân quyền bảo mật danh bạ khách hàng trong extractCustomerDirectory()');
} else {
  console.log('⚠️ 5b. Không tìm thấy targetExtractCust');
}

// -----------------------------------------------------------------------------
// 6. NÉN ẢNH TỰ ĐỘNG CHO handleFileUpload (CHỐNG TRÀN BỘ NHỚ KHI TẢI CHỨNG TỪ)
// -----------------------------------------------------------------------------
const targetHandleFileUpload = `      try {
        const res = await fetch('upload.php', { method: 'POST', body: formData });
        const data = await res.json();

        if (data.success) {
          if (!b.files) b.files = [];
          b.files.push({
            name: data.fileName,
            url: data.fileUrl,
            time: data.uploadTime
          });

          if (file.name.toLowerCase().includes('hd') || file.name.toLowerCase().includes('hoa_don')) {
            b.statusHdVao = 'da_co';
          }

          saveData();
          renderFilesList();
          renderTable();
          alert('✅ Đã tải và lưu giữ file thành công lên máy chủ!');
        } else {
          alert('❌ Lỗi upload: ' + data.error);
        }
      } catch (err) {
        const reader = new FileReader();
        reader.onload = function(e) {
          if (!b.files) b.files = [];
          b.files.push({
            name: file.name,
            url: e.target.result,
            time: new Date().toLocaleString('vi-VN')
          });
          saveData();
          renderFilesList();
          renderTable();
          alert('✅ Đã lưu file vào bộ nhớ hệ thống!');
        };
        reader.readAsDataURL(file);
      }`;

const replaceHandleFileUploadCompressed = `      try {
        const res = await fetch('upload.php', { method: 'POST', body: formData });
        const data = await res.json();

        if (data.success) {
          if (!b.files) b.files = [];
          b.files.push({
            name: data.fileName,
            url: data.fileUrl,
            time: data.uploadTime
          });

          if (file.name.toLowerCase().includes('hd') || file.name.toLowerCase().includes('hoa_don')) {
            b.statusHdVao = 'da_co';
          }

          saveData();
          renderFilesList();
          renderTable();
          alert('✅ Đã tải và lưu giữ file thành công lên máy chủ!');
        } else {
          alert('❌ Lỗi upload: ' + data.error);
        }
      } catch (err) {
        // Tự động nén ảnh nếu là file ảnh để chống tràn hạn ngạch LocalStorage (5MB)
        let processedUrl = '';
        if (file.type && file.type.startsWith('image/')) {
          try {
            processedUrl = await compressImageFile(file, 1200, 0.7);
          } catch(e) {
            processedUrl = await new Promise(r => {
              const reader = new FileReader();
              reader.onload = ev => r(ev.target.result);
              reader.readAsDataURL(file);
            });
          }
        } else {
          processedUrl = await new Promise(r => {
            const reader = new FileReader();
            reader.onload = ev => r(ev.target.result);
            reader.readAsDataURL(file);
          });
        }

        if (!b.files) b.files = [];
        b.files.push({
          name: file.name,
          url: processedUrl,
          time: new Date().toLocaleString('vi-VN')
        });

        if (file.name.toLowerCase().includes('hd') || file.name.toLowerCase().includes('hoa_don')) {
          b.statusHdVao = 'da_co';
        }

        saveData();
        renderFilesList();
        renderTable();
        alert('✅ Đã nén và lưu chứng từ an toàn vào bộ nhớ hệ thống!');
      }`;

if (content.includes(targetHandleFileUpload)) {
  content = content.replace(targetHandleFileUpload, replaceHandleFileUploadCompressed);
  console.log('✅ 6. Tích hợp nén ảnh thông minh trước khi lưu chứng từ Base64');
} else {
  console.log('⚠️ 6. Không tìm thấy targetHandleFileUpload');
}

// -----------------------------------------------------------------------------
// 7. ĐỒNG BỘ MỞ NÚT XÓA ĐƠN CHO DIRECTOR (dr)
// -----------------------------------------------------------------------------
const targetCanDelete = `      const isAdmin = currentUser && currentUser.role === 'admin';
      const isDr = currentUser && currentUser.role === 'dr';
      const isTax = currentUser && currentUser.role === 'tax';
      const isAcc = currentUser && (currentUser.role === 'acc' || currentUser.role === 'accountant');
      const isSale = currentUser && currentUser.role === 'sale';

      // QUY ĐỊNH PHÂN QUYỀN CÔNG VIỆC CÔNG TY TNHH BOOKING TRAVEL:
      // 1. Sales 1 -> 10: Chỉ nhìn thấy và thao tác trên các đơn do chính mình phụ trách. Không thấy dữ liệu của sales khác hay tài chính cty.
      // 2. Tax: Thấy toàn bộ đơn để theo dõi HĐ VAT đầu vào, đầu ra, MST và báo cáo thuế.
      // 3. Acc: Thấy toàn bộ đơn để kiểm soát dòng tiền thu/chi, đối soát AR/AP, quản trị tuổi nợ, chốt P&L.
      // 4. DR (Director): Tầm nhìn chiến lược toàn cảnh, phê duyệt cấp cao các đơn hàng và chi phí lớn.
      // 5. Admin: Toàn quyền quản trị hệ thống, phân quyền, cấu hình và xóa đơn.
      const canViewAll = isAdmin || isDr || isTax || isAcc;
      const canDelete = isAdmin;`;

const replaceCanDeleteDirector = `      const isAdmin = currentUser && currentUser.role === 'admin';
      const isDr = currentUser && currentUser.role === 'dr';
      const isTax = currentUser && currentUser.role === 'tax';
      const isAcc = currentUser && (currentUser.role === 'acc' || currentUser.role === 'accountant');
      const isSale = currentUser && currentUser.role === 'sale';

      // QUY ĐỊNH PHÂN QUYỀN CÔNG VIỆC CÔNG TY TNHH BOOKING TRAVEL:
      // 1. Sales 1 -> 10: Chỉ nhìn thấy và thao tác trên các đơn do chính mình phụ trách.
      // 2. Tax: Thấy toàn bộ đơn để theo dõi HĐ VAT đầu vào, đầu ra, MST và báo cáo thuế.
      // 3. Acc: Thấy toàn bộ đơn để kiểm soát dòng tiền thu/chi, đối soát AR/AP, quản trị tuổi nợ, chốt P&L.
      // 4. DR (Director): Tầm nhìn chiến lược toàn cảnh, phê duyệt cấp cao các đơn hàng và chi phí lớn. Có quyền xóa đơn sau xác thực.
      // 5. Admin: Toàn quyền quản trị hệ thống, phân quyền, cấu hình và xóa đơn.
      const canViewAll = isAdmin || isDr || isTax || isAcc;
      const canDelete = isAdmin || isDr;`;

if (content.includes(targetCanDelete)) {
  content = content.replace(targetCanDelete, replaceCanDeleteDirector);
  console.log('✅ 7. Đồng bộ quyền xóa đơn (canDelete = isAdmin || isDr) trên giao diện bảng');
} else {
  console.log('⚠️ 7. Không tìm thấy targetCanDelete');
}

fs.writeFileSync(filePath, content, 'utf-8');
console.log(`Phase 1 finished successfully! New file size: ${content.length} bytes`);

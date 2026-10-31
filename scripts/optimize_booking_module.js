const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'CRM_Booking.html');
let content = fs.readFileSync(filePath, 'utf-8');

console.log(`Starting Booking Module optimization. Initial size: ${content.length} bytes`);

// -----------------------------------------------------------------------------
// 1. THÊM CÁC HÀM XỬ LÝ QUY TRÌNH TRẠNG THÁI & AUDIT TRAIL VÀO JAVASCRIPT
// -----------------------------------------------------------------------------
const workflowEngineJs = `
    // =========================================================================
    // QUY TRÌNH TRẠNG THÁI CHUẨN 6 BƯỚC & VALIDATION NGHIỆP VỤ BOOKING DU LỊCH
    // Quy trình: Mới tạo ➔ Chờ kiểm tra ➔ Chờ xác nhận đối tác ➔ Đã xác nhận ➔ Đã thanh toán ➔ Hoàn thành
    // =========================================================================
    const BOOKING_WORKFLOW_STEPS = [
      { key: 'moi_tao', label: 'Mới Tạo', step: 1, icon: 'fa-file-circle-plus', color: 'text-slate-300 bg-slate-800/80 border-slate-700' },
      { key: 'cho_kiem_tra', label: 'Chờ Kiểm Tra', step: 2, icon: 'fa-magnifying-glass', color: 'text-amber-300 bg-amber-500/20 border-amber-500/40' },
      { key: 'cho_xac_nhan_doi_tac', label: 'Chờ XN Đối Tác', step: 3, icon: 'fa-paper-plane', color: 'text-purple-300 bg-purple-500/20 border-purple-500/40' },
      { key: 'da_xac_nhan', label: 'Đã Xác Nhận', step: 4, icon: 'fa-hotel', color: 'text-sky-300 bg-sky-500/20 border-sky-500/40' },
      { key: 'da_thanh_toan', label: 'Đã Thanh Toán', step: 5, icon: 'fa-money-check-dollar', color: 'text-teal-300 bg-teal-500/20 border-teal-500/40' },
      { key: 'hoan_thanh', label: 'Hoàn Thành', step: 6, icon: 'fa-circle-check', color: 'text-emerald-300 bg-emerald-500/20 border-emerald-500/40' }
    ];

    function getBookingStatusMeta(status) {
      const s = (status || '').toLowerCase().trim();
      if (s === 'moi_tao') {
        return { label: 'Mới Tạo', step: 1, color: 'text-slate-300 bg-slate-800 border-slate-700', icon: 'fa-file-circle-plus' };
      }
      if (s === 'cho_kiem_tra' || s === 'cho_duyet' || s === 'cho_coc') {
        return { label: 'Chờ Kiểm Tra', step: 2, color: 'text-amber-300 bg-amber-500/20 border-amber-500/40', icon: 'fa-magnifying-glass' };
      }
      if (s === 'cho_xac_nhan_doi_tac' || s === 'ke_toan_duyet') {
        return { label: 'Chờ XN Đối Tác', step: 3, color: 'text-purple-300 bg-purple-500/20 border-purple-500/40', icon: 'fa-paper-plane' };
      }
      if (s === 'da_xac_nhan' || s === 'da_chot' || s === 'dang_di') {
        return { label: 'Đã Xác Nhận', step: 4, color: 'text-sky-300 bg-sky-500/20 border-sky-500/40', icon: 'fa-hotel' };
      }
      if (s === 'da_thanh_toan' || s === 'da_coc') {
        return { label: 'Đã Thanh Toán', step: 5, color: 'text-teal-300 bg-teal-500/20 border-teal-500/40', icon: 'fa-money-check-dollar' };
      }
      if (s === 'hoan_thanh' || s === 'hoan_tat') {
        return { label: 'Hoàn Thành', step: 6, color: 'text-emerald-300 bg-emerald-500/20 border-emerald-500/40', icon: 'fa-circle-check' };
      }
      if (s === 'da_huy') {
        return { label: 'Đã Hủy', step: 0, color: 'text-rose-400 bg-rose-500/20 border-rose-500/40', icon: 'fa-ban' };
      }
      if (s === 'da_hoan_tien') {
        return { label: 'Đã Hoàn Tiền', step: 0, color: 'text-orange-400 bg-orange-500/20 border-orange-500/40', icon: 'fa-arrow-rotate-left' };
      }
      return { label: status || 'Mới Tạo', step: 1, color: 'text-slate-300 bg-slate-800 border-slate-700', icon: 'fa-circle' };
    }

    // ĐIỀU KIỆN NGHIỆP VỤ BẮT BUỘC ĐỂ ĐƯỢC PHÉP ĐÁNH DẤU HOÀN THÀNH
    function validateBookingCompletion(b) {
      const errors = [];
      const rev = parseFloat(b.giaBan) || 0;
      const paidAR = parseFloat(b.khachDaCoc) || 0;
      const remainAR = Math.max(0, rev - paidAR);
      const cst = parseFloat(b.giaVon) || 0;

      // 1. Khách hàng bắt buộc phải thanh toán đủ 100% (remainAR === 0)
      if (remainAR > 0) {
        errors.push('Khách hàng chưa thanh toán đủ: Còn thiếu ' + remainAR.toLocaleString('vi-VN') + ' đ (Đã thu: ' + paidAR.toLocaleString('vi-VN') + ' đ / Tổng: ' + rev.toLocaleString('vi-VN') + ' đ).');
      }

      // 2. Phải có xác nhận dịch vụ từ đối tác (Code phòng hoặc File confirm KS)
      const hasConfirm = (b.codePhong && b.codePhong.trim().length > 0) || 
                         (b.hotelConfirmFiles && b.hotelConfirmFiles.length > 0);
      if (!hasConfirm) {
        errors.push('Chưa có mã xác nhận (Code phòng) hoặc tài liệu xác nhận (Confirm) từ đối tác/khách sạn.');
      }

      // 3. Phải có thông tin đối tác cung cấp & giá vốn net
      if (rev > 0 && cst <= 0) {
        errors.push('Chưa nhập giá vốn nhà cung cấp (Giá net nhập từ đối tác).');
      }

      // 4. Nếu có yêu cầu xuất hóa đơn VAT đầu ra, kế toán bắt buộc phải xuất số HĐ ra
      if (b.coXuatVat && b.statusHdRa === 'chua_xuat') {
        errors.push('Đơn hàng có yêu cầu xuất hóa đơn VAT nhưng kế toán chưa xuất số hóa đơn đầu ra.');
      }

      return {
        canComplete: errors.length === 0,
        errors: errors
      };
    }

    // HÀM CHUYỂN TRẠNG THÁI QUY TRÌNH (KÈM GHI NHẬN LỊCH SỬ THAO TÁC AUDIT TRAIL)
    function advanceBookingStatus(bookingId, targetStatus) {
      const b = bookings.find(x => x.id === bookingId);
      if (!b) return false;

      const currentSt = b.tourStatus || 'moi_tao';
      if (currentSt === targetStatus) return true;

      // KIỂM TRA ĐIỀU KIỆN NGHIỆP VỤ BẮT BUỘC NẾU CHUYỂN SANG HOÀN THÀNH
      if (targetStatus === 'hoan_thanh' || targetStatus === 'hoan_tat') {
        const checkRes = validateBookingCompletion(b);
        if (!checkRes.canComplete) {
          let alertMsg = '⛔ KHÔNG THỂ ĐÁNH DẤU HOÀN THÀNH BOOKING [' + b.maBooking + ']:\\n\\nĐơn hàng chưa đáp ứng các điều kiện nghiệp vụ sau:\\n';
          checkRes.errors.forEach((err, idx) => {
            alertMsg += '• ' + (idx + 1) + '. ' + err + '\\n';
          });
          alertMsg += '\\nVui lòng xử lý xong các hạng mục trên trước khi đóng đơn.';
          alert(alertMsg);
          return false;
        }
      }

      const oldMeta = getBookingStatusMeta(currentSt);
      const newMeta = getBookingStatusMeta(targetStatus);

      if (!confirm('Xác nhận chuyển trạng thái đơn hàng [' + b.maBooking + '] từ:\\n"' + oldMeta.label + '" ➔ "' + newMeta.label + '"?')) {
        return false;
      }

      b.tourStatus = targetStatus;

      // GHI NHẬN LỊCH SỬ THAO TÁC AUDIT TRAIL
      if (!Array.isArray(b.editHistory)) b.editHistory = [];
      const now = new Date();
      b.editHistory.unshift({
        id: 'rev_' + Date.now(),
        timestamp: now.toISOString(),
        timeFormatted: now.toLocaleTimeString('vi-VN') + ' ' + now.toLocaleDateString('vi-VN'),
        userName: currentUser ? currentUser.name : 'Nhân viên điều hành',
        userEmail: currentUser ? currentUser.email : 'admin@bookingtravel.vn',
        userRole: currentUser ? (currentUser.role || 'Staff') : 'Admin',
        changes: [
          'Chuyển trạng thái quy trình: "' + oldMeta.label + '" ➔ "' + newMeta.label + '"'
        ]
      });

      saveData();
      renderTable();
      updateMetrics();
      if (currentView === 'cashflow') renderCashflowView();

      if (typeof showToastNotification === 'function') {
        showToastNotification('Đã chuyển đơn [' + b.maBooking + '] sang "' + newMeta.label + '" thành công!', 'fa-circle-check');
      }

      // Đóng modal workflow nếu đang mở
      closeWorkflowStatusModal();
      return true;
    }

    // MODAL ĐIỀU KHIỂN QUY TRÌNH TRẠNG THÁI BOOKING (WORKFLOW STEPPER MODAL)
    let currentWorkflowBookingId = null;

    function openWorkflowStatusModal(id) {
      const b = bookings.find(x => x.id === id);
      if (!b) return;

      currentWorkflowBookingId = id;
      const modal = document.getElementById('modal-workflow-status');
      if (!modal) return;

      const rev = parseFloat(b.giaBan) || 0;
      const cst = parseFloat(b.giaVon) || 0;
      const profit = rev - cst;
      const paidAR = parseFloat(b.khachDaCoc) || 0;
      const remainAR = Math.max(0, rev - paidAR);
      const paidAP = parseFloat(b.daTraDoiTac) || 0;
      const remainAP = Math.max(0, cst - paidAP);

      // Điền thông tin booking vào modal
      document.getElementById('wf-code').innerText = b.maBooking;
      document.getElementById('wf-customer').innerText = (b.khachHang || 'N/A') + ' • ' + (b.sdt || '');
      document.getElementById('wf-hotel').innerText = b.dichVu || b.doiTac || 'Khách sạn / Resort';
      document.getElementById('wf-dates').innerText = (b.checkIn || 'N/A') + ' ➔ ' + (b.checkOut || 'N/A') + ' (' + (b.soDem || 1) + ' đêm)';
      document.getElementById('wf-rooms').innerText = (b.hangPhong || 'Tiêu chuẩn') + ' • ' + (b.soLuongPhong || 1) + ' phòng • ' + (b.soKhach || '2 người lớn');
      document.getElementById('wf-finance').innerText = 'Bán: ' + rev.toLocaleString('vi-VN') + ' đ | Vốn: ' + cst.toLocaleString('vi-VN') + ' đ | Lợi nhuận: +' + profit.toLocaleString('vi-VN') + ' đ';
      document.getElementById('wf-payment').innerHTML = remainAR <= 0 ? 
        '<span class="text-emerald-400 font-bold"><i class="fa-solid fa-circle-check"></i> Đã thanh toán 100% (' + paidAR.toLocaleString('vi-VN') + ' đ)</span>' : 
        '<span class="text-amber-400 font-bold"><i class="fa-solid fa-clock"></i> Đã thu ' + paidAR.toLocaleString('vi-VN') + ' đ • Còn nợ ' + remainAR.toLocaleString('vi-VN') + ' đ</span>';
      
      const hasConfirm = (b.codePhong && b.codePhong.trim().length > 0) || (b.hotelConfirmFiles && b.hotelConfirmFiles.length > 0);
      document.getElementById('wf-service-status').innerHTML = hasConfirm ?
        '<span class="text-sky-300 font-bold"><i class="fa-solid fa-hotel"></i> Code: ' + (b.codePhong || 'Đã có file confirm KS') + '</span>' :
        '<span class="text-rose-400 font-bold"><i class="fa-solid fa-triangle-exclamation"></i> Chưa có Code / Confirm từ đối tác</span>';

      // Render 6 bước trạng thái trực quan
      const currentMeta = getBookingStatusMeta(b.tourStatus);
      const stepperEl = document.getElementById('wf-stepper-container');
      if (stepperEl) {
        stepperEl.innerHTML = BOOKING_WORKFLOW_STEPS.map(step => {
          const isCurrent = step.key === b.tourStatus || (step.key === 'moi_tao' && (!b.tourStatus || b.tourStatus === 'cho_duyet'));
          const isPassed = currentMeta.step > step.step;
          let stepClass = 'bg-slate-900 border-slate-700 text-slate-400';
          if (isCurrent) {
            stepClass = 'bg-blue-600/30 border-blue-500 text-white shadow-lg ring-2 ring-blue-500/50 font-black';
          } else if (isPassed) {
            stepClass = 'bg-emerald-950/40 border-emerald-600 text-emerald-400';
          }

          return '<button type="button" onclick="advanceBookingStatus(\\'' + b.id + '\\', \\'' + step.key + '\\')" class="p-3 rounded-xl border flex flex-col items-center justify-center text-center transition hover:scale-105 cursor-pointer ' + stepClass + '">' +
            '<div class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-1 ' + (isCurrent ? 'bg-blue-600 text-white' : (isPassed ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400')) + '">' +
              (isPassed ? '<i class="fa-solid fa-check text-[10px]"></i>' : step.step) +
            '</div>' +
            '<span class="text-xs font-bold block">' + step.label + '</span>' +
            (isCurrent ? '<span class="text-[9px] font-extrabold text-blue-300 uppercase tracking-wider mt-0.5 animate-pulse">● Đang ở bước này</span>' : '') +
          '</button>';
        }).join('');
      }

      modal.classList.remove('hidden');
    }

    function closeWorkflowStatusModal() {
      const modal = document.getElementById('modal-workflow-status');
      if (modal) modal.classList.add('hidden');
    }
`;

// Chèn workflowEngineJs trước function renderTable()
if (content.includes('// =========================================================================\n    // HỆ THỐNG PHÂN TRANG (PAGINATION)')) {
  content = content.replace('// =========================================================================\n    // HỆ THỐNG PHÂN TRANG (PAGINATION)', workflowEngineJs + '\n    // =========================================================================\n    // HỆ THỐNG PHÂN TRANG (PAGINATION)');
  console.log('✅ 1. Tích hợp Workflow Engine 6 bước & Validation nghiệp vụ thành công.');
} else {
  console.log('⚠️ 1. Đặt trước function renderTable.');
  content = content.replace('function renderTable() {', workflowEngineJs + '\n    function renderTable() {');
}

// -----------------------------------------------------------------------------
// 2. CẬP NHẬT GIAO DIỆN BẢNG BOOKINGS (THÊM CỘT TRẠNG THÁI QUY TRÌNH & LỊCH SỬ THAO TÁC)
// -----------------------------------------------------------------------------
// Cập nhật tiêu đề cột bảng tableHeadRow
const oldTheadRowIsSale = `            <th class="py-3 px-3.5">Mã Đơn</th>
            <th class="py-3 px-3.5">Ngày Tạo</th>
            <th class="py-3 px-3.5 text-center">IN - OUT</th>
            <th class="py-3 px-3.5">Khách Hàng</th>
            <th class="py-3 px-3.5">Số Điện Thoại</th>
            <th class="py-3 px-3.5 text-right">Doanh Thu</th>
            <th class="py-3 px-3.5 text-right">Giá Nét</th>
            <th class="py-3 px-3.5 text-right">Hoa Hồng</th>
            <th class="py-3 px-3.5 text-center">Thu Khách</th>
            <th class="py-3 px-3.5 text-center">Nợ Đối Tác</th>
            <th class="py-3 px-3.5 text-right">Thao Tác</th>`;

const newTheadRowIsSale = `            <th class="py-3 px-3">Mã Đơn & Sales</th>
            <th class="py-3 px-3 text-center">Trạng Thái Quy Trình</th>
            <th class="py-3 px-3">Ngày Tạo & Code KS</th>
            <th class="py-3 px-3 text-center">IN - OUT</th>
            <th class="py-3 px-3">Khách Hàng & KS</th>
            <th class="py-3 px-3">Số Điện Thoại</th>
            <th class="py-3 px-3 text-right">Doanh Thu</th>
            <th class="py-3 px-3 text-right">Giá Nét</th>
            <th class="py-3 px-3 text-right">Hoa Hồng</th>
            <th class="py-3 px-3 text-center">Thu Khách</th>
            <th class="py-3 px-3 text-center">Nợ Đối Tác</th>
            <th class="py-3 px-3 text-right">Thao Tác</th>`;

if (content.includes(oldTheadRowIsSale)) {
  content = content.replace(oldTheadRowIsSale, newTheadRowIsSale);
  console.log('✅ 2a. Cập nhật thead sales có cột Trạng Thái Quy Trình thành công.');
}

const oldTheadRowNonSale = `            <th class="py-3 px-3.5">Mã Đơn</th>
            <th class="py-3 px-3.5">Ngày Tạo</th>
            <th class="py-3 px-3.5 text-center">IN - OUT</th>
            <th class="py-3 px-3.5">Khách Hàng</th>
            <th class="py-3 px-3.5">Số Điện Thoại</th>
            <th class="py-3 px-3.5 text-right">Doanh Thu</th>
            <th class="py-3 px-3.5 text-right">Giá Vốn</th>
            <th class="py-3 px-3.5 text-right">Hoa Hồng</th>
            <th class="py-3 px-3.5 text-center">Thu Khách</th>
            <th class="py-3 px-3.5 text-center">Nợ Đối Tác</th>
            <th class="py-3 px-3.5 text-center">HĐ Đầu Vào</th>
            <th class="py-3 px-3.5 text-center">HĐ Đầu Ra</th>
            <th class="py-3 px-3.5 text-center">Tài Liệu</th>
            <th class="py-3 px-3.5 text-right">Thao Tác</th>`;

const newTheadRowNonSale = `            <th class="py-3 px-3">Mã Đơn & Sales</th>
            <th class="py-3 px-3 text-center">Trạng Thái Quy Trình</th>
            <th class="py-3 px-3">Ngày Tạo & Code KS</th>
            <th class="py-3 px-3 text-center">IN - OUT</th>
            <th class="py-3 px-3">Khách Hàng & KS</th>
            <th class="py-3 px-3">Số Điện Thoại</th>
            <th class="py-3 px-3 text-right">Doanh Thu</th>
            <th class="py-3 px-3 text-right">Giá Vốn</th>
            <th class="py-3 px-3 text-right">Hoa Hồng</th>
            <th class="py-3 px-3 text-center">Thu Khách</th>
            <th class="py-3 px-3 text-center">Nợ Đối Tác</th>
            <th class="py-3 px-3 text-center">HĐ Đầu Vào</th>
            <th class="py-3 px-3 text-center">HĐ Đầu Ra</th>
            <th class="py-3 px-3 text-center">Tài Liệu</th>
            <th class="py-3 px-3 text-right">Thao Tác</th>`;

if (content.includes(oldTheadRowNonSale)) {
  content = content.replace(oldTheadRowNonSale, newTheadRowNonSale);
  console.log('✅ 2b. Cập nhật thead ban quản trị có cột Trạng Thái Quy Trình thành công.');
}

// Cập nhật thẻ tĩnh <thead> ở dòng HTML ban đầu nếu có
const staticTheadOld = `                  <th class="py-3 px-3.5">Mã Đơn</th>
                  <th class="py-3 px-3.5">Ngày Tạo</th>
                  <th class="py-3 px-3.5 text-center">IN - OUT</th>`;
const staticTheadNew = `                  <th class="py-3 px-3">Mã Đơn & Sales</th>
                  <th class="py-3 px-3 text-center">Trạng Thái Quy Trình</th>
                  <th class="py-3 px-3">Ngày Tạo & Code KS</th>
                  <th class="py-3 px-3 text-center">IN - OUT</th>`;
if (content.includes(staticTheadOld)) {
  content = content.replace(staticTheadOld, staticTheadNew);
}

// -----------------------------------------------------------------------------
// 3. CHÈN CỘT TRẠNG THÁI QUY TRÌNH VÀO TỪNG DÒNG DỮ LIỆU DESKTOP TRONG RENDER TABLE
// -----------------------------------------------------------------------------
const oldTdCol1 = `          <tr class="hover:bg-slate-800/30 transition group">
            <!-- 1. MÃ ĐƠN & NHÂN VIÊN PHỤ TRÁCH -->
            <td class="py-3 px-3.5 whitespace-nowrap">
              <div class="flex items-center gap-1.5 flex-wrap">
                <span class="font-mono font-bold text-sky-400 text-xs">\${escapeHtml(b.maBooking)}</span>
                \${(b.editHistory && b.editHistory.length > 0) ? \`
                  <button type="button" onclick="openBookingHistoryModal('\${b.id}')" class="text-[9px] font-bold text-amber-300 bg-amber-500/20 border border-amber-500/30 hover:bg-amber-500 hover:text-black px-1.5 py-0.2 rounded transition cursor-pointer flex items-center gap-0.5" title="Đã có \${b.editHistory.length} lần sửa nội dung. Bấm xem chi tiết">
                    <i class="fa-solid fa-clock-rotate-left text-[8px]"></i> \${b.editHistory.length} lần sửa
                  </button>
                \` : ''}
              </div>
              <div class="text-[11px] text-slate-300 font-medium flex items-center gap-1.5 mt-0.5 truncate max-w-[145px]" title="Nhân viên phụ trách: \${escapeHtml(staffDisplayName)}">
                <i class="fa-solid fa-user-tie text-[10px] text-sky-400/80 shrink-0"></i>
                <span class="truncate">\${escapeHtml(staffDisplayName)}</span>
              </div>
            </td>`;

const newTdCol1 = `          <tr class="hover:bg-slate-800/30 transition group">
            <!-- 1. MÃ ĐƠN & NHÂN VIÊN PHỤ TRÁCH -->
            <td class="py-3 px-3 whitespace-nowrap">
              <div class="flex items-center gap-1.5 flex-wrap">
                <span class="font-mono font-bold text-sky-400 text-xs">\${escapeHtml(b.maBooking)}</span>
                <button type="button" onclick="openBookingHistoryModal('\${b.id}')" class="text-[9px] font-bold text-amber-300 bg-amber-500/20 border border-amber-500/30 hover:bg-amber-500 hover:text-black px-1.5 py-0.2 rounded transition cursor-pointer flex items-center gap-0.5" title="Xem lịch sử thao tác & chỉnh sửa">
                  <i class="fa-solid fa-clock-rotate-left text-[8px]"></i> \${(b.editHistory && b.editHistory.length > 0) ? b.editHistory.length + ' thao tác' : 'Lịch sử'}
                </button>
              </div>
              <div class="text-[11px] text-slate-300 font-medium flex items-center gap-1.5 mt-0.5 truncate max-w-[145px]" title="Nhân viên phụ trách: \${escapeHtml(staffDisplayName)}">
                <i class="fa-solid fa-user-tie text-[10px] text-sky-400/80 shrink-0"></i>
                <span class="truncate">\${escapeHtml(staffDisplayName)}</span>
              </div>
            </td>

            <!-- 1B. TRẠNG THÁI QUY TRÌNH (6 BƯỚC NỐI TIẾP) -->
            <td class="py-3 px-3 text-center whitespace-nowrap">
              \${(() => {
                const meta = getBookingStatusMeta(b.tourStatus);
                return '<button type="button" onclick="openWorkflowStatusModal(\\'' + b.id + '\\')" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold ' + meta.color + ' border shadow-sm hover:brightness-125 transition cursor-pointer" title="Bấm để chuyển trạng thái theo quy trình (Mới tạo ➔ Chờ kiểm tra ➔ Chờ XN đối tác ➔ Đã xác nhận ➔ Đã thanh toán ➔ Hoàn thành)">' +
                  '<i class="fa-solid ' + meta.icon + ' text-[10px]"></i>' +
                  '<span>' + meta.label + '</span>' +
                  '<i class="fa-solid fa-chevron-right text-[8px] opacity-70"></i>' +
                '</button>';
              })()}
            </td>`;

if (content.includes(oldTdCol1)) {
  content = content.replace(oldTdCol1, newTdCol1);
  console.log('✅ 3. Tích hợp cột Trạng Thái Quy Trình vào bảng Desktop thành công.');
} else {
  console.error('❌ 3. Không tìm thấy oldTdCol1!');
}

// -----------------------------------------------------------------------------
// 4. CẬP NHẬT THẺ ĐIỆN THOẠI (MOBILE CARDS) CÓ STATUS STEPPER & NÚT LỊCH SỬ THAO TÁC
// -----------------------------------------------------------------------------
const oldMobileCardHeader = `            <div class="flex items-center justify-between pb-2 border-b border-slate-800">
              <div class="flex items-center gap-2">
                <span class="font-mono font-bold text-sky-400 text-sm">\${escapeHtml(b.maBooking)}</span>
                \${(b.editHistory && b.editHistory.length > 0) ? \`
                  <button type="button" onclick="openBookingHistoryModal('\${b.id}')" class="text-[9px] font-bold text-amber-300 bg-amber-500/20 border border-amber-500/30 px-1.5 py-0.5 rounded cursor-pointer">
                    \${b.editHistory.length} lần sửa
                  </button>
                \` : ''}
              </div>
              \${workflowActionBtn}
            </div>`;

const newMobileCardHeader = `            <div class="flex items-center justify-between pb-2 border-b border-slate-800">
              <div class="flex items-center gap-1.5">
                <span class="font-mono font-bold text-sky-400 text-sm">\${escapeHtml(b.maBooking)}</span>
                <button type="button" onclick="openBookingHistoryModal('\${b.id}')" class="text-[9px] font-bold text-amber-300 bg-amber-500/20 border border-amber-500/30 px-1.5 py-0.5 rounded cursor-pointer">
                  <i class="fa-solid fa-clock-rotate-left text-[8px]"></i> \${(b.editHistory && b.editHistory.length > 0) ? b.editHistory.length : ''} Lịch sử
                </button>
              </div>
              <div>
                \${(() => {
                  const meta = getBookingStatusMeta(b.tourStatus);
                  return '<button type="button" onclick="openWorkflowStatusModal(\\'' + b.id + '\\')" class="px-2.5 py-1 rounded-xl text-xs font-bold ' + meta.color + ' border shadow-sm flex items-center gap-1 cursor-pointer">' +
                    '<i class="fa-solid ' + meta.icon + ' text-[10px]"></i> ' + meta.label + ' <i class="fa-solid fa-chevron-right text-[8px]"></i>' +
                  '</button>';
                })()}
              </div>
            </div>`;

if (content.includes(oldMobileCardHeader)) {
  content = content.replace(oldMobileCardHeader, newMobileCardHeader);
  console.log('✅ 4. Tích hợp Trạng Thái Quy Trình vào Mobile Cards thành công.');
}

// -----------------------------------------------------------------------------
// 5. CẬP NHẬT MODAL HỦY / HOÀN TIỀN: BỔ SUNG GHI LỊCH SỬ THAO TÁC (AUDIT TRAIL)
// -----------------------------------------------------------------------------
const oldXacNhanHuyTarget = `      activeCancelBooking.ngayHuy = new Date().toISOString();
      activeCancelBooking.nguoiHuy = userName;

      saveData();`;

const newXacNhanHuyReplacement = `      activeCancelBooking.ngayHuy = new Date().toISOString();
      activeCancelBooking.nguoiHuy = userName;

      // TỰ ĐỘNG GHI NHẬN VÀO LỊCH SỬ THAO TÁC AUDIT TRAIL
      if (!Array.isArray(activeCancelBooking.editHistory)) activeCancelBooking.editHistory = [];
      const nowCancel = new Date();
      activeCancelBooking.editHistory.unshift({
        id: 'rev_' + Date.now(),
        timestamp: nowCancel.toISOString(),
        timeFormatted: nowCancel.toLocaleTimeString('vi-VN') + ' ' + nowCancel.toLocaleDateString('vi-VN'),
        userName: userName,
        userEmail: currentUser ? currentUser.email : 'admin@bookingtravel.vn',
        userRole: currentUser ? (currentUser.role || 'Admin') : 'Admin',
        changes: [
          'HỦY BOOKING & HOÀN TIỀN KHÁCH',
          'Lý do hủy: ' + lyDo,
          'Số tiền hoàn khách: ' + soTienHoan.toLocaleString('vi-VN') + ' đ',
          'Phí phạt khách: ' + phatKhach.toLocaleString('vi-VN') + ' đ',
          'Phí phạt đối tác NCC: ' + phatNCC.toLocaleString('vi-VN') + ' đ',
          'Tài khoản hoàn tiền: ' + bank + ' - ' + stk + ' (' + name + ')'
        ]
      });

      saveData();`;

if (content.includes(oldXacNhanHuyTarget)) {
  content = content.replace(oldXacNhanHuyTarget, newXacNhanHuyReplacement);
  console.log('✅ 5. Ghi nhận Audit Trail cho trường hợp Hủy / Hoàn tiền thành công.');
}

// -----------------------------------------------------------------------------
// 6. CẬP NHẬT BÁO THU KHÁCH: GHI NHẬN AUDIT TRAIL KHI THU TIỀN
// -----------------------------------------------------------------------------
const oldQuickBaoThuTarget = `      // Đồng bộ vào b.files để xem trong phần quản lý chứng từ
      if (!Array.isArray(b.files)) b.files = [];
      currentQbtUncFiles.forEach(unc => {
        if (!b.files.some(x => x.name === unc.name || (x.url && x.url === unc.url))) {
          b.files.push({
            name: \`[UNC] \${unc.name}\`,
            url: unc.url,
            time: unc.time
          });
        }
      });

      saveData();`;

const newQuickBaoThuReplacement = `      // Đồng bộ vào b.files để xem trong phần quản lý chứng từ
      if (!Array.isArray(b.files)) b.files = [];
      currentQbtUncFiles.forEach(unc => {
        if (!b.files.some(x => x.name === unc.name || (x.url && x.url === unc.url))) {
          b.files.push({
            name: \`[UNC] \${unc.name}\`,
            url: unc.url,
            time: unc.time
          });
        }
      });

      // TỰ ĐỘNG GHI NHẬN VÀO LỊCH SỬ THAO TÁC AUDIT TRAIL
      if (!Array.isArray(b.editHistory)) b.editHistory = [];
      const nowBaoThu = new Date();
      b.editHistory.unshift({
        id: 'rev_' + Date.now(),
        timestamp: nowBaoThu.toISOString(),
        timeFormatted: nowBaoThu.toLocaleTimeString('vi-VN') + ' ' + nowBaoThu.toLocaleDateString('vi-VN'),
        userName: currentUser ? currentUser.name : 'Kế toán thu',
        userEmail: currentUser ? currentUser.email : 'admin@bookingtravel.vn',
        userRole: currentUser ? (currentUser.role || 'Staff') : 'Admin',
        changes: [
          'Thu tiền khách: +' + amountVal.toLocaleString('vi-VN') + ' đ (Đã thu: ' + newPaid.toLocaleString('vi-VN') + ' đ / Tổng: ' + totalRev.toLocaleString('vi-VN') + ' đ)',
          'Ghi chú / Phương thức: ' + (document.getElementById('qbt-note').value || 'Quét mã VietQR Techcombank'),
          newPaid >= totalRev ? 'Trạng thái chuyển sang: ĐÃ THANH TOÁN (Thu đủ 100%)' : 'Trạng thái: ĐÃ CỌC (Còn nợ ' + (totalRev - newPaid).toLocaleString('vi-VN') + ' đ)'
        ]
      });

      saveData();`;

if (content.includes(oldQuickBaoThuTarget)) {
  content = content.replace(oldQuickBaoThuTarget, newQuickBaoThuReplacement);
  console.log('✅ 6. Ghi nhận Audit Trail cho trường hợp Thu tiền khách thành công.');
}

// -----------------------------------------------------------------------------
// 7. CẬP NHẬT SELECT STATUS TRONG FORM TẠO/SỬA ĐƠN (#ipt-tour-status)
// -----------------------------------------------------------------------------
const oldSelectTourStatus = `              <select id="ipt-tour-status" class="w-full bg-[#07162f] border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-amber-300 font-bold focus:outline-none focus:border-amber-400">
                <option value="cho_duyet">🟡 Bước 1: Chờ Kế Toán Duyệt Tiền</option>
                <option value="da_coc">🟠 Đã Cọc / Giữ Chỗ Phòng</option>
                <option value="ke_toan_duyet">🔵 Bước 2: Kế Toán Đã Duyệt Tiền - Chờ BGĐ</option>
                <option value="da_chot">🟢 Bước 3: BGĐ Đã Duyệt - Chốt Điều Hành</option>
                <option value="dang_di">🟣 Bước 4: Đang Check-in / Đi Tour</option>
                <option value="hoan_tat">⚪ Bước 5: Đã Check-out & Quyết Toán</option>
              </select>`;

const newSelectTourStatus = `              <select id="ipt-tour-status" class="w-full bg-[#07162f] border border-slate-700 rounded-xl px-3 py-2 text-xs sm:text-sm text-amber-300 font-bold focus:outline-none focus:border-amber-400">
                <option value="moi_tao">🆕 1. Mới tạo</option>
                <option value="cho_kiem_tra">🔍 2. Chờ kiểm tra</option>
                <option value="cho_xac_nhan_doi_tac">⏳ 3. Chờ xác nhận đối tác</option>
                <option value="da_xac_nhan">🏨 4. Đã xác nhận (Có code / confirm)</option>
                <option value="da_thanh_toan">💳 5. Đã thanh toán (Thu đủ 100%)</option>
                <option value="hoan_thanh">✅ 6. Hoàn thành (Check-out & Chốt P&L)</option>
                <option value="da_huy">🚫 Đã hủy</option>
                <option value="da_hoan_tien">↩️ Đã hoàn tiền</option>
              </select>`;

if (content.includes(oldSelectTourStatus)) {
  content = content.replace(oldSelectTourStatus, newSelectTourStatus);
  console.log('✅ 7. Cập nhật options 6 bước chuẩn trong form sửa đơn thành công.');
}

// -----------------------------------------------------------------------------
// 8. BẮT RÀNG BUỘC KHI SAVE TRONG handleSaveBooking (KHÔNG CHO ĐÁNH DẤU HOÀN THÀNH KHI THIẾU ĐIỀU KIỆN)
// -----------------------------------------------------------------------------
const oldSavePreCheck = `      // Tính tổng khách đã cọc / thanh toán từ các đợt đã thu
      const totalCustomerPaid = currentFormPayments
        .filter(p => p.trangThai === 'da_thu')
        .reduce((sum, p) => sum + (parseFloat(p.soTien) || 0), 0);`;

const newSavePreCheck = `      // KIỂM TRA ĐIỀU KIỆN HOÀN THÀNH NẾU USER CHỌN HOÀN THÀNH
      const selectedStatus = document.getElementById('ipt-tour-status').value;
      if (selectedStatus === 'hoan_thanh' || selectedStatus === 'hoan_tat') {
        const tempCheckItem = {
          giaBan: rev,
          giaVon: cost,
          khachDaCoc: currentFormPayments.filter(p => p.trangThai === 'da_thu').reduce((sum, p) => sum + (parseFloat(p.soTien) || 0), 0),
          daTraDoiTac: apPaid,
          codePhong: document.getElementById('ipt-room-code')?.value.trim() || '',
          hotelConfirmFiles: editId ? (bookings.find(x => x.id === editId)?.hotelConfirmFiles || []) : [],
          coXuatVat: document.getElementById('ipt-co-xuat-vat').checked,
          statusHdRa: document.getElementById('ipt-status-hd-ra').value
        };
        const valRes = validateBookingCompletion(tempCheckItem);
        if (!valRes.canComplete) {
          let alertMsg = '⛔ KHÔNG THỂ ĐÁNH DẤU HOÀN THÀNH:\\n\\nĐơn hàng chưa đáp ứng các điều kiện nghiệp vụ sau:\\n';
          valRes.errors.forEach((err, idx) => {
            alertMsg += '• ' + (idx + 1) + '. ' + err + '\\n';
          });
          alertMsg += '\\nVui lòng xử lý xong các điều kiện trên trước khi đóng đơn.';
          alert(alertMsg);
          return;
        }
      }

      // Tính tổng khách đã cọc / thanh toán từ các đợt đã thu
      const totalCustomerPaid = currentFormPayments
        .filter(p => p.trangThai === 'da_thu')
        .reduce((sum, p) => sum + (parseFloat(p.soTien) || 0), 0);`;

if (content.includes(oldSavePreCheck)) {
  content = content.replace(oldSavePreCheck, newSavePreCheck);
  console.log('✅ 8. Ràng buộc không cho phép hoàn thành đơn khi thiếu điều kiện trong form thành công.');
}

// -----------------------------------------------------------------------------
// 9. THÊM MODAL QUY TRÌNH TRẠNG THÁI (WORKFLOW MODAL) VÀO TRƯỚC </body>
// -----------------------------------------------------------------------------
const workflowModalHtml = `
  <!-- ========================================================================= -->
  <!-- MODAL ĐIỀU KHIỂN QUY TRÌNH TRẠNG THÁI 6 BƯỚC (WORKFLOW STEPPER MODAL) -->
  <!-- ========================================================================= -->
  <div id="modal-workflow-status" class="fixed inset-0 z-50 overflow-hidden hidden flex items-center justify-center p-3 sm:p-4">
    <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" onclick="closeWorkflowStatusModal()"></div>
    <div class="relative bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl z-10 space-y-4">
      
      <!-- Header Modal -->
      <div class="flex items-center justify-between border-b border-slate-800 pb-3">
        <div class="flex items-center gap-2.5">
          <div class="w-10 h-10 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center text-base font-bold">
            <i class="fa-solid fa-timeline"></i>
          </div>
          <div>
            <h3 class="text-sm sm:text-base font-black text-white uppercase tracking-wider flex items-center gap-2">
              <span>ĐIỀU HÀNH QUY TRÌNH TRẠNG THÁI BOOKING</span>
              <span id="wf-code" class="text-sky-400 font-mono">DH...</span>
            </h3>
            <p class="text-[11px] text-slate-400">Quy trình: Mới tạo ➔ Chờ kiểm tra ➔ Chờ XN đối tác ➔ Đã xác nhận ➔ Đã thanh toán ➔ Hoàn thành</p>
          </div>
        </div>
        <button onclick="closeWorkflowStatusModal()" class="text-slate-400 hover:text-white text-lg p-1 cursor-pointer">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <!-- Khối tóm tắt thông tin nghiệp vụ cốt lõi của đơn hàng -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3.5 rounded-2xl bg-[#07162f] border border-blue-900/40 text-xs text-slate-300">
        <div>
          <span class="text-[10px] text-slate-400 font-medium block">Khách hàng:</span>
          <span id="wf-customer" class="font-bold text-white block mt-0.5">...</span>
        </div>
        <div>
          <span class="text-[10px] text-slate-400 font-medium block">Khách sạn / Resort:</span>
          <span id="wf-hotel" class="font-bold text-amber-300 block mt-0.5">...</span>
        </div>
        <div>
          <span class="text-[10px] text-slate-400 font-medium block">Lịch trình & Đêm:</span>
          <span id="wf-dates" class="font-mono text-slate-200 block mt-0.5">...</span>
        </div>
        <div>
          <span class="text-[10px] text-slate-400 font-medium block">Hạng phòng & Khách:</span>
          <span id="wf-rooms" class="font-medium text-slate-200 block mt-0.5">...</span>
        </div>
        <div class="sm:col-span-2 pt-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-2">
          <div id="wf-finance" class="font-mono font-bold text-white text-[11px]">Bán: 0 đ | Vốn: 0 đ</div>
          <div id="wf-payment">...</div>
        </div>
        <div class="sm:col-span-2 flex items-center justify-between gap-2 text-[11px]">
          <span class="text-slate-400">Xác nhận dịch vụ từ đối tác:</span>
          <div id="wf-service-status">...</div>
        </div>
      </div>

      <!-- Stepper 6 bước trực quan -->
      <div>
        <label class="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">Bấm để chuyển trạng thái theo quy trình:</label>
        <div id="wf-stepper-container" class="grid grid-cols-2 sm:grid-cols-3 gap-2">
          <!-- Rendered by JS -->
        </div>
      </div>

      <!-- Footer Buttons -->
      <div class="border-t border-slate-800 pt-3 flex flex-wrap items-center justify-between gap-2">
        <button type="button" onclick="if(currentWorkflowBookingId) openBookingHistoryModal(currentWorkflowBookingId); closeWorkflowStatusModal();" class="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-bold transition flex items-center gap-1.5 border border-slate-700 cursor-pointer">
          <i class="fa-solid fa-clock-rotate-left text-amber-400"></i>
          <span>Xem Lịch Sử Thao Tác</span>
        </button>

        <div class="flex items-center gap-2">
          <button type="button" onclick="if(currentWorkflowBookingId) openModalHuyDon(currentWorkflowBookingId); closeWorkflowStatusModal();" class="px-3 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white text-xs font-bold transition flex items-center gap-1.5 border border-rose-500/30 cursor-pointer">
            <i class="fa-solid fa-ban"></i>
            <span>Hủy / Hoàn Tiền</span>
          </button>
          <button type="button" onclick="closeWorkflowStatusModal()" class="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer">
            Đóng
          </button>
        </div>
      </div>

    </div>
  </div>
`;

const closingTag = '</body>\n</html>';
if (content.includes(closingTag)) {
  content = content.replace(closingTag, workflowModalHtml + '\n' + closingTag);
  console.log('✅ 9. Thêm Modal Quy Trình Trạng Thái vào DOM thành công.');
}

// -----------------------------------------------------------------------------
// 10. GHI FILE & HOÀN TẤT
// -----------------------------------------------------------------------------
fs.writeFileSync(filePath, content, 'utf-8');
console.log(`Booking Module Optimization completed! New file size: ${content.length} bytes`);

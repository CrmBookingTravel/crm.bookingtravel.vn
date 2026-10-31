const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'CRM_Booking.html');
let content = fs.readFileSync(filePath, 'utf-8');

const targetMobileHeader = `        // 2. RENDER THẺ TRÊN ĐIỆN THOẠI (DANH SÁCH DỌC, NÚT TO DỄ CHẠM KHI ĐI THỊ TRƯỜNG)
        mobileCardsHtml += \`
          <div class="bg-[#0b192c] border border-[#1a2c47] hover:border-blue-500/50 rounded-2xl p-4 shadow-xl space-y-3 transition">
            
            <!-- Dòng 1: Mã Đơn + Nhân Viên & Doanh Thu -->
            <div class="flex items-center justify-between">
              <div>
                <div class="flex items-center gap-1.5 flex-wrap">
                  <span class="font-mono font-bold text-sky-400 text-xs">\${escapeHtml(b.maBooking)}</span>`;

const replaceMobileHeader = `        // 2. RENDER THẺ TRÊN ĐIỆN THOẠI (DANH SÁCH DỌC, NÚT TO DỄ CHẠM KHI ĐI THỊ TRƯỜNG)
        mobileCardsHtml += \`
          <div class="bg-[#0b192c] border border-[#1a2c47] hover:border-blue-500/50 rounded-2xl p-4 shadow-xl space-y-3 transition">
            
            <!-- Dòng 0: Thanh Trạng Thái Quy Trình 6 Bước & Lịch Sử Thao Tác (Mobile) -->
            <div class="flex items-center justify-between pb-2 border-b border-slate-800/80">
              <button type="button" onclick="openWorkflowStatusModal('\${b.id}')" class="px-2.5 py-1 rounded-xl text-xs font-bold \${getBookingStatusMeta(b.tourStatus).color} border shadow-sm flex items-center gap-1.5 cursor-pointer">
                <i class="fa-solid \${getBookingStatusMeta(b.tourStatus).icon} text-[10px]"></i>
                <span>\${getBookingStatusMeta(b.tourStatus).label}</span>
                <i class="fa-solid fa-chevron-right text-[8px] opacity-70"></i>
              </button>

              <button type="button" onclick="openBookingHistoryModal('\${b.id}')" class="text-[10px] font-bold text-amber-300 bg-amber-500/20 border border-amber-500/30 hover:bg-amber-500 hover:text-black px-2 py-0.5 rounded-lg transition cursor-pointer flex items-center gap-1">
                <i class="fa-solid fa-clock-rotate-left text-[9px]"></i>
                <span>\${(b.editHistory && b.editHistory.length > 0) ? b.editHistory.length + ' thao tác' : 'Lịch sử'}</span>
              </button>
            </div>

            <!-- Dòng 1: Mã Đơn + Nhân Viên & Doanh Thu -->
            <div class="flex items-center justify-between">
              <div>
                <div class="flex items-center gap-1.5 flex-wrap">
                  <span class="font-mono font-bold text-sky-400 text-xs">\${escapeHtml(b.maBooking)}</span>`;

if (content.includes(targetMobileHeader)) {
  content = content.replace(targetMobileHeader, replaceMobileHeader);
  console.log('✅ Đã thêm Trạng Thái Quy Trình & Lịch Sử vào đầu Mobile Cards thành công.');
  fs.writeFileSync(filePath, content, 'utf-8');
} else {
  console.log('⚠️ targetMobileHeader không khớp');
}

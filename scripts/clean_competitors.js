const fs = require('fs');
const path = require('path');

const crmPath = path.join(__dirname, '..', 'crm.html');
let content = fs.readFileSync(crmPath, 'utf8');

const replacements = [
  // Titles and Meta
  [
    'Booking Travel CRM - Hệ Thống Điều Hành Lữ Hành & Quản Trị Khách Sạn Resort Chuẩn vTour 4.0',
    'Booking Travel CRM - Hệ Thống Điều Hành Lữ Hành & Quản Trị Khách Sạn Resort Chuyên Nghiệp'
  ],
  [
    'Hệ thống CRM & ERP quản trị lữ hành chuyên nghiệp của Công ty TNHH Booking Travel. Quản lý 100+ khách sạn, resort, tour đoàn, dòng tiền thực chuẩn vTour và hóa đơn MISA với triết lý \'Khách hàng là gia đình\'.',
    'Hệ thống CRM & ERP quản trị lữ hành chuyên nghiệp của Công ty TNHH Booking Travel. Quản lý 100+ khách sạn, resort, tour đoàn, dòng tiền thực tế và hóa đơn thuế GTGT với triết lý \'Khách hàng là gia đình\'.'
  ],
  [
    'Booking Travel, crm booking travel, phần mềm lữ hành vTour, quản trị du lịch, đặt phòng resort, bảng giá khách sạn resort, quản lý tour lữ hành, MISA du lịch',
    'Booking Travel, crm booking travel, phần mềm lữ hành, quản trị du lịch, đặt phòng resort, bảng giá khách sạn resort, quản lý tour lữ hành, hóa đơn thuế du lịch'
  ],
  [
    'Booking Travel CRM - Khách Hàng Là Gia Đình • Chuẩn vTour 4.0',
    'Booking Travel CRM - Khách Hàng Là Gia Đình • Hệ Thống Điều Hành Độc Quyền'
  ],
  [
    'Nền tảng CRM & ERP điều hành lữ hành, quản trị bảng giá 100+ khách sạn resort, dòng tiền thực và hóa đơn MISA của Công ty TNHH Booking Travel.',
    'Nền tảng CRM & ERP điều hành lữ hành, quản trị bảng giá 100+ khách sạn resort, dòng tiền thực tế và hóa đơn thuế GTGT của Công ty TNHH Booking Travel.'
  ],
  [
    'Hệ thống CRM & ERP quản trị lữ hành, khách sạn resort chuẩn vTour 4.0.',
    'Hệ thống CRM & ERP quản trị lữ hành, khách sạn resort chuyên nghiệp.'
  ],
  [
    '"name": "Booking Travel CRM vTour"',
    '"name": "Booking Travel CRM"'
  ],
  // Login Hero & Badges
  [
    '<span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">vTour 4.0</span>',
    '<span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">Bản Quyền v4.0</span>'
  ],
  [
    '<h4 class="text-xs font-bold text-white mb-0.5">Chuẩn Nghiệp Vụ vTour</h4>',
    '<h4 class="text-xs font-bold text-white mb-0.5">Nghiệp Vụ Lữ Hành Chuyên Nghiệp</h4>'
  ],
  [
    '<p class="text-[11px] text-slate-300">Quản trị dòng tiền thực, kiểm soát nợ AR/AP và xuất hóa đơn thuế MISA.</p>',
    '<p class="text-[11px] text-slate-300">Quản trị dòng tiền thực, kiểm soát nợ AR/AP và quản lý hóa đơn thuế GTGT.</p>'
  ],
  // Sidebar
  [
    '<!-- BÁO CÁO & DÒNG TIỀN CÔNG TY (CHUẨN VTOUR) -->',
    '<!-- BÁO CÁO & DÒNG TIỀN CÔNG TY (BOOKING TRAVEL) -->'
  ],
  [
    '<span class="ml-auto text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">MISA</span>',
    '<span class="ml-auto text-[9px] font-bold px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">P&L</span>'
  ],
  [
    '<!-- Báo Giá Nhanh 1 Chạm (TourWell) -->',
    '<!-- Báo Giá Nhanh 1 Chạm (Booking Travel) -->'
  ],
  [
    '<span id="badge-aging-count" class="ml-auto text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">MISA</span>',
    '<span id="badge-aging-count" class="ml-auto text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">Thuế GTGT</span>'
  ],
  [
    '<!-- HÓA ĐƠN & KẾ TOÁN MISA -->',
    '<!-- HÓA ĐƠN & KẾ TOÁN THUẾ GTGT -->'
  ],
  [
    '<span>Kết Xuất Kế Toán MISA</span>',
    '<span>Kết Xuất Hóa Đơn Thuế GTGT</span>'
  ],
  // Views
  [
    '<!-- VIEW 2: DÒNG TIỀN CẢ CÔNG TY (CASH FLOW STATEMENT CHUẨN VTOUR) -->',
    '<!-- VIEW 2: DÒNG TIỀN CẢ CÔNG TY (CASH FLOW STATEMENT) -->'
  ],
  [
    '<!-- VIEW 3: BÁO CÁO DOANH THU & TÀI CHÍNH (P&L) CHUẨN VTOUR -->',
    '<!-- VIEW 3: BÁO CÁO DOANH THU & TÀI CHÍNH (P&L) -->'
  ],
  [
    '<p class="text-xs text-slate-400 mt-0.5">Mô hình báo cáo quản trị chuyên sâu học tập từ giải pháp vTour & MISA meInvoice</p>',
    '<p class="text-xs text-slate-400 mt-0.5">Mô hình báo cáo quản trị tài chính chuyên sâu của Công ty TNHH Booking Travel</p>'
  ],
  [
    '<span>Xuất Bảng Kê MISA (CSV)</span>',
    '<span>Xuất Bảng Kê Hóa Đơn (CSV)</span>'
  ],
  [
    '<!-- Bảng Đối Soát Công Nợ 2 Chiều (vTour Two-Way Reconciliation) -->',
    '<!-- Bảng Đối Soát Công Nợ 2 Chiều (Two-Way Reconciliation) -->'
  ],
  [
    '<!-- VIEW 4: ĐÁNH GIÁ HIỆU SUẤT & BẢNG XẾP HẠNG SALES (CHUẨN VTOUR) -->',
    '<!-- VIEW 4: ĐÁNH GIÁ HIỆU SUẤT & BẢNG XẾP HẠNG SALES -->'
  ],
  [
    '<!-- 5. SLIDE-OVER DRAWER: FORM TẠO/SỬA BOOKING (CHUẨN VTOUR) -->',
    '<!-- 5. SLIDE-OVER DRAWER: FORM TẠO/SỬA BOOKING -->'
  ],
  [
    '<!-- MODAL: ĐIỀU HÀNH & HẠCH TOÁN BOOKING (CHUẨN vTOUR 4.5 - TỐI GIẢN, RỘNG RÃI) -->',
    '<!-- MODAL: ĐIỀU HÀNH & HẠCH TOÁN BOOKING (BOOKING TRAVEL - TỐI GIẢN, RỘNG RÃI) -->'
  ],
  [
    '<p class="text-xs text-slate-400">Công ty TNHH Booking Travel &bull; Chuẩn vTour 4.5</p>',
    '<p class="text-xs text-slate-400">Công ty TNHH Booking Travel &bull; Hệ Thống Điều Hành Độc Quyền</p>'
  ],
  // Modal Buttons
  [
    '<span>Copy Dữ Liệu Gửi MISA</span>',
    '<span>Copy Dữ Liệu Xuất HĐ GTGT</span>'
  ],
  [
    'title="Copy thông tin xuất hóa đơn chuẩn định dạng để gửi cho kế toán MISA"',
    'title="Copy thông tin xuất hóa đơn chuẩn định dạng để gửi cho bộ phận kế toán thuế"'
  ],
  [
    '<!-- MODAL 1: BÁO GIÁ NHANH & AI CHIẾT TÍNH P&L THÔNG MINH (TOURWELL & NHANH TRAVEL) -->',
    '<!-- MODAL 1: BÁO GIÁ NHANH & AI CHIẾT TÍNH P&L THÔNG MINH (BOOKING TRAVEL) -->'
  ],
  [
    '<span class="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">AI Quote vTour</span>',
    '<span class="text-[9px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">AI Báo Giá Nhanh</span>'
  ],
  [
    '<!-- MODAL 3: CHĂM SÓC SINH NHẬT & TRI ÂN GIA ĐÌNH KHÁCH HÀNG (FACEWORKS & NHANH TRAVEL) -->',
    '<!-- MODAL 3: CHĂM SÓC SINH NHẬT & TRI ÂN GIA ĐÌNH KHÁCH HÀNG (BOOKING TRAVEL) -->'
  ],
  [
    '<!-- 8. JAVASCRIPT HỆ THỐNG: TÀI KHOẢN, PHÂN QUYỀN, DÒNG TIỀN & BÁO CÁO VTOUR -->',
    '<!-- 8. JAVASCRIPT HỆ THỐNG: TÀI KHOẢN, PHÂN QUYỀN, DÒNG TIỀN & BÁO CÁO -->'
  ],
  [
    '// 1. SMART QUOTE & P&L CALCULATOR LOGIC (TOURWELL & NHANH TRAVEL)',
    '// 1. SMART QUOTE & P&L CALCULATOR LOGIC (BOOKING TRAVEL)'
  ],
  [
    '// 3. CHĂM SÓC SINH NHẬT & TRI ÂN GIA ĐÌNH KHÁCH HÀNG (FACEWORKS & NHANH TRAVEL)',
    '// 3. CHĂM SÓC SINH NHẬT & TRI ÂN GIA ĐÌNH KHÁCH HÀNG (BOOKING TRAVEL)'
  ],
  [
    '// RENDER VIEW 3: BÁO CÁO DOANH THU & TÀI CHÍNH (P&L) CHUẨN VTOUR',
    '// RENDER VIEW 3: BÁO CÁO DOANH THU & TÀI CHÍNH (P&L)'
  ],
  [
    '// RENDER VIEW 4: ĐÁNH GIÁ & XẾP HẠNG SALES (KPI CHUẨN VTOUR)',
    '// RENDER VIEW 4: ĐÁNH GIÁ & XẾP HẠNG SALES (KPI BOOKING TRAVEL)'
  ],
  [
    '// MODAL TẠO & SỬA ĐƠN & QUẢN TRỊ THANH TOÁN ĐA ĐỢT (CHUẨN vTOUR 4.0)',
    '// MODAL TẠO & SỬA ĐƠN & QUẢN TRỊ THANH TOÁN ĐA ĐỢT (BOOKING TRAVEL)'
  ],
  // JS functions
  [
    'THÔNG TIN XUẤT HÓA ĐƠN GTGT (GỬI KẾ TOÁN MISA - BOOKING TRAVEL)',
    'THÔNG TIN XUẤT HÓA ĐƠN GTGT (GỬI KẾ TOÁN THUẾ - BOOKING TRAVEL)'
  ],
  [
    'alert(\'📋 ĐÃ SAO CHÉP THÔNG TIN XUẤT HÓA ĐƠN GTGT! Bạn có thể dán (Ctrl+V) gửi ngay cho Kế toán MISA meInvoice!\');',
    'alert(\'📋 ĐÃ SAO CHÉP THÔNG TIN XUẤT HÓA ĐƠN GTGT! Bạn có thể dán (Ctrl+V) gửi ngay cho bộ phận Kế toán / Thuế để xuất hóa đơn!\');'
  ],
  [
    'a.download = `MISA_VTOUR_BOOKING_TRAVEL_${new Date().toISOString().slice(0,10)}.csv`;',
    'a.download = `HOA_DON_GTGT_BOOKING_TRAVEL_${new Date().toISOString().slice(0,10)}.csv`;'
  ],
  [
    'app: "Booking Travel CRM vTour 4.0"',
    'app: "Booking Travel CRM v4.0"'
  ],
  [
    'title="Báo giá nhanh 1 chạm & chiết tính P&L chuẩn TourWell"',
    'title="Báo giá nhanh 1 chạm & chiết tính P&L chuyên nghiệp"'
  ]
];

let replacedCount = 0;
for (const [target, replacement] of replacements) {
  if (content.includes(target)) {
    content = content.split(target).join(replacement);
    replacedCount++;
    console.log(`Replaced: "${target.slice(0, 40)}..."`);
  } else {
    console.warn(`Target not found: "${target.slice(0, 40)}..."`);
  }
}

fs.writeFileSync(crmPath, content, 'utf8');
console.log(`Finished ${replacedCount} replacements in crm.html!`);

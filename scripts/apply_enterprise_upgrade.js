const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'CRM_Booking.html');
let content = fs.readFileSync(filePath, 'utf-8');

console.log(`Starting Enterprise UI upgrade. Initial size: ${content.length} bytes`);

// -----------------------------------------------------------------------------
// 1. NÂNG CẤP CSS: THÊM STYLES CHO ENTERPRISE SIDEBAR & PAGINATION
// -----------------------------------------------------------------------------
const styleTarget = `    /* Hiệu ứng kéo trượt ẩn / hiện Sidebar mượt mà trên Desktop để mở rộng tối đa màn hình */
    #sidebar-main {
      transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease;
      will-change: margin-left, transform;
    }
    @media (min-width: 1024px) {
      #sidebar-main.is-collapsed {
        margin-left: -20rem !important; /* -320px trượt ẩn hoàn toàn qua bên trái */
        opacity: 0;
        pointer-events: none;
      }
    }`;

const styleReplacement = `    /* Enterprise Layout & Sidebar Styling */
    #sidebar-main {
      transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1), transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease;
      will-change: margin-left, transform;
    }
    @media (min-width: 1024px) {
      #sidebar-main.is-collapsed {
        margin-left: -18rem !important;
        opacity: 0;
        pointer-events: none;
      }
    }
    /* Active Nav Item */
    .nav-btn.is-active {
      background: linear-gradient(90deg, rgba(37, 99, 235, 0.25) 0%, rgba(37, 99, 235, 0.08) 100%) !important;
      border-left: 3px solid #38bdf8 !important;
      color: #ffffff !important;
    }
    /* Sticky table headers */
    #table-head {
      position: sticky;
      top: 0;
      z-index: 10;
      backdrop-filter: blur(8px);
    }
    /* Subtle enterprise card hover */
    .metric-card {
      transition: transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
    }
    .metric-card:hover {
      transform: translateY(-2px);
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 15px -3px rgba(14, 165, 233, 0.15);
    }`;

if (content.includes(styleTarget)) {
  content = content.replace(styleTarget, styleReplacement);
  console.log('✅ 1. Thêm CSS Enterprise thành công.');
} else {
  console.log('⚠️ 1. styleTarget không khớp chính xác, tiếp tục kiểm tra.');
}

// -----------------------------------------------------------------------------
// 2. NÂNG CẤP KHUNG GIAO DIỆN (SIDEBAR + TOP HEADER + BREADCRUMB)
// Thay thế đoạn từ `<!-- 2. MAIN APPLICATION WORKSPACE -->` đến `<main ...>`
// -----------------------------------------------------------------------------
const startWorkspaceMarker = `  <!-- 2. MAIN APPLICATION WORKSPACE -->`;
const endNavMarker = `    <!-- WORKSPACE BODY (CONTAINER CHO CÁC VIEW) -->
    <main class="flex-1 overflow-y-auto p-3 sm:p-6 pb-20 lg:pb-6 space-y-4 sm:space-y-6 w-full min-w-0 overflow-x-hidden">`;

const idxStart = content.indexOf(startWorkspaceMarker);
const idxEnd = content.indexOf(endNavMarker);

if (idxStart !== -1 && idxEnd !== -1) {
  const replacementWorkspace = `  <!-- 2. MAIN APPLICATION WORKSPACE (ENTERPRISE SHELL WITH COLLAPSIBLE SIDEBAR) -->
  <div class="flex-1 flex overflow-hidden w-full relative bg-[#060f1e]">

    <!-- MOBILE SIDEBAR BACKDROP -->
    <div id="mobile-sidebar-backdrop" onclick="toggleMobileSidebar(false)" class="fixed inset-0 bg-black/60 backdrop-blur-xs z-40 hidden lg:hidden"></div>

    <!-- ENTERPRISE SIDEBAR NAVIGATION DRAWER -->
    <aside id="sidebar-main" class="fixed lg:static inset-y-0 left-0 z-40 w-64 sm:w-72 bg-[#07162f] border-r border-[#162744] flex flex-col justify-between shrink-0 transition-all duration-300 transform -translate-x-full lg:translate-x-0 shadow-2xl lg:shadow-none select-none">
      
      <!-- Top Brand in Sidebar -->
      <div class="p-4 border-b border-[#162744] flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="h-10 bg-white rounded-xl px-2.5 py-1 shadow flex items-center justify-center border border-slate-200">
            <img src="logo.png?v=4.0" alt="Booking Travel" class="h-full w-auto object-contain">
          </div>
          <div>
            <div class="text-xs font-black text-white tracking-wider uppercase">BOOKING TRAVEL</div>
            <div class="text-[10px] text-sky-400 font-semibold flex items-center gap-1">
              <i class="fa-solid fa-heart text-rose-400 text-[9px] animate-pulse"></i>
              <span>Khách hàng là gia đình</span>
            </div>
          </div>
        </div>
        <button type="button" onclick="toggleMobileSidebar(false)" class="lg:hidden text-slate-400 hover:text-white p-1">
          <i class="fa-solid fa-xmark text-lg"></i>
        </button>
      </div>

      <!-- Navigation Menu Groups (Scrollable) -->
      <div class="flex-1 overflow-y-auto p-3 space-y-4 scrollbar-thin">
        
        <!-- NHÓM 1: BÀN LÀM VIỆC & KINH DOANH -->
        <div>
          <div class="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Bàn Làm Việc & Kinh Doanh</span>
            <i class="fa-solid fa-briefcase text-[10px] text-sky-400"></i>
          </div>
          <div class="space-y-1">
            <button onclick="switchView('bookings'); setFilter('all');" id="nav-bookings" class="nav-btn is-active w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white hover:bg-slate-800/80 transition cursor-pointer">
              <div class="flex items-center gap-2.5">
                <i class="fa-solid fa-clipboard-list text-sky-400 text-sm w-4 text-center"></i>
                <span>Quản Lý Đơn Hàng</span>
              </div>
              <span id="badge-total-bookings-sidebar" class="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300">0</span>
            </button>

            <button onclick="switchView('kpi_sales')" id="nav-kpi_sales" class="nav-btn w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white hover:bg-slate-800/80 transition cursor-pointer">
              <div class="flex items-center gap-2.5">
                <i class="fa-solid fa-trophy text-amber-400 text-sm w-4 text-center"></i>
                <span id="nav-kpi-text">Doanh Số & Hoa Hồng</span>
              </div>
              <span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">KPI</span>
            </button>

            <button onclick="openCustomerDirectoryModal()" id="nav-customer-directory" class="nav-btn w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white hover:bg-slate-800/80 transition cursor-pointer">
              <div class="flex items-center gap-2.5">
                <i class="fa-solid fa-address-book text-emerald-400 text-sm w-4 text-center"></i>
                <span>Danh Bạ Khách Hàng</span>
              </div>
              <span id="badge-total-customers-sidebar" class="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">0</span>
            </button>

            <button onclick="openBirthdayModal()" id="nav-birthdays" class="nav-btn w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white hover:bg-slate-800/80 transition cursor-pointer">
              <div class="flex items-center gap-2.5">
                <i class="fa-solid fa-cake-candles text-rose-400 text-sm w-4 text-center"></i>
                <span>Tri Ân Sinh Nhật</span>
              </div>
              <span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300">CSKH</span>
            </button>
          </div>
        </div>

        <!-- NHÓM 2: CÔNG CỤ TÍNH GIÁ & TIỆN ÍCH -->
        <div>
          <div class="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Công Cụ & Báo Giá</span>
            <i class="fa-solid fa-calculator text-[10px] text-amber-400"></i>
          </div>
          <div class="space-y-1">
            <button onclick="openPriceCatalogModal()" id="nav-price-catalog" class="nav-btn w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white hover:bg-slate-800/80 transition cursor-pointer">
              <div class="flex items-center gap-2.5">
                <i class="fa-solid fa-hotel text-sky-400 text-sm w-4 text-center"></i>
                <span>Kho Giá Resort & KS</span>
              </div>
              <span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300">100+ KS</span>
            </button>

            <button onclick="openAttendanceModal()" id="nav-attendance" class="nav-btn w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white hover:bg-slate-800/80 transition cursor-pointer">
              <div class="flex items-center gap-2.5">
                <i class="fa-solid fa-calendar-check text-emerald-400 text-sm w-4 text-center"></i>
                <span>Chấm Công Sales</span>
              </div>
              <span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Vào/Ra</span>
            </button>

            <button onclick="openComboCalcModal()" id="nav-combo-calc" class="nav-btn w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white hover:bg-slate-800/80 transition cursor-pointer">
              <div class="flex items-center gap-2.5">
                <i class="fa-solid fa-calculator text-amber-400 text-sm w-4 text-center"></i>
                <span>Bảng Tính Combo</span>
              </div>
              <span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300">Báo Giá</span>
            </button>

            <button onclick="openGroupCalcModal()" id="nav-group-calc" class="nav-btn w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white hover:bg-slate-800/80 transition cursor-pointer">
              <div class="flex items-center gap-2.5">
                <i class="fa-solid fa-people-group text-blue-400 text-sm w-4 text-center"></i>
                <span>Bảng Tính Tour Đoàn</span>
              </div>
              <span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">MICE</span>
            </button>

            <button onclick="openToolZaloModal()" id="nav-tool-zalo" class="nav-btn w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white hover:bg-slate-800/80 transition cursor-pointer">
              <div class="flex items-center gap-2.5">
                <i class="fa-solid fa-comment-dots text-sky-400 text-sm w-4 text-center"></i>
                <span>Tool Zalo CSKH</span>
              </div>
              <span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300">Zalo</span>
            </button>

            <button onclick="openToolFbModal()" id="nav-tool-fb" class="nav-btn w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white hover:bg-slate-800/80 transition cursor-pointer">
              <div class="flex items-center gap-2.5">
                <i class="fa-brands fa-facebook text-indigo-400 text-sm w-4 text-center"></i>
                <span>Tool Facebook</span>
              </div>
              <span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">Fanpage</span>
            </button>

            <button onclick="openToolTiktokModal()" id="nav-tool-tiktok" class="nav-btn w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-200 hover:text-white hover:bg-slate-800/80 transition cursor-pointer">
              <div class="flex items-center gap-2.5">
                <i class="fa-brands fa-tiktok text-rose-400 text-sm w-4 text-center"></i>
                <span>Tool TikTok</span>
              </div>
              <span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300">Video</span>
            </button>
          </div>
        </div>

        <!-- NHÓM 3: TÀI CHÍNH & QUẢN TRỊ DOANH NGHIỆP -->
        <div id="sidebar-group-finance">
          <div class="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
            <span>Tài Chính & Quản Trị</span>
            <i class="fa-solid fa-shield-halved text-[10px] text-emerald-400"></i>
          </div>
          <div class="space-y-1">
            <button onclick="switchView('expenses')" id="nav-expenses" class="nav-btn w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/80 transition cursor-pointer">
              <div class="flex items-center gap-2.5">
                <i class="fa-solid fa-file-invoice-dollar text-rose-400 text-sm w-4 text-center"></i>
                <span>Chi Phí Cty (OpEx)</span>
              </div>
              <span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300">Kế Toán</span>
            </button>

            <button onclick="switchView('cashflow')" id="nav-cashflow" class="nav-btn w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/80 transition cursor-pointer">
              <div class="flex items-center gap-2.5">
                <i class="fa-solid fa-money-bill-transfer text-emerald-400 text-sm w-4 text-center"></i>
                <span>Dòng Tiền Thu - Chi</span>
              </div>
              <span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300">Thực Tế</span>
            </button>

            <button onclick="switchView('reports')" id="nav-reports" class="nav-btn w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/80 transition cursor-pointer">
              <div class="flex items-center gap-2.5">
                <i class="fa-solid fa-chart-line text-sky-400 text-sm w-4 text-center"></i>
                <span>Báo Cáo Lãi Lỗ (P&L)</span>
              </div>
              <span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-sky-500/20 text-sky-300">P&L</span>
            </button>

            <button onclick="switchView('suppliers')" id="nav-suppliers" class="nav-btn w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/80 transition cursor-pointer">
              <div class="flex items-center gap-2.5">
                <i class="fa-solid fa-hotel text-indigo-400 text-sm w-4 text-center"></i>
                <span>Đối Tác & Cung Ứng</span>
              </div>
              <span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300">NCC</span>
            </button>

            <button onclick="switchView('staff')" id="nav-staff" class="nav-btn w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/80 transition cursor-pointer">
              <div class="flex items-center gap-2.5">
                <i class="fa-solid fa-users-gear text-teal-400 text-sm w-4 text-center"></i>
                <span>Phân Quyền Nhân Sự</span>
              </div>
              <span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-teal-500/20 text-teal-300">Admin</span>
            </button>

            <button onclick="openBackupRestoreModal()" id="nav-backup" class="nav-btn w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800/80 transition cursor-pointer">
              <div class="flex items-center gap-2.5">
                <i class="fa-solid fa-database text-purple-400 text-sm w-4 text-center"></i>
                <span>Sao Lưu & Phục Hồi</span>
              </div>
              <span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">JSON</span>
            </button>
          </div>
        </div>

      </div>

      <!-- Bottom Profile / Hotline in Sidebar -->
      <div class="p-3 border-t border-[#162744] bg-[#051124] flex items-center justify-between text-xs">
        <a href="tel:084846477222" class="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition font-mono font-bold">
          <i class="fa-solid fa-phone-volume text-sm animate-pulse"></i>
          <span>084.84.64.77.222</span>
        </a>
        <button type="button" onclick="toggleSidebarDesktop(false)" class="hidden lg:flex text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition" title="Thu gọn Menu (Ctrl+B)">
          <i class="fa-solid fa-angles-left text-xs"></i>
        </button>
      </div>

    </aside>

    <!-- RIGHT MAIN WORKSPACE -->
    <div class="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#071326] w-full">

      <!-- TOP HEADER TOOLBAR -->
      <header class="h-16 border-b border-slate-800 bg-[#07162f] px-3 sm:px-6 flex items-center justify-between shrink-0 z-20 gap-2 sm:gap-4 shadow-sm">
        
        <!-- Left: Toggle Sidebar + Logo + Slogan -->
        <div class="flex items-center gap-2.5 shrink-0">
          <!-- Mobile Hamburger -->
          <button type="button" onclick="toggleMobileSidebar(true)" class="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition" title="Mở Menu">
            <i class="fa-solid fa-bars text-sm"></i>
          </button>
          <!-- Desktop Collapse Button -->
          <button type="button" onclick="toggleSidebarDesktop()" class="hidden lg:flex items-center justify-center w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition" title="Ẩn/Hiện Sidebar (Ctrl+B)">
            <i class="fa-solid fa-bars-staggered text-sm"></i>
          </button>

          <a href="javascript:void(0)" onclick="switchView('bookings'); setFilter('all');" class="h-10 bg-white rounded-xl px-2.5 py-1 shadow flex items-center justify-center border border-slate-200 hover:border-sky-400 shrink-0 group transition" title="Booking Travel - Khách hàng là gia đình">
            <img src="logo.png?v=4.0" alt="Booking Travel" class="h-full w-auto object-contain select-none group-hover:scale-105 transition-transform">
          </a>
          <div class="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-semibold shadow-sm" title="Slogan: Khách hàng là gia đình">
            <i class="fa-solid fa-heart text-rose-400 text-xs animate-pulse"></i>
            <span>"Khách hàng là gia đình"</span>
          </div>
        </div>

        <!-- Center: Universal Smart Search -->
        <div class="flex-1 max-w-md min-w-[180px] mx-1 sm:mx-4">
          <div class="relative w-full">
            <i class="fa-solid fa-magnifying-glass absolute left-3 top-2.5 text-slate-500 text-xs"></i>
            <input type="text" id="global-search" oninput="handleSearch(event)" onkeydown="if(event.key==='Enter') handleSearch(event)" placeholder="🔍 Tìm khách hàng, SĐT, Resort, Tour, Mã Đơn..." class="w-full bg-slate-900/90 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition">
          </div>
        </div>

        <!-- Right: Status + User Account + New Booking Button -->
        <div class="flex items-center gap-2 sm:gap-3 shrink-0">
          
          <!-- Live Online Badge -->
          <span class="hidden 2xl:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Trực Tuyến</span>
          </span>

          <!-- User Account Pill -->
          <div class="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs shadow-sm">
            <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" title="Bảo mật CRM đang hoạt động an toàn"></span>
            <button type="button" onclick="openModalChuyenTaiKhoan()" class="flex items-center gap-1.5 text-left hover:opacity-80 transition cursor-pointer" title="Bấm để đổi vai trò & phân quyền (Ban Giám Đốc / Kế Toán / Sales)">
              <span id="topbar-user-role-badge" class="px-1.5 py-0.5 rounded text-[10px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                <i class="fa-solid fa-crown text-[9px] mr-1"></i>BGĐ
              </span>
              <span id="topbar-user-email" class="font-bold text-white max-w-[90px] sm:max-w-[140px] truncate">Bùi Phạm Quỳnh Chi</span>
              <i class="fa-solid fa-caret-down text-slate-400 text-[10px]"></i>
            </button>
            
            <button type="button" onclick="openChangePasswordModal()" class="px-2 py-0.5 bg-blue-500/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 rounded text-[11px] font-bold transition flex items-center gap-1 cursor-pointer" title="Đổi mật khẩu & mã PIN bảo mật cá nhân">
              <i class="fa-solid fa-shield-halved text-blue-400"></i>
              <span class="hidden md:inline">Bảo Mật</span>
            </button>

            <button type="button" onclick="lockScreenNow()" class="px-2 py-0.5 bg-amber-500/20 hover:bg-amber-600 text-amber-300 hover:text-white border border-amber-500/30 rounded text-[11px] font-bold transition flex items-center gap-1 cursor-pointer" title="Khóa màn hình riêng tư bảo vệ dữ liệu">
              <i class="fa-solid fa-lock text-amber-400"></i>
              <span class="hidden md:inline">Khóa</span>
            </button>

            <button type="button" onclick="handleLogout()" class="ml-0.5 px-2 py-0.5 bg-rose-500/20 hover:bg-rose-600 text-rose-300 hover:text-white border border-rose-500/30 rounded text-[11px] font-bold transition flex items-center gap-1 cursor-pointer" title="Đăng xuất hoàn toàn">
              <i class="fa-solid fa-power-off text-rose-400"></i>
              <span class="hidden sm:inline">Thoát</span>
            </button>
          </div>

          <!-- NÚT TẠO BOOKING MỚI (NỔI BẬT NHẤT) -->
          <button onclick="openModalTaoDon()" class="px-3 sm:px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 active:scale-95 text-white text-xs font-black rounded-xl shadow-md shadow-blue-600/30 transition flex items-center gap-1.5 sm:gap-2 cursor-pointer shrink-0" title="Tạo đơn hàng booking mới vào hệ thống CRM">
            <i class="fa-solid fa-plus text-xs"></i>
            <span class="hidden sm:inline uppercase tracking-wider">Tạo Booking</span>
            <span class="sm:hidden font-bold uppercase text-[11px]">Tạo Đơn</span>
          </button>

        </div>
      </header>

      <!-- BREADCRUMB / DEPARTMENT TOP BAR -->
      <div id="workspace-breadcrumb-bar" class="bg-[#091527] border-b border-slate-800/80 px-3 sm:px-6 py-2 flex items-center justify-between gap-2 shrink-0">
        <div class="flex items-center gap-2 text-xs">
          <i class="fa-solid fa-briefcase text-sky-400 text-xs"></i>
          <span id="current-view-title" class="font-bold text-sky-300">Phòng Kinh Doanh</span>
          <span class="text-slate-600">•</span>
          <span class="text-slate-400 hidden sm:inline">Hệ Thống Điều Hành & CSKH Chuyên Nghiệp</span>
        </div>
        <div class="flex items-center gap-2 text-xs">
          <button onclick="openPriceCatalogModal()" class="px-2.5 py-1 rounded-lg bg-sky-500/10 hover:bg-sky-500/20 text-sky-300 border border-sky-500/30 transition flex items-center gap-1 cursor-pointer">
            <i class="fa-solid fa-hotel text-[10px]"></i>
            <span class="font-medium">Kho Giá</span>
          </button>
          <button onclick="openCustomerDirectoryModal()" class="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition flex items-center gap-1 cursor-pointer">
            <i class="fa-solid fa-address-book text-[10px]"></i>
            <span class="font-medium">Danh Bạ Khách</span>
          </button>
          <button onclick="openAttendanceModal()" class="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition flex items-center gap-1 cursor-pointer">
            <i class="fa-solid fa-calendar-check text-[10px]"></i>
            <span class="font-medium">Chấm Công</span>
          </button>
        </div>
      </div>

`;

  content = content.substring(0, idxStart) + replacementWorkspace + content.substring(idxEnd);
  console.log('✅ 2. Thay thế Shell Workspace & Enterprise Sidebar thành công.');
} else {
  console.error('❌ 2. Không tìm thấy marker startWorkspaceMarker hoặc endNavMarker!');
}

// -----------------------------------------------------------------------------
// 3. THAY THẾ KHỐI 5 METRIC CARDS TRÊN VIEW BOOKINGS VỚI PHONG CÁCH DOANH NGHIỆP
// -----------------------------------------------------------------------------
const oldCardsMarker = `        <!-- 5 METRIC CARDS KẾ TOÁN & CẢNH BÁO (THIẾT KẾ NHỎ GỌN, CÂN ĐỐI VỚI CÁC THANH NGANG) -->`;
const endOldCardsMarker = `        <!-- BẢNG THEO DÕI ĐƠN HÀNG & HÓA ĐƠN -->`;

const idxCardsStart = content.indexOf(oldCardsMarker);
const idxCardsEnd = content.indexOf(endOldCardsMarker);

if (idxCardsStart !== -1 && idxCardsEnd !== -1) {
  const replacementCards = `        <!-- 5 METRIC CARDS KẾ TOÁN & CẢNH BÁO (DOANH NGHIỆP HIỆN ĐẠI, TỐI GIẢN) -->
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
          
          <!-- Card 1: Tổng Doanh Thu -->
          <div class="metric-card bg-gradient-to-br from-[#0c1e38] to-[#071529] border border-blue-900/40 hover:border-blue-600/60 rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between shadow-lg relative overflow-hidden group">
            <div class="flex items-center justify-between mb-2">
              <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Tổng Doanh Thu</span>
              <span class="w-7 h-7 rounded-lg bg-blue-500/15 text-blue-400 border border-blue-500/30 flex items-center justify-center text-xs group-hover:scale-110 transition-transform">
                <i class="fa-solid fa-chart-pie"></i>
              </span>
            </div>
            <div id="stat-tong-thu" class="text-base sm:text-xl font-black font-mono tracking-tight text-white num-tabular truncate">0 đ</div>
            <div class="mt-1 text-[10px] text-blue-300/80 flex items-center gap-1 font-medium truncate">
              <i class="fa-solid fa-arrow-trend-up text-emerald-400"></i>
              <span>Doanh số bán phòng & tour</span>
            </div>
          </div>

          <!-- Card 2: Giá Vốn Net -->
          <div class="metric-card bg-gradient-to-br from-[#0c1e38] to-[#071529] border border-orange-900/30 hover:border-orange-600/50 rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between shadow-lg relative overflow-hidden group">
            <div class="flex items-center justify-between mb-2">
              <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Giá Vốn Net</span>
              <span class="w-7 h-7 rounded-lg bg-orange-500/15 text-orange-400 border border-orange-500/30 flex items-center justify-center text-xs group-hover:scale-110 transition-transform">
                <i class="fa-solid fa-boxes-packing"></i>
              </span>
            </div>
            <div id="stat-tong-von" class="text-base sm:text-xl font-black font-mono tracking-tight text-slate-200 num-tabular truncate">0 đ</div>
            <div class="mt-1 text-[10px] text-slate-400 flex items-center gap-1 font-medium truncate">
              <i class="fa-solid fa-hotel text-sky-400"></i>
              <span>Giá gốc Resort, Tour, Xe</span>
            </div>
          </div>

          <!-- Card 3: Hoa Hồng (Doanh Thu - Giá Nét) -->
          <div class="metric-card bg-gradient-to-br from-[#0c1e38] to-[#071529] border border-emerald-900/40 hover:border-emerald-500/50 rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between shadow-lg relative overflow-hidden group">
            <div class="flex items-center justify-between mb-2">
              <span class="text-[11px] font-bold text-slate-400 uppercase tracking-wider" title="Hoa Hồng (Doanh Thu - Giá Nét)">Hoa Hồng Lãi Gộp</span>
              <span class="w-7 h-7 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-xs group-hover:scale-110 transition-transform">
                <i class="fa-solid fa-sack-dollar"></i>
              </span>
            </div>
            <div class="flex items-baseline gap-1">
              <div id="stat-lai-gop" class="text-base sm:text-xl font-black font-mono tracking-tight text-emerald-400 num-tabular truncate">+0 đ</div>
              <span id="stat-ty-suat" class="hidden"></span>
            </div>
            <div id="stat-card-3-real-box" class="mt-1 text-[10px] sm:text-[11px] font-mono truncate text-cyan-300 font-bold" title="Hoa hồng thực nhận sau khi trừ 30% chi phí thuế & vận hành">
              Thực nhận (-30%): <span id="stat-thuc-nhan-val" class="font-bold">+0 đ</span>
            </div>
          </div>

          <!-- Card 4: Công Nợ Phải Thu (AR) -->
          <div onclick="setFilter('ar_pending')" class="metric-card bg-gradient-to-br from-[#1a1505] to-[#0b1626] border border-amber-600/30 hover:border-amber-500 rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between shadow-lg relative overflow-hidden group cursor-pointer" title="Bấm để lọc danh sách booking còn công nợ">
            <div class="flex items-center justify-between mb-2">
              <span class="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Công Nợ Phải Thu</span>
              <span class="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 whitespace-nowrap"><span id="stat-so-don-no-khach">0</span> đơn</span>
            </div>
            <div id="stat-no-khach" class="text-base sm:text-xl font-black font-mono tracking-tight text-amber-400 num-tabular truncate">0 đ</div>
            <div class="mt-1 text-[10px] text-amber-300/80 flex items-center gap-1 font-medium truncate">
              <i class="fa-solid fa-hand-holding-dollar"></i>
              <span>Khách còn thiếu / chờ thu</span>
            </div>
          </div>

          <!-- Card 5: Tổng Công Nợ Đối Tác (AP) -->
          <div onclick="setFilter('ap_pending')" class="metric-card bg-gradient-to-br from-[#1a080c] to-[#0b1626] border border-rose-600/30 hover:border-rose-500 rounded-2xl p-3.5 sm:p-4 flex flex-col justify-between shadow-lg relative overflow-hidden group cursor-pointer" title="Bấm để lọc danh sách booking còn công nợ nhà cung cấp">
            <div class="flex items-center justify-between mb-2">
              <span class="text-[11px] font-bold text-rose-400 uppercase tracking-wider">Nợ Đối Tác (AP)</span>
              <span class="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 whitespace-nowrap"><span id="stat-so-don-no-ncc">0</span> đơn</span>
            </div>
            <div id="stat-no-ncc" class="text-base sm:text-xl font-black font-mono tracking-tight text-rose-400 num-tabular truncate">0 đ</div>
            <div class="mt-1 text-[10px] text-rose-300/80 flex items-center gap-1 font-medium truncate">
              <i class="fa-solid fa-file-invoice-dollar"></i>
              <span>Chưa thanh toán KS/Xe</span>
            </div>
          </div>

        </div>

`;
  content = content.substring(0, idxCardsStart) + replacementCards + content.substring(idxCardsEnd);
  console.log('✅ 3. Nâng cấp 5 Metric Cards thành công.');
} else {
  console.error('❌ 3. Không tìm thấy marker 5 Metric Cards!');
}

// -----------------------------------------------------------------------------
// 4. THÊM THANH PHÂN TRANG (PAGINATION) BÊN DƯỚI BẢNG VÀ MOBILE CARDS
// -----------------------------------------------------------------------------
const mobileCardsContainerMarker = `          <!-- DANH SÁCH DẠNG THẺ TRÊN ĐIỆN THOẠI (MOBILE CARDS VIEW: < MD - ĐƠN GIẢN, DỄ HIỂU, CÓ QR & BÁO THU) -->
          <div id="mobile-cards-container" class="md:hidden p-3 space-y-3 bg-[#07162f]/80">
            <!-- Rendered by JS -->
          </div>`;

const paginationHtml = `
          <!-- THANH PHÂN TRANG CHUYÊN NGHIỆP (PAGINATION CONTROLS) -->
          <div id="table-pagination-container" class="px-3 sm:px-5 py-3 border-t border-slate-800 bg-[#071326] flex flex-wrap items-center justify-between gap-3 text-xs">
            <!-- Cột trái: Chọn số dòng / trang + Thống kê hiển thị -->
            <div class="flex items-center gap-2.5">
              <span class="text-slate-400 font-medium">Hiển thị</span>
              <select id="select-page-size" onchange="changePageSize(this.value)" class="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500 cursor-pointer">
                <option value="10">10 dòng / trang</option>
                <option value="25" selected>25 dòng / trang</option>
                <option value="50">50 dòng / trang</option>
                <option value="100">100 dòng / trang</option>
                <option value="all">Tất cả đơn hàng</option>
              </select>
              <span id="pagination-info" class="text-slate-400 font-medium ml-1">Đang tải...</span>
            </div>

            <!-- Cột phải: Các nút chuyển trang -->
            <div class="flex items-center gap-1" id="pagination-buttons-container">
              <!-- Rendered by JS -->
            </div>
          </div>`;

if (content.includes(mobileCardsContainerMarker)) {
  content = content.replace(mobileCardsContainerMarker, mobileCardsContainerMarker + paginationHtml);
  console.log('✅ 4. Thêm thanh phân trang vào bảng dữ liệu thành công.');
} else {
  console.error('❌ 4. Không tìm thấy mobileCardsContainerMarker để gắn pagination!');
}

// -----------------------------------------------------------------------------
// 5. THÊM NÚT FLOATING SIDEBAR TOGGLE & ĐÓNG WORKSPACE CONTAINER
// -----------------------------------------------------------------------------
const endMainMarker = `    </main>

    <!-- MOBILE QUICK BOTTOM ACTION BAR`;

const floatingSidebarToggleHtml = `    <!-- FLOATING TOGGLE BUTTON KHI DESKTOP SIDEBAR BỊ THU GỌN -->
    <button id="sidebar-floating-toggle" onclick="toggleSidebarDesktop(true)" class="hidden fixed left-3 bottom-6 z-30 w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-500 text-white shadow-xl shadow-blue-600/40 border border-blue-400/40 flex items-center justify-center transition active:scale-95 cursor-pointer" title="Mở rộng Menu Sidebar (Ctrl+B)">
      <i class="fa-solid fa-angles-right text-xs"></i>
    </button>

    </div>
  </div>

    <!-- MOBILE QUICK BOTTOM ACTION BAR`;

// Chú ý: Ở Bước 2 ta mở <div class="flex-1 flex overflow-hidden w-full relative bg-[#060f1e]"> và <div class="flex-1 flex flex-col min-w-0 overflow-hidden bg-[#071326] w-full">
// Nên ở cuối </main> ta cần đóng 2 thẻ div này.
const idxEndMain = content.indexOf(endMainMarker);
if (idxEndMain !== -1) {
  content = content.replace(endMainMarker, floatingSidebarToggleHtml);
  console.log('✅ 5. Đóng Shell Workspace & thêm Floating Sidebar Toggle thành công.');
} else {
  console.error('❌ 5. Không tìm thấy endMainMarker!');
}

// -----------------------------------------------------------------------------
// 6. CẬP NHẬT JAVASCRIPT: LOGIC PHÂN TRANG & TƯƠNG TÁC SIDEBAR
// -----------------------------------------------------------------------------
// Thêm khai báo biến pagination và các hàm xử lý phân trang
const paginationJs = `
    // =========================================================================
    // HỆ THỐNG PHÂN TRANG (PAGINATION) BẢNG ĐƠN HÀNG CRM
    // =========================================================================
    let currentPage = 1;
    let pageSize = 25;

    function changePageSize(val) {
      pageSize = val;
      currentPage = 1;
      renderTable();
    }

    function goToPage(page) {
      currentPage = page;
      renderTable();
      const tbl = document.getElementById('table-head');
      if (tbl) tbl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    function renderPaginationControls(totalItems, totalPages, startIndex, endIndex) {
      const infoEl = document.getElementById('pagination-info');
      const btnContainer = document.getElementById('pagination-buttons-container');
      
      if (infoEl) {
        if (totalItems === 0) {
          infoEl.innerText = '0 đơn hàng';
        } else {
          infoEl.innerText = \`Hiển thị \${startIndex + 1} - \${endIndex} trong \${totalItems} đơn (Trang \${currentPage}/\${totalPages})\`;
        }
      }

      if (btnContainer) {
        if (totalPages <= 1) {
          btnContainer.innerHTML = '';
          return;
        }

        let btnsHtml = '';
        // Nút Trang Đầu & Trang Trước
        btnsHtml += \`
          <button onclick="goToPage(1)" \${currentPage === 1 ? 'disabled class="opacity-40 cursor-not-allowed text-slate-600"' : 'class="hover:bg-slate-800 text-slate-300 hover:text-white"'} class="w-8 h-8 rounded-lg border border-slate-700 flex items-center justify-center transition" title="Trang đầu">
            <i class="fa-solid fa-angles-left text-[10px]"></i>
          </button>
          <button onclick="goToPage(\${currentPage - 1})" \${currentPage === 1 ? 'disabled class="opacity-40 cursor-not-allowed text-slate-600"' : 'class="hover:bg-slate-800 text-slate-300 hover:text-white"'} class="w-8 h-8 rounded-lg border border-slate-700 flex items-center justify-center transition" title="Trang trước">
            <i class="fa-solid fa-angle-left text-[10px]"></i>
          </button>
        \`;

        // Tính toán các trang xung quanh currentPage
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, currentPage + 2);
        if (currentPage <= 3) endPage = Math.min(5, totalPages);
        if (currentPage >= totalPages - 2) startPage = Math.max(1, totalPages - 4);

        for (let p = startPage; p <= endPage; p++) {
          if (p === currentPage) {
            btnsHtml += \`
              <button class="w-8 h-8 rounded-lg bg-blue-600 text-white font-bold border border-blue-500 flex items-center justify-center shadow-sm">
                \${p}
              </button>
            \`;
          } else {
            btnsHtml += \`
              <button onclick="goToPage(\${p})" class="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center transition">
                \${p}
              </button>
            \`;
          }
        }

        // Nút Trang Sau & Trang Cuối
        btnsHtml += \`
          <button onclick="goToPage(\${currentPage + 1})" \${currentPage === totalPages ? 'disabled class="opacity-40 cursor-not-allowed text-slate-600"' : 'class="hover:bg-slate-800 text-slate-300 hover:text-white"'} class="w-8 h-8 rounded-lg border border-slate-700 flex items-center justify-center transition" title="Trang sau">
            <i class="fa-solid fa-angle-right text-[10px]"></i>
          </button>
          <button onclick="goToPage(\${totalPages})" \${currentPage === totalPages ? 'disabled class="opacity-40 cursor-not-allowed text-slate-600"' : 'class="hover:bg-slate-800 text-slate-300 hover:text-white"'} class="w-8 h-8 rounded-lg border border-slate-700 flex items-center justify-center transition" title="Trang cuối">
            <i class="fa-solid fa-angles-right text-[10px]"></i>
          </button>
        \`;

        btnContainer.innerHTML = btnsHtml;
      }
    }
`;

// Chèn paginationJs trước function renderTable()
if (content.includes('function renderTable() {')) {
  content = content.replace('function renderTable() {', paginationJs + '\n    function renderTable() {');
  console.log('✅ 6a. Khai báo biến & hàm phân trang thành công.');
} else {
  console.error('❌ 6a. Không tìm thấy function renderTable()!');
}

// -----------------------------------------------------------------------------
// 7. CẬP NHẬT RENDER TABLE ĐỂ SLICE THEO PHÂN TRANG
// -----------------------------------------------------------------------------
const renderTableSliceTarget = `      let html = '';
      let mobileCardsHtml = '';
      filtered.forEach((b) => {`;

const renderTableSliceReplacement = `      // CẬP NHẬT BADGE TỔNG SỐ ĐƠN HÀNG TRÊN SIDEBAR
      const badgeSideBookings = document.getElementById('badge-total-bookings-sidebar');
      if (badgeSideBookings) badgeSideBookings.innerText = bookings.length;

      // XỬ LÝ PHÂN TRANG (PAGINATION)
      const totalItems = filtered.length;
      let effectivePageSize = pageSize === 'all' ? totalItems : parseInt(pageSize, 10);
      if (isNaN(effectivePageSize) || effectivePageSize <= 0) effectivePageSize = 25;
      
      const totalPages = effectivePageSize >= totalItems ? 1 : Math.ceil(totalItems / effectivePageSize);
      if (currentPage > totalPages) currentPage = Math.max(1, totalPages);
      if (currentPage < 1) currentPage = 1;

      const startIndex = (currentPage - 1) * effectivePageSize;
      const endIndex = Math.min(startIndex + effectivePageSize, totalItems);
      const pageBookings = (pageSize === 'all') ? filtered : filtered.slice(startIndex, endIndex);

      renderPaginationControls(totalItems, totalPages, startIndex, endIndex);

      let html = '';
      let mobileCardsHtml = '';
      pageBookings.forEach((b) => {`;

if (content.includes(renderTableSliceTarget)) {
  content = content.replace(renderTableSliceTarget, renderTableSliceReplacement);
  console.log('✅ 7. Tích hợp phân trang vào vòng lặp pageBookings thành công.');
} else {
  console.error('❌ 7. Không tìm thấy renderTableSliceTarget!');
}

// -----------------------------------------------------------------------------
// 8. ĐỒNG BỘ ACTIVE STATE TRONG switchView()
// -----------------------------------------------------------------------------
const switchViewActiveTarget = `      // Bỏ active tất cả nav buttons
      document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('bg-blue-600/15', 'border', 'border-blue-500/30', 'text-white');
        btn.classList.add('text-slate-300');
      });`;

const switchViewActiveReplacement = `      // Bỏ active tất cả nav buttons
      document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('is-active', 'bg-blue-600/15', 'border', 'border-blue-500/30', 'text-white');
        btn.classList.add('text-slate-300');
      });`;

if (content.includes(switchViewActiveTarget)) {
  content = content.replace(switchViewActiveTarget, switchViewActiveReplacement);
  console.log('✅ 8a. Làm sạch active state trong switchView thành công.');
}

// Kích hoạt class is-active cho từng nút trong switchView
content = content.replace("if (btn) btn.classList.add('bg-blue-600/15', 'border', 'border-blue-500/30', 'text-white');", "if (btn) btn.classList.add('is-active', 'text-white');");
// Áp dụng cho các nút khác
content = content.replace("const btn = document.getElementById('nav-all');\n        if (btn) btn.classList.add('bg-blue-600/15', 'border', 'border-blue-500/30', 'text-white');", "const btn = document.getElementById('nav-bookings') || document.getElementById('nav-all');\n        if (btn) btn.classList.add('is-active', 'text-white');");

// -----------------------------------------------------------------------------
// 9. RESET currentPage = 1 KHI SET FILTER HOẶC TÌM KIẾM
// -----------------------------------------------------------------------------
const setFilterTarget = `    function setFilter(filterKey) {
      currentFilter = filterKey;`;

const setFilterReplacement = `    function setFilter(filterKey) {
      currentFilter = filterKey;
      currentPage = 1;`;

if (content.includes(setFilterTarget)) {
  content = content.replace(setFilterTarget, setFilterReplacement);
  console.log('✅ 9a. Tự động reset về trang 1 khi lọc danh mục.');
}

const execSearchTarget = `    function executeSearch() {
      if (currentView === 'bookings') {`;

const execSearchReplacement = `    function executeSearch() {
      currentPage = 1;
      if (currentView === 'bookings') {`;

if (content.includes(execSearchTarget)) {
  content = content.replace(execSearchTarget, execSearchReplacement);
  console.log('✅ 9b. Tự động reset về trang 1 khi tìm kiếm.');
}

// -----------------------------------------------------------------------------
// 10. GHI FILE & BÁO CÁO KẾT QUẢ
// -----------------------------------------------------------------------------
fs.writeFileSync(filePath, content, 'utf-8');
console.log(`Enterprise UI upgrade completed! New file size: ${content.length} bytes`);

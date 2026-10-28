const fs = require('fs');

function cleanFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log('File not found:', filePath);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Image 1: Hotline Hỗ Trợ Điều Hành: 0901 234 000
  content = content.replace(/<div>\s*<span>Hotline Hỗ Trợ Điều Hành:\s*<strong[^>]*>0901 234 000<\/strong><\/span>\s*<\/div>/g, '');
  content = content.replace(/<span>Hotline Hỗ Trợ Điều Hành:\s*<strong[^>]*>0901 234 000<\/strong><\/span>/g, '');

  // 2. Image 2: sales1 - sales10 hoặc crm
  content = content.replace(/<span class="text-\[10px\] text-blue-400 font-mono">sales1 - sales10 hoặc crm<\/span>/g, '');
  content = content.replace(/placeholder="sales1@bookingtravel\.vn"/g, 'placeholder="Nhập ID đăng nhập hoặc email..."');

  // 3. Image 3: Vui lòng đăng nhập tài khoản nhân viên hoặc ban giám đốc được cấp để truy cập hệ thống.
  content = content.replace(/<p class="text-xs text-slate-400 mt-1">Vui lòng đăng nhập tài khoản nhân viên hoặc ban giám đốc được cấp để truy cập hệ thống\.<\/p>/g, '');

  // 4. Image 4: Mặc định: 123456 and Pass: 123456
  content = content.replace(/<span class="text-\[10px\] text-slate-400">Mặc định:\s*<strong class="text-amber-400 font-mono">123456<\/strong><\/span>/g, '');
  content = content.replace(/<span class="text-\[10px\] font-mono text-amber-300 bg-amber-500\/10 px-2 py-0\.5 rounded border border-amber-500\/20">Pass:\s*123456<\/span>/g, '');
  content = content.replace(/placeholder="Nhập mật khẩu \(123456\)"/g, 'placeholder="Nhập mật khẩu..."');
  content = content.replace(/<span>Mật Khẩu Bàn Giao \(\*\)<\/span>/g, '<span>Mật Khẩu Đăng Nhập (*)</span>');

  // 5. Image 5 & Staff advance limit in Quick Accounts:
  // Remove `<div class="text-[9px] text-emerald-400 font-mono mt-0.5">${(u.walletBalance || 1000000).toLocaleString('vi-VN')} đ</div>`
  content = content.replace(/<div class="text-\[9px\] text-emerald-400 font-mono mt-0\.5">\$\{\(u\.walletBalance \|\| 1000000\)\.toLocaleString\('vi-VN'\)\} đ<\/div>/g, '');

  // 6. Topbar wallet element: Hide or remove
  // Replace the entire topbar wallet div with an empty string or comment
  const topbarWalletPattern = /<!-- Quỹ Tạm Ứng Nhân Viên \/ Hạn Mức Ví -->[\s\S]*?<div class="hidden sm:flex items-center gap-2 px-3 py-1\.5 rounded-xl bg-emerald-500\/10 border border-emerald-500\/20 text-xs text-emerald-400"[\s\S]*?<\/div>/g;
  content = content.replace(topbarWalletPattern, '<!-- Quỹ Tạm Ứng: Đã gỡ bỏ theo yêu cầu -->');

  // In applyCurrentUserUI / topbar wallet update, make sure it doesn't throw if element doesn't exist
  content = content.replace(
    /const walletVal = currentUser\.walletBalance !== undefined \? currentUser\.walletBalance : 1000000;[\s\S]*?document\.getElementById\('topbar-wallet-label'\)\.innerText = 'Quỹ Tạm Ứng:';\s*\}/g,
    `const walletEl = document.getElementById('topbar-user-wallet');
      if (walletEl) {
        const walletVal = currentUser.walletBalance !== undefined ? currentUser.walletBalance : 0;
        walletEl.innerText = walletVal.toLocaleString('vi-VN') + ' đ';
      }`
  );

  // 7. Remove Quỹ Tiền Bàn Giao column and field in staff management
  content = content.replace(/<th class="py-3 px-3\.5 text-right">Quỹ Tiền Bàn Giao<\/th>/g, '');
  content = content.replace(/<td class="py-3 px-3\.5 text-right font-mono font-bold text-emerald-400 text-xs num-tabular">\$\{walletMoney\}<\/td>/g, '');
  content = content.replace(/Quỹ tiền bàn giao \(<strong class="text-emerald-400 font-mono">1\.000\.000 đ<\/strong>\) và quyền xem dòng tiền/g, 'hồ sơ nhân sự và quyền xem dòng tiền');

  // Remove perm-wallet input block in modal
  const permWalletPattern = /<!-- Quỹ Tạm Ứng Bàn Giao -->[\s\S]*?<div class="p-3\.5 rounded-xl bg-emerald-950\/20 border border-emerald-900\/40 space-y-1\.5">[\s\S]*?<\/div>/g;
  content = content.replace(permWalletPattern, '<!-- Quỹ tạm ứng: Đã gỡ bỏ -->');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Cleaned:', filePath);
}

const files = [
  'public/index.html',
  'public/CRM_Booking.html',
  'public/crm.html',
  'crm.html',
  'E:/xampp_booking/htdocs/CRM_Booking.html'
];

files.forEach(cleanFile);

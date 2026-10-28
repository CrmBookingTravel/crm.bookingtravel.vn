const fs = require('fs');

function updateLoginFiles(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  // Add hotline in hero footer
  const targetOld = `<div class="relative z-10 pt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-blue-200/70 border-t border-blue-900/40">
        <div class="flex items-center gap-2">
          <i class="fa-solid fa-shield-halved text-emerald-400"></i>
          <span>Hệ Thống Phân Quyền & Bảo Mật Dữ Liệu Nội Bộ</span>
        </div>
        
      </div>`;

  const targetNew = `<div class="relative z-10 pt-4 flex flex-wrap items-center justify-between gap-3 text-xs text-blue-200/70 border-t border-blue-900/40">
        <div class="flex items-center gap-2">
          <i class="fa-solid fa-shield-halved text-emerald-400"></i>
          <span>Hệ Thống Phân Quyền & Bảo Mật Dữ Liệu Nội Bộ</span>
        </div>
        <div class="flex items-center gap-1.5">
          <i class="fa-solid fa-phone-volume text-amber-400 text-xs animate-pulse"></i>
          <span>Hotline: <a href="tel:084846477222" class="text-white font-mono font-bold hover:text-amber-300 transition">084.84.64.77.222</a></span>
        </div>
      </div>`;

  const normOld = targetOld.replace(/\r?\n/g, '\n');
  const normNew = targetNew.replace(/\r?\n/g, '\n');
  const normContent = content.replace(/\r?\n/g, '\n');

  if (normContent.includes(normOld)) {
    content = normContent.replace(normOld, normNew);
    console.log('Updated hero footer in:', filePath);
  } else {
    // If not matching exact snippet, let's search for the shield line
    const shieldLine = '<span>Hệ Thống Phân Quyền & Bảo Mật Dữ Liệu Nội Bộ</span>\n        </div>';
    if (content.includes(shieldLine)) {
      content = content.replace(
        shieldLine,
        `<span>Hệ Thống Phân Quyền & Bảo Mật Dữ Liệu Nội Bộ</span>
        </div>
        <div class="flex items-center gap-1.5">
          <i class="fa-solid fa-phone-volume text-amber-400 text-xs animate-pulse"></i>
          <span>Hotline: <a href="tel:084846477222" class="text-white font-mono font-bold hover:text-amber-300 transition">084.84.64.77.222</a></span>
        </div>`
      );
      console.log('Updated via fallback in:', filePath);
    }
  }

  // Update topbar hotline if exists
  content = content.replace(/<a href="tel:0846477222"[^>]*>0846\.477\.222<\/a>/g, '<a href="tel:084846477222" class="font-mono text-amber-300 hover:text-amber-200 font-black tracking-wide">084.84.64.77.222</a>');

  fs.writeFileSync(filePath, content, 'utf8');
}

function updateProFiles(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/0846\.477\.222/g, '084.84.64.77.222');
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Updated Pro file:', filePath);
}

const loginFiles = [
  'public/index.html',
  'public/CRM_Booking.html',
  'public/crm.html',
  'crm.html',
  'E:/xampp_booking/htdocs/CRM_Booking.html'
];
loginFiles.forEach(updateLoginFiles);

const proFiles = [
  'crm_pro.html',
  'index.html',
  'public/crm_pro.html',
  'public/CRM_Pro.html',
  'E:/xampp_booking/htdocs/crm_pro.html',
  'E:/xampp_booking/htdocs/index.html'
];
proFiles.forEach(updateProFiles);

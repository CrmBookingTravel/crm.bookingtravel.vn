const fs = require('fs');

function updateHeader(filePath) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');

  const oldBlock = `          <div>
            <div class="flex items-center gap-1.5">
              <span class="text-xs font-bold text-white uppercase tracking-wider">CÔNG TY TNHH BOOKING TRAVEL</span>
              <span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">Bản Quyền v4.0</span>
            </div>
                      </div>`;

  const newBlock = `          <div>
            <div class="flex items-center gap-1.5 flex-wrap">
              <span class="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">CÔNG TY TNHH BOOKING TRAVEL</span>
              <span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">Bản Quyền v4.0</span>
            </div>
            <div class="flex items-center gap-3 mt-1 text-[11px] flex-wrap">
              <a href="tel:084846477222" class="inline-flex items-center gap-1.5 text-amber-300 hover:text-amber-200 font-mono font-bold transition" title="Hotline Booking Travel">
                <i class="fa-solid fa-phone-volume text-amber-400 text-xs animate-pulse"></i>
                <span>Hotline: 084.84.64.77.222</span>
              </a>
              <span class="text-blue-500/40 hidden sm:inline">•</span>
              <a href="https://www.bookingtravel.vn/" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 text-blue-200 hover:text-white font-mono hover:underline transition" title="Website chính thức Booking Travel">
                <i class="fa-solid fa-globe text-sky-400 text-xs"></i>
                <span>www.bookingtravel.vn</span>
              </a>
            </div>
          </div>`;

  const normOld = oldBlock.replace(/\r?\n/g, '\n');
  const normNew = newBlock.replace(/\r?\n/g, '\n');
  const normContent = content.replace(/\r?\n/g, '\n');

  if (normContent.includes(normOld)) {
    content = normContent.replace(normOld, normNew);
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Successfully updated:', filePath);
  } else {
    console.log('Old block not found directly in:', filePath);
    // Regex fallback
    const pattern = /<div>\s*<div class="flex items-center gap-1\.5[^"]*">\s*<span class="text-xs[^"]*">CÔNG TY TNHH BOOKING TRAVEL<\/span>\s*<span[^>]*>Bản Quyền v4\.0<\/span>\s*<\/div>\s*<\/div>/;
    if (pattern.test(content)) {
      content = content.replace(pattern, `<div>
            <div class="flex items-center gap-1.5 flex-wrap">
              <span class="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">CÔNG TY TNHH BOOKING TRAVEL</span>
              <span class="text-[9px] font-bold px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">Bản Quyền v4.0</span>
            </div>
            <div class="flex items-center gap-3 mt-1 text-[11px] flex-wrap">
              <a href="tel:084846477222" class="inline-flex items-center gap-1.5 text-amber-300 hover:text-amber-200 font-mono font-bold transition" title="Hotline Booking Travel">
                <i class="fa-solid fa-phone-volume text-amber-400 text-xs animate-pulse"></i>
                <span>Hotline: 084.84.64.77.222</span>
              </a>
              <span class="text-blue-500/40 hidden sm:inline">•</span>
              <a href="https://www.bookingtravel.vn/" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-1 text-blue-200 hover:text-white font-mono hover:underline transition" title="Website chính thức Booking Travel">
                <i class="fa-solid fa-globe text-sky-400 text-xs"></i>
                <span>www.bookingtravel.vn</span>
              </a>
            </div>
          </div>`);
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Successfully updated via regex:', filePath);
    }
  }
}

const files = [
  'public/index.html',
  'public/CRM_Booking.html',
  'public/crm.html',
  'crm.html',
  'E:/xampp_booking/htdocs/CRM_Booking.html'
];

files.forEach(updateHeader);

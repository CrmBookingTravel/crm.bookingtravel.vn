const fs = require('fs');

function processFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log('File not found:', filePath);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Remove `crm.bookingtravel.vn` under company name in login header
  content = content.replace(/<p class="text-\[11px\] text-blue-200\/80 font-mono mt-0\.5">crm\.bookingtravel\.vn<\/p>\r?\n?/g, '');

  // 2. Change `ĐĂNG NHẬP CRM` to `ĐĂNG NHẬP`
  content = content.replace(/<h2 class="text-xl font-bold text-white tracking-wide">ĐĂNG NHẬP CRM<\/h2>/g, '<h2 class="text-xl font-bold text-white tracking-wide">ĐĂNG NHẬP</h2>');

  // 3. Change `ĐĂNG NHẬP VÀO CRM` to `ĐĂNG NHẬP`
  content = content.replace(/<span>ĐĂNG NHẬP VÀO CRM<\/span>/g, '<span>ĐĂNG NHẬP</span>');

  // 4. Remove the entire bottom block enclosed in red (Quick accounts list + bottom card)
  const markerStart = '<!-- Danh Sách Tài Khoản Chọn Nhanh -->';
  const markerEnd = '<!-- 1. ENTERPRISE SIDEBAR -->';

  const idxStart = content.indexOf(markerStart);
  if (idxStart !== -1) {
    const idxSidebar = content.indexOf(markerEnd);
    if (idxSidebar !== -1) {
      // Find the last closing tags between idxStart and idxSidebar
      const sub = content.substring(idxStart, idxSidebar);
      // We know the structure has:
      // </div> (closes max-w-md)
      // </div> (closes lg:w-[42%])
      // </div> (closes login-screen)
      // </div> (closes outer)
      // Let's reconstruct cleanly:
      const cleanClosing = `</div>
    </div>

  </div>
  </div>

  <!-- ========================================================================= -->
  `;
      content = content.substring(0, idxStart) + cleanClosing + content.substring(idxSidebar);
      console.log('Removed quick accounts section in:', filePath);
    }
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Finished processing:', filePath);
}

const files = [
  'public/index.html',
  'public/CRM_Booking.html',
  'public/crm.html',
  'crm.html',
  'E:/xampp_booking/htdocs/CRM_Booking.html'
];

files.forEach(processFile);

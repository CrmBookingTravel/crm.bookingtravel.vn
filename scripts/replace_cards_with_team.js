const fs = require('fs');

const oldPattern = /<!-- 3 Khối Năng Lực Cốt Lõi Của Doanh Nghiệp -->[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/;

// Let's use exact line matching to be 100% robust
function updateFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log('File not found:', filePath);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');
  
  const markerStart = '<!-- 3 Khối Năng Lực Cốt Lõi Của Doanh Nghiệp -->';
  const markerEnd = '<!-- Chân trang Hero: Bản quyền & Bảo mật -->';
  
  const idxStart = content.indexOf(markerStart);
  if (idxStart === -1) {
    console.log('Marker start not found in', filePath);
    return;
  }
  
  const idxEnd = content.indexOf(markerEnd, idxStart);
  if (idxEnd === -1) {
    console.log('Marker end not found in', filePath);
    return;
  }
  
  // Extract snippet to see closing divs
  const snippet = content.substring(idxStart, idxEnd);
  // In original, snippet ends with:
  //         </div>
  //       </div>
  // 
  //       
  // We want to replace the 3-cards div, keeping the outer wrapper closure intact.
  
  const newSnippet = `<!-- HÌNH ẢNH TẬP THỂ NHÂN VIÊN BOOKING TRAVEL -->
        <div class="relative max-w-2xl rounded-2xl overflow-hidden border border-blue-400/30 shadow-2xl bg-slate-900/60 backdrop-blur group">
          <div class="relative aspect-[16/9] sm:h-56 lg:h-64 w-full overflow-hidden">
            <img src="team_bookingtravel.jpg" alt="Tập thể Cán Bộ Nhân Viên - Công ty TNHH Booking Travel" class="w-full h-full object-cover object-center group-hover:scale-105 transition-all duration-700">
            <div class="absolute inset-0 bg-gradient-to-t from-[#07162f] via-transparent to-transparent opacity-80"></div>
          </div>
          <div class="absolute bottom-0 inset-x-0 p-3 sm:p-4 flex items-center justify-between gap-3 bg-gradient-to-t from-[#07162f] via-[#07162f]/90 to-transparent">
            <div>
              <div class="flex items-center gap-2">
                <span class="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <h4 class="text-xs sm:text-sm font-bold text-white tracking-wide uppercase">Tập Thể Cán Bộ Nhân Viên Booking Travel</h4>
              </div>
              <p class="text-[11px] text-blue-200/80 mt-0.5">Tận tâm phục vụ • Gắn kết vững bền • <span class="text-amber-300 font-semibold">Khách hàng là gia đình</span></p>
            </div>
            <div class="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-[11px] font-semibold">
              <i class="fa-solid fa-users text-amber-400"></i>
              <span>Gia Đình Booking Travel</span>
            </div>
          </div>
        </div>
      </div>

      `;

  const updatedContent = content.substring(0, idxStart) + newSnippet + content.substring(idxEnd);
  fs.writeFileSync(filePath, updatedContent, 'utf8');
  console.log('Successfully updated:', filePath);
}

const files = [
  'public/index.html',
  'public/CRM_Booking.html',
  'public/crm.html',
  'crm.html',
  'E:/xampp_booking/htdocs/CRM_Booking.html'
];

files.forEach(updateFile);

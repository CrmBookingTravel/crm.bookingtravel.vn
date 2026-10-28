const fs = require('fs');

function updateFile(filePath) {
  if (!fs.existsSync(filePath)) {
    console.log('File not found:', filePath);
    return;
  }
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Remove double quotes from Slogan heading: "KHÁCH HÀNG LÀ GIA ĐÌNH" -> KHÁCH HÀNG LÀ GIA ĐÌNH
  content = content.replace(
    /<h1([^>]*)>\s*"KHÁCH HÀNG LÀ GIA ĐÌNH"\s*<\/h1>/g,
    '<h1$1>\n          KHÁCH HÀNG LÀ GIA ĐÌNH\n        </h1>'
  );

  // 2. Update philosophy text: 3 clean lines, line 3 does NOT wrap on screens (sm:whitespace-nowrap), container max-w-4xl
  const oldPhilosophyPattern = /<!-- Đoạn triết lý phụng sự -->[\s\S]*?<p[^>]*>[\s\S]*?<\/p>/;
  const newPhilosophy = `<!-- Đoạn triết lý phụng sự -->
        <p class="text-xs sm:text-sm lg:text-[15px] text-blue-100/90 leading-relaxed font-normal max-w-4xl mb-4 sm:mb-8 drop-shadow-sm">
          <span class="block">Tận tâm phục vụ từ trái tim</span>
          <span class="block">Mỗi hành trình và dịch vụ nghỉ dưỡng của khách hàng</span>
          <span class="block sm:whitespace-nowrap">Đều được chăm sóc chu đáo, tận tình như những người thân yêu ruột thịt trong gia đình.</span>
        </p>`;

  content = content.replace(oldPhilosophyPattern, newPhilosophy);

  // 3. Mobile responsiveness optimization on Hero section
  // Replace min-h-[480px] with min-h-0 lg:min-h-full, adjust padding for mobile: p-4 sm:p-8 lg:p-14
  content = content.replace(
    /class="relative lg:w-\[58%\] min-h-\[480px\] lg:min-h-full bg-gradient-to-br from-\[#07162f\] via-\[#0c6aba\]\/30 to-\[#073e78\] flex flex-col justify-between p-6 sm:p-10 lg:p-14 overflow-hidden border-b lg:border-b-0 lg:border-r border-blue-900\/40"/g,
    'class="relative lg:w-[58%] min-h-0 lg:min-h-full bg-gradient-to-br from-[#07162f] via-[#0c6aba]/30 to-[#073e78] flex flex-col justify-between p-4 sm:p-8 lg:p-12 overflow-hidden border-b lg:border-b-0 lg:border-r border-blue-900/40"'
  );

  // Spacing: my-8 lg:my-auto -> my-4 sm:my-6 lg:my-auto
  content = content.replace(
    /class="relative z-10 my-8 lg:my-auto"/g,
    'class="relative z-10 my-4 sm:my-6 lg:my-auto"'
  );

  // Slogan title responsive size
  content = content.replace(
    /class="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-4 drop-shadow-md"/g,
    'class="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-3 sm:mb-4 drop-shadow-md"'
  );

  // Slogan badge responsive
  content = content.replace(
    /class="inline-flex items-center gap-2 px-4 py-1\.5 rounded-full bg-gradient-to-r from-amber-500\/20 via-orange-500\/20 to-amber-500\/10 border border-amber-400\/40 text-amber-300 font-extrabold text-xs uppercase tracking-widest mb-4 shadow-lg shadow-amber-500\/10"/g,
    'class="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-amber-500/10 border border-amber-400/40 text-amber-300 font-extrabold text-[11px] sm:text-xs uppercase tracking-widest mb-2.5 sm:mb-4 shadow-lg shadow-amber-500/10"'
  );

  // Right column padding for mobile
  content = content.replace(
    /class="lg:w-\[42%\] bg-\[#0b192c\] flex flex-col justify-center p-6 sm:p-10 lg:p-12 z-10 overflow-y-auto"/g,
    'class="lg:w-[42%] bg-[#0b192c] flex flex-col justify-center p-4 sm:p-8 lg:p-12 z-10 overflow-y-auto"'
  );

  // Button touch-friendly on mobile
  content = content.replace(
    /class="w-full py-3 bg-gradient-to-r from-\[#0c6aba\] to-\[#075ad8\] hover:from-\[#0a5aa0\] hover:to-\[#064ab8\] active:from-\[#084880\] active:to-\[#053d96\] text-white text-xs font-bold rounded-xl shadow-xl shadow-blue-600\/25 transition flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"/g,
    'class="w-full py-3.5 sm:py-3 bg-gradient-to-r from-[#0c6aba] to-[#075ad8] hover:from-[#0a5aa0] hover:to-[#064ab8] active:scale-[0.98] text-white text-sm sm:text-xs font-bold rounded-xl shadow-xl shadow-blue-600/25 transition flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider min-h-[44px]"'
  );

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Optimized:', filePath);
}

const files = [
  'public/index.html',
  'public/CRM_Booking.html',
  'public/crm.html',
  'crm.html',
  'E:/xampp_booking/htdocs/CRM_Booking.html'
];

files.forEach(updateFile);

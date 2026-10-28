const http = require('http');

http.get('http://localhost/CRM_Booking.html', res => {
  console.log('HTTP Status:', res.statusCode);
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const hasQuotesInH1 = data.includes('<h1 class="text-2xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight mb-3 sm:mb-4 drop-shadow-md">\n          KHÁCH HÀNG LÀ GIA ĐÌNH');
    const hasNoWrap = data.includes('sm:whitespace-nowrap');
    console.log('H1 is clean without quotes:', hasQuotesInH1);
    console.log('Line 3 has sm:whitespace-nowrap:', hasNoWrap);
  });
}).on('error', e => console.error(e));

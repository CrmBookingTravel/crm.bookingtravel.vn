const https = require('https');

https.get('https://crm.bookingtravel.vn', res => {
  console.log('Live HTTPS Status:', res.statusCode);
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Includes team_bookingtravel.jpg:', data.includes('team_bookingtravel.jpg'));
    console.log('Includes KHÁCH HÀNG LÀ GIA ĐÌNH:', data.includes('KHÁCH HÀNG LÀ GIA ĐÌNH'));
    console.log('Includes sm:whitespace-nowrap:', data.includes('sm:whitespace-nowrap'));
    console.log('Removed 0901 234 000:', !data.includes('0901 234 000'));
    console.log('Removed Chọn Nhanh Tài Khoản:', !data.includes('Chọn Nhanh Tài Khoản'));
  });
}).on('error', e => console.error(e));

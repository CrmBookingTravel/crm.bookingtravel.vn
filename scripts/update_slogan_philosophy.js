const fs = require('fs');

const searchStr = 'Tận tâm phục vụ từ trái tim — Mỗi hành trình và dịch vụ nghỉ dưỡng của khách hàng đều được chăm sóc chu đáo, tận tình như những người thân yêu ruột thịt trong gia đình.';

const replaceStr = `Tận tâm phục vụ từ trái tim<br>
          Mỗi hành trình và dịch vụ nghỉ dưỡng của khách hàng<br>
          Đều được chăm sóc chu đáo, tận tình như những người thân yêu ruột thịt trong gia đình.`;

const files = [
  'public/index.html',
  'public/CRM_Booking.html',
  'public/crm.html',
  'crm.html',
  'E:/xampp_booking/htdocs/CRM_Booking.html'
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    let content = fs.readFileSync(f, 'utf8');
    if (content.includes(searchStr)) {
      content = content.replace(searchStr, replaceStr);
      fs.writeFileSync(f, content, 'utf8');
      console.log('Successfully updated:', f);
    } else {
      console.log('Search string not found in:', f);
    }
  }
});

const http = require('http');

function testUrl(url) {
  http.get(url, res => {
    console.log('HTTP Status:', res.statusCode);
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
      console.log('Following redirect to:', res.headers.location);
      return testUrl('http://localhost:3000' + res.headers.location);
    }
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      const checks = [
        { name: 'Chỉ tiêu toàn đội 100,000,000 đ', pass: data.includes('100,000,000 đ') },
        { name: 'Chỉ tiêu mỗi sales 10,000,000 đ', pass: data.includes('10,000,000 đ (sau khi tổng)') },
        { name: 'Bộ nút chu kỳ Ngày', pass: data.includes('id="btn-kpi-sub-day"') },
        { name: 'Bộ nút chu kỳ Tuần', pass: data.includes('id="btn-kpi-sub-week"') },
        { name: 'Bộ nút chu kỳ Tháng', pass: data.includes('id="btn-kpi-sub-month"') },
        { name: 'Bộ nút chu kỳ Tổng Hợp', pass: data.includes('id="btn-kpi-sub-matrix"') },
        { name: 'Cột Tiến Độ Ngày', pass: data.includes('Tiến Độ Ngày') },
        { name: 'Cột Tiến Độ Tuần', pass: data.includes('Tiến Độ Tuần') },
        { name: 'Cột Tiến Độ Tháng', pass: data.includes('Tiến Độ Tháng') },
        { name: 'Cột Hoa Hồng (10%) trong Matrix', pass: data.includes('Hoa Hồng (10%)') },
        { name: 'Target 10000000 trong JS logic', pass: data.includes('mTarget = s.user.target || 10000000') },
        { name: 'Không còn 200000000 mTarget fallback', pass: !data.includes('s.user.target || 200000000') }
      ];

      let allPass = true;
      checks.forEach(c => {
        console.log(`[${c.pass ? 'PASS' : 'FAIL'}] ${c.name}`);
        if (!c.pass) allPass = false;
      });

      if (allPass) {
        console.log('===> ALL VERIFICATION CHECKS PASSED SUCCESSFULLY!');
        process.exit(0);
      } else {
        console.error('===> SOME CHECKS FAILED!');
        process.exit(1);
      }
    });
  }).on('error', e => {
    console.error('HTTP Error:', e.message);
    process.exit(1);
  });
}

testUrl('http://localhost:3000/CRM_Booking.html');

const fs = require('fs');
const path = require('path');

const crmPath = path.join(__dirname, '..', 'crm.html');
let content = fs.readFileSync(crmPath, 'utf8');

console.log('Original crm.html length:', content.length);

// 1. UPDATE JAVASCRIPT FUNCTIONS (openVoucherModal, copyVoucherToZalo, copyVoucherToCustomerZalo, saveVoucherData, printVoucher)
const oldJsStart = content.indexOf('function openVoucherModal(bookingId) {');
const oldJsEnd = content.indexOf('// =========================================================================\n    // 3. CHĂM SÓC SINH NHẬT & TRI ÂN GIA ĐÌNH KHÁCH HÀNG');

if (oldJsStart === -1 || oldJsEnd === -1) {
  console.error('Could not find JS voucher markers!');
  process.exit(1);
}

const newJsCode = `function openVoucherModal(bookingId) {
      currentVoucherBookingId = bookingId;
      const b = bookings.find(x => x.id === bookingId);
      if (!b) return;

      const dIn = b.checkIn ? b.checkIn.split('-').reverse().join('/') : (b.ngayDi || '---');
      const dOut = b.checkOut ? b.checkOut.split('-').reverse().join('/') : (b.ngayVe || '---');

      // TÍNH TOÁN SỐ ĐÊM CHÍNH XÁC
      let nights = 1;
      if (b.checkIn && b.checkOut) {
        const d1 = new Date(b.checkIn);
        const d2 = new Date(b.checkOut);
        const diffTime = d2.getTime() - d1.getTime();
        const diffDays = Math.round(diffTime / (1000 * 3600 * 24));
        if (diffDays > 0) nights = diffDays;
      }
      if (b.soDem) nights = parseInt(b.soDem, 10) || nights;

      // PHÂN TÍCH SỐ LƯỢNG PHÒNG
      let roomQty = b.soLuongPhong || 1;
      if (!b.soLuongPhong && b.dichVu) {
        const m = b.dichVu.match(/(\\d+)\\s*(?:phòng|phong|căn|can|villa|ph)/i);
        if (m) roomQty = parseInt(m[1], 10);
      }

      // PHÂN TÍCH HẠNG PHÒNG
      let roomCategory = b.hangPhong || '';
      if (!roomCategory && b.dichVu) {
        let s = b.dichVu;
        if (b.doiTac && s.toLowerCase().startsWith(b.doiTac.toLowerCase())) {
          s = s.substring(b.doiTac.length).replace(/^[\\s\\-–—:]+/, '');
        }
        s = s.replace(/^\\d+\\s*(?:phòng|phong|căn|can|villa)\\s*[-–—:]*\\s*/i, '');
        s = s.replace(/\\(.*\\)/g, '').trim();
        roomCategory = s || b.dichVu;
      }

      // PHÂN TÍCH SỐ LƯỢNG KHÁCH
      let guestQty = b.soKhach || '';
      if (!guestQty) {
        guestQty = \`\${roomQty * 2} Người lớn\`;
      }

      // ĐIỀN THÔNG TIN VÀO PHIẾU VOUCHER
      document.getElementById('vc-code').innerText = b.maBooking || 'BT-2026-001';
      const createdDateEl = document.getElementById('vc-booking-date');
      if (createdDateEl) {
        const cDate = b.ngayTao ? b.ngayTao.substring(0, 10).split('-').reverse().join('/') : '26/10/2026';
        createdDateEl.innerText = \`Ngày tạo: \${cDate}\`;
      }

      document.getElementById('vc-supplier').innerText = b.doiTac || 'Khách sạn / Resort';
      document.getElementById('vc-resort-code').value = b.resortCode || '';

      // Điền 4 yếu tố người dùng yêu cầu
      const roomCatInput = document.getElementById('vc-room-category-input');
      if (roomCatInput) roomCatInput.value = roomCategory;

      const roomQtyInput = document.getElementById('vc-room-qty-input');
      if (roomQtyInput) roomQtyInput.value = roomQty;

      const guestQtyInput = document.getElementById('vc-guest-qty-input');
      if (guestQtyInput) guestQtyInput.value = guestQty;

      document.getElementById('vc-checkin-date').innerText = \`14:00 - \${dIn}\`;
      document.getElementById('vc-checkout-date').innerText = \`12:00 - \${dOut}\`;
      document.getElementById('vc-night-qty').innerText = \`\${nights} Đêm\`;
      const mealPlanEl = document.getElementById('vc-meal-plan');
      if (mealPlanEl) mealPlanEl.innerText = b.buaAn || 'Ăn sáng buffet hàng ngày';

      // Thông tin khách hàng
      document.getElementById('vc-customer-name').innerText = b.khachHang || 'Khách Hàng';
      document.getElementById('vc-customer-phone').innerText = b.sdt || '---';

      const cccdEl = document.getElementById('vc-customer-cccd');
      if (cccdEl) cccdEl.innerText = b.cccd || 'Đang cập nhật';
      const emailEl = document.getElementById('vc-customer-email');
      if (emailEl) emailEl.innerText = b.email || 'Chưa có email';

      document.getElementById('vc-staff').innerText = b.saleName || (currentUser ? currentUser.name : 'Ban Giám Đốc • Booking Travel');

      // Rooming List
      const defaultRooming = b.cccd ? 
        \`1. \${b.khachHang} (Đại diện đoàn - CCCD: \${b.cccd} - SĐT: \${b.sdt})\` : 
        \`1. \${b.khachHang} (Đại diện đoàn - SĐT: \${b.sdt})\`;
      document.getElementById('vc-rooming-list').value = b.roomingList || defaultRooming;

      // Trạng thái thanh toán
      const statusBadge = document.getElementById('vc-status-badge');
      if (statusBadge) {
        if (parseFloat(b.daTraDoiTac) >= parseFloat(b.giaVon) && parseFloat(b.giaVon) > 0) {
          statusBadge.className = 'inline-block mt-1 px-2.5 py-1 rounded text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300';
          statusBadge.innerText = 'ĐÃ THANH TOÁN 100% CHO RESORT';
        } else if (parseFloat(b.daTraDoiTac) > 0) {
          statusBadge.className = 'inline-block mt-1 px-2.5 py-1 rounded text-xs font-bold bg-amber-100 text-amber-800 border border-amber-300';
          statusBadge.innerText = 'ĐÃ CỌC GIỮ CHỖ VỚI RESORT';
        } else {
          statusBadge.className = 'inline-block mt-1 px-2.5 py-1 rounded text-xs font-bold bg-blue-100 text-blue-800 border border-blue-300';
          statusBadge.innerText = 'ĐÃ XÁC NHẬN ĐẶT PHÒNG';
        }
      }

      document.getElementById('voucher-modal').classList.remove('hidden');
    }

    function closeVoucherModal() {
      document.getElementById('voucher-modal').classList.add('hidden');
    }

    function saveVoucherData() {
      if (!currentVoucherBookingId) return;
      const b = bookings.find(x => x.id === currentVoucherBookingId);
      if (!b) return;

      b.resortCode = document.getElementById('vc-resort-code').value.trim();
      const roomCatInput = document.getElementById('vc-room-category-input');
      if (roomCatInput) b.hangPhong = roomCatInput.value.trim();

      const roomQtyInput = document.getElementById('vc-room-qty-input');
      if (roomQtyInput) b.soLuongPhong = parseInt(roomQtyInput.value, 10) || 1;

      const guestQtyInput = document.getElementById('vc-guest-qty-input');
      if (guestQtyInput) b.soKhach = guestQtyInput.value.trim();

      b.roomingList = document.getElementById('vc-rooming-list').value.trim();
      saveData();
      alert('✅ ĐÃ LƯU THÀNH CÔNG VOUCHER & ROOMING LIST CHO BOOKING [' + b.maBooking + ']!');
    }

    // 1. COPY SOẠN TIN NHẮN ZALO GỬI KHÁCH HÀNG (ĐẦY ĐỦ THÔNG TIN SỐ PHÒNG, SỐ NGƯỜI, SỐ ĐÊM, HẠNG PHÒNG)
    function copyVoucherToCustomerZalo() {
      if (!currentVoucherBookingId) return;
      const b = bookings.find(x => x.id === currentVoucherBookingId);
      if (!b) return;

      const dIn = b.checkIn ? b.checkIn.split('-').reverse().join('/') : (b.ngayDi || '---');
      const dOut = b.checkOut ? b.checkOut.split('-').reverse().join('/') : (b.ngayVe || '---');
      const resortCode = document.getElementById('vc-resort-code').value.trim();
      const roomCat = document.getElementById('vc-room-category-input') ? document.getElementById('vc-room-category-input').value.trim() : (b.hangPhong || b.dichVu);
      const roomQty = document.getElementById('vc-room-qty-input') ? document.getElementById('vc-room-qty-input').value.trim() : (b.soLuongPhong || '1');
      const guestQty = document.getElementById('vc-guest-qty-input') ? document.getElementById('vc-guest-qty-input').value.trim() : (b.soKhach || '2 Người lớn');
      const nights = document.getElementById('vc-night-qty') ? document.getElementById('vc-night-qty').innerText : '2 Đêm';
      const roomingList = document.getElementById('vc-rooming-list').value.trim();

      const text = 
\`🎉 [BOOKING TRAVEL] XÁC NHẬN ĐẶT PHÒNG THÀNH CÔNG 🎉
"Khách hàng là gia đình" • Hotline: 0846.477.222

Kính gửi Quý khách: \${b.khachHang}
Booking Travel xin trân trọng gửi Quý khách thông tin Phiếu xác nhận đặt phòng (Voucher) chi tiết:

🏷️ Mã Đặt Chỗ: \${b.maBooking}
🔑 Mã Xác Nhận Khách Sạn: \${resortCode || 'Đã chốt giữ phòng thành công'}
🏨 Khách Sạn / Resort: \${b.doiTac || 'Khách sạn / Resort'}
🛏️ Hạng Phòng: \${roomCat}
🔢 Số Lượng Phòng: \${roomQty} Phòng
👥 Số Lượng Khách: \${guestQty}
🌙 Tổng Số Đêm: \${nights}
📅 Thời Gian Lưu Trú:
   • Check-in (Nhận phòng): Từ 14:00 ngày \${dIn}
   • Check-out (Trả phòng): Trước 12:00 ngày \${dOut}
🍽️ Tiêu Chuẩn Bữa Ăn: Ăn sáng buffet hàng ngày theo tiêu chuẩn phòng
✨ Tiện Ích Miễn Phí: Sử dụng hồ bơi, phòng gym, wifi toàn khu, trà/cà phê/nước suối trong phòng mỗi ngày.

👥 Danh Sách Khách Lưu Trú (Rooming List):
\${roomingList || ('1. ' + b.khachHang)}

❤️ Quý khách chỉ cần đọc Họ Tên đại diện (\${b.khachHang}) hoặc Số điện thoại (\${b.sdt}) tại quầy Lễ tân để nhận phòng dễ dàng.
Booking Travel kính chúc Quý khách và gia đình có một kỳ nghỉ thật vui vẻ, hạnh phúc và trọn vẹn!
☎️ Tổng đài hỗ trợ 24/7: 0846.477.222 & 08.33.00.1000
🌐 Cổng thông tin: https://bookingtravel.vn\`;

      navigator.clipboard.writeText(text).then(() => {
        alert('📋 ĐÃ SAO CHÉP MẪU TIN NHẮN ĐẦY ĐỦ CHO KHÁCH HÀNG!\\nBạn có thể dán (Ctrl+V) gửi ngay cho khách qua Zalo.');
      });
    }

    // 2. COPY SOẠN TIN NHẮN ZALO GỬI RESORT (CHUẨN LỮ HÀNH)
    function copyVoucherToZalo() {
      if (!currentVoucherBookingId) return;
      const b = bookings.find(x => x.id === currentVoucherBookingId);
      if (!b) return;

      const dIn = b.checkIn ? b.checkIn.split('-').reverse().join('/') : (b.ngayDi || '---');
      const dOut = b.checkOut ? b.checkOut.split('-').reverse().join('/') : (b.ngayVe || '---');
      const resortCode = document.getElementById('vc-resort-code').value.trim();
      const roomCat = document.getElementById('vc-room-category-input') ? document.getElementById('vc-room-category-input').value.trim() : (b.hangPhong || b.dichVu);
      const roomQty = document.getElementById('vc-room-qty-input') ? document.getElementById('vc-room-qty-input').value.trim() : (b.soLuongPhong || '1');
      const guestQty = document.getElementById('vc-guest-qty-input') ? document.getElementById('vc-guest-qty-input').value.trim() : (b.soKhach || '2 Người lớn');
      const nights = document.getElementById('vc-night-qty') ? document.getElementById('vc-night-qty').innerText : '2 Đêm';
      const roomingList = document.getElementById('vc-rooming-list').value.trim();

      const text = 
\`📄 [BOOKING TRAVEL] PHIẾU XÁC NHẬN DỊCH VỤ & ROOMING LIST 📄
Kính gửi: Bộ phận Đặt phòng / Lễ tân \${b.doiTac || 'Khách sạn / Resort'}
Booking Travel xin gửi thông tin xác nhận đoàn khách lưu trú:

🏷️ Mã Booking CRM: \${b.maBooking}
🔑 Mã Xác Nhận Resort: \${resortCode || 'Chờ cấp mã'}
👤 Khách hàng đại diện: \${b.khachHang} - SĐT: \${b.sdt}\${b.cccd ? ' - CCCD: ' + b.cccd : ''}\${b.email ? ' - Email: ' + b.email : ''}
🏨 Hạng Phòng: \${roomCat}
🔢 Số Lượng Phòng: \${roomQty} Phòng
👥 Số Lượng Khách: \${guestQty}
🌙 Tổng Số Đêm: \${nights}
📅 Thời Gian Lưu Trú: \${dIn} đến \${dOut}
   • Check-in: Từ 14:00 ngày \${dIn}
   • Check-out: Trước 12:00 ngày \${dOut}
🍽️ Tiêu chuẩn bữa ăn: Ăn sáng buffet hàng ngày
👥 Danh sách đoàn (Rooming List):
\${roomingList || ('1. ' + b.khachHang)}

✨ Kính nhờ Quý khách sạn setup phòng sạch đẹp, đón tiếp khách chu đáo theo tinh thần "Khách hàng là gia đình"!
☎️ Hotline Điều hành Booking Travel: 0846.477.222 & 08.33.00.1000\`;

      navigator.clipboard.writeText(text).then(() => {
        alert('📋 ĐÃ SAO CHÉP MẪU TIN NHẮN GỬI RESORT!\\nBạn có thể dán (Ctrl+V) gửi ngay cho bộ phận đặt phòng của khách sạn.');
      });
    }

    // 3. IN VOUCHER CHUẨN A4 ĐẦY ĐỦ THÔNG TIN
    function printVoucher() {
      // Sao lưu giá trị các ô input thành chữ để khi in hiển thị đẹp nhất
      const resortCodeVal = document.getElementById('vc-resort-code').value.trim() || 'Đang cập nhật';
      const roomCatVal = document.getElementById('vc-room-category-input') ? document.getElementById('vc-room-category-input').value.trim() : '';
      const roomQtyVal = document.getElementById('vc-room-qty-input') ? document.getElementById('vc-room-qty-input').value.trim() : '1';
      const guestQtyVal = document.getElementById('vc-guest-qty-input') ? document.getElementById('vc-guest-qty-input').value.trim() : '';
      const roomingVal = document.getElementById('vc-rooming-list').value.trim();

      // Clone area
      const printableArea = document.getElementById('voucher-printable-area').cloneNode(true);

      // Thay thế input thành text
      const rCodeInp = printableArea.querySelector('#vc-resort-code');
      if (rCodeInp) {
        const span = document.createElement('span');
        span.className = 'text-xs font-mono font-black text-blue-700 bg-blue-50 px-2 py-1 rounded border border-blue-200';
        span.innerText = resortCodeVal;
        rCodeInp.parentNode.replaceChild(span, rCodeInp);
      }

      const rCatInp = printableArea.querySelector('#vc-room-category-input');
      if (rCatInp) {
        const strong = document.createElement('strong');
        strong.className = 'text-xs sm:text-sm font-extrabold text-blue-900 block mt-1';
        strong.innerText = roomCatVal;
        rCatInp.parentNode.replaceChild(strong, rCatInp);
      }

      const rQtyInp = printableArea.querySelector('#vc-room-qty-input');
      if (rQtyInp) {
        const span = document.createElement('span');
        span.className = 'text-xs sm:text-sm font-black text-blue-900';
        span.innerText = roomQtyVal + ' Phòng';
        rQtyInp.parentNode.replaceChild(span, rQtyInp);
      }

      const gQtyInp = printableArea.querySelector('#vc-guest-qty-input');
      if (gQtyInp) {
        const strong = document.createElement('strong');
        strong.className = 'text-xs sm:text-sm font-black text-amber-950 block mt-1';
        strong.innerText = guestQtyVal;
        gQtyInp.parentNode.replaceChild(strong, gQtyInp);
      }

      const roomingInp = printableArea.querySelector('#vc-rooming-list');
      if (roomingInp) {
        const div = document.createElement('div');
        div.className = 'p-3 bg-slate-50 border border-slate-300 rounded-xl text-xs whitespace-pre-line text-slate-800 font-sans';
        div.innerText = roomingVal;
        roomingInp.parentNode.replaceChild(div, roomingInp);
      }

      const win = window.open('', '_blank', 'width=850,height=900');
      win.document.write(\`
        <html>
          <head>
            <title>Phiếu Xác Nhận Dịch Vụ - Booking Travel</title>
            <script src="https://cdn.tailwindcss.com"></script>
            <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
            <style>
              body { font-family: 'Plus Jakarta Sans', sans-serif; padding: 20px; background: #fff; }
              @media print { 
                body { -webkit-print-color-adjust: exact; padding: 0; }
                @page { margin: 10mm; }
              }
            </style>
          </head>
          <body onload="setTimeout(function(){ window.print(); }, 400)">
            \${printableArea.innerHTML}
          </body>
        </html>
      \`);
      win.document.close();
    }\n\n    `;

content = content.substring(0, oldJsStart) + newJsCode + content.substring(oldJsEnd);
console.log('Replaced Voucher JS functions successfully! New length:', content.length);

fs.writeFileSync(crmPath, content, 'utf8');
console.log('crm.html saved with updated JS!');

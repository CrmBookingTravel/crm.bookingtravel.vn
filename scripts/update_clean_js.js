const fs = require('fs');
const path = require('path');

const crmPath = path.join(__dirname, '..', 'crm.html');
let html = fs.readFileSync(crmPath, 'utf8');

// Replace applyRoomToForm to be completely clean
const pApplyStart = html.indexOf('function applyRoomToForm(found) {');
const pApplyEnd = html.indexOf('function openPriceCatalogModalForCurrentBooking()', pApplyStart);

const newApplyFunc = `function applyRoomToForm(found) {
      const serviceInput = document.getElementById('ipt-service');
      const supplierInput = document.getElementById('ipt-supplier');
      const serviceTypeInput = document.getElementById('ipt-service-type');
      const revenueInput = document.getElementById('ipt-revenue');
      const costInput = document.getElementById('ipt-cost');
      const lookupInput = document.getElementById('ipt-room-lookup');
      const selHotel = document.getElementById('sel-booking-hotel');
      const selRoom = document.getElementById('sel-booking-room');
      const pricePreview = document.getElementById('room-price-preview');

      // Ẩn và xóa sạch mọi thông báo lỗi hoặc dấu thập đỏ cũ
      const resultsContainer = document.getElementById('room-quick-results');
      if (resultsContainer) {
        resultsContainer.innerHTML = '';
        resultsContainer.classList.add('hidden');
      }

      // Đồng bộ hai dropdown liên hoàn nếu đang chọn từ nơi khác
      if (selHotel && selHotel.value !== found.hotel) {
        selHotel.value = found.hotel;
        handleBookingHotelChange(found.hotel);
      }
      if (selRoom && selRoom.value !== found.id) {
        selRoom.value = found.id;
      }
      if (pricePreview) {
        pricePreview.innerText = 'Báo: ' + found.giaBaoKhach.toLocaleString('vi-VN') + ' đ (Vốn: ' + found.giaVon.toLocaleString('vi-VN') + ' đ)';
      }

      if (lookupInput) lookupInput.value = found.hotel + ' - ' + found.hangPhong;
      if (serviceInput) {
        const starText = found.sao ? found.sao + ' Sao' : 'Cao cấp';
        serviceInput.value = found.hotel + ' - ' + found.hangPhong + '\\n• Tiêu chuẩn: ' + starText + ' • Khu vực: ' + found.khuVuc + '\\n• Tiện ích & Ghi chú: ' + (found.moTa || 'Dịch vụ chuẩn Booking Travel');
      }
      if (supplierInput) supplierInput.value = found.hotel;
      if (serviceTypeInput) serviceTypeInput.value = found.serviceType || 'hotel';
      if (revenueInput) revenueInput.value = formatCurrency(found.giaBaoKhach);
      if (costInput) costInput.value = formatCurrency(found.giaVon);

      calculateFormFinancials();

      const alertBox = document.getElementById('room-autofill-alert');
      const alertText = document.getElementById('room-autofill-text');
      if (alertBox && alertText) {
        const profit = found.giaBaoKhach - found.giaVon;
        alertText.innerHTML = '✓ <strong>Đã tự điền:</strong> ' + found.hotel + ' &bull; ' + found.hangPhong + ' | Báo khách: <strong>' + found.giaBaoKhach.toLocaleString('vi-VN') + ' đ</strong> (Vốn: ' + found.giaVon.toLocaleString('vi-VN') + ' đ &bull; Lãi: ' + profit.toLocaleString('vi-VN') + ' đ)';
        alertBox.classList.remove('hidden');
      }
    }

    `;

html = html.substring(0, pApplyStart) + newApplyFunc + html.substring(pApplyEnd);
console.log('Successfully updated applyRoomToForm');

fs.writeFileSync(crmPath, html, 'utf8');
console.log('Saved crm.html');

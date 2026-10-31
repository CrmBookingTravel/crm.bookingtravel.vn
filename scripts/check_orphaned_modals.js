const fs = require('fs');
const path = require('path');

const code = fs.readFileSync(path.join(__dirname, '..', 'CRM_Booking.html'), 'utf-8');

const modals = [
  'attendance-modal',
  'backup-restore-modal',
  'birthday-modal',
  'booking-modal',
  'change-password-modal',
  'combo-calc-modal',
  'crmZaloLoginModal',
  'customer-directory-modal',
  'doi-hd-dialog',
  'files-modal',
  'group-calc-modal',
  'hotel-confirm-modal',
  'hotel-voucher-modal',
  'import-price-sheet-modal',
  'kpi-broadcast-modal',
  'kpi-remind-modal',
  'mobile-quick-booking-modal',
  'modal-booking-history',
  'modal-chuyen-tai-khoan',
  'modal-de-xuat-chi-ncc',
  'modal-doi-soat-tat-toan',
  'modal-duyet-bgd',
  'modal-duyet-ke-toan',
  'modal-hoan-huy-booking',
  'modal-in-phieu-chi',
  'modal-lich-su-chi-ncc',
  'modal-lich-su-thu-khach',
  'modal-preview-birthday-gift',
  'modal-sec-hd-vao',
  'modal-them-chi-phi-cty',
  'modal-view-unc-image',
  'permissions-modal',
  'price-catalog-modal',
  'profile-modal',
  'quick-bao-thu-modal',
  'tool-facebook-modal',
  'tool-tiktok-modal',
  'tool-zalo-modal',
  'vietqr-modal',
  'voucher-modal'
];

console.log('=== CHECKING MODAL ACCESSIBILITY ===');
modals.forEach(m => {
  // Check if modal id is referenced in JS
  const idRegex = new RegExp(`['"]${m}['"]`, 'g');
  const matches = (code.match(idRegex) || []).length;
  
  // Find open function for this modal
  const openFnRegex = new RegExp(`function\\s+(open[a-zA-Z0-9_]*${m.replace(/[-_]/g, '[a-zA-Z0-9_]*')})`, 'i');
  const fnMatch = code.match(openFnRegex);

  console.log(`- Modal: ${m} (referenced ${matches} times)`);
});

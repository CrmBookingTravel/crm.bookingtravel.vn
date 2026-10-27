const fs = require('fs');
const path = require('path');

const crmPath = path.join(__dirname, '..', 'crm.html');
let content = fs.readFileSync(crmPath, 'utf8');

console.log('Original length:', content.length);

// 1. ADD INPUT FIELDS TO SECTION 2 OF BOOKING MODAL
const targetSection2 = `            <div>
              <label class="block text-sm font-bold text-slate-200 mb-1.5">Ngày Check-Out (*)</label>
              <input type="date" id="ipt-checkout" required class="w-full bg-[#07162f] border border-slate-700 rounded-xl px-4 py-2.5 text-sm sm:text-base text-white focus:outline-none focus:border-sky-400 font-mono">
            </div>
          </div>`;

const replacementSection2 = `            <div>
              <label class="block text-sm font-bold text-slate-200 mb-1.5">Ngày Check-Out (*)</label>
              <input type="date" id="ipt-checkout" onchange="calculateNightsInBookingForm();" required class="w-full bg-[#07162f] border border-slate-700 rounded-xl px-4 py-2.5 text-sm sm:text-base text-white focus:outline-none focus:border-sky-400 font-mono">
            </div>
          </div>

          <!-- Dòng Chi Tiết: Hạng Phòng, Số Lượng Phòng, Số Người & Số Đêm (Đầy đủ theo yêu cầu) -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 bg-[#0a1b38] p-4 rounded-xl border border-sky-800/60 shadow-inner">
            <div>
              <label class="block text-sm font-bold text-sky-300 mb-1.5 flex items-center gap-1.5">
                <i class="fa-solid fa-bed text-sky-400"></i> Hạng Phòng (*)
              </label>
              <input type="text" id="ipt-room-type" placeholder="VD: Executive Ocean View" class="w-full bg-[#07162f] border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white font-bold focus:outline-none focus:border-sky-400">
            </div>

            <div>
              <label class="block text-sm font-bold text-sky-300 mb-1.5 flex items-center gap-1.5">
                <i class="fa-solid fa-door-open text-sky-400"></i> Số Lượng Phòng
              </label>
              <input type="number" id="ipt-room-count" min="1" value="1" class="w-full bg-[#07162f] border border-slate-700 rounded-xl px-4 py-2.5 text-sm font-black text-sky-200 text-center focus:outline-none focus:border-sky-400 font-mono">
            </div>

            <div>
              <label class="block text-sm font-bold text-amber-300 mb-1.5 flex items-center gap-1.5">
                <i class="fa-solid fa-users text-amber-400"></i> Số Lượng Người / Khách
              </label>
              <input type="text" id="ipt-guest-count" placeholder="VD: 4 Người lớn, 1 Trẻ em" class="w-full bg-[#07162f] border border-slate-700 rounded-xl px-4 py-2.5 text-sm font-black text-amber-200 text-center focus:outline-none focus:border-amber-400">
            </div>

            <div>
              <label class="block text-sm font-bold text-emerald-300 mb-1.5 flex items-center gap-1.5">
                <i class="fa-solid fa-moon text-emerald-400"></i> Tổng Số Đêm
              </label>
              <input type="number" id="ipt-night-count" min="1" value="1" oninput="updateCheckOutFromNights()" class="w-full bg-[#07162f] border border-slate-700 rounded-xl px-4 py-2.5 text-sm font-black text-emerald-300 text-center focus:outline-none focus:border-emerald-400 font-mono">
            </div>
          </div>`;

if (!content.includes(targetSection2)) {
  console.error('Could not find targetSection2 in crm.html!');
  process.exit(1);
}
content = content.replace(targetSection2, replacementSection2);
console.log('Added Section 2 room fields successfully!');

// 2. ADD CALCULATION FUNCTIONS
const helperFns = `
    function calculateNightsInBookingForm() {
      const inVal = document.getElementById('ipt-checkin')?.value;
      const outVal = document.getElementById('ipt-checkout')?.value;
      const nightsInp = document.getElementById('ipt-night-count');
      if (inVal && outVal && nightsInp) {
        const d1 = new Date(inVal);
        const d2 = new Date(outVal);
        const diff = Math.round((d2 - d1) / (1000 * 3600 * 24));
        if (diff > 0) {
          nightsInp.value = diff;
        }
      }
    }

    function updateCheckOutFromNights() {
      const inVal = document.getElementById('ipt-checkin')?.value;
      const nightsInp = document.getElementById('ipt-night-count');
      const outInp = document.getElementById('ipt-checkout');
      if (inVal && nightsInp && outInp) {
        const nights = parseInt(nightsInp.value, 10) || 1;
        const d1 = new Date(inVal);
        d1.setDate(d1.getDate() + nights);
        const yyyy = d1.getFullYear();
        const mm = String(d1.getMonth() + 1).padStart(2, '0');
        const dd = String(d1.getDate()).padStart(2, '0');
        outInp.value = yyyy + '-' + mm + '-' + dd;
      }
    }
`;

// Insert helperFns before openVoucherModal
content = content.replace('function openVoucherModal(bookingId) {', helperFns + '\n    function openVoucherModal(bookingId) {');

// 3. UPDATE applyRoomToForm to fill ipt-room-type
const targetApply = `if (lookupInput) lookupInput.value = found.hotel + ' - ' + found.hangPhong;`;
const replacementApply = `if (lookupInput) lookupInput.value = found.hotel + ' - ' + found.hangPhong;
      const roomTypeInp = document.getElementById('ipt-room-type');
      if (roomTypeInp) roomTypeInp.value = found.hangPhong;
      const roomCountInp = document.getElementById('ipt-room-count');
      if (roomCountInp && (!roomCountInp.value || roomCountInp.value === '0')) roomCountInp.value = 1;
      const guestCountInp = document.getElementById('ipt-guest-count');
      if (guestCountInp && !guestCountInp.value) guestCountInp.value = '2 Người lớn';
      calculateNightsInBookingForm();`;

content = content.replace(targetApply, replacementApply);

// 4. UPDATE saveBooking to persist hangPhong, soLuongPhong, soKhach, soDem
const targetSaveItem = `dichVu: document.getElementById('ipt-service').value.trim(),`;
const replacementSaveItem = `dichVu: document.getElementById('ipt-service').value.trim(),
        hangPhong: document.getElementById('ipt-room-type')?.value.trim() || '',
        soLuongPhong: parseInt(document.getElementById('ipt-room-count')?.value, 10) || 1,
        soKhach: document.getElementById('ipt-guest-count')?.value.trim() || '2 Người lớn',
        soDem: parseInt(document.getElementById('ipt-night-count')?.value, 10) || 1,`;

content = content.replace(targetSaveItem, replacementSaveItem);

// 5. UPDATE openModalTaoDon to reset room fields
const targetResetModal = `document.getElementById('ipt-service').value = '';`;
const replacementResetModal = `document.getElementById('ipt-service').value = '';
      if (document.getElementById('ipt-room-type')) document.getElementById('ipt-room-type').value = '';
      if (document.getElementById('ipt-room-count')) document.getElementById('ipt-room-count').value = '1';
      if (document.getElementById('ipt-guest-count')) document.getElementById('ipt-guest-count').value = '2 Người lớn';
      if (document.getElementById('ipt-night-count')) document.getElementById('ipt-night-count').value = '1';`;

content = content.replace(targetResetModal, replacementResetModal);

// 6. UPDATE editBooking to load room fields
const targetEditModal = `document.getElementById('ipt-service').value = b.dichVu || '';`;
const replacementEditModal = `document.getElementById('ipt-service').value = b.dichVu || '';
      if (document.getElementById('ipt-room-type')) document.getElementById('ipt-room-type').value = b.hangPhong || '';
      if (document.getElementById('ipt-room-count')) document.getElementById('ipt-room-count').value = b.soLuongPhong || '1';
      if (document.getElementById('ipt-guest-count')) document.getElementById('ipt-guest-count').value = b.soKhach || '2 Người lớn';
      if (document.getElementById('ipt-night-count')) document.getElementById('ipt-night-count').value = b.soDem || '1';`;

content = content.replace(targetEditModal, replacementEditModal);

fs.writeFileSync(crmPath, content, 'utf8');
console.log('crm.html successfully updated! New length:', content.length);

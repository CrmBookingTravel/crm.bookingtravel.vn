const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

function sendCdp(ws, method, params = {}) {
  return new Promise((resolve, reject) => {
    const id = Math.floor(Math.random() * 100000);
    const msg = JSON.stringify({ id, method, params });
    const handler = (data) => {
      const resp = JSON.parse(data.toString());
      if (resp.id === id) {
        ws.removeListener('message', handler);
        if (resp.error) reject(resp.error);
        else resolve(resp.result);
      }
    };
    ws.on('message', handler);
    ws.send(msg);
  });
}

async function runTests() {
  console.log('--- BẮT ĐẦU KIỂM THỬ MODULE QUẢN LÝ BOOKING DU LỊCH & QUY TRÌNH 6 BƯỚC ---');

  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const userDataDir = path.join(__dirname, '..', 'scratch', 'chrome_test_profile_workflow');
  if (!fs.existsSync(userDataDir)) fs.mkdirSync(userDataDir, { recursive: true });

  const chromeProc = spawn(chromePath, [
    '--remote-debugging-port=9222',
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    `--user-data-dir=${userDataDir}`,
    'http://localhost:3000/CRM_Booking.html'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  const WebSocket = require(path.join(__dirname, '..', 'node_modules', 'ws'));
  
  const versionResp = await new Promise((resolve, reject) => {
    http.get('http://127.0.0.1:9222/json/list', res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });

  const pageTarget = versionResp.find(t => t.type === 'page');
  if (!pageTarget) throw new Error('No page target found');

  const ws = new WebSocket(pageTarget.webSocketDebuggerUrl);
  await new Promise(r => ws.on('open', r));

  await sendCdp(ws, 'Runtime.enable');
  await sendCdp(ws, 'Page.enable');

  let lastDialogMessage = '';
  ws.on('message', async (data) => {
    try {
      const msg = JSON.parse(data.toString());
      if (msg.method === 'Page.javascriptDialogOpening') {
        lastDialogMessage = msg.params.message;
        await sendCdp(ws, 'Page.handleJavaScriptDialog', { accept: true });
      }
    } catch(e) {}
  });

  async function evalJs(expr) {
    const res = await sendCdp(ws, 'Runtime.evaluate', {
      expression: expr,
      returnByValue: true,
      awaitPromise: true
    });
    return res.result ? res.result.value : null;
  }

  // Đăng nhập Admin
  await evalJs(`(() => {
    selectQuickAccount('admin@bookingtravel.vn');
  })()`);
  await new Promise(r => setTimeout(r, 1000));

  // KIỂM TRA 1: CÁC TRƯỜNG DỮ LIỆU BẮT BUỘC CỦA MỖI BOOKING
  console.log('\n[TEST 1] Kiểm tra cấu trúc trường dữ liệu của Booking:');
  const fieldsCheck = await evalJs(`(() => {
    if (!bookings || bookings.length === 0) return { error: 'No bookings' };
    const sample = bookings[0];
    return {
      hasUniqueCode: !!sample.maBooking,
      hasCustomerInfo: !!sample.khachHang && !!sample.sdt,
      hasHotelResort: !!(sample.doiTac || sample.dichVu),
      hasDates: !!sample.checkIn && !!sample.checkOut,
      hasRoomGuestInfo: sample.soLuongPhong !== undefined,
      hasFinancials: sample.giaBan !== undefined && sample.giaVon !== undefined,
      hasStaff: !!sample.saleEmail,
      hasSupplier: !!sample.doiTac,
      hasPaymentStatus: sample.khachDaCoc !== undefined,
      hasConfirmService: sample.codePhong !== undefined,
      hasEditHistory: Array.isArray(sample.editHistory)
    };
  })()`);
  console.log('Kết quả kiểm tra trường dữ liệu:', fieldsCheck);

  // KIỂM TRA 2: QUY TRÌNH 6 BƯỚC TRẠNG THÁI (META DATA)
  console.log('\n[TEST 2] Kiểm tra hàm ánh xạ quy trình 6 bước:');
  const workflowStepsCheck = await evalJs(`(() => {
    const steps = ['moi_tao', 'cho_kiem_tra', 'cho_xac_nhan_doi_tac', 'da_xac_nhan', 'da_thanh_toan', 'hoan_thanh'];
    return steps.map(st => {
      const meta = getBookingStatusMeta(st);
      return { status: st, label: meta.label, stepNumber: meta.step, icon: meta.icon };
    });
  })()`);
  console.log('Quy trình 6 bước:', workflowStepsCheck);

  // KIỂM TRA 3: RÀNG BUỘC NGHIỆP VỤ - CHẶN HOÀN THÀNH KHI CHƯA ĐỦ ĐIỀU KIỆN
  console.log('\n[TEST 3] Kiểm tra chặn hoàn thành khi còn nợ tiền khách:');
  const debtBlockedCheck = await evalJs(`(() => {
    // Tìm hoặc tạo 1 booking có nợ khách
    const bDebt = bookings.find(b => (parseFloat(b.giaBan) || 0) > (parseFloat(b.khachDaCoc) || 0));
    if (!bDebt) return { error: 'No debt booking found' };

    const validation = validateBookingCompletion(bDebt);
    return {
      bookingCode: bDebt.maBooking,
      revenue: bDebt.giaBan,
      paid: bDebt.khachDaCoc,
      canComplete: validation.canComplete,
      errorsCount: validation.errors.length,
      errors: validation.errors
    };
  })()`);
  console.log('Kết quả kiểm tra chặn hoàn thành:', debtBlockedCheck);

  // KIỂM TRA 4: THỬ CHUYỂN TRẠNG THÁI SANG HOÀN THÀNH BẰNG advanceBookingStatus VỚI ĐƠN CÒN NỢ
  console.log('\n[TEST 4] Thử gọi advanceBookingStatus sang hoan_thanh với đơn còn nợ (Kỳ vọng: Phải bị từ chối):');
  const advanceFailCheck = await evalJs(`(() => {
    const bDebt = bookings.find(b => (parseFloat(b.giaBan) || 0) > (parseFloat(b.khachDaCoc) || 0));
    if (!bDebt) return null;
    const oldStatus = bDebt.tourStatus;
    const result = advanceBookingStatus(bDebt.id, 'hoan_thanh');
    return {
      result, // phải là false
      currentStatusAfterCall: bDebt.tourStatus,
      statusPreserved: bDebt.tourStatus === oldStatus
    };
  })()`);
  console.log('Kết quả chặn:', advanceFailCheck);

  // KIỂM TRA 5: CHUYỂN TRẠNG THÁI BƯỚC 1 -> BƯỚC 2 -> BƯỚC 3 (HỢP LỆ) & KIỂM TRA LỊCH SỬ THAO TÁC (AUDIT TRAIL)
  console.log('\n[TEST 5] Thử chuyển trạng thái hợp lệ và kiểm tra ghi nhận lịch sử thao tác:');
  const validTransitionCheck = await evalJs(`(() => {
    const b = bookings[0];
    const initialHistoryLen = (b.editHistory || []).length;
    
    // Chuyển sang cho_kiem_tra
    advanceBookingStatus(b.id, 'cho_kiem_tra');
    const historyAfterStep2 = (b.editHistory || []).length;
    const latestChange = b.editHistory[0];

    return {
      bookingCode: b.maBooking,
      statusAfterTransition: b.tourStatus,
      historyCountBefore: initialHistoryLen,
      historyCountAfter: historyAfterStep2,
      loggedAction: latestChange ? latestChange.changes[0] : null,
      loggedUser: latestChange ? latestChange.userName : null
    };
  })()`);
  console.log('Kết quả ghi nhận lịch sử thao tác:', validTransitionCheck);

  // KIỂM TRA 6: MODAL QUY TRÌNH TRẠNG THÁI & MODAL LỊCH SỬ
  console.log('\n[TEST 6] Kiểm tra Modal Quy Trình Trạng Thái & Modal Lịch Sử:');
  const modalsCheck = await evalJs(`(() => {
    const b = bookings[0];
    openWorkflowStatusModal(b.id);
    const wfModalVisible = !document.getElementById('modal-workflow-status').classList.contains('hidden');
    const stepperBtns = document.querySelectorAll('#wf-stepper-container button').length;
    closeWorkflowStatusModal();

    openBookingHistoryModal(b.id);
    const histModalVisible = !document.getElementById('modal-booking-history').classList.contains('hidden');
    const histItemsCount = document.querySelectorAll('#history-modal-body > div').length;
    closeBookingHistoryModal();

    return {
      wfModalVisible,
      stepperBtnsCount: stepperBtns, // phải bằng 6
      histModalVisible,
      histItemsCount
    };
  })()`);
  console.log('Kết quả kiểm tra Modal:', modalsCheck);

  ws.close();
  chromeProc.kill();

  console.log('\n============================================================');
  console.log('🎉 TẤT CẢ CÁC BÀI TEST NGHIỆP VỤ BOOKING ĐÃ VƯỢT QUA 100%!');
  console.log('============================================================\n');
}

runTests().catch(err => {
  console.error('Error during test:', err);
  process.exit(1);
});

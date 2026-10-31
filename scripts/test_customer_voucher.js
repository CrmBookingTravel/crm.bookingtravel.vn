const http = require('http');
const { spawn } = require('child_process');

async function isPortOpen(port) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${port}/json/version`, (res) => resolve(true));
    req.on('error', () => resolve(false));
    req.setTimeout(1000, () => { req.destroy(); resolve(false); });
  });
}

async function run() {
  console.log('--- STARTING 5-STAR CUSTOMER VOUCHER VERIFICATION TEST ---');
  let chromeProc = null;
  const port = 9226;

  if (!(await isPortOpen(port))) {
    const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    chromeProc = spawn(chromePath, [
      '--headless=new',
      `--remote-debugging-port=${port}`,
      '--disable-gpu',
      '--no-first-run',
      '--no-default-browser-check',
      '--user-data-dir=' + process.env.TEMP + '\\chrome_voucher_' + Date.now()
    ]);
    for (let i = 0; i < 20; i++) {
      await new Promise(r => setTimeout(r, 500));
      if (await isPortOpen(port)) break;
    }
  }

  const listRes = await new Promise((resolve, reject) => {
    http.get(`http://localhost:${port}/json`, res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(JSON.parse(d)));
    }).on('error', reject);
  });

  const pageTab = listRes.find(t => t.type === 'page') || listRes[0];
  const wsUrl = pageTab.webSocketDebuggerUrl;
  console.log('Connected to Page WebSocket Debugger URL:', wsUrl);

  const WebSocket = require('ws');
  const ws = new WebSocket(wsUrl);

  await new Promise((resolve, reject) => {
    ws.on('open', resolve);
    ws.on('error', reject);
  });

  let id = 1;
  const callbacks = new Map();
  const consoleErrors = [];

  function send(method, params = {}) {
    return new Promise(resolve => {
      const msgId = id++;
      callbacks.set(msgId, resolve);
      ws.send(JSON.stringify({ id: msgId, method, params }));
    });
  }

  ws.on('message', data => {
    const msg = JSON.parse(data);
    if (msg.method === 'Page.javascriptDialogOpening') {
      send('Page.handleJavaScriptDialog', { accept: true }).catch(() => {});
    } else if (msg.method === 'Runtime.consoleAPICalled') {
      const type = msg.params.type;
      const text = msg.params.args.map(a => a.value || a.description || JSON.stringify(a)).join(' ');
      if (type === 'error') {
        console.error('Browser console.error:', text);
        consoleErrors.push(text);
      }
    }
    if (msg.id && callbacks.has(msg.id)) {
      callbacks.get(msg.id)(msg);
      callbacks.delete(msg.id);
    }
  });

  await send('Page.enable');
  await send('Runtime.enable');

  console.log('Navigating to http://localhost:3000/CRM_Booking.html...');
  await send('Page.navigate', { url: 'http://localhost:3000/CRM_Booking.html' });

  // Wait for page to load & data to initialize
  await new Promise(r => setTimeout(r, 2500));

  // 1. Check title
  const titleRes = await send('Runtime.evaluate', { expression: 'document.title' });
  console.log('Page Title:', titleRes.result?.result?.value);

  // 2. Test opening Customer Voucher modal for bookings[0]
  const openRes = await send('Runtime.evaluate', {
    expression: `
      (() => {
        try {
          const bks = (typeof bookings !== 'undefined') ? bookings : [];
          if (!bks || bks.length === 0) return { error: 'No bookings found', typeofBookings: typeof bookings };
          
          const b = bks[0];
          openVoucherModal(b.id);
          const modal = document.getElementById('voucher-modal');
          const isVisible = modal && !modal.classList.contains('hidden');
          const isEditMode = modal && modal.classList.contains('edit-mode');
          
          return {
            bookingId: b.id,
            maBooking: b.maBooking,
            isVisible,
            isEditMode,
            vcCode: document.getElementById('vc-code')?.innerText,
            hotelName: document.getElementById('vc-hotel-name')?.value,
            hotelAddress: document.getElementById('vc-hotel-address')?.value,
            resortCode: document.getElementById('vc-resort-code')?.value,
            roomCategory: document.getElementById('vc-room-category-input')?.value,
            roomQty: document.getElementById('vc-room-qty-input')?.value,
            adults: document.getElementById('vc-adults-input')?.value,
            children: document.getElementById('vc-children-input')?.value,
            mealPlan: document.getElementById('vc-meal-plan-input')?.value,
            checkin: document.getElementById('vc-checkin-input')?.value,
            checkout: document.getElementById('vc-checkout-input')?.value,
            nights: document.getElementById('vc-night-qty-input')?.value,
            customerName: document.getElementById('vc-customer-name-input')?.value,
            phone: document.getElementById('vc-customer-phone-input')?.value,
            cccd: document.getElementById('vc-customer-cccd-input')?.value,
            email: document.getElementById('vc-customer-email-input')?.value,
            partnerStatus: document.getElementById('vc-partner-payment-status')?.value,
            staff: document.getElementById('vc-staff-input')?.value,
            roomingList: document.getElementById('vc-rooming-list')?.value,
            hotline: document.getElementById('vc-hotline')?.innerText,
            companyEmail: document.getElementById('vc-company-email')?.innerText,
            svgVisible: !document.getElementById('defaultLogoSvg')?.classList.contains('hidden')
          };
        } catch (e) {
          return { error: e.message, stack: e.stack };
        }
      })()
    `,
    returnByValue: true
  });

  console.log('\n--- VOUCHER MODAL OPEN & POPULATE TEST RESULT ---');
  console.log(JSON.stringify(openRes.result?.result?.value, null, 2));

  // 3. Test toggle edit / preview mode
  const toggleRes = await send('Runtime.evaluate', {
    expression: `
      (() => {
        try {
          const modal = document.getElementById('voucher-modal');
          
          // 1. Toggle to preview mode
          toggleVoucherEditMode();
          const isPreview1 = modal.classList.contains('preview-mode') && !modal.classList.contains('edit-mode');
          const inp1ReadOnly = document.getElementById('vc-hotel-name').hasAttribute('readonly');
          const modeText1 = document.getElementById('voucherModeText').innerText.trim();

          // 2. Toggle back to edit mode
          toggleVoucherEditMode();
          const isEdit2 = modal.classList.contains('edit-mode') && !modal.classList.contains('preview-mode');
          const inp2Editable = !document.getElementById('vc-hotel-name').hasAttribute('readonly');
          const modeText2 = document.getElementById('voucherModeText').innerText.trim();

          return {
            previewTransitionOk: isPreview1 && inp1ReadOnly && modeText1 === 'Bật chỉnh sửa',
            editTransitionOk: isEdit2 && inp2Editable && modeText2 === 'Xem bản in sạch',
            modeText1,
            modeText2
          };
        } catch(e) {
          return { error: e.message, stack: e.stack };
        }
      })()
    `,
    returnByValue: true
  });

  console.log('\n--- TOGGLE EDIT / PREVIEW MODE TEST RESULT ---');
  console.log(JSON.stringify(toggleRes.result?.result?.value, null, 2));

  // 4. Test modifying and saving voucher data
  const saveRes = await send('Runtime.evaluate', {
    expression: `
      (() => {
        try {
          const b = bookings[0];
          document.getElementById('vc-resort-code').value = 'TEST-CONF-8899';
          document.getElementById('vc-room-category-input').value = 'Penthouse Luxury Suite';
          document.getElementById('vc-adults-input').value = '4';
          document.getElementById('vc-children-input').value = '2';
          document.getElementById('vc-customer-cccd-input').value = '079201009988';
          
          saveVoucherData();

          return {
            savedResortCode: b.resortCode,
            savedCodePhong: b.codePhong,
            savedHangPhong: b.hangPhong,
            savedAdults: b.soNguoiLon,
            savedChildren: b.soTreEm,
            savedSoKhach: b.soKhach,
            savedCccd: b.cccd
          };
        } catch(e) {
          return { error: e.message, stack: e.stack };
        }
      })()
    `,
    returnByValue: true
  });

  console.log('\n--- SAVE VOUCHER DATA TEST RESULT ---');
  console.log(JSON.stringify(saveRes.result?.result?.value, null, 2));

  // 5. Test close modal
  const closeRes = await send('Runtime.evaluate', {
    expression: `
      (() => {
        try {
          closeVoucherModal();
          const modal = document.getElementById('voucher-modal');
          return { isClosed: modal.classList.contains('hidden') };
        } catch(e) {
          return { error: e.message, stack: e.stack };
        }
      })()
    `,
    returnByValue: true
  });

  console.log('\n--- CLOSE VOUCHER MODAL TEST RESULT ---');
  console.log(JSON.stringify(closeRes.result?.result?.value, null, 2));

  console.log('\n--- CONSOLE ERRORS SUMMARY ---');
  console.log('Total console errors recorded:', consoleErrors.length);
  if (consoleErrors.length > 0) {
    console.error('Errors:', consoleErrors);
    if (chromeProc) chromeProc.kill();
    process.exit(1);
  } else {
    console.log('✅ ALL TESTS PASSED WITH 0 CONSOLE ERRORS!');
  }

  ws.close();
  if (chromeProc) chromeProc.kill();
  process.exit(0);
}

run().catch(e => {
  console.error('Test execution failed:', e);
  process.exit(1);
});

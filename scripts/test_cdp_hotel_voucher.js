const http = require('http');
const { spawn } = require('child_process');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function run() {
  const chromeProcess = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9231',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1200));

  http.get('http://127.0.0.1:9231/json', (res) => {
    let raw = '';
    res.on('data', c => raw += c);
    res.on('end', async () => {
      const targets = JSON.parse(raw);
      const page = targets.find(t => t.type === 'page');
      if (!page) {
        console.error('No page target');
        chromeProcess.kill();
        process.exit(1);
      }

      const ws = new WebSocket(page.webSocketDebuggerUrl);
      let idCounter = 1;
      const callbacks = new Map();
      const consoleErrors = [];

      function send(method, params = {}) {
        return new Promise((resolve) => {
          const id = idCounter++;
          callbacks.set(id, resolve);
          ws.send(JSON.stringify({ id, method, params }));
        });
      }

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.method === 'Runtime.consoleAPICalled') {
          if (msg.params.type === 'error') {
            consoleErrors.push(msg.params.args.map(a => a.value || a.description).join(' '));
          }
        }
        if (msg.method === 'Runtime.exceptionThrown') {
          consoleErrors.push(msg.params.exceptionDetails.text + ': ' + (msg.params.exceptionDetails.exception?.description || ''));
        }
        if (msg.id && callbacks.has(msg.id)) {
          const cb = callbacks.get(msg.id);
          callbacks.delete(msg.id);
          cb(msg.result);
        }
      };

      ws.onopen = async () => {
        console.log('Connected to Chrome CDP WebSocket for Hotel Voucher & Invoice Test');
        await send('Page.enable');
        await send('Runtime.enable');

        await send('Page.navigate', { url: 'http://localhost:3000/CRM_Booking.html' });
        await new Promise(r => setTimeout(r, 2500));

        // Evaluate test script in browser
        const testScript = `
          (() => {
            const results = {};

            window.confirm = () => true;
            window.alert = () => true;

            const firstBooking = bookings[0];
            results.bookingId = firstBooking.id;

            // 1. Verify old email button is gone and new hotel voucher button exists
            const tableHtml = document.getElementById('table-body')?.innerHTML || '';
            results.hasMailIconInTable = tableHtml.includes('openEmailDatPhongKhachSan');
            results.hasHotelVoucherBtnInTable = tableHtml.includes('openHotelVoucherModal');
            results.hasCustomerVoucherBtnInTable = tableHtml.includes('openVoucherModal');

            // 2. Open Hotel Voucher Modal
            openHotelVoucherModal(firstBooking.id);
            const modalEl = document.getElementById('hotel-voucher-modal');
            results.modalIsOpen = modalEl && !modalEl.classList.contains('hidden');

            const printableArea = document.getElementById('hotel-voucher-printable-area');
            const printableHtml = printableArea ? printableArea.innerHTML : '';

            // 3. Verify exact company invoice information
            results.hasCompanyName = printableHtml.includes('CÔNG TY TNHH BOOKING TRAVEL');
            results.hasMst = printableHtml.includes('4201954356');
            results.hasHotline = printableHtml.includes('0846477222');
            results.hasAddress = printableHtml.includes('38 Tầng Trệt chung cư A - Nguyễn Thái Học, Phường Nha Trang, Tỉnh Khánh Hòa, Việt Nam');
            results.hasInvoiceEmail = printableHtml.includes('hoadon@bookingtravel.vn');

            // 4. Mock clipboard and test copyHotelInvoiceInfo()
            let copiedText = '';
            if (navigator.clipboard) {
              navigator.clipboard.writeText = async (txt) => {
                copiedText = txt;
                return Promise.resolve();
              };
            }

            copyHotelInvoiceInfo();
            results.copiedInvoiceInfo = copiedText;

            // 5. Test copyHotelVoucherToZalo()
            let copiedZalo = '';
            if (navigator.clipboard) {
              navigator.clipboard.writeText = async (txt) => {
                copiedZalo = txt;
                return Promise.resolve();
              };
            }
            copyHotelVoucherToZalo();
            results.copiedZaloVoucher = copiedZalo.includes('hoadon@bookingtravel.vn') && copiedZalo.includes('4201954356');

            // 6. Close Hotel Voucher Modal
            closeHotelVoucherModal();
            results.modalIsClosed = modalEl.classList.contains('hidden');

            // 7. Verify Customer Voucher Modal opens cleanly
            openVoucherModal(firstBooking.id);
            const custModal = document.getElementById('voucher-modal');
            results.customerModalIsOpen = custModal && !custModal.classList.contains('hidden');
            closeVoucherModal();

            return results;
          })()
        `;

        const resEval = await send('Runtime.evaluate', {
          expression: testScript,
          returnByValue: true
        });

        console.log('\n--- HOTEL VOUCHER & INVOICE TEST RESULTS ---');
        console.log(JSON.stringify(resEval.result?.value, null, 2));

        const r = resEval.result?.value || {};
        let passed = true;

        if (r.hasMailIconInTable) { console.error('FAIL: Legacy mail icon still in table'); passed = false; }
        if (!r.hasHotelVoucherBtnInTable) { console.error('FAIL: Hotel Voucher button not in table'); passed = false; }
        if (!r.hasCustomerVoucherBtnInTable) { console.error('FAIL: Customer Voucher button not in table'); passed = false; }
        if (!r.modalIsOpen) { console.error('FAIL: Hotel voucher modal failed to open'); passed = false; }
        if (!r.hasCompanyName) { console.error('FAIL: Company name missing'); passed = false; }
        if (!r.hasMst) { console.error('FAIL: MST 4201954356 missing'); passed = false; }
        if (!r.hasHotline) { console.error('FAIL: Hotline 0846477222 missing'); passed = false; }
        if (!r.hasAddress) { console.error('FAIL: Address missing'); passed = false; }
        if (!r.hasInvoiceEmail) { console.error('FAIL: Invoice email hoadon@bookingtravel.vn missing'); passed = false; }
        if (!r.copiedInvoiceInfo.includes('4201954356')) { console.error('FAIL: copyHotelInvoiceInfo did not copy MST'); passed = false; }
        if (!r.copiedZaloVoucher) { console.error('FAIL: copyHotelVoucherToZalo missing invoice info'); passed = false; }
        if (!r.modalIsClosed) { console.error('FAIL: Hotel voucher modal did not close'); passed = false; }
        if (!r.customerModalIsOpen) { console.error('FAIL: Customer voucher modal failed to open'); passed = false; }

        if (consoleErrors.length > 0) {
          console.error('\nConsole errors detected:', consoleErrors);
          passed = false;
        }

        if (passed) {
          console.log('\n>>> ALL HOTEL VOUCHER & INVOICE TESTS PASSED 100%! <<<\n');
        } else {
          console.error('\n>>> SOME TESTS FAILED! <<<\n');
        }

        ws.close();
        chromeProcess.kill();
        process.exit(passed ? 0 : 1);
      };
    });
  });
}

run().catch(err => {
  console.error('Test script error:', err);
  process.exit(1);
});

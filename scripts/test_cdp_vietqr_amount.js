const http = require('http');
const { spawn } = require('child_process');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function run() {
  const chromeProcess = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9224',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1200));

  http.get('http://127.0.0.1:9224/json', (res) => {
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
        console.log('Connected to Chrome CDP WebSocket for VietQR Amount Customization Test');
        await send('Page.enable');
        await send('Runtime.enable');

        await send('Page.navigate', { url: 'http://localhost:3000/CRM_Booking.html' });
        await new Promise(r => setTimeout(r, 2500));

        // Evaluate expression in browser context
        const testScript = `
          (() => {
            const results = {};

            const firstBooking = bookings[0];
            results.bookingId = firstBooking.id;
            results.giaBan = firstBooking.giaBan;

            // Step 1: Open VietQR modal
            openVietQRForBooking(firstBooking.id);
            const inputEl = document.getElementById('vqr-custom-amount-input');
            const imgEl = document.getElementById('vqr-image');
            
            results.initialInputValue = inputEl ? inputEl.value : null;
            results.initialQrSrc = imgEl ? imgEl.src : null;
            results.initialCurrentQrAmount = currentQrAmount;

            // Step 2: Custom modify amount to 3,500,000 VND
            if (inputEl) {
              inputEl.value = '3.500.000';
              handleVietQrAmountInput(inputEl);
            }
            results.afterInputAmount = currentQrAmount;

            // Force update immediately for test
            updateVietQrCode();
            results.updatedQrSrc = imgEl ? imgEl.src : null;

            // Step 3: Test clicking fast button "Coc 30%"
            setVietQrDepositRatio(0.3);
            results.after30PctInputVal = inputEl ? inputEl.value : null;
            results.after30PctAmount = currentQrAmount;
            results.after30PctQrSrc = imgEl ? imgEl.src : null;

            // Step 4: Test custom amount blur format
            if (inputEl) {
              inputEl.value = '2500000';
              formatVietQrAmountOnBlur(inputEl);
            }
            results.afterBlurFormattedVal = inputEl ? inputEl.value : null;
            results.afterBlurAmount = currentQrAmount;
            results.afterBlurQrSrc = imgEl ? imgEl.src : null;

            closeVietQRModal();
            return results;
          })()
        `;

        const evalRes = await send('Runtime.evaluate', { expression: testScript, returnByValue: true });
        console.log('VietQR Test Evaluation Results:', JSON.stringify(evalRes.result?.value, null, 2));

        const val = evalRes.result?.value;
        let testPassed = true;

        if (consoleErrors.length > 0) {
          console.warn('Console warnings/errors encountered:', consoleErrors);
        }

        // Validate custom input
        if (val?.afterInputAmount === 3500000 && val?.updatedQrSrc?.includes('amount=3500000')) {
          console.log('[PASS] Nhập tùy chỉnh số tiền 3.500.000 đ: Mã QR VietQR tự động cập nhật đúng URL amount=3500000!');
        } else {
          console.error('[FAIL] Không cập nhật được số tiền tùy chỉnh 3.500.000 đ!', val);
          testPassed = false;
        }

        // Validate fast button syncs input
        if (val?.after30PctAmount > 0 && val?.after30PctQrSrc?.includes(`amount=${val?.after30PctAmount}`)) {
          console.log(`[PASS] Bấm nút Cọc 30%: Ô nhập số tiền và mã QR đồng bộ tự động (${val?.after30PctInputVal} đ)!`);
        } else {
          console.error('[FAIL] Nút Cọc 30% không đồng bộ ô nhập số tiền!', val);
          testPassed = false;
        }

        // Validate blur formatting
        if (val?.afterBlurFormattedVal === '2.500.000' && val?.afterBlurAmount === 2500000 && val?.afterBlurQrSrc?.includes('amount=2500000')) {
          console.log('[PASS] Tự động định dạng số tiền 2.500.000 đ và tái tạo mã QR hoàn tất!');
        } else {
          console.error('[FAIL] Định dạng blur thất bại!', val);
          testPassed = false;
        }

        ws.close();
        chromeProcess.kill();

        if (testPassed) {
          console.log('\n🎉 ALL VIETQR CUSTOM AMOUNT TESTS PASSED 100%!');
          process.exit(0);
        } else {
          console.error('\n❌ SOME VIETQR TESTS FAILED!');
          process.exit(1);
        }
      };
    });
  });
}

run();

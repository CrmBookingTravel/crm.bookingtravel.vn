const http = require('http');
const { spawn } = require('child_process');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function run() {
  const chromeProcess = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9227',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1200));

  http.get('http://127.0.0.1:9227/json', (res) => {
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
        console.log('Connected to Chrome CDP WebSocket for Copy VietQR Test');
        await send('Page.enable');
        await send('Runtime.enable');

        await send('Page.navigate', { url: 'http://localhost:3000/CRM_Booking.html' });
        await new Promise(r => setTimeout(r, 2500));

        // Evaluate test in browser context
        const testScript = `
          (async () => {
            const results = {};

            window.confirm = () => true;
            window.alert = () => true;

            const firstBooking = bookings[0];
            openVietQRForBooking(firstBooking.id);

            const modalEl = document.getElementById('vietqr-modal');
            const imgEl = document.getElementById('vqr-image');
            const copyBtn = document.getElementById('btn-copy-vqr-img');
            const btnText = document.getElementById('btn-copy-vqr-text');

            results.modalIsOpen = modalEl && !modalEl.classList.contains('hidden');
            results.hasImgSrc = imgEl && imgEl.src.includes('TCB-554479');
            results.hasCopyBtn = !!copyBtn;
            results.initialBtnText = btnText ? btnText.innerText : null;

            // Mock clipboard write
            let clipboardWrittenItem = false;
            if (navigator.clipboard) {
              navigator.clipboard.write = async (items) => {
                clipboardWrittenItem = true;
                return Promise.resolve();
              };
            }

            // Test calling copyVietQrImage()
            await copyVietQrImage();
            // Wait a moment for canvas & blob processing
            await new Promise(r => setTimeout(r, 600));

            results.afterCopyBtnText = btnText ? btnText.innerText : null;
            results.clipboardTriggered = clipboardWrittenItem;

            const toastEl = document.getElementById('bt-toast-notification');
            results.hasToast = !!toastEl;
            results.toastText = toastEl ? toastEl.innerText : '';

            return results;
          })()
        `;

        const resEval = await send('Runtime.evaluate', {
          expression: testScript,
          awaitPromise: true,
          returnByValue: true
        });

        console.log('\n--- VIETQR COPY TEST RESULTS ---');
        console.log(JSON.stringify(resEval.result?.value, null, 2));

        const r = resEval.result?.value || {};
        let passed = true;

        if (!r.modalIsOpen) { console.error('FAIL: VietQR modal was not opened'); passed = false; }
        if (!r.hasImgSrc) { console.error('FAIL: VietQR image src is missing'); passed = false; }
        if (!r.hasCopyBtn) { console.error('FAIL: Copy button is missing'); passed = false; }
        if (r.afterCopyBtnText !== 'Đã Copy Ảnh QR!' && r.afterCopyBtnText !== 'Đã Tải Ảnh QR!') {
          console.error('FAIL: Button text did not update after copy');
          passed = false;
        }
        if (!r.hasToast) { console.error('FAIL: Toast notification element not created'); passed = false; }

        if (consoleErrors.length > 0) {
          console.error('\nConsole errors detected:', consoleErrors);
          passed = false;
        }

        if (passed) {
          console.log('\n>>> VIETQR COPY IMAGE AUTOMATED TEST PASSED 100%! <<<\n');
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

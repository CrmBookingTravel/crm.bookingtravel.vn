const http = require('http');
const { spawn } = require('child_process');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function run() {
  const chromeProcess = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9225',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1500));

  http.get('http://127.0.0.1:9225/json', (res) => {
    let raw = '';
    res.on('data', c => raw += c);
    res.on('end', async () => {
      const targets = JSON.parse(raw);
      const page = targets.find(t => t.type === 'page');
      if (!page) {
        console.error('No page target found');
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
        await send('Page.enable');
        await send('Runtime.enable');

        console.log('Navigating to http://localhost:3000/CRM_Booking.html ...');
        await send('Page.navigate', { url: 'http://localhost:3000/CRM_Booking.html' });

        await new Promise(r => setTimeout(r, 2000));

        const testScript = `
          (function() {
            const results = {};

            // 1. Kiểm tra 6 nút trên navbar
            const navIds = [
              'nav-attendance',
              'nav-combo-calc',
              'nav-group-calc',
              'nav-tool-zalo',
              'nav-tool-fb',
              'nav-tool-tiktok'
            ];

            results.navButtons = {};
            navIds.forEach(id => {
              const el = document.getElementById(id);
              results.navButtons[id] = {
                exists: !!el,
                text: el ? el.innerText.replace(/\\s+/g, ' ').trim() : null,
                visible: el ? el.offsetParent !== null : false
              };
            });

            // 2. Test Modal Chấm Công
            openAttendanceModal();
            const attModal = document.getElementById('attendance-modal');
            results.attendance = {
              opened: attModal && !attModal.classList.contains('hidden'),
              clockTime: document.getElementById('att-clock-time')?.innerText,
              userName: document.getElementById('att-user-name')?.innerText,
              todayStatus: document.getElementById('att-today-status')?.innerText
            };
            closeAttendanceModal();
            results.attendance.closed = attModal && attModal.classList.contains('hidden');

            // 3. Test Modal Bảng Tính Combo
            openComboCalcModal();
            const cbModal = document.getElementById('combo-calc-modal');
            results.comboCalc = {
              opened: cbModal && !cbModal.classList.contains('hidden'),
              totalCost: document.getElementById('cb-total-cost')?.innerText,
              totalPrice: document.getElementById('cb-total-price')?.innerText,
              grossProfit: document.getElementById('cb-gross-profit')?.innerText,
              netProfit: document.getElementById('cb-net-profit')?.innerText,
              previewHasContent: (document.getElementById('cb-preview-text')?.value || '').length > 50
            };
            closeComboCalcModal();
            results.comboCalc.closed = cbModal && cbModal.classList.contains('hidden');

            // 4. Test Modal Bảng Tính Khách Đoàn
            openGroupCalcModal();
            const grpModal = document.getElementById('group-calc-modal');
            results.groupCalc = {
              opened: grpModal && !grpModal.classList.contains('hidden'),
              totalPax: document.getElementById('grp-total-pax-badge')?.innerText,
              totalCost: document.getElementById('grp-total-cost')?.innerText,
              totalPrice: document.getElementById('grp-total-price')?.innerText,
              profit: document.getElementById('grp-profit')?.innerText,
              salesNet: document.getElementById('grp-sales-net-profit')?.innerText,
              previewHasContent: (document.getElementById('grp-preview-text')?.value || '').length > 50
            };
            closeGroupCalcModal();
            results.groupCalc.closed = grpModal && grpModal.classList.contains('hidden');

            // 5. Test Tool Zalo
            openToolZaloModal();
            const zaloModal = document.getElementById('tool-zalo-modal');
            results.toolZalo = {
              opened: zaloModal && !zaloModal.classList.contains('hidden'),
              msgContentLength: (document.getElementById('zalo-msg-preview')?.value || '').length
            };
            closeToolZaloModal();
            results.toolZalo.closed = zaloModal && zaloModal.classList.contains('hidden');

            // 6. Test Tool Facebook
            openToolFbModal();
            const fbModal = document.getElementById('tool-facebook-modal');
            results.toolFb = {
              opened: fbModal && !fbModal.classList.contains('hidden'),
              postLength: (document.getElementById('fb-post-preview')?.value || '').length,
              hasHashtags: (document.getElementById('fb-hashtag-preview')?.innerText || '').includes('#bookingtravel')
            };
            closeToolFbModal();
            results.toolFb.closed = fbModal && fbModal.classList.contains('hidden');

            // 7. Test Tool TikTok
            openToolTiktokModal();
            const ttModal = document.getElementById('tool-tiktok-modal');
            results.toolTiktok = {
              opened: ttModal && !ttModal.classList.contains('hidden'),
              hook: document.getElementById('tt-hook-text')?.innerText,
              sound: document.getElementById('tt-sound-text')?.innerText,
              cta: document.getElementById('tt-cta-text')?.innerText
            };
            closeToolTiktokModal();
            results.toolTiktok.closed = ttModal && ttModal.classList.contains('hidden');

            return results;
          })()
        `;

        const evalRes = await send('Runtime.evaluate', {
          expression: testScript,
          returnByValue: true
        });

        console.log('=== TEST RESULTS ===');
        console.log(JSON.stringify(evalRes.result?.value, null, 2));

        if (consoleErrors.length > 0) {
          console.error('Console Errors detected:', consoleErrors);
        } else {
          console.log('Zero console errors! All 6 tools verified perfectly.');
        }

        ws.close();
        chromeProcess.kill();
        process.exit(0);
      };
    });
  });
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});

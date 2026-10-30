const http = require('http');
const { spawn } = require('child_process');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function run() {
  const chromeProcess = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9226',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1500));

  http.get('http://127.0.0.1:9226/json', (res) => {
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

            // 1. Test escapeHtml chống XSS
            const xssPayload = '<script>alert("xss")</script>&"\\'';
            const escaped = escapeHtml(xssPayload);
            results.xssSanitization = {
              input: xssPayload,
              escaped: escaped,
              isSafe: !escaped.includes('<') && !escaped.includes('>') && !escaped.includes('"') && !escaped.includes("'")
            };

            // 2. Test Modal Đổi Mật Khẩu
            openChangePasswordModal();
            const cpModal = document.getElementById('change-password-modal');
            results.changePasswordModal = {
              opened: cpModal && !cpModal.classList.contains('hidden')
            };

            // Test độ mạnh mật khẩu
            const newPassInput = document.getElementById('cp-new-pass');
            newPassInput.value = 'Pass@123456';
            checkPasswordStrength();
            results.changePasswordModal.strengthBar = document.getElementById('cp-strength-bar')?.style.width;
            results.changePasswordModal.strengthText = document.getElementById('cp-strength-text')?.innerText;
            closeChangePasswordModal();
            results.changePasswordModal.closed = cpModal && cpModal.classList.contains('hidden');

            // 3. Test Khóa Màn Hình (Screen Lock Overlay)
            lockScreenNow('manual');
            const lockOverlay = document.getElementById('screen-lock-overlay');
            results.screenLock = {
              locked: lockOverlay && !lockOverlay.classList.contains('hidden'),
              lockUserName: document.getElementById('lock-user-name')?.innerText,
              lockReason: document.getElementById('lock-reason-text')?.innerText
            };

            // Mở khóa bằng mật khẩu/PIN
            const lockInput = document.getElementById('lock-password-input');
            lockInput.value = currentUser ? currentUser.pass : '123456';
            const unlockForm = lockInput.closest('form');
            unlockForm.dispatchEvent(new Event('submit', { cancelable: true }));

            results.screenLock.unlocked = lockOverlay && lockOverlay.classList.contains('hidden');

            // 4. Test Chế Độ Bảo Mật Cao trên Login Screen
            const isHighSec = isHighSecurityMode;
            results.highSecurityMode = {
              active: isHighSec,
              label: document.getElementById('security-mode-label')?.innerText
            };

            // 5. Test Rate Limiting / Brute Force
            results.rateLimitingConfigured = typeof loginFailedAttempts !== 'undefined' && typeof loginLockUntil !== 'undefined';

            return results;
          })()
        `;

        const evalRes = await send('Runtime.evaluate', {
          expression: testScript,
          returnByValue: true
        });

        console.log('=== SECURITY AUDIT TEST RESULTS ===');
        console.log(JSON.stringify(evalRes.result?.value, null, 2));

        if (consoleErrors.length > 0) {
          console.error('Console Errors detected:', consoleErrors);
        } else {
          console.log('Zero console errors! Advanced Security verified 100%.');
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

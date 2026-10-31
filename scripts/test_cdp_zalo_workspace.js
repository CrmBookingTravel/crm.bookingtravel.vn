const http = require('http');
const { spawn } = require('child_process');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const chromeProcess = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9230',
  '--disable-gpu',
  'about:blank'
]);

setTimeout(() => {
  http.get('http://127.0.0.1:9230/json', res => {
    let raw = '';
    res.on('data', c => raw += c);
    res.on('end', async () => {
      const targets = JSON.parse(raw);
      const page = targets.find(t => t.type === 'page');
      const ws = new WebSocket(page.webSocketDebuggerUrl);
      let id = 1;
      const send = (m, p = {}) => new Promise(r => {
        const cur = id++;
        const handler = e => {
          const d = JSON.parse(e.data);
          if (d.id === cur) { ws.removeEventListener('message', handler); r(d.result); }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: cur, method: m, params: p }));
      });
      ws.onopen = async () => {
        await send('Page.enable');
        await send('Runtime.enable');
        const consoleErrors = [];
        ws.addEventListener('message', e => {
          const msg = JSON.parse(e.data);
          if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
            consoleErrors.push(msg.params.args.map(a => a.value || a.description).join(' '));
          }
        });

        console.log('Navigating to local CRM...');
        await send('Page.navigate', { url: 'http://localhost:3000/CRM_Booking.html' });
        await new Promise(r => setTimeout(r, 2000));

        const testRes = await send('Runtime.evaluate', {
          expression: `(() => {
            const out = {};
            // 1. Open Zalo Modal
            openToolZaloModal();
            const modal = document.getElementById('tool-zalo-modal');
            out.modalOpened = modal && !modal.classList.contains('hidden');

            // 2. Check contacts count
            const contacts = document.querySelectorAll('#crmContactList > div');
            out.contactCount = contacts.length;

            // 3. Test active customer info
            out.activeCustName = document.getElementById('activeCustName')?.innerText;
            out.activeCustPhone = document.getElementById('activeCustPhone')?.innerText;
            out.activeBookingCode = document.getElementById('activeBookingCode')?.innerText;

            // 4. Test filling different templates
            CRMZalo.fillTemplate('airport_pickup');
            out.airportPickupText = document.getElementById('crmMessageEditor')?.value?.slice(0, 50);

            CRMZalo.fillTemplate('tour_reminder');
            out.tourReminderText = document.getElementById('crmMessageEditor')?.value?.slice(0, 50);

            // 5. Test department group dispatch
            CRMZalo.selectGroup('GRP_DIEU_HANH', '[NỘI BỘ] Sales - Điều Hành Tour & Xe', 'Phòng ban');
            out.groupDispatchText = document.getElementById('crmMessageEditor')?.value?.slice(0, 60);

            // 6. Test reminders count
            const rems = document.querySelectorAll('#crmReminderList > div');
            out.reminderCount = rems.length;

            // 7. Test login modal open/close
            CRMZalo.openLoginModal();
            const loginModal = document.getElementById('crmZaloLoginModal');
            out.loginModalOpened = loginModal && !loginModal.classList.contains('hidden');
            CRMZalo.closeLoginModal();
            out.loginModalClosed = loginModal && loginModal.classList.contains('hidden');

            // 8. Close tool Zalo modal
            closeToolZaloModal();
            out.modalClosed = modal && modal.classList.contains('hidden');

            return JSON.stringify(out);
          })()`
        });

        console.log('=== ZALO WORKSPACE CDP TEST RESULTS ===');
        console.log(JSON.parse(testRes.result.value));
        console.log('Console Errors:', consoleErrors);
        chromeProcess.kill();
        process.exit(consoleErrors.length > 0 ? 1 : 0);
      };
    });
  });
}, 1500);

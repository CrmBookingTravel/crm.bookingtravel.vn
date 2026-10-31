const http = require('http');
const { spawn } = require('child_process');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const chromeProcess = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9231',
  '--disable-gpu',
  'about:blank'
]);

setTimeout(() => {
  http.get('http://127.0.0.1:9231/json', res => {
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

        console.log('Navigating to zalo_crm.html...');
        await send('Page.navigate', { url: 'http://localhost:3000/zalo_crm.html' });
        await new Promise(r => setTimeout(r, 2000));

        const testRes = await send('Runtime.evaluate', {
          expression: `(() => {
            return JSON.stringify({
              title: document.title,
              contacts: document.querySelectorAll('#contactList > div').length,
              reminders: document.querySelectorAll('#reminderList > div').length,
              chatTitle: document.getElementById('chatTitle')?.innerText
            });
          })()`
        });

        console.log('=== ZALO STANDALONE TEST ===');
        console.log(JSON.parse(testRes.result.value));
        console.log('Console Errors:', consoleErrors);
        chromeProcess.kill();
        process.exit(consoleErrors.length > 0 ? 1 : 0);
      };
    });
  });
}, 1500);

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

  await new Promise(r => setTimeout(r, 1500));

  http.get('http://127.0.0.1:9227/json', (res) => {
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
      const failedRequests = [];

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
        if (msg.method === 'Network.responseReceived') {
          if (msg.params.response.status >= 400) {
            failedRequests.push({ url: msg.params.response.url, status: msg.params.response.status });
          }
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
        await send('Network.enable');

        console.log('Navigating to live GitHub Pages: https://crmbookingtravel.github.io/crm.bookingtravel.vn/ ...');
        await send('Page.navigate', { url: 'https://crmbookingtravel.github.io/crm.bookingtravel.vn/' });

        await new Promise(r => setTimeout(r, 3500));

        const evalRes = await send('Runtime.evaluate', {
          expression: `
            ({
              title: document.title,
              bodyLength: document.body.innerHTML.length,
              loginScreenHidden: document.getElementById('login-screen')?.classList.contains('hidden'),
              currentUser: typeof currentUser !== 'undefined' ? currentUser?.email : null,
              hasNavbar: !!document.getElementById('top-navbar-horizontal'),
              navButtons: [
                'nav-attendance',
                'nav-combo-calc',
                'nav-group-calc',
                'nav-tool-zalo',
                'nav-tool-fb',
                'nav-tool-tiktok'
              ].filter(id => !!document.getElementById(id))
            })
          `,
          returnByValue: true
        });

        console.log('=== LIVE GITHUB PAGES AUDIT ===');
        console.log('Page State:', JSON.stringify(evalRes.result?.value, null, 2));
        console.log('Failed Requests (404/500):', failedRequests);
        console.log('Console Errors:', consoleErrors);

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

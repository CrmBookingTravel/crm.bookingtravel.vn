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
  const port = 9227;
  let chromeProc = null;

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
  const WebSocket = require('ws');
  const ws = new WebSocket(pageTab.webSocketDebuggerUrl);

  await new Promise((resolve, reject) => {
    ws.on('open', resolve);
    ws.on('error', reject);
  });

  let id = 1;
  const callbacks = new Map();

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
    }
    if (msg.id && callbacks.has(msg.id)) {
      callbacks.get(msg.id)(msg);
      callbacks.delete(msg.id);
    }
  });

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Page.navigate', { url: 'http://localhost:3000/CRM_Booking.html' });
  await new Promise(r => setTimeout(r, 2000));

  const evalRes = await send('Runtime.evaluate', {
    expression: `
      (() => {
        try {
          const bks = (typeof bookings !== 'undefined') ? bookings : [];
          const b = bks[0];
          openVoucherModal(b.id);
          
          let copiedText = '';
          const origClipboard = navigator.clipboard.writeText;
          navigator.clipboard.writeText = (txt) => {
            copiedText = txt;
            return Promise.resolve();
          };

          copyVoucherToCustomerZalo();
          
          navigator.clipboard.writeText = origClipboard;

          return {
            success: true,
            hasHotline: copiedText.includes('0846.477.222') || copiedText.includes('0846477222'),
            hasNoOldNumber: !copiedText.includes('08.33.00.1000'),
            hasNoOldAddress: !copiedText.includes('38 Tầng Trệt'),
            previewSnippet: copiedText.slice(0, 350)
          };
        } catch(e) {
          return { error: e.message, stack: e.stack };
        }
      })()
    `,
    returnByValue: true
  });

  console.log('Copy Zalo Template Result:');
  console.log(JSON.stringify(evalRes.result?.result?.value, null, 2));

  ws.close();
  if (chromeProc) chromeProc.kill();
  process.exit(0);
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});

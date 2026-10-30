const http = require('http');
const { spawn } = require('child_process');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const chromeProcess = spawn(chromePath, [
  '--headless=new',
  '--remote-debugging-port=9229',
  '--disable-gpu',
  'about:blank'
]);

setTimeout(() => {
  http.get('http://127.0.0.1:9229/json', res => {
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
        await send('Network.enable');
        const netErrors = [];
        const consoleMessages = [];
        ws.addEventListener('message', e => {
          const msg = JSON.parse(e.data);
          if (msg.method === 'Network.responseReceived') {
            const resp = msg.params.response;
            if (resp.status >= 400) netErrors.push({ url: resp.url, status: resp.status });
          }
          if (msg.method === 'Runtime.consoleAPICalled') {
            consoleMessages.push(msg.params.args.map(a => a.value || a.description).join(' '));
          }
        });
        console.log('Navigating to GitHub.io...');
        await send('Page.navigate', { url: 'https://crmbookingtravel.github.io/crm.bookingtravel.vn/' });
        await new Promise(r => setTimeout(r, 4000));
        const res = await send('Runtime.evaluate', {
          expression: 'JSON.stringify({ url: window.location.href, title: document.title, bodyLen: document.body ? document.body.innerHTML.length : 0, text: document.body ? document.body.innerText.slice(0, 300) : "" })'
        });
        console.log('Evaluation:', JSON.parse(res.result.value));
        console.log('Net errors:', netErrors);
        console.log('Console messages:', consoleMessages.slice(0, 5));
        chromeProcess.kill();
        process.exit(0);
      };
    });
  });
}, 1500);

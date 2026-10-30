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

      const WebSocket = global.WebSocket;
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
        console.log('Connected to Chrome CDP WebSocket');
        await send('Page.enable');
        await send('Runtime.enable');
        await send('Page.navigate', { url: 'http://localhost:3000/CRM_Booking.html' });

        setTimeout(async () => {
          console.log('consoleErrors before eval:', consoleErrors);
          const testScript = `
            (() => {
              const results = {};

              // 1. Simulate login as sales1 (Ngô Thị Băng Kiều)
              const sales1User = systemUsers.find(u => u.email === 'sales1@bookingtravel.vn');
              if (sales1User) {
                currentUser = sales1User;
                localStorage.setItem('BOOKING_TRAVEL_CURRENT_USER', JSON.stringify(sales1User));
                updateSidebarAndTabsByRole(sales1User.role);
                updateMetrics();
                renderTable();

                const card3Label = document.querySelector('#view-bookings .grid > div:nth-child(3) span')?.innerText;
                const card3Gross = document.getElementById('stat-lai-gop')?.innerText;
                const card3Real = document.getElementById('stat-thuc-nhan-val')?.innerText;
                const card3RealBoxTitle = document.getElementById('stat-card-3-real-box')?.getAttribute('title');

                results.salesView = {
                  user: sales1User.email,
                  card3Label,
                  card3Gross,
                  card3Real,
                  card3RealBoxTitle,
                  firstRowCommissionCell: document.querySelector('#table-body tr:first-child td:nth-child(8)')?.innerText.replace(/\\s+/g, ' ').trim()
                };
              }

              // 2. Simulate login as Admin
              const adminUser = systemUsers.find(u => u.role === 'admin');
              if (adminUser) {
                currentUser = adminUser;
                localStorage.setItem('BOOKING_TRAVEL_CURRENT_USER', JSON.stringify(adminUser));
                updateSidebarAndTabsByRole(adminUser.role);
                updateMetrics();
                renderTable();

                results.adminView = {
                  card3Gross: document.getElementById('stat-lai-gop')?.innerText,
                  card3Real: document.getElementById('stat-thuc-nhan-val')?.innerText,
                  card3RealBoxTitle: document.getElementById('stat-card-3-real-box')?.getAttribute('title')
                };
              }

              return results;
            })()
          `;

          const evalRes = await send('Runtime.evaluate', { expression: testScript, returnByValue: true });
          console.log('evalRes directly:', evalRes);
          console.log('consoleErrors after eval:', consoleErrors);
          const val = evalRes?.result?.value;
          console.log('Evaluation Results:', JSON.stringify(val, null, 2));

          let testPassed = true;

          if (val?.salesView?.card3Label?.includes('Hoa Hồng Của Tôi')) {
            console.log('[PASS] Tiêu đề Card 3 của Sales: "Hoa Hồng Của Tôi"');
          } else {
            console.error('[FAIL] Tiêu đề Card 3 không đúng:', val?.salesView?.card3Label);
            testPassed = false;
          }

          if (val?.salesView?.card3Real && val?.salesView?.card3Real.includes('đ')) {
            console.log(`[PASS] Card 3 của Sales hiển thị chuẩn xác: Lãi gộp: ${val.salesView.card3Gross} • Thực nhận (-30%): ${val.salesView.card3Real}`);
          } else {
            console.error('[FAIL] Card 3 thiếu số tiền thực nhận (-30%):', val?.salesView);
            testPassed = false;
          }

          if (val?.salesView?.firstRowCommissionCell?.includes('Thực nhận (-30%)')) {
            console.log('[PASS] Bảng đơn hàng desktop hiển thị đầy đủ Thực nhận (-30%):', val.salesView.firstRowCommissionCell);
          } else {
            console.error('[FAIL] Bảng đơn hàng desktop thiếu Thực nhận (-30%):', val?.salesView?.firstRowCommissionCell);
            testPassed = false;
          }

          if (val?.adminView?.card3Real && val?.adminView?.card3Real.includes('đ')) {
            console.log(`[PASS] Card 3 của Admin hiển thị: Gộp cả đội: ${val.adminView.card3Gross} • Thực nhận cả đội (-30%): ${val.adminView.card3Real}`);
          } else {
            console.error('[FAIL] Card 3 của Admin thiếu số tiền thực nhận:', val?.adminView);
            testPassed = false;
          }

          ws.close();
          chromeProcess.kill();

          if (testPassed) {
            console.log('\n🎉 ALL CARD 3 & COMMISSION CDP TESTS PASSED 100%!');
            process.exit(0);
          } else {
            console.error('\n❌ SOME CDP TESTS FAILED!');
            process.exit(1);
          }
        }, 2500);
      };
    });
  });
}

run();

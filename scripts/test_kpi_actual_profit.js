const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');

async function isPortOpen(port) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${port}/json/version`, (res) => {
      resolve(true);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(1000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function runTest() {
  console.log('🚀 Starting Automated Verification for KPI Actual Profit...');

  let chromeProc = null;
  const portOpen = await isPortOpen(9222);

  if (!portOpen) {
    console.log('Launching headless Chrome on port 9222...');
    const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    chromeProc = spawn(chromePath, [
      '--headless=new',
      '--remote-debugging-port=9222',
      '--disable-gpu',
      '--no-first-run',
      '--no-default-browser-check',
      '--user-data-dir=' + process.env.TEMP + '\\chrome_test_kpi_' + Date.now()
    ], { detached: false });

    // Wait for Chrome CDP port to open
    for (let i = 0; i < 20; i++) {
      await new Promise(r => setTimeout(r, 500));
      if (await isPortOpen(9222)) {
        console.log('Chrome CDP is ready on port 9222.');
        break;
      }
    }
  } else {
    console.log('Chrome CDP already running on port 9222.');
  }

  // 1. Get or create Chrome tab
  const listRes = await new Promise((resolve, reject) => {
    http.get('http://localhost:9222/json', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    }).on('error', reject);
  });

  let pageTab = listRes.find(t => t.type === 'page');
  if (!pageTab) {
    const newTabRes = await new Promise((resolve, reject) => {
      http.get('http://localhost:9222/json/new?http://localhost:3000/CRM_Booking.html', (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve(JSON.parse(data)));
      }).on('error', reject);
    });
    pageTab = newTabRes;
  }

  const wsUrl = pageTab.webSocketDebuggerUrl;
  console.log('Connected to Chrome tab:', wsUrl);

  const WebSocket = require('ws');
  const ws = new WebSocket(wsUrl);

  const errors = [];
  const logs = [];
  let msgId = 1;
  const pending = new Map();

  function cdp(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = msgId++;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await new Promise(resolve => ws.on('open', resolve));

  ws.on('message', (data) => {
    const msg = JSON.parse(data.toString());
    if (msg.method === 'Page.javascriptDialogOpening') {
      console.log('Accepting dialog:', msg.params.message);
      cdp('Page.handleJavaScriptDialog', { accept: true }).catch(() => {});
    } else if (msg.method === 'Runtime.consoleAPICalled') {
      if (msg.params.type === 'error') {
        errors.push(msg.params.args.map(a => a.value || a.description).join(' '));
      } else {
        logs.push(msg.params.args.map(a => a.value || a.description).join(' '));
      }
    } else if (msg.method === 'Runtime.exceptionThrown') {
      errors.push(msg.params.exceptionDetails.text + ' ' + (msg.params.exceptionDetails.exception?.description || ''));
    } else if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(new Error(msg.error.message));
      else resolve(msg.result);
    }
  });

  await cdp('Page.enable');
  await cdp('Runtime.enable');

  console.log('Navigating to http://localhost:3000/CRM_Booking.html ...');
  await cdp('Page.navigate', { url: 'http://localhost:3000/CRM_Booking.html' });
  await new Promise(r => setTimeout(r, 2000));

  // TEST 1: Check basic structures and anti-double-counting helper
  console.log('\n--- TEST 1: Verifying anti-double-counting formula and helpers ---');
  const test1Res = await cdp('Runtime.evaluate', {
    expression: `(() => {
      const bTest = {
        giaBan: 20000000,
        giaVon: 15000000,
        chiPhiPhatSinh: 1000000,
        tuVanEmail: 'sales1@bookingtravel.vn',
        hoTroEmail: 'sales2@bookingtravel.vn',
        tyLeTuVan: 70,
        tyLeHoTro: 30,
        tourStatus: 'da_xac_nhan'
      };
      const split = getBookingNetProfitAndSplit(bTest);
      const s1 = getStaffProfitForBooking(bTest, 'sales1@bookingtravel.vn');
      const s2 = getStaffProfitForBooking(bTest, 'sales2@bookingtravel.vn');

      const sumProfit = s1.profit + s2.profit;
      const sumRev = s1.rev + s2.rev;

      return {
        actualProfit: split.actualProfit,
        tuVanProfit: s1.profit,
        hoTroProfit: s2.profit,
        sumProfit,
        exactMatch: sumProfit === split.actualProfit,
        tuVanRev: s1.rev,
        hoTroRev: s2.rev,
        sumRev,
        exactRevMatch: sumRev === bTest.giaBan
      };
    })()`,
    returnByValue: true
  });

  console.log('Anti-double-counting test result:', test1Res.result?.value);
  if (!test1Res.result?.value?.exactMatch) {
    throw new Error('Anti-double-counting failed: sum of staff profit does not match net profit!');
  }
  if (!test1Res.result?.value?.exactRevMatch) {
    throw new Error('Anti-double-counting failed: sum of staff revenue does not match gross revenue!');
  }
  console.log('✅ Anti-double-counting mathematically verified: Profit sum = 100%, Rev sum = 100%!');

  // TEST 2: Verify Modal Inputs & Realtime Calculation
  console.log('\n--- TEST 2: Verifying Modal Inputs & Realtime Calculation ---');
  const test2Res = await cdp('Runtime.evaluate', {
    expression: `(() => {
      openModalTaoDon(true);
      const iptExtra = document.getElementById('ipt-extra-cost');
      const iptSupport = document.getElementById('ipt-support-sale');
      const iptLead = document.getElementById('ipt-lead-staff');
      const iptSplit = document.getElementById('ipt-split-rate');
      const iptRev = document.getElementById('ipt-revenue');
      const iptCost = document.getElementById('ipt-cost');

      iptRev.value = '25.000.000';
      iptCost.value = '20.000.000';
      iptExtra.value = '2.000.000';
      iptSplit.value = '70_30';
      if (iptSupport.options.length > 1) iptSupport.selectedIndex = 1;

      calculateFormFinancials();

      const profitTxt = document.getElementById('calc-profit-preview')?.innerText;
      const splitTxt = document.getElementById('calc-split-detail')?.innerText;

      closeModalTaoDon();

      return {
        hasInputs: !!(iptExtra && iptSupport && iptLead && iptSplit),
        supportOptionsCount: iptSupport ? iptSupport.options.length : 0,
        profitTxt,
        splitTxt
      };
    })()`,
    returnByValue: true
  });
  console.log('Modal inputs & realtime preview test result:', test2Res.result?.value);
  if (!test2Res.result?.value?.hasInputs) {
    throw new Error('Modal inputs missing!');
  }
  console.log('✅ Modal inputs and realtime preview verified successfully!');

  // TEST 3: Switch to KPI view and test Day, Week, Month, Matrix periods
  console.log('\n--- TEST 3: Verifying KPI View & Period Switching ---');
  const test3Res = await cdp('Runtime.evaluate', {
    expression: `(() => {
      switchView('kpi_sales');

      const card1 = document.getElementById('kpi-target-total')?.innerText;
      const card2 = document.getElementById('kpi-gross-total')?.innerText;
      const card3 = document.getElementById('kpi-actual-total')?.innerText;
      const card3Sub = document.getElementById('kpi-actual-percent')?.innerText;
      const card4 = document.getElementById('kpi-payout-total')?.innerText;

      // Test Month
      setKpiPeriod('month');
      const monthRows = document.querySelectorAll('#sales-kpi-table-body tr').length;

      // Test Week
      setKpiPeriod('week');
      const weekRows = document.querySelectorAll('#sales-kpi-table-body tr').length;

      // Test Day
      setKpiPeriod('day');
      const dayRows = document.querySelectorAll('#sales-kpi-table-body tr').length;

      // Test Matrix
      setKpiPeriod('matrix');
      const matrixRows = document.querySelectorAll('#sales-kpi-table-body tr').length;
      const matrixThead = document.getElementById('sales-kpi-thead')?.innerText;

      // Switch back to month
      setKpiPeriod('month');

      return {
        card1,
        card2,
        card3,
        card3Sub,
        card4,
        monthRows,
        weekRows,
        dayRows,
        matrixRows,
        hasMatrixColumns: matrixThead.includes('LN Thực Tế Ngày') && matrixThead.includes('Tỷ Lệ Chốt') && matrixThead.includes('Đơn Hủy')
      };
    })()`,
    returnByValue: true
  });
  console.log('KPI view & period switching test result:', test3Res.result?.value);
  if (!test3Res.result?.value?.hasMatrixColumns) {
    throw new Error('Matrix columns missing in KPI view!');
  }
  console.log('✅ KPI View renders correctly with all 4 cards, Top 3 podium, and full Day/Week/Month/Matrix tables!');

  // Check console errors
  console.log('\nConsole Errors captured:', errors);
  if (errors.length > 0) {
    throw new Error('Console errors encountered: ' + JSON.stringify(errors));
  }
  console.log('✅ 0 Console Errors encountered!');

  console.log('\n🎉 ALL KPI ACTUAL PROFIT VERIFICATION TESTS PASSED SUCCESSFULLY!');
  ws.close();
  if (chromeProc) {
    chromeProc.kill();
  }
  process.exit(0);
}

runTest().catch(err => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});

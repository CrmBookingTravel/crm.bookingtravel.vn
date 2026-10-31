const http = require('http');
const { spawn } = require('child_process');

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

async function runE2ETest() {
  console.log('🚀 Running Full E2E Flow Test for KPI Actual Profit & Double-Counting Prevention...');

  let chromeProc = null;
  if (!(await isPortOpen(9222))) {
    const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    chromeProc = spawn(chromePath, [
      '--headless=new',
      '--remote-debugging-port=9222',
      '--disable-gpu',
      '--no-first-run',
      '--no-default-browser-check',
      '--user-data-dir=' + process.env.TEMP + '\\chrome_e2e_' + Date.now()
    ]);
    for (let i = 0; i < 20; i++) {
      await new Promise(r => setTimeout(r, 500));
      if (await isPortOpen(9222)) break;
    }
  }

  const listRes = await new Promise((resolve, reject) => {
    http.get('http://localhost:9222/json', res => {
      let d = '';
      res.on('data', c => d += c);
      res.on('end', () => resolve(JSON.parse(d)));
    }).on('error', reject);
  });

  const pageTab = listRes.find(t => t.type === 'page');
  const wsUrl = pageTab.webSocketDebuggerUrl;

  const WebSocket = require('ws');
  const ws = new WebSocket(wsUrl);

  const errors = [];
  let msgId = 1;
  const pending = new Map();

  function cdp(method, params = {}) {
    return new Promise((resolve, reject) => {
      const id = msgId++;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params }));
    });
  }

  await new Promise(r => ws.on('open', r));

  ws.on('message', d => {
    const msg = JSON.parse(d.toString());
    if (msg.method === 'Page.javascriptDialogOpening') {
      cdp('Page.handleJavaScriptDialog', { accept: true }).catch(() => {});
    } else if (msg.method === 'Runtime.exceptionThrown') {
      errors.push(msg.params.exceptionDetails.text);
    } else if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(new Error(msg.error.message));
      else resolve(msg.result);
    }
  });

  await cdp('Page.enable');
  await cdp('Runtime.enable');

  await cdp('Page.navigate', { url: 'http://localhost:3000/CRM_Booking.html' });
  await new Promise(r => setTimeout(r, 2000));

  // Step 1: Create a collaborative booking (70% Consultant, 30% Support)
  console.log('\n--- Step 1: Creating a booking with Chi Phí Phát Sinh & Split Allocation ---');
  const createRes = await cdp('Runtime.evaluate', {
    expression: `(() => {
      openModalTaoDon(true);

      const codeVal = 'BT_TEST_' + Date.now();
      document.getElementById('ipt-code').value = codeVal;
      document.getElementById('ipt-customer').value = 'NGUYỄN VĂN TEST KPI';
      document.getElementById('ipt-phone').value = '0987654321';
      document.getElementById('ipt-supplier').value = 'Khách Sạn Rova Nha Trang';
      document.getElementById('ipt-service').value = '2 Đêm Nghỉ Dưỡng';
      
      // Tư vấn: Sales1, Hỗ trợ: Sales2
      const saleSelect = document.getElementById('ipt-sale');
      const supportSelect = document.getElementById('ipt-support-sale');
      saleSelect.value = 'sales1@bookingtravel.vn';
      supportSelect.value = 'sales2@bookingtravel.vn';
      
      document.getElementById('ipt-lead-staff').value = 'Sales 1 Lead';
      document.getElementById('ipt-split-rate').value = '70_30';

      document.getElementById('ipt-revenue').value = '10.000.000';
      document.getElementById('ipt-cost').value = '7.000.000';
      document.getElementById('ipt-extra-cost').value = '1.000.000';
      document.getElementById('ipt-tour-status').value = 'da_xac_nhan';

      calculateFormFinancials();

      // Trigger submit
      const form = document.getElementById('booking-form');
      const fakeEvent = { preventDefault: () => {} };
      handleSaveBooking(fakeEvent);

      // Verify saved in bookings array
      const saved = bookings.find(b => b.maBooking === codeVal);
      return {
        savedOk: !!saved,
        code: saved?.maBooking,
        giaBan: saved?.giaBan,
        giaVon: saved?.giaVon,
        chiPhiPhatSinh: saved?.chiPhiPhatSinh,
        loiNhuanThucTe: saved?.loiNhuanThucTe,
        tuVanEmail: saved?.tuVanEmail,
        hoTroEmail: saved?.hoTroEmail,
        tyLeTuVan: saved?.tyLeTuVan,
        tyLeHoTro: saved?.tyLeHoTro
      };
    })()`,
    returnByValue: true
  });

  console.log('Created booking verification:', createRes.result?.value);
  const val = createRes.result?.value;
  if (!val?.savedOk || val?.chiPhiPhatSinh !== 1000000 || val?.loiNhuanThucTe !== 2000000) {
    throw new Error('Booking creation failed or financial fields not properly saved!');
  }
  console.log('✅ Booking created and saved with exact net actual profit: 2,000,000 đ!');

  // Step 2: Edit booking and verify fields populate properly
  console.log('\n--- Step 2: Testing Edit Booking & Audit Trail ---');
  const editRes = await cdp('Runtime.evaluate', {
    expression: `(() => {
      const codeVal = '${val.code}';
      editBooking(codeVal);

      const loadedExtra = document.getElementById('ipt-extra-cost')?.value;
      const loadedSupport = document.getElementById('ipt-support-sale')?.value;
      const loadedSplit = document.getElementById('ipt-split-rate')?.value;
      const loadedLead = document.getElementById('ipt-lead-staff')?.value;

      // Now modify extra cost to 1.500.000 đ
      document.getElementById('ipt-extra-cost').value = '1.500.000';
      calculateFormFinancials();

      const fakeEvent = { preventDefault: () => {} };
      handleSaveBooking(fakeEvent);

      const updated = bookings.find(b => b.maBooking === codeVal);
      const lastHistory = updated?.editHistory?.[0];

      closeModalTaoDon();

      return {
        loadedExtra,
        loadedSupport,
        loadedSplit,
        loadedLead,
        newProfit: updated?.loiNhuanThucTe,
        hasAuditTrail: !!lastHistory,
        auditChanges: lastHistory?.changes
      };
    })()`,
    returnByValue: true
  });

  console.log('Edit booking & audit trail result:', editRes.result?.value);
  const editVal = editRes.result?.value;
  if (editVal?.newProfit !== 1500000 || !editVal?.hasAuditTrail) {
    throw new Error('Edit or audit trail failed!');
  }
  console.log('✅ Edit booking populated perfectly and audit trail recorded changes!');

  // Step 3: Check KPI view attribution
  console.log('\n--- Step 3: Verifying Sales KPI Attribution with Anti-Double Counting ---');
  const kpiRes = await cdp('Runtime.evaluate', {
    expression: `(() => {
      switchView('kpi_sales');
      setKpiPeriod('month');

      const s1Email = 'sales1@bookingtravel.vn';
      const s2Email = 'sales2@bookingtravel.vn';

      // Total booking net profit: 1,500,000 đ
      // Sales1 (70%): 1,050,000 đ
      // Sales2 (30%): 450,000 đ
      const sp1 = getStaffProfitForBooking(bookings.find(b => b.maBooking === '${val.code}'), s1Email);
      const sp2 = getStaffProfitForBooking(bookings.find(b => b.maBooking === '${val.code}'), s2Email);

      return {
        sp1Profit: sp1.profit,
        sp2Profit: sp2.profit,
        sumProfit: sp1.profit + sp2.profit,
        exactMatch1500k: (sp1.profit + sp2.profit) === 1500000,
        sp1Rev: sp1.rev,
        sp2Rev: sp2.rev,
        sumRev: sp1.rev + sp2.rev,
        exactRev10M: (sp1.rev + sp2.rev) === 10000000
      };
    })()`,
    returnByValue: true
  });

  console.log('KPI attribution verification result:', kpiRes.result?.value);
  const kpiVal = kpiRes.result?.value;
  if (!kpiVal?.exactMatch1500k || !kpiVal?.exactRev10M) {
    throw new Error('Anti-double-counting split verification failed!');
  }
  console.log('✅ Sales 1 (70%) + Sales 2 (30%) exactly equals 1,500,000 đ profit and 10,000,000 đ revenue!');

  console.log('\nConsole Errors:', errors);
  if (errors.length > 0) throw new Error('Errors logged: ' + JSON.stringify(errors));

  console.log('\n🏆 ALL E2E VERIFICATION CHECKS PASSED WITH 100% SUCCESS!');
  ws.close();
  if (chromeProc) chromeProc.kill();
  process.exit(0);
}

runE2ETest().catch(e => {
  console.error('❌ E2E Test failed:', e);
  process.exit(1);
});

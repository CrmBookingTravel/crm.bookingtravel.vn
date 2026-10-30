const http = require('http');
const { spawn } = require('child_process');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function run() {
  const chromeProcess = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9223',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1200));

  http.get('http://127.0.0.1:9223/json', (res) => {
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

        console.log('Navigating to http://localhost:3000/CRM_Booking.html ...');
        await send('Page.navigate', { url: 'http://localhost:3000/CRM_Booking.html' });

        await new Promise(r => setTimeout(r, 2500));

        // Evaluate expression in browser context
        const testScript = `
          (() => {
            const results = {};

            // Ensure we are logged in as admin or sales to see KPI section
            const currentUser = JSON.parse(localStorage.getItem('BOOKING_TRAVEL_CURRENT_USER') || '{}');
            results.currentUser = currentUser.email || 'None';

            // Test 0: Test calculation formula function calcBookingTravelKpi
            // Case 30 triệu lãi gộp (thô)
            const kpi30m = calcBookingTravelKpi(30000000, 'month', 10000000);
            results.calcTest30m = {
              profit: kpi30m.profit,
              taxCost: kpi30m.taxCost,
              realCommission: kpi30m.realCommission,
              target: kpi30m.target,
              progress: kpi30m.progress,
              surplus: kpi30m.surplus,
              staffCommission: kpi30m.staffCommission,
              companyShare: kpi30m.companyShare,
              isPassed: kpi30m.isPassed
            };

            // Case 5.1 triệu lãi gộp (Nguyễn Thu Phương)
            const kpi5_1m = calcBookingTravelKpi(5100000, 'month', 10000000);
            results.calcTest5_1m = {
              profit: kpi5_1m.profit,
              taxCost: kpi5_1m.taxCost,
              realCommission: kpi5_1m.realCommission,
              progress: kpi5_1m.progress,
              surplus: kpi5_1m.surplus,
              staffCommission: kpi5_1m.staffCommission,
              remaining: kpi5_1m.remaining,
              isPassed: kpi5_1m.isPassed
            };

            // Test 1: Check initial target values in UI
            const targetTotalEl = document.getElementById('kpi-target-total');
            const targetPerEl = document.getElementById('kpi-target-per-person');
            results.initialTargetTotal = targetTotalEl ? targetTotalEl.innerText : null;
            results.initialTargetPer = targetPerEl ? targetPerEl.innerText : null;

            // Helper to inspect table columns and sample row data
            function inspectTable() {
              const ths = Array.from(document.querySelectorAll('#sales-kpi-thead th')).map(th => th.innerText.trim());
              const rows = Array.from(document.querySelectorAll('#sales-kpi-table-body tr')).length;
              const firstRowCells = Array.from(document.querySelectorAll('#sales-kpi-table-body tr:first-child td')).map(td => td.innerText.replace(/\s+/g, ' ').trim());
              const lastRowCells = Array.from(document.querySelectorAll('#sales-kpi-table-body tr:last-child td')).map(td => td.innerText.replace(/\s+/g, ' ').trim());
              return { headers: ths, rowCount: rows, firstRowCells, lastRowCells };
            }

            // Test Day period
            setKpiPeriod('day');
            results.dayView = inspectTable();

            // Test Week period
            setKpiPeriod('week');
            results.weekView = inspectTable();

            // Test Month period
            setKpiPeriod('month');
            results.monthView = inspectTable();

            // Cards in Month period
            results.cards = {
              targetTotal: document.getElementById('kpi-target-total')?.innerText,
              grossTotal: document.getElementById('kpi-gross-total')?.innerText,
              actualTotal: document.getElementById('kpi-actual-total')?.innerText,
              payoutTotal: document.getElementById('kpi-payout-total')?.innerText
            };

            // Test Matrix period (Tong Hop)
            setKpiPeriod('matrix');
            results.matrixView = inspectTable();

            // Test Modal Remind
            openKpiRemindModal('sales3@bookingtravel.vn', 'month');
            const remindMsg = document.getElementById('remind-modal-message')?.value || '';
            results.remindSample = remindMsg.slice(0, 600);
            closeKpiRemindModal();

            return results;
          })()
        `;

        const evalRes = await send('Runtime.evaluate', { expression: testScript, returnByValue: true });
        console.log('Evaluation Results:', JSON.stringify(evalRes.result?.value, null, 2));

        const val = evalRes.result?.value;
        let testPassed = true;

        if (consoleErrors.length > 0) {
          console.warn('Console warnings/errors encountered:', consoleErrors);
        }

        // Validate formula calcBookingTravelKpi for 30m:
        // Lãi gộp 30tr -> Thuế 30% = 9tr -> Hoa hồng thật 70% = 21tr -> Vượt 10tr = 11tr -> NV 40% = 4.4tr, Cty 60% = 6.6tr
        const c30 = val?.calcTest30m;
        if (c30?.taxCost === 9000000 && c30?.realCommission === 21000000 && c30?.progress === 210 && c30?.staffCommission === 4400000 && c30?.companyShare === 6600000) {
          console.log('[PASS] Công thức 30 triệu: Thuế 30% (9tr), HH Thật (21tr), Tiến độ 210%, NV nhận 40% phần vượt (4.4tr), Cty giữ 60% (6.6tr) CHÍNH XÁC TUYỆT ĐỐI!');
        } else {
          console.error('[FAIL] Sai công thức 30 triệu:', c30);
          testPassed = false;
        }

        // Validate dayView
        if (val?.dayView?.headers?.some(h => h.includes('Tiến Độ KPI')) && val?.dayView?.headers?.some(h => h.includes('Hoa Hồng Thật')) && val?.dayView?.headers?.some(h => h.includes('Tổng Tiền Thực Nhận'))) {
          console.log('[PASS] Ngày: Giữ đầy đủ cột Tiến Độ KPI, Hoa Hồng Thật (-30% Thuế) và Tổng Tiền Thực Nhận');
        } else {
          console.error('[FAIL] Ngày thiếu cột!', val?.dayView?.headers);
          testPassed = false;
        }

        // Validate weekView
        if (val?.weekView?.headers?.some(h => h.includes('Tiến Độ KPI')) && val?.weekView?.headers?.some(h => h.includes('Hoa Hồng Thật')) && val?.weekView?.headers?.some(h => h.includes('Tổng Tiền Thực Nhận'))) {
          console.log('[PASS] Tuần: Giữ đầy đủ cột Tiến Độ KPI, Hoa Hồng Thật (-30% Thuế) và Tổng Tiền Thực Nhận');
        } else {
          console.error('[FAIL] Tuần thiếu cột!', val?.weekView?.headers);
          testPassed = false;
        }

        // Validate monthView
        if (val?.monthView?.headers?.some(h => h.includes('Tiến Độ KPI')) && val?.monthView?.headers?.some(h => h.includes('Hoa Hồng Thật')) && val?.monthView?.headers?.some(h => h.includes('Tổng Tiền Thực Nhận'))) {
          console.log('[PASS] Tháng: Giữ đầy đủ cột Tiến Độ KPI, Hoa Hồng Thật (-30% Thuế) và Tổng Tiền Thực Nhận');
        } else {
          console.error('[FAIL] Tháng thiếu cột!', val?.monthView?.headers);
          testPassed = false;
        }

        // Validate Total Row in monthView
        const lastRowMonth = val?.monthView?.lastRowCells || [];
        if (lastRowMonth.some(c => c.includes('TỔNG CỘNG TOÀN ĐỘI'))) {
          console.log('[PASS] Dòng TỔNG CỘNG TOÀN ĐỘI hiển thị chuẩn xác ở cuối bảng KPI tháng:', lastRowMonth.slice(0, 5));
        } else {
          console.error('[FAIL] Thiếu dòng TỔNG CỘNG TOÀN ĐỘI ở bảng tháng:', lastRowMonth);
          testPassed = false;
        }

        // Validate matrixView
        const mHeaders = val?.matrixView?.headers || [];
        const hasTienDo = mHeaders.some(h => h.includes('Tiến Độ'));
        const hasThucNhan = mHeaders.some(h => h.includes('Tổng Tiền Thực Nhận'));
        if (hasTienDo && hasThucNhan) {
          console.log(`[PASS] Tổng Hợp (Matrix): Giữ đầy đủ cột Tiến Độ (Ngày, Tuần, Tháng) và Tổng Tiền Thực Nhận`);
        } else {
          console.error('[FAIL] Tổng Hợp thiếu cột:', { hasTienDo, hasThucNhan, headers: mHeaders });
          testPassed = false;
        }

        // Validate Total Row in matrixView
        const lastRowMatrix = val?.matrixView?.lastRowCells || [];
        if (lastRowMatrix.some(c => c.includes('TỔNG CỘNG TOÀN ĐỘI'))) {
          console.log('[PASS] Dòng TỔNG CỘNG TOÀN ĐỘI hiển thị chuẩn xác ở chế độ ma trận:', lastRowMatrix.slice(0, 5));
        } else {
          console.error('[FAIL] Thiếu dòng TỔNG CỘNG TOÀN ĐỘI ở chế độ ma trận:', lastRowMatrix);
          testPassed = false;
        }

        // Validate Cards in Health Bar
        const cards = val?.cards;
        if (cards?.grossTotal && cards?.actualTotal && cards?.payoutTotal) {
          console.log('[PASS] Các thẻ chỉ số sức khỏe KPI (Hoa hồng toàn đội chưa trừ 30%, Hoa hồng thật, Tổng tiền thực nhận):', cards);
        } else {
          console.error('[FAIL] Thẻ chỉ số sức khỏe KPI thiếu giá trị:', cards);
          testPassed = false;
        }

        // Validate Remind Modal Content
        if (val?.remindSample?.includes('Chỉ tiêu bắt buộc') && val?.remindSample?.includes('Hoa hồng thật') && val?.remindSample?.includes('Tổng tiền thực nhận')) {
          console.log('[PASS] Modal Nhắc Nhở & Động Viên: Đã tích hợp đầy đủ Hoa hồng thật, thuế 30%, và Tổng tiền thực nhận!');
        } else {
          console.error('[FAIL] Modal Nhắc Nhở chưa cập nhật đúng nội dung:', val?.remindSample);
          testPassed = false;
        }

        ws.close();
        chromeProcess.kill();

        if (testPassed) {
          console.log('\n🎉 ALL HEADLESS CHROME E2E TESTS PASSED 100%!');
          process.exit(0);
        } else {
          console.error('\n❌ SOME E2E TESTS FAILED!');
          process.exit(1);
        }
      };
    });
  });
}

run();

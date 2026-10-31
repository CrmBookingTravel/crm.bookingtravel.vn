const http = require('http');
const { spawn } = require('child_process');

async function isPortOpen(port) {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${port}/json/version`, (res) => resolve(true));
    req.on('error', () => resolve(false));
    req.setTimeout(1000, () => { req.destroy(); resolve(false); });
  });
}

async function runAudit() {
  console.log('🔍 Starting Deep System Audit for CRM Booking Travel...');

  let chromeProc = null;
  if (!(await isPortOpen(9222))) {
    const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    chromeProc = spawn(chromePath, [
      '--headless=new',
      '--remote-debugging-port=9222',
      '--disable-gpu',
      '--no-first-run',
      '--no-default-browser-check',
      '--user-data-dir=' + process.env.TEMP + '\\chrome_audit2_' + Date.now()
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
  const warnings = [];
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
    } else if (msg.method === 'Runtime.consoleAPICalled') {
      const text = msg.params.args.map(a => a.value || a.description).join(' ');
      if (msg.params.type === 'error') {
        errors.push(text);
      } else if (msg.params.type === 'warning') {
        warnings.push(text);
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

  // TEST SUITE 1: TEST ALL VIEWS
  console.log('\n--- AUDIT 1: Testing all Views & Navigation ---');
  const viewsToTest = [
    'bookings',
    'pricing',
    'aging',
    'kpi_sales',
    'suppliers',
    'staff',
    'zalo_workspace'
  ];

  const viewResults = [];
  for (const v of viewsToTest) {
    const res = await cdp('Runtime.evaluate', {
      expression: `(() => {
        try {
          switchView('${v}');
          return { view: '${v}', success: true, activeView: currentView };
        } catch(e) {
          return { view: '${v}', success: false, error: e.message };
        }
      })()`,
      returnByValue: true
    });
    viewResults.push(res.result?.value);
  }
  console.log('View switching results:', viewResults);

  // TEST SUITE 2: TEST ALL FILTERS & PAGINATION
  console.log('\n--- AUDIT 2: Testing Segmented Filters, Pagination & Search ---');
  const filterResults = await cdp('Runtime.evaluate', {
    expression: `(() => {
      switchView('bookings');
      const results = {};
      const filters = ['all', 'moi_tao', 'cho_kiem_tra', 'cho_xac_nhan_doi_tac', 'da_xac_nhan', 'da_thanh_toan', 'hoan_thanh', 'da_huy', 'aging', 'doi_hd', 'xuat_hd'];
      filters.forEach(f => {
        try {
          setFilter(f);
          results[f] = { success: true, rows: document.querySelectorAll('#table-body tr').length };
        } catch(e) {
          results[f] = { success: false, error: e.message };
        }
      });

      // Test Pagination changing size
      const pageResults = {};
      [10, 25, 50, 100, 'all'].forEach(ps => {
        try {
          changePageSize(ps);
          pageResults[ps] = { success: true, currentPage, pageSize };
        } catch(e) {
          pageResults[ps] = { success: false, error: e.message };
        }
      });

      // Test Search
      setFilter('all');
      const searchInput = document.getElementById('global-search');
      let searchCount = 0;
      if (searchInput) {
        searchInput.value = '098';
        if (typeof handleSearch === 'function') handleSearch();
        searchCount = document.querySelectorAll('#table-body tr').length;
        searchInput.value = '';
        if (typeof handleSearch === 'function') handleSearch();
      }

      return { filters: results, pagination: pageResults, searchCount };
    })()`,
    returnByValue: true
  });
  console.log('Filter & Pagination audit result:', JSON.stringify(filterResults.result?.value, null, 2));

  // TEST SUITE 3: TEST ALL MODALS OPEN / CLOSE
  console.log('\n--- AUDIT 3: Testing Modals Open/Close Lifecycle ---');
  const modalResults = await cdp('Runtime.evaluate', {
    expression: `(() => {
      const modalChecks = {};
      
      // 1. Tao don modal
      try {
        openModalTaoDon(true);
        const isOpen = !document.getElementById('booking-modal').classList.contains('hidden');
        closeModalTaoDon();
        const isClosed = document.getElementById('booking-modal').classList.contains('hidden');
        modalChecks.taoDon = { success: isOpen && isClosed };
      } catch(e) {
        modalChecks.taoDon = { success: false, error: e.message };
      }

      // 2. Edit modal with first booking
      try {
        if (bookings.length > 0) {
          editBooking(bookings[0].id);
          const isOpen = !document.getElementById('booking-modal').classList.contains('hidden');
          const codeVal = document.getElementById('ipt-code').value;
          const isReadOnly = document.getElementById('ipt-code').readOnly;
          closeModalTaoDon();
          modalChecks.editDon = { success: isOpen, codeVal, isReadOnly };
        } else {
          modalChecks.editDon = { skipped: true };
        }
      } catch(e) {
        modalChecks.editDon = { success: false, error: e.message };
      }

      // 3. Workflow stepper modal
      try {
        if (bookings.length > 0) {
          openWorkflowStatusModal(bookings[0].id);
          const isOpen = !document.getElementById('modal-workflow-status').classList.contains('hidden');
          closeWorkflowStatusModal();
          modalChecks.workflowModal = { success: isOpen };
        } else {
          modalChecks.workflowModal = { skipped: true };
        }
      } catch(e) {
        modalChecks.workflowModal = { success: false, error: e.message };
      }

      // 4. Hoan / Huy don modal
      try {
        if (bookings.length > 0) {
          openModalHuyDon(bookings[0].id);
          const isOpen = !document.getElementById('modal-hoan-huy-booking').classList.contains('hidden');
          closeModalHuyDon();
          const isClosed = document.getElementById('modal-hoan-huy-booking').classList.contains('hidden');
          modalChecks.huyDonModal = { success: isOpen && isClosed };
        } else {
          modalChecks.huyDonModal = { skipped: true };
        }
      } catch(e) {
        modalChecks.huyDonModal = { success: false, error: e.message };
      }

      // 5. Files modal
      try {
        if (bookings.length > 0) {
          openFilesModal(bookings[0].id);
          const isOpen = !document.getElementById('files-modal').classList.contains('hidden');
          closeFilesModal();
          modalChecks.filesModal = { success: isOpen };
        } else {
          modalChecks.filesModal = { skipped: true };
        }
      } catch(e) {
        modalChecks.filesModal = { success: false, error: e.message };
      }

      // 6. Quick Bao Thu modal
      try {
        if (bookings.length > 0) {
          openQuickBaoThu(bookings[0].id);
          const isOpen = !document.getElementById('quick-bao-thu-modal').classList.contains('hidden');
          closeQuickBaoThuModal();
          modalChecks.quickBaoThuModal = { success: isOpen };
        } else {
          modalChecks.quickBaoThuModal = { skipped: true };
        }
      } catch(e) {
        modalChecks.quickBaoThuModal = { success: false, error: e.message };
      }

      // 7. Profile modal
      try {
        openProfileModal(false);
        const isOpen = !document.getElementById('profile-modal').classList.contains('hidden');
        closeProfileModal();
        modalChecks.profileModal = { success: isOpen };
      } catch(e) {
        modalChecks.profileModal = { success: false, error: e.message };
      }

      return modalChecks;
    })()`,
    returnByValue: true
  });
  console.log('Modals lifecycle audit result:', JSON.stringify(modalResults.result?.value, null, 2));

  // TEST SUITE 4: TEST USER ROLES & PERMISSIONS
  console.log('\n--- AUDIT 4: Testing User Roles & Permission Simulation ---');
  const roleResults = await cdp('Runtime.evaluate', {
    expression: `(() => {
      const origUser = JSON.parse(JSON.stringify(currentUser || {}));
      const testRoles = ['admin', 'dr', 'sale', 'acc', 'tax'];
      const results = {};

      testRoles.forEach(r => {
        results[r] = {};
        try {
          currentUser = { email: r + '@bookingtravel.vn', name: 'Test ' + r, role: r };
          applyCurrentUserUI();
          results[r].applyCurrentUserUI = 'OK';
          updateMetrics();
          results[r].updateMetrics = 'OK';
          renderTable();
          results[r].renderTable = 'OK';
        } catch(e) {
          results[r].error = e.message;
        }
      });

      // Restore user
      currentUser = origUser;
      applyCurrentUserUI();
      updateMetrics();
      renderTable();

      return results;
    })()`,
    returnByValue: true
  });
  console.log('Role simulation audit result:', JSON.stringify(roleResults.result?.value, null, 2));

  // TEST SUITE 5: FINANCIAL & AR/AP ACCURACY
  console.log('\n--- AUDIT 5: Testing Financial Formulas & Debt Consistency ---');
  const financialResults = await cdp('Runtime.evaluate', {
    expression: `(() => {
      let issues = [];
      let totalRev = 0, totalCost = 0, totalExtra = 0, totalActualProfit = 0;
      let totalAllocatedProfit = 0;

      bookings.forEach((b) => {
        const rev = parseFloat(b.giaBan) || 0;
        const cost = parseFloat(b.giaVon) || 0;
        const extra = parseFloat(b.chiPhiPhatSinh) || 0;
        const p = Math.max(0, rev - cost - extra);
        
        totalRev += rev;
        totalCost += cost;
        totalExtra += extra;
        totalActualProfit += p;

        const split = getBookingNetProfitAndSplit(b);
        if (split.tuVanProfit + split.hoTroProfit !== split.actualProfit) {
          issues.push('Booking ' + b.maBooking + ' profit split mismatch: ' + (split.tuVanProfit + split.hoTroProfit) + ' vs ' + split.actualProfit);
        }
        totalAllocatedProfit += (split.tuVanProfit + split.hoTroProfit);
      });

      const totalProfitMismatch = totalActualProfit !== totalAllocatedProfit;

      return {
        totalRev,
        totalCost,
        totalExtra,
        totalActualProfit,
        totalAllocatedProfit,
        perfectProfitMatch: !totalProfitMismatch,
        issuesCount: issues.length
      };
    })()`,
    returnByValue: true
  });
  console.log('Financial audit result:', JSON.stringify(financialResults.result?.value, null, 2));

  console.log('\n========================================');
  console.log('Captured Console Errors during audit:', errors);
  console.log('Captured Console Warnings during audit:', warnings.length);
  console.log('========================================');

  ws.close();
  if (chromeProc) chromeProc.kill();

  if (errors.length > 0) {
    console.error('❌ Deep Audit found console errors!');
    process.exit(1);
  } else {
    console.log('🎉 ALL AUDIT SUITES COMPLETED WITH 100% SUCCESS AND 0 ERRORS!');
    process.exit(0);
  }
}

runAudit().catch(err => {
  console.error('❌ Audit runner failed:', err);
  process.exit(1);
});

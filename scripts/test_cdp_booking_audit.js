const http = require('http');
const { spawn } = require('child_process');
const os = require('os');
const path = require('path');
const fs = require('fs');

function findChromePath() {
  return 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
}

async function run() {
  const tmpProfile = path.join(os.tmpdir(), 'chrome_audit_test_' + Date.now());
  const cdpPort = 9460;
  console.log(`Starting headless Chrome on port ${cdpPort} with clean profile...`);

  const chromeProc = spawn(findChromePath(), [
    `--remote-debugging-port=${cdpPort}`,
    `--user-data-dir=${tmpProfile}`,
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 2000));

  try {
    const listJson = await new Promise((resolve) => {
      http.get(`http://127.0.0.1:${cdpPort}/json/list`, res => {
        let d = ''; res.on('data', c => d += c);
        res.on('end', () => resolve(JSON.parse(d)));
      });
    });

    const page = listJson.find(x => x.type === 'page') || listJson[0];
    console.log(`Found target page: id=${page.id}, type=${page.type}, url=${page.url}`);

    const ws = new WebSocket(page.webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);

    let id = 1;
    function send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const myId = id++;
        const handler = (evt) => {
          const res = JSON.parse(evt.data);
          if (res.id === myId) {
            ws.removeEventListener('message', handler);
            if (res.error) reject(res.error);
            else resolve(res.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: myId, method, params }));
      });
    }

    const consoleErrors = [];
    ws.addEventListener('message', (evt) => {
      const msg = JSON.parse(evt.data);
      if (msg.method === 'Runtime.consoleAPICalled') {
        if (msg.params.type === 'error') {
          consoleErrors.push(msg.params.args.map(a => a.value || a.description).join(' '));
        }
      }
    });

    await send('Runtime.enable');
    await send('Page.enable');

    console.log('Navigating to http://127.0.0.1:3000/CRM_Booking.html ...');
    await send('Page.navigate', { url: 'http://127.0.0.1:3000/CRM_Booking.html' });

    let ready = false;
    for (let i = 0; i < 30; i++) {
      await new Promise(r => setTimeout(r, 400));
      try {
        const check = await send('Runtime.evaluate', {
          expression: `typeof chuyenNhanhTaiKhoan === 'function' && typeof bookings !== 'undefined'`,
          returnByValue: true
        });
        if (check.result && check.result.value === true) {
          ready = true;
          console.log(`Page ready after ${(i + 1) * 400}ms!`);
          break;
        }
      } catch (e) {}
    }

    if (!ready) {
      console.error('Timed out waiting for CRM_Booking.html to initialize');
      return;
    }

    // 0. Đăng nhập Admin
    const loginRes = await send('Runtime.evaluate', {
      expression: `(() => {
        chuyenNhanhTaiKhoan('admin@bookingtravel.vn');
        if (document.getElementById('login-screen')) {
          document.getElementById('login-screen').classList.add('hidden');
        }
        return {
          user: currentUser ? currentUser.name + ' (' + currentUser.email + ')' : null,
          role: currentUser ? currentUser.role : null,
          totalBookings: bookings.length
        };
      })()`,
      returnByValue: true
    });
    console.log('0. Login Admin Result:', loginRes.result?.value);

    // 1. Kiểm tra đơn DH1793102194850 trên bảng
    const checkRowRes = await send('Runtime.evaluate', {
      expression: `(() => {
        const row = Array.from(document.querySelectorAll('#table-body tr')).find(r => r.innerText.includes('DH1793102194850'));
        if (!row) return { found: false };
        const hasHistoryBadge = row.innerText.includes('lần sửa');
        const b = bookings.find(x => x.id === 'DH1793102194850');
        return {
          found: true,
          code: b ? b.maBooking : null,
          customer: b ? b.khachHang : null,
          hasHistoryBadge: hasHistoryBadge,
          historyCount: b && b.editHistory ? b.editHistory.length : 0,
          rowSnippet: row.innerText.replace(/\\s+/g, ' ').substring(0, 160)
        };
      })()`,
      returnByValue: true
    });
    console.log('1. Check Row DH1793102194850 in Table:', checkRowRes.result?.value);

    // 2. Mở modal xem nhanh lịch sử
    const openHistoryRes = await send('Runtime.evaluate', {
      expression: `(() => {
        openBookingHistoryModal('DH1793102194850');
        const modal = document.getElementById('modal-booking-history');
        const title = document.getElementById('history-modal-title')?.innerText;
        const sub = document.getElementById('history-modal-sub')?.innerText;
        const bodyText = document.getElementById('history-modal-body')?.innerText.replace(/\\s+/g, ' ');
        const isVisible = !modal.classList.contains('hidden');
        closeBookingHistoryModal();
        return {
          isVisible,
          title,
          sub,
          bodySnippet: bodyText?.substring(0, 220)
        };
      })()`,
      returnByValue: true
    });
    console.log('2. Check History Modal Popup:', openHistoryRes.result?.value);

    // 3. Mở modal sửa đơn DH1793102194850: Kiểm tra mã đơn bị KHÓA CỨNG
    const editCheckRes = await send('Runtime.evaluate', {
      expression: `(() => {
        editBooking('DH1793102194850');
        const iptCode = document.getElementById('ipt-code');
        const badgeLocked = document.getElementById('badge-code-locked');
        const auditWrapper = document.getElementById('booking-audit-wrapper');
        const auditCount = document.getElementById('booking-audit-count')?.innerText;
        
        return {
          codeVal: iptCode.value,
          isReadOnly: iptCode.readOnly,
          badgeLockedVisible: !badgeLocked.classList.contains('hidden'),
          auditWrapperVisible: !auditWrapper.classList.contains('hidden'),
          auditCount: auditCount
        };
      })()`,
      returnByValue: true
    });
    console.log('3. Edit Mode Lock & Audit UI Check:', editCheckRes.result?.value);

    // 4. Thử cố tình sửa ipt-code bằng script xem hệ thống có bảo vệ không
    const saveRes = await send('Runtime.evaluate', {
      expression: `(() => {
        // Cố tình sửa ipt-code bằng script
        document.getElementById('ipt-code').value = 'HACKED_CODE_999';
        // Sửa thông tin hợp lệ: Đổi khách hàng và giá bán
        document.getElementById('ipt-customer').value = 'CHỊ ĐẶNG THÙY TRANG (ĐÃ DUYỆT VIP)';
        document.getElementById('ipt-revenue').value = '5.000.000';
        
        // Gọi hàm lưu
        handleSaveBooking({ preventDefault: () => {} });
        
        // Tìm lại đơn trong bookings
        const b = bookings.find(x => x.id === 'DH1793102194850');
        return {
          savedMaBooking: b ? b.maBooking : null,
          codeTamperBlocked: b && b.maBooking === 'DH1793102194850',
          savedCustomer: b ? b.khachHang : null,
          savedRevenue: b ? b.giaBan : null,
          totalHistoryCount: b && b.editHistory ? b.editHistory.length : 0,
          latestRevisionAuthor: b && b.editHistory && b.editHistory[0] ? b.editHistory[0].userName : null,
          latestChanges: b && b.editHistory && b.editHistory[0] ? b.editHistory[0].changes : []
        };
      })()`,
      returnByValue: true
    });
    console.log('4. Save & Protection & Audit Trail Log:', saveRes.result?.value);

    // 5. Kiểm tra mở modal Tạo đơn mới: mã đơn phải MỞ KHÓA
    const newBookingRes = await send('Runtime.evaluate', {
      expression: `(() => {
        openModalTaoDon(true); // force full
        const iptCode = document.getElementById('ipt-code');
        const badgeLocked = document.getElementById('badge-code-locked');
        const auditWrapper = document.getElementById('booking-audit-wrapper');
        closeModalTaoDon();
        return {
          newCodeGenerated: iptCode.value,
          isReadOnly: iptCode.readOnly,
          badgeLockedHidden: badgeLocked.classList.contains('hidden'),
          auditWrapperHidden: auditWrapper.classList.contains('hidden')
        };
      })()`,
      returnByValue: true
    });
    console.log('5. New Booking Modal Unlock Check:', newBookingRes.result?.value);

    console.log('\n--- Console Errors ---');
    console.log(`Total errors: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      consoleErrors.forEach(e => console.error('Error:', e));
    }

    ws.close();
  } finally {
    chromeProc.kill();
    try {
      fs.rmSync(tmpProfile, { recursive: true, force: true });
    } catch(e) {}
  }
}

run().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});

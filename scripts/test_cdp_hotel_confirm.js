const http = require('http');
const { spawn } = require('child_process');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function run() {
  const chromeProcess = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9226',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1200));

  http.get('http://127.0.0.1:9226/json', (res) => {
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
        console.log('Connected to Chrome CDP WebSocket for Hotel Confirm Modal & 1-5 Files Test');
        await send('Page.enable');
        await send('Runtime.enable');

        await send('Page.navigate', { url: 'http://localhost:3000/CRM_Booking.html' });
        await new Promise(r => setTimeout(r, 2500));

        // Evaluate in browser context
        const testScript = `
          (() => {
            const results = {};

            // Mock dialogs
            window.confirm = () => true;
            window.alert = () => true;

            const firstBooking = bookings[0];
            results.bookingId = firstBooking.id;
            results.initialRoomCode = firstBooking.codePhong || '';

            // 1. Open Hotel Confirm Modal
            openHotelConfirmModal(firstBooking.id);
            const modalEl = document.getElementById('hotel-confirm-modal');
            const codeInput = document.getElementById('hcm-room-code');
            const noteInput = document.getElementById('hcm-note');
            const counterEl = document.getElementById('hcm-counter');
            const containerEl = document.getElementById('hcm-files-container');
            const dropzoneEl = document.getElementById('hcm-dropzone');

            results.modalIsOpen = modalEl && !modalEl.classList.contains('hidden');
            results.hasCodeInput = !!codeInput;
            results.hasNoteInput = !!noteInput;
            results.initialCounter = counterEl ? counterEl.innerText : null;

            // 2. Set Room code & Note
            codeInput.value = 'CONFIRM-FLC-2026';
            noteInput.value = 'Đã nhận mail xác nhận từ resort FLC Sầm Sơn, bao gồm ăn sáng buffet';

            // 3. Simulate adding 3 files
            const sampleFiles = [
              { id: 'HCM-1', name: 'Email_XacNhan_FLC_SamSon.png', size: 120000, type: 'image/png', url: 'data:image/png;base64,sample1', time: '09:15 31/10/2026' },
              { id: 'HCM-2', name: 'Confirmation_Voucher_Resort.pdf', size: 230000, type: 'application/pdf', url: 'data:application/pdf;base64,sample2', time: '09:20 31/10/2026' },
              { id: 'HCM-3', name: 'DanhSachPhong_Confirm.jpg', size: 95000, type: 'image/jpeg', url: 'data:image/jpeg;base64,sample3', time: '09:30 31/10/2026' }
            ];

            sampleFiles.forEach(f => currentHcmFiles.push(f));
            renderHcmFilesList();

            results.after3FilesCounter = counterEl ? counterEl.innerText : null;
            results.filesInArrayAfter3 = currentHcmFiles.length;

            // 4. Add 2 more files to reach limit 5
            currentHcmFiles.push({ id: 'HCM-4', name: 'ThanhToan_Coc_KS.jpg', size: 80000, type: 'image/jpeg', url: 'data:image/jpeg;base64,sample4', time: '10:00 31/10/2026' });
            currentHcmFiles.push({ id: 'HCM-5', name: 'ChinhSach_NhanPhong.jpg', size: 85000, type: 'image/jpeg', url: 'data:image/jpeg;base64,sample5', time: '10:05 31/10/2026' });
            renderHcmFilesList();

            results.after5FilesCounter = counterEl ? counterEl.innerText : null;
            results.dropzoneHasDisabledClass = dropzoneEl.classList.contains('opacity-50');

            // 5. Delete 1 file (e.g. index 1)
            deleteHcmFile(1);
            results.afterDeleteCounter = counterEl ? counterEl.innerText : null;
            results.filesInArrayAfterDelete = currentHcmFiles.length;
            results.dropzoneReEnabled = !dropzoneEl.classList.contains('opacity-50');

            // 6. Submit the form
            const fakeEvent = { preventDefault: () => {} };
            handleHotelConfirmSubmit(fakeEvent);

            results.modalIsClosedAfterSubmit = modalEl.classList.contains('hidden');

            // 7. Verify booking state after submit
            const updatedBooking = bookings.find(x => x.id === firstBooking.id);
            results.savedRoomCode = updatedBooking.codePhong;
            results.savedNote = updatedBooking.hotelConfirmNote;
            results.savedFilesCount = (updatedBooking.hotelConfirmFiles || []).length;
            results.savedInAllFiles = (updatedBooking.files || []).filter(f => f.name.includes('[Confirm KS]')).length;

            // 8. Verify Table UI shows the updated code & badges
            const tableHtml = document.getElementById('table-body')?.innerHTML || '';
            const mobileHtml = document.getElementById('mobile-cards-container')?.innerHTML || '';
            results.uiHasNewCode = tableHtml.includes('CONFIRM-FLC-2026') || mobileHtml.includes('CONFIRM-FLC-2026');
            results.uiHasConfirmKsBadge = tableHtml.includes('Confirm KS') || mobileHtml.includes('Confirm KS');

            return results;
          })()
        `;

        const resEval = await send('Runtime.evaluate', {
          expression: testScript,
          returnByValue: true
        });

        console.log('\n--- HOTEL CONFIRM TEST RESULTS ---');
        console.log(JSON.stringify(resEval.result?.value, null, 2));

        const r = resEval.result?.value || {};
        let passed = true;

        if (!r.modalIsOpen) { console.error('FAIL: modal was not opened'); passed = false; }
        if (!r.hasCodeInput) { console.error('FAIL: code input missing'); passed = false; }
        if (r.after3FilesCounter !== '3 / 5 file') { console.error('FAIL: counter after 3 files incorrect'); passed = false; }
        if (r.after5FilesCounter !== '5 / 5 file') { console.error('FAIL: counter after 5 files incorrect'); passed = false; }
        if (!r.dropzoneHasDisabledClass) { console.error('FAIL: dropzone did not lock at 5 files'); passed = false; }
        if (r.filesInArrayAfterDelete !== 4) { console.error('FAIL: file deletion failed'); passed = false; }
        if (r.afterDeleteCounter !== '4 / 5 file') { console.error('FAIL: counter after delete incorrect'); passed = false; }
        if (!r.modalIsClosedAfterSubmit) { console.error('FAIL: modal did not close on submit'); passed = false; }
        if (r.savedRoomCode !== 'CONFIRM-FLC-2026') { console.error('FAIL: room code not saved'); passed = false; }
        if (r.savedFilesCount !== 4) { console.error('FAIL: files count not saved'); passed = false; }
        if (!r.uiHasNewCode) { console.error('FAIL: UI table body does not display new code'); passed = false; }
        if (!r.uiHasConfirmKsBadge) { console.error('FAIL: UI table body does not display Confirm KS badge'); passed = false; }

        if (consoleErrors.length > 0) {
          console.error('\nConsole errors detected:', consoleErrors);
          passed = false;
        }

        if (passed) {
          console.log('\n>>> ALL HOTEL CONFIRM 1-5 FILES AUTOMATED TESTS PASSED 100%! <<<\n');
        } else {
          console.error('\n>>> SOME TESTS FAILED! <<<\n');
        }

        ws.close();
        chromeProcess.kill();
        process.exit(passed ? 0 : 1);
      };
    });
  });
}

run().catch(err => {
  console.error('Test script error:', err);
  process.exit(1);
});

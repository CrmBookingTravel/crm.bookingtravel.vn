const http = require('http');
const { spawn } = require('child_process');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function run() {
  const chromeProcess = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9225',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1200));

  http.get('http://127.0.0.1:9225/json', (res) => {
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
        console.log('Connected to Chrome CDP WebSocket for UNC Upload Test');
        await send('Page.enable');
        await send('Runtime.enable');

        await send('Page.navigate', { url: 'http://localhost:3000/CRM_Booking.html' });
        await new Promise(r => setTimeout(r, 2500));

        // Evaluate expression in browser context
        const testScript = `
          (() => {
            const results = {};

            // Mock dialogs for automated headless test
            window.confirm = () => true;
            window.alert = () => true;

            const firstBooking = bookings[0];
            results.bookingId = firstBooking.id;

            // 1. Open Quick Bao Thu Modal
            openQuickBaoThu(firstBooking.id);
            const dropzone = document.getElementById('qbt-unc-dropzone');
            const counterEl = document.getElementById('qbt-unc-counter');
            const containerEl = document.getElementById('qbt-unc-files-container');

            results.hasDropzone = !!dropzone;
            results.initialCounter = counterEl ? counterEl.innerText : null;

            // 2. Simulate uploading 3 UNC files
            const sampleFiles = [
              { id: 'UNC-1', name: 'Bill_Coc_Dot1_400k.jpg', size: 102400, url: 'data:image/jpeg;base64,sample1', time: '10:00 31/10/2026', amount: 400000 },
              { id: 'UNC-2', name: 'UNC_Dot2_Techcombank_200k.png', size: 153600, url: 'data:image/png;base64,sample2', time: '14:30 31/10/2026', amount: 200000 },
              { id: 'UNC-3', name: 'Bill_TatToan_Dot3_200k.jpg', size: 204800, url: 'data:image/jpeg;base64,sample3', time: '16:00 31/10/2026', amount: 200000 }
            ];

            sampleFiles.forEach(f => currentQbtUncFiles.push(f));
            renderQbtUncFilesList();

            results.after3FilesCounter = counterEl ? counterEl.innerText : null;
            results.renderedItemsCount = containerEl ? containerEl.querySelectorAll('.flex.items-center.justify-between').length : 0;

            // 3. Test reaching max 5 files
            currentQbtUncFiles.push({ id: 'UNC-4', name: 'UNC_BoSung_Dot4.pdf', size: 98000, url: 'data:application/pdf;base64,sample4', time: '17:00 31/10/2026' });
            currentQbtUncFiles.push({ id: 'UNC-5', name: 'UNC_BoSung_Dot5.jpg', size: 120000, url: 'data:image/jpeg;base64,sample5', time: '18:00 31/10/2026' });
            renderQbtUncFilesList();

            results.after5FilesCounter = counterEl ? counterEl.innerText : null;
            results.dropzoneDisabledWhen5 = dropzone ? dropzone.classList.contains('pointer-events-none') : false;

            // 4. Test delete 1 file
            deleteQbtUncFile(4);
            results.afterDeleteCounter = counterEl ? counterEl.innerText : null;
            results.dropzoneReEnabled = dropzone ? !dropzone.classList.contains('pointer-events-none') : false;

            // 5. Test submit and save to booking
            const fakeEvent = { preventDefault: () => {} };
            document.getElementById('qbt-amount').value = '200.000';
            
            // Mock alert to prevent modal blocking in headless
            window.alert = () => {};
            handleQuickBaoThuSubmit(fakeEvent);

            results.savedUncCountInBooking = firstBooking.uncFiles ? firstBooking.uncFiles.length : 0;

            // 6. Test open lightbox modal
            openUncViewerModal(sampleFiles[0].url, sampleFiles[0].name, sampleFiles[0].time);
            const viewerModal = document.getElementById('modal-view-unc-image');
            const viewerImg = document.getElementById('unc-viewer-img');
            results.viewerModalVisible = viewerModal ? !viewerModal.classList.contains('hidden') : false;
            results.viewerImgSrc = viewerImg ? viewerImg.src : null;
            closeUncImageViewModal();
            results.viewerModalClosed = viewerModal ? viewerModal.classList.contains('hidden') : false;

            return results;
          })()
        `;

        const evalRes = await send('Runtime.evaluate', { expression: testScript, returnByValue: true });
        console.log('UNC Test Evaluation Results:', JSON.stringify(evalRes.result?.value, null, 2));

        const val = evalRes.result?.value;
        let testPassed = true;

        if (consoleErrors.length > 0) {
          console.warn('Console warnings/errors encountered:', consoleErrors);
        }

        // Validate presence
        if (val?.hasDropzone && val?.initialCounter) {
          console.log('[PASS] Modal Báo Thu có đầy đủ giao diện tải lên Ủy Nhiệm Chi và bộ đếm!');
        } else {
          console.error('[FAIL] Thiếu giao diện UNC!', val);
          testPassed = false;
        }

        // Validate 3 files
        if (val?.after3FilesCounter?.includes('3 / 5') && val?.renderedItemsCount === 3) {
          console.log('[PASS] Đã đính kèm và hiển thị 3 file Ủy nhiệm chi với đầy đủ thông tin Lần 1, Lần 2, Lần 3!');
        } else {
          console.error('[FAIL] Không hiển thị đúng 3 file UNC!', val);
          testPassed = false;
        }

        // Validate max 5 files restriction
        if (val?.after5FilesCounter?.includes('5 / 5') && val?.dropzoneDisabledWhen5) {
          console.log('[PASS] Đạt tối đa 5 file: Hệ thống tự động vô hiệu hóa vùng tải để ngăn vượt quá 5 file!');
        } else {
          console.error('[FAIL] Không khóa tải lên khi đủ 5 file!', val);
          testPassed = false;
        }

        // Validate delete & re-enable
        if (val?.afterDeleteCounter?.includes('4 / 5') && val?.dropzoneReEnabled) {
          console.log('[PASS] Xóa file thành công: Bộ đếm giảm về 4/5 và mở lại quyền tải file!');
        } else {
          console.error('[FAIL] Xóa file UNC thất bại!', val);
          testPassed = false;
        }

        // Validate save to booking
        if (val?.savedUncCountInBooking === 4) {
          console.log('[PASS] Xác nhận thu tiền: Đã lưu trữ toàn vẹn 4 file Ủy nhiệm chi vào đơn hàng!');
        } else {
          console.error('[FAIL] Lưu UNC vào đơn hàng thất bại!', val);
          testPassed = false;
        }

        // Validate viewer modal
        if (val?.viewerModalVisible && val?.viewerImgSrc && val?.viewerModalClosed) {
          console.log('[PASS] Modal phóng to và xem chi tiết ảnh Ủy nhiệm chi hoạt động hoàn hảo!');
        } else {
          console.error('[FAIL] Modal xem ảnh UNC thất bại!', val);
          testPassed = false;
        }

        ws.close();
        chromeProcess.kill();

        if (testPassed) {
          console.log('\n🎉 ALL UNC (UY NHIEM CHI) TESTS PASSED 100%!');
          process.exit(0);
        } else {
          console.error('\n❌ SOME UNC TESTS FAILED!');
          process.exit(1);
        }
      };
    });
  });
}

run();

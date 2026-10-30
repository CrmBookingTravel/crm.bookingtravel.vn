// =========================================================================
// MÃ NGUỒN NODE.JS GỌI ĐẾN GOOGLE APPS SCRIPT WEB APP
// Không cần Google Cloud Console, không cần Service Account JSON key!
// =========================================================================

// Dán URL Web App bạn nhận được sau khi bấm "Triển khai" vào đây:
const WEB_APP_URL = 'DIEN_URL_WEB_APP_CUA_BAN_VAO_DAY';

/**
 * Đọc tất cả dữ liệu từ Sheet
 */
async function readData() {
  if (WEB_APP_URL === 'DIEN_URL_WEB_APP_CUA_BAN_VAO_DAY') {
    console.log('👉 Vui lòng dán WEB_APP_URL vào dòng 6 của file apps-script-client.js trước.');
    return;
  }

  try {
    const res = await fetch(WEB_APP_URL, {
      method: 'GET',
      redirect: 'follow',
    });
    const result = await res.json();
    if (result.success) {
      console.log('✅ Đọc dữ liệu thành công:');
      console.table(result.data);
      return result.data;
    } else {
      console.error('❌ Lỗi:', result.error);
    }
  } catch (error) {
    console.error('❌ Lỗi kết nối:', error.message);
  }
}

/**
 * Thêm dòng mới vào Sheet
 * @param {Array<any>} rowData - Mảng chứa dữ liệu dòng mới
 */
async function appendData(rowData) {
  if (WEB_APP_URL === 'DIEN_URL_WEB_APP_CUA_BAN_VAO_DAY') {
    console.log('👉 Vui lòng dán WEB_APP_URL vào dòng 6 của file apps-script-client.js trước.');
    return;
  }

  try {
    const res = await fetch(WEB_APP_URL, {
      method: 'POST',
      redirect: 'follow',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8',
      },
      body: JSON.stringify({
        action: 'append',
        row: rowData,
      }),
    });
    const result = await res.json();
    if (result.success) {
      console.log('✅ Thêm dòng thành công!');
    } else {
      console.error('❌ Lỗi:', result.error || result.message);
    }
  } catch (error) {
    console.error('❌ Lỗi kết nối:', error.message);
  }
}

// Chạy thử nghiệm
async function main() {
  console.log('--- Đọc dữ liệu hiện tại ---');
  await readData();

  console.log('\n--- Thêm 1 dòng mới vào Sheet ---');
  await appendData([
    'Nguyễn Văn A',
    '0912345678',
    'Tour Nha Trang 4N3Đ',
    new Date().toLocaleString('vi-VN'),
  ]);
}

if (require.main === module) {
  main();
}

module.exports = {
  readData,
  appendData,
};

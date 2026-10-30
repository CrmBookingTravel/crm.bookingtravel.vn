const path = require('path');
const fs = require('fs');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const USER_DATA_DIR = path.join(__dirname, 'zalo_profile');

let browserInstance = null;
let pageInstance = null;
let isBroadcasting = false;
let broadcastLogs = [];

/**
 * Khởi động hoặc lấy phiên trình duyệt Chrome điều khiển Zalo
 */
async function getBrowser() {
  if (browserInstance && browserInstance.isConnected()) {
    return { browser: browserInstance, page: pageInstance };
  }

  const puppeteer = await import('puppeteer-core');

  if (!fs.existsSync(USER_DATA_DIR)) {
    fs.mkdirSync(USER_DATA_DIR, { recursive: true });
  }

  browserInstance = await puppeteer.default.launch({
    executablePath: CHROME_PATH,
    userDataDir: USER_DATA_DIR,
    headless: false, // Để người dùng thấy nếu cần
    defaultViewport: null,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-notifications',
      '--disable-blink-features=AutomationControlled'
    ]
  });

  const pages = await browserInstance.pages();
  pageInstance = pages.length > 0 ? pages[0] : await browserInstance.newPage();

  return { browser: browserInstance, page: pageInstance };
}

/**
 * Chụp ảnh mã QR từ Zalo Web và lưu vào thư mục public để hiển thị trực tiếp trên web
 */
async function getQRCode() {
  try {
    const { page } = await getBrowser();
    const currentUrl = page.url();

    if (!currentUrl.includes('chat.zalo.me')) {
      await page.goto('https://chat.zalo.me', { waitUntil: 'networkidle2', timeout: 30000 });
    }

    await new Promise(r => setTimeout(r, 2000));

    // Kiểm tra nếu đã đăng nhập rồi
    const searchInput = await page.$('#contact-search-input');
    if (searchInput) {
      return { isLoggedIn: true, message: 'Đã đăng nhập thành công' };
    }

    // Tìm vùng chứa mã QR (.qr-container)
    const qrContainer = await page.$('.qr-container, .qrcode-img, canvas, .login-box');
    if (qrContainer) {
      const qrPath = path.join(__dirname, 'public', 'qr_code.png');
      await qrContainer.screenshot({ path: qrPath });
      return {
        isLoggedIn: false,
        qrImage: '/qr_code.png?t=' + Date.now(),
        message: 'Đã tải mã QR thành công'
      };
    }

    // Nếu không tìm thấy element cụ thể, chụp toàn bộ màn hình login
    const fullScreenPath = path.join(__dirname, 'public', 'qr_code.png');
    await page.screenshot({ path: fullScreenPath });
    return {
      isLoggedIn: false,
      qrImage: '/qr_code.png?t=' + Date.now(),
      message: 'Đã chụp màn hình đăng nhập'
    };
  } catch (error) {
    console.error('Lỗi khi lấy mã QR:', error.message);
    return { isLoggedIn: false, error: error.message };
  }
}

/**
 * Kiểm tra trạng thái đăng nhập của Zalo
 */
async function checkLoginStatus() {
  try {
    const { page } = await getBrowser();
    const currentUrl = page.url();
    if (!currentUrl.includes('chat.zalo.me')) {
      await page.goto('https://chat.zalo.me', { waitUntil: 'networkidle2', timeout: 30000 });
    }

    await new Promise(r => setTimeout(r, 1000));

    const searchInput = await page.$('#contact-search-input');
    const isLoggedIn = !!searchInput;

    return {
      isLoggedIn,
      message: isLoggedIn ? 'Đã đăng nhập Zalo thành công' : 'Chưa đăng nhập. Vui lòng quét mã QR.'
    };
  } catch (error) {
    return { isLoggedIn: false, error: error.message };
  }
}

/**
 * Gửi tin nhắn vào một nhóm Zalo
 */
async function sendToGroup(group, message) {
  const { page } = await getBrowser();
  const groupName = group.name || 'Nhóm Zalo';
  const groupLink = group.link;

  try {
    let opened = false;

    // 1. Thử mở qua link tham gia nhóm
    if (groupLink && groupLink.startsWith('http')) {
      console.log(`🔗 Đang mở nhóm qua link: ${groupLink} (${groupName})...`);
      await page.goto(groupLink, { waitUntil: 'domcontentloaded', timeout: 20000 });
      await new Promise(r => setTimeout(r, 2500));

      const webButtons = await page.$$('a, button');
      for (const btn of webButtons) {
        const text = await page.evaluate(el => el.innerText || '', btn);
        if (text.includes('trên web') || text.includes('Mở web') || text.includes('Vào nhóm')) {
          await btn.click();
          opened = true;
          await new Promise(r => setTimeout(r, 2500));
          break;
        }
      }
    }

    // 2. Tìm kiếm qua thanh Search nếu cần
    if (!opened || !page.url().includes('chat.zalo.me')) {
      if (!page.url().includes('chat.zalo.me')) {
        await page.goto('https://chat.zalo.me', { waitUntil: 'networkidle2' });
      }

      const searchSelector = '#contact-search-input';
      await page.waitForSelector(searchSelector, { timeout: 15000 });
      
      await page.click(searchSelector, { clickCount: 3 });
      await page.keyboard.press('Backspace');
      await new Promise(r => setTimeout(r, 400));

      await page.type(searchSelector, groupName, { delay: 40 });
      await new Promise(r => setTimeout(r, 1500));

      await page.keyboard.press('ArrowDown');
      await new Promise(r => setTimeout(r, 400));
      await page.keyboard.press('Enter');
      await new Promise(r => setTimeout(r, 2000));
    }

    // 3. Tìm khung soạn tin nhắn
    const inputSelector = '#richInput, div[contenteditable="true"], .rich-input';
    await page.waitForSelector(inputSelector, { timeout: 10000 });
    await page.click(inputSelector);
    await new Promise(r => setTimeout(r, 500));

    // Điền tin nhắn giữ định dạng xuống dòng
    const lines = message.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].length > 0) {
        await page.keyboard.type(lines[i], { delay: 10 });
      }
      if (i < lines.length - 1) {
        await page.keyboard.down('Shift');
        await page.keyboard.press('Enter');
        await page.keyboard.up('Shift');
      }
    }

    await new Promise(r => setTimeout(r, 800));

    // Nhấn Enter gửi tin
    await page.keyboard.press('Enter');
    await new Promise(r => setTimeout(r, 1500));

    return { success: true, groupName };
  } catch (err) {
    console.error(`❌ Lỗi khi gửi tới nhóm "${groupName}":`, err.message);
    return { success: false, groupName, error: err.message };
  }
}

/**
 * Phát tin đồng loạt tới danh sách nhóm
 */
async function startBroadcast(groups, message, onProgressCallback) {
  if (isBroadcasting) {
    throw new Error('Đang có một tiến trình phát tin đang chạy. Vui lòng đợi hoàn tất!');
  }

  isBroadcasting = true;
  broadcastLogs = [];

  try {
    const status = await checkLoginStatus();
    if (!status.isLoggedIn) {
      throw new Error('Chưa đăng nhập Zalo. Hãy bấm "Xem Mã QR Zalo" để quét mã trước!');
    }

    const enabledGroups = groups.filter(g => g.enabled && (g.link || g.name));
    const total = enabledGroups.length;

    for (let i = 0; i < total; i++) {
      const g = enabledGroups[i];
      const logEntry = {
        index: i + 1,
        total,
        groupName: g.name,
        link: g.link,
        time: new Date().toLocaleTimeString('vi-VN'),
        status: 'sending'
      };

      if (onProgressCallback) onProgressCallback(logEntry);

      const result = await sendToGroup(g, message);
      logEntry.status = result.success ? 'success' : 'failed';
      logEntry.error = result.error;
      broadcastLogs.push(logEntry);

      if (onProgressCallback) onProgressCallback(logEntry);

      // Nghỉ an toàn ngẫu nhiên 5 - 10 giây giữa các nhóm
      if (i < total - 1) {
        const delayMs = Math.floor(Math.random() * 5000) + 5000;
        console.log(`⏳ Nghỉ an toàn ${(delayMs / 1000).toFixed(1)}s trước khi gửi nhóm tiếp theo...`);
        await new Promise(r => setTimeout(r, delayMs));
      }
    }

    return { success: true, logs: broadcastLogs };
  } finally {
    isBroadcasting = false;
  }
}

function getBroadcastStatus() {
  return {
    isBroadcasting,
    logs: broadcastLogs
  };
}

module.exports = {
  getQRCode,
  checkLoginStatus,
  sendToGroup,
  startBroadcast,
  getBroadcastStatus
};

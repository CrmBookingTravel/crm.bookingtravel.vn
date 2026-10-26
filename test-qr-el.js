const path = require('path');
const fs = require('fs');

async function test() {
  const { default: puppeteer } = await import('puppeteer-core');
  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    userDataDir: path.join(__dirname, 'zalo_profile'),
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  const page = await browser.newPage();
  await page.goto('https://chat.zalo.me', { waitUntil: 'networkidle2', timeout: 30000 });
  await new Promise(r => setTimeout(r, 2000));
  
  // Find QR code image or container
  const selectors = ['.qrcode-img', 'img[src*="qr"]', '.login-box', '#app', '.qr-container'];
  for (const s of selectors) {
    const el = await page.$(s);
    console.log(s, '->', !!el);
    if (el && (s.includes('qr') || s.includes('img'))) {
      await el.screenshot({ path: path.join(__dirname, 'public', 'qr_code.png') });
      console.log('Saved element screenshot for selector:', s);
      break;
    }
  }

  await browser.close();
}

test().catch(e => console.error(e));

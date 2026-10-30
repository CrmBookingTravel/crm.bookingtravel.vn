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
  console.log('Navigating to chat.zalo.me...');
  await page.goto('https://chat.zalo.me', { waitUntil: 'networkidle2', timeout: 30000 });
  
  await new Promise(r => setTimeout(r, 3000));
  
  await page.screenshot({ path: path.join(__dirname, 'public', 'qr_screen.png') });
  console.log('Saved screenshot to public/qr_screen.png');
  
  await browser.close();
}

test().catch(e => console.error(e));

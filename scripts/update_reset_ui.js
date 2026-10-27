const fs = require('fs');
const path = require('path');

const crmPath = path.join(__dirname, '..', 'crm.html');
let html = fs.readFileSync(crmPath, 'utf8');

const targetStr = `filterHotelsByStar('all');`;
const replacementStr = `filterHotelsByStar('all');
      const alertBox = document.getElementById('room-autofill-alert');
      if (alertBox) alertBox.classList.add('hidden');
      const quickResults = document.getElementById('room-quick-results');
      if (quickResults) { quickResults.innerHTML = ''; quickResults.classList.add('hidden'); }
      const pricePreview = document.getElementById('room-price-preview');
      if (pricePreview) pricePreview.innerText = '';`;

if (html.includes(targetStr)) {
  html = html.replace(targetStr, replacementStr);
  console.log('Added clean reset to openModalTaoDon');
}

fs.writeFileSync(crmPath, html, 'utf8');
console.log('Saved crm.html');

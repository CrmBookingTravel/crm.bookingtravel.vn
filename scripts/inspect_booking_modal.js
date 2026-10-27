const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'crm.html'), 'utf8');

const pModal = html.indexOf('id="booking-modal"');
const pForm = html.indexOf('<form id="booking-form"', pModal);
const endForm = html.indexOf('</form>', pForm);

console.log('Form length:', endForm - pForm);
const formContent = html.substring(pForm, endForm);
const sections = formContent.split('<!-- ========================================================================= -->');
console.log('Number of sections in form:', sections.length);
sections.forEach((sec, idx) => {
  const firstLine = sec.trim().split('\n')[0];
  console.log(`Section ${idx}: ${firstLine.substring(0, 100)} (Length: ${sec.length})`);
});

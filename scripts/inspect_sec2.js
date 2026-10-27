const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'crm.html'), 'utf8');

const p = html.indexOf('function openModalTaoDon()');
console.log(html.substring(p, p + 1200));

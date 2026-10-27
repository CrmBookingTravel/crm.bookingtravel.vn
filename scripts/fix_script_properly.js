const fs = require('fs');
const path = require('path');

const crmPath = path.join(__dirname, '..', 'crm.html');
let content = fs.readFileSync(crmPath, 'utf8');

content = content.replace(
  '<script src="https://cdn.tailwindcss.com"></script>',
  '\' + \'<script src="https://cdn.tailwindcss.com"><\\/script>\' + \''
);

fs.writeFileSync(crmPath, content, 'utf8');
console.log('Fixed literal script tag!');

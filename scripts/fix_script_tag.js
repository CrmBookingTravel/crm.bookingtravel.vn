const fs = require('fs');
const path = require('path');

const crmPath = path.join(__dirname, '..', 'crm.html');
let content = fs.readFileSync(crmPath, 'utf8');

// Replace the literal </script> with broken string
content = content.replace(
  '<script src="https://cdn.tailwindcss.com"></script>',
  '<scr\' + \'ipt src="https://cdn.tailwindcss.com"></scr\' + \'ipt>'
);

fs.writeFileSync(crmPath, content, 'utf8');
console.log('Fixed script tag!');

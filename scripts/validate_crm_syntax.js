const fs = require('fs');
const html = fs.readFileSync('CRM_Booking.html', 'utf8');

const regex = /<script(?![^>]*src=)(?![^>]*application\/ld\+json)([\s\S]*?)<\/script>/gi;
let match;
let count = 0;
let hasError = false;

while ((match = regex.exec(html)) !== null) {
  count++;
  const fullTag = match[0];
  const tagOpenEnd = fullTag.indexOf('>');
  const jsCode = fullTag.substring(tagOpenEnd + 1, fullTag.length - 9);
  
  try {
    new Function(jsCode);
    console.log(`Script block ${count} parsed OK! (${jsCode.length} chars)`);
  } catch (e) {
    hasError = true;
    console.error(`Syntax error in script block ${count}:`, e.message);
  }
}

if (!hasError) {
  console.log(`\nALL ${count} script blocks in CRM_Booking.html parsed with 0 syntax errors!`);
} else {
  process.exit(1);
}

const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'crm.html');
const content = fs.readFileSync(filePath, 'utf8');

console.log('Validating crm.html syntax and integrity...');
console.log('File size:', content.length, 'bytes');

const scriptRegex = /<script\b([^>]*)>([\s\S]*?)<\/script>/gi;
let match;
let scriptIdx = 0;
let errors = 0;

while ((match = scriptRegex.exec(content)) !== null) {
  scriptIdx++;
  const attrs = match[1];
  const scriptContent = match[2];

  if (attrs.includes('application/ld+json')) {
    try {
      JSON.parse(scriptContent);
      console.log(`[Script #${scriptIdx} - JSON-LD Schema]: VALID JSON`);
    } catch (e) {
      console.error(`[Script #${scriptIdx} - JSON-LD Schema]: JSON SYNTAX ERROR:`, e.message);
      errors++;
    }
  } else if (!attrs.includes('src=')) {
    try {
      new Function(scriptContent);
      console.log(`[Script #${scriptIdx} - Inline JS (${scriptContent.length} chars)]: SYNTAX OK`);
    } catch (e) {
      console.error(`[Script #${scriptIdx} - Inline JS]: JAVASCRIPT SYNTAX ERROR:`, e.message);
      errors++;
    }
  }
}

if (errors === 0) {
  console.log('\n>>> SUCCESS: ALL JAVASCRIPT AND JSON-LD BLOCKS VALIDATED WITH ZERO ERRORS! <<<');
} else {
  console.error(`\n>>> FAILURE: FOUND ${errors} SYNTAX ERRORS! <<<`);
  process.exit(1);
}

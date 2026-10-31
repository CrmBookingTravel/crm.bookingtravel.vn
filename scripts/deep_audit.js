const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'CRM_Booking.html');
const code = fs.readFileSync(filePath, 'utf-8');

console.log(`--- TOTAL LINES: ${code.split('\n').length} ---`);
console.log(`--- FILE SIZE: ${(code.length / 1024 / 1024).toFixed(2)} MB ---`);

// 1. Phân tích Modals
const modalRegex = /<div\s+[^>]*id=["']([^"']*(?:modal|dialog|popup)[^"']*)["'][^>]*>/gi;
let match;
const modals = new Set();
while ((match = modalRegex.exec(code)) !== null) {
  modals.add(match[1]);
}
console.log(`\n=== MODALS FOUND (${modals.size}) ===`);
Array.from(modals).sort().forEach(m => console.log(' - ' + m));

// 2. Phân tích LocalStorage Keys
const lsRegex = /localStorage\.(?:getItem|setItem|removeItem)\s*\(\s*['"`]([^'"`]+)['"`]/g;
const lsKeys = new Set();
while ((match = lsRegex.exec(code)) !== null) {
  lsKeys.add(match[1]);
}
console.log(`\n=== LOCALSTORAGE KEYS FOUND (${lsKeys.size}) ===`);
Array.from(lsKeys).sort().forEach(k => console.log(' - ' + k));

// 3. Phân tích Các View / Tab
const viewRegex = /function\s+switchView\s*\(([^)]*)\)\s*\{([\s\S]*?)\}/;
const switchViewMatch = code.match(viewRegex);
if (switchViewMatch) {
  console.log(`\n=== SWITCHVIEW FUNCTION FOUND ===`);
  const viewCases = switchViewMatch[2].match(/case\s+['"`]([^'"`]+)['"`]/g) || [];
  console.log('Views:', viewCases.map(c => c.replace(/case\s+['"`]|['"`]/g, '')));
}

// 4. Phân tích Quyền (Roles & Permissions)
const rolesRegex = /currentUser\.role\s*===?\s*['"`]([^'"`]+)['"`]/g;
const rolesFound = new Set();
while ((match = rolesRegex.exec(code)) !== null) {
  rolesFound.add(match[1]);
}
console.log(`\n=== ROLES CHECKED IN CODE (${rolesFound.size}) ===`);
Array.from(rolesFound).sort().forEach(r => console.log(' - ' + r));

// 5. Kiểm tra hàm bị trùng lặp (Duplicate functions)
const funcRegex = /function\s+([a-zA-Z0-9_$]+)\s*\(/g;
const functionCounts = {};
while ((match = funcRegex.exec(code)) !== null) {
  const name = match[1];
  functionCounts[name] = (functionCounts[name] || 0) + 1;
}
const duplicateFunctions = Object.entries(functionCounts).filter(([_, count]) => count > 1);
console.log(`\n=== DUPLICATE FUNCTIONS (${duplicateFunctions.length}) ===`);
duplicateFunctions.forEach(([name, count]) => console.log(` - ${name}: defined ${count} times`));

// 6. Kiểm tra các ID bị trùng lặp trong DOM
const idRegex = /id=["']([a-zA-Z0-9_-]+)["']/g;
const idCounts = {};
while ((match = idRegex.exec(code)) !== null) {
  const id = match[1];
  idCounts[id] = (idCounts[id] || 0) + 1;
}
const duplicateIds = Object.entries(idCounts).filter(([_, count]) => count > 1);
console.log(`\n=== DUPLICATE DOM IDs (${duplicateIds.length}) ===`);
duplicateIds.forEach(([id, count]) => console.log(` - ${id}: appears ${count} times`));

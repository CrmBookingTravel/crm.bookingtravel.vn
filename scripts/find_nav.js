const fs = require('fs');
const content = fs.readFileSync('CRM_Booking.html', 'utf-8');
const lines = content.split('\n');

for (let i = 350; i < 860; i++) {
  const line = lines[i];
  if (line.includes('<header') || line.includes('<nav') || line.includes('<aside') || line.includes('<main') ||
      line.includes('id=') || line.includes('class=') && (line.includes('sidebar') || line.includes('navbar') || line.includes('menu'))) {
    console.log(`${i + 1}: ${line.trim().slice(0, 110)}`);
  }
}

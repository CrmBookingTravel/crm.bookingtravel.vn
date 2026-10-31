const fs = require('fs');
const content = fs.readFileSync('CRM_Booking.html', 'utf-8');
const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('id="app"') || line.includes('id="sidebar"') || line.includes('id="main-content"') || 
      line.includes('id="dashboard"') || line.includes('id="view-') || line.includes('function switchView') ||
      line.includes('renderDashboard') || line.includes('<!-- TOP NAVBAR') || line.includes('<!-- SIDEBAR') ||
      line.includes('<!-- BẢNG') || line.includes('<!-- METRICS') || line.includes('<!-- KPI')) {
    console.log(`${i + 1}: ${line.trim().slice(0, 100)}`);
  }
}

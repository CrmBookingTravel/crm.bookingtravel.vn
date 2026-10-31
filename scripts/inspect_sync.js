const fs = require('fs');
if (fs.existsSync('scripts/sync_all_files.js')) {
  console.log(fs.readFileSync('scripts/sync_all_files.js', 'utf8'));
} else {
  console.log('scripts/sync_all_files.js does not exist');
}

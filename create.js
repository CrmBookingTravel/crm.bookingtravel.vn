const { createNewSheet } = require('./manager-client');

async function main() {
  const name = process.argv.slice(2).join(' ').trim();
  if (!name) {
    console.log('👉 Cách dùng: node create.js "Tên bảng tính mới"');
    return;
  }

  await createNewSheet(name);
}

main();

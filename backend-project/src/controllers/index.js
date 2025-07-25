// Tạo file index.js để kiểm tra tất cả các controller
const fs = require('fs');
const path = require('path');

// Đọc tất cả các file controller
const controllerFiles = fs.readdirSync(__dirname)
  .filter(file => file !== 'index.js' && file.endsWith('.js'));

console.log('=== CONTROLLER FILES DEBUGGING ===');
controllerFiles.forEach(file => {
  console.log(`Checking controller file: ${file}`);
  const controllerContent = fs.readFileSync(path.join(__dirname, file), 'utf8');
  
  // Tìm các URL đầy đủ trong file
  const urlRegex = /(https?:\/\/[^\s'"]+)/g;
  const matches = controllerContent.match(urlRegex);
  
  if (matches) {
    console.log(`Found URLs in ${file}:`, matches);
  }
});
console.log('=== END CONTROLLER FILES DEBUGGING ===');

module.exports = controllerFiles;
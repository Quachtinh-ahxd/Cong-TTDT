// Tạo file index.js để kiểm tra tất cả các route
const fs = require('fs');
const path = require('path');

// Đọc tất cả các file route
const routeFiles = fs.readdirSync(__dirname)
  .filter(file => file !== 'index.js' && file.endsWith('.js'));

console.log('=== ROUTE FILES DEBUGGING ===');
routeFiles.forEach(file => {
  console.log(`Checking route file: ${file}`);
  const routeContent = fs.readFileSync(path.join(__dirname, file), 'utf8');
  
  // Tìm các URL đầy đủ trong file
  const urlRegex = /(https?:\/\/[^\s'"]+)/g;
  const matches = routeContent.match(urlRegex);
  
  if (matches) {
    console.log(`Found URLs in ${file}:`, matches);
  }
});
console.log('=== END ROUTE FILES DEBUGGING ===');

module.exports = routeFiles;